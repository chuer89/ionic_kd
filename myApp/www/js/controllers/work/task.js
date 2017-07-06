angular.module('workTask.controller', [])

.controller('WorkTaskCtrl', function ($scope, $state, $ionicActionSheet, $timeout, workTaskList, common, seleMenuList) {
	var dataList = {
        currentPage: 0,
        tasks: []
    };

    var menus = seleMenuList.menu();

    var taskStatus = menus.taskStatus;

    $scope.tabs = [
        {name:'待办', type: 'DAIBAN'},
        {name:'已完成', type: 'CONFIRMED'},
        {name:'发起', type: 'CREATED'},
        {name:'关注', type: 'GUANZHU'},
        {name:'检查'}
    ];
    $scope.taskList = [];

    var ajaxType = {

    }

    var handleAjax = function(type) {
        type = type || 'DAIBAN';
        COMMON.post({
            type: 'obtain_my_tasks',
            data: {
                "userId": common.userInfo.clientId,
                "currentPage": dataList.currentPage + 1,
                "myTaskStatus": type
            },
            success: function(data) {
                var _body = data.body,
                    tasks = _body.tasks;

                dataList = _body;

                for (var i = 0, ii = tasks.length; i < ii; i++) {
                    tasks[i]._endTime = common.format(tasks[i].endTime);
                    tasks[i]._status = common.getId(taskStatus, tasks[i].taskStatus, 'key').name;

                    $scope.taskList.push(tasks[i]);
                }

                $timeout(function() {
                    $scope.vm.moredata = true;
                }, 1000);
            }
        });
    }, initAjax = function() {
        $scope.tabs[0].isShowTab = true;

        $scope.taskList = [];
        dataList.currentPage = 0;
        handleAjax();
    }
    initAjax();

    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.tasks.length < 20 || dataList.total <= 20) {
                $scope.vm.moredata = false;
                return;
            }
            console.log(dataList.total, 'x');

            $timeout(function () {
                $scope.vm.moredata = false;
                handleAjax();
            }, 1500);
            return true;
        }
    }

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            initAjax();
        }, 1000)
        return true;
	}

    $scope.showNav = function () {
        $ionicActionSheet.show({
            buttons: [{
                text: '创建任务', link: 'work_task_add'
            }, {
                text: '查看任务', link: 'work_task_query'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                $state.go(item.link);
                return true;
            }
        });
    }

    $scope.checkTab = function(item) {
        var _tab = $scope.tabs;
        for (var i = 0, ii = _tab.length; i < ii; i++) {
            _tab[i].isShowTab = false;
        }

        item.isShowTab = true;

        $scope.taskList = [];
        dataList.currentPage = 0;
        
        handleAjax(item.type);
    }
})

//任务查询
.controller('WorkTaskQueryCtrl', function($scope, $state, workTaskQuery) {
    $scope.items = workTaskQuery.all();

    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
    }
})

//创建任务
.controller('WorkTaskAddCtrl', function($scope, $ionicActionSheet, common) {
    $scope.seleWarn = '请选择';

    $scope.data = {
        typePageName: 'WorkTaskAddCtrl',
        ATTENTION_PEOPLE: {name:'请选择'},//关注人
        RESPONSIBLE_PEOPLE: {name:'请选择'},//责任人
        endTime: ''
    };

    $scope.showSeleWarn = function() {
        $ionicActionSheet.show({
            buttons: [
                { text: '提前3小时' },
                { text: '提前6小时' },
                { text: '提前1天' }
            ],
            cancelText: '取消',
            buttonClicked: function(index, item) {
                $scope.seleWarn = item.text;
                return true;
            }
        })
    }

    $scope.create = function() {
        var _data = $scope.data;

        var _param = {
            "categoryName":"我是测试任务01",
            "creatorId":"153",
            "description": _data.description,
            "endTime": "2017-08-30 12:40",
            "importantName": "一般",
            "period": "FIXED_DEADLLINE",
            "status": "WORKING",
            "title": _data.title,
            "userlist": [
                {"userId": _data.RESPONSIBLE_PEOPLE.id, "userTypeForTask": "RESPONSIBLE_PEOPLE"},
                {"userId": _data.ATTENTION_PEOPLE.id, "userTypeForTask": "ATTENTION_PEOPLE"}
            ],
            "zhibanTaskHandle": "0",
            "zhibanTaskId": "0"
        }

        COMMON.post({
            type: 'create_task',
            data: _param,
            success: function(data) {
                var _body = data.body;

                common.toast(data.message, function() {
                    history.back(-1);
                });
            }
        });
    }

    if (common.setAuditorUserList.id) {
        if (common.setAuditorUserList._targetName == 'work_task_add_RESPONSIBLE') {
            common._localstorage.RESPONSIBLE_PEOPLE = common.setAuditorUserList;
        } else if (common.setAuditorUserList._targetName == 'work_task_add_ATTENTION') {
            common._localstorage.ATTENTION_PEOPLE = common.setAuditorUserList;
        }
    }

    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
    }
})

.controller('WorkTaskListCtrl', function($scope, $stateParams, workTaskList, workTaskQuery) {
	$scope.itemFrom = workTaskQuery.get($stateParams.id);

	$scope.items = workTaskList.all();
	$scope.taskList = workTaskList.taskList();

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
	}
})

//查看任务
.controller('WorkTaskListDetailsCtrl', function($scope, $stateParams, $ionicActionSheet, $state, workTaskList) {
    $scope.itemFrom = workTaskList.get($stateParams.id);

	$scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '编辑'
            }, {
                text: '提交', link: 'work_task_list_details_refer'
            }, {
                text: '确认'
            }, {
            	text: '审核', link: 'work_task_list_details_audit'
            }, {
            	text: '添加讨论', link: 'work_task_list_details_Discuss'
            }, {
            	text: '申请延期', link: 'work_task_list_details_postpone'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                $state.go(item.link, {
                    id: $stateParams.id
                });
                return true;
            }
        });
	}
})

//任务审核
.controller('WorkTaskListDetailsAuditCtrl', function($scope, $ionicActionSheet) {
    $scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '合格'
            }, {
                text: '不合格'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                return true;
            }
        });
    }
})

//申请延迟
.controller('WorkTaskListDetailsPostponeCtrl', function($scope) {

})

//提交任务
.controller('WorkTaskListDetailsReferCtrl', function() {

})

//讨论
.controller('WorkTaskListDetailsDiscussCtrl', function() {

})

