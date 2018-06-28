(function() {
  "use strict";

  angular.module("app").controller("MessageCtrl", MessageCtrl);
  MessageCtrl.$inject = [
    "apiService",
    "translateService",
    "$scope",
    "$state",
    "$translate",
    "loginService"
  ];
  function MessageCtrl(
    apiService,
    translateService,
    $scope,
    $state,
    $translate,
    loginService
  ) {
    var hub = $.connection.logMessageHub;
    var hubStart = $.connection.hub.start();

    translateService.setLanguage();
    loginService.helloInitialize();
    var messageDs = new kendo.data.DataSource({
      type: "signalr",
      autoSync: true,
      schema: {
        model: {
          fields: {
            SendTime: {
              type: "date",
              from: "TextMessageSendCommands.SendTime"
            }
          }
        }
      },
      // sort: [{ field: "SendTime"", dir: "desc" }],
      transport: {
        signalr: {
          promise: hubStart,
          hub: hub,
          server: {
            read: "getAllLogMessages"
          },
          client: {
            read: "logMessageUpdate"
          }
        }
      }
    });
    $("#grid").kendoGrid({
      height: 950,
      //scrollable: true,
      sortable: true,
      resizable: true,
      detailInit: detailInit,
      dataSource: messageDs,
      columns: [
        {
          field: "SendTime",
          format: "{0: dd/MM/yyyy  h:mm}",
          title: "Send Time"
        },
        {
          field: "TextMessageSendCommands.Text",
          title: "Text"
        },
        {
          field: "TextMessageSendCommands.UserName",
          title: "User Name"
        },
        {
          field: "TextMessageSendCommands.Name",
          title: "Message Name"
        },
        {
          field: "TextMessageSendCommands.DisplayShowTime",
          title: "Show Time"
        },
        {
          field: "TextMessageSendCommands.PrintMessage",
          title: "Print"
        },
        {
          field: "TextMessageSendCommands.MessageShowType",
          title: "Type"
        },
        {
          field: "TextMessageSendCommands.QuarantedDelivery ",
          title: "Secure Send"
        }
      ]
    });

    function detailInit(e) {
      $("<div/>")
        .appendTo(e.detailCell)
        .kendoGrid({
          dataSource: {
            data: e.data.Logtextmessage,
            pageSize: 10,
            schema: {
              model: {
                fields: {
                  SendDateTime: { type: "date" }
                }
              }
            }
          },
          scrollable: false,
          sortable: true,
          resizable: true,
          pageable: true,
          columns: [
            {
              field: "SendDateTime",
              title: "Send time",
              format: "{0: dd/MM/yyyy  h:mm}"
            },
            { field: "Carnumber", title: "Vehicle" },
            { field: "OperatingCompanyId", title: "Company" },
            { field: "SystemId", title: "System ID" },
            { field: "SendStatus", title: "Status" }
          ]
        });
    }
  }
})();
