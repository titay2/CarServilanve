(function() {

 'use strict';

   
 angular
 .module('app')
 .controller('MessageCtrl', MessageCtrl)
 
 MessageCtrl.$inject = ['apiService', '$scope', '$state'];
 function MessageCtrl(apiService, $scope, $state) {
  var vm = this;
  var kendoGrid = $("#grid");

  
  findall();



  //FETCH ALLL MESSAGES FROM BD AND PASS IT TO THE KENDO GRID 
  function findall() {
   apiService.get('StandardTextMessages')
    .then((data) => {
     vm.datas = data;
    })
    .then(()=>{
	 drawKendoTable(vm.datas, kendoGrid)
    })
     .catch((err) => {
	  console.log(err);
     });
  }



  //DRAW A KENDO TABLE 
	 function drawKendoTable(datas, divId) {
	  divId.kendoGrid({
	   dataSource: {
		data: datas,
		schema: {
		 model: {
		  fields: {
		   ID: {
			type: "string"
		   },
		   Text: {
			type: "text"
		   },
		   Date: {
			type: "date"
		   },
   
		  }
		 }
		},
	//	pageSize: 5
	   },
	   height: 800,
	   width: 500,
	   groupable: true,
	   sortable: true,
	   pageable: {
		refresh: true,
		pageSizes: false,
		buttonCount: false,
		detailInit: detailInit,
		dataBound: function() {
			this.expandRow(this.tbody.find("tr.k-master-row").first());
		},

	   },
	   columns:[
		{
		field: "id",
		title: "ID",
		width: 80
	   }, {
		field: "text",
		title: "Text"
	   }, {
		field: "creationdate",
		title: "Date",
		width: 200
	   }]
	  });
   
	 
	 function detailInit(e) {
		$("<div/>").appendTo(e.detailCell).kendoGrid({
			dataSource: {
				type: "odata",
				transport: {
					read: "http://localhost:52273/api/StandardTextMessages"
				},
				serverPaging: true,
				serverSorting: true,
				serverFiltering: true,
				pageSize: 10,
				//filter: { field: "text", operator: "eq", value: e.data.Text }
			},
			scrollable: false,
			sortable: true,
			pageable: true,
			columns: [
				{ field: "id", width: "110px" },
				{ field: "text", title:"textShip Country", width: "110px" },
				{ field: "creationdate", title:"creationdate" },
				
			]
		});
	}
 }
	 
	}
   
   }());