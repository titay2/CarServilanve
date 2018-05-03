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
    var currentLang = $translate.use();
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
        $state.reload();
      });
    });
    // check the validations with pasi and the initial table data origion
    function createGrid() {
      //needs Id field
      dataSource1 = new kendo.data.DataSource({
        // transport: {
        //   read: {
        //     url: root + "WorkshiftGroupCalendar",
        //     dataType: "json",
        //     contentType: "application/json",
        //     type: "GET"
        //   },
        //   update: {
        //     url: root + "WorkshiftGroupCalendar/changeWorkshift",
        //     dataType: "json",
        //     contentType: "application/json",
        //     type: "PUT"
        //   },
        //   destroy: {
        //     url: root + "WorkshiftGroupCalendar/delete",
        //     dataType: "json",
        //     contentType: "application/json",
        //     type: "DELETE"
        //   },
        //   create: {
        //     url: root + "WorkshiftGroupCalendar",
        //     dataType: "json",
        //     contentType: "application/json",
        //     type: "POST"
        //   },
        //   parameterMap: function(options, operation) {
        //     if (operation !== "read" && options) {
        //       var arr = options.models;
        //       console.log(kendo.stringify(arr[0]));
        //       console.log(JSON.stringify(arr[0]));
        //       return JSON.stringify(arr[0]);
        //     }
        //   }
        // },
        // batch: true,
        // pageSize: 10,
        // schema: {
        //   model: {
        //     // id: "groupName",
        //     fields: {
        //       groupName: { type: "string" },
        //       startTime: { type: "date" },
        //       finishTime: { type: "date" }
        //     }
        //   }
        // }
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
          { field: "workShiftState", title: " To Group" },
          { command: ["edit", "destroy"], title: "&nbsp;", width: "200px" }
        ],
        toolbar: ["create"],
        editable: "popup",
        dataSource: dataSource1,
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
            dataValueField: "groupName",
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
