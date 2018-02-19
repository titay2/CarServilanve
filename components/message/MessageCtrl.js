(function() {

 'use strict';
   
 angular
 .module('app')
 .controller('MessageCtrl', MessageCtrl);
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
		buttonCount: false
	   },
	   columns: [{
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
   
	 }
	 
	}
   
   }());