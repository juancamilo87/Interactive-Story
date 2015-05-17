var id;
var correct_latitude;
var correct_longitude;
var max_distance;
//x here means HTML paragraph element
function getLocation(interaction_id, given_latitude, given_longitude) {
	max_distance = 30;
    id = interaction_id;
    correct_latitude = given_latitude;
    correct_longitude = given_longitude;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    var latitude =  position.coords.latitude  
    var longitude = position.coords.longitude;	


    var distance = Math.root(Math.sqr(correct_latitude - latitude) + Math.sqr(correct_longitude - longitude));

    if(distance < max_distance)
    {
        give_feedback(id, 1);
        next_chapter();
    }
}


/*
var R = 6371000; // metres
var φ1 = lat1.toRadians();
var φ2 = lat2.toRadians();
var Δφ = (lat2-lat1).toRadians();
var Δλ = (lon2-lon1).toRadians();

var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

var d = R * c;
*/

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

