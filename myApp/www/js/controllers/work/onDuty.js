angular.module('workOnDuty.controller', [])

.controller('WorkOnDutyCtrl', function ($scope, $state, $ionicActionSheet, common) {
    $scope.items = [];
    $scope.scheduleID = '';

    $scope.data = {
        date: common.format(false, 'yyyy-MM-dd'),
        userId: common.userInfo.clientId
        // date: '2017-07-31',
        // userId: 27
    };

    $scope.seleDate = function() {
        common.datePicker(function(date) {
            $scope.data.date = date;

            $scope.items = [];
            $scope.scheduleID = '';

            getAjax();
        });
    }

	var getAjax = function() {
        common.loadingShow();
        COMMON.post({
            type: 'zhiban_list',
            data: $scope.data,
            notPretreatment: true,
            success: function(data) {
                var _body = data.body;
                common.loadingHide();

                if (!_body) {
                    $scope.notTaskListData = data.message;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                $scope.items = _body.data;
                $scope.scheduleID = _body.scheduleID;
            }
        }); 
    };

    getAjax();
})

//设定
.controller('WorkOnDutySettingCtrl', function($scope, $stateParams, common) {
    $scope.data = {
        scheduleID: $stateParams.id
    };

    //获取
    COMMON.post({
        type: 'zhiban_taget_get',
        data: {
            scheduleID: $stateParams.id
        },
        success: function(data) {
            var _body = data.body;

            if (_body) {
                $scope.data = _body;    
            }
        }
    });

    //提交
    $scope.sub = function() {
        COMMON.post({
            type: 'zhiban_taget_add',
            data: $scope.data,
            success: function(data) {
                var _body = data.body;

                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }
})

//值班查询
.controller('WorkOnDutyQueryCtrl', function($scope, $timeout, common, seleMenuList) {
    $scope.items = [];

    var dataList = {
        currentPage: 0,
        items: []
    };

    var month= common.format(false, 'MM'),
        year= common.format(false, 'yyyy');

    var brandID = '',
        deptID = '';

    var dataList = {};

    var menus = seleMenuList.menu();

    $scope.data = {
        endDate: common.format(false, 'yyyy-MM') + '-' + common.getLastDay(year, month),
        startDate: common.format(false, 'yyyy-MM')+'-01'
    }

    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            initData(true)
        }, 1000)
        return true;
    };

    var searchAjax = function (isNotLoading) {
        if (isNotLoading) {
            common.loadingShow();
        }

        angular.extend($scope.data, {
            brandID: brandID,
            deptID: deptID,
            page: dataList.currentPage + 1
        });

        COMMON.post({
            type: 'zhiban_listsearch',
            data: $scope.data,
            notPretreatment: true,
            success: function(data) {
                common.loadingHide();

                var _body = data.body;

                if (!_body || (_body && _body.items && !_body.items.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                var list = _body.items;

                dataList = _body;

                for (var i = 0, ii = list.length; i < ii; i++) {
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
            items: []
        };

        $scope.items = [];

        searchAjax(isNotLoading);
    }

    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.items.length < common._pageSize || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
                $scope.vm.moredata = false;
                return;
            }

            $timeout(function () {
                $scope.vm.moredata = false;
                searchAjax();
            }, 1500);
            return true;
        }
    }

    //选择部门-start
    var seleDepartmentId = '';

    $scope.seleBrank = [];
    $scope.seleDepartment = [];
    $scope.seleDate = menus.seleMonth;

    $scope.seleBrankInfo = '品牌';
    $scope.seleDepartmentInfo = '部门';
    $scope.seleDateInfo = common.format(false, 'yyyy-MM');

    $scope.isShowBrankSele = false;
    $scope.isShowDepartmentSele = false;
    $scope.isShowDateSele = false;

    //选择菜单处理
    var toggleSeleHandle = function(type, isAjax) {
        if (type == 'brank') {
            $scope.isShowDepartmentSele = false;
            $scope.isShowDateSele = false;

            $scope.isShowBrankSele = !$scope.isShowBrankSele;
        } else if (type == 'department') {
            $scope.isShowBrankSele = false;
            $scope.isShowDateSele = false;

            if (!$scope.seleDepartment.length) {
                common.toast('请选择正确品牌');
                return;
            }

            $scope.isShowDepartmentSele = !$scope.isShowDepartmentSele;
        } else if (type == 'date') {
            $scope.isShowBrankSele = false;
            $scope.isShowDepartmentSele = false;

            $scope.isShowDateSele = !$scope.isShowDateSele;
        }

        if (isAjax) {
            initData(true);
        }
    }

    //选择部门
    var _seleBrankHandle = function(item) {
        seleDepartmentId = item.departmentId;
        brandID = item.departmentId;
        deptID = '';

        $scope.seleBrankInfo = item.name;
        $scope.seleDepartmentInfo = '部门';

        $scope.seleDepartment = item.childDepartment;
    }
    
    $scope.seleBrankHandle = function(item) {
        _seleBrankHandle(item);

        toggleSeleHandle('brank', true);
    }
    $scope.seleDepartmentHandle = function(item) {
        seleDepartmentId = item.departmentId;
        deptID = item.departmentId;

        $scope.seleDepartmentInfo = item.name;

        toggleSeleHandle('department', true);
    }

    $scope.seleDateHandle = function(item) {
        var date = {};

        if (item.key == 'prev') {
            date = common.getPrevDate($scope.seleDateInfo)
        } else if (item.key == 'next') {
            date = common.getNextDate($scope.seleDateInfo)
        } else {
            date = common.getNowDate();
        }

        $scope.data.startDate = date.date + '-01';
        $scope.data.endDate = date.date + '-' + date.day;

        $scope.seleDateInfo = date.date;

        toggleSeleHandle('date', true);
    }

    //筛选切换
    $scope.toggleSele = function(type) {
        toggleSeleHandle(type);
    }

    //加载部门&公司
    common.getCompany(function(data) {
        $scope.seleBrank = data;

        _seleBrankHandle(data[0]);
        initData();
    });
})

//指标详情
.controller('WorkOnDutyDetailsCtrl', function($scope, $stateParams, common) {
    $scope.data = {};

    var urlId = $stateParams.id,
        id = $stateParams.id;

    var handleNext = function(obj) {
        for (var k in obj) {
            obj[k] = common.replaceNext(obj[k]);
        }
        return obj;
    }

    if (urlId.indexOf('_push_') > 0) {
        id = urlId.split('_push_')[1];

        common.getMessageDetails(urlId, 'PAIBAN', function(data) {
            var _body = data.body;
            _body = handleNext(_body);

            $scope.data = _body;
        });
    } else {
        //获取
        common.loadingShow();
        COMMON.post({
            type: 'zhiban_detail',
            data: {
                id: id
            },
            success: function(data) {
                common.loadingHide();
                var _body = data.body;
                _body = handleNext(_body);
                
                $scope.data = _body;
            }
        });
    }
})

//检查
.controller('WorkOnDutyCheckCtrl', function($scope, $stateParams, common) {
    var _pid = $stateParams.id.split('_');

    var checkID = _pid[1],
        scheduleID = _pid[0];

    $scope.items = [];

    COMMON.post({
        type: 'zhiban_check',
        data: {
            checkID: checkID,
            scheduleID: scheduleID
        },
        success: function(data) {
            var _body = data.body;
            for (var i = 0, ii = _body.length; i < ii; i++) {
                if (_body[i].checkStatus == 1) {
                    _body[i].checked1 = true;
                } else if (_body[i].checkStatus == 2) {
                    _body[i].checked2 = true;
                }
            }

            $scope.items = _body;
        }
    });

    $scope.clickRadio = function (item, status) {
        //checkStatus
        var _list = $scope.items;
        for (var i = 0, ii = _list.length; i < ii; i++) {
            if (item.id == _list[i].id) {
                _list[i].checkStatus = status;
            }
        }
    }

    $scope.sub = function () {
        COMMON.post({
            type: 'zhiban_check_submit',
            data: {
                items: $scope.items,
                checkID: checkID
            },
            success: function(data) {
                var _body = data.body;

                common.toast(data.message, function() {
                    common.back();
                })
            }
        });
    }
})

//跟进
.controller('WorkOnDutyFollowCtrl', function($scope, $stateParams, common) {
    $scope.data = {
        scheduleID: $stateParams.id
    };

    //获取
    COMMON.post({
        type: 'zhiban_taget_get',
        data: {
            scheduleID: $stateParams.id
        },
        success: function(data) {
            var _body = data.body;

            if (_body) {
                $scope.data = _body;    
            }
        }
    });

    //提交
    $scope.sub = function() {
        COMMON.post({
            type: 'zhiban_taget_result',
            data: $scope.data,
            success: function(data) {
                var _body = data.body;

                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }
})
