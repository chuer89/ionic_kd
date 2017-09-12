angular.module('workClient.controller', [])


.controller('WorkClientCtrl', function ($scope, $state, $ionicActionSheet, $timeout, seleMenuList, common, workCrmSele) {
	var menus = seleMenuList.menu();

    $scope.data = {
        starId: '',//星级
        keyword: '',
        userId: common.userInfo.clientId,
        totalConsumptionTimesFilterId: '',//消费次数
        totalConsumptionMoneyFilterId: '',//金额
        lastFollowUpTimeFilterId: '',//跟进时间
        lastConsumptionTimeFilterId: ''//消费时间
    }

    $scope.items = [];
    common.clearSetData();

    var dataList = {
        currentPage: 0,
        rows: []
    };

    //搜索--start
    $scope.isSearchVal = false;
    $scope.isSearchTxt = true;
    var showSearch = function() {
        $scope.isSearchVal = true;
        $scope.isSearchTxt = false;

        $timeout(function() {
            $('#js_search').focus().on('keypress', function(e) {
                var _keyCode = e.keyCode;
                if (_keyCode == 13) {
                    //搜索
                    handleSearch();
                    return false;
                }
            })
        }, 200)
    }, cancelSearch = function() {
        clearSearchData();
    }, handleSearch = function() {
        $scope.isSearchVal = false;
        $scope.isSearchTxt = true;

        initData();
    }, clearSearchData = function() {
        $scope.data.keyword = '';
        handleSearch();
    }
    
    $scope.showSearch = showSearch;
    $scope.cancelSearch = cancelSearch;
    $scope.handleSearch = handleSearch;
    //搜索--end

    var ajaxHandle = function(isNotLoading) {
        common.loadingShow();

        var _param = angular.extend({}, $scope.data, {
            page: dataList.currentPage + 1
        });

        common.post({
            type: 'obtain_customers',
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
                    list[i]._star = workCrmSele.joinStar(list[i].star);
                    list[i]._lastConsumptionTime = common.format(list[i].lastConsumptionTime, 'yyyy-MM-dd', true);
                    $scope.items.push(list[i]);
                }

                $timeout(function() {
                    $scope.vm.moredata = true;
                }, 1000);
            }
        });
    }, initData = function(isNotLoading) {
        dataList = {
            currentPage: 0,
            rows: []
        };

        $scope.items = [];

        ajaxHandle(isNotLoading);
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

    initData();

    $scope.seleStar = [];
    $scope.selePeriod = [];
    $scope.seleFrequency = [];
    $scope.seleAmount = [];

    workCrmSele.star(function(star) {
        star.push({
            name: '全部',
            id: '',
            value: ''
        });

        $scope.seleStar = star;
    });
    workCrmSele.total_consumption_times(function(data) {
        var _list = data.body.totalConsumptionTimesFilters;
        _list.push({
            name: '全部', id: ''
        })
        $scope.seleFrequency = _list;
    });
    workCrmSele.last_follow_time_filters(function(data) {
        var _list = data.body.lastFollowUpTimeFilters;
        _list.push({
            name: '全部', id: ''
        })

        $scope.selePeriod = _list;
    });
    workCrmSele.total_consumption_money(function(data) {
        var _list = data.body.totalConsumptionMoneyFilters;
        _list.push({
            name: '全部', id: ''
        })

        $scope.seleAmount = _list;
    })

    $scope.isShowStarSele = false;
    $scope.isShowPeriodSele = false;
    $scope.isShowFrequencySele = false;
    $scope.isShowAmountSele = false;

    $scope.seleStarInfo = '星级';
    $scope.selePeriodInfo = '周期';
    $scope.seleFrequencyInfo = '频次';
    $scope.seleAmountInfo = '金额';

    //选择菜单处理
    var toggleSeleHandle = function(type, isAjax) {
        if (type == 'star') {
            $scope.isShowPeriodSele = false;
            $scope.isShowFrequencySele = false;
            $scope.isShowAmountSele = false;

            $scope.isShowStarSele = !$scope.isShowStarSele;
        } else if (type == 'period') {
            $scope.isShowStarSele = false;
            $scope.isShowFrequencySele = false;
            $scope.isShowAmountSele = false;

            $scope.isShowPeriodSele = !$scope.isShowPeriodSele;
        } else if (type == 'frequency') {
            $scope.isShowStarSele = false;
            $scope.isShowPeriodSele = false;
            $scope.isShowAmountSele = false;

            $scope.isShowFrequencySele = !$scope.isShowFrequencySele;
        } else if(type == 'amount') {
            $scope.isShowStarSele = false;
            $scope.isShowPeriodSele = false;
            $scope.isShowFrequencySele = false;

            $scope.isShowAmountSele = !$scope.isShowAmountSele;
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
    $scope.selePeriodHandle = function(item) {
        $scope.selePeriodInfo = item.name;
        $scope.data.totalConsumptionTimesFilterId = item.id;

        toggleSeleHandle('period', true);
    }
    $scope.seleFrequencyHandle = function(item) {
        $scope.seleFrequencyInfo = item.name;
        $scope.data.lastConsumptionTimeFilterId = item.id;

        toggleSeleHandle('frequency', true);
    }
    $scope.seleAmountHandle = function(item) {
        $scope.seleAmountInfo = item.name;
        $scope.data.totalConsumptionMoneyFilterId = item.id;
        toggleSeleHandle('amount', true);
    }

    $scope.toggleSele = function(type) {
        toggleSeleHandle(type);
    }

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            initData();
        }, 1000)
        return true;
	}
})

.controller('WorkClientDetailsCtrl', function($scope, $ionicActionSheet, $stateParams, $state, common, workCrmSele) {
    $scope.activeTab = '0';

    $scope.isShowTab0 = true;
    $scope.isShowTab1 = false;

    $scope.item = {};

    var navMenus = [];

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
            type: 'obtain_customer',
            data: {
                id: $stateParams.id,
                userId: common.userInfo.clientId
            },
            notPretreatment: true,
            success: function(data) {
                var _body = data.body;

                if (!_body) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                if (_body.creater.id == common.userInfo.clientId || true) {
                    navMenus = [
                        { text: '编辑' },
                        { text: '删除' }
                    ]
                }

                console.log(data)

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

                    list[i]._content = common.replaceNext(list[i].content);
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

                item._content = common.replaceNext(item.content);

                item.isEdit = false;
            }
        });
    }

    
    $scope.showNav = function() {
        if (!navMenus.length) {
            common.toast(common.noAuthLimitsTxt);
            return;
        }
        common.addTopRightMenus({
            buttons: navMenus,
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
                            $state.go('work_client_edit', {
                                id: $stateParams.id
                            });
                        }
                    });
                } else if (index == 1) {
                    common.popup({
                        content: '确认删除么'
                    }, function() {
                        common.post({
                            type: 'delete_customer',
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

    //消费记录
    var createConsumption = function() {
        common.post({
            type: 'create_consumption_record',
            data: {
                name: '真累是消费记录',
                price: '2000',
                discount: '8',
                settlementPrice: '1900',
                consumptionModeId: '1',
                createrId: common.userInfo.clientId,
                customerId: $stateParams.id
            },
            success: function(data) {
                console.log(data);
            }
        });
    }
    // createConsumption();

})

//创建
.controller('WorkClientCreateCtrl', function($scope, $ionicActionSheet, common, workCrmSele) {
    $scope.data = {
        createrId: common.userInfo.clientId,
        customerTypeId: ''
        // starId: ''
    }

    $scope.seleType = '请选择';
    workCrmSele.customer_types(function(data) {
        $scope.showSeleType = function () {
            $ionicActionSheet.show({
                buttons: common.setSeleRepeat(data.body.customerTypes),
                cancelText: '取消',
                buttonClicked: function(index, item) {
                    $scope.seleType = item.text;
                    $scope.data.customerTypeId = item.id;

                    return true;
                }
            })
        }
    });

    $scope.clearBack = common.clearBack;

    $scope.create = function() {
        if (!$scope.data.name || !$scope.data.telephone) {
            common.toast('请输入必填信息');
            return;
        }

        common.loadingShow();

        common.post({
            type: 'create_customer',
            data: $scope.data,
            success: function(data) {
                common.loadingHide();

                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }
})

.controller('WorkClientEditCtrl', function($scope, $ionicActionSheet, $stateParams, common, workCrmSele) {
    $scope.data = {
        createrId: common.userInfo.clientId,
        customerTypeId: '',
        starId: ''
    }

    common.loadingShow();
    common.post({
        type: 'obtain_customer_form',
        data: {
            id: $stateParams.id,
            userId: common.userInfo.clientId
        },
        success: function(data) {
            common.loadingHide();
            angular.extend($scope.data, data.body);

            $scope.seleType = data.body.customerTypeName;
            $scope.seleStar = workCrmSele.joinStar({value: data.body.starValue});
        }
    });

    $scope.seleType = '请选择';
    workCrmSele.customer_types(function(data) {
        $scope.showSeleType = function () {
            $ionicActionSheet.show({
                buttons: common.setSeleRepeat(data.body.customerTypes),
                cancelText: '取消',
                buttonClicked: function(index, item) {
                    $scope.seleType = item.text;
                    $scope.data.customerTypeId = item.id;

                    return true;
                }
            })
        }
    });

    $scope.seleStar = '请选择';
    workCrmSele.star(function(data) {
        $scope.showSeleStar = function () {
            $ionicActionSheet.show({
                buttons: common.setSeleRepeat(data),
                cancelText: '取消',
                buttonClicked: function(index, item) {
                    $scope.seleStar = item.text;
                    $scope.data.starId = item.id;

                    return true;
                }
            })
        }
    });

    $scope.submit = function() {
        common.loadingShow();

        common.post({
            type: 'update_customer',
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
})

