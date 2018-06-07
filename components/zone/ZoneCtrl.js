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

    function findCars() {
      var result;
      $.ajax({
        url: root + "Cars/CarsDetails",
        method: "GET",
        dataType: "json",
        async: false,
        success: function(data) {
          result = data;
        }
      });
      return result;
    }
    function setAll(obj, val) {
      /* Duplicated with @Maksim Kalmykov
          for(k in obj) if(obj.hasOwnProperty(k))
              obj[k] = val;
      */
      Object.keys(obj).forEach(function(k) {
        obj[k] = val;
      });
    }
    function setNull(obj) {
      setAll(obj, null);
    }

    var cars = findCars();
    var zoneList = array;
    var zone = $.connection.zonesAndCarsHub;
    zone.client.zonesAndCarsUpdate = function(update) {
      var grid = $("#grid").data("kendoGrid");
      var griddata = grid.dataSource;
      var data = [];
      // the signalR update send unchanged zone infrmation with ull values for carlist array
      // therefore filter only the changed zones
      for (var i = 0; i < update.length; i++) {
        if (update[i].CarsList !== null) {
          data.push(update[i]);
        }
      }
      // Iterate through the update data and find the changed cars
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].CarsList.length; j++) {
          // get the updates cars old zone mumber
          var filtercars = _.where(cars, {
            vehicleNumber: data[i].CarsList[j].CarNumber
          });
          // If the zone number of the updated car is similar to its old zone number
          // just update the status
          if (filtercars[0].zoneId == data[i].ZoneId) {
            if (grid) {
              var dataItem = griddata.get(data[i].ZoneId);
              var carItem;
              for (var key in dataItem) {
                if (key.indexOf("Car") > -1) {
                  var item = dataItem[key];
                  if (isNaN(item) && item.carNumber !== undefined) {
                    carItem = item;
                  }
                }
              }
            }
            if (
              (carItem.carNumber =
                data[i].CarsList[j].CarNumber &&
                carItem.dispatchStatus !== data[i].CarsList[j].DispatchStatus)
            ) {
              carItem.dispatchStatus = data[i].CarsList[j].DispatchStatus;
              $("#grid")
                .data("kendoGrid")
                .refresh();
            }
          } // If the zone number has change
          else {
            var oldData = griddata.get(filtercars[0].zoneId);
            for (var key in oldData) {
              if (key.indexOf("Car") > -1) {
                var item = oldData[key];
                if (isNaN(item) && item.carString !== null) {
                  var oldcarItem = item;
                  if (oldcarItem.carNumber == data[i].CarsList[j].CarNumber) {
                    //setNull(oldcarItem);
                    oldcarItem = null;
                    $("#grid")
                      .data("kendoGrid")
                      .refresh();
                  }
                }
              }
            }
            // console.log(oldcarItem);

            // new zone
          }
        }
      }
    };

    $.connection.hub.start().done(function() {
      zone.server.getAllZonesAndCarsInfo().done(function(data1) {
        //  drawGrid(data1);
      });
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
