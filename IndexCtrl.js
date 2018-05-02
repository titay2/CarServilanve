var root = "https://semasp04.semel.fi/TestCarsurveillanceBackend/api/";
var crudServiceBaseUrl =
  "https://semasp04.semel.fi/TestCarsurveillanceBackend/signalR/";
var callCenterId = JSON.parse(localStorage.getItem("callCenterId") || "[]");
var areaFilter = JSON.parse(localStorage.getItem("areaFilter") || "[]");
var propertyFilter = JSON.parse(localStorage.getItem("propertyFilter") || "[]");
var vehicleFilter = JSON.parse(localStorage.getItem("vehicleFilter") || "[]");

findCallCenter();
findArea();

//SET FILTER VALUES TO LOCAL STORAGE.
$("#inputCenter").on("input", function() {
  var opt = $('option[value="' + $(this).val() + '"]');
  var val = opt.attr("id");
  if ($.isNumeric(val)) {
    setFiletr("callCenterId", val);
  }
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
chat.client.dispatchStatusUpdate = function(update) {
  updateStatusBar(update);
};
$.connection.hub.start().done(function() {
  chat.server.getFleetDispatchInfo().done(function(getAllLogs) {});
});

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
//CHANGING THE VALUES ON THE STATUS BUTTONS
function updateTheButton(status, num, id) {
  if (status.DispatchStatus === num) {
    document.getElementById(id).innerHTML = status.DispatchCount;
  }
}

// FINDS AND UPDATE THE EXACT BUTTON TO BE UPDATED
function updateStatusBar(data) {
  for (var i in data) {
    if (data.hasOwnProperty(i)) {
      updateTheButton(data[i], 0, "freecars");
      updateTheButton(data[i], 1, "soonfh");
      updateTheButton(data[i], 2, "occupied");
      updateTheButton(data[i], 3, "notavailable");
    }
  }
}
