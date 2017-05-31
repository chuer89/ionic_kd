angular.module('me.controller', [])

.controller('MeInfoCtrl', function ($scope, $state, $ionicActionSheet) {
	
})

.controller('MeSetMsgCtrl', function($scope, messageSetList) {
	$scope.items = messageSetList.all();
})

.controller('MeAboutCtrl', function($scope) {
	
})