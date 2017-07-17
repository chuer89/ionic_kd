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

.controller('WorkCyclopediaListCtrl', function($stateParams, $scope, workCyclopediaType) {
	$scope.item = workCyclopediaType.get($stateParams.id);
})

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