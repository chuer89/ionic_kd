angular.module('workNotify.controller', [])

.controller('WorkNotifyCtrl', function ($scope, $state, $ionicActionSheet, common) {
    $scope.items = [];

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
	}

    $scope.nickname = function(name) {
        return common.nickname(name);
    }
    $scope.formatDate = function(date) {
        return common.format(date, 'MM-dd');
    }

    $scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '查看通知'
            }, {
                text: '新建通知'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                
                if (index == 1) {
                    $state.go('work_notify_add');
                }
                return true;
            }
        });
    }

    COMMON.post({
        type: 'inform_list_info',
        data: {
            "id": common.userInfo.clientId
        },
        success: function(data) {
            var _body = data.body;
            if (_body && _body.inform) {
                $scope.items = _body.inform;
            }
        }
    });    
})

.controller('WorkNotifyDetailsCtrl', function($scope, $stateParams, $ionicActionSheet, common) {
    $scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '编辑'
            }, {
                text: '删除'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                
                return true;
            }
        });
    }

    $scope.item = {};

    COMMON.post({
        type: 'inform_details',
        data: {
            "id": common.userInfo.clientId,
            informId: $stateParams.id
        },
        success: function(data) {
            var _body = data.body;

            $scope.item = _body;
        }
    });
})

.controller('WorkNotifyAddCtrl', function($scope, common) {

})

.controller('WorkNotifySeleSectionCtrl', function($scope, $state, common) {
    $scope.items = [];

    //公司&部门列表
    var companyList = [];

    //选择菜单处理
    var toggleSeleHandle = function(type) {
        if (type == 'brank') {
            $scope.isShowBrankSele = !$scope.isShowBrankSele;
        }
    }, handleBrankList = function(id) {
        for (var i = 0; i < companyList.length; i++) {
            if (companyList[i].departmentId == id) {
                return companyList[i].childDepartment;
            }
        }
        return [];
    }

    $scope.seleBrank = [];
    $scope.isShowBrankSele = false;
    $scope.seleBrankInfo = '品牌';

    //加载部门&公司
    common.getCompany(function(data) {
        $scope.seleBrank = data;
        companyList = data;

        $scope.items = handleBrankList(1);
    });

     //选择部门
    $scope.seleBrankHandle = function(item) {
        $scope.seleBrankInfo = item.name;
        toggleSeleHandle('brank');
    }
    //筛选切换
    $scope.toggleSele = function(type) {
        toggleSeleHandle(type);
    }

    $scope.sub = function() {
        console.log($scope.items)    
    }

    $scope.toPerson = function(item) {
        $state.go('work_notify_sele_person', {
            id: item.departmentId
        });
    }
})

.controller('WorkNotifySelePersonCtrl', function($scope, $state, $stateParams, workSeleNotifySectionList) {
    $scope.items = workSeleNotifySectionList.all();

    console.log($stateParams.id)
})

