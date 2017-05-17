angular.module('workTask.controller', [])

.controller('WorkTaskCtrl', function ($scope, $state, $ionicActionSheet, workTaskQuery, workTaskList) {
	
    $scope.items = workTaskList.all();
    $scope.taskList = workTaskList.taskList();

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
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
.controller('WorkTaskAddCtrl', function($scope, $ionicActionSheet) {
    $scope.seleWarn = '请选择';

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

