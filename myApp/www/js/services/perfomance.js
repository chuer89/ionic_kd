angular.module('perfomance.services', [])

.factory('perfomanceQuery', function() {
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
        }
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

