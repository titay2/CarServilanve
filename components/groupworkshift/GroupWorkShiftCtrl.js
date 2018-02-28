(function(){
    angular
    .module('app')
    .controller('GroupWorkShiftCtrl', GroupWorkShiftCtrl)

    GroupWorkShiftCtrl.$inject = ['apiService', 'translateService', '$scope', '$state', '$translate'];

    function GroupWorkShiftCtrl(apiService, translateService, $scope, $state, $translate) {

       

        createGrid();


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

            
            $("#grid").kendoGrid({
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
           


        }

        $(document).ready(function () {

            translateService.setLanguage();
            var baseUrl = 'https://kendo.cdn.telerik.com/2018.1.221/js/messages/kendo.messages.';
            $("#lang").on('change', function (e) {
             var optionSelected = $("option:selected", this);
             var valueSelected = this.value;
              
               $.getScript(baseUrl + valueSelected + ".min.js", function () {
          
                  createGrid();
               
               });
                  
            });
                 
             });
           

           



    }
}())

