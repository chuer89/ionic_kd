angular.module('workNotify.controller', [])

.controller('WorkNotifyCtrl', function ($scope, $state, $ionicActionSheet, workNotifyList) {
    $scope.items = workNotifyList.all();

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
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
})

.controller('WorkNotifyDetailsCtrl', function($scope, $stateParams, $ionicActionSheet) {
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
})

.controller('WorkNotifyAddCtrl', function() {

})

.controller('WorkNotifySeleSectionCtrl', function($scope, $state, workSeleNotifySectionList) {
    $scope.items = workSeleNotifySectionList.all();

    $scope.sub = function() {
        console.log($scope.items)    
    }

    $scope.toPerson = function(item) {
        $state.go('work_notify_sele_person', {
            id: item.id
        });
    }
})

.controller('WorkNotifySelePersonCtrl', function($scope, $state, $stateParams, workSeleNotifySectionList) {
    $scope.items = workSeleNotifySectionList.all();

    console.log($stateParams.id)
})

