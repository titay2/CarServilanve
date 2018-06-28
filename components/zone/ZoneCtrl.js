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
    var zoneAndCarHub = $.connection.zoneAndCarHub;
    zoneAndCarHub.client.carsWithZoneUpdate = function(zonesAndCarsUpdate) {
      for (var i = 0; i < zonesAndCarsUpdate.length; i++) {
        var zoneAndCars = zoneAndCarsDs.get(zonesAndCarsUpdate[i].CarNumber);
        if (!zoneAndCars) {
          zoneAndCarsDs.add(zonesAndCarsUpdate[i]);
        } else if (zoneAndCars.ZoneId !== zonesAndCarsUpdate[i].ZoneId) {
          zoneAndCars.set("ZoneId", zonesAndCarsUpdate[i].ZoneId);
        }
      }

      //console.log(modifyZoneDs(zoneAndCarsDs._data, allZones));

      //   allCars = allCars.map(function(item) {
      //     var aZone = zonesAndCarsUpdate.find(a => a.CarNumber == item.CarNumber);
      //     return aZone ? Object.assign(item, aZone) : item;
      //   });
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
                id: "CarNumber"
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

    function modifyZoneDs(carsDs, zonesList) {
      var zonesList = _.sortBy(zonesList, function(num) {
        return num;
      });
      var ZoneInfoDs = [];
      for (var k = 0; k < zonesList.length; k++) {
        var gridRow = _.where(carsDs, {
          ZoneId: zonesList[k]
        });
        if (gridRow) {
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
