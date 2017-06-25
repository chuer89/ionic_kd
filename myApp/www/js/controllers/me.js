angular.module('me.controller', [])

.controller('AccountCtrl', function($scope, common) {

	console.log(common.userInfo);

	$scope.name = '';
	$scope.position = '';

	common.post({
        type: 'userinfo_simple',
        data: {
            // id: common.userInfo.clientId
            id: 3
        },
        success: function(data) {
        	var _data = data.body;

            angular.extend(common.userInfo, _data);

            $scope.name = _data.name;
            $scope.position = _data.position;
        }
    });
})

.controller('MeInfoCtrl', function ($scope, $state, $ionicActionSheet) {
	
})

.controller('MeSetMsgCtrl', function($scope, messageSetList) {
	$scope.items = messageSetList.all();
})

.controller('MeAboutCtrl', function($scope) {
	
})