(function() {
    'use strict';
    angular
        .module('app')
        .controller('CreateMessageCtrl', CreateMessageCtrl)
    CreateMessageCtrl.$inject = ['apiService', 'translateService', '$scope', '$state', '$uibModal', '$log', '$translate'];

    // GIVES AN EMPTY FORM FOR A NEW MESSAGE
    function CreateMessageCtrl(apiService, translateService, $scope, $state, $uibModal, $log, $translate) {
        translateService.setLanguage();
        let currentLang = $translate.use();
        console.log(currentLang)
        var vm = this;
        var $working = $(" input[class = 'working']");
        var $notworking = $(" input[class = 'notWorking']");
   

        findall();
        findAreas()
        findShift()
		pickDate();
		
       // console.log(JSON.parse(localStorage.getItem('product')));
        //GET THE NEW CALL CENTER VALUE 
        $("#inputCenter").on('input', function() {
            var opt = $('option[value="' + $(this).val() + '"]');
            var val = opt.attr('id');
            $scope.body.OperatingCompany = val;
        })

        $scope.body = {
            CarStart: "",
            CarEnd: "",
            WorkShiftGroup: "",
            Group: "",
            ZoneStart: "",
            ZoneEnd: "",
            DriverStart: "",
            DriverEnd: "",
            Posting: "",
            DispatchStatus: "",
            RepeatTimeMin: "",
            RepeatTimeStart: "",
            RepeatTimeEnd: "",
            Text: "",
            WorkShift: "",
            NotWorkShift: "",
            All: "",
            Print: "",
            QuarantedDelivery: "",
            OperatingCompany: "",
            Properties: ""
        };

        //SEND A MESSAGE 
        $scope.create = () => {
            apiService.post('SendTextMessages', $scope.body)
                .then(data => {
                   $state.reload();
                   //localStorage.clear()
                    $('#inputCenter').val("");
                    $('#inputArea').val("");
                    $('#propertyInput').val("");
                    $('#vihecle').val("");
                   // location.reload();
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
        function findAreas() {
            apiService.get('Postings')
                .then((data) => {
                    $scope.areas = data;
                })
        }

        //FETCH THE SHIFTS FROM DB
        function findShift() {
            apiService.get('DispatchStatuses')
                .then((data) => {
                    $scope.shifts = data;
                })
        }

        //PICK RANGE FOR REPEATING A MESSAGE 		 
        function pickDate() {
            $('textarea[name="datefilter"]').daterangepicker({
                dateFormat: 'dd-mm-yy' ,
                autoUpdateInput: false,
                timePicker: true,
                timePicker24Hour: true,
                startDate: moment(),
                timePickerIncrement: 1,
                locale: {
                    cancelLabel: 'cancle',
                    dateFormat: 'DD-MM-YYYY'
                }
            });
            $('textarea[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
                $(this).val(picker.startDate.format('DD/MM/YYYY h:mm') + ' - ' + picker.endDate.format('DD/MM/YYYY h:mm'));
                $scope.body.RepeatTimeStart = picker.startDate.format('DD/MM/YYYY h:mm');
                $scope.body.RepeatTimeEnd = picker.endDate.format('DD/MM/YYYY h:mm');
            });
            $('textarea[name="datefilter"]').on('cancel.daterangepicker', function(ev, picker) {
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
            modalInstance.result.then(function(selectedItem) {
                if(selectedItem.text){
                    $scope.body.Text = selectedItem.text;
                }
                if(selectedItem.id){
                    $scope.body.CarEnd= selectedItem.id;
                }
               
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
    $scope.keyInput = function(keyEvent) {
        if (keyEvent === 13) {
            alert('entered!')
        }
    }
    $scope.setSelected = function() {
        var selectd = this.item;
        $uibModalInstance.close(selectd);
    };

    $scope.deleteStd = function(){
        alert('deleted!')
    }

});