angular.module('workReport.controller', [])

//日报申请
.controller('WorkReportAddDailyCtrl', function($scope, common) {
    $scope.showSelePhoto = function() {
        common.showSelePhoto();
    }

    $scope.data = {};

    var ajaxhandle = function() {
        COMMON.post({
            type: 'create_report',
            data: {
                "userId": common.userInfo.clientId,
                content: $scope.data.content,
                typeId: 1
            },
            success: function(data) {
                console.log(data);
            }
        });
    }

    $scope.submit = function() {
        ajaxhandle();
    }
})

//周报申请
.controller('WorkReportAddWeekCtrl', function($scope, common) {
    $scope.showSelePhoto = function() {
        common.showSelePhoto();
    }

    $scope.data = {};

    var ajaxhandle = function() {
        COMMON.post({
            type: 'create_report',
            data: {
                "userId": common.userInfo.clientId,
                content: $scope.data.content,
                typeId: 3
            },
            success: function(data) {
                console.log(data);
            }
        });
    }

    $scope.submit = function() {
        ajaxhandle();
    }
})

//月报申请
.controller('WorkReportAddMonthCtrl', function($scope, common) {
    $scope.showSelePhoto = function() {
        common.showSelePhoto();
    }

    $scope.data = {};

    var ajaxhandle = function() {
        COMMON.post({
            type: 'create_report',
            data: {
                "userId": common.userInfo.clientId,
                content: $scope.data.content,
                typeId: 2
            },
            success: function(data) {
                console.log(data);
            }
        });
    }

    $scope.submit = function() {
        ajaxhandle();
    }
})

.controller('WorkReportCtrl', function($scope, $state, $ionicActionSheet, $timeout, common, seleMenuList) {
    var menus = seleMenuList.menu();

    var dataList = { };
    $scope.data = {
        departmentId: 1
    };
    $scope.items = [];

    var initData = function() {
        dataList = {
            currentPage: 0,
            report: []
        };

        $scope.items = [];
    }
    initData();
    

    var ajaxhandle = function() {
        COMMON.post({
            type: 'obtain_report',
            data: {
                userId: common.userInfo.clientId,
                currentPage: dataList.currentPage + 1,
                departmentId: $scope.data.departmentId,
                startDate: '2017-01-04',
                endDate: '2017-08-26',
                typeId: $scope.data.typeId
            },
            success: function(data) {
                var _body = data.body;

                report = _body.report;

                console.log(report)

                for (var i = 0, ii = report.length; i < ii; i++) {
                    report[i].nickname = common.nickname(report[i].userName);
                    $scope.items.push(report[i]);
                }

                $timeout(function() {
                    $scope.vm.moredata = true;
                }, 1000);
            }
        });
    };
    ajaxhandle();

    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.report.length < common._pageSize || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
                $scope.vm.moredata = false;
                return;
            }
            console.log(dataList.totalPage, 'x');

            $timeout(function () {
                $scope.vm.moredata = false;
                handleAjax();
            }, 1500);
            return true;
        }
    }

    $scope.seleBrank = [];
    $scope.seleDepartment = [];
    $scope.seleDate = [{name:'本月',key:''},{name:'上月'},{name:'起止时间'}];
    $scope.seleType = [{name:'全部',key:'-1'},{name:'日报',key:'1'},{name:'周报',key:'2'},{name:'月报',key:'3'}];

    $scope.isShowBrankSele = false;
    $scope.isShowDepartmentSele = false;
    $scope.isShowDateSele = false;
    $scope.isShowTypeSele = false;

    $scope.seleBrankInfo = '品牌';
    $scope.seleDepartmentInfo = '部门';
    $scope.seleDateInfo = '17/02-17/04';
    $scope.seleTypeInfo = '类型';

    //选择菜单处理
    var toggleSeleHandle = function(type, isToggle) {
        if (!isToggle) {
            initData();
            ajaxhandle();
        }

        if (type == 'brank') {
            $scope.isShowDepartmentSele = false;
            $scope.isShowDateSele = false;
            $scope.isShowTypeSele = false;

            $scope.isShowBrankSele = !$scope.isShowBrankSele;
        } else if (type == 'department') {
            $scope.isShowBrankSele = false;
            $scope.isShowDateSele = false;
            $scope.isShowTypeSele = false;

            if (!$scope.seleDepartment.length) {
                common.toast('请选择正确品牌');
                return;
            }

            $scope.isShowDepartmentSele = !$scope.isShowDepartmentSele;
        } else if (type == 'date') {
            $scope.isShowBrankSele = false;
            $scope.isShowDepartmentSele = false;
            $scope.isShowTypeSele = false;

            $scope.isShowDateSele = !$scope.isShowDateSele;
        } else if(type == 'type') {
            $scope.isShowBrankSele = false;
            $scope.isShowDepartmentSele = false;
            $scope.isShowDateSele = false;

            $scope.isShowTypeSele = !$scope.isShowTypeSele;
        }
    }

    //加载部门&公司
    common.getCompany(function(data) {
        $scope.seleBrank = data;
    })

    //选择部门
    $scope.seleBrankHandle = function(item) {
        $scope.seleDepartment = item.childDepartment;
        toggleSeleHandle('brank', true);

        $scope.seleBrankInfo = item.name;
        $scope.seleDepartmentInfo = '部门';
    }
    $scope.seleDepartmentHandle = function(item) {
        $scope.seleDepartmentInfo = item.name;
        $scope.data.departmentId = item.departmentId;

        toggleSeleHandle('department');
    }

    $scope.seleDateHandle = function(item) {
        toggleSeleHandle('date');
    }

    $scope.seleTypeHandle = function(item) {
        $scope.data.typeId = item.key;
        $scope.seleTypeInfo = item.name;

        toggleSeleHandle('type');
    }

    //筛选切换
    $scope.toggleSele = function(type) {
        toggleSeleHandle(type, true);
    }

    $scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '写日报', link: 'work_report_addDaily'
            }, {
                text: '写周报', link: 'work_report_addWeek'
            }, {
                text: '写月报', link: 'work_report_addMonth'
            }, {
                text: '统计', link: 'work_report_record'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                var _go = item.link || 'work_report_record';
                $state.go(_go);
                return true;
            }
        });
    }
})

.controller('WorkReportDetailCtrl', function($scope, $stateParams, common) {
    $scope.item = {};

    COMMON.post({
        type: 'report_details',
        data: {
            "reportId": $stateParams.id
        },
        success: function(data) {
            var _body = data.body;

            _body.nickname = common.nickname(_body.userName);

            $scope.item = _body;
        }
    });
})

.controller('WorkReportRecordCtrl', function() {
	
})