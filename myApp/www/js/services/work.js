angular.module('work.services', [])

.factory('workPlatform', function() {
    var list = [{
        id: 0,
        name: '通知',
        info: '一呼百应',
        link: '#/work/notify',
        icon: 'img/icon/work/notify.png'
    }, {
        id: 1,
        name: '日程',
        info: '时间安排',
        link: '#/work/schedule',
        count: 1,
        icon: 'img/icon/work/schedule.png'
    }, {
    	id: 2,
    	name: '签到',
    	info: '上下班打卡',
    	link: '#/work/sign_in',
        icon: 'img/icon/work/sign_in.png'
    }, {
    	id: 3,
    	name: '申请',
    	info: '请假、优惠、调换、维修等',
        link: '#/work/apply',
        icon: 'img/icon/work/apply.png'
    }, {
    	id: 4,
    	name: '任务',
    	info: '分配任务，逐一跟踪',
        link: '#/work/task',
        icon: 'img/icon/work/task.png'
    }, {
    	id: 5,
    	name: '值班',
    	info: '每日工作，按部就班',
        link: '#/work/onDuty',
        icon: 'img/icon/work/onDuty.png'
    }, {
    	id: 6,
    	name: '工作汇报',
    	info: '周报月报，全面详实',
        link: '#/work/report',
        icon: 'img/icon/work/report.png'
    }];

    var crm = [{
        name: '客户',
        info: '管理客户信息，记录沟通细节',
        count: 1,
        icon: 'img/icon/work/customer.png',
        link: '#/work/client'
    }, {
        name: '商机',
        info: '跟踪销售过程，挖掘潜在机会',
        icon: 'img/icon/work/opportunity.png',
        link: '#/work/opportunity'
    }, {
        name: '回访',
        info: '3周、3月、生日、纪念日顾客回访',
        icon: 'img/icon/work/visit.png',
        link: '#/work/visit'
    }];

    var learn = [{
        name: '珠宝百科',
        info: '珠宝知识大全',
        icon: 'img/icon/work/cyclopedia.png',
        link: '#/work/cyclopedia'
    }, {
        name: '案例分享',
        info: '各种经典案例集合',
        icon: 'img/icon/work/share.png'
    }, {
        name: '经典FAB',
        info: '精彩FAB话术',
        icon: 'img/icon/work/trick.png'
    }, {
        name: '专题课程',
        info: '针对单一问题详细阐述',
        icon: 'img/icon/work/course.png'
    }]

    return {
        all: function() {
            return list;
        },
        crm: function() {
            return crm;
        },
        learn: function() {
            return learn;
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

//任务tab 列 ；可删
.factory('workTaskList', function() {
    var list = [{
        name: '待办',
        isShowTab: true,
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

//日程提醒 - 可删
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
        link: '#/work/apply/addleave',
        icon: 'img/icon/apply/addleave.png'
    }, {
        id: 1,
        name: '采购申请',
        tips: '请填写好你要申请采购的详细信息',
        link: '#/work/apply/addPurchase',
        icon: 'img/icon/apply/addPurchase.png'
    }, {
        id: 2,
        name: '优惠申请',
        tips: '请填写好你要申请优惠的详细信息',
        link: '#/work/apply/addprivilege',
        icon: 'img/icon/apply/addprivilege.png'
    }, {
        id: 3,
        name: '报残申请',
        tips: '请填写好残次情况的详细信息',
        link: '#/work/apply/adddiscard',
        icon: 'img/icon/apply/adddiscard.png'
    }, {
        id: 4,
        name: '工程维修申请',
        tips: '请填写好你要维修申请的详细信息',
        link: '#/work/apply/addmaintain',
        icon: 'img/icon/apply/addmaintain.png'
    }, {
        id: 5,
        name: '其他申请',
        tips: '其他类型申请',
        link: '#/work/apply/addother',
        icon: 'img/icon/apply/addother.png'
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

//百科-类型
.factory('workCyclopediaType', function() {
    var blockData = [{
        name: '黄金'
    }, {
        name: 'K金'
    }, {
        name: '铂金'
    }, {
        name: '钻石'
    }, {
        name: '玉石'
    }, {
        name: '银饰'
    }, {
        name: '金壤玉'
    }, {
        name: '璧玺'
    }, {
        name: '水晶石'
    }, {
        name: '人造石'
    }, {
        name: '葡萄石'
    }, {
        name: '蓝宝石'
    }, {
        name: '红宝石'
    }, {
        name: '石榴石'
    }, {
        name: '芙蓉石'
    }, {
        name: '珍珠'
    }, {
        name: '玛瑙石'
    }, {
        name: '蜜蜡'
    }, {
        name: '珊瑚'
    }, {
        name: '琥珀'
    }, {
        name: '猫眼石'
    }];

    var _blockData = [];

    for (var i = 0, ii = blockData.length; i < ii; i++) {
        blockData[i].id = i;
    }

    COMMON.post({
        type: 'jewelry_category',
        data: {},
        success: function(data) {
            _blockData = data.body.jewelryCategory;

            for (var i = 0, ii = _blockData.length; i < ii; i++) {
                _blockData[i].id = _blockData[i].sequence;
                _blockData[i].text = _blockData[i].name;
            }
        }
    });

    return {
        all: function() {
            return _blockData;
        },
        get: function(id) {
          for (var i = 0; i < blockData.length; i++) {
            if (blockData[i].id === parseInt(id)) {
              return blockData[i];
            }
          }
          return null;
        }
    }
})
