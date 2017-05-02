angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $ionicPopup, $state, $ionicHistory) {
    $scope.data = {};

    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();

    $scope.forgotPassword = function() {
        $state.go('forgotPsd')
    }

    $scope.login = function() {
        $state.go('tab.dash');

        // LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
        //     $state.go('tab.dash');
        // }).error(function(data) {
        //     var alertPopup = $ionicPopup.alert({
        //         title: 'Login failed!',
        //         template: 'Please check your credentials!'
        //     });
        // });
    }
})

//忘记密码
.controller('ForgotPsdCtrl', function ($scope, $ionicPopup, $state) {
    $scope.data = {};

    $scope.handleCode = function() {
        $state.go('modifyPsd')
    }
})

//修改密码
.controller('ModifyPsdCtrl', function($scope, $state) {
    $scope.data = {};
})

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
                
                var _go = 'tab.perfomance_query';

                if (index == 2) {
                    _go = 'tab.perfomance_add';
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

.controller('DashCtrl', function($scope, $ionicPopup, $ionicActionSheet) {
  $scope.show = function () {
       $ionicActionSheet.show({
     buttons: [
       { text: '<b>Share</b> This' },
       { text: 'Move' },
     ],
     destructiveText: 'Delete',
     titleText: 'Modify your album',
     cancelText: 'Cancel',
     buttonClicked: function(index) {
       return true;
     }
   });
  }

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'eat that',
      template: 'yes it alert'
    })
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
