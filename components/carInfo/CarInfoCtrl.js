(function() {
  "use strict";

  angular.module("app").controller("CarInfoCtrl", CarInfoCtrl);
  function CarInfoCtrl(
    apiService,
    translateService,
    $scope,
    $state,
    $translate,
    loginService,
    filterService,
    kendoDataSourceService
  ) {
    translateService.setLanguage();
    loginService.helloInitialize();

    var dataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: root + "Cars/CarsDetails",
          data: { format: "json" },
          dataType: "json"
        }
      },
      pageSize: 25,
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
    var carDs = kendoDataSourceService.getCarDataSourse;

    $("#grid").kendoGrid({
      dataSource: dataSource,
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
          // hidden: true
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
    // $("#grid").kendoDraggable({
    //   filter: ".driverCardNr",
    //   dragstart: function(e) {
    //     var draggedElement = e.currentTarget.closest("tr"), //get the DOM element that is being dragged
    //       dataItem = dataSource.getByUid(draggedElement.data("uid")); //get corresponding dataItem from the DataSource instance
    //     console.log(dataItem.carId);
    //   },
    //   hint: function(element) {
    //     return element.clone().css({
    //       // "opacity": 0.6,
    //       // "background-color": "#0cf"
    //     });
    //   }
    // });
    // $("#grid").kendoDropTargetArea({
    //   filter: ".taxiCarCompanyId, .taxiCarCompanyId2",
    //   drop: onDrop
    // });

    // function onDrop(e) {
    //   var draggedElement = e.dropTarget.closest("tr"), //get the DOM element that is being dragged
    //     dataItem = dataSource.getByUid(draggedElement.data("uid"));
    //   var row = $(this).closest("tr"); //get corresponding dataItem from the DataSource instance
    //   var colIdx = e.dropTarget.index();
    //   var colName = $("#grid")
    //     .find("th")
    //     .eq(colIdx)
    //     .text();

    //   console.log(colName);
    //   console.log(dataItem);
    // }

    $("#clearLable").click(function() {
      //$state.reload("carInfo");
      $("#grid")
        .data("kendoGrid")
        .dataSource.filter({});
    });

    //WATCH CHANGES ON THE LOCALSTORAGE FILTER VALUES AND PASS THE NEW VALUES TO TE FILTER FUNCTION
    function watchAndFilter(watchThis, filterBy) {
      function getValue() {
        return window.localStorage.getItem(watchThis);
      }
      $scope.$watch(getValue, function(val) {
        if (val) {
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

      if (filterValue != 0) {
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
