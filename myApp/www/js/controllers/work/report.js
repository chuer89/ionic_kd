angular.module('workReport.controller', [])

.controller('WorkReportCtrl', function ($scope, $state, $ionicActionSheet, common) {
	$scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '写日报'
            }, {
                text: '写周报'
            }, {
                text: '写月报'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
            	var _go = 'work_report_addDaily';
                $state.go(_go);
                return true;
            }
        });
    }
})

.controller('WorkReportAddDailyCtrl', function() {

})

.controller('WorkReportHistoryCtrl', function($scope, $state, $ionicActionSheet, common, seleMenuList) {
    var menus = seleMenuList.menu();

    var ajaxhandle = function() {
        COMMON.post({
            type: 'obtain_report',
            data: {
                "userId": common.userInfo.clientId,
                "currentPage":1,
                "departmentId":2,
                endDate: '2017-07-04',
                startDate: '2017-05-26',
                typeId: 1
            },
            success: function(data) {
                console.log(data);
            }
        });
    };
    ajaxhandle();

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
    var toggleSeleHandle = function(type) {
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
        toggleSeleHandle('brank');

        $scope.seleBrankInfo = item.name;
        $scope.seleDepartmentInfo = '部门';
    }
    $scope.seleDepartmentHandle = function(item) {
        toggleSeleHandle('department');

        $scope.seleDepartmentInfo = item.name;

        console.log(item)
    }

    $scope.seleDateHandle = function(item) {

    }

    $scope.seleTypeHandle = function(item) {

    }

    //筛选切换
    $scope.toggleSele = function(type) {
        toggleSeleHandle(type);
    }
})

.controller('WorkReportDetailCtrl', function() {

})

.controller('WorkReportRecordCtrl', function() {
	
})