var root = "https://semasp04.semel.fi/TestCarsurveillanceBackend/api/";
var crudServiceBaseUrl =
  "https://semasp04.semel.fi/TestCarsurveillanceBackend/signalR/";
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
  //if(input.next()){
  if (input.focusout()) {
    setFiletr("vehicleFilter", val);
    filters.carNumber = parseInt(val);
  }
});

$("#clearLable").click(function() {
  $("#inputCenter").val("");
  $("#inputArea").val("");
  $("#propertyInput").val("");
  $("#vihecle").val("");
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

  function getposting() {
    var resultposting;
    if (filters.postingID) {
      resultposting = array.filter(function(o) {
        return o.postingID === filters.postingID;
      });
    } else {
      resultposting = array;
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
          return o.operatingCompanyID === filters.operatingCompanyID;
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
          return o.carNumber === filters.carNumber;
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
          if (o.carAndDriverAttributes !== null) {
            return (
              // o.carAndDriverAttributes.indexOf(filters.carAndDriverAttributes) >
              // -1
              o.carAndDriverAttributes === filters.carAndDriverAttributes
            );
          }
        });
      } else {
        resultAttribute = result;
      }

      return resultAttribute;
    })
    .then(function(result) {
      var resultP;
      if (filters.postingID) {
        resultP = result.filter(function(o) {
          return o.postingID === filters.postingID;
        });
      } else {
        resultP = result;
      }

      return resultP;
    })
    .then(function(result) {
      updateStatus(result, 0, "freecars");
      updateStatus(result, 1, "soonfh");
      updateStatus(result, 2, "occupied");
      updateStatus(result, 3, "notavailable");
    });
};
$.connection.hub.start().done(function() {
  chat.server.getFleetDispatchInfo().done(function(getAllLogs) {});
});
// function getthefilter(data) {
//   return data;
// }

function updateStatus(data, num, id) {
  var count;
  // if (data.length == 0) {
  //   document.getElementById(id).innerHTML = 0;
  // } else {
  document.getElementById(id).innerHTML = 0;
  for (var i in data) {
    if (data.hasOwnProperty(i)) {
      if (data[i].dispatchStatus === num) {
        count = data.reduce(function(n, status) {
          return n + (status.dispatchStatus == num);
        }, 0);
        document.getElementById(id).innerHTML = count;
      } else {
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
