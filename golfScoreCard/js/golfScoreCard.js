//Need an object that stores the information about the course:

//scoreboard {
//    course {
//        holes{
//            teeW yardage //Women - red
//            teeM yardage // Men - white
//            teeC yardage //champ. - blue
//            teeP yardage //Pro. - black
//            par
//            map coordinates
//        }
//    }
//    //This part of the object builds the player's scores.
//    player {
//        Handicap //stores a value that
//        hole score {//stores a score for each hole. {
//            score
//            putts
//        }
//
//
//    }
//}


//Scorecard builder:
//Opens modal? that shows a score selector with score & # of putts.
//Probably need a way to change holes if necessary.
//reset button?

//map crap
//http://openweathermap.org/appid
var weatherAppId = "19a21ef97ff0f9444517d8fc89ef7a8d";
var accessToken, model, weather, courseLatLon, map, hole = -1;
var courseID = 28069;

//checks to see if there is an accessToken
function onload() {
    var redirectURI = document.URL;
    var myClientID = "a9d8519f-09d8-40f7-92c8-8ebe837c29a7";
    var authUrl = "https://api.swingbyswing.com/v2/oauth/authorize?scope=read&redirect_uri=" + redirectURI + "&response_type=token&client_id=" + myClientID;
    accessToken = getUrlVars().access_token;
    if (accessToken == null) {
        location.replace(authUrl);
    } else {
        accessToken = accessToken.replace("\n", "");
        getCourse(courseID);
    }
}

//decodes the url
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        });
    return vars;
}

//pulls the object data from swingbyswing.com.
function getCourse(id) {
    var courseAPI = "https://api.swingbyswing.com/v2/courses/" + id + "?includes=practice_area,nearby_courses,recent_media,recent_comments,recent_rounds,best_rounds,current_rounds,course_stats_month,course_stats_year&access_token=" + accessToken;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            model = JSON.parse(xhttp.responseText);
            courseLatLon = model.course.location;
            initMap(courseLatLon);
        }
    };
    xhttp.open("GET", courseAPI, true);
    xhttp.send();
}

function initMap(cLatLon, hLatLon, pinLatLons) {
    var pointCount = 1, bounds = new google.maps.LatLngBounds();
    var map = new google.maps.Map(document.getElementById('map'), {
        center: cLatLon,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    //Sets a marker for the course. If you're on a hole, sets the marker for the hole instead.
    if (hLatLon == null) {
        var cMarker = new google.maps.Marker({
            position: cLatLon,
            map: map,
            title: "Course"
        });
    } else {
        var hMarker = new google.maps.Marker({
            position: hLatLon,
            map: map,
            title: "Hole"
        });
        for (var i = 0; i < pinLatLons.length - 1; i++) {
            var teeMarker = new google.maps.Marker({
                position: pinLatLons[i],
                map: map,
                title: "pin" + i
            });
            pointCount++; //Add counter to indicate whether we need to reset the zoom.
            bounds.extend(pinLatLons[i]); //Extend the bounds of the map.
        }
    }

//This statement should change the zoom level of the map according to the placement of the markers.
    if (pointCount > 1) {
        map.fitBounds(bounds);
    }
}

//starts the round: Loads the first hole map with markers, and the hole-buttons.
function startRound() {
    var holeLatLon = getHoleLoc(), pinLatLons = getPinLoc();
    var centerLatLon = centerMap(holeLatLon, pinLatLons);
    initMap(centerLatLon, holeLatLon, pinLatLons);
    document.getElementById("startRound").innerHTML = "Next Hole";
}

//grabs the hole location.
function getHoleLoc() {
    hole++;
    return model.course.holes[hole].green_location;
}

//grabs the pin locations.
function getPinLoc() {
    var arr = [];
    for (var i = 0; i < model.course.holes[hole].tee_boxes.length-1; i++) {
        arr.push(model.course.holes[hole].tee_boxes[i].location);
    }
    return arr;
}

//centers the lat-lon between the first tee and the hole.
function centerMap(hLatLon, pLatLons) {
    var lat = (hLatLon.lat + pLatLons[0].lat) / 2;
    var lng = (hLatLon.lng + pLatLons[0].lng) / 2;
    return {"lat": lat, "lng": lng};
}

//Player creation section!

//Player object constructor.
function Player(name) {
    this.name = name;
    this.score = [];
    this.setScore = function (hole, score) {
        this.score[hole] = score;
    };
    this.getTotalScore = function () {
        return this.score.reduce(function (a, b) {
            return a + b;
        }, 0);
    }
}

