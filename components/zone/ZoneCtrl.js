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

    $("#grid").kendoGrid({
      columns: [
        {
          field: "zoneId",
          title: "zone ID"
        },
        {
          field: "zoneName",
          title: "zone Name"
        },
        {
          field: "freeCarsCount",
          title: "count"
        },
        {
          field: "car1",
          title: "car 1"
        },
        {
          field: "car2",
          title: "car 1"
        }
      ],
      pageable: true,
      dataSource: {
        dataType: "json",
        transport: {
          read: root + "ZonesAndCars"
        },
        dataBound: function(e) {
          console.log(e.data.carsList[0]);
        },
        schema: {
          model: {
            fields: {
              Id: { type: "number", editable: false, nullable: true },
              Name: { type: "string" },
              car1: {
                type: "string",
                from: "carsList[0].carString"
              },
              car2: {
                type: "string",
                from: "carsList[1].carString"
              }
            }
          }
        },
        pageSize: 5
      }
    });
  }
})();
// detailTemplate: kendo.template($("#detail-template").html()),
// detailInit: function(e) {
//   e.detailCell.find(".subgrid1").kendoGrid({
//     scrollable: false,
//     sortable: true,
//     pageable: true,

//     columns: [
//       { field: "carNumber", title: "Free Car number" },
//       {
//         field: "statusTime",
//         format: "{0: dd/MM/yyyy  h:mm}",
//         title: "Status time"
//       }
//     ],
//     dataSource: {
//       data: e.data.freeCarList,
//       pageSize: 5,
//       schema: {
//         model: {
//           fields: {
//             statusTime: { type: "date" }
//           }
//         }
//       }
//     }
//   });

//   e.detailCell.find(".subgrid2").kendoGrid({
//     columns: [{ field: "car", title: "Other cars" }, { field: "num" }],
//     dataSource: [{ car: "Car1", num: 30 }, { car: "car2", num: 33 }]
//   });
// }
