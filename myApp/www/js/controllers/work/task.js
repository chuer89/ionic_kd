angular.module('workTask.controller', [])

.controller('WorkTaskCtrl', function ($scope, $state, workTaskQuery) {
	$scope.items = workTaskQuery.all();

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
	}
})

.controller('WorkTaskListCtrl', function($scope, $stateParams, workTaskList, workTaskQuery) {
	$scope.itemFrom = workTaskQuery.get($stateParams.id);

	$scope.items = workTaskList.all();
})