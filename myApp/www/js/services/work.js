angular.module('work.services', [])

.factory('workPlatform', function(common) {
    var list = [{
        id: 0,
        name: '通知',
        info: '一呼百应',
        link: '#/work/notify',
        isView: true,
        icon: 'img/icon/work/notify.png',
        warnKey: 'showUnReadInformPrompt'
    }, {
        id: 1,
        name: '日程',
        info: '时间安排',
        link: '#/work/schedule',
        icon: 'img/icon/work/schedule.png',
        warnKey: 'showUnReadRiChengPrompt'
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
        icon: 'img/icon/work/apply.png',
        warnKey: 'showUnReadApplicationPrompt'
    }, {
    	id: 4,
    	name: '任务',
    	info: '分配任务，逐一跟踪',
        link: '#/work/task',
        icon: 'img/icon/work/task.png',
        warnKey: 'showUnReadTaskPrompt'
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
        icon: 'img/icon/work/share.png',
        link: '#/work/share'
    }, {
        name: '经典FAB',
        info: '精彩FAB话术',
        icon: 'img/icon/work/trick.png',
        link: '#/work/fab'
    }, {
        name: '专题课程',
        info: '针对单一问题详细阐述',
        icon: 'img/icon/work/course.png',
        link: '#/work/course'
    }];

    // probation：0表示不是试用期，1表示是试用期；试用期只能查看 签到、通知、学习资料
    // viewReport：0表示不能查看工作汇报，1表示能查看工作汇报；

    return {
        all: function() {
            var userInfo = JSON.parse(common.getLocalStorage('userInfo'));
            var _arr = list;

            if (userInfo.probation == 1) {
                _arr = [];
                for (var i = 0, ii = list.length; i < ii; i++) {
                    if (list[i].id == 0 || list[i].id == 2) {
                        _arr.push(list[i]);
                    }
                }
            }

            if (userInfo.viewReport == 0) {
                _arr = _arr.slice(0, -1);
            }

            return _arr;
        },
        crm: function() {
            var userInfo = JSON.parse(common.getLocalStorage('userInfo'));
            if (userInfo.probation == 1) {
                return [];
            }

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
.factory('workCyclopediaType', function(common) {
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


    return {
        all: function(cb) {
            COMMON.post({
                type: 'jewelry_category',
                data: {},
                success: function(data) {
                    _blockData = data.body.jewelryCategory;

                    for (var i = 0, ii = _blockData.length; i < ii; i++) {
                        _blockData[i].id = _blockData[i].sequence;
                        _blockData[i].text = _blockData[i].name;
                    }

                    if (typeof cb == 'function') {
                        cb(_blockData);
                    }
                }
            });
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

//案例分享模块-类别选择数据
.factory('workShareSele', function(common) {
    var ajax = function(type, cb) {
        COMMON.post({
            type: type,
            data: {},
            success: function(data) {
                if (typeof cb == 'function') {
                    cb(data);
                }
            }
        });
    }
    return {
        //客服类型
        customer: function(cb) {
            ajax('customer_category', cb);
        },
        //货品品类
        goods: function(cb) {
            ajax('goods_category', cb);
        },
        //人数
        number: function(cb) {
            ajax('people_number', cb);
        },
        //人物关系
        relationship: function(cb) {
            ajax('people_relationship', cb);
        },
        //购买用途
        purpose: function(cb) {
            ajax('purchase_purpose', cb);
        },
        //顾客年龄
        age: function(cb) {
            ajax('customer_age', cb);
        },
        //成交金额
        amount: function(cb) {
            ajax('transaction_amount', cb);
        },

        //fab-品类选择
        fab_category: function(cb){
            ajax('fab_goods_category', cb);
        },
        //fab-品名选择
        fab_name: function(cb) {
            ajax('fab_goods_name', cb);
        },

        //专题-tab
        course_category: function(cb) {
            ajax('topic_course_category', cb);
        }
    }
})

//crm模块-类别选择数据
.factory('workCrmSele', function(common) {
    var ajax = function(type, cb) {
        COMMON.post({
            type: type,
            data: {},
            success: function(data) {
                if (typeof cb == 'function') {
                    cb(data);
                }
            }
        });
    }

    return {
        //星级
        star: function(cb) {
            ajax('obtain_stars', function(data) {
                var _starList = data.body.stars,
                    _star = [],
                    _obj = {};

                for (var i = 0; i < _starList.length; i++) {
                    _obj = {
                        id: _starList[i].id,
                        name: '',
                        value: _starList[i].value
                    }

                    for (var j = 0; j < _starList[i].value; j++) {
                        _obj.name += '★';
                    }

                    _star.push(_obj);
                }

                cb(_star);
            });
        },

        //星级组合
        joinStar: function(starVal) {
            var star = '';
            if (!starVal || (starVal && !starVal.value)) {
                starVal = {value: 0};
            }

            for (var i = 0; i < starVal.value; i ++) {
                star += '★';
            }
            return star;
        },

        //客户类型
        customer_types: function(cb) {
            ajax('obtain_customer_types', cb);
        },

        //销售阶段
        salesPhases: function(cb) {
            ajax('obtain_sales_phases', cb);
        },

        //消费方式
        consumption_modes: function(cb){
            ajax('obtain_consumption_modes', cb);
        },

        //回访类型
        visit_types: function(cb) {
            ajax('obtain_visit_types', cb);
        },

        //最后跟进时间
        last_follow_time_filters: function(cb) {
            ajax('obtain_last_follow_up_time_filters', cb);
        },

        //最后消费时间
        last_consumption_time_filters: function(cb) {
            ajax('obtain_last_consumption_time_filters', cb);
        },

        //消费次数
        total_consumption_times: function(cb) {
            ajax('obtain_total_consumption_times_filters', cb);
        },

        //消费金额
        total_consumption_money: function(cb) {
            ajax('obtain_total_consumption_money_filters', cb);
        },

        //回访时间
        visit_time: function(cb) {
            ajax('obtain_visit_time_filters', cb);
        }
    }
})

