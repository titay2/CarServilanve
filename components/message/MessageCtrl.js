(function() {
  "use strict";

  angular.module("app").controller("MessageCtrl", MessageCtrl);
  MessageCtrl.$inject = ["translateService", "loginService"];
  function MessageCtrl(translateService, loginService) {
    var hub = $.connection.textMessageDetailTickerHub;
    var hubStart = $.connection.hub.start();

    translateService.setLanguage();
    loginService.helloInitialize();
    var messageDs = new kendo.data.DataSource({
      type: "signalr",
      autoSync: true,
      schema: {
        model: {
          fields: {
            sendTime: {
              type: "date",
              from: "textMsgSendCmdObject.sendTime"
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
            read: "getAllTextLogAndSendCommand"
          },
          client: {
            read: "textMessageSendCommandUpdate"
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
          field: "sendTime",
          format: "{0: dd/MM/yyyy  h:mm}",
          title: "Send Time"
        },
        {
          field: "textMsgSendCmdObject.text",
          title: "Text",
          attributes: {
            style: "white-space: nowrap "
          }
        },
        {
          field: "textMsgSendCmdObject.userName",
          title: "User Name"
        },
        {
          field: "textMsgSendCmdObject.name",
          title: "Message Name"
        },
        {
          field: "textMsgSendCmdObject.displayShowTime",
          title: "Show Time"
        },
        {
          field: "textMsgSendCmdObject.printMessage",
          title: "Print"
        },
        {
          field: "textMsgSendCmdObject.messageShowType",
          title: "Type"
        },
        {
          field: "textMsgSendCmdObject.quarantedDelivery ",
          title: "Secure Send"
        }
      ]
    });
    $("#grid")
      .kendoTooltip({
        filter: "tr.k-master-row td:nth-child(3)",
        position: "right",
        content: function(e) {
          var dataItem = $("#grid")
            .data("kendoGrid")
            .dataItem(e.target.closest("tr"));
          var content = dataItem.textMsgSendCmdObject.text;
          return (
            '<div style="width: ' +
            content.length * 0.6 +
            'em; max-width: 14em">' +
            content +
            "</div>"
          );
        }
      })
      .data("kendoTooltip");

    function detailInit(e) {
      $("<div/>")
        .appendTo(e.detailCell)
        .kendoGrid({
          dataSource: {
            data: e.data.logTextMsgList,
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
              field: "sendDateTime",
              title: "Send time",
              format: "{0: dd/MM/yyyy  h:mm}"
            },
            { field: "carnumber", title: "Vehicle" },
            { field: "operatingCompanyId", title: "Company" },
            { field: "systemId", title: "System ID" },
            { field: "sendStatus", title: "Status" }
          ]
        });
    }
  }
})();
