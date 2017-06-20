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

.controller('WorkOpportunityDetailsCtrl', function($scope, $state, $ionicActionSheet, seleMenuList) {
    $scope.activeTab = '0';

    var menus = seleMenuList.menu();

    var market = menus.market,
        showSeleMarketData = [];
    for (var i = 0, ii = market.length; i < ii; i++) {
        showSeleMarketData.push({
            text: market[i].name
        })
    }

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

    $scope.seleMarket = '请选择';
    $scope.showSeleMarket = function () {
        $ionicActionSheet.show({
            buttons: showSeleMarketData,
            cancelText: '取消',
            buttonClicked: function(index, item) {
                $scope.seleMarket = item.text;
                return true;
            }
        })
    }
})

.controller('WorkOpportunityCreateCtrl', function($scope, $state, $ionicActionSheet, seleMenuList) {
    var menus = seleMenuList.menu();

    var market = menus.market,
        showSeleMarketData = [];
    for (var i = 0, ii = market.length; i < ii; i++) {
        showSeleMarketData.push({
            text: market[i].name
        })
    }

    
    $scope.seleType = '请选择';
    $scope.showSeleType = function () {
        $ionicActionSheet.show({
            buttons: [
                {text: '智能分析'},
                {text: '优柔寡断'},
                { text: '自我吹嘘' },
                {text: '豪爽冲动'},
                {text: '吹毛求癖'},
                {text: '正常类型'}
            ],
            cancelText: '取消',
            buttonClicked: function(index, item) {
                $scope.seleType = item.text;
                return true;
            }
        })
    }


    $scope.seleMarket = '请选择';
    $scope.showSeleMarket = function () {
        $ionicActionSheet.show({
            buttons: showSeleMarketData,
            cancelText: '取消',
            buttonClicked: function(index, item) {
                $scope.seleMarket = item.text;
                return true;
            }
        })
    }
})

