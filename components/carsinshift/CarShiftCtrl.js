(function() {
  "use strict";

  angular.module("app").controller("CarShiftCtrl", CarShiftCtrl);
  function CarShiftCtrl(
    apiService,
    translateService,
    $scope,
    $state,
    $translate,
    loginService,
    filterService
  ) {
    translateService.setLanguage();
    loginService.helloInitialize();
    //filterService.watchAndFilter("callCenterId", "operatingCompanyId", "#grid");

    watchAndFilter("callCenterId", "operatingCompanyID");
    watchAndFilter("vehicleFilter", "vehicleNumber");
    watchAndFilter("areaFilter", "postingID");
    watchAndFilter("propertyFilter", "carDispatchAttributes");

    var dataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: root + "WorkshiftCarGroup/CarsInWorkshift",
          dataType: "json"
        }
      },
      pageSize: 10,
      schema: {
        model: {
          fields: {
            statusChange: { type: "date" },
            workShiftStart: { type: "date" },
            workShiftEnd: { type: "date" }
          }
        }
      },
      sort: { field: "vehicleNumber", dir: "desc" }
    });
    //DRAW THE KENDO TABLE WITH THE DEFINED DATASOURCE
    $("#grid").kendoGrid({
      dataSource: dataSource,
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
        { field: "driverId", title: "Driver ID" },
        { field: "zoneId", title: "Zone ID" },
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

      //scrollable: true,
      //detailInit: detailInit,
      filterable: true,
      resizable: true,
      sortable: true,
      pageable: true
    });

    $("#clearLable").click(function() {
      $state.reload("carsinshift");
      //$("#grid").data("kendoGrid").dataSource.filter({});
    });

    //WATCH CHANGES ON THE LOCALSTORAGE FILTER VALUES AND PASS THE NEW VALUES TO TE FILTER FUNCTION
    function watchAndFilter(watchThis, filterBy) {
      function getValue() {
        return window.localStorage.getItem(watchThis);
      }
      $scope.$watch(getValue, function(val) {
        if (val) {
          console.log(val);
          var newValue = $.parseJSON(val);
          applyFilter(filterBy, newValue);
        }
      });
    }
    //TAKE FILTER VALUES FROM LOCALSTORAGE AND MODIFIES THE DATASOURCE ACCORDINGLY
    function applyFilter(filterField, filterValue) {
      var gridData = $("#grid").data("kendoGrid");
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
