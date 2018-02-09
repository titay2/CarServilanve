(function() {
	'use strict';
   
	angular
	 .module('app')
	 .controller('CreateMessageCtrl', CreateMessageCtrl);
   
   
	CreateMessageCtrl.$inject = ['apiService', '$scope', '$state', '$uibModal', '$log'];
      
	// GIVES AN EMPTY FORM FOR A NEW MESSAGE
	function CreateMessageCtrl(apiService, $scope, $state, $uibModal, $log) {
	 $scope.allow_anonymous_answer = false;
	 var vm = this;
	 var $working = $(" input[class = 'working']");
	 var $notworking = $(" input[class = 'notWorking']");
   
	
	 findall();
	 findAreas ()
	 findShift()
	 pickDate();

	 //GET THE NEW CALL CENTER VALUE 
	 $("#inputCenter").on('input', function(){
		var val = $(this).val();
		$scope.body.OperatingCompany = val
	 })
	
	 $scope.body = {
	  CarStart:Number,
	  CarEnd: Number,
	  WorkShiftGroup:"",
	  Group:"",
	  ZoneStart: Number,
	  ZoneEnd: Number,
	  DriverStart: Number,
	  DriverEnd: Number,
	  Posting: "",
	  DispatchStatus: "",
	  RepeatTimeMin: Number,
	  range: "",
	 // RepeatTimeStart:"",
	 // RepeatTimeEnd:"",
	  Text: "",
	  WorkShift: "",
	  NotWorkShift:""	,
	  All:"",
	  Print:"",
	  QuarantedDelivery:"",
	  OperatingCompany:"",
	  Properties :""
	 };
   
	 //SEND A MESSAGE 
	 $scope.create = () => {
	  apiService.post('StandardTextMessages', $scope.body )
	  .then(data => {
	   $state.reload();
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
   
	 
	 //FETCH ALL THE AREAS FROM THE DB
	 function findAreas (){
	  apiService.get('Postings')
	   .then((data)=>{
	   $scope.areas = data;   
	   })  
	 }

	 //FETCH THE SHIFTS LIST FROM DB
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
	   timePicker: true,
	   startDate:moment(),
	   timePickerIncrement: 1,
	   locale: {
		cancelLabel: 'cancle'
	   }
	  });
	  $('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
		$(this).val(picker.startDate.format('llll') + ' - ' + picker.endDate.format('llll'));  
	   $scope.body.range =picker.startDate.format('llll') + ' - ' + picker.endDate.format('llll');
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
	$scope.setSelected = function() {
        var selectd = this.item;
        $uibModalInstance.close(selectd.text);
    };
	
   });
   
   		 