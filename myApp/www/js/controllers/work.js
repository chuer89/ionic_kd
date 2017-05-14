angular.module('work.controller', [])

//
.controller('WorkCtrl', function($scope, $state, workPlatform) {
    $scope.data = {};

    $scope.items = workPlatform.all();
})




