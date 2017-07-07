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
		common.showSelePhoto();
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

	var handleAjax = function () {
		COMMON.getPhoneBook({
			currentPage: dataList.currentPage + 1,
        	departmentId: 1,
        	name: ''
		}, function(body) {
			var _body = body,
        		phoneBook = _body.phoneBook;

        	dataList = _body;

        	for (var i = 0, ii = phoneBook.length; i < ii; i++) {
        		$scope.items.push(phoneBook[i]);
        	}

        	$timeout(function() {
        		$scope.vm.moredata = true;
        	}, 1000);
		});
	}	

	$scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
    }

    $scope.vm = {
    	moredata: false,
    	loadMore: function() {
    		if (dataList.phoneBook.length < 10 || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
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

 	$scope.nickname = function(name) {
 		return common.nickname(name);
 	}

 	handleAjax();
})



