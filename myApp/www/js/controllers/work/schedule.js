angular.module('workSchedule.controller', [])

.controller('WorkScheduleCtrl', function ($scope, $state, $ionicActionSheet, workScheduleWarn) {
	$scope.items = workScheduleWarn.all();

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
	}
})

.controller('WorkScheduleDetailsCtrl', function($scope, $stateParams, workScheduleWarn) {
	$scope.item = workScheduleWarn.get($stateParams.id);
})