(function() {
	//'use strict';
 
	angular
		.module('app')
 		.controller('CarInfoCtrl', CarInfoCtrl)

		// CarInfoCtrl.$inject = ['apiService', 'translateService', 'HelloService', '$scope', '$state', '$translate'];

 		function CarInfoCtrl(apiService, translateService, $scope, $state, $translate, HelloService,jwtHelper) {
            translateService.setLanguage();
            

            
            helloInitialize();
            $scope.login = HelloService.login;
            $scope.logout = helloLogout;
        
    

    // Web Login and Logout using hello
    function helloInitialize() {
        console.log("hello service "+HelloService)
        console.log("translateService "+translateService)
        HelloService.initialize().then(function(authResponse) {
            console.log(authResponse)
            displayUserDetails(getUserData(authResponse))
        });
    }

    function helloLogout() {
            HelloService.logout();
    }

   

    // Decode decode the token and diaplay the user details
    function getUserData(response) {
        var user = {};
        user.token = response.access_token || response.token;
        var data = jwtHelper.decodeToken(user.token);
        console.log(data)
        user.expires_in = new Date(response.expires * 1000) || response.expiresOn;
        user.name = data.name;
        user.email = data.emails ? data.emails[0] : '';
        console.log(user.email )
        user.id = data.sub;
        return user;
    };

    function displayUserDetails(user) {
        $scope.user = user;
    }
            
               //watchAndFilter('callCenterId',"operatingCompanyId" )
     
            var dataSource = new kendo.data.DataSource({
               
                transport:{
                    read:{
                        url:root+ "Cars",
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
                      { field: "carId", title: "Car", attributes: { "class": "driverCardNr" }},
     
                      { field: "driverCardNr", title: "*Driver ID"}, 
                      { field: "systemId", title: "*Zone ID"}, 
                      { field: "taxiCarCompanyId", title: "*TXM Status",attributes: { "class": "taxiCarCompanyId2" }}, 
                      { field: "operatingCompanyId", title: "*Dispatch Status"}, 
                      { field: "carDispatchAttributes", title: "*Dispatch Status"}, 
                      { field: "editTime", title: "*SFH time",format:"{0: dd/MM/yyyy}"}, 
                      { field: "posting", title: "*SFH Zone",attributes: { "class": "taxiCarCompanyId" }}, 
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

            $("#grid").kendoDraggable({
                filter: ".driverCardNr",
                dragstart: function(e) {
                    var draggedElement = e.currentTarget.closest("tr"), //get the DOM element that is being dragged
                        dataItem = dataSource.getByUid(draggedElement.data("uid")); //get corresponding dataItem from the DataSource instance
                    console.log(dataItem.carId);
                },
                hint: function(element) {
                    return element.clone().css({
                        // "opacity": 0.6,
                        // "background-color": "#0cf"
                    });
                }
            });
            $("#grid").kendoDropTargetArea({
                filter: ".taxiCarCompanyId, .taxiCarCompanyId2",
                drop: onDrop
            });
          
            function onDrop(e) {
                var draggedElement = e.dropTarget.closest("tr"), //get the DOM element that is being dragged
                dataItem = dataSource.getByUid(draggedElement.data("uid"));
                var row = $(this).closest("tr"); //get corresponding dataItem from the DataSource instance
                var colIdx = e.dropTarget.index();
                var colName = $('#grid').find('th').eq(colIdx).text();
              
                console.log(colName);
                console.log(dataItem);
            }

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
            //DETAIL FOR THE MASTER DATA
            function detailInit(e) {
                $("<div/>").appendTo(e.detailCell).kendoGrid({
                    dataSource: {
                        transport: {
                            read:{
                                url:root + "Cars"+ e.data.carId ,
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