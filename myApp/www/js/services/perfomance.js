angular.module('perfomance.services', [])

.factory('perfomanceQuery', function(common) {
    var list = [{
        id: 0,
        name: '汪旭',
        institution: '中和店',
        score: 1,
        head: 'img/adam.jpg'
    }, {
        id: 1,
        name: '厉旭',
        institution: '万年场',
        score: 2
    }];

    return {
        all: function() {
            return list;
        },
        get: function(id) {
          for (var i = 0; i < list.length; i++) {
            if (list[i].id === parseInt(id)) {
              return list[i];
            }
          }
          return null;
        },

        projectItems: function(cb) {
            common.post({
                type: 'jixiao_items',
                data: {
                    clientId: common.userInfo.clientId
                },
                notPretreatment: true,
                success: function(data) {
                    if (typeof cb == 'function') {
                        cb(data);
                    }
                }
            });
        },

        seleMenusType: [{text: '奖励', key: 'JIANG_LI'}, {text: '扣分', key: 'KOU_FEN'}]
    }
})

.factory('perfomanceList', function () {
    var list = [{
        id: 0,
        name: '汪旭[华南店]',
        marks: '绩效扣分2分，罚款0元，PK2000分'
    }, {
        id: 1,
        name: '厉旭[万和分店]',
        marks: '绩效扣分10分，罚款10元，PK100分'
    }];

    //品牌筛选项
    var seleBrand = [{
        name: '萃华金店'
    }, {
        name: 'LOVE&LOVE'
    }, {
        name: '其他'
    }];

    //部门筛选
    var seleDepartment = [{
        name: '办公室'
    }, {
        name: '福佳店'
    }, {
        name: '华南店'
    }];

    return {
        all: function() {
            return list;
        },
        get: function(id) {
          for (var i = 0; i < list.length; i++) {
            if (list[i].id === parseInt(id)) {
              return list[i];
            }
          }
          return null;
        },
        seleBrand: function() {
            return seleBrand;
        },
        seleDepartment: function() {
            return seleDepartment;
        }
    }
})

//工作-申请-公共方法
.factory('applyCommon', function(common) {
    return {
        //审核（同意 | 拒绝）
        updateStatus: function(id, reason, isRefuse) {
            var _approvalStatus = 'APPROVE';
            var txt = '确认审核通过吗？';

            //（批准/拒绝）值为 （APPROVE / REJECT）

            if (isRefuse) {
                _approvalStatus = 'REJECT';
                txt = '确认拒绝审核吗？';
            }

            if (!reason) {
                common.toast('请填写审核理由');
                return;
            }

            common.popup({
                content: txt
            }, function() {
                common.loadingShow();
                COMMON.post({
                    type: 'update_application_status',
                    data: {
                        applicationId: id,
                        approvalReason: reason,
                        approvalStatus: _approvalStatus,
                        approverId: common.userInfo.clientId
                    },
                    success: function(data) {
                        common.loadingHide();

                        common.toast(data.message, function(){
                            common.back();
                        });
                    }
                });
            })
        },

        forwardApproval: function(opt) {
            var txt = '确认转交给<b>' + opt.to.name + '[' + opt.to.position + ']</b>吗';

            var _param = {
                applicationId: opt.applicationId,
                oldApproverId: opt.oldApproverId,
                newApproverId: opt.to.id
            }

            common.popup({
                content: txt
            }, function() {
                common.loadingShow();
                common.setAuditorUserList.id = '';
                COMMON.post({
                    type: 'forward_approval',
                    data: _param,
                    success: function(data) {
                        common.loadingHide();

                        common.toast(data.message, function(){
                            common.back();
                        })
                    }
                });
            }, function() {
                common.setAuditorUserList.id = '';
            })
        }
    }
})

