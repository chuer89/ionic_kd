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
                taskStatus: taskStatus
            };
        }
    }
})

.factory('common', function($http, $cordovaToast, $ionicActionSheet, 
    $state, $cordovaCamera, $cordovaImagePicker, $cordovaDatePicker, $cordovaFileTransfer) {
    var obj = {
        post: function(opt) {
            var data = opt.data || {};
            var type = opt.type || '';
            var success = opt.success;
            var error = opt.error;

            var fail = function(msg) {
                $cordovaToast
                .show(msg, 'short', 'bottom');
            }

            if (typeof success != 'function') {
                success = function(){
                    $cordovaToast
                    .show('成功', 'short', 'bottom');
                };
            }

            if (typeof error != 'function') {
                error = function() {
                    $cordovaToast
                    .show('请稍后再试', 'short', 'bottom');
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
                url: 'http://123.206.95.25:18080/kuaidao/client/resources.html',
                params: {
                    json: JSON.stringify(param)
                }
            }).success(function(data) {
                if (data.status != '1000' && !opt.noFail) {
                    fail(data.message || '数据有误');
                } else {
                    success(data)
                }
            }).error(function(data) {
                error(data);
            });

            // $http({
            //     method: 'POST',
            //     url: 'http://123.206.95.25:18080/kuaidao/client/resources.html',
            //     params: {
            //         // json: '{"appType":"IOS","appVersion":"1.0.0","body":{},"businessType":"departmrnt_info"}'
            //         json: '{"appType":"IOS","appVersion":"1.0.0","body":{"mobile":13889521999,"password":123456},"businessType":"client_login"}'
            //     }
            // }).success(function(data) {
            //     console.log(data)
            // }).error(function(data) {

            // })
        },

        //当前登录用户信息
        userInfo: {
            clientId: 153
            // clientId: 28
        },

        //内容缓存（预计父 子页面通信，保存数据）
        _localstorage: {},

        showSelePhoto: function(id) {
            id = id || 'myImage';

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

            var formData = new FormData();

            var camera = function() {
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
                    // var image = document.getElementById(id);  
                    // image.src = "data:image/jpeg;base64," + imageData;

                    // rLFSURL(imageData);

                    // upImg();

                    alert(0);

                    jj(imageData);
                }, function(err) {  
                    // error  
                });  
            }

            var jj = function(imgData) {
                var url = 'http://123.206.95.25:18080/kuaidao/client/resources.html';
                var options = new FileUploadOptions();
                options.fileKey = 'fuJians';
                var json = '{"appType":"IOS","appVersion":"1.0.0","body":{"departmentList":[{"departmentId":3}],"userList":[{"userId":153}],"description":"内容1和O","title":"测试文件上传h5-3号","id":153},"businessType":"create_inform"}';

                options.json = json;

                $cordovaFileTransfer.upload(encodeURI(url), imgData, options)
                  .then(function (result) {
                    alert(1)
                  }, function (err) {
                    alert(2)
                  }, function (progress) {
                    alert(3)
                    // constant progress updates
                  });
            }

            var CacheData = {
                setImgFileList: function(the_file) {
                    formData.append("fuJians", the_file, "images.jpg");
                }
            }

            var phone = function() {
                var options = {
                    maximumImagesCount: 10,
                    width: 800,
                    height: 800,
                    quality: 80,
                    saveToPhotoAlbum: true
                };

                $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                    
                    for (var i = 0; i < results.length; i++) {
                        rLFSURL(results[i]);
                        // console.log('Image URI: ' + results[i]);
                    }

                    upImg();
                }, function(error) {
                    // error getting photos
                });
            }

            var rLFSURL = function (imageURI){
                window.resolveLocalFileSystemURL(imageURI, function(fileEntry) {
                    fileEntry.file(function(file) {
                        var reader = new FileReader();
                        reader.onloadend = function(e) {
                            //需要将图片路径转换为二进制流，并且指定类型为图像格式（还有其他格式，如文本格式等等）
                            var the_file = new Blob([e.target.result ], { type: "image/jpeg" } );
                            //存储图片二进制流
                            CacheData.setImgFileList(the_file);

                            //存储图片地址用于预览
                            // CacheData.setImageURIList(imageURI);
                        };
                        reader.readAsArrayBuffer(file);
                    }, function(e){$scope.errorHandler(e)});
                }, function(e){$scope.errorHandler(e)});
            }

            var upImg = function() {
                var json = '{"appType":"IOS","appVersion":"1.0.0","body":{"departmentList":[{"departmentId":3}],"userList":[{"userId":153}],"description":"内容1和O","title":"测试文件上传h5-3号","id":153},"businessType":"create_inform"}';

                formData.append('json', json);

                // alert(JSON.stringify(formData));

                $http({
                    method: 'POST',
                    url: 'http://123.206.95.25:18080/kuaidao/client/resources.html',
                    params: formData
                }).success(function(data) {
                    alert(JSON.stringify(data))
                }).error(function(data) {

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

        format: function (date, fmt) {
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
                success: function(data) {
                    var _body = data.body;

                    if (typeof cb == 'function') {
                        cb(_body);
                    }
                }
            });
        },

        //审核人&查询人
        getAuditorUser: function (cb, isQuery) {
            var _type = 'auditor_user';

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

        //气泡提醒
        toast: function(txt, cb) {
            if (!txt) {
                return;
            }

            $cordovaToast
            .show(txt, 'short', 'bottom')
            .then(function(success) {
                if (typeof cb == 'function') {
                    cb();
                }
            }, function (error) {
              // error
            });
        },

        //日期选择
        datePicker: function(cb) {
            var options = {
                date: new Date(),
                mode: 'date', // or 'time'
                minDate: new Date() - 10000,
                allowOldDates: true,
                allowFutureDates: false,
                doneButtonLabel: 'DONE',
                doneButtonColor: '#F2F3F4',
                cancelButtonLabel: 'CANCEL',
                cancelButtonColor: '#000000'
            };

            document.addEventListener("deviceready", function () {
                $cordovaDatePicker.show(options).then(function(date){
                    if (typeof cb == 'function') {
                        cb(date);
                    }
                });
            }, false);
        }
    };

    window.COMMON = obj;

    return obj;
})
