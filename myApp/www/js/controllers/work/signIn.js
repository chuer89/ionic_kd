angular.module('workSign.controller', [])

.controller('WorkSigInCtrl', function ($scope, $state, $ionicActionSheet, $cordovaGeolocation, common, seleMenuList) {
	$scope.historiesList = [];
	$scope.qiandaoUser = {};
	$scope.shangBanType = '';

	$scope.hasHistory = false;

	var menus = seleMenuList.menu();
	var qianDaoType = menus.qianDaoType;

	var ajaxUserData = function() {
		//查询已签到
		COMMON.post({
	        type: 'qiandao_user_date_info',
	        data: {
	        	clientId: common.userInfo.clientId,
	        	searchDate: '2017-07-15'
	        },
	        success: function(data) {
	            var _body = data.body;

	            if (_body.histories && _body.histories.length) {
	            	$scope.hasHistory = true;
	            	$scope.historiesList = _body.histories;
	            }

	            console.log(_body.histories)
	        }
	    });
	}

	ajaxUserData();

    COMMON.post({
        type: 'qiandao_info_get',
        data: {
        	clientId: common.userInfo.clientId
        },
        success: function(data) {
            var _body = data.body;

            $scope.qiandaoUser = _body;

            console.log(_body, 'x');
        }
    });

	//地理位置
    common.getLocation(function(position) {
    	console.log(position, 'weizhi');
    });

	$scope.seleType = '请选择';

	$scope.showType = function() {
		$ionicActionSheet.show({
			buttons: qianDaoType,
			cancelText: '取消',
			buttonClicked: function(index, item) {
				$scope.seleType = item.text;
				$scope.shangBanType = item.key;

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

	//发送签到
	$scope.sub = function (type) {
		var _type = 'XIA_BAN';
		if (type == 1) {
			_type = 'SHANG_BAN'
		}

		COMMON.post({
	        type: 'qiandao_submit',
	        data: {
	        	clientId: common.userInfo.clientId,
	        	qianDaoRight: '1',
	        	qianDaoPlace: '妈妈皮单鞋高跟鞋003',
	        	qianDaoType: _type,
	        	shangBanType: $scope.shangBanType
	        },
	        success: function(data) {
	            var _body = data.body;

	            ajaxUserData();
	        }
	    });
	}

	//定位
	var posOptions = {timeout: 10000, enableHighAccuracy: false};
	$cordovaGeolocation
	.getCurrentPosition(posOptions)
	.then(function (position) {
		var lat  = position.coords.latitude;
		var long = position.coords.longitude;
		console.log(lat)
	}, function(err) {
		// error
	});
})

//签到人员查询
.controller('WorkSigInQueryCtrl', function($scope, workHistoryQuery, $timeout, common) {
	var dataList = {
		currentPage: 0,
		phoneBook: []
	};

	$scope.items = [];

	var handleAjax = function () {
		COMMON.getPhoneBook({
			currentPage: dataList.currentPage + 1,
        	departmentId: seleDepartmentId,
        	name: ''
		}, function(body) {
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
	 		console.log(dataList.totalPage, 'x');

    		$timeout(function () {
    			$scope.vm.moredata = false;
	 			handleAjax();
	        }, 1500);
	        return true;
	 	}
    }
 	initData();

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

    //加载部门&公司
    common.getCompany(function(data) {
        $scope.seleBrank = data;
    })

    //选择部门
    $scope.seleBrankHandle = function(item) {
        seleDepartmentId = item.departmentId;

        $scope.seleBrankInfo = item.name;
        $scope.seleDepartmentInfo = '部门';

        $scope.seleDepartment = item.childDepartment;

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
    //选择部门-end
})

.controller('WorkSigInHistoryCtrl', function($scope, $stateParams, workHistoryQuery, ionicDatePicker, common) {
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

    $scope.items = [];

    var ajaxUserData = function() {
		//查询已签到
		COMMON.post({
	        type: 'qiandao_user_date_info',
	        data: {
	        	clientId: $stateParams.id,
	        	searchDate: '2017-07-14'
	        },
	        success: function(data) {
	            var _body = data.body,
	            	_list = _body.histories;

	            if (_list) {
	            	for (var i = 0, ii = _list.length; i < ii; i++) {
	            		_list[i].nickname = common.nickname(_list[i].name);
	            	}
	            	$scope.items = _list;
	            }

	            console.log(_body)
	        }
	    });
	}
	ajaxUserData();
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