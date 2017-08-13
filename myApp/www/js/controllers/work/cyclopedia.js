angular.module('workCyclopedia.controller', [])

.controller('WorkCyclopediaCtrl', function ($scope, $state, common, workCyclopediaType) {
    workCyclopediaType.all(function(list) {
        common.setLocalStorage('baike', JSON.stringify(list));
    });
})

//百科类别列表
.controller('WorkCyclopediaListCtrl', function($stateParams, $scope, $timeout, common) {
	var dataList = {
		currentPage: 0,
		phoneBook: []
	};

    var _baike = common.getLocalStorage('baike') && JSON.parse(common.getLocalStorage('baike'));
    if (_baike) {
        $scope.pageName = common.getId(_baike, $stateParams.id).name;
    }

	$scope.items = [];

	var handleAjax = function(isNotLoading) {
        common.loadingShow();

		COMMON.post({
	        type: 'obtain_jewelries',
	        data: {
	        	categoryId: $stateParams.id,
	        	currentPage: dataList.currentPage + 1
	        },
            notPretreatment: true,
	        success: function(data) {
                common.loadingHide();

                if (!data.body || (data.body && data.body.jewelry && !data.body.jewelry.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

	            var _body = data.body,
	        		list = _body.jewelry;

	        	dataList = _body;

	        	for (var i = 0, ii = list.length; i < ii; i++) {
	        		$scope.items.push(list[i]);
	        	}

	        	$timeout(function() {
	        		$scope.vm.moredata = true;
	        	}, 1000);
	        }
	    });
	}

	handleAjax();

    $scope.vm = {
    	moredata: false,
    	loadMore: function() {
    		if (dataList.jewelry.length < common._pageSize || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
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
})

//百科新建
.controller('WorkCyclopediaAddCtrl', function($scope, $ionicActionSheet, common, workCyclopediaType) {
	$scope.data = {};

	$scope.seleCategoryId = function () {
		workCyclopediaType.all(function(seleType) {
            $ionicActionSheet.show({
                buttons: seleType,
                cancelText: '取消',
                buttonClicked: function (index, item) {
                    $scope.data.seleTypeName = item.name;
                    $scope.data.categoryId = item.id;
                    
                    return true;
                }
            });
        });
    }

    //表单数据
    var formElement = document.querySelector("form");
    var formData = new FormData(formElement);
    $scope.imgListC = [];
    $scope.imgListF = [];

    //封面上传
    $scope.showSelePhotoHome = function() {
        common.showSelePhoto({
            appendPhone: function(the_file) {
                formData.append("cover", the_file, "images.jpg");
            },
            showImg: function(results) {
                for (var i = 0, ii = results.length; i < ii; i++) {
                    $scope.imgListF.push(results[i]);
                }
            },
            cameraImg: function(imgData) {
                $scope.imgListF.push(imgData);
            }
        });
    }
    //附件上传
    $scope.showSelePhoto = function() {
        common.showSelePhoto({
            appendPhone: function(the_file) {
                formData.append("fuJians", the_file, "images.jpg");
            },
            showImg: function(results) {
                for (var i = 0, ii = results.length; i < ii; i++) {
                    $scope.imgListC.push(results[i]);
                }
            },
            cameraImg: function(imgData) {
                $scope.imgListC.push(imgData);
            }
        });
    }

	$scope.submit = function() {
		var _param = $scope.data;
        common.loadingShow();
		common.formData({
            type: 'create_jewelry',
            body: _param,
            setData: function(json) {
                formData.append("json", json);
            },
            data: formData,
            success: function(data) {
                common.loadingHide();
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
	}
})

.controller('WorkCyclopediaDetailsCtrl', function($scope, $stateParams, common) {
	$scope.item = {};

    common.loadingShow();
	COMMON.post({
        type: 'jewelry_details',
        data: {
        	jewelryId: $stateParams.id
        },
        success: function(data) {
            common.loadingHide();
        	$scope.item = data.body;
        }
    });

    //图片预览
    $scope.previewImg = function($index) {
        common.previewImg({
            allimgs: $scope.item.fujian,
            $index: $index
        })
    }
})