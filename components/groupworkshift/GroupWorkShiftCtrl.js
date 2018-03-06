(function(){
    angular
    .module('app')
    .controller('GroupWorkShiftCtrl', GroupWorkShiftCtrl)

    GroupWorkShiftCtrl.$inject = ['apiService', 'translateService', '$scope', '$state', '$translate', '$log'];

    function GroupWorkShiftCtrl(apiService, translateService, $scope, $state, $translate, $log) {

        let currentLang = $translate.use();
        var baseUrl = 'https://kendo.cdn.telerik.com/2018.1.221/js/messages/kendo.messages.';

        translateService.setLanguage();

        $.getScript(baseUrl + currentLang + ".min.js", function () {
            kendo.culture(currentLang)
            createGrid();
        });
           
        $("#lang").on('change', function (e) {
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;
            currentLang = valueSelected
            $.getScript(baseUrl + currentLang + ".min.js", function () {
               kendo.culture(currentLang)
              createGrid();
            });
                  
        });  
        
        function createGrid(){
            var group = [{id: "1", startTime: "test", endTime: "test", groupname: "test", togroup: "test" }];
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: { url: "http://localhost:52273/api/WorkshiftCarGroup"},
                    update: { url: "#"},
                    destroy: { url: "#"},
                    create: { url: "#"},
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
                        fields: { groupname: { editable: false, nullable: true },
                            startTime: { validation: { required: true} },
                            endTime: { validation: { required: true }},
                            togroup: { type: "date"}
                        }
                    }
                }
            });            
            var grid = $("#grid").kendoGrid({
                columns:[{field: "groupname", title: "Group Name"},
                          {field: "startdate", title: "Start Time"},
                          {field: "endtime", title: "End time"},
                          {field: "togroup", title: "To Group"}, 
                          { command: ["destroy"], title: "&nbsp;", width: "200px" }
                        ],
                        toolbar: ["create"],                     
                dataSource: dataSource,
                scrollable:true,
                pageable: true,
                pageSize: 2,
                sortable: true                
             });          
             grid.find(".k-grid-toolbar").on("click", ".k-pager-refresh", function(e) {
                e.preventDefault();
                grid.data("kendoGrid").dataSource.read();
            });

        }
    }
}())

