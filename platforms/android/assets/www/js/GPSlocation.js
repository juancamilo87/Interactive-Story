var id;
var correct_latitude;
var correct_longitude;
var max_distance;
//x here means HTML paragraph element
function getLocation(interaction_id) {

    db = window.sqlitePlugin.openDatabase({name: "stories.db"});
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM interactions WHERE interaction_id='"+interaction_id+"'", [], function(tx, res){
            var new_id = res.rows.item(0).gps_id;
                table = 'gps';

            if(new_id != null)
            {
                tx.executeSql('SELECT * FROM '+table+" WHERE "+ table+"_id='"+new_id+"'", [], function(tx, res){
                    id = interaction_id;
                    correct_latitude = res.rows.item(0).latitude;
                    correct_longitude = res.rows.item(0).longitude;
                    max_distance = 30;
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(showPosition, showError);
                    } else { 
                        alert("Geolocation is not supported by this browser.");
                    }



                });
            }   
        });

    }, errorCB);
}

function showPosition(position) {
    var latitude =  position.coords.latitude  
    var longitude = position.coords.longitude;	

    //fix distance formula
    var distance = calcCrow(correct_latitude, correct_longitude, latitude, longitude)/1000;

    if(distance < max_distance)
    {
        give_feedback(id, 1);
    }
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log ( "User denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            console.log ( "Location information is unavailable.")
            break;
        case error.TIMEOUT:
            console.log ( "The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            console.log ( "An unknown error occurred.")
            break;
    }
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}
