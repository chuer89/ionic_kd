angular.module('workClient.controller', [])

.controller('WorkClientCtrl', function ($scope, $state, $ionicActionSheet, seleMenuList) {
	var menus = seleMenuList.menu();

    $scope.seleStar = menus.star;
    $scope.selePeriod = menus.period;
    $scope.seleFrequency = menus.frequency;
    $scope.seleAmount = menus.amount;

    $scope.isShowStarSele = false;
    $scope.isShowPeriodSele = false;
    $scope.isShowFrequencySele = false;
    $scope.isShowAmountSele = false;

    $scope.toggleSele = function(type) {
        if (type == 'star') {
            $scope.isShowPeriodSele = false;
            $scope.isShowFrequencySele = false;
            $scope.isShowAmountSele = false;

            $scope.isShowStarSele = !$scope.isShowStarSele;
        } else if( type == 'period' ) {
            $scope.isShowStarSele = false;
            $scope.isShowFrequencySele = false;
            $scope.isShowAmountSele = false;

            $scope.isShowPeriodSele = !$scope.isShowPeriodSele;
        } else if (type == 'frequency') {
            $scope.isShowStarSele = false;
            $scope.isShowPeriodSele = false;
            $scope.isShowAmountSele = false;

            $scope.isShowFrequencySele = !$scope.isShowFrequencySele;
        } else {
            $scope.isShowStarSele = false;
            $scope.isShowPeriodSele = false;
            $scope.isShowFrequencySele = false;
    
            $scope.isShowAmountSele = !$scope.isShowAmountSele;
        }
    }

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
	}
})