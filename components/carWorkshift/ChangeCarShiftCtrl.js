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
              url: ServiceBaseUrl + "/delete",
              dataType: "number",
              contentType: "application/json",
              type: "DELETE"
            },
            update: {
              url: ServiceBaseUrl + "/updateWorkShift",
              dataType: "json",
              contentType: "application/json",
              type: "PUT"
            },
            // {
            // $scope.delete = (id) => {
            //   console.log(id);
            //   apiService.get('category/remove?id=' + id)
            //     .then((id) => {
            //       $state.reload();
            //     })
            //     .catch((err) => {
            //       console.log(err);
            //     });
            // };

            // },
            error: function(e) {
              console.log("Errors: " + e.errors);
            },
            // update: { url: "#" },
            // destroy: { url: "#" },
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
                  // console.log(arr);
                  return kendo.stringify(arr[0]);
                  break;
                case "destroy":
                  var len = options.models.length;
                  var curr = options.models[len - 1];
                  var id = curr.workshiftId;
                  console.log(kendo.parseInt(id));
                  return kendo.parseInt(id);
                  break;
              }
            }
          },
          //     if (operation !== "read" && options.models) {
          //       var arr = options.models;
          //       console.log(JSON.stringify(arr[0]));
          //       return kendo.stringify(arr[0]);
          //     }
          //   }
          // },
          batch: true,
          //pageSize: 10,
          schema: {
            model: {
              //id: "workshiftId",
              fields: {
                ismanual: { type: "number", defaultValue: 1, editable: false },
                carnumber: { type: "number" },
                groupName: { type: "string" },
                operatingCompanyId: { type: "number" },
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
                workShiftState: { type: "number" }
              }
            }
          }
        });

      var grid = $("#grid").kendoGrid({
        dataSource: dataSource,
        // toolbar: kendo.template($("#template").html()),
        toolbar: ["create"],

        pageable: true,
        sortable: true,
        columns: [
          { field: "ismanual", title: "ismanual", hidden: true },
          { field: "carnumber", title: "Vehicle" },
          {
            field: "operatingCompanyId",
            title: "Call Center",
            hidden: true,
            editor: ocDropDownEditor
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

          { field: "groupName", title: "comment" },

          { field: "workShiftState", title: "Workshift State" },

          { command: ["edit", "destroy"] }
        ],
        editable: "popup"
        // edit: function(e) {
        //   if (e.model.isNew() == false) {
        //     $('[name="carnumber"]').attr("readonly", true);
        //   }
        // }
      });
      function ocDropDownEditor(container, options) {
        $('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoDropDownList({
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
      function customDateTimePickerEditor(container, options) {
        $('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoDateTimePicker({});
      }
    }
  }
})();
