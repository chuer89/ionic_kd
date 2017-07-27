angular.module('login.controller', [])

.controller('LoginCtrl', function($scope, $ionicPopup, $state, $ionicHistory, $cordovaToast, common) {
    $scope.data = {};

    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();

    $scope.forgotPassword = function() {
        $state.go('forgotPsd')
    }

    if (common.getLocalStorage('clientId')) {
        common.toast('自动登录中...');
        $state.go('tab.message');
    }

    $scope.login = function() {
        if ($scope.data.mobile && $scope.data.password) {

        } else {
            common.toast('请输入手机号和密码');
            return;
        }

        common.post({
            type: 'client_login',
            data: {
                mobile: $scope.data.mobile,
                password: $scope.data.password

                // mobile: 15608203716,
                // password: 111111
            },
            success: function(data) {
                var _body = data.body;

                // _body.clientId = 28;

                if (_body.clientId != common.getLocalStorage('clientId')) {
                    common.clearLocalStorage();
                }

                angular.extend(common.userInfo, _body);
                common.setLocalStorage('clientId', _body.clientId);

                $state.go('tab.dash');
            }
        });
    }
})

//忘记密码
.controller('ForgotPsdCtrl', function ($scope, $ionicPopup, $state, $cordovaToast, $interval, common) {
    $scope.sendCodeText = '获取验证码';
    $scope.isSendCode = false;
    var timeStep = 0;

    $scope.data = {};

    $scope.handleModify = function() {
        if ($scope.data.code != $scope.data.sendCode || !$scope.data.code) {
            common.toast('请输入正确的短信验证码');return;
        }

        if (!$scope.data.npassword || $scope.data.npassword != $scope.data.cpassword) {
            common.toast('两次密码不一致');return;
        }

        if ($scope.data.mobile && $scope.data.code) {
            common.post({
                type: 'change_password',
                data: {
                    mobile: $scope.data.mobile,
                    password: $scope.data.npassword,
                    code: $scope.data.code
                },
                success: function(data) {
                    common.back();
                }
            });
        }
    }

    $scope.sendCode = function() {

        if ($scope.isSendCode) {
            return;
        }

        if ($scope.data.mobile) {

        } else {
            common.toast('请输入手机号')
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
                mobile: $scope.data.mobile
                // mobile: 15608203716
            },
            success: function(data) {
                $scope.data.sendCode = data.body.code;
                console.log(data)
            }
        });
    }
})

//修改密码
.controller('ModifyPsdCtrl', function($scope, $state, $stateParams) {
    $scope.data = {
        typePageName: 'ForgotPsdCtrl'
    };
    console.log($stateParams, $state.params)
})

