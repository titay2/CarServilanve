(function() {
  'use strict';
  angular
      .module('app')
      .controller('ChangeCarShiftCtrl', ChangeCarShiftCtrl)

  ChangeCarShiftCtrl.$inject = ['apiService', 'translateService', '$scope', '$state', '$log', '$translate'];

  function ChangeCarShiftCtrl(apiService, translateService, $scope, $state, $log, $translate) {

    $(document).ready(function() {
        translateService.setLanguage();

          var crudServiceBaseUrl = "http://localhost:52273/api/StandardTextMessages",
              dataSource = new kendo.data.DataSource({
                  transport: {
                      read: {
                          url: crudServiceBaseUrl
                              //dataType: "json"
                      },
                      update: {
                          url: "#",
                          //dataType: "jsonp"
                      },
                      destroy: {
                          url: "#",
                          //dataType: "jsonp"
                      },
                      create: {
                          url: "#",
                          //dataType: "jsonp"
                      },
                      parameterMap: function(options, operation) {
                          if (operation !== "read" && options.models) {
                              return {
                                  models: kendo.stringify(options.models)
                              };
                          }
                      }
                  },
                  batch: true,
                  pageSize: 20,
                  schema: {

                      model: {
                          id: "id",
                          fields: {
                              id: {
                                  editable: false,
                                  nullable: true
                              },
                              text: {
                                  validation: {
                                      required: true
                                  }
                              },
                              creationdate: {
                                  type: "date"
                              },
                              printMessage:{
                                  type:"boolean"
                              }

                          }
                      }
                  }
              });



              

          var grid = $("#grid").kendoGrid({
              dataSource: dataSource,
              toolbar: kendo.template($("#template").html()),
              pageable: true,
              // height: 550,
              sortable: true,
              //toolbar: ["create"],
              columns: [
                {
                  field: "id",
                  title: "ID",
                  width: 60
              }, {
                  field: "text",
                  title: "Text",
                  width: 600
              }, {
                  field: "creationdate",
                  title: "Date",
                  width: 200,
                  editor: customDateTimePickerEditor
              }, {
                  command: ["edit", "destroy"],
                  title: "&nbsp;",
                  width: "200px"
              }],
              editable: "inline"
          });
          var dropDown = grid.find("#category").kendoDropDownList({
              dataTextField: "name",
              dataValueField: "operatingCompanyId",
              autoBind: false,
              optionLabel: "All",
              dataSource: {
                  // type: "json",
                  severFiltering: true,
                  transport: {
                      read: "http://localhost:52273/api/OperatingCompanies"
                  }
              },
              change: function() {
                  var value = this.value();
                  if (value) {
                      grid.data("kendoGrid").dataSource.filter({
                          field: "operatingCompanyId",
                          operator: "eq",
                          value: parseInt(value)
                      });
                  } else {
                      grid.data("kendoGrid").dataSource.filter({});
                  }
              }
          });

          grid.find(".k-grid-toolbar").on("click", ".k-pager-refresh", function(e) {
              e.preventDefault();
              grid.data("kendoGrid").dataSource.read();
          });

          function customDateTimePickerEditor(container, options) {
              $('<input required name="' + options.field + '"/>')
                  .appendTo(container)
                  .kendoDateTimePicker({});
          }

        });
    
         

     // });

  }

}());