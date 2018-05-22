(function() {
  angular.module("app").controller("ZoneCtrl", ZoneCtrl);

  ZoneCtrl.$inject = [
    "apiService",
    "translateService",
    "$scope",
    "$state",
    "$translate",
    "loginService"
  ];

  function ZoneCtrl(
    apiService,
    translateService,
    $scope,
    $state,
    $translate,
    loginService
  ) {
    translateService.setLanguage();
    loginService.helloInitialize();
    $scope.here = function() {};
    // watchAndFilter("callCenterId", "operatingCompanyID");

    var zone = $.connection.zonesAndCarsHub;
    zone.client.zonesAndCarsUpdate = function(update) {
      var update_array = JSON.parse(update);
      // $state.reload("zone");
      // console.log(update_array);
      // var parsedArray = [];
      // for (var i = 0; i < update_array.length; i++) {
      //   parsedArray.push(update_array[i]);
      // }
      // console.log(parsedArray);
      // var data = update_array;
      // var grid = $("#grid").data("kendoGrid").dataSource;
      // $("#grid").refresh();
      console.log("here!");
      // for (var i = 0; i < data.length; i++) {
      //   if (data[i].carsList !== null) {
      //     var cars = data[i].carsList;
      //   }
      //   if ($("#grid").data("kendoGrid")) {
      //     var dataItem = grid.get(data[i].zoneId);

      //     var carItem;
      //     for (var key in dataItem) {
      //       if (key.indexOf("Car") > -1) {
      //         var item = dataItem[key];
      //         if (isNaN(item) && item.carNumber !== undefined) {
      //           catItem = item;
      //         }
      //       }
      //     }
      //     for (var k = 0; k < cars.length; k++) {
      //       if ((catItem.carNumber = cars[k].carNumber)) {
      //         catItem.carString = cars[k].carString;
      //         catItem.dispatchStatus = cars[k].dispatchStatus;
      //         catItem.postingId = cars[k].postingId;
      //         catItem.operatingCompanyID = cars[k].operatingCompanyID;
      //         //$("#grid").data("kendoGrid").dataSource.read();
      //         //   }
      //       } else {
      //         console.log(cars[k].carNumber);
      //       }
      //     }
      //   }
      // }
    };

    $.connection.hub.start().done(function() {
      zone.server.getAllZonesAndCarsInfo().done(function(data1) {});
    });
    function watchAndFilter(watchThis, filterBy) {
      function getValue() {
        return window.localStorage.getItem(watchThis);
      }
      $scope.$watch(getValue, function(val) {
        if (val) {
          var newValue = $.parseJSON(val);
          console.log(newValue);
          applyFilter(filterBy, newValue);
        }
      });
    }
    function applyFilter(filterField, filterValue) {
      var gridData = $("#grid").data("kendoGrid");
      var dataSource = $("#grid").data("kendoGrid").dataSource;
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
