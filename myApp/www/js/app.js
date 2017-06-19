// Ionic Starter App

// angularhttp://192.168.4.143/wpad.dat.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'route', 'ionic-datepicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, ionicDatePickerProvider) {

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

    var datePickerObj = {
        inputDate: new Date(),
        // setLabel: 'Set',
        // todayLabel: 'Today',
        // closeLabel: 'Close',
        mondayFirst: false,
        weeksList: ["S", "M", "T", "W", "T", "F", "S"],
        monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
        templateType: 'popup',
        // from: new Date(2012, 8, 1),
        // to: new Date(2018, 8, 1),
        // showTodayButton: true,
        dateFormat: 'yyyy-MM-dd'
        // closeOnSelect: false,
        // disableWeekdays: [6]
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);

  // $ionicConfigProvider.views.swipeBackEnabled(false);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
    $stateProvider

    //登陆
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })

    //找回密码
    .state('forgotPsd', {
        url: '/forgotPsd',
        templateUrl: 'templates/password/find-back.html',
        controller: 'ForgotPsdCtrl'
    })

    //修改密码
    .state('modifyPsd', {
        url: '/modifyPsd',
        templateUrl: 'templates/password/modify.html',
        controller: 'ModifyPsdCtrl'
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
        controller: 'AddPerfomance'
    })

    //消息
    .state('tab.message', {
        url: '/message',
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
        templateUrl: 'templates/work/sign_in.html',
        controller: 'WorkSigInCtrl'
    })
    //签到查询
    .state('work_sign_in_query', {
        url: '/work/sign_in_query',
        templateUrl: 'templates/work/signIn/query.html',
        controller: 'WorkSigInQueryCtrl'
    })
    //签到历史
    .state('work_sign_in_query_history', {
        url: '/work/sign_in_history/:id',
        templateUrl: 'templates/work/signIn/history.html',
        controller: 'WorkSigInHistoryCtrl'
    })
    //签到申请
    .state('work_sign_in_apply', {
        url: '/work/sign_in_apply',
        templateUrl: 'templates/work/signIn/apply.html',
        controller: 'WorkSigInApplyCtrl'
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
        controller: 'WorkTaskAddCtrl'
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
        controller: 'WorkTaskListDetailsCtrl'
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
        controller: 'WorkScheduleCtrl'
    })
    //日程详情
    .state('work_schedule_details', {
        url: '/work/schedule/:id',
        templateUrl: 'templates/work/schedule/details.html',
        controller: 'WorkScheduleDetailsCtrl'
    })
    //日程新增
    .state('work_schedule_add', {
        url: '/work/schedule_add',
        templateUrl: 'templates/work/schedule/add.html',
        controller: 'WorkScheduleAddCtrl'
    })
    //我的日程
    .state('work_schedule_my', {
        url: '/work/schedule_my',
        templateUrl: 'templates/work/schedule/my.html',
        controller: 'WorkScheduleMyCtrl'
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
    //申请-其他申请
    .state('work_apply_addother', {
        url: '/work/apply/addother',
        templateUrl: 'templates/work/apply/add-other.html',
        controller: 'WorkApplyAddOtherCtrl'
    })
    //申请-报残申请
    .state('work_apply_adddiscard', {
        url: '/work/apply/adddiscard',
        templateUrl: 'templates/work/apply/add-discard.html',
        controller: 'WorkApplyAddDiscardCtrl'
    })
    //申请-优惠申请
    .state('work_apply_addprivilege', {
        url: '/work/apply/addprivilege',
        templateUrl: 'templates/work/apply/add-privilege.html',
        controller: 'WorkApplyAddPrivilegeCtrl'
    })
    //申请-请假申请
    .state('work_apply_addleave', {
        url: '/work/apply/addleave',
        templateUrl: 'templates/work/apply/add-leave.html',
        controller: 'WorkApplyAddLeaveCtrl'
    })
    //申请-工程维修申请
    .state('work_apply_addmaintain', {
        url: '/work/apply/addmaintain',
        templateUrl: 'templates/work/apply/add-maintain.html',
        controller: 'WorkApplyAddMaintainCtrl'
    })
    //申请-采购申请
    .state('work_apply_addPurchase', {
        url: '/work/apply/addPurchase',
        templateUrl: 'templates/work/apply/add-purchase.html',
        controller: 'WorkApplyAddPurchaseCtrl'
    })
    //申请-请假审批
    .state('work_apply_auditLeave', {
        url: '/work/apply/auditLeave',
        templateUrl: 'templates/work/apply/audit-leave.html',
        controller: 'WorkApplyAuditLeaveCtrl'
    })
    //申请-采购审批
    .state('work_apply_auditPurchase', {
        url: '/work/apply/auditPurchase',
        templateUrl: 'templates/work/apply/audit-purchase.html',
        controller: 'WorkApplyAuditPurchaseCtrl'
    })
    //申请-其他审批
    .state('work_apply_auditOther', {
        url: '/work/apply/auditOther',
        templateUrl: 'templates/work/apply/audit-other.html',
        controller: 'WorkApplyAuditOtherCtrl'
    })

    //申请
    .state('work_notify', {
        url: '/work/notify',
        templateUrl: 'templates/work/notify/index.html',
        controller: 'WorkNotifyCtrl'
    })
    //申请－详情
    .state('work_notify_details', {
        url: '/work/notify/details/:id',
        templateUrl: 'templates/work/notify/details.html',
        controller: 'WorkNotifyDetailsCtrl'
    })
    //申请－发布通知
    .state('work_notify_add', {
        url: '/work/notify/add',
        templateUrl: 'templates/work/notify/add.html',
        controller: 'WorkNotifyAddCtrl'
    })
    //申请－选择通知部门
    .state('work_notify_sele_section', {
        url: '/work/notify/seleSection',
        templateUrl: 'templates/work/notify/sele-section.html',
        controller: 'WorkNotifySeleSectionCtrl'
    })
    //申请－选择通知人员
    .state('work_notify_sele_person', {
        url: '/work/notify/selePerson/:id',
        templateUrl: 'templates/work/notify/sele-person.html',
        controller: 'WorkNotifySelePersonCtrl'
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
    //汇报-查看工作汇报
    .state('work_report_history', {
        url: '/work/report/history',
        templateUrl: 'templates/work/report/history.html',
        controller: 'WorkReportHistoryCtrl'
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

    //值班
    .state('work_onDuty', {
        url: '/work/onDuty',
        templateUrl: 'templates/work/onDuty/index.html',
        controller: 'WorkOnDutyCtrl'
    })
    //值班-目标设定
    .state('work_onDuty_setting', {
        url: '/work/onDuty/setting',
        templateUrl: 'templates/work/onDuty/setting.html',
        controller: 'WorkOnDutySettingCtrl'
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

    //客户
    .state('work_client', {
        url: '/work/client',
        templateUrl: 'templates/work/client/index.html',
        controller: 'WorkClientCtrl'
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

    //我
    .state('tab.account', {
        url: '/account',
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
        controller: 'MeInfoCtrl'
    })
    //我－消息设置
    .state('me_set_msg', {
        url: '/me/setMsg',
        templateUrl: 'templates/me/set-msg.html',
        controller: 'MeSetMsgCtrl'
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
