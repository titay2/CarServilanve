var root = "https://semasp04.semel.fi/TestCarsurveillanceBackend/api/";
// $.connection.hub.url = "http://localhost:8888/signalr";
var fleet = $.connection.dispatchStatusTickerHub;
var zoneAndCarHub = $.connection.carsWithZonesTickerHub;
$.connection.hub.start();
$.connection.hub.url =
  "http://testcarsurveillanceworker.cloudapp.net:8080/signalr";
var updatedzoneAndCarsDs;
var allFleets = findAllFleets();
var allCarsAndZonesDS = new kendo.data.DataSource({
  transport: {
    read: {
      url: root + "ZonesAndCars/All",
      data: { format: "json" },
      dataType: "json"
    }
  },
  pageSize: 20,
  schema: {
    model: {
      id: "carNumber"
    }
  }
});
$("#zoneGrid").kendoGrid({
  dataSource: allCarsAndZonesDS,
  filterable: true
});
var filters = {
  operatingCompanyID: "",
  postingID: "",
  carNumber: "",
  carAndDriverAttributes: ""
};

localStorage.clear();
findCallCenter();
findArea();
filterEvents("#inputCenter", "callCenterId");
filterEvents("#inputArea", "areaFilter");
filterEvents("#vihecle", "vehicleFilter");
filterEvents("#propertyInput", "propertyFilter");
$("#clearLable").click(function() {
  clearevtg();
});

//CONNECT TO THE SIGNAR, LOAD THE FIRST INPUTS FROM THE API, GET CHANGES FROM SIGNALR AND UPDATE UI.
fleet.client.dispatchStatusUpdate = function(update_array) {
  allFleets = allFleets.map(function(item) {
    var car = update_array.find(a => a.carID == item.carID);
    return car ? Object.assign(item, car) : item;
  });
  var result = getfilteredzones(allFleets);
  updateStatus(result, 0, "freecars");
  updateStatus(result, 1, "soonfh");
  updateStatus(result, 2, "occupied");
  updateStatus(result, 3, "notavailable");
};

zoneAndCarHub.client.carsWithZoneUpdate = function(zonesAndCarsUpdate) {
  for (var i = 0; i < zonesAndCarsUpdate.length; i++) {
    var zoneAndCars = allCarsAndZonesDS.get(zonesAndCarsUpdate[i].carNumber);
    if (!zoneAndCars) {
      allCarsAndZonesDS.add(zonesAndCarsUpdate[i]);
    } else {
      zoneAndCars.set("zoneId", zonesAndCarsUpdate[i].zoneId);
      zoneAndCars.set(
        "dispatchStatusId",
        zonesAndCarsUpdate[i].dispatchStatusId
      );
      zoneAndCars.set("carString", zonesAndCarsUpdate[i].carString);
      zoneAndCars.set("statusTime", zonesAndCarsUpdate[i].statusTime);
    }
  }
  updatedzoneAndCarsDs = allCarsAndZonesDS._data;
};

function filterEvents(id, storage) {
  $(id).on("input", function() {
    var opt = $('option[value="' + $(this).val() + '"]');
    var val = opt.attr("id");

    if (val) {
      if ($.isNumeric(val)) {
        setFiletr(storage, val);
        if (id === "#inputCenter") {
          filters.operatingCompanyID = parseInt(val);
        }
        if (id === "#inputArea") {
          filters.postingID = parseInt(val);
        }
      }
    } else {
      var filter = $(this).val();
      setFiletr(storage, filter);
      if (id === "#vihecle") {
        filters.carNumber = parseInt(filter);
      }
      if (id === "#propertyInput") {
        filters.carAndDriverAttributes = filter;
      }
    }
  });
}

function updateStatus(data, num, id) {
  var count;
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
function findAllFleets() {
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
        $("#inputCenter").append(callCenter);
      });
    },
    error: function(textStatus, errorThrown) {
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
    error: function(textStatus, errorThrown) {
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
function clearFilter(id) {
  $("#clearLable").click(function() {
    if ($(id).data("kendoGrid")) {
      $(id)
        .data("kendoGrid")
        .dataSource.filter({});
    }
  });
}
//SETS DATA TO LOCALSTORAGE
function setFiletr(storageField, inputValue) {
  localStorage.setItem(storageField, JSON.stringify(inputValue));
}
//Filter data from signalR with the values from the top navbar filters
function getfilteredzones(allFleets) {
  var resultposting;
  if (filters.operatingCompanyID) {
    resultposting = allFleets.filter(function(o) {
      return o.operatingCompanyID === filters.operatingCompanyID;
    });
  } else {
    resultposting = allFleets;
  }

  if (filters.carNumber) {
    resultposting = resultposting.filter(function(o) {
      return o.carNumber === filters.carNumber;
    });
  }
  if (filters.carAndDriverAttributes) {
    resultposting = resultposting.filter(function(o) {
      if (o.carAndDriverAttributes !== null) {
        return (
          // o.carAndDriverAttributes.indexOf(filters.carAndDriverAttributes) >
          // -1
          o.carAndDriverAttributes === filters.carAndDriverAttributes
        );
      }
    });
  }
  if (filters.postingID) {
    resultposting = resultposting.filter(function(o) {
      return o.postingId === filters.postingID;
    });
  }
  return resultposting;
}
//TAKE FILTER VALUES FROM LOCALSTORAGE AND MODIFIES THE DATASOURCE ACCORDINGLY
function applyFilter(filterField, filterValue, grid, ds) {
  var currFilterObj = grid.dataSource.filter();
  var currentFilters = currFilterObj ? currFilterObj.filters : [];

  if (currentFilters && currentFilters.length > 0) {
    for (var i = 0; i < currentFilters.length; i++) {
      if (currentFilters[i].field == filterField) {
        currentFilters.splice(i, 1);
        break;
      }
    }
  }

  if (filterValue != "0") {
    if (filterField === "carDispatchAttributes") {
      currentFilters.push({
        field: filterField,
        operator: "contains",
        value: filterValue
      });
    } else {
      currentFilters.push({
        field: filterField,
        operator: "eq",
        value: filterValue
      });
    }
  }
  ds.filter({
    logic: "and",
    filters: currentFilters
  });
}
