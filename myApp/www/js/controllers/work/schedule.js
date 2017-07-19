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
	$scope.item = {};

    $scope.relationGuys = '';

    COMMON.post({
        type: 'richeng_detail_info',
        data: {
            "userId": common.userInfo.clientId,
            "riChengType": "richeng",
            riChengId: $stateParams.id
        },
        success: function(data) {
            var _body = data.body;

            var _relationGuys = '';

            for (var i = 0, ii = _body.jieshourenList.length; i < ii; i++) {
                _relationGuys += _body.jieshourenList[i].userName + ' ';
            }

            common.getUserinfo_simple(_body.riChengbasicInffo.riChengCreatorId, function(_data) {
                _body.riChengbasicInffo.userName = _data.name;

                _body.riChengbasicInffo._time = common.format(_body.riChengbasicInffo.riChengBegingtime);

                $scope.item = _body.riChengbasicInffo;
            });

            $scope.relationGuys = _relationGuys;
        }

    });

    var ajaxDel = function() {
        COMMON.post({
            type: 'delete_richeng',
            data: {
                clientId: common.userInfo.clientId,
                riChengId: $stateParams.id
            },
            success: function(data) {
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }

	var showConfirm = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: '提示',
			template: '您是否删除该日程？'
		});
		confirmPopup.then(function(res) {
			if(res) {
				ajaxDel();
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
.controller('WorkScheduleAddCtrl', function($scope, $ionicActionSheet, common, seleMenuList) {
    $scope.data = {
        typePageName: 'WorkScheduleAddCtrl',
        beginTime: '',
        title: '',
        content: '',
        userlist: [],
        cycletime: {text: '请选择'},
        remindtime: {text: '请选择'}
    }

    var menus = seleMenuList.menu();

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
            beginTime: "2017-07-07 13:40",
            cycletime: $scope.data.cycletime.key,
            remindtime: $scope.data.remindtime.key
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

               common.toast(_body.message, function() {
                    history.back(-1);
                });
            }
        });
    }

    //重复
	$scope.showSeleRepeat = function () {
		$ionicActionSheet.show({
            buttons: common.setSeleRepeat(menus.cycletime),
            cancelText: '取消',
            buttonClicked: function(index, item) {
                $scope.data.cycletime = item;
                return true;
            }
        })
	}

    //时间
    $scope.showSeleWarn = function() {
        $ionicActionSheet.show({
            buttons: common.setSeleRepeat(menus.remindtime),
            cancelText: '取消',
            buttonClicked: function(index, item) {
                $scope.data.remindtime = item;
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

