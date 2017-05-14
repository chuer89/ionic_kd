angular.module('work.services', [])

.factory('workPlatform', function() {
    var list = [{
        id: 0,
        name: '通知',
        info: '一呼百应'
    }, {
        id: 1,
        name: '日程',
        info: '时间安排',
        count: 1
    }, {
    	id: 2,
    	name: '签到',
    	info: '上下班打卡',
    	link: '#/work/sign_in'
    }, {
    	id: 3,
    	name: '申请',
    	info: '请假、优惠、调换、维修等'
    }, {
    	id: 4,
    	name: '任务',
    	info: '分配任务，逐一跟踪',
        link: '#/work/task'
    }, {
    	id: 5,
    	name: '值班',
    	info: '每日工作，按部就班'
    }, {
    	id: 6,
    	name: '工作汇报',
    	info: '周报月报，全面详实'
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

.factory('workHistoryQuery', function() {
    var list = [{
        id: 0,
        name: '汤品',
        tips: '分数线'
    }, {
        id: 1,
        name: '雷同',
        tips: '冰雹理想'
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

.factory('workTaskQuery', function () {
    var list = [{
        id: 0,
        name: '丽丽',
        tips: '分数线'
    }, {
        id: 1,
        name: '堂庑',
        tips: '冰雹理想'
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

.factory('workTaskList', function() {
    var list = [{
        name: '待办',
        list: [{
            title: '打理好所有柜台的清洁',
            status: '工作中',
            person: '李严嵩',
            time: '2017-03-22 11:22'
        }, {
            title: '刷客厅、卧室马桶',
            status: '未确认',
            person: '李严嵩',
            time: '2017-05-04 01:43'
        }, {
            title: '宠物洗澡',
            status: '不合格',
            person: '李严嵩',
            time: '2017-10-22 07:02'
        }]
    }, {
        name: '已完成'
    }, {
        name: '发起'
    }, {
        name: '关注'
    }, {
        name: '检查'
    }];

    return {
        all: function() {
            return list;
        }
    }
})


