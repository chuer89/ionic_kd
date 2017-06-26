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

    return {
        menu: function() {
            return {
                star: star,
                period: period,
                frequency: frequency,
                amount: amount,
                market: market
            };
        }
    }
})

.factory('common', function($http, $cordovaToast, $ionicActionSheet, $state, $cordovaCamera, $cordovaImagePicker) {
    var obj = {
        post: function(opt) {
            var data = opt.data || {};
            var type = opt.type || '';
            var success = opt.success;
            var error = opt.error;

            var fail = function(msg) {
                $cordovaToast
                .show(msg, 'long', 'bottom');
            }

            if (typeof success != 'function') {
                success = function(){
                    $cordovaToast
                    .show('成功', 'long', 'bottom');
                };
            }

            if (typeof error != 'function') {
                error = function() {
                    $cordovaToast
                    .show('请稍后再试', 'long', 'bottom');
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

        userInfo: {
            clientId: 3
        },

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
                    saveToPhotoAlbum: false  
                };  

                $cordovaCamera.getPicture(options).then(function(imageData) {  
                    var image = document.getElementById(id);  
                    image.src = "data:image/jpeg;base64," + imageData;  
                }, function(err) {  
                    // error  
                });  
            }

            var phone = function() {
                var options = {
                    maximumImagesCount: 10,
                    width: 800,
                    height: 800,
                    quality: 80
                };

                $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        // console.log('Image URI: ' + results[i]);
                    }
                }, function(error) {
                    // error getting photos
                });
            }
        }
    };

    window.COMMON = obj;

    return obj;
})
