angular.module('perfomance.controller', [])

//绩效
.controller('PerfomanceCtrl', function($scope, $state, $ionicPopup, $timeout, $ionicActionSheet, common) {
    $scope.data = {
        month: common.format(false, 'MM'),
        year: common.format(false, 'yyyy'),
        type: ''
    };

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
                text: '我的绩效'
            }, {
                text: '绩效开单'
            }],
            cancelText: '取消',
            buttonClicked: function (index) {
                
                var _go = 'perfomance_query';

                if (index == 2) {
                    _go = 'perfomance_add';
                }

                console.log(index)

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
    }, initData = function() {
        dataList = {
            currentPage: 0,
            items: []
        };

        $scope.items = [];

        handleAjax();
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
    $scope.seleType = [{name:'全部', key:''}, {name:'奖励',key:'JIANG_LI'},{name:'扣分',key:'KOU_FEN'}]

    $scope.seleBrankInfo = '品牌';
    $scope.seleDepartmentInfo = '部门';
    $scope.seleTypeInfo = '类别';

    $scope.isShowBrankSele = false;
    $scope.isShowDepartmentSele = false;
    $scope.isShowTypeSele = false;

    //选择菜单处理
    var toggleSeleHandle = function(type, isAjax) {
        if (type == 'brank') {
            $scope.isShowDepartmentSele = false;
            $scope.isShowTypeSele = false;

            $scope.isShowBrankSele = !$scope.isShowBrankSele;
        } else if (type == 'department') {
            $scope.isShowBrankSele = false;
            $scope.isShowTypeSele = false;

            if (!$scope.seleDepartment.length) {
                common.toast('请选择正确品牌');
                return;
            }

            $scope.isShowDepartmentSele = !$scope.isShowDepartmentSele;
        } else if (type == 'type') {
            $scope.isShowBrankSele = false;
            $scope.isShowDepartmentSele = false;

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
.controller('QueryPerfomaceCtrl', function($scope, $state, perfomanceQuery, perfomanceList) {
    $scope.data = {};

    $scope.items = perfomanceQuery.all();

    $scope.seleBrand = perfomanceList.seleBrand();
    $scope.seleDepartment = perfomanceList.seleDepartment();

    $scope.isShowBrandSele = false;
    $scope.isShowDepartment = false;

    var toggleSele = function(type) {
        if (type == 'brand') {
            $scope.isShowDepartment = false;
            $scope.isShowBrandSele = !$scope.isShowBrandSele;
        } else {
            $scope.isShowBrandSele = false;
            $scope.isShowDepartment = !$scope.isShowDepartment;
        }
    }

    $scope.toggleSeleBrank = function() {
        toggleSele('brand');
    }
    $scope.toggleSeleDepartment = function() {
        toggleSele('department');
    }

    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
    }
})

// 绩效列表
.controller('ListPerfomance', function($scope, $stateParams, perfomanceQuery) {
    $scope.item = perfomanceQuery.get($stateParams.id);

    $scope.items = perfomanceQuery.all();
})

// 绩效详情
.controller('DetailsPerfomance', function ($scope, $state, $stateParams, perfomanceQuery) {
    $scope.item = perfomanceQuery.get($stateParams.id);
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



