angular.module('workVisit.controller', [])

.controller('WorkVisitCtrl', function ($scope, $state, $ionicActionSheet, seleMenuList) {
	var menus = seleMenuList.menu();

    $scope.seleStar = menus.star;
    $scope.selePeriod = [{name: '三周'}, {name: '三个月'}];
    $scope.seleSpecial = [{name: '生日'}, {name: '纪念日'}];

    $scope.isShowStarSele = false;
    $scope.isShowPeriodSele = false;
    $scope.isShowSpecialSele = false;

    $scope.toggleSele = function(type) {
        if (type == 'star') {
            $scope.isShowPeriodSele = false;
            $scope.isShowSpecialSele = false;

            $scope.isShowStarSele = !$scope.isShowStarSele;
        } else if( type == 'period' ) {
            $scope.isShowStarSele = false;
            $scope.isShowSpecialSele = false;

            $scope.isShowPeriodSele = !$scope.isShowPeriodSele;
        } else if (type == 'special') {
            $scope.isShowStarSele = false;
            $scope.isShowPeriodSele = false;

            $scope.isShowSpecialSele = !$scope.isShowSpecialSele;
        }
    }

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
	}
})

.controller('WorkVisitDetailsCtrl', function($scope, $state) {
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