angular.module('message.services', [])

.factory('messagePush', function() {
    var list = [{
        id: 0,
        name: '通知：24号上午开周会',
        intro: '24号上午10:20在19楼所有店经理开周例会',
        time: '19:00'
    }, {
        id: 1,
        name: '日常：暴力和李涮吧出国',
        intro: '申请5009元钻石9折卡',
        time: '20:30'
    }];

    return {
        all: function() {
            return list;
        },
        get: function(id) {
          for (var i = 0; i < list.length; i++) {
            if (list[i].id === parseInt(id)) {
              return list[i];
            }
          }
          return null;
        }
    }
})

.factory('messageSetList', function () {
    var list = [{
        name: '任务信息', checked: true
    }, {
        name: '简报信息', checked: false
    }, {
        name: '通知信息', checked: true
    }, {
        name: '申请信息', checked: false
    }, {
        name: '值班信息', checked: true
    }, {
        name: '绩效信息', checked: true
    }, {
        name: '汇报信息', checked: true
    }, {
        name: '日程信息', checked: true
    }]

    return {
        all: function () {
            return list;
        }
    }
})
