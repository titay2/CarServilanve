(function() {
  angular.module("app").controller("ZoneCtrl", ZoneCtrl);

  ZoneCtrl.$inject = [
    "apiService",
    "translateService",
    "$scope",
    "$state",
    "$translate",
    "loginService"
  ];

  function ZoneCtrl(
    apiService,
    translateService,
    $scope,
    $state,
    $translate,
    loginService
  ) {
    translateService.setLanguage();
    loginService.helloInitialize();

    watchAndFilter("callCenterId", "operatingCompanyID");
    $.ajax({
      url: root + "ZonesAndCars",
      method: "GET",
      dataType: "json",
      success: function(data) {
        var gridData = flattenColumns(data);
        // Generate the list of Grid columns dynamically,as number of cars may vary
        var gridColumns = generateColumns(gridData);

        $("#grid").kendoGrid({
          selectable: "cell",
          pageable: true,
          columns: gridColumns,
          scrollable: true,
          pageable: {
            // pageSize: 15,
            refresh: true
          },
          dataSource: {
            data: gridData
          },

          dataBound: function(e) {
            var gridElement = this.element;
            gridElement
              .find(".cell-red")
              .closest("td")
              .css("background", "#ff3636");
            gridElement
              .find(".cell-blue")
              .closest("td")
              .css("background", "#db40c5");
            gridElement
              .find(".cell-green")
              .closest("td")
              .css("background", "#30d965");
            gridElement
              .find(".cell-yellow")
              .closest("td")
              .css("background", "#eef51b");
          }
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert("error: " + textStatus + ": " + errorThrown);
      }
    });
    function flattenColumns(data) {
      var max = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].carsList.length > max) {
          max = data[i].carsList.length;
        }
        var carColumnsLength = max;
      }
      for (var i = 0; i < data.length; i++) {
        var cars = data[i].carsList;
        for (var j = 0; j < carColumnsLength; j++) {
          if (cars[j]) {
            data[i]["Car" + j] = {
              carString: cars[j].carString,
              dispatchStatus: cars[j].dispatchStatus,
              operatingCompanyID: cars[j].operatingCompanyID
            };
          } else {
            data[i]["Car" + j] = { carString: null, dispatchStatus: null };
          }
        }
        delete data[i].carsList;
      }
      return data;
    }

    function watchAndFilter(watchThis, filterBy) {
      function getValue() {
        return window.localStorage.getItem(watchThis);
      }
      $scope.$watch(getValue, function(val) {
        if (val) {
          console.log(val);
          var newValue = $.parseJSON(val);
          applyFilter(filterBy, newValue);
        }
      });
    }
  }
})();
