angular.module('workOnDuty.controller', [])

.controller('WorkOnDutyCtrl', function ($scope, $state, $ionicActionSheet, common) {
    $scope.items = [];
    $scope.scheduleID = '';

	COMMON.post({
        type: 'zhiban_list',
        data: {
            "userId": common.userInfo.clientId,
            "date": '2017-07-03'
        },
        success: function(data) {
            var _body = data.body;

            $scope.items = _body.data;
            $scope.scheduleID = _body.scheduleID;

            console.log(_body);
        }
    });    
})

//设定
.controller('WorkOnDutySettingCtrl', function($scope, $stateParams, common) {
    $scope.data = {
        scheduleID: $stateParams.id
    };

    COMMON.post({
        type: 'zhiban_taget_get',
        data: {
            scheduleID: $stateParams.id
        },
        success: function(data) {
            var _body = data.body;

            console.log(_body)

            if (_body) {
                $scope.data = _body;    
            }
        }
    });

    $scope.sub = function() {
        console.log($scope.data);

        COMMON.post({
            type: 'zhiban_taget_add',
            data: $scope.data,
            success: function(data) {
                var _body = data.body;

                console.log(_body);
            }
        });
    }
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

//检查
.controller('WorkOnDutyCheckCtrl', function($scope, $stateParams, common) {
    var _pid = $stateParams.id.split('_');
    var checkID = _pid[1],
        scheduleID = _pid[0];

    COMMON.post({
        type: 'zhiban_list',
        data: {
            checkID: checkID,
            scheduleID: scheduleID
        },
        success: function(data) {
            var _body = data.body;

            console.log(_body);
        }
    });
})