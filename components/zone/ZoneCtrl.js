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

    var zonehub = $.connection.zonesAndCarsHub;
    var zonehubStart = $.connection.hub.start();

    // $("#grid").kendoGrid({
    //   columns: [
    //     {
    //       field: "ZoneId",
    //       title: "zone ID"
    //     },
    //     {
    //       field: "ZoneName",
    //       title: "zone Name"
    //     },
    //     {
    //       field: "FreeCarsCount",
    //       title: "count"
    //     },
    //     {
    //       field: "WaitTime",
    //       title: "wait"
    //     }
    //   ],
    //   pageable: true,

    //   dataSource: {
    //     type: "signalr",
    //     autoSync: true,
    //     transport: {
    //       signalr: {
    //         promise: zonehubStart,
    //         hub: zonehub,
    //         server: {
    //           read: "getAllZonesAndCarsInfo"
    //         },
    //         client: {
    //           read: "zonesAndCarsUpdate"
    //         }
    //       }
    //     },
    //     // schema: {
    //     //   model: {
    //     //     id: "zoneId"
    //     //   }
    //     // },
    //     pageSize: 15
    //   },
    //   detailInit: function(e) {
    //     var parentGrid = this;
    //     $("<div/>")
    //       .appendTo(e.detailCell)
    //       .kendoGrid({
    //         dataSource: parentGrid.dataItem(e.masterRow).CarsList,
    //         columns: [
    //           { field: "CarString" },
    //           { field: "CarNumber" },
    //           { field: "DispatchStatus" }
    //         ]
    //       });
    //   }
    // });

    // var hubUrl = "url here";
    // var hub = new signalR.HubConnectionBuilder()
    //    .withUrl(hubUrl, {
    //        transport: signalR.HttpTransportType.LongPolling
    //    })
    //    .build();
    // var hubStart = hub.start();

    var zone = $.connection.zonesAndCarsHub;
    zone.client.zonesAndCarsUpdate = function(update) {
      //console.log(update);
      // var update_array = JSON.parse(update);
      //$state.reload("zone");
      //console.log(update);
      //   var parsedArray = [];
      //   for (var i = 0; i < update_array.length; i++) {
      //     parsedArray.push(update_array[i]);
      //   }
      // var data = parsedArray;
      // console.log(parsedArray);
      // var grid = $("#grid").data("kendoGrid").dataSource;
      // for (var i = 0; i < data.length; i++) {
      //   var gridd = $("#grid").data("kendoGrid");
      //   if ($("#grid").data("kendoGrid")) {
      //     var dataItem = grid.get(data[i].zoneId);
      //     dataItem = data[i];
      //     gridd.refresh;
      //   }
      // }
      // var grid = $("#grid").data("kendoGrid").dataSource;
      // var cars;
      // for (var i = 0; i < data.length; i++) {
      //   if (data[i].carsList !== null) {
      //     cars = data[i].carsList;
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
      //         var gridd = $("#grid").data("kendoGrid");
      //         gridd.refresh();
      //         console.log("changed!");
      //         $("#grid")
      //           .data("kendoGrid")
      //           .dataSource.read();
      //         //   }
      //       } else {
      //         console.log(cars[k].carNumber);
      //       }
      //     }
      //   }
      // }
    };

    $.connection.hub.start().done(function() {
      zone.server.getAllZonesAndCarsInfo().done(function(data1) {
        console.log(data1);
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
