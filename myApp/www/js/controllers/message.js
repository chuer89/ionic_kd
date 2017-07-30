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

.controller('RemoteNotificationCtrl', function ($scope, 
$rootScope) {
    $scope.message = "on load view success!";

    $scope.errorMsg = '';

    // 当设备就绪时
    var onDeviceReady = function () {
      $scope.message += "JPushPlugin:Device ready!";
      initiateUI();
    };
    // 设置标签和别名
    var onTagsWithAlias = function (event) {
      try {
        $scope.message += "onTagsWithAlias";
        var result = "result code:" + event.resultCode + " ";
        result += "tags:" + event.tags + " ";
        result += "alias:" + event.alias + " ";
        $scope.message += result
        $scope.tagAliasResult = result;
      } catch (exception) {
        $scope.errorMsg += 'onTagsWithAlias:' + exception;
        console.log(exception)
      }
    };
    // 打开通知的回调函数
    var onOpenNotification = function (event) {
      try {
        var alertContent;
        if (device.platform == "Android") {
          alertContent = window.plugins.jPushPlugin.openNotification.alert;
        } else {
          alertContent = event.aps.alert;
        }
        $scope.message += alertContent;
        alert("onOpenNotification:" + alertContent);
      } catch (exception) {
        $scope.errorMsg += 'onOpenNotification:' + exception;
        console.log("JPushPlugin:onOpenNotification" + exception);
      }
    };
    // 接收到通知时的回调函数
    var onReceiveNotification = function (event) {
      try {
        var alertContent;
        if (device.platform == "Android") {
          alertContent = window.plugins.jPushPlugin.receiveNotification.alert;
        } else {
          alertContent = event.aps.alert;
        }
        $scope.message += alertContent;
        $scope.notificationResult = alertContent;
      } catch (exception) {
        $scope.errorMsg += 'onReceiveNotification:' + exception;
        console.log(exception)
      }
    };

    // 接收到消息时的回调函数
    var onReceiveMessage = function (event) {
      try {
        var message;
        if (device.platform == "Android") {
          message = window.plugins.jPushPlugin.receiveMessage.message;
        } else {
          message = event.content;
        }
        $scope.message += message;
        $scope.messageResult = message;
      } catch (exception) {
        $scope.errorMsg += 'onReceiveMessage:' + exception;
        console.log("JPushPlugin:onReceiveMessage-->" + exception);
      }
    };


    // 获取RegistrationID
    var getRegistrationID = function () {
      window.plugins.jPushPlugin.getRegistrationID(function (data) {
        try {
          console.log("JPushPlugin:registrationID is " + data);
          if (data.length == 0) {
            var t1 = window.setTimeout(getRegistrationID, 1000);
          }
          $scope.message += "JPushPlugin:registrationID is " + data;
          $scope.registrationID = data;
        } catch (exception) {
          $scope.errorMsg += 'getRegistrationID:' + exception;
          console.log(exception);
        }
      });

    };
    //初始化jpush
    var initiateUI = function () {
      try {
        window.plugins.jPushPlugin.init();
        getRegistrationID();
        if (device.platform != "Android") {
          window.plugins.jPushPlugin.setDebugModeFromIos();
          window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
        } else {
          window.plugins.jPushPlugin.setDebugMode(true);
          window.plugins.jPushPlugin.setStatisticsOpen(true);
        }
        $scope.message += '初始化成功! \r\n';
      } catch (exception) {
        $scope.errorMsg += 'initiateUI:' + exception;
        console.log(exception);
      }
    }

    $scope.formData = {}
    // 设置别名和标签
    $scope.setTagsAndAlias = function () {
      try {
        $scope.message += "准备设置tag/alias...";
        var tags = [1234567,1];
        if ($scope.formData.tag1 != "") {
          tags.push($scope.formData.tag1);
        }
        if ($scope.formData.tag2 != "") {
          tags.push($scope.formData.tag2);
        }
        window.plugins.jPushPlugin.setTagsWithAlias(tags, $scope.formData.alias);
        $scope.message += 'tag获取：' + tags;
        $scope.message += '设置tags和alias成功！ \r\n';
      } catch (exception) {
        $scope.errorMsg += 'setTagsAndAlias:' + exception;
        console.log(exception);
      }
    }
    
    // 添加对回调函数的监听
    document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("jpush.openNotification", onOpenNotification, false);
    document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
    document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
})