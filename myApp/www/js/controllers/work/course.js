angular.module('workCourse.controller', [])

//课程列表
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
        common.loadingShow();
        COMMON.post({
            type: 'obtain_topic_course',
            data: {
                "courseCategoryId": $scope.data.courseCategoryId,
                "currentPage": dataList.currentPage + 1
            },
            notPretreatment: true,
            success: function(data) {
                var _body = data.body;
                common.loadingHide();
                    
                if (!_body || (_body && !_body.jewelry) || (_body && _body.jewelry && !_body.jewelry.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                dataList = _body;

                var list = _body.jewelry;

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

    $scope.doRefresh = function() {
        setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            initAjax();
        }, 1000)
        return true;
    }
})

//课程新增
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

        if (!_param.courseName) {
            common.toast('请输入必填信息');
            return;
        }

        common.loadingShow();
		common.formData({
            type: 'create_topic_course',
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

.controller('WorkCourseDetailsCtrl', function($scope, $stateParams, common) {
	$scope.item = {};

	COMMON.post({
        type: 'topic_course_details',
        data: {
        	topicCourseId: $stateParams.id
        },
        success: function(data) {
            console.log(data)

            var _item = data.body.fujian;
            for (var i = 0, ii = _item.length; i < ii; i++) {
                if (_item[i].fujianName.indexOf('.pdf') >= 0){
                    _item[i].isPdf = true;
                }
            }
            
        	$scope.item = data.body;
        }
    });

    $scope.showPdf = function(item) {
        common.pdf(item.fujianPath);
    }

    //图片预览
    $scope.previewImg = function($index) {
        common.previewImg({
            allimgs: $scope.item.fujian,
            $index: $index
        })
    }
})

