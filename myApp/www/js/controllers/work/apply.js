angular.module('workApply.controller', [])

.controller('WorkApplyCtrl', function ($scope, $state, $ionicActionSheet, workApplyList) {
	$scope.items = workApplyList.all();

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
	}

    $scope.clickTabState = function(state) {
        console.log(state)
    }
})

.controller('WorkApplyAddListCtrl', function($scope, $state, workApplyAddList) {
	$scope.items = workApplyAddList.all();
})

//申请其他
.controller('WorkApplyAddOtherCtrl', function($scope, $state) {

})

//申请报残
.controller('WorkApplyAddDiscardCtrl', function($scope, $state) {

})

//申请优惠
.controller('WorkApplyAddPrivilegeCtrl', function($scope, $state) {

})

//申请请假
.controller('WorkApplyAddLeaveCtrl', function($scope, $state, $ionicActionSheet) {
	$scope.seleType = '请选择';
	$scope.showSeleType = function () {
		$ionicActionSheet.show({
            buttons: [
            	{text: '年假'},
            	{text: '病假'},
                { text: '事假' },
                {text: '婚假'},
                {text: '丧假'},
                {text: '无薪假'}
            ],
            cancelText: '取消',
            buttonClicked: function(index, item) {
                $scope.seleType = item.text;
                return true;
            }
        })
	}
})

//工程维修申请
.controller('WorkApplyAddMaintainCtrl', function() {

})

//采购申请
.controller('WorkApplyAddPurchaseCtrl', function() {

})

//请假审批
.controller('WorkApplyAuditLeaveCtrl', function($scope, $ionicActionSheet) {
    $scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '同意'
            }, {
                text: '拒绝'
            }, {
                text: '转交'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                
                return true;
            }
        });
    }
})

