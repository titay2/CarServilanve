(function() {
  "use strict";
  angular.module("app").controller("ChangeCarShiftCtrl", ChangeCarShiftCtrl);
  function ChangeCarShiftCtrl(
    translateService,
    $scope,
    $translate,
    loginService
  ) {
    let currentLang = $translate.use();
    var baseUrl =
      "https://kendo.cdn.telerik.com/2018.1.221/js/messages/kendo.messages.";
    //  var crudServiceBaseUrl = "http://semasp04.semel.ext/TestCarsurveillanceBackend/api/"

    translateService.setLanguage();
    loginService.helloInitialize();

    createGrid();
    $("#lang").on("change", function() {
      var valueSelected = this.value;
      currentLang = valueSelected;
      $.getScript(baseUrl + currentLang + ".min.js", function() {
        kendo.culture(currentLang);
        if ($("#changeShiftGrid").data("kendoGrid")) {
          $("#changeShiftGrid")
            .data("kendoGrid")
            .destroy();
          $("#changeShiftGrid").empty();
          createGrid();
        }
      });
    });
    clearFilter("#changeShiftGrid");

    function createGrid() {
      var ServiceBaseUrl = root + "TemporaryWorkShift",
        dataSource = new kendo.data.DataSource({
          transport: {
            read: {
              url: ServiceBaseUrl,
              dataType: "json"
              //  contentType: "application/json",
              // type: "GET"
            },
            create: {
              url: ServiceBaseUrl,
              dataType: "json",
              contentType: "application/json",
              type: "POST",
              complete: function(e) {
                $("#changeShiftGrid")
                  .data("kendoGrid")
                  .dataSource.read();
              }
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
              type: "DELETE",
              complete: function(e) {
                $("#changeShiftGrid")
                  .data("kendoGrid")
                  .dataSource.read();
              }
            },
            update: {
              url: ServiceBaseUrl + "/updateWorkShift",
              dataType: "json",
              contentType: "application/json",
              type: "PUT",
              complete: function(e) {
                $("#changeShiftGrid")
                  .data("kendoGrid")
                  .dataSource.read();
              }
            },
            requestEnd: function(e) {
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
                  return JSON.stringify(arr[0]);
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
                groupName: { type: "string" },
                operatingCompanyId: {
                  validation: { required: true }
                },
                starttime: {
                  type: "date",
                  validation: { required: true },
                  format: "{0: dd/MM/yyyy h:mm}"
                },
                finishtime: {
                  type: "date",
                  validation: { required: true }
                },
                workShiftState: {}
              }
            }
          }
        });
      dataSource.fetch();
      $("#numeric").kendoNumericTextBox({
        spinners: false,
        format: "#",
        decimals: 0
      });

      $("#changeShiftGrid").kendoGrid({
        dataSource: dataSource,
        toolbar: ["create"],
        pageable: true,
        sortable: true,
        filterable: true,
        edit: function(e) {
          if (e.model.isNew() == false) {
            $("input[name=operatingCompanyId]")
              .parent()
              .hide();
          }
        },
        columns: [
          { field: "ismanual", title: "ismanual", hidden: true },
          {
            field: "operatingCompanyId",
            title: "Call Center",
            hidden: true,
            // template:
            //   "#if(operatingCompanyId == 1001) #  Active # }else{#  Inactive  #}#"
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
      watchAndFilter("callCenterId", "operatingCompanyId");
      watchAndFilter("vehicleFilter", "carnumber");
      //WATCH CHANGES ON THE LOCALSTORAGE FILTER VALUES AND PASS THE NEW VALUES TO TE FILTER FUNCTION
      function watchAndFilter(watchThis, filterBy) {
        function getValue() {
          return window.localStorage.getItem(watchThis);
        }
        $scope.$watch(getValue, function(val) {
          var gridData = $("#changeShiftGrid").data("kendoGrid");
          if (val) {
            var newValue = $.parseJSON(val);
            applyFilter(filterBy, newValue, gridData, dataSource);
          }
        });
      }

      function ocDropDownEditor(container, options) {
        $('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoComboBox({
            autoBind: false,
            dataTextField: "name",
            dataValueField: "operatingCompanyId",
            dataSource: {
              dataType: "json",
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
