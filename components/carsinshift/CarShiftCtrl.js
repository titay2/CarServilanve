(function() {
  "use strict";

  angular.module("app").controller("CarShiftCtrl", CarShiftCtrl);
  function CarShiftCtrl(translateService, $scope, loginService) {
    translateService.setLanguage();
    loginService.helloInitialize();

    var carsIWSdataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: root + "WorkshiftCarGroup/CarsInWorkshift",
          dataType: "json"
        }
      },
      pageSize: 20,
      schema: {
        model: {
          fields: {
            statusChange: { type: "date" },
            workShiftStart: { type: "date" },
            workShiftEnd: { type: "date" }
          }
        }
      },
      sort: { field: "vehicleNumber", dir: "asc" }
    });

    $("#carsShiftGrid").kendoGrid({
      dataSource: carsIWSdataSource,
      columns: [
        {
          field: "operatingCompanyID",
          hidden: true
        },
        {
          field: "carDispatchAttributes",
          hidden: true
        },
        {
          field: "postingID",
          hidden: true
        },
        { field: "vehicleNumber", title: "Car Number" },
        { field: "zoneNumber", title: "Zone Number" },
        { field: "zone", title: "Zone name" },
        { field: "status", title: "Status" },
        { field: "queueNumber", title: "Queue" },
        { field: "driverName", title: "Deivers name" },
        { field: "owner", title: "Owner" },
        { field: "group", title: "Group" },
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
        { field: "driver", title: "Driver" },
        {
          field: "statusChange",
          title: "Status Change",
          format: "{0: dd/MM/yyyy  h:mm}"
        },
        { field: "pager", title: "Pager" }
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
    clearFilter("#carsShiftGrid");

    //WATCH CHANGES ON THE LOCALSTORAGE FILTER VALUES AND PASS THE NEW VALUES TO TE FILTER FUNCTION
    function watchAndFilter(watchThis, filterBy) {
      var gridData = $("#carsShiftGrid").data("kendoGrid");
      function getValue() {
        return window.localStorage.getItem(watchThis);
      }

      $scope.$watch(getValue, function(val) {
        if (val) {
          var newValue = $.parseJSON(val);
          applyFilter(filterBy, newValue, gridData, carsIWSdataSource);
        }
      });
    }
  }
})();
