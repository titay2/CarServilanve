(function(){
    angular
    .module('app')
    .controller('GroupWorkShiftCtrl', GroupWorkShiftCtrl)

    GroupWorkShiftCtrl.$inject = ['apiService', 'translateService', '$scope', '$state', '$translate'];

    function GroupWorkShiftCtrl(apiService, translateService, $scope, $state, $translate) {
        translateService.setLanguage();
    
        let currentLang = $translate.use();
            var baseUrl = 'https://kendo.cdn.telerik.com/2018.1.221/js/messages/kendo.messages.';
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

            var group = [{id: "1", startTime: "test", endtime: "test", groupname: "test", togroup: "test" }];

            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        data: group
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
                    
                },
                batch: true,
                pageSize: 20,
                schema: {

                    model: {
                        id: "id",
                        fields: {
                            name: {
                                editable: false,
                                nullable: true
                            },
                            startTime: {
                                validation: {
                                    required: true
                                }
                            },
                            endTime: {
                                validation: {
                                    required: true
                                }
                            },
                            togroup: {
                                type: "date"
                            }

                        }
                    }
                }
            });

            
          var grid = $("#grid").kendoGrid({
                columns: [{field: "groupname", title: "Group Name"},
                          {field: "startdate", title: "Start Time"},
                          {field: "endtime", title: "End time"},
                          {field: "togroup", title: "To Group"}, 
                          { command: ["destroy"], title: "&nbsp;", width: "200px" }
                        ],
                        toolbar: [  {"name": "create"},
                          ],
                     
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

