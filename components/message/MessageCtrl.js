(function() {
	'use strict';
 
	angular
	.module('app')
 	.controller('MessageCtrl', MessageCtrl);
	MessageCtrl.$inject = ['apiService', 'translateService', '$scope', '$state', '$translate'];
 	function MessageCtrl(apiService, translateService, $scope, $state, $translate) {
		translateService.setLanguage();
		
		$.ajax({
			url: root + "LogTextMessages" ,
			method: "GET",
			dataType: "json", 
			success: function (data) {
				var values = []
				var keys = []
				for(var key in data){
					if (data.hasOwnProperty(key)){
				  		var value=data[key]
				  		keys.push(JSON.parse(key));
				  		values.push(data[key]);
				    }
				}
				var dataSource = new kendo.data.DataSource({
				    data : keys,
				    schema:{
						model: {
							fields: {
								text: { type: "text" },
								sendCommandId: { type: "number" },
								userId: { type: "text" },
							}
						}
					}
				});
				var dataSourcedetail = new kendo.data.DataSource({
					data : values[0],
					batch: true,
					pageSize: 10,
					schema: {
						model: {
							fields: {
								 text: { type: "text" },
								logId: { type: "number" },
								systemId: { type: "number" },
							}
						}
					}
				}); 
				$("#grid").kendoGrid({
					dataSource: dataSource,
					pageable: true,       
					sortable: true,
					columns: [{field:"text", title:"Text"},
							 {field:"sendCommandId", title:"Log Id"},
							 {field:"userId", title: "System"}],
					detailInit: function (e) {
						var rowIndex = e.masterRow.index(".k-master-row");
						$("<div/>").appendTo(e.detailCell).kendoGrid({
							dataSource:{
								data : values[rowIndex],
								batch: true,
								pageSize: 10,
								schema: {
									model: {
										fields: {
											 text: { type: "text" },
											logId: { type: "number" },
											systemId: { type: "number" },
										}
									}
								}
						    },
					    	scrollable: false,
					    	sortable: true,
					    	pageable: true,
					    	columns: [
								{ field: "logId", titla: "ID", width: 70 },
								{ field: "text", title:"Text", width: 100 },]
					    });
				    },			  
			    });
				
			},
			error: function (jqXHR, textStatus, errorThrown) {
				alert("error: " + textStatus + ": " + errorThrown);
			}
		});
		const connection = new signalR.HubConnection('http://localhost:52273/logMessageHub');
   		connection.on("startSendingLog", (logMessageUpdate) => {
			var jsondata = JSON.parse(logMessageUpdate);
   		});
   		try {
			connection
				.start()
   		    	.done(console.log(connection));
   		} catch(err){
   		    (err => console.log(err));
		   }
		   			
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
   


