(function() {
	'use strict';
 
	angular
	.module('app')
 	.controller('MessageCtrl', MessageCtrl);
	MessageCtrl.$inject = ['apiService', 'translateService', '$scope', '$state', '$translate', 'loginService'];
 	function MessageCtrl(apiService, translateService, $scope, $state, $translate, loginService) {
		translateService.setLanguage();
		loginService.helloInitialize();

		// var usertest = JSON.parse(localStorage.getItem('user'))
		// console.log(usertest.id)
		
		 $(document).ready(function() {
                    var element = $("#grid").kendoGrid({
                        dataSource: {
                            type: "odata",
                            transport: {
                                read: root + "LogTextMessages" 
                            },
                            pageSize: 6,
                            serverPaging: true,
                            serverSorting: true
                        },
                        height: 600,
                        sortable: true,
                        pageable: true,
                        detailInit: detailInit,
                        
                        columns: [
                            {
                                field: "textMessageSendCommands",
                                title: "First Name"
                            },
                           
                        ]
                    });
                });

                function detailInit(e) {
                    $("<div/>").appendTo(e.detailCell).kendoGrid({
                        dataSource: {
                            type: "odata",
                            transport: {
                                read:root + "LogTextMessages" 
                            },
                            serverPaging: true,
                            serverSorting: true,
                            serverFiltering: true,
                            pageSize: 10,
                            filter: { field: "textMessageSendCommands.text", operator: "eq", value: e.data.logtextmessage. text }
                        },
                        scrollable: false,
                        sortable: true,
                        pageable: true,
                        columns: [
                            { field: "OrderID", width: "110px" },
                            { field: "ShipCountry", title:"Ship Country", width: "110px" },
                            { field: "ShipAddress", title:"Ship Address" },
                            { field: "ShipName", title: "Ship Name", width: "300px" }
                        ]
                    });
                }
		// $.ajax({
		// 	url: root + "LogTextMessages" ,
		// 	method: "GET",
		// 	dataType: "json", 
		// 	success: function (data) {
		// 		var values = []
		// 		var keys = []
		// 		for(var key in data){
		// 			if (data.hasOwnProperty(key)){
		// 		  		var value=data[key]
		// 		  		keys.push(key);
		// 		  		values.push(data[key]);
		// 		    }
		// 		}
		// 		console.log( values)
		// 		console.log("keys" + key)
		// 		var dataSource = new kendo.data.DataSource({
		// 		    data : keys,
		// 		    schema:{
		// 				model: {
		// 					fields: {
		// 						sendTime :{type :"date"},
		// 						text: { type: "text" },
		// 						//sendCommandId: { type: "number" },
		// 						userName: { type: "text" },
		// 					}
		// 				}
		// 			}
		// 		});
		// 		// var dataSourcedetail = new kendo.data.DataSource({
		// 		// 	data : values[0],
		// 		// 	batch: true,
		// 		// 	pageSize: 10,
		// 		// 	schema: {
		// 		// 		model: {
		// 		// 			fields: {
		// 		// 				sendDateTime: { type: "date" },
		// 		// 				carnumber: { type: "number" },
		// 		// 				operatingCompanyId: { type: "number" },
		// 		// 				systemId: { type: "number" },
		// 		// 			}
		// 		// 		}
		// 		// 	}
		// 		// }); 
		// 		$("#grid").kendoGrid({
		// 			dataSource: dataSource,
		// 			pageable: true,       
		// 			sortable: true,
		// 			columns: [{field:"sendTime", title:"Send time", format:"{0: dd/MM/yyyy}"},
		// 					 {field: "text", title:"Text"},							 
		// 					 {field:"userName", title: "User Name"} ],
		// 			detailInit: function (e) {
		// 				var rowIndex = e.masterRow.index(".k-master-row");
		// 				$("<div/>").appendTo(e.detailCell).kendoGrid({
		// 					dataSource:{
		// 						data : values[rowIndex],
		// 						batch: true,
		// 						pageSize: 10,
		// 						schema: {
		// 							model: {
		// 								fields: {
		// 									sendDateTime: { type: "date" },
		// 									carnumber: { type: "number" },
		// 									operatingCompanyId: { type: "number" },
		// 									systemId: { type: "number" },
		// 								}
		// 							}
		// 						}
		// 				    },
		// 			    	scrollable: false,
		// 			    	sortable: true,
		// 			    	pageable: true,
		// 			    	columns: [
		// 						{field:"sendDateTime", title:"Send time", format:"{0: h:mm}"},
		// 						{field: "carnumber", title:"Vehicle"},
		// 						{field: "operatingCompanyId", title:"Company"},
		// 						{field: "systemId", title:"System ID"},
		// 					]
		// 			    });
		// 		    },			  
		// 	    });
				
		// 	},
		// 	error: function (jqXHR, textStatus, errorThrown) {
		// 		alert("error: " + textStatus + ": " + errorThrown);
		// 	}
		// });
		// const connection = new signalR.HubConnection(crudServiceBaseUrl+ 'logMessageHub');
   		// connection.on("startSendingLog", (logMessageUpdate) => {
		// 	var jsondata = JSON.parse(logMessageUpdate);
   		// });
   		// try {
		// 	connection
		// 		.start()
   		//     	.done(console.log(connection));
   		// } catch(err){
   		//     (err => console.log(err));
		//    }
		   			
	}
}());
	

// to establish a connection without generated proxy
   //this is hub which is a collection of these methods
   /**
    * var hubUrl = "https://demos.telerik.com/kendo-ui/service/signalr/hubs";
           var connection = $.hubConnection(hubUrl, { useDefaultPath: false});
           var hub = connection.createHubProxy("productHub");
    * Plus on Connection method  
    */
//    var dataSource1 = new kendo.data.DataSource({
// 	transport: {
// 	read: { url: "http://localhost:52273/api/FleetStates/dispatchStatus"},
	   
// 	},
// 	batch: true,
// 	pageSize: 20,
	
// });  
  

//    const connection = new signalR.HubConnection("http://localhost:52273/dispatchStatusHub");
//    //const connection = new signalR.HubConnection('http://localhost:51116/logMessageHub');
//    const button = document.getElementById("startStreaming");
   
//    const hub = connection.on("startSendingDispatch", (logMessageUpdate) => {
// 	   //startStreaming();
// 	   console.log(JSON.parse(logMessageUpdate))
// 	   return JSON.parse(logMessageUpdate)

//    })

// 	$.ajax({
// 		 url: "http://localhost:52273/api/FleetStates/dispatchStatus" ,
// 		 method: "GET",
// 		 dataType: "json",
// 		 success: function(data){
// 			console.log(data)
// 		 },
// 		 error: function (jqXHR, textStatus, errorThrown) {
// 			 alert("error: " + textStatus + ": " + errorThrown);
// 		 }
// 	 });
 

   
//    try {

   
// 	const hubStart = connection.start()
// 	//.done();
// 	var dataSource = new kendo.data.DataSource({
// 		type: "signalr",
	
// 		transport: {
// 		 signalr: {
// 		  promise:hubStart,
// 		  hub: hub,
// 		//   server: {read: "startSendingDispatch"},
// 		//   client: {read: "startSendingDispatch"}
// 		 }
// 		}
// 	   })
	  
//    } catch (err) {
//        (err => showErr(err));
//    }
  
  
//    $("#grid").kendoGrid({
// 	dataSource: dataSource1,
// 	height: 850,
// 	dataBound: function(){
// 		console.log("API data source " + dataSource)
// 	},
// 	columns: [
// 		{field:"dispatchCount", title:"dispatchCount"},
// 		{field:"dispatchStatus", title:"dispatchStatus"},
// 	   ]     
//    });
   


