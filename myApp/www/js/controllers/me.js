angular.module('me.controller', [])

//我
.controller('AccountCtrl', function($scope, common) {

	$scope.name = '';
	$scope.position = '';

	common.getUserinfo_simple(common.userInfo.clientId, function(_data) {
		angular.extend(common.userInfo, _data);

        $scope.name = _data.name;
        $scope.position = _data.position;

        $scope.nickname = common.nickname(_data.name);

        console.log(_data)
	});
})

//个人信息
.controller('MeInfoCtrl', function ($scope, $state, $ionicActionSheet, $ionicPopup, common) {
	$scope.item = {};

	COMMON.post({
        type: 'userinfo_detail',
        data: {
            id: common.userInfo.clientId,
            searchId: common.userInfo.clientId
        },
        success: function(data) {
        	var _data = data.body;
        	console.log(data)
        	$scope.item = _data;
        }
    });

    var obj = {
    	name: '姓名',
    	mobile: '手机号',
    	email: '邮箱',
    	address: '地址'
    }

    $scope.showPopup = function(key) {

		if (!key) {
			return;
		}

		$scope.data = {
			val: $scope.item[key]
		};

		// 自定义弹窗
		var myPopup = $ionicPopup.show({
			template: '<input type="text" ng-model="data.val"/>',
			title: '修改'+obj[key],
			scope: $scope,
			buttons: [
				{ text: '取消' },
				{
					text: '<b>确认</b>',
					type: 'button-royal',
					onTap: function(e) {
						if (!$scope.data.val) {
							//必须输入
							e.preventDefault();
						} else {
							return $scope.data.val;
						}
					}
				}
			]
		});

		myPopup.then(function(res) {
			if (!res) {
				return;
			}
			
			var _param = {
				id: common.userInfo.clientId
			};

			_param[key] = res;

			COMMON.post({
		        type: 'change_userinfo',
		        data: _param,
		        success: function(data) {
		        	$scope.item[key] = res;
		        }
		    });
		});
	};

	$scope.showSelePhoto = function() {
		//表单数据
	    var formElement = document.querySelector("form");
	    var formData = new FormData(formElement);

		common.showSelePhoto({
            appendPhone: function(the_file) {
                formData.append("fuJians", the_file, "images.jpg");

                common.formData({
		            type: 'change_userinfo',
		            body: {
		                id: common.userInfo.clientId
		            },
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
        });
	};
})

.controller('MeSetMsgCtrl', function($scope, messageSetList, common) {
	$scope.items = messageSetList.all();
})

.controller('MeAboutCtrl', function($scope) {
	
})

.controller('MeAddressCtrl', function($scope, $timeout, common) {
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

//通讯录详细
.controller('MeAddressGuysCtrl', function($scope, $stateParams, common) {
	$scope.item = {};

	common.loadingShow();
	COMMON.post({
        type: 'userinfo_detail',
        data: {
            id: common.userInfo.clientId,
            searchId: $stateParams.id
        },
        success: function(data) {
        	common.loadingHide();
        	var _data = data.body;
        	_data.nickname = common.nickname(_data.name);
        	console.log(data)
        	$scope.item = _data;

        }
    });
})


