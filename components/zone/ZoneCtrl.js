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
      console.log(update.length);
      var grid = $("#grid").data("kendoGrid");
      if (
        !$(".k-loading-image").is(":visible") &&
        grid.dataSource._pristineData.length !== 0
      ) {
        grid.dataSource.read();
        grid.refresh();
      }
    };
    $.connection.hub.start().done(function() {
      zone.server.getAllZonesAndCarsInfo().done(function() {});
    });

    // var hub = $.connection.zonesAndCarsHub;
    // var zoneHubStart = $.connection.hub.start();

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
    //       .css("background", "#30d965");
    //     gridElement
    //       .find(".1")
    //       .closest("button")
    //       .css("background", "#db40c5");
    //     gridElement
    //       .find(".2")
    //       .closest("button")
    //       .css("background", "#ff3636");
    //     gridElement
    //       .find(".3")
    //       .closest("button")
    //       .css("background", "#eef51b");
    //   }
    // });
  }
})();
