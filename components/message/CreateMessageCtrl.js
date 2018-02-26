(function() {
	'use strict';

	
   
	angular
	 .module('app')
	 .controller('CreateMessageCtrl', CreateMessageCtrl)
	 


   
	CreateMessageCtrl.$inject = ['apiService','translateService', '$scope', '$state', '$uibModal', '$log', '$translate'];
	
	// GIVES AN EMPTY FORM FOR A NEW MESSAGE
	function CreateMessageCtrl(apiService, translateService,$scope, $state, $uibModal, $log, $translate) {
	 translateService.setLanguage();
	
	 var vm = this;
	 var $working = $(" input[class = 'working']");
	 var $notworking = $(" input[class = 'notWorking']");
	 var deflang = 'en';
	
	 findall();
	 findAreas ()
	 findShift()
	 pickDate();

	 //GET THE NEW CALL CENTER VALUE 
	 $("#inputCenter").on('input', function(){	
		var opt = $('option[value="'+$(this).val()+'"]');
		var val = opt.attr('id');
		$scope.body.OperatingCompany = val;                   
	 })
	 
	 //SET ENGLISH AS A DEFAULT LANGUAGE
	 $("#lang").val(deflang);

	 $scope.body = {
	  CarStart:"" ,
	  CarEnd: "",
	  WorkShiftGroup:"",
	  Group:"",
	  ZoneStart: "",
	  ZoneEnd: "",
	  DriverStart: "",
	  DriverEnd: "",
	  Posting: "",
	  DispatchStatus: "",
	  RepeatTimeMin: "",
	  RepeatTimeStart:"",
	  RepeatTimeEnd:"",
	  Text: "",
	  WorkShift: "",
	  NotWorkShift:""	,
	  All:"",
	  Print:"",
	  QuarantedDelivery:"",
	  OperatingCompany: "",
	  Properties :""
	 };


   
	 //SEND A MESSAGE 
	 $scope.create = () => {
	  apiService.post('SendTextMessages', $scope.body)
	  .then(data => {
	   $state.reload();
	   location.reload();
	  })
	  .catch((err) => {
	   console.log(err);
	  });
   
	 }
	
								 //FUNCTIONS
								 
							 

	 // GET ALL THE STANDARD MESSAGES FROM THE DB
	 function findall() {
	  apiService.get('StandardTextMessages')
	   .then((data) => {
		$scope.items = data;

	   })
	   .catch((err) => {
		console.log(err);
	   });
	 }
   
	 
	 //FETCH ALL THE POSTINGS FROM THE DB
	 function findAreas (){
	  apiService.get('Postings')
	   .then((data)=>{
	   $scope.areas = data;   
	   })  
	 }

	 //FETCH THE SHIFTS FROM DB
	 function findShift(){
	  apiService.get('DispatchStatuses')
	   .then((data)=>{
	   $scope.shifts = data;
	   })
	 }

	 //PICK RANGE FOR REPEATING A MESSAGE 		 
	 function pickDate() {
	  $('input[name="datefilter"]').daterangepicker({
	   autoUpdateInput: false,
	   timePicker: false,
	   timePicker24Hour:true,
	   startDate:moment(),
	   timePickerIncrement: 1,
	   locale: {
		cancelLabel: 'cancle'
	   }
	  });
	  $('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
		$(this).val(picker.startDate.format() + ' - ' + picker.endDate.format());  
	   $scope.body.RepeatTimeStart = picker.startDate.format('llll');
	   $scope.body.RepeatTimeEnd = picker.endDate.format('llll');
	  });
	  $('input[name="datefilter"]').on('cancel.daterangepicker', function(ev, picker) {
	   $(this).val('');
	  });
   
	 }

	 //OPEM THE MODAL FOR THE STANDARD MESSAGES
	 $scope.open = function(size) {
	  var modalInstance = $uibModal.open({   
	   templateUrl: 'myModalContent.html',
	   controller: 'ModalInstanceCtrl',
	   size: size,
	   resolve: {
		items: function() {
		 return $scope.items;
		}
	   }
	  });
	 

	  //DISPLAY THE SELECTED ITEMS ON TWO CONTROLLER DIVS 
	  modalInstance.result.then(function(selectedItem) 
	  {
	   $scope.body.Text = selectedItem;
	  }, function() {
	   $log.info('Modal dismissed at: ' + new Date());
	  });
	 };
   	}   
}());
   
   //INDEPENDENT CONTROLLER FOR THE MODAL
   angular.module('app').controller('ModalInstanceCtrl', function($scope, $uibModalInstance, items) {
	var elt = $("#modalTable");   
	$scope.items = items;
	$scope.selected = {
	 item: $scope.items[0]
	};  
	$scope.keyInput = function(keyEvent){
		if (keyEvent === 13){
			alert('entered!')
		}
	}
	$scope.setSelected = function() {
        var selectd = this.item;
        $uibModalInstance.close(selectd.text);
    };
	
   });
   
   		 