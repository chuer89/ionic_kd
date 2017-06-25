angular.module('workCyclopedia.controller', [])

.controller('WorkCyclopediaCtrl', function ($scope, $state) {
	
})

.controller('WorkCyclopediaListCtrl', function($stateParams, $scope, workCyclopediaType) {
	$scope.item = workCyclopediaType.get($stateParams.id);
})
