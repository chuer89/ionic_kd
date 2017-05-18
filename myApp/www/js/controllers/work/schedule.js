angular.module('workSchedule.controller', [])

.controller('WorkScheduleCtrl', function ($scope, $state, $ionicActionSheet, workScheduleWarn) {
	$scope.items = workScheduleWarn.all();

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
	}
})

//日程详情
.controller('WorkScheduleDetailsCtrl', function($scope, $stateParams, $ionicPopup, $ionicActionSheet, workScheduleWarn) {
	$scope.item = workScheduleWarn.get($stateParams.id);

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
.controller('WorkScheduleAddCtrl', function($scope, $ionicActionSheet) {
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
})

//我的日程
.controller('WorkScheduleMyCtrl', function($scope, workScheduleWarn) {
	$scope.items = workScheduleWarn.all();

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
	}
})

