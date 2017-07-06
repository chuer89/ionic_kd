angular.module('workSchedule.controller', [])

.controller('WorkScheduleCtrl', function ($scope, $state, $ionicActionSheet, common) {
	$scope.items = [];

    var handleAjax = function() {
        COMMON.post({
            type: 'user_richeng_list',
            data: {
                "userId": common.userInfo.clientId,
                "isNotification": false
            },
            success: function(data) {
                var _body = data.body;

                for (var i = 0, ii = _body.riChengList.length; i < ii; i++) {
                    _body.riChengList[i]._beginTime = common.format(_body.riChengList[i].beginTime)
                }

                $scope.items = _body.riChengList;
            }

        });
    }
    handleAjax();

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            handleAjax();
        }, 1000)
        return true;
	}
})

//日程详情
.controller('WorkScheduleDetailsCtrl', function($scope, $stateParams, $ionicPopup, $ionicActionSheet, workScheduleWarn, common) {
	$scope.item = workScheduleWarn.get($stateParams.id);

    COMMON.post({
        type: 'richeng_detail_info',
        data: {
            "userId": common.userInfo.clientId,
            "riChengType": "richeng",
            riChengId: $stateParams.id
        },
        success: function(data) {
            var _body = data.body;

            console.log(_body)

            // for (var i = 0, ii = _body.riChengList.length; i < ii; i++) {
            //     _body.riChengList[i]._beginTime = common.format(_body.riChengList[i].beginTime)
            // }

            // $scope.items = _body.riChengList;
        }

    });

	var showConfirm = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: '提示',
			template: '您是否删除该日程？'
		});
		confirmPopup.then(function(res) {
			if(res) {
				console.log('You are sure');
			} else {
				console.log('You are not sure');
			}
		});
   	};

	$scope.showNav = function () {
        $ionicActionSheet.show({
            buttons: [{
                text: '编辑'
            }, {
                text: '删除'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                // $state.go(item.link);
                if (index == 1) {
                	showConfirm();
                }
                return true;
            }
        });
    }

    $scope.quit = function () {
   		var confirmPopup = $ionicPopup.confirm({
			title: '提示',
			template: '退出后，你将不再参与该日程'
		});
		confirmPopup.then(function(res) {
			if(res) {
				console.log('You are sure');
			} else {
				console.log('You are not sure');
			}
		});
   	}
})

//日程新增
.controller('WorkScheduleAddCtrl', function($scope, $ionicActionSheet, common) {
    $scope.data = {
        typePageName: 'WorkScheduleAddCtrl',
        beginTime: '',
        title: '',
        content: '',
        userlist: []
    }

    if (common.setCheckedPerson._targetName != 'work_schedule_add') {
        common.setCheckedPerson = {};
    }

    common.getCommonSendName(function(sendName) {
        $scope.seleSendName = sendName;
    });

    $scope.submit = function() {
        var _param = {
            departmentList: [],
            userList: [],
            content: $scope.data.content,
            title: $scope.data.title,
            clientId: common.userInfo.clientId,
            beginTime: "2017-07-07 13:40"
        };

        if (!_param.title) {

            return;
        }

        common.getCommonCheckedPerson(function(opt) {
            angular.extend(_param, opt);
        });

        COMMON.post({
            type: 'create_richeng',
            data: _param,
            success: function(data) {
                var _body = data.body;

               history.back(-1);
            }
        });
    }

	$scope.seleRepeat = '请选择';
	$scope.showSeleRepeat = function () {
		$ionicActionSheet.show({
            buttons: [
            	{text: '不重复'},
            	{text: '每天'},
                { text: '每周' },
                {text: '每月'}
            ],
            cancelText: '取消',
            buttonClicked: function(index, item) {
                $scope.seleRepeat = item.text;
                return true;
            }
        })
	}

    $scope.seleWarn = '请选择';
    $scope.showSeleWarn = function() {
        $ionicActionSheet.show({
            buttons: [
            	{text: '事情发生时'},
            	{text: '提前30分钟'},
                { text: '提前1小时' },
                { text: '提前2小时' },
                { text: '提前5小时' }
            ],
            cancelText: '取消',
            buttonClicked: function(index, item) {
                $scope.seleWarn = item.text;
                return true;
            }
        })
    }

    if (common.setAuditorUserList.id) {
        if (common.setAuditorUserList._targetName == 'work_schedule_add') {
            common._localstorage.userlist = common.setAuditorUserList;
        }
    }

    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
    }
})

//我的日程
.controller('WorkScheduleMyCtrl', function($scope, common) {
	$scope.items = [];

    var handleAjax = function() {
        COMMON.post({
            type: 'user_richeng_list',
            data: {
                "userId": common.userInfo.clientId,
                "isNotification": true
            },
            success: function(data) {
                var _body = data.body;

                for (var i = 0, ii = _body.riChengList.length; i < ii; i++) {
                    _body.riChengList[i]._beginTime = common.format(_body.riChengList[i].beginTime)
                }

                $scope.items = _body.riChengList;
            }

        });
    }
    handleAjax();

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
	}
})

