angular.module('workCyclopedia.controller', [])

.controller('WorkCyclopediaCtrl', function ($scope, $state, common) {
	COMMON.post({
        type: 'jewelry_category',
        data: {},
        success: function(data) {
            console.log(data)
        }
    });
})

//百科类别列表
.controller('WorkCyclopediaListCtrl', function($stateParams, $scope, $timeout, common) {
	var dataList = {
		currentPage: 0,
		phoneBook: []
	};

	$scope.items = [];

	var handleAjax = function() {
		COMMON.post({
	        type: 'obtain_jewelries',
	        data: {
	        	categoryId: $stateParams.id,
	        	currentPage: dataList.currentPage + 1
	        },
	        success: function(data) {

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
		var seleType = workCyclopediaType.all();
        $ionicActionSheet.show({
            buttons: seleType,
            cancelText: '取消',
            buttonClicked: function (index, item) {
                $scope.data.seleTypeName = item.name;
                $scope.data.categoryId = item.id;
                
                return true;
            }
        });
    }

    //表单数据
    var formElement = document.querySelector("form");
    var formData = new FormData(formElement);

    //封面上传
    $scope.showSelePhotoHome = function() {
        common.showSelePhoto({
            appendPhone: function(the_file) {
                formData.append("cover", the_file, "images.jpg");
            }
        });
    }
    //附件上传
    $scope.showSelePhotoHome = function() {
        common.showSelePhoto({
            appendPhone: function(the_file) {
                formData.append("fuJians", the_file, "images.jpg");
            }
        });
    }

	$scope.submit = function() {
		var _param = $scope.data;

		common.formData({
            type: 'create_jewelry',
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
	}
})

.controller('WorkCyclopediaDetailsCtrl', function($scope, $stateParams, common) {
	$scope.item = {};
	COMMON.post({
        type: 'jewelry_details',
        data: {
        	jewelryId: $stateParams.id
        },
        success: function(data) {
        	$scope.item = data.body;
        	console.log(data.body)
        }
    });
})