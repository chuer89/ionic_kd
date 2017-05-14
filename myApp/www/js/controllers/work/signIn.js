angular.module('workSign.controller', [])

.controller('WorkSigInCtrl', function ($scope, $state, $ionicActionSheet) {
	$scope.seleType = '请选择';

	$scope.showType = function() {
		$ionicActionSheet.show({
			buttons: [
				{ text: '早班' },
				{ text: '晚班' },
				{ text: '正常班' }
			],
			cancelText: '取消',
			buttonClicked: function(index, item) {
				$scope.seleType = item.text;
				return true;
			}
		})
	}

	$scope.showNav = function () {
		$ionicActionSheet.show({
			buttons: [
				{ text: '查询' },
				{ text: '申请' },
				{ text: '设置' }
			],
			buttonClicked: function(index, item) {
				var _go = 'work_sign_in_query';

                if (index == 1) {
                    _go = 'work_sign_in_apply';
                } else if (index == 2) {
                	_go = 'work_sign_in_set';
                }

                $state.go(_go);
				return true;
			}
		})
	}
})

.controller('WorkSigInQueryCtrl', function($scope, workHistoryQuery) {
	$scope.items = workHistoryQuery.all();

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
	}
})

.controller('WorkSigInHistoryCtrl', function($scope, $stateParams, workHistoryQuery, ionicDatePicker) {
	$scope.item = workHistoryQuery.get($stateParams.id);

	var ipObj1 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      },
      // disabledDates: [            //Optional
      //   new Date(2016, 2, 16),
      //   new Date(2015, 3, 16),
      //   new Date(2015, 4, 16),
      //   new Date(2015, 5, 16),
      //   new Date('Wednesday, August 12, 2015'),
      //   new Date("08-16-2016"),
      //   new Date(1439676000000)
      // ],
      from: new Date(2012, 1, 1), //Optional
      to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };
})

.controller('WorkSigInApplyCtrl', function($scope, $ionicActionSheet) {
	$scope.data = {
		seleOfficeType: '请选择',
		seleApplyType: '请选择'
	}

	$scope.showOfficeType = function() {
		$ionicActionSheet.show({
			buttons: [
				{ text: '早班' },
				{ text: '中班' },
				{ text: '晚班' }
			],
			cancelText: '取消',
			buttonClicked: function(index, item) {
				$scope.data.seleOfficeType = item.text;
				return true;
			}
		})
	}

	$scope.showApplyType = function() {
		$ionicActionSheet.show({
			buttons: [
				{ text: '签到申请' },
				{ text: '签退申请' }
			],
			cancelText: '取消',
			buttonClicked: function(index, item) {
				$scope.data.seleApplyType = item.text;
				return true;
			}
		})
	}
})

.controller('WorkSigInSetCtrl', function($scope, $ionicActionSheet) {
	$scope.data = {
		seleWarnType : '请选择'
	}

	$scope.showWarnType = function() {
		$ionicActionSheet.show({
			buttons: [
				{ text: '5分钟' },
				{ text: '10分钟' },
				{ text: '15分钟' }
			],
			cancelText: '取消',
			buttonClicked: function(index, item) {
				$scope.data.seleWarnType = item.text;
				return true;
			}
		})
	}
})