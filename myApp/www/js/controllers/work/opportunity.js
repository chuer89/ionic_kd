angular.module('workOpportunity.controller', [])

.controller('WorkOpportunityCtrl', function ($scope, $state, $timeout, $ionicActionSheet, common, workCrmSele) {
    $scope.data = {
        starId: '',//星级
        keyword: '',
        salesPhaseId: '',
        lastFollowUpTimeFilterId: '',
        lastConsumptionTimeFilterId: ''
    }

    common.clearSetData();

    $scope.items = [];

    var dataList = {
        currentPage: 0,
        rows: []
    };

    var ajaxHandle = function(isNotLoading, opt) {
        if (isNotLoading) {
            common.loadingShow();
        }

        opt = opt || {
            orderByLastFollowUpTimeDesc: true
        }

        var _param = angular.extend({}, $scope.data, {
            page: dataList.currentPage + 1
        }, opt);

        common.post({
            type: 'obtain_business_opportunities',
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
    $scope.selePhases = [];

    workCrmSele.star(function(star) {
        star.push({
            name: '全部',
            id: '',
            value: ''
        });

        $scope.seleStar = star;
    });
    workCrmSele.salesPhases(function(data) {
        var _list = data.body.salesPhases;
        _list.push({
            name: '全部', id: ''
        })
        $scope.selePhases = _list;
    });

    $scope.isShowStarSele = false;
    $scope.isShowPhasesSele = false;

    $scope.seleStarInfo = '星级';
    $scope.selePhasesInfo = '销售阶段';

    //选择菜单处理
    var toggleSeleHandle = function(type, isAjax) {
        if (type == 'star') {
            $scope.isShowPhasesSele = false;

            $scope.isShowStarSele = !$scope.isShowStarSele;
        } else if (type == 'phases') {
            $scope.isShowStarSele = false;

            $scope.isShowPhasesSele = !$scope.isShowPhasesSele;
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
    $scope.selePhasesHandle = function(item) {
        $scope.selePhasesInfo = item.name;
        $scope.data.salesPhaseId = item.id;

        toggleSeleHandle('phases', true);
    }

    $scope.toggleSele = function(type) {
        toggleSeleHandle(type)
    }

    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
    }


    $scope.activeTab = '0';

    $scope.isShowTab0 = true;
    $scope.isShowTab1 = false;
    $scope.isShowTab2 = false;

    $scope.checkTab = function(index) {
        $scope.activeTab = index;
        if (index == '0') {
            $scope.isShowTab1 = false;
            $scope.isShowTab2 = false;
            $scope.isShowTab0 = true;
            initData(true)
        } else if (index == '1') {
            $scope.isShowTab0 = false;
            $scope.isShowTab2 = false;
            $scope.isShowTab1 = true;
            initData(true, {
                orderByLastConsumptionTimeAsc: true
            })
        } else {
            $scope.isShowTab0 = false;
            $scope.isShowTab1 = false;
            $scope.isShowTab2 = true;
            initData(true, {
                orderByLastConsumptionTimeAsc: true
            })
        }
    }
})

.controller('WorkOpportunityDetailsCtrl', function($scope, $ionicActionSheet, $stateParams, $state, common, workCrmSele) {
    $scope.activeTab = '0';

    $scope.isShowTab0 = true;
    $scope.isShowTab1 = false;

    common.clearSetData();

    $scope.item = {};

    $scope.checkTab = function(index) {
        $scope.activeTab = index;
        if (index == '0') {
            $scope.isShowTab1 = false;
            $scope.isShowTab0 = true;
        } else {
            $scope.isShowTab0 = false;
            $scope.isShowTab1 = true;
        }
    };

    $scope.followItems = [];
    $scope.consumptionItems = [];

    var getDetails = function() {
        common.loadingShow();

        common.post({
            type: 'obtain_business_opportunity',
            data: {
                id: $stateParams.id
            },
            notPretreatment: true,
            success: function(data) {
                var _body = data.body;

                console.log(data)

                if (!_body) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                getFollowList();
                getConsumptionList();

                _body._lastConsumptionTime = common.format(_body.lastConsumptionTime, 'yyyy-MM-dd HH:ss', true);

                $scope.item = _body;
            }
        });
    }, getFollowList = function() {
        common.post({
            type: 'obtain_follow_up_records',
            data: {
                customerId: $stateParams.id,
                userId: common.userInfo.clientId,
                page: 1
            },
            notPretreatment: true,
            success: function(data) {
                common.loadingHide();

                var _body = data.body;

                if (!_body || (_body && !_body.rows) || (_body && _body.rows && !_body.rows.length)) {
                    $scope.notFollowListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notFollowListData = false;
                }

                var list = _body.rows;
                
                for (var i = 0, ii = list.length; i < ii; i++) {
                    list[i].nickname = common.nickname(list[i].creater.name);
                    list[i]._followUpTime = common.format(list[i].followUpTime, 'yyyy-MM-dd HH:ss', true);
                }

                $scope.followItems = list;
            }
        });
    }, getConsumptionList = function() {
        common.post({
            type: 'obtain_consumption_records',
            data: {
                customerId: $stateParams.id,
                page: 1
            },
            notPretreatment: true,
            success: function(data) {
                var _body = data.body;

                if (!_body || (_body && !_body.rows) || (_body && _body.rows && !_body.rows.length)) {
                    $scope.notConsumptionListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notConsumptionListData = false;
                }

                var list = _body.rows;
                
                for (var i = 0, ii = list.length; i < ii; i++) {
                    list[i].nickname = common.nickname(list[i].creater.name);
                    list[i]._consumptionTime = common.format(list[i].consumptionTime, 'yyyy-MM-dd HH:ss', true);
                }

                $scope.consumptionItems = list;
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
        $scope.followData.content = '';
    }
    $scope.createFollow = function() {
        common.loadingShow();
        common.post({
            type: 'create_follow_up_record',
            data: $scope.followData,
            success: function(data) {
                common.loadingHide();

                getFollowList();

                $scope.isHasAddFollow = false;
            }
        });
    }
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
            type: 'update_follow_up_record',
            data: {
                createrId: common.userInfo.clientId,
                customerId: $stateParams.id,
                id: item.id,
                content: item.content
            },
            success: function(data) {
                common.loadingHide();

                item.isEdit = false;
            }
        });
    }

    $scope.showNav = function() {
        common.addTopRightMenus({
            buttons: [
                { text: '编辑' },
                { text: '删除' }
            ],
            cancelText: '取消',
            buttonClicked: function(index, item) {

                if (index == 0) {
                    common.post({
                        type: 'obtain_customer_form',
                        data: {
                            id: $stateParams.id,
                            userId: common.userInfo.clientId
                        },
                        success: function(data) {
                            $state.go('work_opportunity_edit', {
                                id: $stateParams.id
                            });
                        }
                    });
                } else if (index == 1) {
                    common.popup({
                        content: '确认删除么'
                    }, function() {
                        common.post({
                            type: 'delete_business_opportunity',
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

.controller('WorkOpportunityCreateCtrl', function($scope, $state, $ionicActionSheet, common, workCrmSele) {
    $scope.data = {
        createrId: common.userInfo.clientId,
        customerId: '',
        typePageName: 'WorkOpportunityCreateCtrl',
        seleMarket: '请选择',
        clientIdSele: {name: '请选择'}
    }

    workCrmSele.salesPhases(function(data) {
        $scope.showSeleMarket = function () {
            $ionicActionSheet.show({
                buttons: common.setSeleRepeat(data.body.salesPhases),
                cancelText: '取消',
                buttonClicked: function(index, item) {
                    $scope.data.seleMarket = item.text;
                    $scope.data.salesPhaseId = item.id;

                    return true;
                }
            })
        }
    });

    $scope.clearBack = common.clearBack;

    $scope.create = function() {

        if (!$scope.data.name) {
            common.toast('请输入必填信息');
            return;
        }

        common.loadingShow();
        $scope.data.customerId = $scope.data.clientIdSele.id;

        common.post({
            type: 'create_business_opportunity',
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
        if (common.setAuditorUserList._targetName == 'work_opportunity_create') {
            common._localstorage.clientIdSele = common.setAuditorUserList;
        }
    }

    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
    }
})

.controller('WorkOpportunityEditCtrl', function($scope, $ionicActionSheet, $stateParams, common, workCrmSele) {
    $scope.data = {
        createrId: common.userInfo.clientId,
        customerTypeId: '',
        starId: '',
        customerId: '',
        clientIdSele: {name: '请选择'},
        seleMarket: '请选择',
        salesPhaseId: '',
        typePageName: 'WorkOpportunityEditCtrl',
        name: '',
        content: ''
    }

    var getDetails = function() {
        common.loadingShow();
        common.post({
            type: 'obtain_business_opportunity_form',
            data: {
                id: $stateParams.id,
                userId: common.userInfo.clientId
            },
            success: function(data) {
                common.loadingHide();

                var _body = data.body;

                angular.extend($scope.data, {
                    seleMarket: _body.salesPhaseName,
                    clientIdSele: {
                        name: _body.customerName,
                        id: _body.customerId
                    },
                    name: _body.name,
                    content: _body.content
                });

                $scope.seleType = data.body.customerTypeName;
            }
        });
    }

    workCrmSele.salesPhases(function(data) {
        $scope.showSeleMarket = function () {
            $ionicActionSheet.show({
                buttons: common.setSeleRepeat(data.body.salesPhases),
                cancelText: '取消',
                buttonClicked: function(index, item) {
                    $scope.data.seleMarket = item.text;
                    $scope.data.salesPhaseId = item.id;

                    return true;
                }
            })
        }
    });

    $scope.submit = function() {
        common.loadingShow();
        $scope.data.customerId = $scope.data.clientIdSele.id;

        common.post({
            type: 'update_business_opportunity',
            data: $scope.data,
            notPretreatment: true,
            success: function(data) {
                common.loadingHide();

                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }

    if (common.setAuditorUserList.id) {
        if (common.setAuditorUserList._targetName == 'work_opportunity_edit') {
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


