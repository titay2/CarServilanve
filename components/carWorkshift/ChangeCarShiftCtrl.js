(function() {
  "use strict";
  angular.module("app").controller("ChangeCarShiftCtrl", ChangeCarShiftCtrl);
  ChangeCarShiftCtrl.$inject = [
    "apiService",
    "translateService",
    "$scope",
    "$state",
    "$log",
    "$translate",
    "loginService"
  ];

  function ChangeCarShiftCtrl(
    apiService,
    translateService,
    $scope,
    $state,
    $log,
    $translate,
    loginService
  ) {
    let currentLang = $translate.use();
    var baseUrl =
      "https://kendo.cdn.telerik.com/2018.1.221/js/messages/kendo.messages.";
    //  var crudServiceBaseUrl = "http://semasp04.semel.ext/TestCarsurveillanceBackend/api/"
    // $("#Grid").data("kendoGrid").dataSource.read();
    // $("#Grid").data("kendoGrid").refresh();

    translateService.setLanguage();
    loginService.helloInitialize();
    $.getScript(baseUrl + currentLang + ".min.js", function() {
      kendo.culture(currentLang);
      createGrid();
    });

    $("#lang").on("change", function(e) {
      var optionSelected = $("option:selected", this);
      var valueSelected = this.value;
      currentLang = valueSelected;
      $.getScript(baseUrl + currentLang + ".min.js", function() {
        kendo.culture(currentLang);
        createGrid();
        $state.reload();
      });
    });

    function createGrid() {
      var ServiceBaseUrl = root + "TemporaryWorkShift",
        dataSource = new kendo.data.DataSource({
          transport: {
            read: {
              url: ServiceBaseUrl,
              dataType: "json",
              contentType: "application/json",
              type: "GET"
            },
            create: {
              url: ServiceBaseUrl,
              dataType: "json",
              contentType: "application/json",
              type: "POST"
            },
            destroy: {
              url: function(e) {
                var options = e.models;
                var leng = options.length;
                var thisrow = options[leng - 1];
                var id = thisrow.workshiftId;
                return ServiceBaseUrl + "/delete?WorkshiftId=" + id;
              },
              dataType: "json",
              contentType: "application/json",
              type: "DELETE"
            },
            update: {
              url: ServiceBaseUrl + "/updateWorkShift",
              dataType: "json",
              contentType: "application/json",
              type: "PUT"
            },
            requestEnd: function(e) {
              console.log(e);
              if (e.type === "create" && e.response) {
                console.log("Current request is 'create'.");
              }
            },
            error: function(e) {
              console.log("Errors: " + e.errors);
            },
            parameterMap: function(options, operation) {
              var arr = options.models;
              switch (operation) {
                case "read":
                  return kendo.stringify(options);
                  break;

                case "create":
                  return kendo.stringify(arr[0]);
                  break;
                case "update":
                  console.log(JSON.stringify(arr[0]));
                  return JSON.stringify(arr[0]);
                  break;
                case "destroy":
                  var len = options.models.length;
                  var curr = options.models[len - 1];
                  var id = curr.workshiftId;
                  return parseInt(id);
                  break;
              }
            }
          },
          batch: true,
          //pageSize: 10,
          schema: {
            model: {
              id: "workshiftId",
              fields: {
                workshiftId: { type: "number", editable: false },
                ismanual: { type: "number", defaultValue: 1, editable: false },
                //  carnumber: {},
                groupName: { type: "string" },
                operatingCompanyID: { validation: { required: true } },
                starttime: {
                  type: "date",
                  editable: true,
                  validation: { required: true },
                  format: "{0: dd/MM/yyyy h:mm}"
                },
                finishtime: {
                  type: "date",
                  editable: true,
                  validation: { required: true }
                },
                workShiftState: {}
              }
            }
          }
        });
      dataSource.bind("requestEnd", dataSource_requestEnd);
      dataSource.fetch();
      $("#numeric").kendoNumericTextBox({
        spinners: false,
        format: "#",
        decimals: 0
      });

      watchAndFilter("callCenterId", "operatingCompanyID");
      $("#grid").kendoGrid({
        dataSource: dataSource,
        toolbar: ["create"],
        pageable: true,
        sortable: true,
        filterable: true,
        columns: [
          { field: "ismanual", title: "ismanual", hidden: true },
          {
            field: "operatingCompanyID",
            title: "Call Center",
            //hidden: true,
            editor: ocDropDownEditor
          },
          {
            field: "carnumber",
            title: "Vehicle"
            // spinners: false,
            // format: "#",
            // decimals: 0
            //format: "{0:n0}"
          },

          {
            field: "starttime",
            title: "Start Time",
            format: "{0: dd/MM/yyyy h:mm}",
            editor: customDateTimePickerEditor
          },
          {
            field: "finishtime",
            title: "Finish Time",
            format: "{0: dd/MM/yyyy h:mm}",
            editor: customDateTimePickerEditor
          },

          {
            field: "groupName",
            title: "comment",
            editor: groupNameDropDownEditor
          },

          { field: "workShiftState", title: "Workshift State" },

          { command: ["edit", "destroy"] }
        ],
        editable: "popup"
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

        // var getPrpperty = parseInt (filterValue)

        // if(filterValue )

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
      function dataSource_requestEnd(e) {
        if (e.type == "create") {
          dataSource.read();
        }
      }

      function ocDropDownEditor(container, options) {
        $('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoComboBox({
            autoBind: false,
            dataTextField: "name",
            dataValueField: "operatingCompanyId",
            dataSource: {
              type: "json",
              transport: {
                read: { url: root + "OperatingCompanies" }
              }
            }
          });
      }
      function groupNameDropDownEditor(container, options) {
        $('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoComboBox({
            autoBind: false,
            dataTextField: "groupName",
            dataValueField: "groupName",
            dataSource: {
              // type: "json",
              transport: {
                read: { url: root + "WorkshiftCarGroup" }
              }
            }
          });
      }
      function customDateTimePickerEditor(container, options) {
        $('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoDateTimePicker({});
      }
    }
  }
})();
