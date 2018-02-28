(function(){
    angular
    .module('app')
    .controller('GroupWorkShiftCtrl', GroupWorkShiftCtrl)

    GroupWorkShiftCtrl.$inject = ['apiService', 'translateService', '$scope', '$state', '$translate'];

    function GroupWorkShiftCtrl(apiService, translateService, $scope, $state, $translate) {

        translateService.setLanguage();

        $(document).ready(function () {


            var people = [{id: "1", startTime: "test", endtime: "test", groupname: "test", togroup: "test" }];
            $("#grid").kendoGrid({
                columns: [{field: "groupname", title: "Group Name"},
                          {field: "startdate", title: "Start Time"},
                          {field: "endtime", title: "End time"},
                          {field: "togroup", title: "To Group"}, 
                          { command: ["destroy"], title: "&nbsp;", width: "200px" }
                        ],
                        toolbar: [  {"name": "create"},
                          ],
                     
                dataSource: {
                    data: people
                    
                },
                scrollable:true,
                pageable: true,
                pageSize: 2,
                sortable: true                
             });
           

           

        });

    }
}())

