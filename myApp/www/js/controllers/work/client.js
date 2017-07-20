angular.module('workClient.controller', [])

.controller('WorkClientCtrl', function ($scope, $state, $ionicActionSheet, seleMenuList, common, workCrmSele) {
	var menus = seleMenuList.menu();

    $scope.seleStar = [];
    $scope.selePeriod = menus.period;
    $scope.seleFrequency = menus.frequency;
    $scope.seleAmount = menus.amount;

    workCrmSele.star(function(star) {
        star.push({
            name: '全部',
            id: '-1',
            value: '-1'
        });

        $scope.seleStar = star;
    });
    workCrmSele.customer_types(function(data) {
        console.log(data);
    })

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

.controller('WorkClientCreateCtrl', function($scope, $ionicActionSheet) {
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
})

