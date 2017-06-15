angular.module('message.services', [])

.factory('messagePush', function() {
    var list = [{
        id: 0,
        name: '通知：24号上午开周会',
        intro: '24号上午10:20在19楼所有店经理开周例会',
        time: '19:00',
        icon: 'img/icon/work/notify.png'
    }, {
        id: 1,
        name: '日程：暴力和李涮吧出国',
        intro: '申请5009元钻石9折卡',
        time: '20:30',
        icon: 'img/icon/work/schedule.png'
    }, {
        id: 2,
        name: '签到：舒服凉快积分啊啥地方',
        intro: '啥地方啊是否理解啊舒服啊舒服看',
        time: '21:49',
        icon: 'img/icon/work/sign_in.png'
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

.factory('seleMenuList', function() {
    //星级
    var star = [{name: '★'}, {name: '★★'}, {name: '★★★'}, {name: '★★★★'}, {name: '★★★★★'}, {name: '全部'}];

    //周期
    var period = [{name: '半年'}, {name: '一年'}, {name: '一年半'}, {name: '两年'}, {name: '三年'}, {name: '三年以上'}];

    //频次
    var frequency = [{name: '一次'}, {name: '两次'}, {name: '三次'}, {name: '四次'}, {name: '五次以上'}];

    //全额
    var amount = [{name: '1000'}, {name: '2000'}, {name: '4000'}, {name: '6000'}, {name: '8000+'}];

    return {
        menu: function() {
            return {
                star: star,
                period: period,
                frequency: frequency,
                amount: amount
            };
        }
    }
})
