angular.module('workSign.controller', [])

.controller('WorkSigInCtrl', function ($scope, $state, $ionicActionSheet, $filter, common, seleMenuList) {
	$scope.historiesList = [];
	$scope.shangBanType = '';

	$scope.hasHistory = true;

	$scope.hasSignIn = false;

	var qianDaoData = {
		qiandaoCanQianDaoSite: true
	}

	var menus = seleMenuList.menu();
	var qianDaoType = menus.qianDaoType;

	$scope.todayDate = common.format(false, 'yyyy-MM-dd') + ' ' + common.getWeek();

	var ajaxUserData = function(cb) {
		//查询已签到
		COMMON.post({
	        type: 'qiandao_user_date_info',
	        data: {
	        	clientId: common.userInfo.clientId,
	        	searchDate: common.format( false, 'yyyy-MM-dd')
	        },
	        success: function(data) {
	            var _body = data.body;

	            if (_body.histories && _body.histories.length) {
	            	$scope.hasHistory = true;
	            	$scope.historiesList = _body.histories;
	            } else {
	            	$scope.hasHistory = false;
	            	$scope.historiesList = [];
	            }

	            if (typeof cb == 'function') {
	            	cb();
	            }
	        }
	    });
	}

	

	$scope.seleType = '请选择';

	$scope.showType = function() {
		$ionicActionSheet.show({
			buttons: qianDaoType,
			cancelText: '取消',
			buttonClicked: function(index, item) {
				$scope.seleType = item.text;
				$scope.shangBanType = item.key;

				var qiandaoTimes = JSON.parse( common.getLocalStorage('qiandaoTimes') );
				if (!common.getId(qiandaoTimes, item.key, 'qianDaoType')) {
					$scope.hasSignIn = false;
				} else {
					$scope.hasSignIn = hasSignIn();
				}

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

	var getSignInData = function(cb) {
		common.toast('位置获取中，请稍等...');

		//地理位置
	    common.getLocation(function(position) {
	    	var _coords = position.coords;

	    	console.log(position)

			COMMON.post({
		        type: 'qiandao_distance',
		        data: {
		        	clientId: common.userInfo.clientId,
		        	jingDu: _coords.longitude + '',
		        	weiDu: _coords.latitude + ''
		        },
		        success: function(data) {
		        	common.setLocalStorage('qiandaoBeforeTime', data.body.applyBeforeTime);
		        	common.setLocalStorage('qiandaoTimes', JSON.stringify(data.body.times));
		        	common.setLocalStorage('qiandaoApiDate', common.format(false, 'yyyy-MM-dd'));
		        	qianDaoData.qiandaoCanQianDaoSite = data.body.canQianDao;

		        	if (typeof cb == 'function') {
		        		cb(data);
		        	}
		        }
		    });
	    });
	}

	var hasSignIn = function() {
		var nowTime = common.format(false, 'HH:mm');

		// nowTime = '17:35';

		var qiandaoTimes = JSON.parse( common.getLocalStorage('qiandaoTimes') );

		if (!qiandaoTimes.length || !qianDaoData.qiandaoCanQianDaoSite) {
			return false;
		}

		var _shangBanNum = 0,
			_xiaBanNum = 0;
		
		for (var i = 0, ii = qiandaoTimes.length; i < ii; i++) {
			qiandaoTimes[i]._qianDaoShangBan = common.timeNumber(qiandaoTimes[i].qianDaoShangBan);
			qiandaoTimes[i]._qianDaoXiaBan = common.timeNumber(qiandaoTimes[i].qianDaoXiaBan);

			_shangBanNum = common.minusTime(qiandaoTimes[i]._qianDaoShangBan, common.timeNumber(nowTime));
			qiandaoTimes[i].canShangBan = _shangBanNum < common.getLocalStorage('qiandaoBeforeTime');

			_xiaBanNum = common.minusTime(qiandaoTimes[i]._qianDaoXiaBan, common.timeNumber(nowTime));
			qiandaoTimes[i].canXiaBan = _xiaBanNum < common.getLocalStorage('qiandaoBeforeTime');

			if ($scope.hasHistory && qiandaoTimes[i].canXiaBan) {
				return true;
			} else if (qiandaoTimes[i].canShangBan && !$scope.hasHistory) {
				return true;
			}
		}
	}

	ajaxUserData(function() {
		if (common.format(false, 'yyyy-MM-dd') != common.getLocalStorage('qiandaoApiDate')){
			getSignInData(function() {
				$scope.hasSignIn = hasSignIn();
			});
		} else {
			$scope.hasSignIn = hasSignIn();
		}
	});

	//发送签到
	$scope.sub = function (type) {
		var _type = 'XIA_BAN';
		if (type == 1) {
			_type = 'SHANG_BAN'
		}

		if (!$scope.shangBanType) {
			common.toast('请选择签到类型');return;
		}

		var ajax = function(qianDaoPlace) {
			COMMON.post({
		        type: 'qiandao_submit',
		        data: {
		        	clientId: common.userInfo.clientId,
		        	qianDaoRight: '1',
		        	qianDaoPlace: qianDaoPlace,
		        	qianDaoType: _type,
		        	shangBanType: $scope.shangBanType
		        },
		        success: function(data) {
		            var _body = data.body;
		            common.loadingHide();

		            ajaxUserData();
		        }
		    });
		}

		common.loadingShow();

		getSignInData(function(data) {
			if (hasSignIn()) {
				ajax(data.body.place.qianDaoPlace);
			} else {
				common.toast('当前位置或时间不支持签到');
			}
		})
	}
})

//签到人员查询
.controller('WorkSigInQueryCtrl', function($scope, workHistoryQuery, $timeout, common) {
	var dataList = {
		currentPage: 0,
		phoneBook: []
	};

	$scope.items = [];

	var handleAjax = function (isNotLoading) {
		if (isNotLoading) {
			common.loadingShow();
		}

		COMMON.getPhoneBook({
			currentPage: dataList.currentPage + 1,
        	departmentId: seleDepartmentId,
        	name: ''
		}, function(body) {
			common.loadingHide();
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
	 			handleAjax(true);
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

.controller('WorkSigInHistoryCtrl', function($scope, $stateParams, common) {
    $scope.openDatePicker = function(){
    	common.datePicker(function(date) {

    	})
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