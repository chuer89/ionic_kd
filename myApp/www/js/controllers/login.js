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
            .show('请输入手机号和密码', 'short', 'bottom');
            return;
        }

        common.post({
            type: 'client_login',
            data: {
                // mobile: $scope.data.mobile,
                // password: $scope.data.password

                mobile: 15608203716,
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
.controller('ForgotPsdCtrl', function ($scope, $ionicPopup, $state, $cordovaToast, $interval, common) {
    $scope.data = {};

    $scope.sendCodeText = '获取验证码';
    $scope.isSendCode = false;
    var timeStep = 0;

    $scope.handleCode = function() {
        if ($scope.data.mobile && $scope.data.code) {
            console.log($scope.data)
            $state.go('modifyPsd', {code: $scope.data.code, mobile: $scope.data.mobile});
        }
    }

    $scope.sendCode = function() {

        if ($scope.isSendCode) {
            return;
        }

        if ($scope.data.mobile) {

        } else {
            $cordovaToast
            .show('请输入手机号', 'short', 'bottom');
            return;
        }

        $scope.isSendCode = true;
        timeStep = 20;

        var time = $interval(function() {
            timeStep --;
            $scope.sendCodeText = '重新获取('+timeStep+'s)';

            if (timeStep == 0) {
                $scope.sendCodeText = '获取验证码';
                $scope.isSendCode = false;

                $interval.cancel(time);

                return;
            }
        }, 1000);

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
.controller('ModifyPsdCtrl', function($scope, $state, $stateParams) {
    // $scope.data = {};
    console.log($stateParams, $state.params)
})

