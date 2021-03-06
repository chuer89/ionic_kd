angular.module('workNotify.controller', [])

//通知列表
.controller('WorkNotifyCtrl', function ($scope, $state, $ionicActionSheet, $filter, common) {
    $scope.items = [];

    //菜单权限
    var navMenus = [];

    var getList = function(isNotLoading) {
        if (isNotLoading) {
            common.loadingShow();
        }
        
        COMMON.post({
            type: 'inform_list_info',
            data: {
                "id": common.userInfo.clientId
            },
            notPretreatment: true,
            success: function(data) {
                common.loadingHide();
                var _body = data.body;
                if (_body && _body.inform) {
                    $scope.notTaskListData = false;
                    $scope.items = _body.inform;
                } else {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                }

                //是否有权限新增&编辑&删除
                if (!_body.createAuthority) {
                    common.setLocalStorage('notCreateAuthority', true);
                } else {
                    navMenus = [{text: '查看通知'}, {text: '新建通知'}];
                }
            }
        });
    }

    getList(true);

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            getList(true);
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

.controller('WorkNotifyMyCtrl', function($scope, $state, $ionicActionSheet, common) {
    $scope.items = [];

    common.clearSetData();

    var getList = function(isNotLoading) {
        if (isNotLoading) {
            common.loadingShow();
        }

        COMMON.post({
            type: 'my_send_inform',
            data: {
                "id": common.userInfo.clientId
            },
            success: function(data) {
                common.loadingHide();

                var _body = data.body;
                if (_body && _body.inform) {
                    $scope.notTaskListData = false;
                    $scope.items = _body.inform;
                } else {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                }
            }
        });
    }

    getList(true);

    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            getList(true);
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

//详情
.controller('WorkNotifyDetailsCtrl', function($scope, $state, $stateParams, $ionicActionSheet, common) {
    $scope.item = {};

    var urlId = $stateParams.id,
        informId = $stateParams.id;

    common.clearSetData();

    $scope.notAuth = common.getLocalStorage('notCreateAuthority');

    $scope.showNav = function() {
        if ($scope.notAuth) {
            common.toast(common.noAuthLimitsTxt);
            return;
        }

        common.addTopRightMenus({
            buttons: [{
                text: '编辑'
            }, {
                text: '删除'
            }],
            buttonClicked: function (index, item) {
                if (index == 1) {
                    common.popup({
                        content: '确认删除通知吗'
                    }, function() {
                        del();
                    })
                } else if (index == 0) {
                    $state.go('work_notify_edit', {
                        id: informId
                    })
                }

                return true;
            }
        });
    }

    var del = function () {
        common.loadingShow();
        COMMON.post({
            type: 'delete_inform',
            data: {
                informId: informId
            },
            success: function(data) {
                common.loadingHide();
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }

    if (urlId.indexOf('_push_') > 0) {
        informId = urlId.split('_push_')[1];

        common.getMessageDetails(urlId, 'INFORM', function(data) {
            var _body = data.body;
            _body.description = common.replaceNext(_body.description);
            
            $scope.item = _body;
        });
    } else {
        //获取详情
        common.loadingShow();
        COMMON.post({
            type: 'inform_details',
            data: {
                id: common.userInfo.clientId,
                informId: informId
            },
            success: function(data) {
                common.loadingHide();

                var _body = data.body;

                _body.description = common.replaceNext(_body.description);
                $scope.item = _body;
            }
        });
    }

    //图片预览
    $scope.previewImg = function($index) {
        common.previewImg({
            allimgs: $scope.item.fujian,
            $index: $index
        })
    }
})

//新增
.controller('WorkNotifyAddCtrl', function($scope, $cordovaFileTransfer, $timeout, common) {
    $scope.seleSendName = '';
    $scope.data = {
        typePageName: 'WorkNotifyAddCtrl',
        title: '',
        description: ''
    };

    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
    }

    if (common.setCheckedPerson._targetName != 'work_notify') {
        common.setCheckedPerson = {};
    }

    common.getCommonSendName(function(sendName) {
        $scope.seleSendName = sendName;
    });

    //表单数据
    var formElement = document.querySelector("form");
    var formData = new FormData(formElement);

    $scope.imgList = [];

    $scope.showSelePhoto = function() {
        common.showSelePhoto({
            appendPhone: function(the_file) {
                formData.append("fuJians", the_file, "images.jpg");
            },
            showImg: function(results) {
                for (var i = 0, ii = results.length; i < ii; i++) {
                    $scope.imgList.push(results[i]);
                }
            },
            cameraImg: function(imgData) {
                $scope.imgList.push(imgData);
            }
        });
    }

    $scope.clearBack = common.clearBack;

    $scope.submit = function() {
        var _param = {
            departmentList: [],
            userList: [],
            description: $scope.data.description,
            title: $scope.data.title,
            id: common.userInfo.clientId
        }

        common.getCommonCheckedPerson(function(opt) {
            angular.extend(_param, opt);
        });

        if (!_param.title || !_param.description || (!_param.userList.length && !_param.departmentList.length)){
            common.toast('请输入内容');
            return;
        }
        

        common.loadingShow();
        common.formData({
            type: 'create_inform',
            body: _param,
            setData: function(json) {
                formData.append("json", json);
            },
            data: formData,
            success: function(data) {
                common.loadingHide();
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }
})

//编辑
.controller('WorkNotifyEditCtrl', function($scope, $stateParams, common) {
    $scope.seleSendName = '';
    $scope.data = {
        typePageName: 'WorkNotifyEditCtrl',
        title: '',
        description: ''
    };

    var ajaxData = function(cb) {
        //获取详情
        COMMON.post({
            type: 'inform_details',
            data: {
                id: common.userInfo.clientId,
                informId: $stateParams.id
            },
            success: function(data) {
                var _body = data.body;

                var name = '';
                name += common.getCheckedName(_body.departmentList, 'departmentId', 'departmentName') 
                    + common.getCheckedName(_body.userList, 'userId', 'userName');
                $scope.seleSendName = name;

                angular.extend($scope.data, _body);

                if (typeof cb == 'function') {
                    cb();
                }
            }
        });
    }

    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        ajaxData(function() {
            common._localstorage = $scope.data;
        })
    }

    common.getCommonSendName(function(sendName) {
        $scope.seleSendName = sendName;
    });

    $scope.submit = function() {
        var _param = {
            departmentList: [],
            userList: [],
            description: $scope.data.description,
            title: $scope.data.title,
            id: common.userInfo.clientId,
            informId: $stateParams.id
        }

        common.getCommonCheckedPerson(function(opt) {
            angular.extend(_param, opt);
        });
        
        common.loadingShow();
        common.post({
            type: 'update_inform',
            data: _param,
            success: function(data) {
                common.loadingHide();
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }
})


