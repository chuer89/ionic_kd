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
    //星级-可删
    var star = [{name: '★'}, {name: '★★'}, {name: '★★★'}, {name: '★★★★'}, {name: '★★★★★'}, {name: '全部'}];

    //周期-可删
    var period = [{name: '半年'}, {name: '一年'}, {name: '一年半'}, {name: '两年'}, {name: '三年'}, {name: '三年以上'}];

    //频次-可删
    var frequency = [{name: '一次'}, {name: '两次'}, {name: '三次'}, {name: '四次'}, {name: '五次以上'}];

    //全额-可删
    var amount = [{name: '1000'}, {name: '2000'}, {name: '4000'}, {name: '6000'}, {name: '8000+'}];

    //销售阶段
    var market = [{name: '初步意向'}, {name: '洽谈阶段'}, {name: '基本达成'}, {name: '成交'}, {name: '失败'}, {name: '无效'}];

    //品牌
    var brank = [{name: '翠湖店'}, {name: 'LOVE&sc'}, {name: '其他'}];

    //部门
    var department = [{name: '办公室'}, {name:'华南店'}, {name: '开发区店'}];

    //申请的状态
    var applicationStatus = [{name:'等批准',key:'PENDING'},{name:'批准',key:'APPROVE'},{name:'拒绝',key:'REJECT'}];

    //申请的类型
    var applicationType = [{name:'请假',key:'LEAVE'},{name:'采购',key:'PURCHASE'},
    {name:'其他',key:'OTHER'},{name:'任务延迟',key:'TASK_DELAY'}];


    //任务状态
    var taskStatus = [{name:'工作中',key:'WORKING'},{name:'未确认',key:'UNCONFIRMED'},
    {name:'合格',key:'QUALIFIED'},{name:'不合格',key:'UNQUALIFIED'}];

    //任务提醒时间
    var taskWarn = [{text:'提前3小时',key: 3}, {text:'提前6小时',key: 6},{text:'提前1天',key: 24}];

    //重复
    var cycletime = [{name:'不重复',key: 'NO_CYCLE'},{name:'每天',key: 'DAY'},
    {name:'每周',key: 'WEEK'},{name:'每月',key: 'MONTH'}];

    //提醒
    var remindtime = [{name: '事情发生时',key:'0'},{name: '提前30分钟',key:'30'},
    { name: '提前1小时',key:'60'},{ name: '提前2小时',key:'120'},{ name: '提前5小时',key:'300'}];

    //签到类型
    var qianDaoType = [{text:'早班', key:'ZAO_BAN'},{text:'中班',key:'ZHONG_BAN'},{text:'晚班',key:'WAN_BAN'}];

    //月份选择
    var seleMonth = [{name:'上月',key:'prev'},{name:'本月',key:'now'},{name:'下月',key:'next'}];


    return {
        menu: function() {
            return {
                star: star,
                period: period,
                frequency: frequency,
                amount: amount,
                market: market,
                brank: brank,
                department: department,
                applicationStatus: applicationStatus,
                applicationType: applicationType,
                taskStatus: taskStatus,
                cycletime: cycletime,
                remindtime: remindtime,
                qianDaoType: qianDaoType,
                taskWarn: taskWarn,
                seleMonth: seleMonth
            };
        }
    }
})

.factory('common', function($http, $cordovaToast, $ionicActionSheet, $filter, ionicDatePicker, 
    $state, $cordovaCamera, $cordovaImagePicker, $cordovaDatePicker, $cordovaFileTransfer, 
    $ionicPopup, $ionicLoading, $cordovaGeolocation) {
    var obj = {

        onlineHost: 'http://123.206.95.25:18080',
        debugHost: 'http://192.168.201.237:8080',

        isChrome: true,

        notTaskListDataTxt: '-暂无数据-',

        post: function(opt) {
            var data = opt.data || {};
            var type = opt.type || '';
            var success = opt.success;
            var error = opt.error;

            if (!COMMON.userInfo.clientId && (
                type != 'send_code' && type != 'client_login' && type != 'change_password'
                )){
                $state.go('login');
            }

            //opt.notPretreatment 不预处理 默认false

            var fail = function(msg) {
                COMMON.toast(msg);
            }

            if (typeof success != 'function') {
                success = function(){
                    COMMON.toast('成功');
                };
            }

            if (typeof error != 'function') {
                error = function() {
                    COMMON.toast('请稍后再试');
                }
            }

            var param = {
                appType: 'IOS',
                appVersion: '1.0.0',
                body: data,
                businessType: type
            }

            $http({
                method: 'POST',
                url: COMMON.onlineHost + '/kuaidao/client/resources.html',
                params: {
                    json: JSON.stringify(param)
                }
            }).success(function(data) {
                if (opt.notPretreatment) {
                    success(data);
                    return;
                }

                if (data.status != '1000' && !opt.noFail) {
                    COMMON.loadingHide();
                    fail(data.message || '数据有误');
                } else {
                    success(data);
                }

            }).error(function(data) {
                error(data);
            });
        },

        //jquery formData附件上传
        formData: function(opt) {
            var _data = {
                appType: 'IOS',
                appVersion: '1.0.0',
                businessType: opt.type || '',
                body: opt.body || ''
            }

            if (typeof opt.setData == 'function') {
                //需要formData设置参数
                opt.setData(JSON.stringify(_data));
            } else {
                return;
            }

            $.ajax({
                url: COMMON.onlineHost + '/kuaidao/client/resources.html',
                type: 'POST',
                data: opt.data,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data.status != '1000' && !opt.noFail) {
                        COMMON.toast(data.message || '数据有误');
                    } else {
                        opt.success(data);
                    }
                },
                error: function (responseStr) {
                    COMMON.toast('接口异常');
                }
            });
        },

        loadingShow: function(opt) {
            var _opt = angular.extend({
                template: '加载中...',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            }, opt);

            $ionicLoading.show(_opt);
        },

        loadingHide: function() {
            $ionicLoading.hide();
        },

        //当前登录用户信息
        userInfo: {},

        setLocalStorage: function(key, value) {
            if (localStorage) {
                localStorage[key] = value;
            }
        },
        getLocalStorage: function(key) {
            if (localStorage){
                return localStorage[key];
            } else {
                return '';
            }
        },
        clearLocalStorage: function() {
            if (localStorage) {
                localStorage.clear();
            }
        },

        //内容缓存（预计父 子页面通信，保存数据）
        _localstorage: {},

        //分页条数
        _pageSize: 40,

        //调起相册
        showSelePhoto: function(opt) {
            var _opt = {
                domId: 'myImage',//显示图片id
                phone:  '',//相册回调
                camera: '',//相机
                appendPhone: ''
            }
            angular.extend(_opt, opt);

            $ionicActionSheet.show({
                buttons: [
                    {text: '拍照'},
                    {text: '从手机相册选择'}
                ],
                cancelText: '取消',
                buttonClicked: function(index, item) {
                    if (index) {
                        phone();
                    } else {
                        camera();
                    }
                    return true;
                }
            });

            var _appendPhone = function(imgData) {
                window.resolveLocalFileSystemURL(imgData, function(fileEntry) {
                    fileEntry.file(function(file) {
                        var reader = new FileReader();
                        reader.onloadend = function(e) {
                            /*******华丽丽的分割线**********/
                            //需要将图片路径转换为二进制流，并且指定类型为图像格式（还有其他格式，如文本格式等等）
                            //这里用了两个files，代表上传两张图片
                            var the_file = new Blob([e.target.result ], { type: "image/jpeg" } );
                            if (typeof _opt.appendPhone == 'function') {
                                _opt.appendPhone(the_file);
                            }
                        };
                        reader.readAsArrayBuffer(file);

                    }, function(e){
                        COMMON.toast('加载相册内容失败');
                    });
                }, function(e){
                    COMMON.toast('加载相册失败');
                });
            }, convertBase64UrlToBlob = function (urlData){
                var bytes=window.atob(urlData.split(',')[1]);

                //处理异常,将ascii码小于0的转换为大于0
                var ab = new ArrayBuffer(bytes.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < bytes.length; i++) {
                    ia[i] = bytes.charCodeAt(i);
                }

                return new Blob( [ab] , {type : 'image/jpg'});
            }, phone = function() {
                var options = {
                    maximumImagesCount: 10,
                    width: 800,
                    height: 800,
                    quality: 80,
                    saveToPhotoAlbum: true
                };

                //调起相册
                $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        _appendPhone(results[i])
                    }
                }, function(error) {
                    COMMON.toast('获取相册失败');
                });
            }, camera = function() {
                var options = {  
                    quality: 50,  
                    destinationType: Camera.DestinationType.DATA_URL,  
                    sourceType: Camera.PictureSourceType.CAMERA,  
                    allowEdit: true,  
                    encodingType: Camera.EncodingType.JPEG,  
                    targetWidth: 100,  
                    targetHeight: 100,
                    popoverOptions: CameraPopoverOptions,  
                    saveToPhotoAlbum: true  
                };  

                $cordovaCamera.getPicture(options).then(function(imageData) {  
                    var image = document.getElementById(_opt.domId);  
                    // image.src = "data:image/jpeg;base64," + imageData;

                    var _imageData = "data:image/jpeg;base64," + imageData;
                    var the_file = convertBase64UrlToBlob(_imageData);

                    image.src = _imageData;

                    if (typeof _opt.appendPhone == 'function') {
                        _opt.appendPhone(the_file);
                    }
                }, function(err) {
                    COMMON.toast('无法启动相机，请检查授权');
                });  
            }
        },

        nickname: function(name) {
            name = name || '';
            return name.substr(-2);
        },

        getId: function(list, id, key) {
            key = key || 'id';
            list = list || [];

            for (var i = 0; i < list.length; i++) {
                if (list[i][key] == id) {
                    return list[i];
                }
            }
            return null;
        },

        //选择转化默认上拉数据
        setSeleRepeat: function(list, key) {
            list = list || [];

            key = key || 'name';

            for (var i = 0, ii = list.length; i < ii; i++) {
                list[i].text = list[i][key];
            }

            return list;
        },

        format: function (date, fmt, isNotHanle) {

            var _d = '2017-07-16 19:21:44';

            //yyyy-MM-dd HH:mm 24小时

            fmt = fmt || 'yyyy-MM-dd HH:mm';

            if (!date || typeof date == 'object') {
                return $filter('date')(new Date(), fmt);
            }

            if (isNotHanle) {
                return $filter('date')(new Date(date), fmt);
            }

            var _arr = date.split(' ');

            var _y, _t, _o;

            _y = _arr[0].split('-');
            _o = {
                yyyy: _y[0],
                MM: _y[1],
                dd: _y[2]
            }

            if (_arr[1] && fmt.indexOf(':')) {
                _t = _arr[1].split(':');
                _o = angular.extend(_o, {
                    HH: _t[0], 
                    mm: _t[1], 
                    ss: _t[2]
                });
            }

            for (var k in _o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, _o[k])
                }
            }

            return fmt;


            // 对Date的扩展，将 Date 转化为指定格式的String
            // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
            // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
            // 例子： 
            // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
            // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
            if (!date) {
                return '';
            }

            date = date || new Date;
            fmt = fmt || 'yyyy-MM-dd hh:mm';

            var __date = $filter('date')(new Date(date), fmt);
            return __date;

            var _date = new Date(date);
            var o = {
                "M+": _date.getMonth() + 1, //月份 
                "d+": _date.getDate(), //日 
                "h+": _date.getHours(), //小时 
                "m+": _date.getMinutes(), //分 
                "s+": _date.getSeconds(), //秒 
                "q+": Math.floor((_date.getMonth() + 3) / 3), //季度 
                "S": _date.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },

        timeNumber: function(time) {
            if (!time) {
                return '';
            }
            return time.replace(/\-|\:|\s/g, '');
        },

        minusTime: function(a, b) {
            var _a1 = a.substr(0, 2) - 0,
                _a2 = a.substr(2, 2) - 0,
                _b1 = b.substr(0, 2) - 0,
                _b2 = b.substr(2, 2) - 0;

            var _a = _a1 * 60 + _a2,
                _b = _b1 * 60 + _b2;

            return _a - _b;
        },

        getWeek: function() {
            var _week = new Date().getDay();
            var _obj = {
                0: '天', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六'
            };

            return '星期' + _obj[_week];
        },

        //获取上一月
        getPrevDate: function(date) {
            var nowDate = COMMON.format(date, 'yyyy-MM-dd');
            var oldArr = nowDate.split('-');

            var old = {
                year: oldArr[0] - 0,
                month: oldArr[1] - 1
            }
            
            if (old.month == 0) {
                old.year -= 1;
                old.month = 12;
            }

            old.day = COMMON.getLastDay(old.year, old.month);
            old.date = old.year + '-' + (old.month < 10 ? '0' + old.month : old.month);

            return old;
        },

        //获取当月
        getNowDate: function(date) {
            var nowDate = COMMON.format(date, 'yyyy-MM-dd');
            var oldArr = nowDate.split('-');

            var old = {
                year: oldArr[0] - 0,
                month: oldArr[1] - 0
            }

            old.day = COMMON.getLastDay(old.year, old.month);
            old.date = old.year + '-' + (old.month < 10 ? '0' + old.month : old.month);

            return old;
        },

        //获取下月
        getNextDate: function(date) {
            var nowDate = COMMON.format(date, 'yyyy-MM-dd');
            var oldArr = nowDate.split('-');

            var old = {
                year: oldArr[0] - 0,
                month: oldArr[1] - 0  + 1
            }
            
            if (old.month > 12) {
                old.year += 1;
                old.month = 1;
            }

            old.day = COMMON.getLastDay(old.year, old.month);
            old.date = old.year + '-' + (old.month < 10 ? '0' + old.month : old.month);

            return old;
        },

        //获取一月中多少天
        getLastDay: function (year,month) {
            return (new Date(year, month, 0)).getDate();

            var new_year = year;  //取当前的年份
            var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
            if(month>12) {     //如果当前大于12月，则年份转到下一年
                new_month -=12;    //月份减
                new_year++;      //年份增
            }   
            var new_date = new Date(new_year,new_month,1);        //取当年当月中的第一天
            return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期
        },

        //公司&部门
        getCompany: function(cb) {
            COMMON.post({
                type: 'departmrnt_info',
                data: {},
                success: function(data) {
                    var _department = data.body.department;
                    if (typeof cb == 'function') {
                        cb(_department);
                    }
                }
            });
        },

        //部门-》人员
        getPhoneBook: function(param, cb) {
            var _param = angular.extend({
                id: COMMON.userInfo.clientId
            }, param);

            COMMON.post({
                type: 'phone_book',
                data: _param,
                notPretreatment: true,
                success: function(data) {
                    var _body = data.body;

                    if (typeof cb == 'function') {
                        cb(_body);
                    }
                }
            });
        },

        //审核人 & 可查询人（有权限控制）
        //templates /common/seleGuys/:id
        getAuditorUser: function (cb, isQuery) {
            var _type = 'auditor_user';

            //有权限
            if (isQuery) {
                _type = 'query_user_list';
            }

            COMMON.post({
                type: _type,
                data: {
                    "id": COMMON.userInfo.clientId,
                },
                success: function(data) {
                    var _userArray = data.body.userArray;
                    if (typeof cb == 'function') {
                        cb(_userArray);
                    }
                }
            });
        },

        //获取选择 人 | 部门
        getCommonSendName: function(cb) {
            var sendName = '';

            if (!COMMON.setCheckedPerson.list) {
                if (typeof cb == 'function') {
                    cb('请选择');
                }
                return;
            }

            if (!COMMON.setCheckedPerson.list.length) {
                sendName = '请选择';
            }

            for (var i = 0, ii = COMMON.setCheckedPerson.list.length; i < ii; i++) {
                sendName += COMMON.setCheckedPerson.list[i].name + ' ';
            }

            if (typeof cb == 'function') {
                cb(sendName);
            }
        },

        //获取选中人
        getCommonCheckedPerson: function(cb) {
            var common = COMMON;
            var _param = {
                userList: [],
                departmentList: []
            };

            if (!COMMON.setCheckedPerson.list) {
                if (typeof cb == 'function') {
                    cb(_param);
                }
                return;
            }

            for (var i = 0, ii = common.setCheckedPerson.list.length; i < ii; i++) {
                if (common.setCheckedPerson.list[i].id) {
                    _param.userList.push({
                        userId: common.setCheckedPerson.list[i].id
                    })
                } else {
                    _param.departmentList.push({
                        departmentId: common.setCheckedPerson.list[i].departmentId
                    })
                }
            }

            if (typeof cb == 'function') {
                cb(_param);
            }
        },

        //选中审核人
        setAuditorUserList: {},
        setCheckedPerson: {list: [], _targetName: ''},//记录-选择通讯录-部门/人

        //筛选选中
        filterChecked: function(list) {
            list = list || [];
            var _list = [];
            for (var i = 0, ii = list.length; i < ii; i++) {
                if (list[i].checked) {
                    _list.push(list[i]);
                }
            };

            return _list;
        },

        //数组对象去重
        repeatArrObj: function(arr, id, cloneId) {
            var _arr = [],
                _obj = {};

            arr = arr || [];

            for (var i = 0, ii = arr.length; i < ii; i++) {
                if (arr[i][id]) {
                    _obj[arr[i][id]] = arr[i];    
                } else {
                    _obj[arr[i][cloneId]] = arr[i];
                }
                
            }

            for (var k in _obj) {
                _arr.push(_obj[k]);
            }

            return _arr;
        },

        delEmptyObj: function(obj) {

        },

        //气泡提醒
        toast: function(txt, cb) {
            if (!txt) {
                return;
            }

            if (COMMON.isChrome) {
                console.log(txt);
                if (typeof cb == 'function') {
                    cb();
                }
                return;
            }

            $cordovaToast
            .show(txt, 'short', 'bottom')
            .then(function(success) {
                if (typeof cb == 'function') {
                    //history.back(-1);
                    //message
                    cb();
                }
            }, function (error) {
              // error
            });
        },

        //弹框
        popup: function(opt, cb) {
            var _opt = {
                title: opt.title || '提醒',
                content: opt.content || '确认此操作吗'
            }
            // 自定义弹窗
            var myPopup = $ionicPopup.show({
                template: _opt.content,
                title: _opt.title,
                buttons: [
                    { text: '取消' },
                    {
                        text: '<b>确认</b>',
                        type: 'button-royal',
                        onTap: function(e) {
                            if (typeof cb == 'function') {
                                cb();
                            }
                            return true;
                        }
                    }
                ]
            });
        },

        //返回上级（历史记录）
        back: function() {
            history.back(-1);
        },

        //根据id 反查姓名
        getUserinfo_simple: function(id, cb) {
            id = id || COMMON.userInfo.clientId;

            COMMON.post({
                type: 'userinfo_simple',
                data: {
                    id: id
                },
                success: function(data) {
                    var _data = data.body;

                    if (typeof cb == 'function') {
                        cb(_data);
                    }
                }
            });
        },

        //模拟 日期 选择
        ionicDatePickerProvider: function(cb, opt) {
            var seleDate = '';

            var fmt = 'yyyy-MM-dd';

            var datePickerObj = {  
                //选择日期后的回掉  
                callback: function (val) {
                    console.log(val, 'yyy')
                    if (typeof (val) === 'undefined') {

                    } else {
                        seleDate = $filter('date')(new Date(val), fmt)

                        if (typeof cb == 'function') {
                            cb(seleDate);
                        }
                        datePickerObj.inputDate = new Date(val); //更新日期弹框上的日期  
                    }  
                },
                dateFormat: fmt
            };

            var _param = angular.extend(datePickerObj, opt);

            //打开日期选择框  
            ionicDatePicker.openDatePicker(_param); 
        },

        changeDate: function(date){},

        //本地日期选择
        datePicker: function(cb, isDateTime) {
            var _mode = 'date',
                fmt = 'yyyy-MM-dd';

            if (isDateTime) {
                _mode = 'datetime';
                fmt = 'yyyy-MM-dd HH:mm';
            }

            //http://www.jianshu.com/p/e7b3e44e366d

            var options = {
                date: new Date,
                mode: _mode, // date丨time丨datetime
                // minDate: new Date() - 10000,
                allowOldDates: true,
                allowFutureDates: true,
                // is24Hour: false,
                locale: "NL",
                locale: "zh_cn",
                doneButtonLabel: '确定',
                doneButtonColor: '#F2F3F4',
                cancelButtonLabel: '取消',
                cancelButtonColor: '#000000',
                doneButtonColor: '#000000'
            };

            document.addEventListener("deviceready", function () {
                $cordovaDatePicker.show(options).then(function(date){
                    var _date = '';
                    if (!date) {
                        return;
                    }
                    if (typeof cb == 'function') {
                        _date = COMMON.format(date + '', fmt, true);
                        cb(_date);
                    }
                });
            }, false);
        },

        //获取经纬度
        getLocation: function(cb) {
            //定位
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                if (typeof cb == 'function') {
                    cb(position);
                }
            }, function(err) {
                COMMON.toast('获取定位失败');
                COMMON.loadingHide();
                // error
            });
            return;

            var showPosition = function (position) {
                //accuracy 位置精度;  latitude 十进制伟度；longitude 十进制经度
                if (typeof cb == 'function') {
                    cb(position);
                }
            }, showError = function (error) {
                // Permission denied - 用户不允许地理定位
                // Position unavailable - 无法获取当前位置
                // Timeout - 操作超时
                var errorTips = '';

                COMMON.loadingHide();

                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorTips = '请允许地理定位';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorTips = '无法获取当前位置';
                        break;
                    case error.TIMEOUT:
                        errorTips = '定位超时';
                        break;
                    case error.UNKNOWN_ERROR:
                        errorTips = '定位异常';
                        break;
                }

                if (errorTips != '') {
                    COMMON.toast(errorTips);
                }
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, showError);
            }
        }
    };

    window.COMMON = obj;

    obj.userInfo.clientId = obj.getLocalStorage('clientId');

    return obj;
})
