(function(){
    angular
    .module('app')
    .controller('ZoneCtrl', ZoneCtrl)

    ZoneCtrl.$inject = ['apiService', 'translateService', '$scope', '$state', '$translate', '$log'];

    function ZoneCtrl(apiService, translateService, $scope, $state, $translate, $log) {

        let currentLang = $translate.use();
        var baseUrl = 'https://kendo.cdn.telerik.com/2018.1.221/js/messages/kendo.messages.';

        translateService.setLanguage();

        
        
        function createGrid(){
            var group = [{id: "1", startTime: "test", endTime: "test", groupname: "test", togroup: "test" }];
            dataSource = new kendo.data.DataSource({
                transport: {
                 //   read: { url: "http://localhost:52273/api/WorkshiftCarGroup"},
                    
                    
                },
                batch: true,
                pageSize: 20,
                schema: {
                    
                }
            });            
             $("#grid").kendoGrid({
                columns:[],
               
                scrollable:true,
                pageable: true,
                pageSize: 2,
                sortable: true                
             });          
            

        }
    }
}())