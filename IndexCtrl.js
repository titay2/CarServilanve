var root = "https://semasp04.semel.fi/TestCarsurveillanceBackend/api/";
var crudServiceBaseUrl =
  "https://semasp04.semel.fi/TestCarsurveillanceBackend/signalR/";
localStorage.clear();
var callCenterId = JSON.parse(localStorage.getItem("callCenterId") || "[]");
var areaFilter = JSON.parse(localStorage.getItem("areaFilter") || "[]");
var propertyFilter = JSON.parse(localStorage.getItem("propertyFilter") || "[]");
var vehicleFilter = JSON.parse(localStorage.getItem("vehicleFilter") || "[]");

findCallCenter();
findArea();

var filters = {
  operatingCompanyID: "",
  postingID: "",
  carNumber: "",
  carAndDriverAttributes: ""
};

//SET FILTER VALUES TO LOCAL STORAGE.
$("#inputCenter").on("input", function() {
  var opt = $('option[value="' + $(this).val() + '"]');
  var val = opt.attr("id");
  if ($.isNumeric(val)) {
    filters.operatingCompanyID = parseInt(val);
    setFiletr("callCenterId", val);
  }
});

$("#inputArea").on("input", function() {
  var opt = $('option[value="' + $(this).val() + '"]');
  var inp = opt.attr("id");
  setFiletr("areaFilter", inp);
  filters.postingID = parseInt(inp);
});

$("#propertyInput").on("change", function() {
  var input = $(this);
  var val = input.val();
  if (input.focusout()) {
    setFiletr("propertyFilter", val);
    filters.carAndDriverAttributes = val;
  }
});

$("#vihecle").on("change", function() {
  var input = $(this);
  var val = input.val();
  if (input.next()) {
    //if (input.focusout()) {
    setFiletr("vehicleFilter", val);
    filters.carNumber = parseInt(val);
  }
});

$("#clearLable").click(function() {
  clearevtg();
});

var allFleets = [];
//CONNECT TO THE SIGNAR, LOAD THE FIRST INPUTS FROM THE API, GET CHANGES FROM SIGNALR AND UPDATE UI.
// $.connection.hub.url = "http://localhost:8888/signalr";

$.connection.hub.url =
  "http://testcarsurveillanceworker.cloudapp.net:8080/signalr/hubs";

var fleet = $.connection.dispatchStatusHub;
fleet.client.dispatchStatusUpdate = function(update_array) {
  allFleets = allFleets.map(function(item) {
    var car = update_array.find(a => a.CarID == item.CarID);
    return car ? Object.assign(item, car) : item;
  });
  function getposting() {
    var resultposting;
    if (filters.postingID) {
      resultposting = allFleets.filter(function(o) {
        return o.PostingID === filters.postingID;
      });
    } else {
      resultposting = allFleets;
    }

    return new Promise(function(res, rej) {
      res(resultposting);
    });
  }
  getposting()
    .then(function(result) {
      var resultOcId;
      if (filters.operatingCompanyID) {
        resultOcId = result.filter(function(o) {
          return o.OperatingCompanyID === filters.operatingCompanyID;
        });
      } else {
        resultOcId = result;
      }

      return resultOcId;
    })
    .then(function(result) {
      var resultCarNum;
      if (filters.carNumber) {
        resultCarNum = result.filter(function(o) {
          return o.CarNumber === filters.carNumber;
        });
      } else {
        resultCarNum = result;
      }

      return resultCarNum;
    })
    .then(function(result) {
      var resultAttribute;
      if (filters.carAndDriverAttributes) {
        resultAttribute = result.filter(function(o) {
          if (o.CarAndDriverAttributes !== null) {
            return (
              // o.carAndDriverAttributes.indexOf(filters.carAndDriverAttributes) >
              // -1
              o.CarAndDriverAttributes === filters.carAndDriverAttributes
            );
          }
        });
      } else {
        resultAttribute = result;
      }

      return resultAttribute;
    })

    .then(function(result) {
      updateStatus(result, 0, "freecars");
      updateStatus(result, 1, "soonfh");
      updateStatus(result, 2, "occupied");
      updateStatus(result, 3, "notavailable");
    });
};
$.connection.hub.start().done(function() {
  fleet.server.getFleetDispatchInfo().done(function(getAllLogs) {
    allFleets = getAllLogs;
  });
});

function updateStatus(data, num, id) {
  var count;
  document.getElementById(id).innerHTML = 0;
  for (var i in data) {
    if (data.hasOwnProperty(i)) {
      if (data[i].DispatchStatus === num) {
        count = data.reduce(function(n, status) {
          return n + (status.DispatchStatus == num);
        }, 0);
        document.getElementById(id).innerHTML = count;
      } else {
      }
    }
  }
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
        $("#inputCenter").append(callCenter);
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
        $("#inputArea").append(postingArea);
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("error: " + textStatus + ": " + errorThrown);
    }
  });
}
function clearevtg() {
  localStorage.removeItem("callCenterId");
  localStorage.removeItem("areaFilter");
  localStorage.removeItem("propertyFilter");
  localStorage.removeItem("vehicleFilter");
  filters = {
    operatingCompanyID: "",
    postingID: "",
    carNumber: "",
    carAndDriverAttributes: ""
  };
  $("#inputCenter").val("");
  $("#inputArea").val("");
  $("#propertyInput").val("");
  $("#vihecle").val("");
}
//SETS DATA TO LOCALSTORAGE
function setFiletr(storageField, inputValue) {
  localStorage.setItem(storageField, JSON.stringify(inputValue));
}
