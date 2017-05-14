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
