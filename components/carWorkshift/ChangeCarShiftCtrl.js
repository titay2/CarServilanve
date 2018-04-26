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
      });
    });

    function createGrid() {
      var ServiceBaseUrl = root + "TemporaryWorkShift",
        dataSource = new kendo.data.DataSource({
          transport: {
            read: {
              url: ServiceBaseUrl,
              dataType: "json"
            }
            // update: { url: "#" },
            // destroy: { url: "#" },
            // create: { url: "#" },
            // parameterMap: function(options, operation) {
            //   if (operation !== "read" && options.models) {
            //     return {
            //       models: kendo.stringify(options.models)
            //     };
            //   }
            // }
          },
          batch: true,
          //pageSize: 10,
          schema: {
            model: {
              id: "carnumber",
              fields: {
                carnumber: {},
                groupName: {},
                starttime: {
                  type: "date",
                  editable: true,
                  validation: { required: true }
                },
                finishtime: {
                  type: "date",
                  editable: true,
                  validation: { required: true }
                },
                workShiftState: { type: "boolean" }
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
          { field: "carnumber", title: "Vehicle" },
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
          { field: "groupName", title: "Group Name/comment" },
          { field: "workShiftState", title: "Workshift State", hidden: true },

          { command: ["edit", "destroy"] }
        ],
        editable: "popup",
        edit: function(e) {
          if (e.model.isNew() == false) {
            $('[name="carnumber"]').attr("readonly", true);
          }
        }
      });

      function customDateTimePickerEditor(container, options) {
        $('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoDateTimePicker({});
      }
    }
  }
})();
