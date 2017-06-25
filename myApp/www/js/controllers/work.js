angular.module('work.controller', [])

//
.controller('WorkCtrl', function($scope, $state, $http, workPlatform) {
    $scope.data = {};

    $scope.items = workPlatform.all();
    $scope.itemsCrm = workPlatform.crm();
    $scope.itemsLearn = workPlatform.learn();

    $http({
    	method: 'POST',
    	url: 'http://123.206.95.25:18080/kuaidao/client/resources.html',
    	params: {
    		// json: '{"appType":"IOS","appVersion":"1.0.0","body":{},"businessType":"departmrnt_info"}'
            json: '{"appType":"IOS","appVersion":"1.0.0","body":{"id":7,"searchId":7},"businessType":"userinfo_detail"}'
    	}
    }).success(function(data) {
    	console.log(data)
    }).error(function(data) {

    })
})




