angular.module('message.controller', [])

//
.controller('MessageCtrl', function($scope, $state, 
	$cordovaVibration, $cordovaToast, $cordovaDatePicker, $cordovaCamera, $cordovaImagePicker, messagePush) {
    $scope.data = {};

    $scope.items = messagePush.all();

    // $cordovaVibration.vibrate(50);
    // console.log($cordovaVibration)

    $scope.startVib=function(){ 
	  // 震动 1000ms 
	  	$cordovaVibration.vibrate(1000); 

	  	$cordovaToast.show('这里是气泡测试', 'long', 'bottom')
	  				.then(function(success) {

	  				}, function(error) {

	  				})
	};

	$scope.date = function () {
		var options = {
		    date: new Date(),
		    mode: 'date', // or 'time'
		    minDate: new Date() - 10000,
		    allowOldDates: true,
		    allowFutureDates: false,
		    doneButtonLabel: 'DONE',
		    doneButtonColor: '#F2F3F4',
		    cancelButtonLabel: 'CANCEL',
		    cancelButtonColor: '#000000'
		  };

		  document.addEventListener("deviceready", function () {

		    $cordovaDatePicker.show(options).then(function(date){
		        alert(date);
		    });

		  }, false);
	}

	$scope.camera = function() {
		var options = {  
			quality: 50,  
			destinationType: Camera.DestinationType.DATA_URL,  
			sourceType: Camera.PictureSourceType.CAMERA,  
			allowEdit: true,  
			encodingType: Camera.EncodingType.JPEG,  
			targetWidth: 100,  
			targetHeight: 100,  
			popoverOptions: CameraPopoverOptions,  
			saveToPhotoAlbum: false  
		};  

		$cordovaCamera.getPicture(options).then(function(imageData) {  
			var image = document.getElementById('myImage');  
			image.src = "data:image/jpeg;base64," + imageData;  
		}, function(err) {  
			// error  
		});  
	}

	$scope.phoneData = '';

	$scope.phone = function() {
		var options = {
			maximumImagesCount: 10,
			width: 800,
			height: 800,
			quality: 80
		};

		$cordovaImagePicker.getPictures(options)
		.then(function (results) {
			$scope.phoneData = results;
			for (var i = 0; i < results.length; i++) {
				// console.log('Image URI: ' + results[i]);
			}
		}, function(error) {
			// error getting photos
		});
	}

    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
    }
})