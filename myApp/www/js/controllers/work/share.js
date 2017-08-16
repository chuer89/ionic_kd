angular.module('workShare.controller', [])

.controller('WorkShareCtrl', function ($scope, $state, $timeout, common, workShareSele) {
	var dataList = {};
    common.clearSetData();
    $scope.data = {
        departmentId: 1,
        sharingName: '-1',//案例名称
        customerCategoryId: '-1',//顾客类型
        goodsCategoryId: '-1',//货品类型
        peopleNumberId: '-1',//人数
        peopleRelationshipId: '-1',//人物关系
        purchasePurposeId: '-1',//购买用途
        customerAgeId: '-1',//购买年龄
        transactionAmountId: '-1'//成交金额
    };
    $scope.items = [];

    var initData = function() {
        dataList = {
            currentPage: 0,
            caseSharing: []
        };

        $scope.items = [];
    }
    initData();

    var ajaxhandle = function(isNotLoading) {
        common.loadingShow();

        var _param = angular.extend({}, $scope.data, {
            currentPage: dataList.currentPage + 1,
            sharingName: '-1'
        })

        COMMON.post({
            type: 'obtain_case_sharing',
            data: _param,
            notPretreatment: true,
            success: function(data) {
                common.loadingHide();
                var _body = data.body;

                if (!_body || (_body && _body.caseSharing && !_body.caseSharing.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                var list = _body.caseSharing;
                
                for (var i = 0, ii = list.length; i < ii; i++) {
                    list[i].nickname = common.nickname(list[i].userName);
                    $scope.items.push(list[i]);
                }

                $timeout(function() {
                    $scope.vm.moredata = true;
                }, 1000);
            }
        });
    };
    ajaxhandle();

    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.caseSharing.length < common._pageSize || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
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


	$scope.seleCustomer = [];//客服类型
	$scope.seleGoods = [];//货品品类
	$scope.seleNumber = [];//人数
	$scope.seleRelationship = [];//人物关系
	$scope.selePurpose = [];//购买用途
	$scope.seleAge = [];//顾客年龄
	$scope.seleAmount = [];//成交金额


	workShareSele.customer(function(data){
		$scope.seleCustomer = data.body.customerCategory;
	});
	workShareSele.goods(function(data){
		$scope.seleGoods = data.body.goodsCategory;
	});
	workShareSele.number(function(data){
		$scope.seleNumber = data.body.peopleNumber;
	});
	workShareSele.relationship(function(data){
		$scope.seleRelationship = data.body.peopleRelationship;
	});
	workShareSele.purpose(function(data){
		$scope.selePurpose = data.body.purchasePurpose;
	});
	workShareSele.age(function(data){
		$scope.seleAge = data.body.customerAge;
	});
	workShareSele.amount(function(data) {
		$scope.seleAmount = data.body.transactionAmount;
	})


	$scope.isShowCustomerSele = false;
	$scope.isShowGoodsSele = false;
	$scope.isShowNumberSele = false;
	$scope.isShowRelationshipSele = false;
	$scope.isShowPurposeSele = false;
	$scope.isShowAgeSele = false;
	$scope.isShowAmountSele = false;


	$scope.seleCustomerInfo = '顾客类型';
	$scope.seleGoodsInfo = '货品品类';
	$scope.seleNumberInfo = '人数';
	$scope.seleRelationshipInfo = '人物关系';
	$scope.selePurposeInfo = '购买用途';
	$scope.seleAgeInfo = '顾客年龄';
	$scope.seleAmountInfo = '成绩金额';


	//选择菜单处理
    var toggleSeleHandle = function(type, isToggle) {
        if (!isToggle) {
            initData();
            ajaxhandle();
        }

        if (type == 'customer') {
            $scope.isShowGoodsSele = false;
            $scope.isShowNumberSele = false;
            $scope.isShowRelationshipSele = false;
            $scope.isShowPurposeSele = false;
            $scope.isShowAgeSele = false;
            $scope.isShowAmountSele = false;

            $scope.isShowCustomerSele = !$scope.isShowCustomerSele;
        } else if(type == 'goods') {
        	$scope.isShowCustomerSele = false;
        	$scope.isShowNumberSele = false;
        	$scope.isShowRelationshipSele = false;
        	$scope.isShowPurposeSele = false;
        	$scope.isShowAgeSele = false;
        	$scope.isShowAmountSele = false;

            $scope.isShowGoodsSele = !$scope.isShowGoodsSele;
        } else if (type == 'number') {
        	$scope.isShowCustomerSele = false;
        	$scope.isShowGoodsSele = false;
        	$scope.isShowRelationshipSele = false;
        	$scope.isShowPurposeSele = false;
        	$scope.isShowAgeSele = false;
        	$scope.isShowAmountSele = false;

        	$scope.isShowNumberSele = !$scope.isShowNumberSele;
        } else if (type == 'relationship') {
        	$scope.isShowCustomerSele = false;
        	$scope.isShowGoodsSele = false;
        	$scope.isShowNumberSele = false;
        	$scope.isShowPurposeSele = false;
        	$scope.isShowAgeSele = false;
        	$scope.isShowAmountSele = false;

        	$scope.isShowRelationshipSele = !$scope.isShowRelationshipSele;
        } else if (type == 'purpose') {
        	$scope.isShowCustomerSele = false;
        	$scope.isShowGoodsSele = false;
        	$scope.isShowNumberSele = false;
        	$scope.isShowRelationshipSele = false;
        	$scope.isShowAgeSele = false;
        	$scope.isShowAmountSele = false;

        	$scope.isShowPurposeSele = !$scope.isShowPurposeSele;
        } else if (type == 'age') {
        	$scope.isShowCustomerSele = false;
        	$scope.isShowGoodsSele = false;
        	$scope.isShowNumberSele = false;
        	$scope.isShowRelationshipSele = false;
        	$scope.isShowPurposeSele = false;
        	$scope.isShowAmountSele = false;

        	$scope.isShowAgeSele = !$scope.isShowAgeSele;
        } else if (type == 'amount') {
        	$scope.isShowCustomerSele = false;
        	$scope.isShowGoodsSele = false;
        	$scope.isShowNumberSele = false;
        	$scope.isShowRelationshipSele = false;
        	$scope.isShowPurposeSele = false;
        	$scope.isShowAgeSele = false;

        	$scope.isShowAmountSele = !$scope.isShowAmountSele;
        }
    }


    $scope.seleCustomerHandle = function(item) {
        $scope.data.customerCategoryId = item.id;
        $scope.seleCustomerInfo = item.name;

        toggleSeleHandle('customer');
    }
    $scope.seleGoodsHandle = function(item) {
        $scope.data.goodsCategoryId = item.id;
        $scope.seleGoodsInfo = item.name;

        toggleSeleHandle('goods');
    }
    $scope.seleNumberHandle = function(item) {
        $scope.data.peopleNumberId = item.id;
        $scope.seleNumberInfo = item.name;

        toggleSeleHandle('number');
    }
    $scope.seleRelationshipHandle = function(item) {
        $scope.data.peopleRelationshipId = item.id;
        $scope.seleRelationshipInfo = item.name;

        toggleSeleHandle('relationship');
    }
    $scope.selePurposeHandle = function(item) {
        $scope.data.purchasePurposeId = item.id;
        $scope.selePurposeInfo = item.name;

        toggleSeleHandle('purpose');
    }
    $scope.seleAgeHandle = function(item) {
        $scope.data.customerAgeId = item.id;
        $scope.seleAgeInfo = item.name;

        toggleSeleHandle('age');
    }
    $scope.seleAmountHandle = function(item) {
        $scope.data.transactionAmountId = item.id;
        $scope.seleAmountInfo = item.name;

        toggleSeleHandle('amount');
    }

    //筛选切换
    $scope.toggleSele = function(type) {
        toggleSeleHandle(type, true);
    }
})

.controller('WorkShareAddCtrl', function($scope, $ionicActionSheet, common, workShareSele) {
	$scope.data = {
		customerCategoryId: '',//顾客类型
        goodsCategoryId: '',//货品类型
        peopleNumberId: '',//人数
        peopleRelationshipId: '',//人物关系
        purchasePurposeId: '',//购买用途
        customerAgeId: '',//购买年龄
        transactionAmountId: '',//成交金额
        procedureDescription: '',//过程描述
        sharingName: '',//案例名称
        sharingPoint: '',//分享点
        sharingUserId: common.userInfo.clientId
	};

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
		workShareSele.customer(function(data){
			menusHandle(data,'customerCategory', 'customerCategoryIdText', 'customerCategoryId');
		});
    }

    $scope.showNavGoods = function () {
		workShareSele.goods(function(data){
			menusHandle(data,'goodsCategory', 'goodsCategoryIdText', 'goodsCategoryId');
		});
    }

    $scope.showNavNumber = function () {
		workShareSele.number(function(data){
			menusHandle(data,'peopleNumber', 'peopleNumberIdText', 'peopleNumberId');
		});
    }

    $scope.showNavRelationship = function () {
		workShareSele.relationship(function(data){
			menusHandle(data,'peopleRelationship', 'peopleRelationshipIdText', 'peopleRelationshipId');
		});
    }

    $scope.showNavPurpose = function () {
		workShareSele.purpose(function(data){
			menusHandle(data, 'purchasePurpose', 'purchasePurposeIdText', 'purchasePurposeId');
		});
    }

    $scope.showNavAge = function () {
		workShareSele.age(function(data){
			menusHandle(data, 'customerAge', 'customerAgeIdText', 'customerAgeId');
		});
    }

    $scope.showNavAmount = function () {
		workShareSele.amount(function(data){
			menusHandle(data, 'transactionAmount', 'transactionAmountIdText', 'transactionAmountId');
		});
    }


    $scope.submit = function() {
        if (!$scope.data.sharingName) {
            common.toast('请输入必填信息');
            return;
        }
        
        common.loadingShow();
    	COMMON.post({
            type: 'create_case_haring',
            data: $scope.data,
            success: function(data) {
                common.loadingHide();
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }
})

.controller('WorkShareDetailsCtrl', function($scope, $timeout, $stateParams, common) {
	$scope.item = {};
    common.clearSetData();

	COMMON.post({
        type: 'case_sharing_details',
        data: {
        	caseSharingId: $stateParams.id
        },
        success: function(data) {
        	$scope.item = data.body;
        }
    });

    $scope.reportList = [];
    $scope.data = {};

    var dataList = {
        currentPage: 0,
        reportComment: []
    };

    //评论列表
    var handleAjax = function() {
        COMMON.post({
            type: 'obtain_case_sharing_comment',
            data: {
                caseSharingId: $stateParams.id,
                currentPage: dataList.currentPage + 1
            },
            notPretreatment: true,
            success: function(data) {
                var _body = data.body;

                if (!_body || (_body && _body.caseSharingCommit && !_body.caseSharingCommit.length)) {
                    $scope.notTaskListData = '暂无评论数据';
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                var reportComment = _body.caseSharingCommit;

                dataList = _body;

                for (var i = 0, ii = reportComment.length; i < ii; i++) {
                    reportComment[i].nickname = common.nickname(reportComment[i].commentUserName);
                    reportComment[i]._commentTime = common.format(reportComment[i].commentTime);

                    $scope.reportList.push(reportComment[i]);
                }

                $,(function() {
                    $scope.vm.moredata = true;
                }, 1000);
            }
        });
    }, initRepotList = function() {
        dataList = {
            currentPage: 0,
            reportComment: []
        };
         $scope.reportList = [];

        handleAjax();
    }

    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.reportComment.length < common._pageSize || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
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
    initRepotList();

    //添加评论
    $scope.sendReport = function() {
        COMMON.post({
            type: 'case_sharing_comment',
            data: {
                caseSharingId: $stateParams.id,
                userId: common.userInfo.clientId,
                comment: $scope.data.commentReport
            },
            success: function(data) {
                var _body = data.body;

                $scope.data.commentReport = '';
                
                common.toast(data.message, function() {
                    initRepotList();
                });
            }
        });
    }

    //点赞
    $scope.clickThumbUp = function() {
    	COMMON.post({
            type: 'case_sharing_thumb_up',
            data: {
                caseSharingId: $stateParams.id,
                userId: common.userInfo.clientId
            },
            success: function(data) {
            	common.toast(data.message);
            	$scope.item.thumbUpCount = data.body.thumbUpCount;
            }
        });
    }
})


