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

    var allCars = [];
    var allZones = [];
    var zoneAndCarsDs;

    zoneAndCarHub.client.carsWithZoneUpdate = function(zonesAndCarsUpdate) {
      for (var i = 0; i < zonesAndCarsUpdate.length; i++) {
        var zoneAndCars = zoneAndCarsDs.get(zonesAndCarsUpdate[i].CarNumber);
        if (!zoneAndCars) {
          zoneAndCarsDs.add(zonesAndCarsUpdate[i]);
        } else {
          zoneAndCars.set("ZoneId", zonesAndCarsUpdate[i].ZoneId);
          zoneAndCars.set(
            "DispatchStatusId",
            zonesAndCarsUpdate[i].DispatchStatusId
          );
          zoneAndCars.set("CarString", zonesAndCarsUpdate[i].CarString);
          zoneAndCars.set("StatusTime", zonesAndCarsUpdate[i].StatusTime);
        }
      }

      var newCars = zoneAndCarsDs._data;
      var zoneNumList = _.uniq(newCars, function(item) {
        return item.ZoneId;
      });
      allNewZones = zoneNumList.map(a => a.ZoneId);

      var dataS = modifyZoneDs(zoneAndCarsDs._data, allNewZones);

      var zonesgrid = $("#zonesGrid").data("kendoGrid");

      zonesgrid.dataSource.data(dataS);
      //zonesgrid.refresh();
    };

    $.connection.hub.start().done(function() {
      console.log("Client Connected");
      zoneAndCarHub.server
        .getAllCarsWithZone()
        .done(function(getAllZonesAndCars) {
          allCars = getAllZonesAndCars;
          var zoneNumList = _.uniq(allCars, function(item) {
            return item.ZoneId;
          });
          allZones = zoneNumList.map(a => a.ZoneId);

          zoneAndCarsDs = new kendo.data.DataSource({
            data: getAllZonesAndCars,
            schema: {
              model: {
                id: "CarNumber",
                fields: {
                  StatusTime: { type: "date" }
                }
              }
            },
            sort: { field: "StatusTime", dir: "asc" }
          });
          $("#zoneGrid").kendoGrid({
            dataSource: zoneAndCarsDs
          });

          newZoneDs = new kendo.data.DataSource({
            data: modifyZoneDs(zoneAndCarsDs._data, allZones),
            schema: {
              model: {
                id: "ZoneId",
                fields: {
                  ZoneId: { type: "number", editable: false, nullable: true },
                  CarsList: {
                    type: "array"
                  }
                }
              }
            },
            sort: { field: "ZoneId", dir: "asc" }
          });
          $("#zonesGrid").kendoGrid({
            columns: [
              {
                field: "ZoneId",
                title: "zone ID",
                width: "80px"
              },
              {
                title: "Cars List"
              }
            ],
            pageable: true,
            rowTemplate: kendo.template($("#rowTemplate").html()),
            dataSource: newZoneDs,
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
        });
    });
    var a = [
      {
        zoneId: 410,
        zoneName: "Malminkartano",
        carString: "[22185E]",
        carNumber: 22185,
        dispatchStatusId: 3,
        isWorkshift: 0,
        statusTime: "2018-06-27T12:58:24",
        m2mgwStatus: 1,
        finishsuspend: "0001-01-01T00:00:00",
        dataVersionNr: "AAAAAAnN5wg=",
        carAndDriverAttributes: "12356789AB",
        postingId: 91,
        operatingCompanyID: 9999
      },
      {
        zoneId: 8015,
        zoneName: "Stockholm",
        carString: "[5675V]",
        carNumber: 5675,
        dispatchStatusId: 2,
        isWorkshift: 0,
        statusTime: "2018-06-27T13:04:17",
        m2mgwStatus: 1,
        finishsuspend: "0001-01-01T00:00:00",
        dataVersionNr: "AAAAAAnN5wc=",
        carAndDriverAttributes: "12356789AB",
        postingId: 91,
        operatingCompanyID: 9999
      },
      {
        zoneId: 710,
        zoneName: "Pihlajamäki",
        carString: "[5859V]",
        carNumber: 5859,
        dispatchStatusId: 2,
        isWorkshift: 0,
        statusTime: "2018-06-27T12:24:56",
        m2mgwStatus: 1,
        finishsuspend: "0001-01-01T00:00:00",
        dataVersionNr: "AAAAAAnN5wY=",
        carAndDriverAttributes: "12356789AB",
        postingId: 91,
        operatingCompanyID: 9999
      },
      {
        zoneId: 0,
        zoneName: "NoZone",
        carString: "[12834E]",
        carNumber: 12834,
        dispatchStatusId: 3,
        isWorkshift: 0,
        statusTime: "2018-06-27T13:46:54.847",
        m2mgwStatus: 1,
        finishsuspend: "0001-01-01T00:00:00",
        dataVersionNr: "AAAAAAnN5wU=",
        carAndDriverAttributes: "12356789AB",
        postingId: 91,
        operatingCompanyID: 9999
      },
      {
        zoneId: 8033,
        zoneName: "Stockholm",
        carString: "[5664]",
        carNumber: 5664,
        dispatchStatusId: 0,
        isWorkshift: 0,
        statusTime: "2018-06-27T13:07:21",
        m2mgwStatus: 1,
        finishsuspend: "0001-01-01T00:00:00",
        dataVersionNr: "AAAAAAnN5wQ=",
        carAndDriverAttributes: "12356789AB",
        postingId: 91,
        operatingCompanyID: 9999
      }
    ];
    function to_date(o) {
      var parts = o.statusTime.split("-");
      console.log(parts);
      o.statusTime = new Date(parts[0], parts[1] - 1, parts[2]);
      return o;
    }
    function desc_start_time(o) {
      return -o.statusTime.getTime();
    }
    var b = _
      .chain(a)
      .map(to_date)
      .sortBy(desc_start_time)
      .value();
    console.log(b);

    function modifyZoneDs(carsDs, zonesList) {
      var zonesList = _.sortBy(zonesList, function(num) {
        return num;
      });
      var ZoneInfoDs = [];
      for (var k = 0; k < zonesList.length; k++) {
        var gridRow = _.where(carsDs, {
          ZoneId: zonesList[k]
        });

        if (gridRow.length > 0) {
          var slicedRow = gridRow.slice(0, 25);
          let obj = {};
          obj.ZoneId = gridRow[0].ZoneId;
          obj.CarsList = slicedRow;
          ZoneInfoDs.push(obj);
        }
      }
      return ZoneInfoDs;
    }
  }
})();
