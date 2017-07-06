angular.module('workNotify.controller', [])

.controller('WorkNotifyCtrl', function ($scope, $state, $ionicActionSheet, common) {
    $scope.items = [];

    var getList = function() {
        COMMON.post({
            type: 'inform_list_info',
            data: {
                "id": common.userInfo.clientId
            },
            success: function(data) {
                var _body = data.body;
                if (_body && _body.inform) {
                    $scope.items = _body.inform;
                }
            }
        });
    }

    getList();

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            getList();
        }, 1000)
        return true;
	}

    $scope.nickname = function(name) {
        return common.nickname(name);
    }
    $scope.formatDate = function(date) {
        return common.format(date, 'MM-dd');
    }

    $scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '查看通知'
            }, {
                text: '新建通知'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                
                if (index == 1) {
                    $state.go('work_notify_add');
                } else {
                    $state.go('work_notify_my');
                }
                return true;
            }
        });
    }

    $scope.del = function(item) {
        COMMON.post({
            type: 'delete_inform',
            data: {
                "informId": item.id
            },
            success: function(data) {
                var _body = data.body;
                getList();
            }
        });
    }
})

.controller('WorkNotifyMyCtrl', function($scope, $state, $ionicActionSheet, common) {
    $scope.items = [];

    var getList = function() {
        COMMON.post({
            type: 'my_send_inform',
            data: {
                "id": common.userInfo.clientId
            },
            success: function(data) {
                var _body = data.body;
                if (_body && _body.inform) {
                    $scope.items = _body.inform;
                }
            }
        });
    }

    getList();

    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            getList();
        }, 1000)
        return true;
    }

    $scope.nickname = function(name) {
        return common.nickname(name);
    }
    $scope.formatDate = function(date) {
        return common.format(date, 'MM-dd');
    }
})

.controller('WorkNotifyDetailsCtrl', function($scope, $stateParams, $ionicActionSheet, common) {
    $scope.item = {};

    $scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '编辑'
            }, {
                text: '删除'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                if (index == 1) {
                    del();
                    history.back(-1);
                }

                return true;
            }
        });
    }

    var del = function () {
        COMMON.post({
            type: 'delete_inform',
            data: {
                "informId": $scope.item.id
            },
            success: function(data) {
                var _body = data.body;
            }
        });
    }

    COMMON.post({
        type: 'inform_details',
        data: {
            "id": common.userInfo.clientId,
            informId: $stateParams.id
        },
        success: function(data) {
            var _body = data.body;

            $scope.item = _body;
        }
    });
})

.controller('WorkNotifyAddCtrl', function($scope, $cordovaFileTransfer, common) {
    $scope.seleSendName = '';

    $scope.data = {};

    if (common.setCheckedPerson._targetName != 'work_notify') {
        common.setCheckedPerson = {};
    }

    common.getCommonSendName(function(sendName) {
        $scope.seleSendName = sendName;
    });

    $scope.showSelePhoto = function() {
        common.showSelePhoto();
    }

    $scope.submit = function() {
        var _param = {
            departmentList: [],
            userList: [],
            description: $scope.data.description,
            title: $scope.data.title,
            "id": common.userInfo.clientId
        }

        common.getCommonCheckedPerson(function(opt) {
            angular.extend(_param, opt);
        })

        COMMON.post({
            type: 'create_inform',
            data: _param,
            success: function(data) {
                var _body = data.body;

               console.log(data)
            }
        });
    }
})


