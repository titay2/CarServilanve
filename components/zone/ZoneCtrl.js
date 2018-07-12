(function() {
  angular.module("app").controller("ZoneCtrl", ZoneCtrl);

  ZoneCtrl.$inject = ["translateService", "loginService"];

  function ZoneCtrl(translateService, loginService) {
    translateService.setLanguage();
    loginService.helloInitialize();

    setInterval(function() {
      var zonesgrid = $("#zonesGrid").data("kendoGrid");
      if (zonesgrid && updatedzoneAndCarsDs) {
        var allNewZones = extractZones(updatedzoneAndCarsDs);
        zonesnewDs = modifyZoneDs(updatedzoneAndCarsDs, allNewZones);
        zonesgrid.dataSource.data(zonesnewDs);
      }
    }, 4000);

    var ZoneDs = new kendo.data.DataSource({
      type: "json",
      serverFiltering: false,
      transport: {
        read: {
          url: root + "ZonesAndCars",
          data: { format: "json" },
          dataType: "json"
        }
      },
      pageSize: 25,
      schema: {
        model: {
          id: "zoneId",
          fields: {
            zoneId: { type: "number", editable: false, nullable: true },
            zoneName: { type: "string" },
            freeCarsCount: { type: "number" },
            waitTime: { type: "number" },
            carsList: {
              type: "array"
            }
          }
        }
      }
    });
    $("#zonesGrid").kendoGrid({
      //dataSource: ZoneDs,
      columns: [
        {
          field: "zoneId",
          title: "Zone ID",
          width: "80px"
        },
        {
          field: "zoneName",
          title: "Zone Name",
          width: "150px"
        },
        {
          field: "freeCarsCounts",
          title: "Free Cars",
          width: "80px"
        },
        {
          field: "waitTime",
          title: "Wait Time",
          width: "100px"
        },
        {
          title: "Cars List"
        }
      ],
      pageable: true,
      rowTemplate: kendo.template($("#rowTemplate").html()),
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

    function extractZones(allCars) {
      var zoneNumList = _.uniq(allCars, function(item) {
        return item.zoneId;
      });
      allZones = zoneNumList.map(a => a.zoneId);
      return allZones;
    }
    function desc_start_time(a, b) {
      return (
        new Date(a.statusTime).getTime() - new Date(b.statusTime).getTime()
      );
    }

    function modifyZoneDs(carsDs, zonesList) {
      var zonesList = _.sortBy(zonesList, function(num) {
        return num;
      });
      var ZoneInfoDs = [];
      for (var k = 0; k < zonesList.length; k++) {
        var gridRow = _.where(carsDs, {
          zoneId: zonesList[k]
        });

        if (gridRow.length > 0) {
          var b = _
            .chain(gridRow)
            .sort(desc_start_time)
            .value();

          var filteredZones = getfilteredzones(b);
          var freeCarCount = filteredZones.reduce(function(n, status) {
            return n + (status.dispatchStatusId == 0);
          }, 0);

          var slicedfilteredZones = filteredZones.slice(0, 25);

          if (slicedfilteredZones.length > 0) {
            var d = new Date();
            var utcOffset = moment(d).utcOffset();
            var c = slicedfilteredZones[0].statusTime;
            var waittimeLocal = moment().diff(c, "minutes");
            var waittime = waittimeLocal - utcOffset;
            var obj = {};
            obj.zoneId = slicedfilteredZones[0].zoneId;
            obj.zoneName = slicedfilteredZones[0].zoneName;
            obj.freeCarsCount = freeCarCount;
            obj.waitTime = waittime;
            obj.carsList = slicedfilteredZones;
            ZoneInfoDs.push(obj);
          }
        }
      }
      return ZoneInfoDs;
    }
  }
})();
