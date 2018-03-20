(function() {
	'use strict';
 
	angular
		.module('app')
 		.controller('MessageCtrl', MessageCtrl);

		 MessageCtrl.$inject = ['apiService', 'translateService', '$scope', '$state', '$translate'];

 		function MessageCtrl(apiService, translateService, $scope, $state, $translate) {
			translateService.setLanguage();

			const connection = new signalR.HubConnection('http://localhost:52273/logNotifierHub');
			//const button = document.getElementById("startStreaming");				
				function startStreaming() {
					connection.stream("StartStreaming").subscribe({
						next: onStreamReceived,
						err: function (err) {
							Console.log(err);
						},
						complete: function () {
							console.log("Finished streeming");
						}
					});
				}
				connection.on("streamStarted", function () {
					startStreaming();
				});
				// button.addEventListener("click", event => {
				// 	connection.invoke("sendStreamInit");
				// });
				
				function onStreamReceived(data) {
					var jsondata = JSON.parse(data);
					$("#grid").kendoGrid({
						dataSource: jsondata,
						height: 850,
						columns: [
							{ field: "LogId" },
							{ field: "SendDateTime" },
							{ field: "Text"}
						],					
					});
				}
				connection.start({ jsonp: true }).then(() => {
					startStreaming()
					//$('#grid').data('kendoGrid').dataSource.read();					
				})
			//	connection.invoke("sendStreamInit");
			

			//$(document).ready(function() {
				
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

				// var hubUrl = "http://localhost:52273/logNotifierHub";
				// var connection = new signalR.HubConnection(hubUrl );
				// var hub = connection.invoke("LogNotifierHub");
				// var hubStart = connection.start();
				// connection.on("streamStarted", function () {
				// 				startStreaming();
				// 			});
				// var dataSource = new kendo.data.DataSource({
				// 	type: "signalr",
				// 	schema: {
				// 		model: {
				// 			id: "LogId",
				// 			fields: {
				// 				"LogId": { editable: false, nullable: true },
				// 				"SendDateTime": { type: "date" },
				// 				"Text": { type: "text" }
				// 			}
				// 		}
				// 	},
				// 	transport: {
				// 		signalr: {
				// 			promise: hubStart,
				// 			hub: hub,
				// 			server: {
				// 				read: "read",
								
				// 			},
				// 			client: {
				// 				read: "read",
				// 			}
				// 		}
				// 	}
				// });
				
				// $("#grid").kendoGrid({
				// 				dataSource: dataSource,
				// 				height: 850,
				// 				columns: [
				// 					{ field: "LogId" },
				// 					{ field: "SendDateTime" },
				// 					{ field: "Text"}
				// 				],					
				// 			});

			//});

			
		}
}());


