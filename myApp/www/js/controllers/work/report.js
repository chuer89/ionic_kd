angular.module('workReport.controller', [])

//日报申请
.controller('WorkReportAddDailyCtrl', function($scope, common) {
    $scope.data = {};

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

    var ajaxhandle = function() {
        common.formData({
            type: 'create_report',
            body: {
                userId: common.userInfo.clientId,
                content: $scope.data.content,
                typeId: 1
            },
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

    $scope.submit = function() {
        ajaxhandle();
    }
})

//周报申请
.controller('WorkReportAddWeekCtrl', function($scope, common) {
    $scope.data = {};

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

    var ajaxhandle = function() {
        common.formData({
            type: 'create_report',
            body: {
                userId: common.userInfo.clientId,
                content: $scope.data.content,
                typeId: 3
            },
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


    $scope.submit = function() {
        ajaxhandle();
    }
})

//月报申请
.controller('WorkReportAddMonthCtrl', function($scope, common) {
    $scope.data = {};

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

    var ajaxhandle = function() {
        common.formData({
            type: 'create_report',
            body: {
                userId: common.userInfo.clientId,
                content: $scope.data.content,
                typeId: 2
            },
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

    $scope.submit = function() {
        ajaxhandle();
    }
})

//查询列表
.controller('WorkReportCtrl', function($scope, $state, $ionicActionSheet, $timeout, common, seleMenuList) {
    var menus = seleMenuList.menu();

    var dataList = {};
    $scope.data = {
        departmentId: 1
    };
    $scope.items = [];

    var initData = function() {
        dataList = {
            currentPage: 0,
            report: []
        };

        $scope.items = [];
    }
    initData();
    

    var ajaxhandle = function() {
        COMMON.post({
            type: 'obtain_report',
            data: {
                userId: common.userInfo.clientId,
                currentPage: dataList.currentPage + 1,
                departmentId: $scope.data.departmentId,
                startDate: '2017-01-04',
                endDate: '2017-08-26',
                typeId: $scope.data.typeId
            },
            success: function(data) {
                var _body = data.body;

                var list = _body.report;

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
            if (dataList.report.length < common._pageSize || dataList.currentPage == dataList.totalPage || dataList.totalPage <= 1) {
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

    $scope.seleBrank = [];
    $scope.seleDepartment = [];
    $scope.seleDate = [{name:'本月',key:''},{name:'上月'},{name:'起止时间'}];
    $scope.seleType = [{name:'全部',key:'-1'},{name:'日报',key:'1'},{name:'周报',key:'2'},{name:'月报',key:'3'}];

    $scope.isShowBrankSele = false;
    $scope.isShowDepartmentSele = false;
    $scope.isShowDateSele = false;
    $scope.isShowTypeSele = false;

    $scope.seleBrankInfo = '品牌';
    $scope.seleDepartmentInfo = '部门';
    $scope.seleDateInfo = '17/02-17/04';
    $scope.seleTypeInfo = '类型';

    //选择菜单处理
    var toggleSeleHandle = function(type, isToggle) {
        if (!isToggle) {
            initData();
            ajaxhandle();
        }

        if (type == 'brank') {
            $scope.isShowDepartmentSele = false;
            $scope.isShowDateSele = false;
            $scope.isShowTypeSele = false;

            $scope.isShowBrankSele = !$scope.isShowBrankSele;
        } else if (type == 'department') {
            $scope.isShowBrankSele = false;
            $scope.isShowDateSele = false;
            $scope.isShowTypeSele = false;

            if (!$scope.seleDepartment.length) {
                common.toast('请选择正确品牌');
                return;
            }

            $scope.isShowDepartmentSele = !$scope.isShowDepartmentSele;
        } else if (type == 'date') {
            $scope.isShowBrankSele = false;
            $scope.isShowDepartmentSele = false;
            $scope.isShowTypeSele = false;

            $scope.isShowDateSele = !$scope.isShowDateSele;
        } else if(type == 'type') {
            $scope.isShowBrankSele = false;
            $scope.isShowDepartmentSele = false;
            $scope.isShowDateSele = false;

            $scope.isShowTypeSele = !$scope.isShowTypeSele;
        }
    }

    //加载部门&公司
    common.getCompany(function(data) {
        $scope.seleBrank = data;
    })

    //选择部门
    $scope.seleBrankHandle = function(item) {
        $scope.seleDepartment = item.childDepartment;
        toggleSeleHandle('brank', true);

        $scope.seleBrankInfo = item.name;
        $scope.seleDepartmentInfo = '部门';
    }
    $scope.seleDepartmentHandle = function(item) {
        $scope.seleDepartmentInfo = item.name;
        $scope.data.departmentId = item.departmentId;

        toggleSeleHandle('department');
    }

    $scope.seleDateHandle = function(item) {
        toggleSeleHandle('date');
    }

    $scope.seleTypeHandle = function(item) {
        $scope.data.typeId = item.key;
        $scope.seleTypeInfo = item.name;

        toggleSeleHandle('type');
    }

    //筛选切换
    $scope.toggleSele = function(type) {
        toggleSeleHandle(type, true);
    }

    $scope.showNav = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: '写日报', link: 'work_report_addDaily'
            }, {
                text: '写周报', link: 'work_report_addWeek'
            }, {
                text: '写月报', link: 'work_report_addMonth'
            }, {
                text: '统计', link: 'work_report_record'
            }],
            cancelText: '取消',
            buttonClicked: function (index, item) {
                var _go = item.link || 'work_report_record';
                $state.go(_go);
                return true;
            }
        });
    }
})

//日报详情
.controller('WorkReportDetailCtrl', function($scope, $stateParams, $timeout, common) {
    $scope.item = {};

    $scope.data = {};

    $scope.reportList = [];

    var dataList = {
        currentPage: 0,
        reportComment: []
    };

    //详情
    COMMON.post({
        type: 'report_details',
        data: {
            reportId: $stateParams.id
        },
        success: function(data) {
            var _body = data.body;

            _body.nickname = common.nickname(_body.userName);

            $scope.item = _body;
        }
    });

    //评论列表
    var handleAjax = function() {
        COMMON.post({
            type: 'obtain_report_comment',
            data: {
                reportId: $stateParams.id,
                currentPage: dataList.currentPage + 1
            },
            success: function(data) {
                var _body = data.body || {},
                    reportComment = _body.reportComment;

                dataList = _body;

                for (var i = 0, ii = reportComment.length; i < ii; i++) {
                    reportComment[i].nickname = common.nickname(reportComment[i].commentUserName);
                    reportComment[i]._commentTime = common.format(reportComment[i].commentTime);

                    $scope.reportList.push(reportComment[i]);
                }

                $timeout(function() {
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
            type: 'report_comment',
            data: {
                reportId: $stateParams.id,
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
})

//统计
.controller('WorkReportRecordCtrl', function($scope, common) {
    $scope.data = {};

	COMMON.post({
        type: 'report_statistic',
        data: {
            userId: common.userInfo.clientId,
            date: '2017-07-10'
        },
        success: function(data) {
            var _body = data.body;

            $scope.data = _body;

            console.log(_body);
        }
    });
})

//统计-个人
.controller('WorkReportRecordPersonCtrl', function($scope, $stateParams, common) {
    COMMON.post({
        type: 'signal_person_report_statistic',
        data: {
            userId: common.userInfo.clientId,
            date: '2017-07-10',
            searchUserId: $stateParams.id
        },
        success: function(data) {
            var _body = data.body;
            console.log(_body);
        }
    });
})

