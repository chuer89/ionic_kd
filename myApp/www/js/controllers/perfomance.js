angular.module('perfomance.controller', [])

//绩效
.controller('PerfomanceCtrl', function($scope, $state, $ionicPopup, $ionicActionSheet) {
    $scope.data = {};
    $scope.showNav = function () {
        $ionicActionSheet.show({
            buttons: [{
                text: '绩效查询'
            }, {
                text: '我的绩效'
            }, {
                text: '绩效开单'
            }],
            cancelText: '取消',
            buttonClicked: function (index) {
                
                var _go = 'perfomance_query';

                if (index == 2) {
                    _go = 'perfomance_add';
                }

                console.log(index)

                $state.go(_go);
                return true;
            }
        });
    }
})
.controller('QueryPerfomaceCtrl', function($scope, $state, perfomanceQuery) {
    $scope.data = {};

    $scope.items = perfomanceQuery.all();

    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
    }
})
.controller('DetailsPerfomance', function ($scope, $state, $stateParams, perfomanceQuery) {
    $scope.item = perfomanceQuery.get($stateParams.id);
})
.controller('AddPerfomance', function ($scope, $state, $stateParams, $cordovaCamera, perfomanceQuery) {

    $scope.getPicture = function() {
        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 100,
          targetHeight: 100,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation:true
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
          var image = document.getElementById('myImage');
          image.src = "data:image/jpeg;base64," + imageData;
        }, function(err) {
          // error
        });
    }
})