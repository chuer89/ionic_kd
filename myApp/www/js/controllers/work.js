angular.module('work.controller', [])

//
.controller('WorkCtrl', function($scope, $state, $http, workPlatform) {
    $scope.data = {};

    $scope.items = workPlatform.all();
    $scope.itemsCrm = workPlatform.crm();
    $scope.itemsLearn = workPlatform.learn();

    $http.post('http://123.206.95.25:8080/kuaidao', {
    	"appType":"IOS","appVersion":"1.0.0","body":{},"businessType":"departmrnt_info"
    }).success(function(data) {

    }).error(function(data) {

    })
})




