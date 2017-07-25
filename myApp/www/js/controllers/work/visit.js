angular.module('workVisit.controller', [])

.controller('WorkVisitCtrl', function ($scope, $state, $ionicActionSheet, $timeout, common, workCrmSele) {
    $scope.data = {

    };

    $scope.items = [];

    var dataList = {
        currentPage: 0,
        rows: []
    };

    var ajaxHandle = function(isNotLoading, opt) {
        if (isNotLoading) {
            common.loadingShow();
        }

        var _param = angular.extend({}, $scope.data, {
            page: dataList.currentPage + 1
        }, opt);

        common.post({
            type: 'obtain_visit_records',
            data: _param,
            notPretreatment: true,
            success: function(data) {
                common.loadingHide();
                var _body = data.body;

                if (!_body || (_body && !_body.rows) || (_body && _body.rows && !_body.rows.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                dataList = _body;

                var list = _body.rows;
                
                for (var i = 0, ii = list.length; i < ii; i++) {
                    list[i]._star = workCrmSele.joinStar(list[i].customer.star);
                    list[i]._lastFollowUpTime = common.format(list[i].customer.lastFollowUpTime, 'yyyy-MM-dd', true);
                    list[i]._lastConsumptionTime = common.format(list[i].customer.lastConsumptionTime, 'yyyy-MM-dd', true);
                    $scope.items.push(list[i]);
                }

                console.log(list)

                $timeout(function() {
                    $scope.vm.moredata = true;
                }, 1000);
            }
        });
    }, initData = function(isNotLoading, opt) {
        dataList = {
            currentPage: 0,
            rows: []
        };

        $scope.items = [];

        ajaxHandle(isNotLoading, opt);
    }

    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.rows.length < common._pageSize || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
                $scope.vm.moredata = false;
                return;
            }

            $timeout(function () {
                $scope.vm.moredata = false;
                handleAjax(true);
            }, 1500);
            return true;
        }
    }

    initData(true);

    $scope.seleStar = [];
    $scope.seleTypes = [];
    $scope.seleTime = [];

    workCrmSele.star(function(star) {
        star.push({
            name: '全部',
            id: '',
            value: ''
        });

        $scope.seleStar = star;
    });

    workCrmSele.visit_types(function(data) {
        var _list = data.body.visitTypes;
        _list.push({
            name: '全部', id: ''
        });
        $scope.seleTypes = _list;
    });

    workCrmSele.visit_time(function(data) {
        var _list = data.body.visitTimeFilters;
        _list.push({
            name: '全部', id: ''
        });
        $scope.seleTime = _list;
    })

    $scope.isShowStarSele = false;
    $scope.isShowTypesSele = false;
    $scope.isShowTimeSele = false;

    var toggleSeleHandle = function(type, isAjax) {
        if (type == 'star') {
            $scope.isShowTypesSele = false;
            $scope.isShowTimeSele = false;

            $scope.isShowStarSele = !$scope.isShowStarSele;
        } else if( type == 'types' ) {
            $scope.isShowStarSele = false;
            $scope.isShowTimeSele = false;

            $scope.isShowTypesSele = !$scope.isShowTypesSele;
        } else if (type == 'time') {
            $scope.isShowStarSele = false;
            $scope.isShowTypesSele = false;

            $scope.isShowTimeSele = !$scope.isShowTimeSele;
        }

        if (isAjax) {
            initData(true);
        }
    }

    $scope.seleStarHandle = function(item) {
        $scope.seleStarInfo = item.name;
        $scope.data.starId = item.value;

        toggleSeleHandle('star', true);
    }
    $scope.seleTimeHandle = function(item) {
        $scope.seleTimeInfo = item.name;
        $scope.data.visitTimeFilterId = item.id;

        toggleSeleHandle('time', true);
    }
    $scope.seleTypesHandle = function(item) {
        $scope.seleTypesInfo = item.name;
        $scope.data.visitTypeId = item.id;

        toggleSeleHandle('types', true);
    }

    $scope.toggleSele = function(type) {
        toggleSeleHandle(type);
    }

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
	}
})

.controller('WorkVisitDetailsCtrl', function($scope, $stateParams, $ionicActionSheet, common, workCrmSele) {
    $scope.item = {};

    var getDetails = function() {
        common.loadingShow();

        common.post({
            type: 'obtain_visit_record',
            data: {
                id: $stateParams.id
            },
            notPretreatment: true,
            success: function(data) {
                var _body = data.body;
                common.loadingHide();

                console.log(data)

                if (!_body) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                _body._lastConsumptionTime = common.format(_body.lastConsumptionTime, 'yyyy-MM-dd HH:ss', true);

                $scope.item = _body;
            }
        });
    }

    getDetails();

    //添加跟进记录
    $scope.followData = {
        createrId: common.userInfo.clientId,
        customerId: $stateParams.id
    };
    $scope.isHasAddFollow = false;
    $scope.showAddFollow = function() {
        $scope.isHasAddFollow = true;
        $scope.followData.visitRecord = '';
    }
    $scope.createFollow = function() {
        common.loadingShow();
        common.post({
            type: 'create_visit_record',
            data: $scope.followData,
            success: function(data) {
                common.loadingHide();

                $scope.isHasAddFollow = false;
            }
        });
    }

    $scope.seleVisitType = '请选择';
    workCrmSele.visit_types(function(data) {
        $scope.showSeleMarket = function () {
            $ionicActionSheet.show({
                buttons: common.setSeleRepeat(data.body.visitTypes),
                cancelText: '取消',
                buttonClicked: function(index, item) {
                    $scope.seleVisitType = item.text;
                    $scope.followData.visitTypeId = item.id;

                    return true;
                }
            })
        }
    });

    //编辑跟进
    $scope.editFollow = function(item) {
        common.loadingShow();
        common.post({
            type: 'obtain_follow_up_record_form',
            data: {
                userId: common.userInfo.clientId,
                id: item.id
            },
            success: function(data) {
                common.loadingHide();

                item.isEdit = true;
            }
        });
    }
    $scope.updateFollow = function(item) {
        common.loadingShow();
        common.post({
            type: 'create_visit_record',
            data: {
                createrId: common.userInfo.clientId,
                customerId: $stateParams.id,
                visitRecord: item.id,
                visitRecord: item.visitRecord
            },
            success: function(data) {
                common.loadingHide();

                item.isEdit = false;
            }
        });
    }
})