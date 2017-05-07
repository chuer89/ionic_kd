angular.module('login.controller', [])

.controller('LoginCtrl', function($scope, $ionicPopup, $state, $ionicHistory) {
    $scope.data = {};

    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();

    $scope.forgotPassword = function() {
        $state.go('forgotPsd')
    }

    $scope.login = function() {
        $state.go('tab.dash');

        // LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
        //     $state.go('tab.dash');
        // }).error(function(data) {
        //     var alertPopup = $ionicPopup.alert({
        //         title: 'Login failed!',
        //         template: 'Please check your credentials!'
        //     });
        // });
    }
})

//忘记密码
.controller('ForgotPsdCtrl', function ($scope, $ionicPopup, $state) {
    $scope.data = {};

    $scope.handleCode = function() {
        $state.go('modifyPsd')
    }
})

//修改密码
.controller('ModifyPsdCtrl', function($scope, $state) {
    $scope.data = {};
})