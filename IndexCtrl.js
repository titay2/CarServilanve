
  
var root  = "http://localhost:52273/api/";
var callCenterId = JSON.parse(localStorage.getItem('callCenterId') || '[]' )
var areaFilter = JSON.parse(localStorage.getItem('areaFilter') || '[]' )
var propertyFilter = JSON.parse(localStorage.getItem('propertyFilter') || '[]' )
var vehicleFilter = JSON.parse(localStorage.getItem('vehicleFilter') || '[]' )

findCallCenter();
findArea();

$("#inputCenter").on('input', function() {               
    var opt = $('option[value="' + $(this).val() + '"]');
    var val = opt.attr('id'); 
    if ($.isNumeric(val)) {
        setFiletr('callCenterId', val)
    }
})

$("#inputArea").on('input', function() {  
    console.log( $(this).val() )     
})

$("#propertyInput").on('change', function() {
    var input = $(this)
   //if(input.next()){
    if(input.focusout()){
    console.log( input.val() )
   }     
})

$("#vihecle").on('change', function() {
   var input = $(this)
   //if(input.next()){
    if(input.focusout()){
        setFiletr('vehicleFilter',input.val())
        console.log( localStorage.getItem('vehicleFilter'))
   }  
})

$("#clearLable").click( function () {
    localStorage.clear()
    $('#inputCenter').val("");
    $('#inputArea').val("");
    $('#propertyInput').val("");
    $('#vihecle').val("");
})   
 
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

function setFiletr(storageField, inputValue){
   
    localStorage.setItem(storageField, inputValue);

}
