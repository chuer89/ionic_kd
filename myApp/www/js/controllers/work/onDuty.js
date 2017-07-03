angular.module('workOnDuty.controller', [])

.controller('WorkOnDutyCtrl', function ($scope, $state, $ionicActionSheet, common) {
	COMMON.post({
        type: 'zhiban_list',
        data: {
            "userId": common.userInfo.clientId,
            "date": '2017-07-03'
        },
        success: function(data) {
            console.log(data)
        }
    });    
})

.controller('WorkOnDutySettingCtrl', function() {

})

.controller('WorkOnDutyQueryCtrl', function($scope) {
    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
    }
})

.controller('WorkOnDutyDetailsCtrl', function() {
    
})