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

.controller('WorkClientDetailsCtrl', function($scope, $state) {
    $scope.activeTab = '0';

    $scope.isShowTab0 = true;
    $scope.isShowTab1 = false;

    $scope.items = [{}, {}];

    $scope.checkTab = function(index) {
        $scope.activeTab = index;
        if (index == '0') {
            $scope.isShowTab1 = false;
            $scope.isShowTab0 = true;
        } else {
            $scope.isShowTab0 = false;
            $scope.isShowTab1 = true;
        }
    }
})

