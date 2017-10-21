// Ionic Starter App

// angularhttp://192.168.4.143/wpad.dat.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 
    'route', 'ionic-datepicker', 'ionic-timepicker', 'ng-img', 'starter.imgservices'])

.run(function($ionicPlatform, $cordovaDevice, $timeout,
    $ionicPopup, $rootScope, $location, $ionicHistory, common) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    //键盘-start
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
    }

    window.addEventListener("native.keyboardshow", function(e){
        $('#js_comment_box').css({
            'bottom':(e.keyboardHeight) + 'px'
        });
    });
    window.addEventListener("native.keyboardhide", function(e){
        $('#js_comment_box').css({
            'bottom':0
        });
    });
    //键盘-end

    var initJsPush = function() {
        try {
            window.plugins.jPushPlugin.init();
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
        }
    }

    var onResume = function () {
        // Handle the resume event
        setTimeout(function() {
            //切换前台运行
            common._runApp = true;
            // common.scheduleSingleNotification('切换前台运行中', '切换前台运行中');
            // common.toast('切换前台运行中');

            document.addEventListener("deviceready", initJsPush, false);
        }, 0);
    }, onPause = function () {
        // Handle the pause event
        setTimeout(function() {
            common._runApp = false;
            // common.scheduleSingleNotification('后台运行中', '后台运行中')
        }, 0)
    }, onBackKeyDown = function() {
        
    }, onDeviceReady = function() {
        //启动app
        common._runApp = true;
        // common.scheduleSingleNotification('启动app', '启动app')
    }, onReceiveNotification = function (event) { // 接收到通知时的回调函数
      try {
        var alertContent, title = '';

        if (device.platform == "Android") {
          alertContent = window.plugins.jPushPlugin.receiveNotification.alert;
        } else {
          alertContent = event.aps.alert;
        }

        if (typeof alertContent == 'object') {
            title = alertContent.title;
            alertContent = alertContent.body;
        }

        // common.toast("onReceiveNotification:" + JSON.stringify(alertContent));

        if (common._runApp) {
            common.scheduleSingleNotification(title, alertContent + '本地');
        }
      } catch (exception) {
        $scope.errorMsg += 'onReceiveNotification:' + exception;
        console.log(exception)
      }
    };

    //ionic 更多事件说明 http://www.dengzhr.com/others/mobile/676

    //当app切换到后台运行时，如打开其他应用时
    // document.addEventListener("pause", onPause, false);

    // //app从后台运行时重新获取监听的事件
    document.addEventListener("resume", onResume, false);

    //当设备API加载完成并准备访问时
    // document.addEventListener("deviceready", onDeviceReady, false);

    // //按下手机返回按钮时监听的事件
    // document.addEventListener("backbutton", onBackKeyDown, false);
    
    //收到 极光 消息
    // document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);


    if (window.cordova && window.cordova.plugins) {
        // //shedule事件在每次调用时触发  
        // cordova.plugins.notification.local.on('schedule', function (notification) {  
        //     alert('scheduled:' + notification.id);  
        // });  
        // //通知触发事件  
        // cordova.plugins.notification.local.on('trigger', function (notification) {  
        //     //alert('triggered:' + notification.id);  
        //     alert(JSON.stringify(notification));  
        // });  
        // //监听点击事件  
        // cordova.plugins.notification.local.on('click', function (notification) {  
        //     alert(JSON.stringify(notification));  
        //     // document.getElementById('title').innerHTML = JSON.stringify(notification.data);  
        // });  
    }

    if (window.plugins && window.plugin.notification) {
        // window.plugin.notification.local.onadd = app.onReminderAdd;
        // window.plugin.notification.local.onclick = function() {
        //     alert(22)
        // };
        // window.plugin.notification.local.oncancel = app.onReminderCancel;
        // window.plugin.notification.local.ontrigger = app.onReminderTrigger;
    }


    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


    //主页面显示退出提示框  
    $ionicPlatform.registerBackButtonAction(function (e) {  

        e.preventDefault();  

        function showConfirm() {  
            var confirmPopup = $ionicPopup.confirm({  
                title: '<strong>退出应用?</strong>',  
                template: '你确定要退出应用吗?',  
                okText: '退出',  
                cancelText: '取消'  
            });  

            confirmPopup.then(function (res) {  
                if (res) {  
                    ionic.Platform.exitApp();  
                } else {  
                    // Don't close  
                }  
            });  
        }  

        // Is there a page to go back to?  
        if ($location.path().indexOf('/tab/') >= 0 || $location.path() == '/login') {  
            showConfirm();  
        } else if ($ionicHistory.backView()) {
           $ionicHistory.goBack();
        } else {
            // This is the last page: Show confirmation popup
            showConfirm();
        } 

        return false;
    }, 101);  

  });
})

.config(function($stateProvider, $urlRouterProvider, 
    $ionicConfigProvider, ionicDatePickerProvider, ionicTimePickerProvider) {

    // $ionicConfigProvider.backButton.text('').previousTitleText(false);

    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');
    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');
    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    //ios 右滑 上一级
    $ionicConfigProvider.views.swipeBackEnabled(false);

   //日期选择  
      var datePickerObj = {  
          inputDate: new Date(),
          titleLabel: '选择日期',  
          setLabel: '确定',  
          todayLabel: '今天',  
          closeLabel: '关闭',  
          mondayFirst: false,  
          weeksList: ["日", "一", "二", "三", "四", "五", "六"],  
          monthsList: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],  
          templateType: 'popup',  //modal or popup
          // from: new Date(2012, 8, 1),  
          // to: new Date(2028, 8, 1),  
          // showTodayButton: true,  
          // dateFormat: 'yyyy-MM-dd',  
          // closeOnSelect: true,  
          disableWeekdays: []  
      };  
      ionicDatePickerProvider.configDatePicker(datePickerObj);

      var timePickerObj = {
          inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
          format: 12,
          step: 15,
          setLabel: '设置',
          closeLabel: '关闭'
        };
        ionicTimePickerProvider.configTimePicker(timePickerObj);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
    $stateProvider

    //登陆
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl',
        cache: false
    })

    //找回密码
    .state('forgotPsd', {
        url: '/forgotPsd',
        templateUrl: 'templates/password/find-back.html',
        controller: 'ForgotPsdCtrl'
    })

    //修改密码
    // .state('modifyPsd', {
    //     url: '/modifyPsd',
    //     templateUrl: 'templates/password/modify.html',
    //     controller: 'ModifyPsdCtrl'
    // })

    //公共
    .state('common_seleGuys', {
        url: '/common/seleGuys/:id',
        templateUrl: 'templates/common/seleGuys.html',
        controller: 'CommonSeleGuysCtrl',
        cache: false
    })
    //申请－选择通知部门
    .state('common_sele_section', {
        url: '/common/seleSection/:id',
        templateUrl: 'templates/common/seleSection.html',
        controller: 'CommonSeleSectionCtrl'
    })
    //申请－选择通知人员
    .state('common_sele_person', {
        url: '/common/selePerson/:id',
        templateUrl: 'templates/common/selePerson.html',
        controller: 'CommonSelePersonCtrl'
    })
    //选择通客户人员（crm模块）
    .state('common_sele_customer', {
        url: '/common/seleCustomer/:id',
        templateUrl: 'templates/common/seleCustomer.html',
        controller: 'CommonSeleCustomerCtrl'
    })

    .state('common_demo', {
        url: '/common/demo',
        templateUrl: 'templates/common/demo.html',
        controller: 'CommonDemoCtrl',
        cache: false
    })

    .state('demo_notify', {
        url: '/demo/notify',
        templateUrl: 'templates/demo/remoteNotification.html',
        controller: 'RemoteNotificationCtrl',
        cache: false
    })


  // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        // cache: false,
        templateUrl: 'templates/tabs.html'
    })

  // Each tab has its own nav history stack:

    //绩效tab
    .state('tab.perfomance', {
        url: '/perfomance',
        views: {
            'tab-perfomance': {
                templateUrl: 'templates/perfomance/index.html',
                controller: 'PerfomanceCtrl'
            }
        }
    })
    //绩效查询
    .state('perfomance_query', {
        url: '/perfomance/query',
        templateUrl: 'templates/perfomance/query.html',
        controller: 'QueryPerfomaceCtrl'
    })
    //绩效列表
    .state('perfomance_list', {
        url: '/perfomance/list/:id',
        templateUrl: 'templates/perfomance/list.html',
        controller: 'ListPerfomance'
    })
    //绩效列表
    .state('perfomance_my_list', {
        url: '/perfomance/my/',
        templateUrl: 'templates/perfomance/my.html',
        controller: 'MyPerfomance'
    })
    //绩效详情
    .state('perfomance_details', {
        url: '/perfomance/details/:id',
        templateUrl: 'templates/perfomance/details.html',
        controller: 'DetailsPerfomance'
    })
    //绩效开单
    .state('perfomance_add', {
        url: '/perfomance/add',
        templateUrl: 'templates/perfomance/add.html',
        controller: 'AddPerfomance',
        cache: false
    })

    //消息
    .state('tab.message', {
        url: '/message',
        // cache: false,
        views: {
            'tab-message': {
                templateUrl: 'templates/message/index.html',
                controller: 'MessageCtrl'
            }
        }
    })

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    })

    //工作
    .state('tab.work', {
        url: '/work',
        views: {
            'tab-work': {
                templateUrl: 'templates/work/index.html',
                controller: 'WorkCtrl'
            }
        }
    })

    //签到
    .state('work_sign_in', {
        url: '/work/sign_in',
        templateUrl: 'templates/work/signIn/sign_in.html',
        controller: 'WorkSigInCtrl',
        cache: false
    })
    //签到查询
    .state('work_sign_in_query', {
        url: '/work/sign_in_query',
        templateUrl: 'templates/work/signIn/query.html',
        controller: 'WorkSigInQueryCtrl',
        cache: false
    })
    //签到历史
    .state('work_sign_in_query_history', {
        url: '/work/sign_in_query/history/:id',
        templateUrl: 'templates/work/signIn/history.html',
        controller: 'WorkSigInHistoryCtrl',
        cache: false
    })
    //签到申请
    .state('work_sign_in_apply', {
        url: '/work/sign_in_apply',
        templateUrl: 'templates/work/signIn/apply.html',
        controller: 'WorkSigInApplyCtrl',
        cache: false
    })
    //签到设置
    .state('work_sign_in_set', {
        url: '/work/sign_in_set',
        templateUrl: 'templates/work/signIn/set.html',
        controller: 'WorkSigInSetCtrl'
    })

    //任务
    .state('work_task', {
        url: '/work/task',
        templateUrl: 'templates/work/task/index.html',
        controller: 'WorkTaskCtrl'
    })
    //任务查询
    .state('work_task_query', {
        url: '/work/task_query',
        templateUrl: 'templates/work/task/query.html',
        controller: 'WorkTaskQueryCtrl'
    })
    //任务创建
    .state('work_task_add', {
        url: '/work/task_add',
        templateUrl: 'templates/work/task/add.html',
        controller: 'WorkTaskAddCtrl',
        cache: false
    })
    //编辑创建
    .state('work_task_edit', {
        url: '/work/task_edit/:id',
        templateUrl: 'templates/work/task/edit.html',
        controller: 'WorkTaskEditCtrl',
        cache: false
    })
    //任务查看－列表
    .state('work_task_list', {
        url: '/work/task_list/:id',
        templateUrl: 'templates/work/task/list.html',
        controller: 'WorkTaskListCtrl'
    })
    //任务查看－列表－详情
    .state('work_task_list_details', {
        url: '/work/task_list/:id/details',
        templateUrl: 'templates/work/task/details.html',
        controller: 'WorkTaskListDetailsCtrl',
        cache: false
    })
    //任务查看－列表－详情-审核
    .state('work_task_list_details_audit', {
        url: '/work/task_list/:id/details/audit',
        templateUrl: 'templates/work/task/audit.html',
        controller: 'WorkTaskListDetailsAuditCtrl'
    })
    //任务查看－列表－详情-申请延期
    .state('work_task_list_details_postpone', {
        url: '/work/task_list/:id/details/postpone',
        templateUrl: 'templates/work/task/postpone.html',
        controller: 'WorkTaskListDetailsPostponeCtrl'
    })
    //任务查看－列表－详情-提交任务
    .state('work_task_list_details_refer', {
        url: '/work/task_list/:id/details/refer',
        templateUrl: 'templates/work/task/refer.html',
        controller: 'WorkTaskListDetailsReferCtrl'
    })
    //任务查看－列表－详情-确认任务
    .state('work_task_list_details_approve', {
        url: '/work/task_list/:id/details/approve',
        templateUrl: 'templates/work/task/approve.html',
        controller: 'WorkTaskListDetailsApproveCtrl'
    })
    //任务查看－列表－详情-讨论
    .state('work_task_list_details_Discuss', {
        url: '/work/task_list/:id/details/discuss',
        templateUrl: 'templates/work/task/discuss.html',
        controller: 'WorkTaskListDetailsDiscussCtrl'
    })

     //日程
    .state('work_schedule', {
        url: '/work/schedule',
        templateUrl: 'templates/work/schedule/index.html',
        controller: 'WorkScheduleCtrl',
        cache: false
    })
    //日程详情
    .state('work_schedule_details', {
        url: '/work/schedule/:id',
        templateUrl: 'templates/work/schedule/details.html',
        controller: 'WorkScheduleDetailsCtrl',
        cache: false
    })
    //日程新增
    .state('work_schedule_add', {
        url: '/work/schedule_add',
        templateUrl: 'templates/work/schedule/add.html',
        controller: 'WorkScheduleAddCtrl',
        cache: false
    })
    //日程编辑
    .state('work_schedule_edit', {
        url: '/work/schedule_edit/:id',
        templateUrl: 'templates/work/schedule/edit.html',
        controller: 'WorkScheduleEidtCtrl',
        cache: false
    })
    //我的日程
    .state('work_schedule_my', {
        url: '/work/schedule_my',
        templateUrl: 'templates/work/schedule/my.html',
        controller: 'WorkScheduleMyCtrl',
        case: false
    })


    //申请
    .state('work_apply', {
        url: '/work/apply',
        templateUrl: 'templates/work/apply/index.html',
        controller: 'WorkApplyCtrl'
    })
    //申请－新增列表
    .state('work_apply_addlist', {
        url: '/work/apply/addlist',
        templateUrl: 'templates/work/apply/add-list.html',
        controller: 'WorkApplyAddListCtrl'
    })
    //申请－我代办的维修列表
    .state('work_apply_my_task', {
        url: '/work/apply/myTask',
        templateUrl: 'templates/work/apply/my-task.html',
        controller: 'WorkApplyMyTaskCtrl'
    })
    //申请－我的维修详情
    .state('work_apply_my_task_details', {
        url: '/work/apply/myTaskDetails/:id',
        templateUrl: 'templates/work/apply/my-task-details.html',
        controller: 'WorkApplyMyTaskDetailsCtrl'
    })
    //申请-其他申请
    .state('work_apply_addother', {
        url: '/work/apply/addother',
        templateUrl: 'templates/work/apply/add-other.html',
        controller: 'WorkApplyAddOtherCtrl',
        cache: false
    })
    //申请-其他审批
    .state('work_apply_auditOther', {
        url: '/work/apply/auditOther/:id',
        templateUrl: 'templates/work/apply/audit-other.html',
        controller: 'WorkApplyAuditOtherCtrl',
        cache: false
    })
    //申请-报残申请
    .state('work_apply_adddiscard', {
        url: '/work/apply/adddiscard',
        templateUrl: 'templates/work/apply/add-discard.html',
        controller: 'WorkApplyAddDiscardCtrl',
        cache: false
    })
    //申请-报残申请-审核
    .state('work_apply_auditDiscount', {
        url: '/work/apply/auditDiscount/:id',
        templateUrl: 'templates/work/apply/audit-discard.html',
        controller: 'WorkApplyAuditDiscardCtrl',
        cache: false
    })
    //申请-优惠申请
    .state('work_apply_addprivilege', {
        url: '/work/apply/addprivilege',
        templateUrl: 'templates/work/apply/add-privilege.html',
        controller: 'WorkApplyAddPrivilegeCtrl',
        cache: false
    })
    //申请-优惠申请-审核
    .state('work_apply_auditprivilege', {
        url: '/work/apply/auditprivilege/:id',
        templateUrl: 'templates/work/apply/audit-privilege.html',
        controller: 'WorkApplyAuditPrivilegeCtrl',
        cache: false
    })
    //申请-请假申请
    .state('work_apply_addleave', {
        url: '/work/apply/addleave',
        templateUrl: 'templates/work/apply/add-leave.html',
        controller: 'WorkApplyAddLeaveCtrl',
        cache: false
    })
    //申请-请假审批
    .state('work_apply_auditLeave', {
        url: '/work/apply/auditLeave/:id',
        templateUrl: 'templates/work/apply/audit-leave.html',
        controller: 'WorkApplyAuditLeaveCtrl'
    })
    //申请-工程维修申请
    .state('work_apply_addmaintain', {
        url: '/work/apply/addmaintain',
        templateUrl: 'templates/work/apply/add-maintain.html',
        controller: 'WorkApplyAddMaintainCtrl',
        cache: false
    })
    //申请-工程维修审批
    .state('work_apply_auditMaintain', {
        url: '/work/apply/auditMaintain/:id',
        templateUrl: 'templates/work/apply/audit-maintain.html',
        controller: 'WorkApplyAuditMaintainCtrl',
        cache: false
    })
    //申请-采购申请
    .state('work_apply_addPurchase', {
        url: '/work/apply/addPurchase',
        templateUrl: 'templates/work/apply/add-purchase.html',
        controller: 'WorkApplyAddPurchaseCtrl',
        cache: false
    })
    //申请-采购审批
    .state('work_apply_auditPurchase', {
        url: '/work/apply/auditPurchase/:id',
        templateUrl: 'templates/work/apply/audit-purchase.html',
        controller: 'WorkApplyAuditPurchaseCtrl',
        cache: false
    })
    
    


    //申请-通知
    .state('work_notify', {
        url: '/work/notify',
        templateUrl: 'templates/work/notify/index.html',
        controller: 'WorkNotifyCtrl'
    })
    //申请-我的通知
    .state('work_notify_my', {
        url: '/work/notify/my',
        templateUrl: 'templates/work/notify/my.html',
        controller: 'WorkNotifyMyCtrl'
    })
    //申请－通知详情
    .state('work_notify_details', {
        url: '/work/notify/details/:id',
        templateUrl: 'templates/work/notify/details.html',
        controller: 'WorkNotifyDetailsCtrl',
        cache: false
    })
    //申请－发布通知
    .state('work_notify_add', {
        url: '/work/notify/add',
        templateUrl: 'templates/work/notify/add.html',
        controller: 'WorkNotifyAddCtrl',
        cache: false
    })
    //申请－编辑通知
    .state('work_notify_edit', {
        url: '/work/notify/edit/:id',
        templateUrl: 'templates/work/notify/edit.html',
        controller: 'WorkNotifyEditCtrl',
        cache: false
    })
    

    //汇报
    .state('work_report', {
        url: '/work/report',
        templateUrl: 'templates/work/report/index.html',
        controller: 'WorkReportCtrl'
    })
    //汇报-写日报
    .state('work_report_addDaily', {
        url: '/work/report/add-daily',
        templateUrl: 'templates/work/report/add-daily.html',
        controller: 'WorkReportAddDailyCtrl'
    })
    //汇报-写周报
    .state('work_report_addWeek', {
        url: '/work/report/add-week',
        templateUrl: 'templates/work/report/add-week.html',
        controller: 'WorkReportAddWeekCtrl'
    })
    //汇报-写月报
    .state('work_report_addMonth', {
        url: '/work/report/add-month',
        templateUrl: 'templates/work/report/add-month.html',
        controller: 'WorkReportAddMonthCtrl'
    })
    //汇报-工作汇报详情
    .state('work_report_detail', {
        url: '/work/report/detail/:id',
        templateUrl: 'templates/work/report/detail.html',
        controller: 'WorkReportDetailCtrl'
    })
    //汇报-日报统计
    .state('work_report_record', {
        url: '/work/report/record',
        templateUrl: 'templates/work/report/record.html',
        controller: 'WorkReportRecordCtrl'
    })
    //汇报-日报统计-个人
    .state('work_report_record_person', {
        url: '/work/report/record/:id',
        templateUrl: 'templates/work/report/record-person.html',
        controller: 'WorkReportRecordPersonCtrl'
    })

    //值班
    .state('work_onDuty', {
        url: '/work/onDuty',
        templateUrl: 'templates/work/onDuty/index.html',
        controller: 'WorkOnDutyCtrl'
    })
    //值班-目标设定
    .state('work_onDuty_setting', {
        url: '/work/onDuty/setting/:id',
        templateUrl: 'templates/work/onDuty/setting.html',
        controller: 'WorkOnDutySettingCtrl'
    })
    //值班-目标跟进
    .state('work_onDuty_follow', {
        url: '/work/onDuty/follow/:id',
        templateUrl: 'templates/work/onDuty/follow.html',
        controller: 'WorkOnDutyFollowCtrl'
    })
    //值班-值班检查
    .state('work_onDuty_check', {
        url: '/work/onDuty/check/:id',
        templateUrl: 'templates/work/onDuty/check.html',
        controller: 'WorkOnDutyCheckCtrl'
    })
    //值班-值班查询
    .state('work_onDuty_query', {
        url: '/work/onDuty/query',
        templateUrl: 'templates/work/onDuty/query.html',
        controller: 'WorkOnDutyQueryCtrl'
    })
    //值班-值班详情
    .state('work_onDuty_details', {
        url: '/work/onDuty/query/details/:id',
        templateUrl: 'templates/work/onDuty/details.html',
        controller: 'WorkOnDutyDetailsCtrl'
    })


    //crm-start

    //客户
    .state('work_client', {
        url: '/work/client',
        templateUrl: 'templates/work/client/index.html',
        controller: 'WorkClientCtrl',
        cache: false
    })
    //客户-详情
    .state('work_client_details', {
        url: '/work/client/details/:id',
        templateUrl: 'templates/work/client/details.html',
        controller: 'WorkClientDetailsCtrl'
    })
    //客户-创建
    .state('work_client_create', {
        url: '/work/client/create',
        templateUrl: 'templates/work/client/create.html',
        controller: 'WorkClientCreateCtrl'
    })
    //客户-修改
    .state('work_client_edit', {
        url: '/work/client/edit/:id',
        templateUrl: 'templates/work/client/edit.html',
        controller: 'WorkClientEditCtrl'
    })

    //商机
    .state('work_opportunity', {
        url: '/work/opportunity',
        templateUrl: 'templates/work/opportunity/index.html',
        controller: 'WorkOpportunityCtrl'
    })
    //商机-详情
    .state('work_opportunity_details', {
        url: '/work/opportunity/details/:id',
        templateUrl: 'templates/work/opportunity/details.html',
        controller: 'WorkOpportunityDetailsCtrl'
    })
    //商机-创建
    .state('work_opportunity_create', {
        url: '/work/opportunity/create',
        templateUrl: 'templates/work/opportunity/create.html',
        controller: 'WorkOpportunityCreateCtrl',
        cache: false
    })
    //商机-修改
    .state('work_opportunity_edit', {
        url: '/work/opportunity/edit/:id',
        templateUrl: 'templates/work/opportunity/edit.html',
        controller: 'WorkOpportunityEditCtrl',
        cache: false
    })

    //回访
    .state('work_visit', {
        url: '/work/visit',
        templateUrl: 'templates/work/visit/index.html',
        controller: 'WorkVisitCtrl'
    })
    //回访-详情
    .state('work_visit_details', {
        url: '/work/visit/details/:id',
        templateUrl: 'templates/work/visit/details.html',
        controller: 'WorkVisitDetailsCtrl'
    })
    //回访-添加
    .state('work_visit_create', {
        url: '/work/visit/create',
        templateUrl: 'templates/work/visit/create.html',
        controller: 'WorkVisitCreateCtrl',
        cache: false
    })
    //回访-编辑
    .state('work_visit_edit', {
        url: '/work/visit/edit/:id',
        templateUrl: 'templates/work/visit/edit.html',
        controller: 'WorkVisitEditCtrl',
        cache: false
    })

    //crm-end


    //学习园区-start

    //百科-模块
    .state('work_cyclopedia', {
        url: '/work/cyclopedia',
        templateUrl: 'templates/work/cyclopedia/index.html',
        controller: 'WorkCyclopediaCtrl',
        cache: false
    })
    //百科-详情列表
    .state('work_cyclopedia_list', {
        url: '/work/cyclopedia/list/:id',
        templateUrl: 'templates/work/cyclopedia/list.html',
        controller: 'WorkCyclopediaListCtrl',
        cache: false
    })
    //百科-新建
    .state('work_cyclopedia_add', {
        url: '/work/cyclopedia/add',
        templateUrl: 'templates/work/cyclopedia/add.html',
        controller: 'WorkCyclopediaAddCtrl'
    })
    //百科-详情
    .state('work_cyclopedia_details', {
        url: '/work/cyclopedia/details/:id',
        templateUrl: 'templates/work/cyclopedia/details.html',
        controller: 'WorkCyclopediaDetailsCtrl'
    })

    //案例分享-模块
    .state('work_share', {
        url: '/work/share',
        templateUrl: 'templates/work/share/index.html',
        controller: 'WorkShareCtrl',
        cache: false
    })
    //案例分享-新增
    .state('work_share_add', {
        url: '/work/share/add',
        templateUrl: 'templates/work/share/add.html',
        controller: 'WorkShareAddCtrl'
    })
    //案例分享-新增
    .state('work_share_details', {
        url: '/work/share/details/:id',
        templateUrl: 'templates/work/share/details.html',
        controller: 'WorkShareDetailsCtrl'
    })

    //案例分享-模块
    .state('work_fab', {
        url: '/work/fab',
        templateUrl: 'templates/work/fab/index.html',
        controller: 'WorkFabCtrl',
        cache: false
    })
    //百科-新建
    .state('work_fab_add', {
        url: '/work/fab/add',
        templateUrl: 'templates/work/fab/add.html',
        controller: 'WorkFabAddCtrl'
    })
    //百科-详情
    .state('work_fab_details', {
        url: '/work/fab/details/:id',
        templateUrl: 'templates/work/fab/details.html',
        controller: 'WorkFabDetailsCtrl'
    })

    //案例分享-模块
    .state('work_course', {
        url: '/work/course',
        templateUrl: 'templates/work/course/index.html',
        controller: 'WorkCourseCtrl',
        cache: false
    })
    //案例分享-新增
    .state('work_course_add', {
        url: '/work/course/add',
        templateUrl: 'templates/work/course/add.html',
        controller: 'WorkCourseAddCtrl'
    })
    //案例分享-详情
    .state('work_course_details', {
        url: '/work/course/details/:id',
        templateUrl: 'templates/work/course/details.html',
        controller: 'WorkCourseDetailsCtrl'
    })

    //学习园区-end

    //我
    .state('tab.account', {
        url: '/account',
        cache: false,
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    })

    //我－个人信息
    .state('me_info', {
        url: '/me/info',
        templateUrl: 'templates/me/info.html',
        controller: 'MeInfoCtrl',
        cache: false
    })
    //我－消息设置
    .state('me_set_msg', {
        url: '/me/setMsg',
        templateUrl: 'templates/me/set-msg.html',
        controller: 'MeSetMsgCtrl'
    })
    //我－通讯录
    .state('me_set_address', {
        url: '/me/address',
        templateUrl: 'templates/me/address.html',
        controller: 'MeAddressCtrl'
    })
    //我－通讯录
    .state('me_set_address_guys', {
        url: '/me/address/:id',
        templateUrl: 'templates/me/guys.html',
        controller: 'MeAddressGuysCtrl'
    })
    //我－关于
    .state('me_about', {
        url: '/me/about',
        templateUrl: 'templates/me/about.html',
        controller: 'MeAboutCtrl'
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
