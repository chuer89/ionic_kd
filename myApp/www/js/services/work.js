angular.module('work.services', [])

.factory('workPlatform', function() {
    var list = [{
        id: 0,
        name: '通知',
        info: '一呼百应',
        link: '#/work/notify'
    }, {
        id: 1,
        name: '日程',
        info: '时间安排',
        link: '#/work/schedule',
        count: 1
    }, {
    	id: 2,
    	name: '签到',
    	info: '上下班打卡',
    	link: '#/work/sign_in'
    }, {
    	id: 3,
    	name: '申请',
    	info: '请假、优惠、调换、维修等',
        link: '#/work/apply'
    }, {
    	id: 4,
    	name: '任务',
    	info: '分配任务，逐一跟踪',
        link: '#/work/task'
    }, {
    	id: 5,
    	name: '值班',
    	info: '每日工作，按部就班',
        link: '#/work/onDuty'
    }, {
    	id: 6,
    	name: '工作汇报',
    	info: '周报月报，全面详实',
        link: '#/work/report'
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
            id: 0,
            time: '2017-03-22 11:22'
        }, {
            title: '刷客厅、卧室马桶',
            status: '未确认',
            id: 1,
            person: '李严嵩',
            time: '2017-05-04 01:43'
        }, {
            title: '宠物洗澡',
            id: 2,
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
        },
        taskList: function() {
            return list[0].list;
        },
        get: function(id) {
            var _list = list[0].list;
          for (var i = 0; i < _list.length; i++) {
            if (_list[i].id === parseInt(id)) {
              return _list[i];
            }
          }
          return null;
        }
    }
})

//日程提醒
.factory('workScheduleWarn', function() {
    var list = [{
        id: 0,
        time: '今天15:20',
        tips: '飞机场'
    }, {
        id: 1,
        time: '3月20日 周五 17:00',
        tips: '儿子生日',
        target: '孙宏',
        remark: '孙总 吴总 堂姐 去探望 总锦鲤',
        personnel: '朱总 孙总 吴准备'
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

//申请列表
.factory('workApplyList', function() {
    var auditLink = {
        'auditLeave': '#/work/apply/auditLeave',
        'auditPurchase': '#/work/apply/auditPurchase',
        'auditOther': '#/work/apply/auditOther'
    }

    var audit = [{
        id: 0,
        date: '2017-09-11 14:32',
        tips: '[加班][技术吧]调休 4月26休息一天',
        status: '审核',
        link: auditLink['auditLeave']
    }, {
        id: 2,
        date: '2017-10-22 14:32',
        tips: '[采购][技术吧]帮帮球',
        status: '审核',
        link: auditLink['auditPurchase']
    }, {
        id: 3,
        date: '2017-11-02 10:12',
        tips: '[其他][财务部]打篮球 爬山 9月11号团建',
        status: '审核',
        link: auditLink['auditOther']
    }], apply = [{
        id: 0,
        date: '2017-03-11 11:12',
        tips: '[请假][总经办]孙红 2月20休息三天',
        status: '申请'
    }]

    return {
        all: function(type) {
            var _list = audit;
            if (type == 'apply') {
                _list = apply;
            }
            return _list;
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

//申请新增列表
.factory('workApplyAddList', function() {
     var list = [{
        id: 0,
        name: '请假申请',
        tips: '请填写好你的请假原由',
        link: '#/work/apply/addleave'
    }, {
        id: 1,
        name: '采购申请',
        tips: '请填写好你要申请采购的详细信息',
        link: '#/work/apply/addPurchase'
    }, {
        id: 2,
        name: '优惠申请',
        tips: '请填写好你要申请优惠的详细信息',
        link: '#/work/apply/addprivilege'
    }, {
        id: 3,
        name: '报残申请',
        tips: '请填写好残次情况的详细信息',
        link: '#/work/apply/adddiscard'
    }, {
        id: 4,
        name: '工程维修申请',
        tips: '请填写好你要维修申请的详细信息',
        link: '#/work/apply/addmaintain'
    }, {
        id: 5,
        name: '其他申请',
        tips: '其他类型申请',
        link: '#/work/apply/addother'
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

//工作－通知－列表
.factory('workNotifyList', function() {
    var list = [{
        id: 0,
        name: '丽丽',
        title: '本周例会',
        tips: '所有店尽量周二上午9:00到办公室19楼开周例会02-11 13看内容曝光书'
    }, {
        id: 1,
        name: '随意',
        title: '关于首饰回收细则调整',
        tips: '所有市场销售一线员工，10；299毁灭中中行可决定是否看见啥地方'
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

//工作－通知－选择－部门
.factory('workSeleNotifySectionList', function() {
    var list = [{
        id: 0,
        name: '总经理',
        num: 3
    }, {
        id: 1,
        name:'人力资源',
        num: 2
    }, {
        id: 2,
        name: '财务部',
        num: 3
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
