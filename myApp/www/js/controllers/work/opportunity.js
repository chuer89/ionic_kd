angular.module('workOpportunity.controller', [])

.controller('WorkOpportunityCtrl', function ($scope, $state, $ionicActionSheet, seleMenuList) {
	var menus = seleMenuList.menu();

    $scope.seleStar = menus.star;
    $scope.seleMarket = menus.market;

    $scope.isShowStarSele = false;
    $scope.isShowMarketSele = false;

    $scope.toggleSele = function(type) {
        if (type == 'star') {
            $scope.isShowMarketSele = false;

            $scope.isShowStarSele = !$scope.isShowStarSele;
        } else if( type == 'market' ) {
            $scope.isShowStarSele = false;

            $scope.isShowMarketSele = !$scope.isShowMarketSele;
        }
    }

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
	}

    $scope.activeTab = '0';

    $scope.isShowTab0 = true;
    $scope.isShowTab1 = false;
    $scope.isShowTab2 = false;

    $scope.items = [{}, {}];

    $scope.checkTab = function(index) {
        $scope.activeTab = index;
        if (index == '0') {
            $scope.isShowTab1 = false;
            $scope.isShowTab2 = false;
            $scope.isShowTab0 = true;
        } else if (index == '1') {
            $scope.isShowTab0 = false;
            $scope.isShowTab2 = false;
            $scope.isShowTab1 = true;
        } else {
            $scope.isShowTab0 = false;
            $scope.isShowTab1 = false;
            $scope.isShowTab2 = true;
        }
    }
})

.controller('WorkOpportunityDetailsCtrl', function($scope, $state) {
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

