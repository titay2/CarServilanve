(function() {
  angular.module("app").controller("ZoneCtrl", ZoneCtrl);

  ZoneCtrl.$inject = [
    "apiService",
    "translateService",
    "$scope",
    "$state",
    "$translate",
    "loginService",
    "kendoDataSourceService"
  ];

  function ZoneCtrl(
    apiService,
    translateService,
    $scope,
    $state,
    $translate,
    loginService,
    kendoDataSourceService
  ) {
    translateService.setLanguage();
    loginService.helloInitialize();

    var zoneDs = kendoDataSourceService.getZoneDataSourse;
    var carDs = kendoDataSourceService.getCarDataSourse;

    $("#grid").kendoGrid({
      columns: [
        {
          field: "zoneId",
          title: "zone ID",
          width: "80px"
        },
        {
          field: "zoneName",
          title: "zone Name",
          width: "100px"
        },
        {
          field: "freeCarsCount",
          title: "Frre Cars",
          width: "100px"
        },
        {
          field: "waitTime",
          title: "wait Time",
          width: "100px"
        },
        {
          title: "Cars List"
        }
      ],
      pageable: true,
      rowTemplate: kendo.template($("#rowTemplate").html()),
      dataSource: zoneDs,
      dataBound: function(e) {
        var gridElement = this.element;
        gridElement
          .find(".0")
          .closest("button")
          .css("background", "#ff3636");
        gridElement
          .find(".1")
          .closest("button")
          .css("background", "#db40c5");
        gridElement
          .find(".2")
          .closest("button")
          .css("background", "#30d965");
        gridElement
          .find(".3")
          .closest("button")
          .css("background", "#eef51b");
      }
    });

    var zone = $.connection.zonesAndCarsHub;
    zone.client.zonesAndCarsUpdate = function(update) {
      if ($(".k-loading-image")) {
        console.log("loading");
      }
      if ($("#grid").data("kendoGrid") && zoneDs._pristineData.length !== 0) {
        for (var i = 0; i < update.length; i++) {
          for (var j = 0; j < update[i].CarsList.length; j++) {
            var car = carDs.get(update[i].CarsList[j].CarNumber);

            if (car.zoneId == update[i].ZoneId) {
              var myZone = zoneDs.get(update[i].ZoneId);

              for (var k = 0; k < myZone.carsList.length; k++) {
                if (
                  (myZone.carsList[k].carNumber =
                    update[i].CarsList[j].CarNumber &&
                    myZone.carsList[k].dispatchStatus !==
                      update[i].CarsList[j].DispatchStatus)
                ) {
                  // myZone.set(
                  //   "dispatchStatus",
                  //   update[i].CarsList[j].DispatchStatus
                  // );
                  // $("#grid")
                  //   .data("kendoGrid")
                  //   .refresh();
                  // console.log("here!");
                }
              }
              // var zone = zoneDs.get(update[i].ZoneId);
              // for (var k = 0; k < zone.carsList; k++) {
              //   console.log(zone.carsList[k].carNumber);
              //   // if (
              //   //   update[i].CarsList[j].CarNumber ==
              //   //   zone.carsList[k].carNumber
              //   // ) {
              //   //   console.log(
              //   //     update[i].CarsList[j].CarNumber +
              //   //       " and " +
              //   //       zone.carsList[k].carNumber
              //   //   );
              //   // }
              // }
              // console.log(zone);
              // zone.set("dispatchStatus", update[i].CarsList[j].DispatchStatus);
              // console.log(zone);
              // console.log(zoneDs.get(update[i].ZoneId));
            } else {
              //console.log(car.zoneId + "and " + update[i].ZoneId);
            }
          }
        }
      }
      // // Iterate through the update data and find the changed cars
      // for (var i = 0; i < update.length; i++) {
      //   for (var j = 0; j < update[i].CarsList.length; j++) {
      //     // get the updates cars old zone mumber
      //     var filtercars = _.where(cars, {
      //       vehicleNumber: update[i].CarsList[j].CarNumber
      //     });
      //     // If the zone number of the updated car is similar to its old zone number
      //     // just update the status
      //     if (filtercars[0].zoneId == update[i].ZoneId) {
      //       if (grid) {
      //         var dataItem = griddata.get(update[i].ZoneId);
      //         var carItem;
      //         for (var key in dataItem) {
      //           if (key.indexOf("Car") > -1) {
      //             var item = dataItem[key];
      //             if (isNaN(item) && item.carNumber !== undefined) {
      //               carItem = item;
      //             }
      //           }
      //         }
      //       }
      //       if (
      //         (carItem.carNumber =
      //           update[i].CarsList[j].CarNumber &&
      //           carItem.dispatchStatus !== update[i].CarsList[j].DispatchStatus)
      //       ) {
      //         carItem.dispatchStatus = update[i].CarsList[j].DispatchStatus;
      //         $("#grid")
      //           .data("kendoGrid")
      //           .refresh();
      //       }
      //     } // If the zone number has change
      //     else {
      //       var oldData = griddata.get(filtercars[0].zoneId);
      //       for (var key in oldData) {
      //         if (key.indexOf("Car") > -1) {
      //           var item = oldData[key];
      //           if (isNaN(item) && item.carString !== null) {
      //             var oldcarItem = item;
      //             if (oldcarItem.carNumber == update[i].CarsList[j].CarNumber) {
      //               setNull(oldcarItem);
      //               $("#grid")
      //                 .data("kendoGrid")
      //                 .refresh();
      //             }
      //           }
      //         }
      //       }
      //       // console.log(oldcarItem);
      //       // new zone
      //     }
      //   }
      // }
    };
    $.connection.hub.start().done(function() {
      zone.server.getAllZonesAndCarsInfo().done(function() {});
    });

    var hub = $.connection.zonesAndCarsHub;
    var zoneHubStart = $.connection.hub.start();

    // $("#grid").kendoGrid({
    //   dataSource: {
    //     type: "signalr",
    //     autoSync: true,
    //     schema: {
    //       model: {
    //         id: "ZoneId",
    //         fields: {
    //           ZoneId: { type: "number", editable: false, nullable: true },
    //           ZoneName: { type: "string" },
    //           FreeCarsCount: { type: "number" },
    //           WaitTime: { type: "number" },
    //           CarsList: {
    //             type: "object"
    //           }
    //         }
    //       }
    //     },
    //     // sort: [{ field: "SendTime"", dir: "desc" }],
    //     transport: {
    //       signalr: {
    //         promise: zoneHubStart,
    //         hub: hub,
    //         server: {
    //           read: "getAllZonesAndCarsInfo"
    //         },
    //         client: {
    //           read: "zonesAndCarsUpdate"
    //         }
    //       }
    //     }
    //   },
    //   columns: [
    //     {
    //       field: "ZoneId",
    //       title: "zone ID",
    //       width: "80px"
    //     },
    //     {
    //       field: "ZoneName",
    //       title: "zone Name",
    //       width: "100px"
    //     },
    //     {
    //       field: "FreeCarsCount",
    //       title: "Frre Cars",
    //       width: "100px"
    //     },
    //     {
    //       field: "WaitTime",
    //       title: "wait Time",
    //       width: "100px"
    //     },
    //     {
    //       title: "Cars List",
    //       width: "200%"
    //     }
    //   ],
    //   pageable: true,
    //   rowTemplate: kendo.template($("#rowTemplate").html()),
    //   dataBound: function(e) {
    //     var gridElement = this.element;
    //     gridElement
    //       .find(".0")
    //       .closest("button")
    //       .css("background", "#ff3636");
    //     gridElement
    //       .find(".1")
    //       .closest("button")
    //       .css("background", "#db40c5");
    //     gridElement
    //       .find(".2")
    //       .closest("button")
    //       .css("background", "#30d965");
    //     gridElement
    //       .find(".3")
    //       .closest("button")
    //       .css("background", "#eef51b");
    //   }
    // });
  }
})();
