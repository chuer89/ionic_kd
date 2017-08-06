angular.module('workFab.controller', [])

//fab列表
.controller('WorkFabCtrl', function($scope, $timeout, common, workShareSele) {
	var dataList = {};
    $scope.items = [];

    var initData = function() {
        dataList = {
            currentPage: 0,
            fab: []
        };

        $scope.items = [];

        ajaxhandle();
    }

    var ajaxhandle = function() {
        common.loadingShow();
        COMMON.post({
            type: 'obtain_fab_case',
            data: {
                currentPage: dataList.currentPage + 1,
                goodsCategoryId: '-1',
                goodsNameId: '-1'
            },
            success: function(data) {
                var _body = data.body;
                common.loadingHide();

                if (!_body || (_body && !_body.fabCase) || (_body && _body.fabCase && !_body.fabCase.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                dataList = _body;

                var list = _body.fabCase;

                for (var i = 0, ii = list.length; i < ii; i++) {
                    list[i].nickname = common.nickname(list[i].userName);
                    if (list[i].fujian && list[i].fujian.length) {
                    	list[i].homeImg = list[i].fujian[0].fujianPath;
                    }
                    $scope.items.push(list[i]);
                }

                $timeout(function() {
                    $scope.vm.moredata = true;
                }, 1000);
            }
        });
    };

    initData();
    
    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.fab.length < common._pageSize || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
                $scope.vm.moredata = false;
                return;
            }

            $timeout(function () {
                $scope.vm.moredata = false;
                handleAjax();
            }, 1500);
            return true;
        }
    }

    $scope.seleCategory = [];//品类信息
    $scope.seleName = [];//品名信息

    workShareSele.fab_category(function(data){
		$scope.seleCategory = data.body.fabGoodsCategory;
	});
	workShareSele.fab_name(function(data){
		$scope.seleName = data.body.fabGoodsName;
	});

    $scope.isShowCategorySele = false;
    $scope.isShowNameSele = false;

    $scope.seleCategoryInfo = '品类';
    $scope.seleNameInfo = '品名';

    //选择菜单处理
    var toggleSeleHandle = function(type, isToggle) {
        if (!isToggle) {
            initData();
        }

        if (type == 'category') {
            $scope.isShowNameSele = false;

            $scope.isShowCategorySele = !$scope.isShowCategorySele;
        } else if (type == 'name') {
            $scope.isShowCategorySele = false;

            $scope.isShowNameSele = !$scope.isShowNameSele;
        }
    }

    $scope.seleCategoryHandle = function(item) {
        $scope.seleCategoryInfo = item.name;

        toggleSeleHandle('category', true);
    }
    $scope.seleNameHandle = function(item) {
        $scope.seleNameInfo = item.name;

        toggleSeleHandle('name');
    }

    //筛选切换
    $scope.toggleSele = function(type) {
        toggleSeleHandle(type, true);
    }
})

//fab新增
.controller('WorkFabAddCtrl', function($scope, $ionicActionSheet, common, workShareSele) {
	$scope.data = {
		sharingUserId: common.userInfo.clientId,
		goodsCategoryId: '',//品类
		goodsNameId: '',//品名
		sharingName: '',
		content: ''
	}

	var menusHandle = function (data,k1, k2, k3) {
		$ionicActionSheet.show({
            buttons: common.setSeleRepeat(data.body[k1]),
            cancelText: '取消',
            buttonClicked: function (index, item) {
            	$scope.data[k2] = item.text;
            	$scope.data[k3] = item.id;

                return true;
            }
        });
	}

	$scope.showNavCustomer = function () {
		workShareSele.fab_category(function(data){
			menusHandle(data,'fabGoodsCategory', 'goodsCategoryIdText', 'goodsCategoryId');
		});
    }

    $scope.showNavGoods = function () {
		workShareSele.fab_name(function(data){
			menusHandle(data,'fabGoodsName', 'goodsNameIdText', 'goodsNameId');
		});
    }

    //表单数据
    var formElement = document.querySelector("form");
    var formData = new FormData(formElement);
    $scope.imgList = [];

    $scope.showSelePhoto = function() {
        common.showSelePhoto({
            appendPhone: function(the_file) {
                formData.append("fuJians", the_file, "images.jpg");
            },
            showImg: function(results) {
                for (var i = 0, ii = results.length; i < ii; i++) {
                    $scope.imgList.push(results[i]);
                }
            },
            cameraImg: function(imgData) {
                $scope.imgList.push(imgData);
            }
        });
    }

    var ajaxhandle = function() {
        common.formData({
            type: 'create_fab_case',
            body: $scope.data,
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
    }

    $scope.submit = function() {
    	ajaxhandle();
    }
})

.controller('WorkFabDetailsCtrl', function($scope, $stateParams, common) {
	$scope.item = {};
	
    common.loadingShow();
	COMMON.post({
        type: 'fab_case_details',
        data: {
        	fabCaseId: $stateParams.id
        },
        success: function(data) {
        	$scope.item = data.body;
            common.loadingHide();
        }
    });
})



