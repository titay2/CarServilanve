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
    $("#zoneGrid").kendoGrid({
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
      var grid = $("#zoneGrid").data("kendoGrid");
      if (
        grid &&
        !$(".k-loading-image").is(":visible") &&
        grid.dataSource._pristineData.length !== 0
      ) {
        grid.dataSource.read();
        grid.refresh();
      }
    }, 10000);

    // bulding a zone table datasource from cars datasource
    // var carsDs = kendoDataSourceService.getCarDataSourse;

    // waitFor(gridDrawComplete());

    // function gridDrawComplete() {
    //   if (zoneDs._pristineData.length > 0) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    // var gridDataUpdate = [];

    // function waitFor(condition) {
    //   if (gridDrawComplete() === false) {
    //     window.setTimeout(waitFor.bind(null, condition), 100);
    //   } else {
    //     console.log(zoneDs);
    //     console.log(carsDs);
    //     for (var k = 0; k < zoneDs._pristineData.length; k++) {
    //       var gridRow = _.where(carsDs._pristineData, {
    //         zoneId: zoneDs._pristineData[k].zoneId
    //       });
    //       // var obj = gridRow.reduce(function(gridRow, cur, i) {
    //       //   gridRow[i] = cur;
    //       //   return gridRow;
    //       // }, {});
    //       var obj = {};
    //       obj.zoneId = zoneDs._pristineData[k].zoneId;
    //       obj.zoneName = zoneDs._pristineData[k].zoneName;
    //       obj.waitTime = zoneDs._pristineData[k].waitTime;
    //       obj.freeCarsCount = zoneDs._pristineData[k].freeCarsCount;
    //       obj.carslist = gridRow;

    //       // gridDataUpdate[carslist] = gridRow;
    //       gridDataUpdate.push(obj);
    //     }
    //     console.log(gridDataUpdate);
    //   }
    // }
  }
})();
