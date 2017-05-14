angular.module('perfomance.services', [])

.factory('perfomanceQuery', function() {
    var list = [{
        id: 0,
        name: '汪旭'
    }, {
        id: 1,
        name: '厉旭'
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

