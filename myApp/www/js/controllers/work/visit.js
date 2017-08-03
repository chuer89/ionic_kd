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
                    list[i]._visitTime = common.format(list[i].visitTime, 'yyyy-MM-dd', true);
                    list[i]._lastFollowUpTime = common.format(list[i].customer.lastFollowUpTime, 'yyyy-MM-dd', true);
                    list[i]._lastConsumptionTime = common.format(list[i].customer.lastConsumptionTime, 'yyyy-MM-dd', true);
                    $scope.items.push(list[i]);
                }

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

.controller('WorkVisitDetailsCtrl', function($scope, $state, $stateParams, $ionicActionSheet, common, workCrmSele) {
    $scope.item = {};

    common._localstorage.typePageName = '';

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

                if (!_body) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                _body._consumptionRecords = [];
                if (!_body.customer.consumptionRecords) {
                    _body.customer.consumptionRecords = [];
                }

                for (var i = 0, ii = _body.customer.consumptionRecords.length; i < ii; i++) {
                    _body.customer.consumptionRecords[i].nickname = common.nickname(_body.customer.consumptionRecords[i].creater.name);

                    _body.customer.consumptionRecords[i]._consumptionTime = common.format(_body.customer.consumptionRecords[i].consumptionTime, 'yyyy-MM-dd', true);
                    _body._consumptionRecords.push(_body.customer.consumptionRecords);
                }

                _body._lastConsumptionTime = common.format(_body.lastConsumptionTime, 'yyyy-MM-dd HH:ss', true);

                $scope.item = _body;
            }
        });
    }

    getDetails();

    $scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [
                { text: '编辑' },
                { text: '删除' }
            ],
            cancelText: '取消',
            buttonClicked: function(index, item) {

                if (index == 0) {
                    common.post({
                        type: 'obtain_visit_record_form',
                        data: {
                            id: $stateParams.id,
                            userId: common.userInfo.clientId
                        },
                        success: function(data) {
                            $state.go('work_visit_edit', {
                                id: $stateParams.id
                            });
                        }
                    });
                } else if (index == 1) {
                    common.popup({
                        content: '确认删除么'
                    }, function() {
                        common.post({
                            type: 'delete_visit_record',
                            data: {
                                id: $stateParams.id,
                                userId: common.userInfo.clientId
                            },
                            success: function(data) {
                                common.toast(data.message, function() {
                                    common.back();
                                })
                            }
                        });
                    })
                }

                return true;
            }
        })
    }
})

.controller('WorkVisitEditCtrl', function($scope, $ionicActionSheet, $stateParams, common, workCrmSele) {
    $scope.data = {
        createrId: common.userInfo.clientId,
        customerId: '',
        clientIdSele: {name: '请选择'},
        seleVisitType: '请选择',
        typePageName: 'WorkVisitEditCtrl',
        visitRecord: ''
    }

    var getDetails = function() {
        common.loadingShow();
        common.post({
            type: 'obtain_visit_record_form',
            data: {
                id: $stateParams.id,
                userId: common.userInfo.clientId
            },
            success: function(data) {
                common.loadingHide();
                var _body = data.body;

                angular.extend($scope.data, {
                    seleVisitType: _body.visitTypeName,
                    clientIdSele: {
                        name: _body.customerName,
                        id: _body.customerId
                    },
                    visitRecord: _body.visitRecord
                });

                $scope.seleVisitType = data.body.visitTypeName;
            }
        });
    }

    workCrmSele.visit_types(function(data) {
        $scope.showSeleVisitType = function () {
            $ionicActionSheet.show({
                buttons: common.setSeleRepeat(data.body.visitTypes),
                cancelText: '取消',
                buttonClicked: function(index, item) {
                    $scope.data.seleVisitType = item.text;
                    $scope.data.visitTypeId = item.id;

                    return true;
                }
            })
        }
    });

    $scope.submit = function() {
        common.loadingShow();
        $scope.data.customerId = $scope.data.clientIdSele.id;

        common.post({
            type: 'update_visit_record',
            data: $scope.data,
            success: function(data) {
                common.loadingHide();

                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }

    if (common.setAuditorUserList.id) {
        if (common.setAuditorUserList._targetName == 'work_visit_edit') {
            common._localstorage.clientIdSele = common.setAuditorUserList;
        }
    }

    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
        getDetails();
    }
})

.controller('WorkVisitCreateCtrl', function($scope, $state, $ionicActionSheet, common, workCrmSele) {
    $scope.data = {
        typePageName: 'WorkVisitCreateCtrl',
        createrId: common.userInfo.clientId,
        customerId: '',
        clientIdSele: {name: '请选择'},
        seleVisitType: '请选择'
    }

    workCrmSele.visit_types(function(data) {
        $scope.showSeleVisitType = function () {
            $ionicActionSheet.show({
                buttons: common.setSeleRepeat(data.body.visitTypes),
                cancelText: '取消',
                buttonClicked: function(index, item) {
                    $scope.data.seleVisitType = item.text;
                    $scope.data.visitTypeId = item.id;

                    return true;
                }
            })
        }
    });

    $scope.create = function() {
        common.loadingShow();
        $scope.data.customerId = $scope.data.clientIdSele.id;

        common.post({
            type: 'create_visit_record',
            data: $scope.data,
            success: function(data) {
                common.loadingHide();

                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }

    if (common.setAuditorUserList.id) {
        if (common.setAuditorUserList._targetName == 'work_visit_create') {
            common._localstorage.clientIdSele = common.setAuditorUserList;
        }
    }

    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
    }
})

