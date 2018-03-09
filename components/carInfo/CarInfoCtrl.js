(function() {
	'use strict';
 
	angular
		.module('app')
 		.controller('CarInfoCtrl', CarInfoCtrl)

		 CarInfoCtrl.$inject = ['apiService', '$scope', '$state'];

 		function CarInfoCtrl(apiService, $scope, $state) {
           
            $(document).ready(function() {
                $("#inputCenter").on('input', function() {
                var opt = $('option[value="' + $(this).val() + '"]');
                var val = opt.attr('id');
                
                applyFilter("operatingCompanyId",val);
            })

            })

        var    dataSource = new kendo.data.DataSource({
               
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
                            carId: {type: "number"},				  			
                            systemId: {type: "number"},				  			
                            carNumber: {type: "number"},				  			
                            carRegisterNr: {type: "number"},				  			
                            carPhoneNr: {type: "number"},				  			
                            passengerCapacity: {type: "number"},				  			
                            carBrandAndModel: {type: "text"},				  			
                            carDispatchAttributes: {type: "text"},				  			
                            operatingCompanyId: {type: "number"},				  			
                            postingId: {type: "number"},				  			
                            taxiCarCompanyId: {type: "number"},				  			
                            driverCardNr: {type: "number"},				  			
                            paymentTerminalId: {type: "number"},				  			
                            notes: {type: "text"},				  			
                            ownerName: {type: "text"},				  			
                            carPagerPhone: {type: "number"},				  			
                            bookingSendType: {type: "text"},				  			
                            carBookingType: {type: "text"},				  			
                            carBookingAttribute: {type: "text"},				  			
                            isStationDevice: {type: "text"},				  			
                            carType: {type: "text"},				  			
                            vatRegNr: {type: "number"},				  			
                            vatRegNr: {type: "number"},		  			
                            tripDataSendTarget: {type: "text"},				  			
                            ttdataSendTarget: {type: "text"},				  			
                            startSuspend: {type: "date"},				  			
                            finishSuspend: {type: "date"},				  			
                            carEmailAddr: {type: "text"},				  			
                            pagerActive: {type: "text"},				  			
                            pagerActive: {type: "text"},				  			
                            passengerRating: {type: "text"},				  			
                            carPaymentDeviceType: {type: "text"},				  			
                            editUserName: {type: "text"},				  			
                            editTime: {type: "date"},				  			
                            operatingCompany: {type: "text"},				  			
                            posting: {type: "text"},				  			
                            taxiCarCompany: {type: "text"},				  			
                            tblCarBelongsToWorkShiftGroup: {type: "text"},				  			
                        }
                    }
                }
            });

            


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
             
            

            function applyFilter(filterField, filterValue) {
            

                // get the kendoGrid element.
                //var gridData = $("#grid").data("kendoGrid");
            
                // get currently applied filters from the Grid.
                var currFilterObj = dataSource.filter();
                console.log(currFilterObj)
                // get current set of filters, which is supposed to be array.
                // if the oject we obtained above is null/undefined, set this to an empty array
                var currentFilters = currFilterObj ? currFilterObj.filters : [];
              //  var currentFilters =  [];
            
                // iterate over current filters array. if a filter for "filterField" is already
                // defined, remove it from the array
                // once an entry is removed, we stop looking at the rest of the array.
                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            console.log(currentFilters)
                            break;
                        }
                    }
                }
            
                // if "filterValue" is "0", meaning "-- select --" option is selected, we don't 
                // do any further processing. That will be equivalent of removing the filter.
                // if a filterValue is selected, we add a new object to the currentFilters array.
                if (filterValue != "0") {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue
                    });
                }
            
                // finally, the currentFilters array is applied back to the Grid, using "and" logic.
               dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                });
            
            }
            
            
            function clearFilters() {
                var gridData = $("#TableGrid").data("kendoGrid");
                gridData.dataSource.filter({});
            }

        }
        

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
                    //serverPaging: true,
                    //serverSorting: true,
                    //serverFiltering: true,
                
                    //filter: { field: "id", operator: "eq", value: e.data.id }
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
}());