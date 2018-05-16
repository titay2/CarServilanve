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
    $scope.here = function() {
      console.log("here!");
    };
    watchAndFilter("callCenterId", "operatingCompanyID");
    function watchAndFilter(watchThis, filterBy) {
      function getValue() {
        return window.localStorage.getItem(watchThis);
      }
      $scope.$watch(getValue, function(val) {
        if (val) {
          console.log(val);
          var newValue = $.parseJSON(val);
          applyFilter(filterBy, newValue);
        }
      });
    }
    var grid = $("#grid").data("kendoGrid").dataSource;
    var dataItem = grid.get(1);
    for (var key in dataItem) {
      if (key.indexOf("Car") > -1) {
        var item = dataItem[key];
        if (isNaN(item)) {
        }
      }
      // if (dataItem.hasOwnProperty(key)) {
      //   console.log(key + ": " + dataItem[key]);
      // }
    }

    var zone = $.connection.zonesAndCarsHub;
    zone.client.zonesAndCarsUpdate = function(update) {
      var update_array = JSON.parse(update);
      var parsedArray = [];
      for (var i = 0; i < update_array.length; i++) {
        parsedArray.push(update_array[i]);
      }
      var data = parsedArray;
      for (var i = 0; i < data.length; i++) {
        var cars = data[i].carsList;

        if ($("#grid").data("kendoGrid")) {
          var g = $("#grid").data("kendoGrid");
          var grid = $("#grid").data("kendoGrid").dataSource;
          var dataItem = grid.get(data[i].zoneId);

          for (var key in dataItem) {
            if (key.indexOf("Car") > -1) {
              var item = dataItem[key];
              if (isNaN(item)) {
                // console.log(dataItem[key].carString);
              }
            }
          }

          var columns = g.columns;
          if (dataItem) {
            // for (var key in dataItem) {
            //   if (dataItem.hasOwnProperty(key)) {
            //     console.log(key + ": " + dataItem[key]);
            //   }
            // }
            // if (columns.length > 0) {
            //   for (var j = 0; j < columns.length; j++) {
            //     var col = columns[j];
            //     var car = col.title;
            //     for (var k = 0; j < cars.length; k++) {
            //       // if ((dataItem.car.carString = cars[k].carString)) {
            //       //   //copy updates here
            //       //   dataItem.car.dispatchStatus = cars[k].dispatchStatus;
            //       // }
            //     }
            //   }
            // }
          }
        }
      }
    };
    $.connection.hub.start().done(function() {
      zone.server.getAllZonesAndCarsInfo().done(function(data1) {});
    });
    function applyFilter(filterField, filterValue) {
      var gridData = $("#grid").data("kendoGrid");
      console.log(gridData);

      var dataSource = $("#grid").data("kendoGrid").dataSource;
      console.log(dataSource);
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
