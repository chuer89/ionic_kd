angular.module('workOnDuty.controller', [])

.controller('WorkOnDutyCtrl', function ($scope, $state, $ionicActionSheet, common) {
    $scope.items = [];
    $scope.scheduleID = '';

	COMMON.post({
        type: 'zhiban_list',
        data: {
            "userId": common.userInfo.clientId,
            "date": '2017-07-12'
        },
        success: function(data) {
            var _body = data.body;

            $scope.items = _body.data;
            $scope.scheduleID = _body.scheduleID;
        }
    });    
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
.controller('WorkOnDutyQueryCtrl', function($scope, common) {
    $scope.items = [];

    var brandID = '',
        deptID = '';

    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
    };

    var searchAjax = function () {
        COMMON.post({
            type: 'zhiban_listsearch',
            data: {
                endDate: '2017-07-13',
                startDate: '2017-01-01',
                brandID: brandID,
                deptID: deptID
            },
            success: function(data) {
                var _body = data.body;

                $scope.items = _body;
            }
        });
    }, initData = function() {
        $scope.items = [];

        searchAjax();
    }

    initData();

    //选择部门-start
    $scope.seleBrank = [];
    $scope.seleDepartment = [];

    $scope.seleBrankInfo = '品牌';
    $scope.seleDepartmentInfo = '部门';

    $scope.isShowBrankSele = false;
    $scope.isShowDepartmentSele = false;

    //选择菜单处理
    var toggleSeleHandle = function(type, isAjax) {
        if (type == 'brank') {
            $scope.isShowDepartmentSele = false;

            $scope.isShowBrankSele = !$scope.isShowBrankSele;
        } else if (type == 'department') {
            $scope.isShowBrankSele = false;

            if (!$scope.seleDepartment.length) {
                common.toast('请选择正确品牌');
                return;
            }

            $scope.isShowDepartmentSele = !$scope.isShowDepartmentSele;
        }

        if (isAjax) {
            initData();
        }
    }

    //加载部门&公司
    common.getCompany(function(data) {
        $scope.seleBrank = data;
    })

    //选择部门
    $scope.seleBrankHandle = function(item) {
        brandID = item.departmentId;

        $scope.seleBrankInfo = item.name;
        $scope.seleDepartmentInfo = '部门';

        $scope.seleDepartment = item.childDepartment;

        toggleSeleHandle('brank', true);
    }
    $scope.seleDepartmentHandle = function(item) {
        deptID = item.departmentId;
        $scope.seleDepartmentInfo = item.name;

        toggleSeleHandle('department', true);
    }

    //筛选切换
    $scope.toggleSele = function(type) {
        toggleSeleHandle(type);
    }
    //选择部门-end
})

.controller('WorkOnDutyDetailsCtrl', function($scope, $stateParams, common) {
    $scope.data = {};

    //获取
    COMMON.post({
        type: 'zhiban_detail',
        data: {
            id: $stateParams.id
        },
        success: function(data) {
            var _body = data.body;

            $scope.data = _body;
        }
    });
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
            data: $scope.items,
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
