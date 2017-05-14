angular.module('message.controller', [])

//
.controller('MessageCtrl', function($scope, $state, messagePush) {
    $scope.data = {};

    $scope.items = messagePush.all();
})