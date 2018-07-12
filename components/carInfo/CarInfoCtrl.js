(function() {
  "use strict";

  angular.module("app").controller("CarInfoCtrl", CarInfoCtrl);
  function CarInfoCtrl(translateService, $scope, loginService) {
    translateService.setLanguage();
    loginService.helloInitialize();

    var dataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: root + "Cars/CarsDetails",
          dataType: "json"
        }
      },
      pageSize: 20,
      schema: {
        model: {
          fields: {
            soonForHireTime: { type: "date" },
            changedStatus: { type: "date" },
            lastUpdate: { type: "date" },
            workShiftStart: { type: "date" },
            workShiftEnd: { type: "date" }
          }
        }
      },
      sort: { field: "vehicleNumber", dir: "asc" }
    });

    $("#grid").kendoGrid({
      dataSource: dataSource,
      groupable: true,
      columns: [
        {
          field: "vehicleNumber",
          title: "Car Number",
          attributes: { class: "driverCardNr" }
        },
        {
          field: "operatingCompanyID",
          hidden: true
        },
        {
          field: "carDispatchAttributes",
          hidden: true,
          title: "Property"
        },
        {
          field: "postingID",
          hidden: true
        },
        { field: "driverId", title: "Driver ID" },
        { field: "zoneId", title: "Zone ID" },
        {
          field: "textMessageStatus",
          title: "TXM Status",
          attributes: { class: "taxiCarCompanyId2" }
        },
        { field: "dispatchStatus", title: "Dispatch Status" },
        {
          field: "soonForHireTime",
          title: "SFH time",
          format: "{0: dd/MM/yyyy  h:mm}"
        },
        {
          field: "soonForHireZone",
          title: "SFH Zone",
          attributes: { class: "taxiCarCompanyId" }
        },
        {
          field: "changedStatus",
          title: "changed Status",
          format: "{0: dd/MM/yyyy  h:mm}"
        },
        {
          field: "lastUpdate",
          title: "Last Update",
          format: "{0: dd/MM/yyyy  h:mm}"
        },
        {
          field: "workShiftStart",
          title: "Workshift Start",
          format: "{0: dd/MM/yyyy  h:mm}"
        },
        {
          field: "workShiftEnd",
          title: "Workshift end",
          format: "{0: dd/MM/yyyy  h:mm}"
        },
        {
          field: "group",
          title: "Group",
          format: "{0: dd/MM/yyyy  h:mm}"
        }
      ],
      filterable: true,
      resizable: true,
      sortable: true,
      pageable: true
    });

    watchAndFilter("callCenterId", "operatingCompanyID");
    watchAndFilter("vehicleFilter", "vehicleNumber");
    watchAndFilter("areaFilter", "postingID");
    watchAndFilter("propertyFilter", "carDispatchAttributes");
    clearFilter("#grid");

    function watchAndFilter(watchThis, filterBy) {
      var carGrid = $("#grid").data("kendoGrid");
      function getValue() {
        return window.localStorage.getItem(watchThis);
      }
      $scope.$watch(getValue, function(val) {
        if (val) {
          var newValue = $.parseJSON(val);
          applyFilter(filterBy, newValue, carGrid, dataSource);
        }
      });
    }
  }
})();
