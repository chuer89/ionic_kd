angular.module('login.controller', [])

.controller('LoginCtrl', function($scope, $ionicPopup, $state, $ionicHistory, $cordovaToast, common) {
    $scope.data = {};

    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();

    $scope.forgotPassword = function() {
        $state.go('forgotPsd')
    }

    $scope.login = function() {
        if ($scope.data.mobile || $scope.data.password) {

        } else {
            $cordovaToast
            .show('请输入手机号和密码', 'long', 'bottom');
            return;
        }

        common.post({
            type: 'client_login',
            data: {
                // mobile: $scope.data.mobile,
                // password: $scope.data.password

                mobile: 13889521999,
                password: 123456
            },
            success: function(data) {
                angular.extend(common.userInfo, data.body);

                $state.go('tab.dash');
            }
        });
    }
})

//忘记密码
.controller('ForgotPsdCtrl', function ($scope, $ionicPopup, $state, $cordovaToast, common) {
    $scope.data = {};

    $scope.handleCode = function() {
        // $state.go('modifyPsd');
    }

    $scope.sendCode = function() {
        if ($scope.data.mobile) {

        } else {
            $cordovaToast
            .show('请输入手机号', 'long', 'bottom');
            return;
        }

        common.post({
            type: 'send_code',
            data: {
                // mobile: $scope.data.mobile
                mobile: 15608203716
            },
            success: function(data) {
                console.log(data)
            }
        });
    }
})

//修改密码
.controller('ModifyPsdCtrl', function($scope, $state) {
    $scope.data = {};
})