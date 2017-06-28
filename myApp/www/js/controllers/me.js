angular.module('me.controller', [])

//我
.controller('AccountCtrl', function($scope, common) {

	$scope.name = '';
	$scope.position = '';

	common.post({
        type: 'userinfo_simple',
        data: {
            id: common.userInfo.clientId
        },
        success: function(data) {
        	var _data = data.body;

            angular.extend(common.userInfo, _data);

            $scope.name = _data.name;
            $scope.position = _data.position;
        }
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

.controller('MeAddressCtrl', function($scope, common) {
 	$scope.items = [];

 	$scope.nickname = function(name) {
 		return common.nickname(name);
 	}

    COMMON.post({
        type: 'phone_book',
        data: {
        	id: common.userInfo.clientId,
        	currentPage: 1,
        	departmentId: 1,
        	name: ''
        },
        success: function(data) {
        	var _body = data.body,
        		phoneBook = _body.phoneBook;

        	$scope.items = phoneBook;
        }
    });
})



