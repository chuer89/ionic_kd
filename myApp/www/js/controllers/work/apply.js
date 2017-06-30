angular.module('workApply.controller', [])

.controller('WorkApplyCtrl', function ($scope, $state, $ionicActionSheet, workApplyList, common, seleMenuList) {
    var menus = seleMenuList.menu();

    var applicationStatus = menus.applicationStatus,
        applicationType = menus.applicationType;

    $scope.items = [];

    var auditLink = {
        'LEAVE': '#/work/apply/auditLeave',
        'PURCHASE': '#/work/apply/auditPurchase',
        'OTHER': '#/work/apply/auditOther'
    }

    var ajaxApplications = function () {
        //我的申请
        COMMON.post({
            type: 'obtain_my_applications',
            data: {
                "applicant": common.userInfo.clientId,
                "currentPage":1,
                "keywords":""
            },
            success: function(data) {
                ajaxhandle(data.body.myApplications);
            }
        });    
    }, ajaxApprovals = function() {
        //我的审批
        COMMON.post({
            type: 'obtain_my_approvals',
            data: {
                "applicant": common.userInfo.clientId,
                "currentPage":1,
                "keywords":""
            },
            success: function(data) {
                ajaxhandle(data.body.myApprovalApplication);
            }
        });
    }, ajaxhandle = function(list) {
        var list = list || [],
            _obj = {};

        for (var i = 0, ii = list.length; i < ii; i++) {
            _obj = list[i];
            _obj._createTime = common.format(_obj.createTime);
            _obj._link = auditLink[_obj.applicationType];
            _obj._status = common.getId(applicationStatus, _obj.applicationStatus, 'key').name;
            _obj._applicationName = '['+common.getId(applicationType, _obj.applicationType, 'key').name+'] '+_obj.applicationName;

            $scope.items.push(_obj);
        }
    }

    $scope.seleBrank = menus.brank;
    $scope.seleDepartment = menus.department;

    $scope.isShowBrankSele = false;
    $scope.isShowDepartmentSele = false;

    $scope.toggleSele = function(type) {
        if (type == 'brank') {
            $scope.isShowDepartmentSele = false;

            $scope.isShowBrankSele = !$scope.isShowBrankSele;
        } else if (type == 'department') {
            $scope.isShowBrankSele = false;

            $scope.isShowDepartmentSele = !$scope.isShowDepartmentSele;
        }
    }
    
	// $scope.items = workApplyList.all();

	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000)
        return true;
	}

    $scope.clickTabState = function(state) {
        $scope.items = workApplyList.all(state);
    }

    $scope.activeTab = '0';
    ajaxApplications();

    $scope.isShowTab0 = true;
    $scope.isShowTab1 = false;

    $scope.checkTab = function(index) {
        $scope.activeTab = index;

        $scope.items = [];

        if (index == '0') {
            $scope.isShowTab1 = false;
            $scope.isShowTab0 = true;

            ajaxApplications();
        } else {
            $scope.isShowTab0 = false;
            $scope.isShowTab1 = true;

            ajaxApprovals();
        }
    }
})

.controller('WorkApplyAddListCtrl', function($scope, $state, workApplyAddList) {
	$scope.items = workApplyAddList.all();
})

//申请其他
.controller('WorkApplyAddOtherCtrl', function($scope, $state) {

})

//申请报残
.controller('WorkApplyAddDiscardCtrl', function($scope, $state) {

})

//申请优惠
.controller('WorkApplyAddPrivilegeCtrl', function($scope, $state) {

})

//申请请假
.controller('WorkApplyAddLeaveCtrl', function($scope, $state, $ionicActionSheet, common) {
    COMMON.post({
        type: 'auditor_user',
        data: {
            id: common.userInfo.clientId
        },
        success: function(data) {
            console.log(data.userArray)
        }
    });

    // COMMON.post({
    //     type: 'create_leave_application',
    //     data: {
    //         "applicant": common.userInfo.clientId,
    //         "applicationName":"4月12号休年假4天",
    //         "applicationStatus":"PENDING",
    //         "applicationType":"LEAVE",
    //         "approverList":[{"approverId":4},{"approverId":5}],
    //         "leaveApplication":{
    //             "leaveBegintime":"2016-04-12 00:00",
    //             "leaveEndtime":"2016-04-15 23:59",
    //             "leaveReason":"2016-04-15 23:59",
    //             "leaveType":"Annual_leave"
    //         }

    //     },
    //     success: function(data) {
    //         console.log(data)
    //     }
    // });

	$scope.seleType = '请选择';
	$scope.showSeleType = function () {
		$ionicActionSheet.show({
            buttons: [
            	{text: '年假'},
            	{text: '病假'},
                { text: '事假' },
                {text: '婚假'},
                {text: '丧假'},
                {text: '无薪假'}
            ],
            cancelText: '取消',
            buttonClicked: function(index, item) {
                $scope.seleType = item.text;
                return true;
            }
        })
	}
})

//工程维修申请
.controller('WorkApplyAddMaintainCtrl', function() {

})

//采购申请
.controller('WorkApplyAddPurchaseCtrl', function() {

})

//请假审批
.controller('WorkApplyAuditLeaveCtrl', function($scope, $ionicActionSheet) {
    $scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '同意'
            }, {
                text: '拒绝'
            }, {
                text: '转交'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                
                return true;
            }
        });
    }
})

//采购审批
.controller('WorkApplyAuditPurchaseCtrl', function($scope, $ionicActionSheet) {
    $scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '同意'
            }, {
                text: '拒绝'
            }, {
                text: '转交'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                
                return true;
            }
        });
    }
})

//其他审批
.controller('WorkApplyAuditOtherCtrl', function($scope, $ionicActionSheet) {
    $scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '同意'
            }, {
                text: '拒绝'
            }, {
                text: '转交'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                
                return true;
            }
        });
    }
})

