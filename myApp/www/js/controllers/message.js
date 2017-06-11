angular.module('message.controller', [])

//
.controller('MessageCtrl', function($scope, $state, messagePush) {
    $scope.data = {};

    $scope.items = messagePush.all();

    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
    }
})