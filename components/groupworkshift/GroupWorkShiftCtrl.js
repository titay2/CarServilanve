(function() {
  angular.module("app").controller("GroupWorkShiftCtrl", GroupWorkShiftCtrl);

  GroupWorkShiftCtrl.$inject = [
    "apiService",
    "translateService",
    "$scope",
    "$state",
    "$translate",
    "loginService"
  ];

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
        // transport: {
        //   read: { url: root + "WorkshiftCarGroup" },
        //   update: { url: root + "WorkshiftCarGroup" },
        //   destroy: { url: "#" },
        //   create: { url: "#" },
        //   parameterMap: function(options, operation) {
        //     if (operation !== "read" && options.models) {
        //       return {
        //         models: kendo.stringify(options.models)
        //       };
        //     }
        //   }
        // },

        batch: true,
        pageSize: 20,
        schema: {
          model: {
            fields: {
              groupName: { validation: { required: true } },
              startTime: { type: "date" },
              endTime: { type: "date" }
            }
          }
        }
      });
      var grid = $("#grid").kendoGrid({
        columns: [
          {
            field: "startdate",
            title: "Start Time",
            type: "date",
            format: "{0: dd/MM/yyyy h:mm}",
            editor: customDateTimePickerEditor
          },
          {
            field: "endtime",
            title: "End time",
            type: "date",
            format: "{0: dd/MM/yyyy h:mm}",
            editor: customDateTimePickerEditor
          },
          {
            field: "groupName",
            title: "groupName",
            editor: groupNameDropDownEditor
          },
          { field: "togroup", title: " To Group" },
          { command: ["edit", "destroy"], title: "&nbsp;", width: "200px" }
        ],
        toolbar: ["create"],
        editable: "inline",
        dataSource: dataSource,
        scrollable: true,
        pageable: true,
        pageSize: 2,
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
            dataValueField: "groupName",
            dataSource: {
              type: "json",
              transport: {
                read: root + "WorkshiftCarGroup"
              }
            }
          });
      }

      grid.find(".k-grid-toolbar").on("click", ".k-pager-refresh", function(e) {
        e.preventDefault();
        grid.data("kendoGrid").dataSource.read();
      });
    }
  }
})();
