angular.module('work.controller', [])

//
.controller('WorkCtrl', function($scope, $state, $http, workPlatform) {
    $scope.data = {};

    $scope.items = workPlatform.all();
    $scope.itemsCrm = workPlatform.crm();
    $scope.itemsLearn = workPlatform.learn();

    // $http({
    // 	method: 'POST',
    // 	url: 'http://123.206.95.25:18080/kuaidao/client/resources.html',
    // 	params: {
    // 		json: '{"appType":"IOS","appVersion":"1.0.0","body":{},"businessType":"departmrnt_info"}'
    //         // json: '{"appType":"IOS","appVersion":"1.0.0","body":{"id":7,"searchId":7},"businessType":"userinfo_detail"}'
    // 	}
    // }).success(function(data) {
    // 	console.log(data)
    // }).error(function(data) {

    // })
})

//公共选择审核人员 | 查询人
//common_seleGuys /common/seleGuys/:id
.controller('CommonSeleGuysCtrl', function($scope, $state, $stateParams, common) {
    $scope.items = [];
    $scope.pageTitle = '审核人';

    var guysTypeId = $stateParams.id;

    var isQuery = false;
    if (guysTypeId > 100) {
        isQuery = true;

        $scope.pageTitle = '选择人员';
    }


    common.setAuditorUserList = {};
    common.setQueryUserList = {};

    var typeId = {
        '1': 'work_apply_addleave',//请假申请
        '01': 'work_apply_auditLeave',//请假申请-审核
        '3': 'work_apply_addPurchase',//采购申请
        '03': 'work_apply_auditPurchase',//采购申请-审核
        '6': 'work_apply_addprivilege',//优惠申请
        '06': 'work_apply_auditprivilege',//优惠申请-审核
        '7': 'work_apply_adddiscard',//报残申请
        '07': 'work_apply_auditDiscount',//报残申请
        '8': 'work_apply_addmaintain',//工程维修申请
        '08': 'work_apply_auditMaintain',//工程维修申请-审核
        '801': 'work_apply_addmaintain_1',//工程维修申请——维修人
        '9': 'work_apply_addother',//其他申请
        '09': 'work_apply_auditOther',//其他申请-审核

        '2': 'work_task_add_ATTENTION',
        '4': 'work_task_add_inspector',
        '5': 'perfomance_add'//绩效开单
    }

    common.getAuditorUser(function(data) {
        $scope.items = data;
    }, isQuery);

    $scope.nickname = function(name) {
        return common.nickname(name);
    }

    $scope.seleGuyHanle = function(item) {
        item._targetName = typeId[guysTypeId];

        common.setAuditorUserList = item;
        common.setQueryUserList = item;

        // $state.go(typeId[guysTypeId]);
        history.back(-1);
    }
})

//公共选择通讯录 部门 | 人
///common/seleSection/:id
.controller('CommonSeleSectionCtrl', function($scope, $state, $stateParams, common) {
    $scope.items = [];

    common.setCheckedPerson = {list: []};

    var urlId = $stateParams.id;
    var typeId = {
        '1': 'work_notify',//通知
        '2': 'work_schedule_add',//日程-新增
        '3': 'work_task_add'//任务
    }

    //部门不可选
    if (urlId == '3') {
        $scope.notCheckSection = true;
    }

    //公司&部门列表
    var companyList = [];

    //选择菜单处理
    var toggleSeleHandle = function(type) {
        if (type == 'brank') {
            $scope.isShowBrankSele = !$scope.isShowBrankSele;
        }
    }, handleBrankList = function(id) {
        for (var i = 0; i < companyList.length; i++) {
            if (companyList[i].departmentId == id) {
                return companyList[i].childDepartment;
            }
        }
        return [];
    }

    $scope.seleBrank = [];
    $scope.isShowBrankSele = false;
    $scope.seleBrankInfo = '品牌';

    //加载部门&公司
    common.getCompany(function(data) {
        $scope.seleBrank = data;
        companyList = data;

        $scope.items = handleBrankList(1);
    });

     //选择部门
    $scope.seleBrankHandle = function(item) {
        $scope.seleBrankInfo = item.name;

        $scope.items = handleBrankList(item.departmentId);

        toggleSeleHandle('brank');
    }
    //筛选切换
    $scope.toggleSele = function(type) {
        toggleSeleHandle(type);
    }

    $scope.sub = function() {
        var list = common.filterChecked($scope.items);
        for (var i = 0, ii = list.length; i < ii; i++) {
            common.setCheckedPerson.list.push( list[i] )
        }

        var _config = common.repeatArrObj(common.setCheckedPerson.list, 'id', 'departmentId');

        common.setCheckedPerson.list = common.filterChecked(_config);

        common.setCheckedPerson._targetName = typeId[urlId];

        history.back(-1);
    }

    $scope.toPerson = function(item) {
        if (item.userNum) {
            $state.go('common_sele_person', {
                id: item.departmentId
            });    
        }
    }
})

.controller('CommonSelePersonCtrl', function($scope, $state, $stateParams, $timeout, common) {
    $scope.items = [];

    var dataList = {
        currentPage: 0,
        phoneBook: []
    };

    var handleAjax = function () {
        COMMON.getPhoneBook({
            currentPage: dataList.currentPage + 1,
            departmentId: $stateParams.id,
            name: ''
        }, function(body) {
            var _body = body,
                phoneBook = _body.phoneBook;

            dataList = _body;

            for (var i = 0, ii = phoneBook.length; i < ii; i++) {
                $scope.items.push(phoneBook[i]);
            }

            $timeout(function() {
                $scope.vm.moredata = true;
            }, 1000);
        });
    }

    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.phoneBook.length < 10 || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
                $scope.vm.moredata = false;
                return;
            }
            console.log(dataList.totalPage, 'x');

            $timeout(function () {
                $scope.vm.moredata = false;
                handleAjax();
            }, 1500);
            return true;
        }
    }

    $scope.back = function() {
        var list = common.filterChecked($scope.items);
        for (var i = 0, ii = list.length; i < ii; i++) {
            common.setCheckedPerson.list.push( list[i] )
        }
        
        history.back(-1);
    }

    handleAjax();
})

//选择客户人员（crm模块需要）
// common/seleCustomer/:id
.controller('CommonSeleCustomerCtrl', function($scope, $state, $stateParams, $timeout, common) {
    $scope.items = [];

    var dataList = {
        currentPage: 0,
        rows: []
    };

    var urlId = $stateParams.id;
    var typeId = {
        '1': 'work_opportunity_create',//商机-新增
        '3': 'work_visit_edit',//回访-编辑
        '2': 'work_visit_create',//回访-新增
        '4': 'work_opportunity_edit'//商机-编辑
    }

    var handleAjax = function (isNotLoading) {
        if (isNotLoading) {
            common.loadingShow();
        }

        var _param = {
            page: dataList.currentPage + 1,
            keyword: ''
        };

        common.post({
            type: 'obtain_customers',
            data: _param,
            notPretreatment: true,
            success: function(data) {
                common.loadingHide();
                var _body = data.body;

                if (!_body || (_body && !_body.rows) || (_body && _body.rows && !_body.rows.length)) {
                    $scope.notTaskListData = common.notTaskListDataTxt;
                    return;
                } else {
                    $scope.notTaskListData = false;
                }

                dataList = _body;

                var list = _body.rows;
                
                for (var i = 0, ii = list.length; i < ii; i++) {
                    // list[i]._star = workCrmSele.joinStar(list[i].star);
                    // list[i]._lastConsumptionTime = common.format(list[i].lastConsumptionTime, 'yyyy-MM-dd', true);
                    $scope.items.push(list[i]);
                }

                $timeout(function() {
                    $scope.vm.moredata = true;
                }, 1000);
            }
        });
    }, initData = function(isNotLoading) {
        dataList = {
            currentPage: 0,
            rows: []
        };

        $scope.items = [];

        handleAjax(isNotLoading);
    }

    $scope.vm = {
        moredata: false,
        loadMore: function() {
            if (dataList.rows.length < common._pageSize || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
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

    $scope.nickname = function(name) {
        return common.nickname(name);
    }

    $scope.seleGuyHanle = function(item) {
        item._targetName = typeId[urlId];

        common.setAuditorUserList = item;
        common.setQueryUserList = item;

        // $state.go(typeId[guysTypeId]);
        history.back(-1);
    }

    initData(true);
})


