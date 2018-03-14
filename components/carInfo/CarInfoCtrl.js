(function() {
	//'use strict';
 
	angular
		.module('app')
 		.controller('CarInfoCtrl', CarInfoCtrl)

		 CarInfoCtrl.$inject = ['apiService', 'translateService', '$scope', '$state', '$translate'];

 		function CarInfoCtrl(apiService, translateService, $scope, $state, $translate) {
			translateService.setLanguage();
            
               watchAndFilter('callCenterId',"operatingCompanyId" )
     
            var dataSource = new kendo.data.DataSource({
               
                transport:{
                    read:{
                        url:"http://localhost:52273/api/Cars",
                        data:{ format: "json"},
                        dataType: "json",
                    }
                },
                schema: {
                    model: {						
                        fields: {
                            // carId: {type: "number"},				  			
                            // systemId: {type: "number"},				  			
                            // carNumber: {type: "number"},				  			
                            // carRegisterNr: {type: "number"},				  			
                            // carPhoneNr: {type: "number"},				  			
                            // passengerCapacity: {type: "number"},				  			
                            // carBrandAndModel: {type: "text"},				  			
                            // carDispatchAttributes: {type: "text"},				  			
                            // operatingCompanyId: {type: "number"},				  			
                            // postingId: {type: "number"},				  			
                            // taxiCarCompanyId: {type: "number"},				  			
                            // driverCardNr: {type: "number"},				  			
                            // paymentTerminalId: {type: "number"},				  			
                            // notes: {type: "text"},				  			
                            // ownerName: {type: "text"},				  			
                            // carPagerPhone: {type: "number"},				  			
                            // bookingSendType: {type: "text"},				  			
                            // carBookingType: {type: "text"},				  			
                            // carBookingAttribute: {type: "text"},				  			
                            // isStationDevice: {type: "text"},				  			
                            // carType: {type: "text"},				  			
                            // vatRegNr: {type: "number"},				  			
                            // vatRegNr: {type: "number"},		  			
                            // tripDataSendTarget: {type: "text"},				  			
                            // ttdataSendTarget: {type: "text"},				  			
                            startSuspend: {type: "date"},				  			
                            finishSuspend: {type: "date"},				  			
                            // carEmailAddr: {type: "text"},				  			
                            // pagerActive: {type: "text"},				  			
                            // pagerActive: {type: "text"},				  			
                            // passengerRating: {type: "text"},				  			
                            // carPaymentDeviceType: {type: "text"},				  			
                            // editUserName: {type: "text"},				  			
                            editTime: {type: "date"},				  			
                            // operatingCompany: {type: "text"},				  			
                            // posting: {type: "text"},				  			
                            // taxiCarCompany: {type: "text"},				  			
                            // tblCarBelongsToWorkShiftGroup: {type: "text"},				  			
                        }
                    }
                },
            });
            //DRAW THE KENDO TABLE WITH THE DEFINED DATASOURCE
            $("#grid").kendoGrid({
                dataSource:dataSource,
                columns:[	
                      { field: "carId", title: "Car"}, 
                      { field: "driverCardNr", title: "*Driver ID"}, 
                      { field: "systemId", title: "*Zone ID"}, 
                      { field: "taxiCarCompanyId", title: "*TXM Status"}, 
                      { field: "operatingCompanyId", title: "*Dispatch Status"}, 
                      { field: "carDispatchAttributes", title: "*Dispatch Status"}, 
                      { field: "editTime", title: "*SFH time",format:"{0: dd/MM/yyyy}"}, 
                      { field: "posting", title: "*SFH Zone"}, 
                      { field: "editTime", title: "*changed Status",format:"{0: dd/MM/yyyy}"}, 
                      { field: "editTime", title: "*Last Update", format:"{0: dd/MM/yyyy}"}, 
                      { field: "editTime", title: "*Workshift Start", format:"{0: dd/MM/yyyy }"}, 
                      { field: "creationdate", title: "Workshift end", format:"{0: dd/MM/yyyy }"},
                    ],
            
                scrollable: true,
                detailInit: detailInit,
                resizable: true,
                sortable:true
            });

            $("#clearLable").click(function () {    
                $state.reload('carInfo');
                //$("#grid").data("kendoGrid").dataSource.filter({});
            }) 

            //WATCH CHANGES ON THE LOCALSTORAGE FILTER VALUES AND PASS THE NEW VALUES TO TE FILTER FUNCTION
            function watchAndFilter(watchThis,filterBy ){
                function getValue(){
                    return window.localStorage.getItem(watchThis);
                }
                $scope.$watch(getValue, function(val){
                    if (val ){
              
                   var newValue   = ($.parseJSON(val))
                      applyFilter(filterBy, newValue)
                   
                    }
                });
            }
            //TAKE FILTER VALUES FROM LOCALSTORAGE AND MODIFIES THE DATASOURCE ACCORDINGLY 
            function applyFilter(filterField, filterValue) {    
                var gridData = $("#grid").data("kendoGrid");
                var currFilterObj = gridData.dataSource.filter();
                var currentFilters = currFilterObj ? currFilterObj.filters : []
              
                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }
        
                if (filterValue != "0") {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue
                    });
                }
             
                dataSource.filter({
                    logic: "and",
                    filters: currentFilters,
                })
            }
            //DETAIL FOR THE TABLE MASTER DATA
            function detailInit(e) {
                $("<div/>").appendTo(e.detailCell).kendoGrid({
                    dataSource: {
                        transport: {
                            read:{
                                url:"http://localhost:52273/api/Cars/"+ e.data.carId ,
                                data:{ format: "json"},
                                dataType: "json",
                            }
                        },
                        schema: {
                            model: {                        
                                fields: {
                                    carId: {type: "number"},				  			
                                    systemId: {type: "number"},				  			                               				  			
                                    taxiCarCompanyId: {type: "number"},				  			
                                    driverCardNr: {type: "number"},				  			                               			  			
                                }
                            }
                        }
                       
                    },
                    scrollable: false,
                    sortable: true,
                    pageable: false,          
                    columns: [
                        { field: "carId", title: "Car"}, 
                        { field: "driverCardNr", title: "*Driver ID"}, 
                        { field: "systemId", title: "*Zone ID"}, 
                        { field: "taxiCarCompanyId", title: "*TXM Status"} 
                    ]
                });
            }
        }
}());