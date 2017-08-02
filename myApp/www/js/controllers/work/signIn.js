angular.module('workSign.controller', [])

.controller('WorkSigInCtrl', function ($scope, $state, $ionicActionSheet, $filter, common, seleMenuList) {
	$scope.historiesList = [];
	$scope.shangBanType = '';

	$scope.hasHistory = true;

	$scope.hasSignIn = false;

	var qianDaoData = {
		qiandaoCanQianDaoSite: true
	}

	var qianDaoRight = 1;//是否正常签到 1 正常； 0 迟到

	var menus = seleMenuList.menu();
	var qianDaoType = menus.qianDaoType;

	$scope.todayDate = common.format(false, 'yyyy-MM-dd') + ' ' + common.getWeek();
	$scope.qianDaoShangBan = '';

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

				var _qiandaoObj = common.getId(qiandaoTimes, item.key, 'qianDaoType');

				if (!_qiandaoObj) {
					$scope.hasSignIn = false;
				} else {
					$scope.hasSignIn = hasSignIn(item.key);
					$scope.qianDaoShangBan = _qiandaoObj.qianDaoShangBan;
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

	    	//localStorage.clear();localStorage.clientId = 152;

	    	console.log(position, '位置')

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

		// nowTime = '11:31';

		var qiandaoTimes = JSON.parse( common.getLocalStorage('qiandaoTimes') );

		if (!qiandaoTimes.length || !qianDaoData.qiandaoCanQianDaoSite) {
			return false;
		}

		if (!$scope.qianDaoShangBan) {
			$scope.qianDaoShangBan = qiandaoTimes[0].qianDaoShangBan;
		}

		var _shangBanNum = 0,
			_xiaBanNum = 0;

		for (var i = 0, ii = qiandaoTimes.length; i < ii; i++) {
			qiandaoTimes[i]._qianDaoShangBan = common.timeNumber(qiandaoTimes[i].qianDaoShangBan);
			qiandaoTimes[i]._qianDaoXiaBan = common.timeNumber(qiandaoTimes[i].qianDaoXiaBan);

			_shangBanNum = common.minusTime(qiandaoTimes[i]._qianDaoShangBan, common.timeNumber(nowTime));
			qiandaoTimes[i].canShangBan = _shangBanNum > 0 ? _shangBanNum < common.getLocalStorage('qiandaoBeforeTime') : false;

			_xiaBanNum = common.minusTime(qiandaoTimes[i]._qianDaoXiaBan, common.timeNumber(nowTime));
			qiandaoTimes[i].canXiaBan = _xiaBanNum > 0 ? _xiaBanNum < common.getLocalStorage('qiandaoBeforeTime') : false;


			if (_shangBanNum < 0 && !$scope.hasHistory)  {
				qiandaoTimes[i].canShangBan = true;
				qianDaoRight = 0;
			}
		}

		for (var i = 0, ii = qiandaoTimes.length; i < ii; i++) {
			if ($scope.shangBanType) {
				if ($scope.shangBanType == qiandaoTimes[i].qianDaoType) {
					if ($scope.hasHistory && qiandaoTimes[i].canXiaBan) {
						return  true;
					} else if (qiandaoTimes[i].canShangBan && !$scope.hasHistory) {
						return true;
					}
				}
			} else {
				if ($scope.hasHistory && qiandaoTimes[i].canXiaBan) {
					return  true;
				} else if (qiandaoTimes[i].canShangBan && !$scope.hasHistory) {
					return true;
				}
			}
		}
	}

	ajaxUserData(function() {
		if (common.format(false, 'yyyy-MM-dd') != common.getLocalStorage('qiandaoApiDate')){
			getSignInData(function(data) {
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
		        	qianDaoRight: qianDaoRight,
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
				common.loadingHide();
			}
		})
	}
})

//签到人员查询
.controller('WorkSigInQueryCtrl', function($scope, $timeout, common) {
	var dataList = {
		currentPage: 0,
		phoneBook: []
	};

	$scope.data = {};

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
        $scope.isSearchVal = false;
        $scope.isSearchTxt = true;
    }, handleSearch = function() {
        initData();
        cancelSearch();
    }
    $scope.showSearch = showSearch;
    $scope.cancelSearch = cancelSearch;
    $scope.handleSearch = handleSearch;
    //搜索--end

	$timeout(function() {
		$('.button_close').click();
	}, 0)

	$scope.items = [];

	var handleAjax = function (isNotLoading) {
		if (isNotLoading) {
			common.loadingShow();
		}

		COMMON.getPhoneBook({
			currentPage: dataList.currentPage + 1,
        	departmentId: seleDepartmentId,
        	name: $scope.data.name
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

.controller('WorkSigInHistoryCtrl', function($scope, $stateParams, $timeout, common) {
    $scope.items = [];

    $scope.data = {
    	searchDate: common.format(false, 'yyyy-MM-dd'),
    	month: common.format(false, 'MM'),
    	year: common.format(false, 'yyyy')
    }

    $timeout(function() {
		common.ionicDatePickerProvider(function(date) {
			
		}, {
			
		});
		
		$timeout(function() {
			$('.ionic_datepicker_popup .popup-body').append('<a href="javascript:history.back(-1)" class="space_back"></a>');

			common.changeDate = function(d) {
				$scope.data.searchDate = common.format(d, 'yyyy-MM-dd', true);
				$scope.data.month = common.format(d, 'MM', true);
    			$scope.data.year = common.format(d, 'yyyy', true);

    			ajaxUserData(true);
			}
		}, 0);
	}, 0)

    //id-》name
    common.getUserinfo_simple($stateParams.id, function(data) {
    	$scope.name = data.name;
    	$scope.nickname = common.nickname(data.name);
    })

    var ajaxUserData = function(isNotLoading) {
    	if (isNotLoading) {
            common.loadingShow();
        }

		//查询已签到
		COMMON.post({
	        type: 'qiandao_user_month_info',
	        data: {
	        	clientId: $stateParams.id,
	        	searchDate: $scope.data.searchDate,
	        	month: $scope.data.month,
	        	year: $scope.data.year
	        },
	        notPretreatment: true,
	        success: function(data) {
	            var _body = data.body,
	            	_list = _body.qianDaoInfos;

	            $scope.items = [];
	            common.loadingHide();

	            var _qianDaoType = {
	            	'XIA_BAN': '签退',
	            	'SHANG_BAN': '签到'
	            }

	            if (_list.length) {
	            	$scope.notTaskListData = false;
	            	for (var i = 0, ii = _list.length; i < ii; i++) {
	            		_list[i]._qianDaoType = _qianDaoType[_list[i].qianDaoType];
	            		_list[i]._qianDaoRight = _list[i].qianDaoRight != '1' ? true : false;
	            	}
	            	$scope.items = _list;
	            } else {
	            	$scope.notTaskListData = common.notTaskListDataTxt;
	            }
	        }
	    });
	}
	ajaxUserData();
})

//签到申请
.controller('WorkSigInApplyCtrl', function($scope, $ionicActionSheet, seleMenuList, common) {
	$scope.data = {
		typePageName: 'WorkSigInApplyCtrl',
		seleOfficeType: '请选择',
		seleApplyType: '请选择',

		qianDaoType: '',
		shangBanType: '',
		reason: ''
	}

	var menus = seleMenuList.menu();
	var qianDaoType = menus.qianDaoType;

	$scope.showOfficeType = function() {
		$ionicActionSheet.show({
			buttons: qianDaoType,
			cancelText: '取消',
			buttonClicked: function(index, item) {
				$scope.data.seleOfficeType = item.text;
				$scope.data.qianDaoType = item.key;

				return true;
			}
		})
	}
	$scope.showApplyType = function() {
		$ionicActionSheet.show({
			buttons: [
				{ text: '签到申请', key: 'SHANG_BAN' },
				{ text: '签退申请', key: 'XIA_BAN' }
			],
			cancelText: '取消',
			buttonClicked: function(index, item) {
				$scope.data.seleApplyType = item.text;
				$scope.data.shangBanType = item.key;

				return true;
			}
		})
	}

	$scope.create = function() {
        var _data = $scope.data;

        var _param = {
            clientId: common.userInfo.clientId,
            qianDaoType: _data.qianDaoType,
            shangBanType: _data.shangBanType,
            reason: _data.reason
        }

        common.post({
            type: 'qiandao_apply',
            data: _param,
            success: function(data) {
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    };
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