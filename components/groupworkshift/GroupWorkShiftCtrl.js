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
        transport: {
          read: {
            url: root + "WorkshiftGroupCalendar",
            dataType: "json",
            contentType: "application/json",
            type: "GET"
          },
          update: {
            url: function(e) {
              var options = e.models;
              var leng = options.length;
              var thisrow = options[leng - 1];
              console.lod(options);
              console.lod(leng);
              console.lod(thisrow);
            }
            // url: root + "WorkshiftGroupCalendar/changeWorkshift",
            // dataType: "json",
            // contentType: "application/json",
            // type: "PUT"
          },
          destroy: {
            url: root + "WorkshiftGroupCalendar/delete",
            dataType: "json",
            contentType: "application/json",
            type: "DELETE",
            complete: function(e) {
              $("#grid")
                .data("kendoGrid")
                .dataSource.read();
            }
          },
          create: {
            url: root + "WorkshiftGroupCalendar",
            dataType: "json",
            contentType: "application/json",
            type: "POST",
            complete: function(e) {
              $("#grid")
                .data("kendoGrid")
                .dataSource.read();
            }
          },
          parameterMap: function(options, operation) {
            if (operation !== "read" && options) {
              var arr = options.models;
              var len = options.models.length;
              var curr = options.models[len - 1];

              console.log(len);
              console.log(JSON.stringify(arr));
              return JSON.stringify(arr[0]);
            }
          }
        },
        batch: true,
        pageSize: 10,
        schema: {
          model: {
            id: "grouptechId",
            fields: {
              grouptechId: { type: "number", editable: false },
              groupName: { type: "string" },
              templateName: { type: "string" },
              workShifRestrictions: { type: "string" },
              startTime: { type: "date" },
              finishTime: { type: "date" },
              workShiftState: { type: "number" }
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
          { field: "grouptechId", title: "grouptechId" },
          { field: "workShiftState", title: "Workshift level" },
          { command: ["edit", "destroy"], title: "&nbsp;", width: "200px" }
        ],
        toolbar: ["create"],
        editable: "inline",
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

      // grid.find(".k-grid-toolbar").on("click", ".k-pager-refresh", function(e) {
      //   e.preventDefault();
      //   grid.data("kendoGrid").dataSource.read();
      // });
    }
  }
})();
