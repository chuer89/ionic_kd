angular.module('workApply.controller', [])

//applicationStatus：申请的状态，(等批准，批准，拒绝) 
//值为（PENDING, APPROVE, REJECT）创建申请时默认为PENDING

//applicationType：申请的类型 （请假，采购，其他，任务延迟,优惠，报残, 维修工程）
//值为（LEAVE，PURCHASE，OTHER，TASK_DELAY, DISCOUNT,DISABLED,MAINTAIN）

//approvalStatus：审批状态 （批准/拒绝）值为 （APPROVE / REJECT）

//任务状态
// var taskStatus = [{name:'工作中',key:'WORKING'},{name:'未确认',key:'UNCONFIRMED'},
//{name:'申报',key:'DECLARATION'},
//     {name:'合格',key:'QUALIFIED'},{name:'不合格',key:'UNQUALIFIED'}];

// 申请维修（PENDING）—（同意申请维修（'APPROVE' or 'REJECT'）
//-新建维修任务（PENDING））-完成维修任务（UNCONFIRMED）
//-确认维修任务（QUALIFIED 或者UNQUALIFIED）

// 工程维修时这样的，
// 1，工程维修申请
// 2，同意工程维修申请   PENDING
// 3，维修人开始维修     PENDING
// 4，维修人提交维修结果   WORKING
// 5，检查人确认维修     UNCONFIRMED


.controller('WorkApplyCtrl', function ($scope, $state, $timeout, $ionicActionSheet, workApplyList, common, seleMenuList) {
    var menus = seleMenuList.menu();

    common.clearSetData();

    //搜索--start
    $scope.isSearchVal = false;
    $scope.isSearchTxt = true;
    var showSearch = function() {
        $scope.isSearchVal = true;
        $scope.isSearchTxt = false;

        $timeout(function() {
            $('#js_search').focus().on('keypress', function(e) {
                var _keyCode = e.keyCode;
                if (_keyCode == 13) {
                    //搜索
                    handleSearch();
                    return false;
                }
            })
        }, 200)
    }, cancelSearch = function() {
        clearSearchData();
    }, handleSearch = function() {
        $scope.isSearchVal = false;
        $scope.isSearchTxt = true;

        initData();
    }, clearSearchData = function() {
        $scope.data.keywords = '';
        handleSearch();
    }
    
    $scope.showSearch = showSearch;
    $scope.cancelSearch = cancelSearch;
    $scope.handleSearch = handleSearch;
    //搜索--end

    $scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '新增申请'
            }, {
                text: '我的维修任务'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                
                if (index == 0) {
                    $state.go('work_apply_addlist');
                } else {
                    $state.go('work_apply_my_task');
                }
                return true;
            }
        });
    }

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
        keywords: ''
    }

    var auditLink = {
        'LEAVE': '#/work/apply/auditLeave',//请假
        'PURCHASE': '#/work/apply/auditPurchase',//采购
        'OTHER': '#/work/apply/auditOther',//其他
        'DISCOUNT': '#/work/apply/auditprivilege',
        'DISABLED': '#/work/apply/auditDiscount',//报残
        'MAINTAIN': '#/work/apply/auditMaintain'//维修
    }

    var ajaxApplications = function (isNotLoading) {
        common.loadingShow();

        angular.extend($scope.data, {
            currentPage: dataList.currentPage + 1,
            departmentId: seleDepartmentId,
            applicant: common.userInfo.clientId
        });

        //我的申请
        COMMON.post({
            type: 'obtain_my_applications',
            data: $scope.data,
            notPretreatment: true,
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
            departmentId: seleDepartmentId,
            approverId: common.userInfo.clientId
        });

        COMMON.post({
            type: 'obtain_my_approvals',
            data: $scope.data,
            notPretreatment: true,
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
                _obj._applicationId = $scope.isShowTab1 ? _obj.applicationId : _obj.applicationId + '_0';
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
            initData();
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

.controller('WorkApplyAddListCtrl', function($scope, $state, workApplyAddList, common) {
	$scope.items = workApplyAddList.all();
    common.clearSetData();
})

//申请其他
.controller('WorkApplyAddOtherCtrl', function($scope, common) {
    $scope.data = {
        typePageName: 'WorkApplyAddOtherCtrl',
        applicant: common.userInfo.clientId,
        applicationStatus: 'PENDING',
        applicationType: 'OTHER',
        approverList: [],
        clientIdSele: {name: '请选择'},
        otherApplication: {}
    }

    //表单数据
    var formElement = document.querySelector("form");
    var formData = new FormData(formElement);
    $scope.imgList = [];

    //调起相机空间-并照片数据注入formdata
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

    //提交
    $scope.submit = function() {
        $scope.data.clientIdSele.id += '';
        $scope.data.approverList = [{
            approverId: $scope.data.clientIdSele.id
        }];
        $scope.data.otherApplication.otherTitle = $scope.data.applicationName;

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

//其他审批
.controller('WorkApplyAuditOtherCtrl', function($scope, $state, $ionicActionSheet, $stateParams, common, applyCommon) {
    $scope.data = {};
    $scope.item = {};

    var _applicationId = $stateParams.id;

    $scope.isApply = '';//是否申请
    $scope.pageName = '审核';

    if (_applicationId.indexOf('_') > 0) {
        _applicationId = _applicationId.slice(0, -2);
        $scope.isApply = true;
        $scope.pageName = '申请详情';
    }

    var getData = function(cb) {
        if (!cb) {
            common.loadingShow();
        }

        COMMON.post({
            type: 'obtain_application_info',
            data: {
                applicationId: _applicationId
            },
            success: function(data) {
                common.loadingHide();

                $scope.item = data.body;

                if (typeof cb == 'function') {
                    cb();
                }

                console.log(data.body)
            }
        });
    }

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
                if (index == 0) {
                    applyCommon.updateStatus(_applicationId, $scope.data.approvalReason, false);
                } else if (index == 1) {
                    applyCommon.updateStatus(_applicationId, $scope.data.approvalReason, true);
                } else if (index == 2) {
                    $state.go('common_seleGuys', {
                        id: '09'
                    });
                }
                return true;
            }
        });
    }

    //审核人
    if (common.setAuditorUserList.id && common.setAuditorUserList._targetName == 'work_apply_auditOther') {
        if (common.setAuditorUserList.name) {
            getData(function() {
                applyCommon.forwardApproval({
                    to: common.setAuditorUserList,
                    applicationId: _applicationId,
                    oldApproverId: $scope.item.approvalInfoArray[0].approverId
                })
            })
        }
    } else {
        getData();
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
        clientIdSele: {name: '请选择'},
        otherApplication: {}
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

    $scope.submit = function() {
        $scope.data.approverList = [{
            approverId: $scope.data.clientIdSele.id
        }];
        $scope.data.otherApplication.otherTitle = $scope.data.applicationName;

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
//申请报残-审核
.controller('WorkApplyAuditDiscardCtrl', function($scope, $state, $ionicActionSheet, $stateParams, common, applyCommon) {
    $scope.data = {};
    $scope.item = {};

    var _applicationId = $stateParams.id;

    $scope.isApply = '';//是否申请
    $scope.pageName = '审核';

    if (_applicationId.indexOf('_') > 0) {
        _applicationId = _applicationId.slice(0, -2);
        $scope.isApply = true;
        $scope.pageName = '申请详情';
    }

    var getData = function(cb) {
        if (!cb) {
            common.loadingShow();
        }

        COMMON.post({
            type: 'obtain_application_info',
            data: {
                applicationId: _applicationId
            },
            success: function(data) {
                common.loadingHide();

                $scope.item = data.body;

                if (typeof cb == 'function') {
                    cb();
                }

                console.log(data.body)
            }
        });
    }

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
                if (index == 0) {
                    applyCommon.updateStatus(_applicationId, $scope.data.approvalReason, false);
                } else if (index == 1) {
                    applyCommon.updateStatus(_applicationId, $scope.data.approvalReason, true);
                } else if (index == 2) {
                    $state.go('common_seleGuys', {
                        id: '07'
                    });
                }
                return true;
            }
        });
    }

    //审核人
    if (common.setAuditorUserList.id && common.setAuditorUserList._targetName == 'work_apply_auditDiscount') {
        if (common.setAuditorUserList.name) {
            getData(function() {
                applyCommon.forwardApproval({
                    to: common.setAuditorUserList,
                    applicationId: _applicationId,
                    oldApproverId: $scope.item.approvalInfoArray[0].approverId
                })
            })
        }
    } else {
        getData();
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
        clientIdSele: {name: '请选择'},
        otherApplication: {}
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

    $scope.submit = function() {
        $scope.data.approverList = [{
            approverId: $scope.data.clientIdSele.id
        }];
        $scope.data.otherApplication.otherTitle = $scope.data.applicationName;

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
//申请优惠-审核
.controller('WorkApplyAuditPrivilegeCtrl', function($scope, $state, $ionicActionSheet, $stateParams, common, applyCommon) {
    $scope.data = {};
    $scope.item = {};

    var _applicationId = $stateParams.id;

    $scope.isApply = '';//是否申请
    $scope.pageName = '审核';

    if (_applicationId.indexOf('_') > 0) {
        _applicationId = _applicationId.slice(0, -2);
        $scope.isApply = true;
        $scope.pageName = '申请详情';
    }

    var getData = function(cb) {
        if (!cb) {
            common.loadingShow();
        }

        COMMON.post({
            type: 'obtain_application_info',
            data: {
                applicationId: _applicationId
            },
            success: function(data) {
                common.loadingHide();

                $scope.item = data.body;

                if (typeof cb == 'function') {
                    cb();
                }

                console.log(data.body)
            }
        });
    }

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
                if (index == 0) {
                    applyCommon.updateStatus(_applicationId, $scope.data.approvalReason, false);
                } else if (index == 1) {
                    applyCommon.updateStatus(_applicationId, $scope.data.approvalReason, true);
                } else if (index == 2) {
                    $state.go('common_seleGuys', {
                        id: '06'
                    });
                }
                return true;
            }
        });
    }

    //审核人
    if (common.setAuditorUserList.id && common.setAuditorUserList._targetName == 'work_apply_auditprivilege') {
        if (common.setAuditorUserList.name) {
            getData(function() {
                applyCommon.forwardApproval({
                    to: common.setAuditorUserList,
                    applicationId: _applicationId,
                    oldApproverId: $scope.item.approvalInfoArray[0].approverId
                })
            })
        }
    } else {
        getData();
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

//请假审批
.controller('WorkApplyAuditLeaveCtrl', function($scope, $state, $ionicActionSheet, $stateParams, common, applyCommon, seleMenuList) {
    $scope.data = {};
    $scope.item = {};

    var _applicationId = $stateParams.id;
    var menus = seleMenuList.menu();

    $scope.isApply = '';//是否申请
    $scope.pageName = '审核';

    if (_applicationId.indexOf('_') > 0) {
        _applicationId = _applicationId.slice(0, -2);
        $scope.isApply = true;
        $scope.pageName = '申请详情';
    }

    var getData = function(cb) {
        if (!cb) {
            common.loadingShow();
        }

        COMMON.post({
            type: 'obtain_application_info',
            data: {
                applicationId: _applicationId
            },
            success: function(data) {
                common.loadingHide();

                var specific = data.body.specificApplicationArray;

                var _cn = common.getId(menus.leaveType, specific[0].leaveType, 'key')

                specific[0].leaveTypeCN = _cn;

                $scope.item = data.body;

                if (typeof cb == 'function') {
                    cb();
                }
            }
        });
    }

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
                if (index == 0) {
                    applyCommon.updateStatus(_applicationId, $scope.data.approvalReason, false);
                } else if (index == 1) {
                    applyCommon.updateStatus(_applicationId, $scope.data.approvalReason, true);
                } else if (index == 2) {
                    $state.go('common_seleGuys', {
                        id: '01'
                    });
                }
                return true;
            }
        });
    }

    //审核人
    if (common.setAuditorUserList.id && common.setAuditorUserList._targetName == 'work_apply_auditLeave') {
        if (common.setAuditorUserList.name) {
            getData(function() {
                applyCommon.forwardApproval({
                    to: common.setAuditorUserList,
                    applicationId: _applicationId,
                    oldApproverId: $scope.item.approvalInfoArray[0].approverId
                })
            })
        }
    } else {
        getData();
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
        maintainApplication: {},
        hasCameraImg: false
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
                $scope.imgList = results;
            },
            cameraImg: function(imgData) {
                $scope.data.hasCameraImg = true;
                $timeout(function() {
                    var image = document.getElementById('myImage');  
                    image.src = imgData;
                }, 500);
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

//工程维修审核
.controller('WorkApplyAuditMaintainCtrl', function($scope, $state, $ionicActionSheet, $stateParams, common, applyCommon) {
    $scope.data = {};
    $scope.item = {};

    var _applicationId = $stateParams.id;

    $scope.isApply = '';//是否申请
    $scope.pageName = '审核';

    if (_applicationId.indexOf('_') > 0) {
        _applicationId = _applicationId.slice(0, -2);
        $scope.isApply = true;
        $scope.pageName = '申请详情';
    }

    // ，维修人提交维修结果   WORKING
    // ，检查人确认维修     UNCONFIRMED

    var NavMenus = []; 

    var getData = function(cb) {
        if (!cb) {
            common.loadingShow();
        }

        COMMON.post({
            type: 'obtain_application_info',
            data: {
                applicationId: _applicationId
            },
            success: function(data) {
                common.loadingHide();

                var _body = data.body;

                common.getUserinfo_simple(_body.specificApplicationArray[0].servicemanId, function(data) {
                    _body.servicemanIdName = data.name;
                });

                $scope.item = _body;

                if (_body.applicationBaseInfoJson.applicationStatus == 'WORKING') {

                }

                if (typeof cb == 'function') {
                    cb();
                }

                console.log(data.body)
            }
        });
    }

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
                if (index == 0) {
                    applyCommon.updateStatus(_applicationId, $scope.data.approvalReason, false);
                } else if (index == 1) {
                    applyCommon.updateStatus(_applicationId, $scope.data.approvalReason, true);
                } else if (index == 2) {
                    $state.go('common_seleGuys', {
                        id: '08'
                    });
                }
                return true;
            }
        });
    }

    //审核人
    if (common.setAuditorUserList.id && common.setAuditorUserList._targetName == 'work_apply_auditMaintain') {
        if (common.setAuditorUserList.name) {
            getData(function() {
                applyCommon.forwardApproval({
                    to: common.setAuditorUserList,
                    applicationId: _applicationId,
                    oldApproverId: $scope.item.approvalInfoArray[0].approverId
                })
            })
        }
    } else {
        getData();
    }
})

//我的维修任务
.controller('WorkApplyMyTaskCtrl', function($scope, $state, $timeout, common) {
    var dataList = {
        currentPage: 0,
        myMaintainTasks: []
    };

    $scope.items = [];

    var handleAjax = function() {
        common.loadingShow();

        COMMON.post({
            type: 'obtain_my_maintain_tasks',
            data: {
                "userId": common.userInfo.clientId,
                "currentPage": dataList.currentPage + 1
            },
            notPretreatment: true,
            success: function(data) {
                var _body = data.body;
                common.loadingHide();

                if (!_body.myMaintainTasks || (typeof _body.myMaintainTasks == 'object' && !_body.myMaintainTasks.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                var tasks = _body.myMaintainTasks;

                dataList = _body;

                for (var i = 0, ii = tasks.length; i < ii; i++) {

                    tasks[i]._createTime = common.format(tasks[i].createTime);

                    if (tasks[i].maintainStatus == 'WORKING') {
                        tasks[i]._status = '工作中';
                    } else if (tasks[i].maintainStatus == 'UNCONFIRMED') {
                        tasks[i]._status = '未确认';
                    }

                    if (tasks[i]._status) {
                        $scope.items.push(tasks[i]);
                    }
                }

                $timeout(function() {
                    $scope.vm.moredata = true;
                }, 1000);
            }
        });
    }, initAjax = function() {
        $scope.items = [];
        dataList = {
            currentPage: 0,
            myMaintainTasks: []
        };

        handleAjax();
    }
    initAjax();

    $scope.vm = {
        moredata: false,
        loadMore: function() {

            if (dataList.myMaintainTasks.length < common._pageSize || dataList.currentPage == dataList.total || dataList.total <= 1) {
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
.controller('WorkApplyMyTaskDetailsCtrl', function($scope, $ionicActionSheet, $state, $stateParams, common) {
    var maintainTaskId = $stateParams.id;
    $scope.item = {};

    var navMenus = [];

    var getData = function() {
        common.loadingShow();

        COMMON.post({
            type: 'obtain_maintain_task_info',
            data: {
                maintainTaskId: maintainTaskId
            },
            success: function(data) {
                common.loadingHide();

                var _body = data.body;
                var baseData = _body.maintainTaskBaseInfoJson;

                common.getUserinfo_simple(baseData.servicemanId, function(data) {
                    _body.servicemanIdName = data.name;
                });
                common.getUserinfo_simple(baseData.applicantId, function(data) {
                    _body.applicantName = data.name;
                })
                common.getUserinfo_simple(baseData.approverId, function(data) {
                    _body.approvalName = data.name;
                })

                $scope.item = _body;

                // 4，维修人提交维修结果   WORKING
                // 5，检查人确认维修     UNCONFIRMED

                if (baseData.maintainStatus == 'WORKING') {
                    navMenus = [{text: '维修提交', key: 'submit'}];
                } else if (baseData.maintainStatus == 'UNCONFIRMED') {
                    navMenus = [{text: '合格', key: 'QUALIFIED'},{text:'不合格',key: 'UNQUALIFIED'}];
                }

            }
        });
    }

    var submit = function() {
        common.loadingShow();
        COMMON.post({
            type: 'submit_maintain_application',
            data: {
                clientId: common.userInfo.clientId,
                servicemanId: common.userInfo.clientId,
                maintainTaskId: maintainTaskId
            },
            success: function(data) {
                common.loadingHide();

                common.toast(data.message, function() {
                    common.back();
                })
            }
        });
    }, verify = function(maintainStatus) {
        common.loadingShow();
        COMMON.post({
            type: 'verify_maintain_application',
            data: {
                clientId: common.userInfo.clientId,
                approverId: common.userInfo.clientId,
                maintainTaskId: maintainTaskId,
                maintainStatus: maintainStatus
            },
            success: function(data) {
                common.loadingHide();

                common.toast(data.message, function() {
                    common.back();
                })
            }
        });
    }

    
    $scope.showNav = function() {
        if (!navMenus.length) {
            common.toast('菜单权限未生效');
            return;
        }

        $ionicActionSheet.show({
            buttons: navMenus,
            cancelText: '取消',
            buttonClicked: function (index, item) {
                if (item.key == 'submit') {
                    submit();
                } else if (item.key == 'QUALIFIED' || item.key == 'UNQUALIFIED') {
                    common.popup({}, function() {
                        verify(item.key);
                    })
                }
                return true;
            }
        });
    }

    getData();
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

//采购审批
.controller('WorkApplyAuditPurchaseCtrl', function($scope, $state, $ionicActionSheet, $stateParams, common, applyCommon) {
    $scope.data = {};
    $scope.item = {};

    var _applicationId = $stateParams.id;

    $scope.isApply = '';//是否申请
    $scope.pageName = '审核';

    if (_applicationId.indexOf('_') > 0) {
        _applicationId = _applicationId.slice(0, -2);
        $scope.isApply = true;
        $scope.pageName = '申请详情';
    }

    var getData = function(cb) {
        if (!cb) {
            common.loadingShow();
        }

        COMMON.post({
            type: 'obtain_application_info',
            data: {
                applicationId: _applicationId
            },
            success: function(data) {
                common.loadingHide();

                var _body = data.body;
                var allPurchaseBudget = 0;
                for (var i = 0, ii = _body.specificApplicationArray.length; i < ii; i++) {
                    allPurchaseBudget += (_body.specificApplicationArray[i].purchaseBudget - 0);
                }

                _body.allPurchaseBudget = allPurchaseBudget;
                
                $scope.item = _body;

                if (typeof cb == 'function') {
                    cb();
                }

                console.log(data.body)
            }
        });
    }

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
                if (index == 0) {
                    applyCommon.updateStatus(_applicationId, $scope.data.approvalReason, false);
                } else if (index == 1) {
                    applyCommon.updateStatus(_applicationId, $scope.data.approvalReason, true);
                } else if (index == 2) {
                    $state.go('common_seleGuys', {
                        id: '03'
                    });
                }
                return true;
            }
        });
    }

    //审核人
    if (common.setAuditorUserList.id && common.setAuditorUserList._targetName == 'work_apply_auditPurchase') {
        if (common.setAuditorUserList.name) {
            getData(function() {
                applyCommon.forwardApproval({
                    to: common.setAuditorUserList,
                    applicationId: _applicationId,
                    oldApproverId: $scope.item.approvalInfoArray[0].approverId
                })
            })
        }
    } else {
        getData();
    }
})






