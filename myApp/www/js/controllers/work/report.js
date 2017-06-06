angular.module('workReport.controller', [])

.controller('WorkReportCtrl', function ($scope, $state, $ionicActionSheet) {
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

.controller('WorkReportHistoryCtrl', function() {

})

.controller('WorkReportDetailCtrl', function() {

})

.controller('WorkReportRecordCtrl', function() {
	
})