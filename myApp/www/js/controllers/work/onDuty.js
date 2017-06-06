angular.module('workOnDuty.controller', [])

.controller('WorkOnDutyCtrl', function ($scope, $state, $ionicActionSheet) {
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