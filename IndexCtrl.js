
  
var root = "http://semasp04.semel.ext/TestCarsurveillanceBackend/api/"
var crudServiceBaseUrl = "http://localhost:52273/dispatchStatusHub";
var callCenterId = JSON.parse(localStorage.getItem('callCenterId') || '[]' )
var areaFilter = JSON.parse(localStorage.getItem('areaFilter') || '[]' )
var propertyFilter = JSON.parse(localStorage.getItem('propertyFilter') || '[]' )
var vehicleFilter = JSON.parse(localStorage.getItem('vehicleFilter') || '[]' )

findCallCenter();
findArea();

// Save the navbar filter inputs to localstorage. 
$("#inputCenter").on('input', function() {               
    var opt = $('option[value="' + $(this).val() + '"]');
    var val = opt.attr('id'); 
    if ($.isNumeric(val)) {
        setFiletr('callCenterId', val);
    }
})

$("#inputArea").on('input', function() {  
    console.log( $(this).val() );
})

$("#propertyInput").on('change', function() {
    var input = $(this);
   //if(input.next()){
    if(input.focusout()){
    console.log( input.val() );
   }     
})

$("#vihecle").on('change', function() {
   var input = $(this);
   //if(input.next()){
    if(input.focusout()){
        setFiletr('vehicleFilter',input.val());
        console.log( localStorage.getItem('vehicleFilter'));
   }  
})

$("#clearLable").click( function () {
    //localStorage.clear()
    $('#inputCenter').val("");
    $('#inputArea').val("");
    $('#propertyInput').val("");
    $('#vihecle').val("");
})  
	
//connect to the signalR websocketand update the latest changes to the UI in realtime.
const connection = new signalR.HubConnection(crudServiceBaseUrl);
connection.on("startSendingDispatch", (Rowdata) => {
    var data = JSON.parse(Rowdata)
	updateStatusBar(data);
});
    
try {
   connection
   .start().then(function() {
       $.ajax({
            url: root + "FleetStates/dispatchStatus" ,
            method: "GET",
            dataType: "json", 
            success: function (data) {
                console.log(data);
                updateStatusBar(data)
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("error: " + textStatus + ": " + errorThrown);
            }
        });
    })
    .done(console.log(connection));
}
catch(err){
    (err => console.log(err));
}


           // FUNCTIONS
//get data and populate the call center input option in the navbar. 
function findCallCenter() {
    $.ajax({
        url: root + "OperatingCompanies" ,
        method: "GET",
        dataType: "json", 
        success: function (data) {
            $(data).each(function () {
              var callCenter = "<option id= \"" + this.operatingCompanyId + "\"  value=\"" + this.name + "\">" + this.name + "</option>";
                $("#callcenter").append(callCenter);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("error: " + textStatus + ": " + errorThrown);
        }
    });
}
//get data and populate the area input option in the navbar. 
function findArea(){
    $.ajax({
        url: root + "Postings" ,
         method: "GET",
         dataType: "json", 
         success: function (data) {
            
             $(data).each(function () {
               var  postingArea = "<option value=\"" + this.postingName + "\">" + this.postingName + "</option>";
                 $("#area").append(postingArea);
             });
 
         },
         error: function (jqXHR, textStatus, errorThrown) {
             alert("error: " + textStatus + ": " + errorThrown);
         }
     });
}
//save data passed to localstorage.
function setFiletr(storageField, inputValue){
    localStorage.setItem(storageField, inputValue);
}
//change the numbers on the status buttons 
function updateTheButton(status, num, id){
    if(status.dispatchStatus === num){
        document.getElementById(id).innerHTML = status.dispatchCount;
    }
}

// compare the Data to get the exact button to be updated
function updateStatusBar(data){
    for (var i in data) {
        if (data.hasOwnProperty(i)) {
            updateTheButton((data[i]), 0,"freecars" );
            updateTheButton((data[i]), 1,"soonfh" );
            updateTheButton((data[i]), 2,"occupied" );
            updateTheButton((data[i]), 3,"notavailable" );
            
        }
    }
}



// ! function(t, define) {
//     define("kendo.data.signalr.min", ["kendo.data.min"], t)
// }(function() {
//     return function(t) {
//         var o = kendo.data.RemoteTransport.extend({
//             init: function(t) {
//                 var o, e = t && t.signalr ? t.signalr : {},
//                     n = e.promise;
//                 if (!n) throw Error('The "promise" option must be set.');
//                // if ("function" != typeof n.done || "function" != typeof n.fail) throw Error('The "promise" option must be a Promise.');
//                 if (typeof n.then != 'function')
//                 if (this.promise = n, o = e.hub, !o) throw Error('The "hub" option must be set.');
//                 if ("function" != typeof o.on || "function" != typeof o.invoke) throw Error('The "hub" option is not a valid SignalR hub proxy.');
//                 this.hub = o, kendo.data.RemoteTransport.fn.init.call(this, t)
//             },
//             push: function(t) {
//                 var o = this.options.signalr.client || {};
//                 o.create && this.hub.on(o.create, t.pushCreate), o.update && this.hub.on(o.update, t.pushUpdate), o.destroy && this.hub.on(o.destroy, t.pushDestroy)
//             },
//             _crud: function(o, e) {
//                 var n, i, r = this.hub,
//                     s = this.options.signalr.server;
//                 if (!s || !s[e]) throw Error(kendo.format('The "server.{0}" option must be set.', e));
//                 n = [s[e]], i = this.parameterMap(o.data, e), t.isEmptyObject(i) || n.push(i), this.promise.done(function() {
//                     r.invoke.apply(r, n).done(o.success).fail(o.error)
//                 })
//             },
//             read: function(t) {
//                 this._crud(t, "read")
//             },
//             create: function(t) {
//                 this._crud(t, "create")
//             },
//             update: function(t) {
//                 this._crud(t, "update")
//             },
//             destroy: function(t) {
//                 this._crud(t, "destroy")
//             }
//         });
//         t.extend(!0, kendo.data, {
//             transports: {
//                 signalr: o
//             }
//         })
//     }(window.kendo.jQuery), window.kendo
// }, "function" == typeof define && define.amd ? define : function(t, o, e) {
//     (e || o)()
// });