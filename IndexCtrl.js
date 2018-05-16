var root = "https://semasp04.semel.fi/TestCarsurveillanceBackend/api/";
var crudServiceBaseUrl =
  "https://semasp04.semel.fi/TestCarsurveillanceBackend/signalR/";
var callCenterId = JSON.parse(localStorage.getItem("callCenterId") || "[]");
var areaFilter = JSON.parse(localStorage.getItem("areaFilter") || "[]");
var propertyFilter = JSON.parse(localStorage.getItem("propertyFilter") || "[]");
var vehicleFilter = JSON.parse(localStorage.getItem("vehicleFilter") || "[]");

findCallCenter();
findArea();
var test = [];
//SET FILTER VALUES TO LOCAL STORAGE.
$("#inputCenter").on("input", function() {
  var opt = $('option[value="' + $(this).val() + '"]');
  var val = opt.attr("id");
  if ($.isNumeric(val)) {
    test[0] = val;
    setFiletr("callCenterId", val);
  }
  console.log(test);
});

$("#inputArea").on("input", function() {
  var opt = $('option[value="' + $(this).val() + '"]');
  var inp = opt.attr("id");
  setFiletr("areaFilter", inp);
});

$("#propertyInput").on("change", function() {
  var input = $(this);
  var val = input.val();
  if (input.focusout()) {
    setFiletr("propertyFilter", val);
  }
});

$("#vihecle").on("change", function() {
  var input = $(this);
  var val = input.val();
  //if(input.next()){
  if (input.focusout()) {
    setFiletr("vehicleFilter", val);
  }
});

$("#clearLable").click(function() {
  localStorage.clear();
  location.reload();
  $("#inputCenter").val("");
  $("#inputArea").val("");
  $("#propertyInput").val("");
  $("#vihecle").val("");
});

//CONNECT TO THE SIGNAR, LOAD THE FIRST INPUTS FROM THE API, GET CHANGES FROM SIGNALR AND UPDATE UI.
$.connection.hub.url = "http://localhost:8888/signalr";
var chat = $.connection.dispatchStatusHub;
chat.client.dispatchStatusUpdate = function(update_array) {
  var array = findFleet();

  array = array.map(function(item) {
    var car = update_array.find(a => a.carID == item.carID);
    return car ? Object.assign(item, car) : item;
  });

  updateStatus(array, 0, "freecars");
  updateStatus(array, 1, "soonfh");
  updateStatus(array, 2, "occupied");
  updateStatus(array, 3, "notavailable");

  // var count = array.reduce(function(n, status) {
  //   return (
  //     n +
  //     (status.postingID == 91 &&
  //       status.carNumber == 0 &&
  //       status.carAndDriverAttributes == 0 &&
  //       status.operatingCompanyID == 0)
  //   );
  // }, 0);

  // var result = array.filter(function(adata) {
  //   return adata.DispatchStatus == 0 ;
  // });
};
$.connection.hub.start().done(function() {
  chat.server.getFleetDispatchInfo().done(function(getAllLogs) {});
});

function updateStatus(data, num, id) {
  for (var i in data) {
    if (data.hasOwnProperty(i)) {
      if (data[i].dispatchStatus === num) {
        var count = data.reduce(function(n, status) {
          return n + (status.dispatchStatus == num);
        }, 0);

        document.getElementById(id).innerHTML = count;
      }
    }
  }
}

function findFleet() {
  var result;
  $.ajax({
    url: root + "FleetStates/dispatchInfo",
    method: "GET",
    dataType: "json",
    async: false,
    success: function(data) {
      result = data;
    }
  });
  return result;
}

//POPULATE THE CALLCENTER INPUT OPTIONS WITH DATA FROM DATABASE
function findCallCenter() {
  $.ajax({
    url: root + "OperatingCompanies",
    method: "GET",
    dataType: "json",
    success: function(data) {
      $(data).each(function() {
        var callCenter =
          '<option id= "' +
          this.operatingCompanyId +
          '"  value="' +
          this.name +
          '">' +
          this.name +
          "</option>";
        $("#callcenter").append(callCenter);
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("error: " + textStatus + ": " + errorThrown);
    }
  });
}

//POPULATE THE AREA INPUT OPTIONS WITH DATA FROM DATABASE.
function findArea() {
  $.ajax({
    url: root + "Postings",
    method: "GET",
    dataType: "json",
    success: function(data) {
      $(data).each(function() {
        var postingArea =
          '<option id= "' +
          this.postingId +
          '" value="' +
          this.postingName +
          '">' +
          this.postingName +
          "</option>";
        $("#area").append(postingArea);
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("error: " + textStatus + ": " + errorThrown);
    }
  });
}

//SETS DATA TO LOCALSTORAGE
function setFiletr(storageField, inputValue) {
  localStorage.setItem(storageField, JSON.stringify(inputValue));
}
