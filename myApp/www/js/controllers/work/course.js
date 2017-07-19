angular.module('workCourse.controller', [])

//fab列表
.controller('WorkCourseCtrl', function($scope, $timeout, common, workShareSele) {
	$scope.tabs = [];

	var dataList = {
        currentPage: 0,
        jewelry: []
    };
    $scope.items = [];

    $scope.data = {};


	var handleAjax = function(type) {
        type = type || 'DAIBAN';
        COMMON.post({
            type: 'obtain_topic_course',
            data: {
                "courseCategoryId": $scope.data.courseCategoryId,
                "currentPage": dataList.currentPage + 1
            },
            success: function(data) {
            	console.log(data);

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
    }, initAjax = function() {
        $scope.items = [];
        dataList.currentPage = 0;

        handleAjax();
    }

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

    workShareSele.course_category(function(data){
    	var _tabs = [];

    	if (data.body && data.body.topicCourseCategory) {
    		_tabs = data.body.topicCourseCategory;

    		$scope.tabs = _tabs;
    		$scope.data.courseCategoryId = _tabs[0].id;

    		$scope.tabs[0].isShowTab = true;

			initAjax();
    	}
		
	});
    

    $scope.checkTab = function(item) {
        var _tab = $scope.tabs;
        for (var i = 0, ii = _tab.length; i < ii; i++) {
            _tab[i].isShowTab = false;
        }

        item.isShowTab = true;
        $scope.data.courseCategoryId = item.id;

        initAjax();
    }
})

.controller('WorkCourseAddCtrl', function($scope, $ionicActionSheet, common, workShareSele) {
	$scope.data = {};

	$scope.seleCategoryId = function () {
		workShareSele.course_category(function(data) {
			$ionicActionSheet.show({
	            buttons: common.setSeleRepeat(data.body.topicCourseCategory),
	            cancelText: '取消',
	            buttonClicked: function (index, item) {
	                $scope.data.seleTypeName = item.name;
	                $scope.data.courseCategoryId = item.id;
	                
	                return true;
	            }
	        });
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
            type: 'create_topic_course',
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

.controller('WorkCourseDetailsCtrl', function($scope, $stateParams, common) {
	$scope.item = {};

	COMMON.post({
        type: 'topic_course_details',
        data: {
        	topicCourseId: $stateParams.id
        },
        success: function(data) {
        	$scope.item = data.body;
        	console.log(data.body)
        }
    });
})

