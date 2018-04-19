(function() {
  "use strict";
  angular.module("app").factory("filterService", filterService);

  function filterService($cookies, HelloService, jwtHelper, $rootScope) {
    return {
      watchAndFilter: function(watchThis, filterBy) {
        function getValue() {
          return window.localStorage.getItem(watchThis);
        }
        $scope.$watch(getValue, function(val) {
          if (val) {
            var newValue = $.parseJSON(val);
            applyFilter(filterBy, newValue);
          }
        });
      }
    };

    function applyFilter(filterField, filterValue) {
      var gridData = $("#grid").data("kendoGrid");
      var currFilterObj = gridData.dataSource.filter();
      var currentFilters = currFilterObj ? currFilterObj.filters : [];

      if (currentFilters && currentFilters.length > 0) {
        for (var i = 0; i < currentFilters.length; i++) {
          if (currentFilters[i].field == filterField) {
            currentFilters.splice(i, 1);
            break;
          }
        }
      }

      if (filterValue != "0") {
        currentFilters.push({
          field: filterField,
          operator: "eq",
          value: filterValue
        });
      }

      dataSource.filter({
        logic: "and",
        filters: currentFilters
      });
    }
  }
})();
