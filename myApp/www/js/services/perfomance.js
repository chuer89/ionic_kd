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

