angular.module('message.controller', [])

//消息
.controller('MessageCtrl', function($scope, $state, $timeout, common) {
    $scope.data = {
        userId: common.userInfo.clientId,
        keywords: ''
    };

    $scope.items = [];
    
    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            getMessage();

            onDeviceReady();//极光消息初始化
        }, 1000)
        return true;
    };

    var iconMap = {
        INFORM: {tips: '通知', icon: 'img/icon/message/notify.png', state: 'work_notify_details'},
        TASK: {tips: '任务', icon: 'img/icon/message/task.png',state: 'work_task_list_details'},
        APPLY: {tips:'申请', icon: 'img/icon/message/apply.png',state:'work_apply'},
        PAIBAN: {tips: '值班', icon: 'img/icon/message/onDuty.png',state:'work_onDuty_details'},
        // PERFORMANCE: {tips: '绩效'},
        REPORT: {tips: '汇报', icon: 'img/icon/message/report.png',state:'work_report_detail'},
        REMIND: {tips: '日程', icon: 'img/icon/message/schedule.png',state:'work_schedule_details'}
    }

    //预点击-处理脏数据
    $scope.clickHandle = function(item) {
        common.getMessageDetails(item._id, item.messageType, function(data) {
            $state.go(item._infos.state, {
                id: item._id
            });
        });
    }

    var getMessage = function() {
        common.loadingShow();
        common.post({
            type: 'message_list_info',
            data: $scope.data,
            notPretreatment: true,
            success: function(data) {
                var _body = data.body;
                common.loadingHide();

                if (!_body || (_body && _body.message && !_body.message.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                // TASK("任务"),INFORM("通知"),APPLY("申请"),PAIBAN("排班"),PERFORMANCE("绩效"),REPORT("汇报"),REMIND("提醒");

                var id = '';

                for (var i = 0, ii = _body.message.length; i < ii; i++) {
                    _body.message[i]._notifyTime = common.format(_body.message[i].notifyTime, 'HH:mm');
                    _body.message[i]._infos = angular.extend({}, iconMap[_body.message[i].messageType]);

                    id = _body.message[i].id + '_push_' + _body.message[i].realId;
                    _body.message[i]._id = id;

                    _body.message[i]._subTitle = ( _body.message[i]._infos.tips ? '' + _body.message[i]._infos.tips + '：' : _body.message[i]._infos.tips ) + _body.message[i].subTitle;
                }

                $scope.items = _body.message;

                // console.log(_body)
            }
        });
    }, initData = function() {
        $scope.items = [];
        getMessage();
    }
    initData();

    //搜索--start
    $scope.isSearchVal = false;
    $scope.isSearchTxt = true;
    var showSearch = function() {
        $scope.isSearchVal = true;
        $scope.isSearchTxt = false;

        $timeout(function() {
            $('#js_search').focus().on('keypress', function(e) {
                var _keyCode = e.keyCode;
                if (_keyCode == 13) {
                    //搜索
                    handleSearch();
                    return false;
                }
            })
        }, 200)
    }, cancelSearch = function() {
        clearSearchData();
    }, handleSearch = function() {
        $scope.isSearchVal = false;
        $scope.isSearchTxt = true;

        initData();
    }, clearSearchData = function() {
        $scope.data.keywords = '';
        handleSearch();
    }
    $scope.showSearch = showSearch;
    $scope.cancelSearch = cancelSearch;
    $scope.handleSearch = handleSearch;
    //搜索--end




    //激光消息-start
    var _userInfo = {};

    try{
        _userInfo = JSON.parse( common.getLocalStorage('userInfo') );
    } catch(error) {

    }

    // common.toast(common.getLocalStorage('setPushTags') + '上门' + _userInfo.clientId)


    if (!_userInfo.clientId) {
        return;
    }

    //tag_department_ID   (ID为部门ID)
    //alias_user_ID   (ID为用户ID)
    var _tag_department_ID = 'tag_department_' + _userInfo.departmentId;
    var _alias_user_ID = 'alias_user_' + _userInfo.clientId;


    // 设置别名和标签
    var setTagsAndAlias = function (tags, alias) {
      try {
        $scope.message += "准备设置tag/alias...";
        
        window.plugins.jPushPlugin.setTagsWithAlias(tags);

        $scope.message += 'tag获取：' + tags;
        $scope.message += '设置tags和alias成功！ \r\n';
      } catch (exception) {
        $scope.errorMsg += 'setTagsAndAlias:' + exception;
        console.log(exception);
      }
    }

    $scope.message = "on load view success!";
    $scope.errorMsg = '';

    // 获取RegistrationID
    var getRegistrationID = function () {
      window.plugins.jPushPlugin.getRegistrationID(function (data) {
        try {
          console.log("JPushPlugin:registrationID is " + data);
          if (data.length == 0) {
            var t1 = window.setTimeout(getRegistrationID, 1000);
          }
          $scope.message += "JPushPlugin:registrationID is " + data;
          // $scope.registrationID = data;
        } catch (exception) {
          $scope.errorMsg += 'getRegistrationID:' + exception;
        }
      });

    };
    

    $scope.formData = {}

    //初始化jpush
    var initiateUI = function () {
      try {
        window.plugins.jPushPlugin.init();
        getRegistrationID();
        if (device.platform != "Android") {
            window.JPush.resetBadge();
          window.plugins.jPushPlugin.setDebugModeFromIos();
          window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
        } else {
          window.plugins.jPushPlugin.setDebugMode(true);
          window.plugins.jPushPlugin.setStatisticsOpen(true);
        }
        $scope.message += '初始化成功! \r\n';
      } catch (exception) {
        $scope.errorMsg += 'initiateUI:' + exception;
      }
    }

    //本地缓存是否配置消息推送
    if (!common.getLocalStorage('setPushTags')) {
        $timeout(function() {
            setTagsAndAlias([_tag_department_ID, _alias_user_ID]);
            // setTagsAndAlias(_alias_user_ID);
            common.setLocalStorage('setPushTags', true);
            // common.toast(_tag_department_ID + '和' +_alias_user_ID)
        }, 0);
    }

    // 当设备就绪时
    var onDeviceReady = function () {
      // $scope.message += "JPushPlugin:Device ready!";
      initiateUI();
    };
    
    // 添加对回调函数的监听
    document.addEventListener("deviceready", onDeviceReady, false);
    
})

.controller('CommonDemoCtrl', function($scope, $state, $filter, ionicTimePicker, $cordovaLocalNotification,
	$cordovaVibration, $cordovaToast, $cordovaDatePicker, $cordovaCamera, $cordovaPinDialog, $rootScope,
	$cordovaImagePicker, $cordovaDevice, $timeout, messagePush, ionicDatePicker, common, actionImgShow,
    $cordovaFileOpener2 ) {

    // cordova.plugins.notification.local.schedule({  
    //     // id: 1,  
    //     title: '应用提醒001',  
    //     text: '应用新消息，款来看吧001',  
    //     // at: new Date().getTime(),  
    //     badge: 2  
    // });

    // alert(cordova)

    $rootScope.$on('$cordovaLocalNotification:schedule',
    function (event, notification, state) {
        common.toast('消息成功');
    });

    $scope.slideImg = 0;

    // 现在定义一些图片数组
    var allimgs = [
      {
        imgsrc: 'img/max.png'
      },
      {
        imgsrc: 'img/adam.jpg'
      }
    ];

    //绑定至前端的初始显示，点击之后将会触发下面的onDoubleTap事件。
    $scope.imgs = allimgs;

    /**
    *图片预加载
    */
    var arrImgs = new Array();
    for(var i=0; i<allimgs.length; i++) {

      var img = new Image();

      img.src = allimgs[i].imgsrc;

      img.onload = function(i) {
        arrImgs[i] = img;
      }(i);
      
    }

    /**
    *双击触发事件
    *$index表示是第几张图片的索引，直接从该图片放大显示。
    */
    $scope.onDoubleTap = function($index) {
        actionImgShow.show({
            "larImgs": arrImgs,
            //"larImgs": allimgs,//配置成这个也是可以的，只是图片没有预加载，每次放大预览都需要重新加载图片 
            "currentImg": $index,
            imgClose : function() {
                actionImgShow.close();
            }
        });
    }

    //pdf
    $scope.pdf = function () {
        // $cordovaFileOpener2.open(
        //     'http://182.138.0.196/test.pdf'
        // ).then(function() {
        // // file opened successfully
        // }, function(err) {
        // // An error occurred. Show a message to the user
        // });

        // window.plugins.fileOpener2.open(
        //     '//182.138.0.196/test.pdf',
        //     { 
        //         error : function(e) { 
        //             console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
        //         },
        //         success : function () {
        //             console.log('file opened successfully');                
        //         }
        //     }
        // );

        cordova.plugins.seaPDFPreview.preview(
            {
                type : "online",
                filePath : "http://182.138.0.196/test.pdf"
            },
            function(data){
                myApp.alert(data.code+"---"+data.msg);
            },
            function(errorMsg){
                myApp.alert(errorMsg);
            }
        );
    }


	$scope.startVib=function(){ 
        // 震动 1000ms 
        //$cordovaVibration.vibrate(1000); 

        $cordovaPinDialog.prompt('Some message here').then(
        function(result) {
            common.toast('成功');
            // result
        },
        function (error) {
            common.toast('失败');
            // error
        })
	};

    $scope.getUUID = function() {
        $scope.uuid = $cordovaDevice.getUUID();
    }

    $scope.addNotification = function(tit, msg) {
        

        if (window.plugins && window.plugins.jPushPlugin) {
            // alert(1)
            // window.plugins.jPushPlugin.addLocalNotification(0, 'content', 'title', 0, 1);

            if(window.plugins.jPushPlugin.isPlatformIOS()) {
                window.plugins.jPushPlugin.addLocalNotificationForIOS(1, "本地推送内容", 1, "notiId", {"key":"value"});
            } else {
                window.plugins.jPushPlugin.addLocalNotification(0, 'content', 'title', 0, 1);
            }
        }
    }
    var onStartLocalNotification = function(event) {
        var alertContent = event.aps.alert;
        alert("open Notificaiton:" + alertContent);
    }
    document.addEventListener("jpush.startLocalNotification", onStartLocalNotification, false);

    $scope.scheduleSingleNotification = function () {
        // $cordovaLocalNotification.add({ message: 'Great app!' });

        // $cordovaLocalNotification.schedule({
        //     id: 2,
        //     title: 'Title here',
        //     text: 'Text here',
        //     data: {
        //       customProperty: 'custom value'
        //     }
        //   }).then(function (result) {
        //     $cordovaVibration.vibrate(1000); 
        //     common.toast('消息成功')
        //   });

        var now             = new Date().getTime(),
            _5_sec_from_now = new Date(now + 5*1000);

        cordova.plugins.notification.local.schedule({
            id: 1,
            title: '应用提醒',
            text: '应用有新消息，快来查看吧'
            // every: 'minute'//second, minute, hour, day, week, month or year
            // at: _5_sec_from_now
        });
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

.controller('RemoteNotificationCtrl', function ($scope, $rootScope, jsPush) {
    //tag_department_ID   (ID为部门ID)
    //alias_user_ID   (ID为用户ID)
    
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
    //点击消息
    document.addEventListener("jpush.openNotification", onOpenNotification, false);
    //收到消息
    document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
    //获取自定义消息
    document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
})