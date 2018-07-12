(function() {
  angular.module("app").controller("GroupWorkShiftCtrl", GroupWorkShiftCtrl);
  function GroupWorkShiftCtrl(
    translateService,
    $scope,
    $translate,
    loginService
  ) {
    var currentLang = $translate.use();
    var baseUrl =
      "https://kendo.cdn.telerik.com/2018.1.221/js/messages/kendo.messages.";
    translateService.setLanguage();
    loginService.helloInitialize();
    createGrid();

    $("#lang").on("change", function() {
      var valueSelected = this.value;
      currentLang = valueSelected;
      $.getScript(baseUrl + currentLang + ".min.js", function() {
        kendo.culture(currentLang);
        if ($("#groupWorkhiftGrid").data("kendoGrid")) {
          $("#groupWorkhiftGrid")
            .data("kendoGrid")
            .destroy();
          $("#groupWorkhiftGrid").empty();
          createGrid();
        }
      });
    });
    clearFilter("#groupWorkhiftGrid");

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
            url: root + "WorkshiftGroupCalendar/changeWorkshift",
            dataType: "json",
            contentType: "application/json",
            type: "PUT",
            complete: function(e) {
              $("#groupWorkhiftGrid")
                .data("kendoGrid")
                .dataSource.read();
            }
          },
          destroy: {
            url: function(e) {
              var options = e.models;
              var leng = options.length;
              var thisrow = options[leng - 1];
              var id = thisrow.workshiftGroupCalendarId;
              return (
                root +
                "WorkshiftGroupCalendar/delete?workshiftGroupCal_Id=" +
                id
              );
            },
            dataType: "json",
            contentType: "application/json",
            type: "DELETE",
            complete: function(e) {
              $("#groupWorkhiftGrid")
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
              $("#groupWorkhiftGrid")
                .data("kendoGrid")
                .dataSource.read();
            }
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
        pageSize: 10,
        schema: {
          model: {
            id: "workshiftGroupCalendarId",
            fields: {
              workshiftGroupCalendarId: { type: "number", editable: false },
              groupName: { type: "string" },
              templateName: { type: "string" },
              workShifRestrictions: { type: "string" },
              startTime: { type: "date" },
              finishTime: { type: "date" },
              workShiftState: { type: "number" },
              operatingCompanyId: { type: "number" },
              workShiftGroupId: { type: "number" }
            }
          }
        }
      });
      $("#groupWorkhiftGrid").kendoGrid({
        columns: [
          {
            field: "operatingCompanyId",
            title: "Call Center",
            // hidden: true,
            editor: ocDropDownEditor
          },
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
          },
          { field: "workShiftState", title: "Workshift level" },
          { command: ["edit", "destroy"], title: "&nbsp;", width: "200px" }
        ],
        toolbar: ["create"],
        editable: "popup",
        dataSource: dataSource1,
        scrollable: true,
        pageable: true,
        sortable: true,
        edit: function(e) {
          if (e.model.isNew() == false) {
            $("input[name=operatingCompanyId]")
              .parent()
              .hide();
          }
        }
      });
      watchAndFilter("callCenterId", "operatingCompanyId");
      //WATCH CHANGES ON THE LOCALSTORAGE FILTER VALUES AND PASS THE NEW VALUES TO TE FILTER FUNCTION
      function watchAndFilter(watchThis, filterBy) {
        function getValue() {
          return window.localStorage.getItem(watchThis);
        }
        $scope.$watch(getValue, function(val) {
          var gridData = $("#groupWorkhiftGrid").data("kendoGrid");
          if (val) {
            var newValue = $.parseJSON(val);
            applyFilter(filterBy, newValue, gridData, dataSource1);
          }
        });
      }
      function customDateTimePickerEditor(container, options) {
        $('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoDateTimePicker({});
      }
      function ocDropDownEditor(container, options) {
        $('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoDropDownList({
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
          // .kendoComboBox({
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
    }
  }
})();
