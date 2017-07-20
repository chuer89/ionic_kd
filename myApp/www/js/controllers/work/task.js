angular.module('workTask.controller', [])

//'DECLARATION'or 'WORKING' or 'UNCONFIRMED' or 'QUALIFIED' or 'UNQUALIFIED' 
//(申报，工作中，未确认，合格，不合格) default 'DECLARATION'
// 责任人申报状态：DECLARATION
// 检查人确认后状态：WORKING
// 责任人提交后状态：UNCONFIRMED
// 检查人审批后：QUALIFIED 或者 UNQUALIFIED

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
    $scope.data = {};

    var handleAjax = function() {
        COMMON.post({
            type: 'obtain_my_tasks',
            data: {
                "userId": common.userInfo.clientId,
                "currentPage": dataList.currentPage + 1,
                "myTaskStatus": $scope.data.myTaskStatus
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

                console.log(dataList)

                $timeout(function() {
                    $scope.vm.moredata = true;
                }, 1000);
            }
        });
    }, initAjax = function(isInitTab) {
        if (isInitTab) {
            $scope.tabs[0].isShowTab = true;
            $scope.data.myTaskStatus = $scope.tabs[0].type;
        }

        $scope.taskList = [];
        dataList.currentPage = 0;
        handleAjax();
    }
    initAjax(true);

    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.tasks && dataList.tasks.length < 20 || dataList.total <= 20) {
                $scope.vm.moredata = false;
                return;
            }

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

        $scope.data.myTaskStatus = item.type;
        
        handleAjax();
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
.controller('WorkTaskAddCtrl', function($scope, $ionicActionSheet, common, seleMenuList) {
    var menus = seleMenuList.menu();

    $scope.seleWarn = '请选择';

    $scope.data = {
        typePageName: 'WorkTaskAddCtrl',
        ATTENTION_PEOPLE: {name:'请选择'},//关注人
        inspectorId: {name:'请选择'},//检查人
        endTime: ''
    };

    $scope.seleDatePicker = function() {
        common.datePicker(function(date) {
            $scope.data.endTime = date;
        })
    }

    $scope.showSeleWarn = function() {
        $ionicActionSheet.show({
            buttons: menus.taskWarn,
            cancelText: '取消',
            buttonClicked: function(index, item) {
                $scope.seleWarn = item.text;
                return true;
            }
        })
    }

    //表单数据
    var formElement = document.querySelector("form");
    var formData = new FormData(formElement);

    $scope.showSelePhoto = function() {
        common.showSelePhoto({
            appendPhone: function(the_file) {
                formData.append("fuJians", the_file, "images.jpg");
            }
        });
    }


    $scope.create = function() {
        var _data = $scope.data;

        var _param = {
            // categoryName: '',
            // importantName: '',
            creatorId: common.userInfo.clientId,
            description: _data.description,
            endTime: "2017-08-30 12:40",
            period: "SUGGEST_DEADLLINE",//固定截止时间，建议截止时间，每日任务 'FIXED_DEADLLINE' or 'SUGGEST_DEADLLINE' or 'DAILY_TASK' 
            status: "WORKING",
            title: _data.title,
            inspectorId: _data.inspectorId.id,//检查人
            userlist: [
                {"userId": common.userInfo.clientId, "userTypeForTask": "RESPONSIBLE_PEOPLE"},
                {"userId": _data.ATTENTION_PEOPLE.id, "userTypeForTask": "ATTENTION_PEOPLE"}
            ],
            zhibanTaskHandle: "0",
            zhibanTaskId: "0",
            dailyTaskId: '0'
        }

        common.formData({
            type: 'create_task',
            body: _param,
            setData: function(json) {
                formData.append("json", json);
            },
            data: formData,
            success: function(data) {
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    };

    if (common.setAuditorUserList.id) {
        if (common.setAuditorUserList._targetName == 'work_task_add_ATTENTION') {
            common._localstorage.ATTENTION_PEOPLE = common.setAuditorUserList;
        } else if (common.setAuditorUserList._targetName == 'work_task_add_inspector') {
            common._localstorage.inspectorId = common.setAuditorUserList;
        }
    }

    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
    }
})

.controller('WorkTaskEditCtrl', function($scope, $stateParams, $ionicActionSheet, common, seleMenuList) {

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

//查看详情
.controller('WorkTaskListDetailsCtrl', function($scope, $stateParams, $ionicActionSheet, $state, $timeout, common) {
    $scope.data = {};

    COMMON.post({
        type: 'task_detail_info',
        data: {
            taskId: $stateParams.id
        },
        success: function(data) {
            $scope.data = data.body;

            console.log(data.body)
        }
    });

    var dataList = {};
    $scope.commentArray = [];

    var initData = function() {
        dataList = {
            currentPage: 0,
            commentArray: []
        };

        $scope.commentArray = [];

        ajaxComments();
    }, ajaxComments = function() {
        COMMON.post({
            type: 'specific_task_comments',
            data: {
                taskId: $stateParams.id,
                currentPage: dataList.currentPage + 1,
            },
            notPretreatment: true,
            success: function(data) {
                if (!data.body) {
                    $scope.notCommentsData = '暂无讨论数据';
                    return;
                }

                var _body = data.body;

                var list = _body.commentArray;

                for (var i = 0, ii = list.length; i < ii; i++) {
                    list[i].nickname = common.nickname(list[i].userName);
                    list[i]._createTime = common.format(list[i].createTime, 'hh:mm');

                    $scope.commentArray.push(list[i]);
                }

                $timeout(function() {
                    $scope.vm.moredata = true;
                }, 1000);
            }
        });
    }

    initData();

    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.commentArray.length < common._pageSize || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
                $scope.vm.moredata = false;
                return;
            }

            $timeout(function () {
                $scope.vm.moredata = false;
                handleAjax();
            }, 1500);
            return true;
        }
    }
    

	$scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '编辑', link: 'work_task_edit'
            }, {
                text: '提交', link: 'work_task_list_details_refer'
            }, {
                text: '确认', link: 'work_task_list_details_approve'
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
.controller('WorkTaskListDetailsAuditCtrl', function($scope, $ionicActionSheet, $stateParams, common) {
    $scope.data = {};

    //任务需要责任人自己提交，然后检查人来确定

    //表单数据
    var formElement = document.querySelector("form");
    var formData = new FormData(formElement);

    $scope.showSelePhoto = function() {
        common.showSelePhoto({
            appendPhone: function(the_file) {
                formData.append("fuJians", the_file, "images.jpg");
            }
        });
    }


    var ajaxSubmit = function(processAction) {
        var _data = $scope.data;

        //processAction：任务状态 （submit/提交， qualified/合格，unqualified/不合格, approve/确定）

        var _param = {
            clientId: common.userInfo.clientId,
            content: _data.content,
            taskId: $stateParams.id,
            processAction: processAction
        }

        common.formData({
            type: 'task_process',
            body: _param,
            setData: function(json) {
                formData.append("json", json);
            },
            data: formData,
            success: function(data) {
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }

    $scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [
                {text: '合格', key: 'qualified'}, 
                {text: '不合格', key: 'unqualified'}
            ],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                common.popup({
                    content: '确定任务' + item.text
                }, function() {
                    ajaxSubmit(item.key);
                })
                return true;
            }
        });
    }
})

//申请延迟
.controller('WorkTaskListDetailsPostponeCtrl', function($scope, $stateParams, common) {
    $scope.data = {};

    $scope.submit = function() {
        COMMON.post({
            type: 'task_delay_application',
            data: {
                taskId: $stateParams.id,
                clientId: common.userInfo.clientId,
                delayDays: $scope.data.delayDays,
                delayReason: $scope.data.delayReason
            },
            success: function(data) {
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }
})

//提交任务
.controller('WorkTaskListDetailsReferCtrl', function($scope, $stateParams, common) {
    $scope.data = {};

    //表单数据
    var formElement = document.querySelector("form");
    var formData = new FormData(formElement);

    $scope.showSelePhoto = function() {
        common.showSelePhoto({
            appendPhone: function(the_file) {
                formData.append("fuJians", the_file, "images.jpg");
            }
        });
    }

    $scope.create = function() {
        var _data = $scope.data;

        var _param = {
            clientId: common.userInfo.clientId,
            content: _data.content,
            taskId: $stateParams.id,
            processAction: 'submit'
        }

        common.formData({
            type: 'create_task_comment',
            body: _param,
            setData: function(json) {
                formData.append("json", json);
            },
            data: formData,
            success: function(data) {
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    };
})

//确定任务
.controller('WorkTaskListDetailsApproveCtrl', function($scope, $stateParams, common) {
    $scope.data = {};

    //表单数据
    var formElement = document.querySelector("form");
    var formData = new FormData(formElement);

    $scope.showSelePhoto = function() {
        common.showSelePhoto({
            appendPhone: function(the_file) {
                formData.append("fuJians", the_file, "images.jpg");
            }
        });
    }

    $scope.create = function() {
        var _data = $scope.data;

        var _param = {
            clientId: common.userInfo.clientId,
            content: _data.content,
            taskId: $stateParams.id,
            processAction: 'approve'
        }

        common.formData({
            type: 'create_task_comment',
            body: _param,
            setData: function(json) {
                formData.append("json", json);
            },
            data: formData,
            success: function(data) {
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    };
})

//讨论
.controller('WorkTaskListDetailsDiscussCtrl', function($scope, $stateParams, common) {
    $scope.data = {};

    //表单数据
    var formElement = document.querySelector("form");
    var formData = new FormData(formElement);

    $scope.showSelePhoto = function() {
        common.showSelePhoto({
            appendPhone: function(the_file) {
                formData.append("fuJians", the_file, "images.jpg");
            }
        });
    }


    $scope.create = function() {
        var _data = $scope.data;

        var _param = {
            clientId: common.userInfo.clientId,
            content: _data.content,
            taskId: $stateParams.id
        }

        common.formData({
            type: 'create_task_comment',
            body: _param,
            setData: function(json) {
                formData.append("json", json);
            },
            data: formData,
            success: function(data) {
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    };
})

