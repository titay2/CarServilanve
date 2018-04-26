(function() {
  angular.module("app").controller("GroupWorkShiftCtrl", GroupWorkShiftCtrl);
  function GroupWorkShiftCtrl(
    apiService,
    translateService,
    $scope,
    $state,
    $translate,
    loginService
  ) {
    let currentLang = $translate.use();
    var baseUrl =
      "https://kendo.cdn.telerik.com/2018.1.221/js/messages/kendo.messages.";

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
    // check the validations with pasi and the initial table data origion
    function createGrid() {
      dataSource = new kendo.data.DataSource({
        transport: {
          read: { url: root + "WorkshiftGroupCalendar" }
          // update: { url: root + "CarGroup" },
          // // destroy: { url: "#" },
          // // create: { url: "#" },
          // parameterMap: function(options, operation) {
          //   if (operation !== "read" && options.models) {
          //     return {
          //       models: kendo.stringify(options.models)
          //     };
          //   }
          // }
        },

        batch: true,
        pageSize: 10,
        schema: {
          model: {
            fields: {
              groupName: { type: "string" },
              startTime: { type: "date" },
              endTime: { type: "date" }
            }
          }
        }
      });
      var grid = $("#grid").kendoGrid({
        columns: [
          {
            field: "startTime",
            title: "Start Time",
            type: "date",
            format: "{0: dd/MM/yyyy h:mm}",
            editor: customDateTimePickerEditor
          },
          {
            field: "finishTime",
            title: "End time",
            type: "date",
            format: "{0: dd/MM/yyyy h:mm}",
            editor: customDateTimePickerEditor
          },
          {
            field: "groupName",
            title: "groupName",
            editor: groupNameDropDownEditor
            // template: "#=groupName#"
          },
          { field: "workShiftState", title: " To Group", hidden: true },
          { command: ["edit", "destroy"], title: "&nbsp;", width: "200px" }
        ],
        toolbar: ["create"],
        editable: "popup",
        dataSource: dataSource,
        scrollable: true,
        pageable: true,
        sortable: true
      });
      function customDateTimePickerEditor(container, options) {
        $('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoDateTimePicker({});
      }
      function groupNameDropDownEditor(container, options) {
        $('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoDropDownList({
            autoBind: false,
            dataTextField: "groupName",
            dataValueField: "groupID",
            dataSource: {
              // type: "json",
              transport: {
                read: { url: root + "WorkshiftCarGroup" }
              }
            }
          });
      }

      // grid.find(".k-grid-toolbar").on("click", ".k-pager-refresh", function(e) {
      //   e.preventDefault();
      //   grid.data("kendoGrid").dataSource.read();
      // });
    }
  }
})();
