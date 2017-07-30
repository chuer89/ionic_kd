angular.module('message.controller', [])

//
.controller('MessageCtrl', function($scope, $state, messagePush, common) {
    $scope.data = {};

    $scope.items = messagePush.all();

    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
    }
})

.controller('CommonDemoCtrl', function($scope, $state, $filter, ionicTimePicker,
	$cordovaVibration, $cordovaToast, $cordovaDatePicker, $cordovaCamera, 
	$cordovaImagePicker, $timeout, messagePush, ionicDatePicker, common) {

	$scope.startVib=function(){ 
	  // 震动 1000ms 
	  	$cordovaVibration.vibrate(1000); 

	  	$cordovaToast.show('这里是气泡测试', 'long', 'bottom')
	  				.then(function(success) {

	  				}, function(error) {

	  				})
	};

	var dp = function() {
		var options = {
		    date: new Date(),
		    mode: 'date', // date丨time丨datetime
		    // minDate: new Date() - 10000,
		    allowOldDates: true,
		    allowFutureDates: true,
		    is24Hour: true,
		    locale: "NL",
		    locale: "zh_cn",
		    doneButtonLabel: 'DONE',
		    doneButtonColor: '#F2F3F4',
		    cancelButtonLabel: 'CANCEL',
		    cancelButtonColor: '#000000'
		  };

		  document.addEventListener("deviceready", function () {

		    $cordovaDatePicker.show(options).then(function(date){
		        var _date = '';
                if (!date) {
                    return;
                }
                // alert(date)
                _date = COMMON.format(date + '', 'yyyy-MM-dd', true);
                alert(_date);
                // alert(date)
		    });

		  }, false);
	}

	$scope.date = function () {
		// $('#mn_date').click();
		// common.ionicDatePickerProvider(function(date) {
		// 	alert(date)
		// })
		// common.datePicker(function(date) {
		// 	alert(date)
		// });
		dp();
		return;

		var ipObj1 = {
			callback: function (val) {      //Mandatory
				if (typeof (val) === 'undefined') {
					console.log('Time not selected');
				} else {
					var selectedTime = new Date(val * 1000);
					console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
				}
			},
			inputTime: 50400,   //Optional
			format: 12,         //Optional
			step: 15           //Optional
		};

		ionicTimePicker.openTimePicker(ipObj1);
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
})

.controller('RemoteNotificationCtrl', function($scope, common) {

})