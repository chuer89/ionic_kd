angular.module('workApply.controller', [])

//applicationStatus：申请的状态，(等批准，批准，拒绝) 
//值为（PENDING, APPROVE, REJECT）创建申请时默认为PENDING

//applicationType：申请的类型 （请假，采购，其他，任务延迟,优惠，报残, 维修工程）
//值为（LEAVE，PURCHASE，OTHER，TASK_DELAY, DISCOUNT,DISABLED,MAINTAIN）


.controller('WorkApplyCtrl', function ($scope, $state, $timeout, $ionicActionSheet, workApplyList, common, seleMenuList) {
    var menus = seleMenuList.menu();

    var applicationStatus = menus.applicationStatus,
        applicationType = menus.applicationType;

    var month= common.format(false, 'MM'),
        year= common.format(false, 'yyyy');

    $scope.items = [];

    var dataList = {
        currentPage: 0,
        items: []
    };

    $scope.data = {
        endDate: common.format(false, 'yyyy-MM') + '-' + common.getLastDay(year, month),
        startDate: common.format(false, 'yyyy-MM')+'-01',
        applicant: common.userInfo.clientId,
        keywords: ''
    }

    var auditLink = {
        'LEAVE': '#/work/apply/auditLeave',
        'PURCHASE': '#/work/apply/auditPurchase',
        'OTHER': '#/work/apply/auditOther'
    }

    var ajaxApplications = function (isNotLoading) {
        common.loadingShow();

        angular.extend($scope.data, {
            currentPage: dataList.currentPage + 1,
            departmentId: seleDepartmentId
        });

        //我的申请
        COMMON.post({
            type: 'obtain_my_applications',
            data: $scope.data,
            success: function(data) {
                common.loadingHide();

                var _body = data.body;

                if (!_body || (_body && _body.myApplications && !_body.myApplications.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                dataList = {
                    items: _body.myApplications,
                    currentPage: _body.currentPage,
                    totalPage: _body.total
                }

                ajaxhandle(data.body.myApplications);
            }
        });    
    }, ajaxApprovals = function() {
        //我的审批
        common.loadingShow();

        angular.extend($scope.data, {
            currentPage: dataList.currentPage + 1,
            departmentId: seleDepartmentId
        });

        COMMON.post({
            type: 'obtain_my_approvals',
            data: $scope.data,
            success: function(data) {
                common.loadingHide();

                var _body = data.body;

                if (!_body || (_body && _body.myApprovalApplication && !_body.myApprovalApplication.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                dataList = {
                    items: _body.myApprovalApplication,
                    currentPage: _body.currentPage,
                    totalPage: _body.total
                }

                ajaxhandle(data.body.myApprovalApplication);
            }
        });
    }, ajaxhandle = function(list) {
        $timeout(function() {
            $scope.vm.moredata = true;
        }, 1000);

        var list = list || [],
            _obj = {};

        for (var i = 0, ii = list.length; i < ii; i++) {
            _obj = list[i];
            if (_obj.applicationStatus && _obj.applicationType) {
                _obj._createTime = common.format(_obj.createTime);
                _obj._link = auditLink[_obj.applicationType];
                _obj._status = common.getId(applicationStatus, _obj.applicationStatus, 'key').name;
                _obj._applicationName = '['+common.getId(applicationType, _obj.applicationType, 'key').name+'] '+_obj.applicationName;

                $scope.items.push(_obj);
            }
        }
    }, handleAjax = function() {
        if ($scope.isShowTab1) {
            ajaxApprovals();
        } else {
            ajaxApplications();
        }
    }, initData = function() {
        dataList = {
            currentPage: 0,
            items: []
        };

        $scope.items = [];

        handleAjax()
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
                handleAjax();
            }, 1500);
            return true;
        }
    }

    $scope.activeTab = '0';
    var seleDepartmentId = '';


    //选择部门-start
    $scope.seleBrank = [];
    $scope.seleDepartment = [];
    $scope.seleDate = menus.seleMonth;

    $scope.seleBrankInfo = '品牌';
    $scope.seleDepartmentInfo = '部门';
    $scope.seleDateInfo = common.format(false, 'yyyy-MM');

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
            $scope.isShowBrankSele = false;
            $scope.isShowDepartmentSele = false;

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
    
	$scope.doRefresh = function() {
		setTimeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            handleAjax();
        }, 1000)
        return true;
	}

    $scope.clickTabState = function(state) {
        $scope.items = workApplyList.all(state);
    }

    //切换按钮-start

    $scope.isShowTab0 = true;
    $scope.isShowTab1 = false;

    $scope.checkTab = function(index) {
        $scope.activeTab = index;

        $scope.items = [];

        if (index == '0') {
            $scope.isShowTab1 = false;
            $scope.isShowTab0 = true;
        } else {
            $scope.isShowTab0 = false;
            $scope.isShowTab1 = true;
        }

        initData();
    }
    //切换按钮-end
})

.controller('WorkApplyAddListCtrl', function($scope, $state, workApplyAddList) {
	$scope.items = workApplyAddList.all();
})

//申请其他
.controller('WorkApplyAddOtherCtrl', function($scope, common) {
    $scope.data = {
        typePageName: 'WorkApplyAddOtherCtrl',
        applicant: common.userInfo.clientId,
        applicationStatus: 'PENDING',
        applicationType: 'OTHER',
        approverList: [],
        clientIdSele: {name: '请选择'}
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

    $scope.submit = function() {
        $scope.data.approverList = [{
            approverId: $scope.data.clientIdSele.id
        }];

        common.loadingShow();
        common.formData({
            type: 'create_other_application',
            body: $scope.data,
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

    //审核人
    if (common.setAuditorUserList.id) {
        if (common.setAuditorUserList._targetName == 'work_apply_addother') {
            common._localstorage.clientIdSele = common.setAuditorUserList;
        }
    }

    //缓存数据
    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
    }
})

//申请报残
.controller('WorkApplyAddDiscardCtrl', function($scope, common) {
    $scope.data = {
        typePageName: 'WorkApplyAddDiscardCtrl',
        applicant: common.userInfo.clientId,
        applicationStatus: 'PENDING',
        applicationType: 'DISABLED',
        approverList: [],
        clientIdSele: {name: '请选择'}
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

    $scope.submit = function() {
        $scope.data.approverList = [{
            approverId: $scope.data.clientIdSele.id
        }];

        common.loadingShow();
        common.formData({
            type: 'create_other_application',
            body: $scope.data,
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

    //审核人
    if (common.setAuditorUserList.id) {
        if (common.setAuditorUserList._targetName == 'work_apply_adddiscard') {
            common._localstorage.clientIdSele = common.setAuditorUserList;
        }
    }

    //缓存数据
    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
    }
})

//申请优惠
.controller('WorkApplyAddPrivilegeCtrl', function($scope, common) {
    $scope.data = {
        typePageName: 'WorkApplyAddPrivilegeCtrl',
        applicant: common.userInfo.clientId,
        applicationStatus: 'PENDING',
        applicationType: 'DISCOUNT',
        approverList: [],
        clientIdSele: {name: '请选择'}
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

    $scope.submit = function() {
        $scope.data.approverList = [{
            approverId: $scope.data.clientIdSele.id
        }];

        common.loadingShow();
        common.formData({
            type: 'create_other_application',
            body: $scope.data,
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

    //审核人
    if (common.setAuditorUserList.id) {
        if (common.setAuditorUserList._targetName == 'work_apply_addprivilege') {
            common._localstorage.clientIdSele = common.setAuditorUserList;
        }
    }

    //缓存数据
    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
    }
})

//申请请假
.controller('WorkApplyAddLeaveCtrl', function($scope, $state, $ionicActionSheet, $stateParams, seleMenuList, common) {
    var menus = seleMenuList.menu();

    $scope.data = {
        typePageName: 'WorkApplyAddLeaveCtrl',
        applicant: common.userInfo.clientId,
        applicationStatus: 'PENDING',
        applicationType: 'LEAVE',
        approverList: [],
        leaveApplication: {
            leaveBegintime: '2017-07-26 13:40',
            leaveEndtime: '2017-08-20 18:00'
        },
        clientIdSele: {name: '请选择'},

        leaveTypeInfo : '请选择'
    }

	$scope.showSeleType = function () {
		$ionicActionSheet.show({
            buttons: menus.leaveType,
            cancelText: '取消',
            buttonClicked: function(index, item) {
                $scope.data.leaveTypeInfo = item.text;
                $scope.data.leaveApplication.leaveType = item.key;
                return true;
            }
        })
	}

    //时间
    $scope.setBegintime = '';
    $scope.clickBegintime = function() {
        common.datePicker(function(date) {
            $scope.setBegintime = date;
            $scope.data.leaveApplication.leaveBegintime = date;
        }, true)
    }
    $scope.setEndtime = '';
    $scope.clickEndtime = function() {
        common.datePicker(function(date) {
            $scope.setEndtime = date;
            $scope.data.leaveApplication.leaveEndtime = date;
        }, true)
    }

    $scope.submit = function() {
        $scope.data.approverList = [{
            approverId: $scope.data.clientIdSele.id
        }];

        common.loadingShow();
        common.post({
            type: 'create_leave_application',
            data: $scope.data,
            success: function(data) {
                common.loadingHide();
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }

    //审核人
    if (common.setAuditorUserList.id) {
        if (common.setAuditorUserList._targetName == 'work_apply_addleave') {
            common._localstorage.clientIdSele = common.setAuditorUserList;
        }
    }

    //缓存数据
    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
    }
})

//工程维修申请
.controller('WorkApplyAddMaintainCtrl', function($scope, common) {
    $scope.data = {
        typePageName: 'WorkApplyAddPrivilegeCtrl',
        applicant: common.userInfo.clientId,
        applicationStatus: 'PENDING',
        applicationType: 'MAINTAIN',
        approverList: [],
        clientIdSele: {name: '请选择'},
        servicemanIdSele: {name:'请选择'},
        maintainApplication: {}
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

    $scope.submit = function() {
        $scope.data.approverList = [{
            approverId: $scope.data.clientIdSele.id
        }];

        $scope.data.maintainApplication.servicemanId = $scope.data.servicemanIdSele.id;
        $scope.data.maintainApplication.maintainTitle = $scope.data.applicationName;

        common.loadingShow();
        common.formData({
            type: 'create_maintain_application',
            body: $scope.data,
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

    //审核人
    if (common.setAuditorUserList.id) {
        if (common.setAuditorUserList._targetName == 'work_apply_addmaintain') {
            common._localstorage.clientIdSele = common.setAuditorUserList;
        } else if (common.setAuditorUserList._targetName == 'work_apply_addmaintain_1') {
            common._localstorage.servicemanIdSele = common.setQueryUserList;
        }
    }

    //缓存数据
    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
    }
})

//采购申请
.controller('WorkApplyAddPurchaseCtrl', function($scope, $state, $ionicActionSheet, $stateParams, seleMenuList, common) {
    var menus = seleMenuList.menu();

    $scope.data = {
        typePageName: 'WorkApplyAddPurchaseCtrl',
        applicant: common.userInfo.clientId,
        applicationStatus: 'PENDING',
        applicationType: 'PURCHASE',
        purchaseApplication: [{}],
        approverList: [],
        clientIdSele: {name: '请选择'},

        allPurchaseBudget: 0
    };

    var changePrice = function() {
        var allNum = 0;
        var _list = $scope.data.purchaseApplication;
        for (var i = 0, ii = _list.length; i < ii; i++) {
            allNum += (_list[i].purchaseBudget - 0)
        }
        $scope.data.allPurchaseBudget = allNum;
    }
    $scope.changeInput = function() {
        changePrice();
    }
    $scope.add = function() {
        $scope.data.purchaseApplication.push({indexId: (new Date).getTime()})
    }
    $scope.rm = function(item) {
        var _id = item.indexId;
        var _list = $scope.data.purchaseApplication;

        for (var i = 0, ii = _list.length; i < ii; i++) {
            if (_id == _list[i].indexId && _list[i].indexId) {
                _list.splice(i, 1);
                changePrice();
                return;
            }
        }
    }

    $scope.submit = function() {
        $scope.data.approverList = [{
            approverId: $scope.data.clientIdSele.id
        }];

        common.loadingShow();
        common.post({
            type: 'create_purchase_application',
            data: $scope.data,
            success: function(data) {
                common.loadingHide();
                common.toast(data.message, function() {
                    common.back();
                });
            }
        });
    }

    //审核人
    if (common.setAuditorUserList.id) {
        if (common.setAuditorUserList._targetName == 'work_apply_addPurchase') {
            common._localstorage.clientIdSele = common.setAuditorUserList;
        }
    }

    //缓存数据
    if (common._localstorage.typePageName == $scope.data.typePageName) {
        $scope.data = common._localstorage;
    } else {
        common._localstorage = $scope.data;
    }
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

