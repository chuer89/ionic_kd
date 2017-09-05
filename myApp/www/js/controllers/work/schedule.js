angular.module('workSchedule.controller', [])

.controller('WorkScheduleCtrl', function ($scope, $state, $ionicActionSheet, common) {
	$scope.items = [];

    common.clearSetData();

    var handleAjax = function() {
        common.loadingShow();

        COMMON.post({
            type: 'user_richeng_list',
            data: {
                "userId": common.userInfo.clientId,
                "isNotification": false
            },
            notPretreatment: true,
            success: function(data) {
                var _body = data.body;
                common.loadingHide();

                console.log(data);

                if (!_body || (_body && !_body.riChengList) || (_body && _body.riChengList && !_body.riChengList.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                for (var i = 0, ii = _body.riChengList.length; i < ii; i++) {
                    _body.riChengList[i]._beginTime = common.format(_body.riChengList[i].beginTime, 'yyyy-MM-dd HH:ss')
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
.controller('WorkScheduleDetailsCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicActionSheet, workScheduleWarn, common) {
	$scope.item = {};

    var urlId = $stateParams.id,
        riChengId = $stateParams.id;

    common.clearSetData();

    $scope.relationGuys = '';

    var handleData = function(data) {
        var _body = data.body;

        var _relationGuys = '';

        for (var i = 0, ii = _body.jieshourenList.length; i < ii; i++) {
            _relationGuys += _body.jieshourenList[i].userName + ' ';
        }

        _body.riChengbasicInffo.riChengContent = common.replaceNext(_body.riChengbasicInffo.riChengContent);


        common.getUserinfo_simple(_body.riChengbasicInffo.riChengCreatorId, function(_data) {
            _body.riChengbasicInffo.userName = _data.name;

            _body.riChengbasicInffo._time = common.format(_body.riChengbasicInffo.riChengBegingtime);

            $scope.item = _body.riChengbasicInffo;
        });

        $scope.relationGuys = _relationGuys;
    }, getDetails = function() {
        common.loadingShow();
        COMMON.post({
            type: 'richeng_detail_info',
            data: {
                "userId": common.userInfo.clientId,
                "riChengType": "richeng",
                riChengId: riChengId
            },
            success: function(data) {
                common.loadingHide();
                handleData(data);
            }
        });
    }

    if (urlId.indexOf('_push_') > 0) {
        riChengId = urlId.split('_push_')[1];

        common.getMessageDetails(urlId, 'REMIND', function(data) {
            handleData(data);
        });
    } else {
        getDetails();
    }

	var showConfirm = function() {
        common.popup({
            content: '您是否删除该日程？'
        }, function() {
            common.loadingShow();
            COMMON.post({
                type: 'delete_richeng',
                data: {
                    clientId: common.userInfo.clientId,
                    riChengId: riChengId
                },
                success: function(data) {
                    common.loadingHide();
                    common.toast(data.message, function() {
                        common.back();
                    });
                }
            });
        });
   	};

	$scope.showNav = function () {
        common.addTopRightMenus({
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
                } else {
                    $state.go('work_schedule_edit', {
                        id: riChengId
                    });
                }
                return true;
            }
        });
    }

    $scope.quit = function () {
   		common.popup({
            content: '退出后，你将不再参与该日程'   
        }, function() {
            common.loadingShow();
            COMMON.post({
                type: 'exit_richeng',
                data: {
                    clientId: common.userInfo.clientId,
                    riChengId: riChengId
                },
                success: function(data) {
                    common.loadingHide();
                    common.toast(data.message, function() {
                        common.back();
                    });
                }
            });
        })
   	}
})

//日程新增
.controller('WorkScheduleAddCtrl', function($scope, $ionicActionSheet, common, seleMenuList) {
    $scope.data = {
        typePageName: 'WorkScheduleAddCtrl',
        clientId: common.userInfo.clientId,
        beginTime: '',
        title: '',
        content: '',
        cycletimeSele: {text: '不重复'},
        remindtimeSele: {text: '请选择'},
        cycletime: 'NO_CYCLE',
        remindtime: ''
    }

    var menus = seleMenuList.menu();

    if (common.setCheckedPerson._targetName != 'work_schedule_add') {
        common.setCheckedPerson = {list: [], _targetName: ''};
    }

    common.getCommonSendName(function(sendName) {
        $scope.seleSendName = sendName;
    });

    $scope.seleDate = function() {
        common.datePicker(function(date) {
            $scope.data.beginTime = date;
        }, true);
    }

    $scope.submit = function() {

        var _param = angular.extend({}, $scope.data);

        if (!_param.title || !_param.content || !_param.beginTime) {
            common.toast('请输入必填信息');
            return;
        }

        common.loadingShow();

        common.getCommonCheckedPerson(function(opt) {
            angular.extend(_param, opt);
        });

        COMMON.post({
            type: 'create_richeng',
            data: _param,
            success: function(data) {
                common.loadingHide();
               common.toast(data.message, function() {
                    common.back();
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
                $scope.data.cycletimeSele = item;
                $scope.data.cycletime = item.key;
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
                $scope.data.remindtimeSele = item;
                $scope.data.remindtime = item.key;
                return true;
            }
        })
    }

    if (common.setAuditorUserList.id) {
        if (common.setAuditorUserList._targetName == 'work_schedule_add') {
            common._localstorage.userList = common.setAuditorUserList;
        }
    }

    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
    }
})

//日程修改
.controller('WorkScheduleEidtCtrl', function($scope, $ionicActionSheet, $stateParams, common, seleMenuList) {
    $scope.data = {
        typePageName: 'WorkScheduleEidtCtrl',
        beginTime: '',
        title: '',
        content: '',
        cycletimeSele: {text: '请选择'},
        remindtimeSele: {text: '请选择'},
        cycletime: '',
        remindtime: ''
    }

    var menus = seleMenuList.menu();

    $scope.seleSendName = '';
    
    var getDetails = function() {
        common.loadingShow();
        COMMON.post({
            type: 'richeng_detail_info',
            data: {
                "userId": common.userInfo.clientId,
                "riChengType": "richeng",
                riChengId: $stateParams.id
            },
            success: function(data) {
                var _body = data.body;
                common.loadingHide();

                var _relationGuys = '';
                _relationGuys += common.getCheckedName(_body.jieshourenList, 'userId', 'userName');

                var _remindtime = common.getId(menus.remindtime, _body.riChengbasicInffo.remindtime, 'key'),
                    _cycletime = common.getId(menus.cycletime, _body.riChengbasicInffo.cycletime, 'key');

                $scope.data.remindtimeSele = angular.extend(_remindtime, {text: _remindtime.name});
                $scope.data.cycletimeSele = angular.extend(_cycletime, {text: _cycletime.name});

                common.getUserinfo_simple(_body.riChengbasicInffo.riChengCreatorId, function(_data) {
                    _body.riChengbasicInffo.userName = _data.name;

                    _body.riChengbasicInffo._time = common.format(_body.riChengbasicInffo.riChengBegingtime);

                    angular.extend($scope.data, {
                        title: _body.riChengbasicInffo.riChengTitle,
                        content: _body.riChengbasicInffo.riChengContent,
                        beginTime: _body.riChengbasicInffo._time,
                        cycletime: _body.riChengbasicInffo.cycletime,
                        remindtime: _body.riChengbasicInffo.remindtime
                    });
                });

                $scope.seleSendName = _relationGuys;
            }

        });
    }

    $scope.seleDate = function() {
        common.datePicker(function(date) {
            $scope.data.beginTime = date;
        }, true);
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
            id: $stateParams.id,
            beginTime: "2017-08-07 13:40",
            cycletime: $scope.data.cycletime.key,
            remindtime: $scope.data.remindtime.key
        };

        if (!_param.title) {
            return;
        }

        common.loadingShow();

        common.getCommonCheckedPerson(function(opt) {
            angular.extend(_param, opt);
        });

        COMMON.post({
            type: 'update_richeng',
            data: _param,
            success: function(data) {
                common.loadingHide();
                common.toast(data.message, function() {
                    common.back();
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
        getDetails();
    }
})

//我的日程
.controller('WorkScheduleMyCtrl', function($scope, common) {
	$scope.items = [];

    var handleAjax = function(isNotLoading) {
        if (isNotLoading) {
            common.loadingShow();
        }

        COMMON.post({
            type: 'user_richeng_list',
            data: {
                "userId": common.userInfo.clientId,
                "isNotification": false
            },
            notPretreatment: true,
            success: function(data) {
                var _body = data.body;

                common.loadingHide();

                if (!_body || (_body && _body.riChengList && !_body.riChengList.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                } else {
                    $scope.notTaskListData = false;
                }

                for (var i = 0, ii = _body.riChengList.length; i < ii; i++) {
                    _body.riChengList[i]._beginTime = common.format(_body.riChengList[i].beginTime)
                }

                $scope.items = _body.riChengList;
            }

        });
    }
    handleAjax(true);

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            handleAjax(true);
        }, 1000)
        return true;
	}
})

