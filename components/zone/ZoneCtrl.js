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
          .css("background", "#30d965");
        gridElement
          .find(".1")
          .closest("button")
          .css("background", "#db40c5");
        gridElement
          .find(".2")
          .closest("button")
          .css("background", "#ff3636");
        gridElement
          .find(".3")
          .closest("button")
          .css("background", "#eef51b");
      }
    });

    setInterval(function() {
      var grid = $("#grid").data("kendoGrid");
      if (
        !$(".k-loading-image").is(":visible") &&
        grid.dataSource._pristineData.length !== 0
      ) {
        grid.dataSource.read();
        grid.refresh();
      }
    }, 10000);
    // var zone = $.connection.zonesAndCarsHub;
    // zone.client.zonesAndCarsUpdate = function(update) {
    //   console.log(update.length);

    // };
    // $.connection.hub.start().done(function() {
    //   zone.server.getAllZonesAndCarsInfo().done(function() {});
    // });
  }
})();
