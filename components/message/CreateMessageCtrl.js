(function() {
  "use strict";
  angular.module("app").controller("CreateMessageCtrl", CreateMessageCtrl);
  CreateMessageCtrl.$inject = [
    "apiService",
    "translateService",
    "$scope",
    "$state",
    "$uibModal",
    "$log",
    "$translate"
  ];

  // GIVES AN EMPTY FORM FOR A NEW MESSAGE
  function CreateMessageCtrl(
    apiService,
    translateService,
    $scope,
    $state,
    $uibModal,
    $log,
    $translate
  ) {
    translateService.setLanguage();
    //let currentLang = $translate.use();

    var vm = this;
    var $working = $(" input[class = 'working']");
    var $notworking = $(" input[class = 'notWorking']");

    findall();
    findAreas();
    findShift();
    pickDate();

    // console.log(JSON.parse(localStorage.getItem('product')));
    //GET THE NEW CALL CENTER VALUE
    $("#inputCenter").on("input", function() {
      var opt = $('option[value="' + $(this).val() + '"]');
      var val = opt.attr("id");
      $scope.body.OperatingCompany = val;
    });
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
      Properties: "",
      UserName: ""
    };
    $scope.saveStm = () => {
      apiService
        .post("StandardTextMessages", $scope.body)
        .then(data => {
          console.log(data);
        })
        .catch(err => {
          console.log(err);
        });
    };
    //SEND A MESSAGE
    $scope.create = () => {
      apiService
        .post("SendTextMessages", $scope.body)
        .then(data => {
          $state.reload();
          //localStorage.clear()
          $("#inputCenter").val("");
          $("#inputArea").val("");
          $("#propertyInput").val("");
          $("#vihecle").val("");
          // location.reload();
        })
        .catch(err => {
          console.log(err);
        });
    };

    //FUNCTIONS

    // GET ALL THE STANDARD MESSAGES FROM THE DB
    function findall() {
      apiService
        .get("StandardTextMessages")
        .then(data => {
          $scope.items = data;
        })
        .catch(err => {
          console.log(err);
        });
    }

    //FETCH ALL THE POSTINGS FROM THE DB
    function findAreas() {
      apiService.get("Postings").then(data => {
        $scope.areas = data;
      });
    }

    //FETCH THE SHIFTS FROM DB
    function findShift() {
      apiService.get("DispatchStatuses").then(data => {
        $scope.shifts = data;
      });
    }

    //PICK RANGE FOR REPEATING A MESSAGE
    function pickDate() {
      $('textarea[name="datefilter"]').daterangepicker({
        dateFormat: "dd-mm-yy",
        autoUpdateInput: false,
        timePicker: true,
        timePicker24Hour: true,
        startDate: moment(),
        timePickerIncrement: 1,
        locale: {
          cancelLabel: "cancle",
          dateFormat: "DD-MM-YYYY"
        }
      });
      $('textarea[name="datefilter"]').on("apply.daterangepicker", function(
        ev,
        picker
      ) {
        $(this).val(
          picker.startDate.format("DD/MM/YYYY h:mm") +
            " - " +
            picker.endDate.format("DD/MM/YYYY h:mm")
        );
        $scope.body.RepeatTimeStart = picker.startDate.format(
          "DD/MM/YYYY h:mm"
        );
        $scope.body.RepeatTimeEnd = picker.endDate.format("DD/MM/YYYY h:mm");
      });
      $('textarea[name="datefilter"]').on("cancel.daterangepicker", function(
        ev,
        picker
      ) {
        $(this).val("");
      });
    }

    //OPEM THE MODAL FOR THE STANDARD MESSAGES
    $scope.open = function(size) {
      var modalInstance = $uibModal.open({
        templateUrl: "myModalContent.html",
        controller: "ModalInstanceCtrl",
        size: size,
        resolve: {
          items: function() {
            return $scope.items;
          }
        }
      });

      function setValues(data, num) {
        let x;
        Object.keys(data).forEach(function(key) {
          if (data[key].Value == num) {
            x = data[key].Display;
          }
        });
        return x;
      }
      //DISPLAY THE SELECTED ITEMS ON TWO CONTROLLER DIVS when the modal closes
      modalInstance.result.then(function(selectedItem) {
        if (selectedItem.jSon) {
          var data = JSON.parse(selectedItem.jSon);
          if (setValues(data, 0) != null) {
            $scope.body.CarStart = setValues(data, 0);
          }
          if (setValues(data, 1) != null) {
            $scope.body.CarEnd = setValues(data, 1);
          }
          if (setValues(data, 2) != null) {
            $scope.body.WorkShiftGroup = setValues(data, 2);
          }
          if (setValues(data, 3) != null) {
            $scope.body.DriverEnd = setValues(data, 3);
          }
          if (setValues(data, 4) != null) {
            $scope.body.DriverStart = setValues(data, 3);
          }
          if (setValues(data, 5) != null) {
            $scope.body.ZoneStart = setValues(data, 5);
          }
          if (setValues(data, 6) != null) {
            $scope.body.ZoneEnd = setValues(data, 6);
          }
          if (setValues(data, 7) != null) {
            $scope.body.Properties = setValues(data, 7);
          }
          if (setValues(data, 8) != null) {
            $scope.body.OperatingCompany = setValues(data, 8);
          }
          if (setValues(data, 9) != null) {
            $scope.body.Posting = setValues(data, 9);
          }
          if (setValues(data, 10) != null) {
            if (setValues(data, 11) == 1) {
              $scope.body.WorkShift = true;
            } else {
              $scope.body.WorkShift = false;
            }
          }
          if (setValues(data, 11) != null) {
            if (setValues(data, 11) == 1) {
              $scope.body.NotWorkShift = true;
            } else {
              $scope.body.NotWorkShift = false;
            }
          }
          if (setValues(data, 12) != null) {
            if (setValues(data, 12) == 1) {
              $scope.body.All = true;
            } else {
              $scope.body.All = false;
            }
          }
          if (setValues(data, 13) != null) {
            $scope.body.Group = setValues(data, 13);
          }
          if (setValues(data, 14) != null) {
            if (setValues(data, 14) == 1) {
              $scope.body.Print = true;
            } else {
              $scope.body.Print = false;
            }
          }
          if (setValues(data, 15) != null) {
            if (setValues(data, 15) == 1) {
              $scope.body.QuarantedDelivery = true;
            } else {
              $scope.body.QuarantedDelivery = false;
            }
          }
          if (setValues(data, 16) != null) {
            $scope.body.Text = setValues(data, 16);
          }
          if (setValues(data, 17) != null) {
            $scope.body.RepeatTimeStart = setValues(data, 17);
          }
          if (setValues(data, 18) != null) {
            $scope.body.RepeatTimeEnd = setValues(data, 18);
          }
          if (setValues(data, 19) != null) {
            $scope.body.RepeatTimeMin = setValues(data, 19);
          }
          if (setValues(data, 20) != null) {
            $scope.body.UserName = setValues(data, 20);
          }
          if (setValues(data, 21) != null) {
            $scope.body.NameOfTxtMsg = setValues(data, 21);
          }
          if (setValues(data, 22) != null) {
            $scope.body.DispatchStatus = setValues(data, 22);
          }
        } else {
          if (selectedItem.text) {
            $scope.body.Text = selectedItem.text;
          }
        }
      });
    };
  }
})();

//INDEPENDENT CONTROLLER FOR THE MODAL
angular
  .module("app")
  .controller("ModalInstanceCtrl", function($scope, $uibModalInstance, items) {
    var elt = $("#modalTable");
    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };
    $scope.keyInput = function(keyEvent) {
      if (keyEvent === 13) {
        alert("entered!");
      }
    };
    $scope.setSelected = function() {
      var selectd = this.item;
      $uibModalInstance.close(selectd);
    };

    $scope.deleteStd = function() {
      alert("deleted!");
    };
  });
