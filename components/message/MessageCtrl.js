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
    translateService.setLanguage();
    loginService.helloInitialize();

    function detailInit(e) {
      $("<div/>")
        .appendTo(e.detailCell)
        .kendoGrid({
          dataSource: {
            data: e.data.Logtextmessage,
            //batch: true,
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
          //sortable: true,
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

    $.connection.hub.url = "http://localhost:8888/signalr";
    var chat = $.connection.logMessageHub;

    // Create a function that the hub can call to broadcast messages.
    chat.client.logMessageUpdate = function(logMessage) {
      // console.log(logMessage);
    };
    $.connection.hub.start().done(function() {
      //console.log("Client Connected");
      // Call the Send method on the hub.
      chat.server.getAllLogMessages();
      chat.server.getAllLogMessages().done(function(getAllLogs) {
        console.log(getAllLogs);
      });
    });

    // var hubUrl = "http://localhost:8888/signalr";
    // var connection = $.hubConnection(hubUrl, { useDefaultPath: false });
    var hub = $.connection.logMessageHub;
    var hubStart = $.connection.hub.start({ jsonp: true });

    $("#grid").kendoGrid({
      height: 950,
      // editable: true,
      // sortable: true,
      detailInit: detailInit,

      dataSource: {
        type: "signalr",
        dataType: "json",
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
      },
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
  }
})();
