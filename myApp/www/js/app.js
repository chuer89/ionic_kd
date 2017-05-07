// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'route'])

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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.backButton.text('').previousTitleText(false);

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
    //绩效详情
    .state('perfomance_details', {
        url: '/perfomance/details/:id',
        templateUrl: 'templates/perfomance/details.html',
        controller: 'DetailsPerfomance'
    })
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

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
