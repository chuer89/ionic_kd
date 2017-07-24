angular.module('workClient.controller', [])

// lastFollowUpTimeStart: #可选，最后跟进时间起，时间戳
// includeLastFollowUpTimeStart: #可选，包含最后跟进时间起，默认不包含
// lastFollowUpTimeEnd: #可选，最后跟进时间止，时间戳
// lastConsumptionTimeStart: #可选，最后消费时间起，时间戳
// includeLastConsumptionTimeStart: #可选，包含最后消费时间起，默认不包含
// lastConsumptionTimeEnd: #可选，最后消费时间止，时间戳
// includeLastConsumptionTimeEnd: #可选，包含最后消费时间止，默认不包含
// includeLastFollowUpTimeEnd: #可选，包含最后跟进时间止，默认不包含

.controller('WorkClientCtrl', function ($scope, $state, $ionicActionSheet, seleMenuList, common, workCrmSele) {
	var menus = seleMenuList.menu();

    var ajaxHandle = function() {

    }, initData = function() {

    }

    $scope.seleStar = [];
    $scope.selePeriod = [];
    $scope.seleFrequency = [];
    $scope.seleAmount = [];

    workCrmSele.star(function(star) {
        star.push({
            name: '全部',
            id: '-1',
            value: '-1'
        });

        $scope.seleStar = star;
    });
    workCrmSele.total_consumption_times(function(data) {
        $scope.seleFrequency = data.body.totalConsumptionTimesFilters;
    });
    workCrmSele.last_follow_time_filters(function(data) {
        $scope.selePeriod = data.body.lastFollowUpTimeFilters;
    });
    workCrmSele.total_consumption_money(function(data) {
        $scope.seleAmount = data.body.totalConsumptionMoneyFilters;
    })

    $scope.isShowStarSele = false;
    $scope.isShowPeriodSele = false;
    $scope.isShowFrequencySele = false;
    $scope.isShowAmountSele = false;

    $scope.seleStarInfo = '星级';
    $scope.selePeriodInfo = '周期';
    $scope.seleFrequencyInfo = '频次';
    $scope.seleAmountInfo = '金额';

    //选择菜单处理
    var toggleSeleHandle = function(type, isAjax) {
        if (type == 'star') {
            $scope.isShowPeriodSele = false;
            $scope.isShowFrequencySele = false;
            $scope.isShowAmountSele = false;

            $scope.isShowStarSele = !$scope.isShowStarSele;
        } else if (type == 'period') {
            $scope.isShowStarSele = false;
            $scope.isShowFrequencySele = false;
            $scope.isShowAmountSele = false;

            $scope.isShowPeriodSele = !$scope.isShowPeriodSele;
        } else if (type == 'frequency') {
            $scope.isShowStarSele = false;
            $scope.isShowPeriodSele = false;
            $scope.isShowAmountSele = false;

            $scope.isShowFrequencySele = !$scope.isShowFrequencySele;
        } else if(type == 'amount') {
            $scope.isShowStarSele = false;
            $scope.isShowPeriodSele = false;
            $scope.isShowFrequencySele = false;

            $scope.isShowAmountSele = !$scope.isShowAmountSele;
        }

        if (isAjax) {
            initData(true);
        }
    }

    $scope.seleStarHandle = function(item) {
        $scope.seleStarInfo = item.name;
    }
    $scope.selePeriodHandle = function(item) {
        $scope.selePeriodInfo = item.name;
    }
    $scope.seleFrequencyHandle = function(item) {
        $scope.seleFrequencyInfo = item.name;
    }
    $scope.seleAmountHandle = function(item) {
        $scope.seleAmountInfo = item.name;
    }

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

