(function() {
	'use strict';
 
	angular
		.module('app')
 		.controller('MessageCtrl', MessageCtrl);

		 MessageCtrl.$inject = ['apiService', 'translateService', '$scope', '$state', '$translate'];

 		function MessageCtrl(apiService, translateService, $scope, $state, $translate) {
			translateService.setLanguage();

			//const connection = new signalR.HubConnection('http://localhost:52273/logNotifierHub');
			//const button = document.getElementById("startStreaming");				
				// function startStreaming() {
				// 	connection.stream("StartStreaming").subscribe({
				// 		next: onStreamReceived,
				// 		err: function (err) {
				// 			Console.log(err);
				// 		},
				// 		complete: function () {
				// 			console.log("Finished streeming");
				// 		}
				// 	});
				// }
				// connection.on("streamStarted", function () {
				// 	console.log('here! streamStarted')
				// 	startStreaming();
				// });
				
				// var dataSource = new kendo.data.DataSource({
				// 	data: []
				// });
		
				// function onStreamReceived(data) {
				// 	var jsondata = JSON.parse(data);
				
				// 	console.log('1' + jsondata)
				// 	dataSource.add(jsondata)
				// 	dataSource.sync();
				// 	$("#grid").kendoGrid({
				// 		dataSource: jsondata,
				// 		height: 850,
				// 		columns: [
				// 			{ field: "LogId" },
				// 			{ field: "SendDateTime" },
				// 			{ field: "Text"}
				// 		],					
				// 	})
				// 	var grid = $("#grid").data("kendoGrid");
				// 	grid.refresh();
				
				// 	// console.log(jsondata)
				// }
				// connection.start({ jsonp: true }).then(() => {
				// 	console.log('here! start! streamStarted')
				// 	startStreaming()
				// 	//$('#grid').data('kendoGrid').dataSource.read();					
				// })

				   //const connection = new signalR.HubConnection('http://localhost:51116/logNotifierHub');
				   function findall() {
					apiService.get('LogTextMessages')
						.then((data) => {
							var newdata =JSON.parse(data);
							
							console.log(newdata);
							//console.log(newdata);

						})
						.catch((err) => {
							console.log(err);
						});
				}
				   function createGrid (){
					var crudServiceBaseUrl = "http://localhost:52273/api/LogTextMessages",
					dataSource = new kendo.data.DataSource({
						transport: {
							read: { 
								url: crudServiceBaseUrl }
						},
						batch: true,
						pageSize: 10,
						schema: {
							model: {
								// id: "id",
								fields: {
									// id: { editable: false, nullable: true },
									// text: { validation: { required: true} },
								    sendDateTime: {type: "date"},	
									// printMessage:{ type:"boolean" }
								}
							}
						}
					}); 
			
					var grid = $("#grid").kendoGrid({
						dataSource: dataSource,
						pageable: true,       
						sortable: true,
						columns: [{field:"text", title:"Text"},
								  {field:"carnumber", title:"Car Num"},
								  {field:"sendDateTime", title: "Send Date", format:"{0: dd/MM/yyyy h:mm}"}
								],
					});
				}
				
   const connection = new signalR.HubConnection('http://localhost:52273/logMessageHub');

   
   //createGrid()
   findall()
   connection.on("startSendingLog", (logMessageUpdate) => {
	var jsondata = JSON.parse(logMessageUpdate);
	console.log(logMessageUpdate)			
	console.log(jsondata)			
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


