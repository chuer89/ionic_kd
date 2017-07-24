angular.module('perfomance.controller', [])

//绩效
.controller('PerfomanceCtrl', function($scope, $state, $ionicPopup, $timeout, $ionicActionSheet, seleMenuList, common) {
    $scope.data = {
        month: common.format(false, 'MM'),
        year: common.format(false, 'yyyy'),
        type: ''
    };

    var menus = seleMenuList.menu();

    $scope.items = [];

    var dataList = {
        currentPage: 0,
        items: []
    };

    $scope.showNav = function () {
        $ionicActionSheet.show({
            buttons: [{
                text: '绩效查询'
            }, {
                text: '绩效开单'
            }],
            cancelText: '取消',
            buttonClicked: function (index) {
                
                var _go = 'perfomance_query';

                if (index == 1) {
                    _go = 'perfomance_add';
                }

                $state.go(_go);
                return true;
            }
        });
    }

    var handleAjax = function (isNotLoading) {
        if (isNotLoading) {
            common.loadingShow();
        }

        var _param = angular.extend({}, $scope.data, {
            currentPage: dataList.currentPage + 1,
            departmentId: seleDepartmentId
        });

        common.post({
            type: 'jixiao_index_page',
            data: _param,
            notPretreatment: true,
            success: function(data) {
                common.loadingHide();
                var _body = data.body;

                if (!_body || (_body && !_body.items) || (_body && _body.items && !_body.items.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                dataList = _body;

                var list = _body.items;
                
                for (var i = 0, ii = list.length; i < ii; i++) {
                    list[i].nickname = common.nickname(list[i].name);
                    $scope.items.push(list[i]);
                }

                $timeout(function() {
                    $scope.vm.moredata = true;
                }, 1000);
            }
        });
    }, initData = function(isNotLoading) {
        dataList = {
            currentPage: 0,
            items: []
        };

        $scope.items = [];

        handleAjax(isNotLoading);
    }

    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.items.length < common._pageSize || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
                $scope.vm.moredata = false;
                return;
            }

            $timeout(function () {
                $scope.vm.moredata = false;
                handleAjax(true);
            }, 1500);
            return true;
        }
    }

    //选择部门-start

    var seleDepartmentId = '';

    $scope.seleBrank = [];
    $scope.seleDepartment = [];
    $scope.seleType = [{name:'全部', key:''}, {name:'奖励',key:'JIANG_LI'},{name:'扣分',key:'KOU_FEN'}];
    $scope.seleDate = menus.seleMonth;

    $scope.seleBrankInfo = '品牌';
    $scope.seleDepartmentInfo = '部门';
    $scope.seleDateInfo = common.format(false, 'yyyy-MM');
    $scope.seleTypeInfo = '类别';

    $scope.isShowBrankSele = false;
    $scope.isShowDepartmentSele = false;
    $scope.isShowDateSele = false;
    $scope.isShowTypeSele = false;

    //选择菜单处理
    var toggleSeleHandle = function(type, isAjax) {
        if (type == 'brank') {
            $scope.isShowDepartmentSele = false;
            $scope.isShowDateSele = false;
            $scope.isShowTypeSele = false;

            $scope.isShowBrankSele = !$scope.isShowBrankSele;
        } else if (type == 'department') {
            $scope.isShowBrankSele = false;
            $scope.isShowDateSele = false;
            $scope.isShowTypeSele = false;

            if (!$scope.seleDepartment.length) {
                common.toast('请选择正确品牌');
                return;
            }

            $scope.isShowDepartmentSele = !$scope.isShowDepartmentSele;
        } else if (type == 'date') {
            $scope.isShowBrankSele = false;
            $scope.isShowDepartmentSele = false;
            $scope.isShowTypeSele = false;

            $scope.isShowDateSele = !$scope.isShowDateSele;
        } else if(type == 'type') {
            $scope.isShowBrankSele = false;
            $scope.isShowDepartmentSele = false;
            $scope.isShowDateSele = false;

            $scope.isShowTypeSele = !$scope.isShowTypeSele;
        }

        if (isAjax) {
            initData(true);
        }
    }

    //选择部门
    var _seleBrankHandle = function(item) {
        seleDepartmentId = item.departmentId;

        $scope.seleBrankInfo = item.name;
        $scope.seleDepartmentInfo = '部门';

        $scope.seleDepartment = item.childDepartment;
    }
    
    $scope.seleBrankHandle = function(item) {
        _seleBrankHandle(item);

        toggleSeleHandle('brank', true);
    }
    $scope.seleDepartmentHandle = function(item) {
        seleDepartmentId = item.departmentId;
        $scope.seleDepartmentInfo = item.name;

        toggleSeleHandle('department', true);
    }

    $scope.seleDateHandle = function(item) {
        var date = {};

        if (item.key == 'prev') {
            date = common.getPrevDate($scope.seleDateInfo)
        } else if (item.key == 'next') {
            date = common.getNextDate($scope.seleDateInfo)
        } else {
            date = common.getNowDate();
        }

        $scope.data.year = date.year;
        $scope.data.month = date.month;

        $scope.seleDateInfo = date.date;

        toggleSeleHandle('date', true);
    }

    $scope.seleTypeHandle = function(item) {
        $scope.data.type = item.key;
        $scope.seleTypeInfo = item.name;

        toggleSeleHandle('type', true);
    }

    //筛选切换
    $scope.toggleSele = function(type) {
        toggleSeleHandle(type);
    }

    //加载部门&公司
    common.getCompany(function(data) {
        $scope.seleBrank = data;

        _seleBrankHandle(data[0]);
        initData();
    });

    //选择部门-end
})

// 绩效查询
.controller('QueryPerfomaceCtrl', function($scope, $state, seleMenuList, perfomanceQuery, common) {
    var _nowDate = common.getNowDate();

    $scope.data = {
        endDate: _nowDate.date + '-' + _nowDate.day,
        startDate: _nowDate.date + '-01',
        keywords: ''
    };

    var menus = seleMenuList.menu();

    $scope.items = [];

    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
    }

    var handleAjax = function (isNotLoading) {
        if (isNotLoading) {
            common.loadingShow();
        }

        var _param = angular.extend({}, $scope.data, {
            departmentId: seleDepartmentId
        });

        common.post({
            type: 'jixiao_info',
            data: _param,
            notPretreatment: true,
            success: function(data) {
                common.loadingHide();
                var _body = data.body;

                $scope.queryDate = common.getNowDate(_param.startDate).date;

                if (!_body || (_body && !_body.jixiao) || (_body && _body.jixiao && !_body.jixiao.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                var list = _body.jixiao;
                var _list = [];
                
                for (var i = 0, j = 1, ii = list.length; i < ii; i++) {
                    if (list[i].name) {
                        list[i].nickname = common.nickname(list[i].name);
                        list[i].sort = j;

                        j += 1;
                        _list.push(list[i]);    
                    }
                }

                if (!_list.length) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                $scope.items = _list;
            }
        });
    }, initData = function(isNotLoading) {
        $scope.items = [];

        handleAjax(isNotLoading);
    }

    //选择部门-start

    var seleDepartmentId = '';

    $scope.seleBrank = [];
    $scope.seleDepartment = [];
    $scope.seleDate = menus.seleMonth;

    $scope.seleBrankInfo = '品牌';
    $scope.seleDepartmentInfo = '部门';
    $scope.seleDateInfo = _nowDate.date;

    $scope.isShowBrankSele = false;
    $scope.isShowDepartmentSele = false;
    $scope.isShowDateSele = false;

    //选择菜单处理
    var toggleSeleHandle = function(type, isAjax) {
        if (type == 'brank') {
            $scope.isShowDepartmentSele = false;
            $scope.isShowDateSele = false;

            $scope.isShowBrankSele = !$scope.isShowBrankSele;
        } else if (type == 'department') {
            $scope.isShowBrankSele = false;
            $scope.isShowDateSele = false;

            if (!$scope.seleDepartment.length) {
                common.toast('请选择正确品牌');
                return;
            }

            $scope.isShowDepartmentSele = !$scope.isShowDepartmentSele;
        } else if (type == 'date') {
            $scope.isShowDepartmentSele = false;
            $scope.isShowBrankSele = false;

            $scope.isShowDateSele = !$scope.isShowDateSele;
        }

        if (isAjax) {
            initData(true);
        }
    }

    //选择部门
    var _seleBrankHandle = function(item) {
        seleDepartmentId = item.departmentId;

        $scope.seleBrankInfo = item.name;
        $scope.seleDepartmentInfo = '部门';

        $scope.seleDepartment = item.childDepartment;
    }
    
    $scope.seleBrankHandle = function(item) {
        _seleBrankHandle(item);

        toggleSeleHandle('brank', true);
    }
    $scope.seleDepartmentHandle = function(item) {
        seleDepartmentId = item.departmentId;
        $scope.seleDepartmentInfo = item.name;

        toggleSeleHandle('department', true);
    }
    $scope.seleDateHandle = function(item) {
        var date = {};

        if (item.key == 'prev') {
            date = common.getPrevDate($scope.seleDateInfo)
        } else if (item.key == 'next') {
            date = common.getNextDate($scope.seleDateInfo)
        } else {
            date = common.getNowDate();
        }

        $scope.data.startDate = date.date + '-01';
        $scope.data.endDate = date.date + '-' + date.day;

        $scope.seleDateInfo = date.date;

        toggleSeleHandle('date', true);
    }

    //筛选切换
    $scope.toggleSele = function(type) {
        toggleSeleHandle(type);
    }

    //加载部门&公司
    common.getCompany(function(data) {
        $scope.seleBrank = data;

        _seleBrankHandle(data[0]);
        initData();
    });

    //选择部门-end
})

// 绩效列表
.controller('ListPerfomance', function($scope, $stateParams, $timeout, common) {
    $scope.items = [];

    var _nowDate = common.getNowDate($stateParams.id);

    common.getUserinfo_simple(28, function(data) {
        $scope.titleName = data.name;
    });

    $scope.data = {
        month: _nowDate.month,
        year: _nowDate.year,
        clientId: 28
    };
    var dataList = {
        currentPage: 0,
        items: []
    };

    var handleAjax = function (isNotLoading) {
        if (isNotLoading) {
            common.loadingShow();
        }

        var _param = angular.extend({}, $scope.data, {
            currentPage: dataList.currentPage + 1
        });

        common.post({
            type: 'jixiao_index_page',
            data: _param,
            notPretreatment: true,
            success: function(data) {
                common.loadingHide();
                var _body = data.body;

                if (!_body || (_body && !_body.items) || (_body && _body.items && !_body.items.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                dataList = _body;

                var list = _body.items;
                
                for (var i = 0, ii = list.length; i < ii; i++) {
                    list[i].nickname = common.nickname(list[i].name);
                    $scope.items.push(list[i]);
                }

                $timeout(function() {
                    $scope.vm.moredata = true;
                }, 1000);
            }
        });
    }, initData = function(isNotLoading) {
        dataList = {
            currentPage: 0,
            items: []
        };

        $scope.items = [];

        handleAjax(isNotLoading);
    }

    initData(true);

    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.items.length < common._pageSize || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
                $scope.vm.moredata = false;
                return;
            }

            $timeout(function () {
                $scope.vm.moredata = false;
                handleAjax(true);
            }, 1500);
            return true;
        }
    }
})

// 绩效详情
.controller('DetailsPerfomance', function ($scope, $state, $stateParams, perfomanceQuery, common) {
    $scope.item = perfomanceQuery.get($stateParams.id);

    var ajax = function(isNotLoading) {
        if (isNotLoading) {
            common.loadingShow();
        }

        common.post({
            type: 'jixiao_details',
            data: {
                jiXiaoId: $stateParams.id
            },
            notPretreatment: true,
            success: function(data) {
                common.loadingHide();
                var _body = data.body;

                if (!_body) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                _body.nickname = common.nickname(_body.kaoHeDuiXiang)

                $scope.item = _body;
            }
        });
    }
    ajax(true);
})

// 绩效开单
.controller('AddPerfomance', function ($scope, $ionicActionSheet, $stateParams, $cordovaCamera, perfomanceQuery, common) {
    $scope.data = {
        typePageName: 'AddPerfomance',
        clientIdSele: {name: '请选择'}
    };

    perfomanceQuery.projectItems(function(data) {
        var _projectItems = common.setSeleRepeat(data.body.items, 'itemTitle');

        $scope.showSeleProject = function() {
            $ionicActionSheet.show({
                buttons: _projectItems,
                cancelText: '取消',
                buttonClicked: function(index, item) {
                    $scope.data.title = item.text;
                    return true;
                }
            })
        }
    });

    $scope.showSeleType = function() {
        $ionicActionSheet.show({
            buttons: perfomanceQuery.seleMenusType,
            cancelText: '取消',
            buttonClicked: function(index, item) {
                $scope.data.type = item.key;
                return true;
            }
        })
    }

    //表单数据
    var formElement = document.querySelector("form");
    var formData = new FormData(formElement);

    $scope.showSelePhoto = function() {
        common.showSelePhoto({
            appendPhone: function(the_file) {
                formData.append("fuJians", the_file, "images.jpg");
            }
        });
    }


    $scope.create = function() {
        var _data = $scope.data;

        var _param = angular.extend(_data, {
            creatorId: common.userInfo.clientId,
            clientId: _data.clientIdSele.id
        });

        common.formData({
            type: 'jixiao_create',
            body: _param,
            setData: function(json) {
                formData.append("json", json);
            },
            data: formData,
            success: function(data) {
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    };

    if (common.setAuditorUserList.id) {
        if (common.setAuditorUserList._targetName == 'perfomance_add') {
            common._localstorage.clientIdSele = common.setAuditorUserList;
        }
    }

    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
    }
})



