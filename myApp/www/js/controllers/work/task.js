angular.module('workTask.controller', [])


//'DECLARATION'or 'WORKING' or 'UNCONFIRMED' or 'QUALIFIED' or 'UNQUALIFIED' 
//(申报，工作中，未确认，合格，不合格) default 'DECLARATION'
// 责任人申报状态：DECLARATION
// 检查人确认后状态：WORKING
// 责任人提交后状态：UNCONFIRMED
// 检查人审批后：QUALIFIED 或者 UNQUALIFIED

//任务状态  //'DECLARATION'or 'WORKING' or 'UNCONFIRMED' or 'QUALIFIED' or 'UNQUALIFIED' 
//(申报，工作中，未确认，合格，不合格) default 'DECLARATION'


// 按钮是否可见
// 编辑：责任人和检查人都可以见，任务状态不是QUALIFIED或者UNQUALIFIED
// 提交：责任人可见，任务状态是WORKING
// 确认：检查人可见，任务状态是DECLARATION
// 审核：检查人可见，任务状态是UNCONFIRMED
// 申请延期：责任人可见，任务状态是WORKING
// 添加讨论:都可见

.controller('WorkTaskCtrl', function ($scope, $state, $ionicActionSheet, $timeout, workTaskList, common, seleMenuList) {
	var dataList = {
        currentPage: 0,
        tasks: []
    };

    common.clearSetData();

    var menus = seleMenuList.menu();

    var taskStatus = menus.taskStatus;

    $scope.tabs = [
        {name:'待办', type: 'DAIBAN'},
        {name:'已完成', type: 'CONFIRMED'},
        {name:'发起', type: 'CREATED'},
        {name:'关注', type: 'GUANZHU'},
        {name:'检查', type: 'TOBECHECK'}
    ];
    $scope.taskList = [];
    $scope.data = {};

    var handleAjax = function(isNotLoading) {
        if (isNotLoading) {
            common.loadingShow();
        }

        COMMON.post({
            type: 'obtain_my_tasks',
            data: {
                "userId": common.userInfo.clientId,
                "currentPage": dataList.currentPage + 1,
                "myTaskStatus": $scope.data.myTaskStatus
            },
            notPretreatment: true,
            success: function(data) {
                var _body = data.body;
                common.loadingHide();

                if (!_body.tasks || (typeof _body.tasks == 'object' && !_body.tasks.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                var tasks = _body.tasks;

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
    }, initAjax = function(isInitTab, isNotLoading) {
        if (isInitTab) {
            $scope.tabs[0].isShowTab = true;
            $scope.data.myTaskStatus = $scope.tabs[0].type;
        }

        $scope.taskList = [];
        dataList.currentPage = 0;
        handleAjax(isNotLoading);
    }
    initAjax(true, true);

    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.tasks.length < common._pageSize || dataList.currentPage == dataList.total || dataList.total <= 1) {
                $scope.vm.moredata = false;
                return;
            }

            $timeout(function () {
                $scope.vm.moredata = false;
                handleAjax(true);
            }, 1500);
            return true;
        }
    }

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            initAjax(false, true);
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
        
        handleAjax(true);
    }
})

//任务查询
.controller('WorkTaskQueryCtrl', function($scope, $timeout, common) {
    var dataList = {
        currentPage: 0,
        phoneBook: []
    };

    $scope.data = {
        keywords: ''
    }

    common.clearSetData();

    $scope.items = [];

    //搜索--start
    $scope.isSearchVal = false;
    $scope.isSearchTxt = true;
    var showSearch = function() {
        $scope.isSearchVal = true;
        $scope.isSearchTxt = false;

        $timeout(function() {
            $('#js_search').focus().on('keypress', function(e) {
                var _keyCode = e.keyCode;
                if (_keyCode == 13) {
                    //搜索
                    handleSearch();
                    return false;
                }
            })
        }, 200)
    }, cancelSearch = function() {
        clearSearchData();
    }, handleSearch = function() {
        $scope.isSearchVal = false;
        $scope.isSearchTxt = true;

        initData();
    }, clearSearchData = function() {
        $scope.data.keywords = '';
        handleSearch();
    }
    $scope.showSearch = showSearch;
    $scope.cancelSearch = cancelSearch;
    $scope.handleSearch = handleSearch;
    //搜索--end

    var handleAjax = function () {
        common.loadingShow();

        COMMON.getPhoneBook({
            currentPage: dataList.currentPage + 1,
            departmentId: seleDepartmentId,
            name: $scope.data.keywords
        }, function(body) {
            common.loadingHide();

            if (!body) {
                $scope.notTaskListData = common.notTaskListDataTxt;
                return;
            } else {
                $scope.notTaskListData = false;
            }

            var _body = body,
                phoneBook = _body.phoneBook;

            dataList = _body;

            for (var i = 0, ii = phoneBook.length; i < ii; i++) {
                phoneBook[i].nickname = common.nickname(phoneBook[i].name);
                $scope.items.push(phoneBook[i]);
            }

            $timeout(function() {
                $scope.vm.moredata = true;
            }, 1000);
        });
    }, initData = function() {
        dataList = {
            currentPage: 0,
            phoneBook: []
        };

        $scope.items = [];

        handleAjax();
    }

    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.phoneBook.length < common._pageSize || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
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
    

    //选择部门-start

    var seleDepartmentId = '';

    $scope.seleBrank = [];
    $scope.seleDepartment = [];

    $scope.seleBrankInfo = '品牌';
    $scope.seleDepartmentInfo = '部门';

    $scope.isShowBrankSele = false;
    $scope.isShowDepartmentSele = false;

    //选择菜单处理
    var toggleSeleHandle = function(type, isAjax) {
        if (type == 'brank') {
            $scope.isShowDepartmentSele = false;

            $scope.isShowBrankSele = !$scope.isShowBrankSele;
        } else if (type == 'department') {
            $scope.isShowBrankSele = false;

            if (!$scope.seleDepartment.length) {
                common.toast('请选择正确品牌');
                return;
            }

            $scope.isShowDepartmentSele = !$scope.isShowDepartmentSele;
        }

        if (isAjax) {
            initData();
        }
    }

    //选择部门
    var _seleBrankHandle = function(item) {
        seleDepartmentId = item.departmentId;

        $scope.seleBrankInfo = item.name;
        $scope.seleDepartmentInfo = '部门';

        $scope.seleDepartment = item.childDepartment;
    }
    
    $scope.seleBrankHandle = function(item) {
        _seleBrankHandle(item);

        toggleSeleHandle('brank', true);
    }
    $scope.seleDepartmentHandle = function(item) {
        seleDepartmentId = item.departmentId;
        $scope.seleDepartmentInfo = item.name;

        toggleSeleHandle('department', true);
    }

    //筛选切换
    $scope.toggleSele = function(type) {
        toggleSeleHandle(type);
    }

    //加载部门&公司
    common.getCompany(function(data) {
        $scope.seleBrank = data;

        _seleBrankHandle(data[0]);
        initData();
    });

    //选择部门-end
})

//创建任务
.controller('WorkTaskAddCtrl', function($scope, $ionicActionSheet, common, seleMenuList) {
    var menus = seleMenuList.menu();

    $scope.seleWarn = '请选择';

    $scope.data = {
        typePageName: 'WorkTaskAddCtrl',
        ATTENTION_PEOPLE: {name:'请选择'},//关注人
        inspectorId: {name:'请选择'},//检查人
        endTime: '',
        remindtime: '',
        hasCameraImg: false
    };

    $scope.seleDate = function() {
        common.datePicker(function(date) {
            $scope.data.endTime = date;
        }, true);
    }

    $scope.showSeleWarn = function() {
        $ionicActionSheet.show({
            buttons: menus.taskWarn,
            cancelText: '取消',
            buttonClicked: function(index, item) {
                $scope.seleWarn = item.text;
                $scope.data.remindtime = item.key;
                return true;
            }
        })
    }

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


    $scope.create = function() {
        var _data = $scope.data;

        var _param = {
            creatorId: common.userInfo.clientId,
            description: _data.description,
            endTime: $scope.data.endTime,
            period: "SUGGEST_DEADLLINE",//固定截止时间，建议截止时间，每日任务 'FIXED_DEADLLINE' or 'SUGGEST_DEADLLINE' or 'DAILY_TASK' 
            status: "DECLARATION",
            title: _data.title,
            remindtime: _data.remindtime,
            inspectorId: _data.inspectorId.id + '',//检查人
            userlist: [
                {"userId": common.userInfo.clientId + '', "userTypeForTask": "RESPONSIBLE_PEOPLE"},
                {"userId": _data.ATTENTION_PEOPLE.id + '', "userTypeForTask": "ATTENTION_PEOPLE"}
            ],
            zhibanTaskHandle: "0",
            zhibanTaskId: "0",
            dailyTaskId: '0'
        }

        if (!_param.endTime || !_param.title || !_param.description) {
            common.toast('请填写必填信息');
            return;
        }

        common.loadingShow();
        common.formData({
            type: 'create_task',
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

//编辑任务
.controller('WorkTaskEditCtrl', function($scope, $stateParams, $ionicActionSheet, common, seleMenuList) {
    var taskId = $stateParams.id;

    var menus = seleMenuList.menu();
    var taskStatus = menus.taskStatus;

    $scope.seleWarn = '请选择';
    
    $scope.data = {
        typePageName: 'WorkTaskEditCtrl',
        ATTENTION_PEOPLE: {name:'请选择'},//关注人
        inspectorId: {name:'请选择'},//检查人
        endTime: '',
        remindtime: ''
    };

    $scope.seleDate = function() {
        common.datePicker(function(date) {
            $scope.data.endTime = date;
        }, true);
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

    var getDetails = function() {
        //任务详情
        common.post({
            type: 'task_detail_info',
            data: {
                taskId: taskId
            },
            success: function(data) {
                data.body.taskBasiInfo._status = common.getId(taskStatus, data.body.taskBasiInfo.status, 'key').name;
                
                var _body = data.body;

                angular.extend($scope.data, {
                    description: _body.taskBasiInfo.taskDescription,
                    title: _body.taskBasiInfo.taskTitle,
                    endTime: _body.taskBasiInfo.endTime,
                    remindtime: _body.taskBasiInfo.remindtime,
                    ATTENTION_PEOPLE: {
                        name: _body.guangzhurenArray[0].userName,
                        id: _body.guangzhurenArray[0].userId
                    },
                    taskImageArray: _body.taskImageArray,
                    status: _body.taskBasiInfo.status
                });

                common.getUserinfo_simple(_body.taskBasiInfo.inspectorId, function(data) {
                    $scope.data.inspectorId = {
                        name: data.name,
                        id: _body.taskBasiInfo.inspectorI
                    };
                });

                $scope.seleWarn = common.getId(menus.taskWarn, _body.taskBasiInfo.remindtime, 'key').text;
            }
        });
    }

    $scope.update = function() {
        var _data = $scope.data;

        var _param = {
            creatorId: common.userInfo.clientId,
            description: _data.description,
            endTime: $scope.data.endTime,
            period: "SUGGEST_DEADLLINE",//固定截止时间，建议截止时间，每日任务 'FIXED_DEADLLINE' or 'SUGGEST_DEADLLINE' or 'DAILY_TASK' 
            status: $scope.data.status,
            title: _data.title,
            inspectorId: _data.inspectorId.id + '',//检查人
            userlist: [
                {"userId": common.userInfo.clientId + '', "userTypeForTask": "RESPONSIBLE_PEOPLE"},
                {"userId": _data.ATTENTION_PEOPLE.id + '', "userTypeForTask": "ATTENTION_PEOPLE"}
            ],
            zhibanTaskHandle: "0",
            zhibanTaskId: "0",
            dailyTaskId: '0',
            taskId: taskId
        }

        common.loadingShow();
        common.post({
            type: 'update_task_info',
            data: _param,
            success: function(data) {
                common.loadingHide();
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
        getDetails();
        common._localstorage = $scope.data;
    }
})

//查看的任务列表
.controller('WorkTaskListCtrl', function($scope, $stateParams, $timeout, workTaskList, common, seleMenuList) {
	var dataList = {
        currentPage: 0,
        tasks: []
    };

    common.clearSetData();

    //id-》name
    common.getUserinfo_simple($stateParams.id, function(data) {
        $scope.name = '-'+data.name;
    })

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

    var handleAjax = function(isNotLoading) {
        if (isNotLoading) {
            common.loadingShow();
        }

        COMMON.post({
            type: 'obtain_my_tasks',
            data: {
                "userId": $stateParams.id,
                "currentPage": dataList.currentPage + 1,
                "myTaskStatus": $scope.data.myTaskStatus
            },
            notPretreatment: true,
            success: function(data) {
                var _body = data.body;
                common.loadingHide();

                if (!_body.tasks || (typeof _body.tasks == 'object' && !_body.tasks.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                var tasks = _body.tasks;

                dataList = _body;

                for (var i = 0, ii = tasks.length; i < ii; i++) {
                    if (tasks[i].taskStatus) {
                        tasks[i]._endTime = common.format(tasks[i].endTime);
                        tasks[i]._status = common.getId(taskStatus, tasks[i].taskStatus, 'key').name;

                        $scope.taskList.push(tasks[i]);
                    }
                }

                $timeout(function() {
                    $scope.vm.moredata = true;
                }, 1000);
            }
        });
    }, initAjax = function(isInitTab, isNotLoading) {
        if (isInitTab) {
            $scope.tabs[0].isShowTab = true;
            $scope.data.myTaskStatus = $scope.tabs[0].type;
        }

        $scope.taskList = [];
        dataList.currentPage = 0;
        handleAjax(isNotLoading);
    }
    initAjax(true, true);

    $scope.vm = {
        moredata: false,
        loadMore: function() {

            if (dataList.tasks.length < common._pageSize || dataList.currentPage == dataList.total || dataList.total <= 1) {
                $scope.vm.moredata = false;
                return;
            }

            $timeout(function () {
                $scope.vm.moredata = false;
                handleAjax(true);
            }, 1500);
            return true;
        }
    }

    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            initAjax(false, true);
        }, 1000)
        return true;
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
        
        handleAjax(true);
    }
})

//查看详情
.controller('WorkTaskListDetailsCtrl', function($scope, $stateParams, $ionicActionSheet, $state, $timeout, common, seleMenuList) {
    $scope.data = {};

    var menus = seleMenuList.menu();
    var taskStatus = menus.taskStatus;

    common.clearSetData();

    var urlId = $stateParams.id,
        taskId = $stateParams.id;

    var navMenus = [];

    var getNavMenus = function(data) {
        var _clientId = common.userInfo.clientId;
        var _status = data.taskBasiInfo.status;
        var _zerenren = data.zerenrenArray[0].userId;//责任人
        var _creatorId = data.taskBasiInfo.creatorId;//创建人
        var _inspectorId = data.taskBasiInfo.inspectorId;//检查人

        //编辑：责任人和检查人都可以见，任务状态不是QUALIFIED或者UNQUALIFIED
        if ( (_clientId == _zerenren || _clientId == _inspectorId)
            && (_status != 'QUALIFIED' || _status != 'UNQUALIFIED')
            ){
            navMenus.push({text: '编辑', link: 'work_task_edit'})
        }

        //提交：责任人可见，任务状态是WORKING
        if (_clientId == _zerenren && _status == 'WORKING') {
            navMenus.push({text: '提交', link: 'work_task_list_details_refer'})
        }

        // 确认：检查人可见，任务状态是DECLARATION
        if (_clientId == _inspectorId && _status == 'DECLARATION') {
            navMenus.push({text: '确认', link: 'work_task_list_details_approve'})
        }

        //审核：检查人可见，任务状态是UNCONFIRMED
        if (_clientId == _inspectorId && _status == 'UNCONFIRMED') {
            navMenus.push({text: '审核', link: 'work_task_list_details_audit'})
        }

        //申请延期：责任人可见，任务状态是WORKING
        if (_clientId == _inspectorId && _status == 'WORKING') {
            navMenus.push({text: '申请延期', link: 'work_task_list_details_postpone'})
        }

        //添加讨论:都可见
        navMenus.push({text: '添加讨论', link: 'work_task_list_details_Discuss'})
    }

    if (urlId.indexOf('_push_') > 0) {
        taskId = urlId.split('_push_')[1];

        common.getMessageDetails(urlId, 'TASK', function(data) {
            data.body.taskBasiInfo._status = common.getId(taskStatus, data.body.taskBasiInfo.status, 'key').name;

            $scope.data = data.body;
        });
    } else {
        //任务详情
        common.loadingShow();
        COMMON.post({
            type: 'task_detail_info',
            data: {
                taskId: taskId
            },
            success: function(data) {
                common.loadingHide();

                common.getUserinfo_simple(data.body.taskBasiInfo.inspectorId, function(data) {
                    $scope.inspectorIdName = data.name;
                })


                // data.body.taskBasiInfo.taskDescription = common.replaceNext(data.body.taskBasiInfo.taskDescription);
                
                data.body.taskBasiInfo._status = common.getId(taskStatus, data.body.taskBasiInfo.status, 'key').name;

                $scope.data = data.body;

                getNavMenus(data.body);
            }
        });
    }

    //图片预览
    $scope.previewImg = function($index) {
        common.previewImg({
            allimgs: $scope.data.taskImageArray,
            $index: $index,
            imgSrcKey: 'path'
        })
    }

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
        //评论
        COMMON.post({
            type: 'specific_task_comments',
            data: {
                taskId: taskId,
                currentPage: dataList.currentPage + 1,
            },
            notPretreatment: true,
            success: function(data) {
                var _body = data.body;

                if (!_body || (_body && !_body.commentArray) || (_body && _body.commentArray && !_body.commentArray.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                var list = _body.commentArray;

                for (var i = 0, ii = list.length; i < ii; i++) {
                    list[i].nickname = common.nickname(list[i].userName);
                    list[i]._createTime = common.format(list[i].createTime, 'MM-dd HH:mm');

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
                ajaxComments();
            }, 1500);
            return true;
        }
    }
    

	$scope.showNav = function() {
        if (navMenus.length) {

        } else {
            common.toast(common.noAuthLimitsTxt);
            return false;
        }

        $ionicActionSheet.show({
            buttons: navMenus,
            cancelText: '取消',
            buttonClicked: function (index, item) {
                $state.go(item.link, {
                    id: taskId
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

    $scope.create = function() {
        var _data = $scope.data;

        var _param = {
            clientId: common.userInfo.clientId,
            content: _data.content,
            taskId: $stateParams.id,
            processAction: 'submit'
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
    };
})

//确定任务
.controller('WorkTaskListDetailsApproveCtrl', function($scope, $stateParams, common) {
    $scope.data = {};

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

    $scope.submit = function() {
        var _data = $scope.data;

        var _param = {
            clientId: common.userInfo.clientId,
            content: _data.content,
            taskId: $stateParams.id,
            processAction: 'approve'
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
    };
})

//讨论
.controller('WorkTaskListDetailsDiscussCtrl', function($scope, $stateParams, common) {
    $scope.data = {};

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

