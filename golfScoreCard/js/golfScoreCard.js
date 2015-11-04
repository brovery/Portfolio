//map crap
//http://openweathermap.org/appid
//var weatherAppId = "19a21ef97ff0f9444517d8fc89ef7a8d";
var accessToken, model, courseLatLon, map, hole = -1, players = [];
var courseID = 28069;

//checks to see if there is an accessToken
function onload() {
    var redirectURI = document.URL;
    var myClientID = "a9d8519f-09d8-40f7-92c8-8ebe837c29a7"; //This one is for localhost 63342
    //var myClientID = "a8302637-f515-41d4-b38a-9e13077809f7"; //This one is for localhost 63343.
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
            document.getElementById("holeSpan").innerHTML = model.course.hole_count;
            document.getElementById("parSpan").innerHTML = model.course.tee_types[1].par;
            document.getElementById("lengthSpan").innerHTML = model.course.tee_types[1].yards;
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
        var gHLatLon = new google.maps.LatLng(hLatLon.lat,hLatLon.lng);
        bounds.extend(gHLatLon);
        var hMarker = new google.maps.Marker({
            position: hLatLon,
            map: map,
            title: "Hole"
        });
        for (var i = 0; i < pinLatLons.length; i++) {
            var teeMarker = new google.maps.Marker({
                position: pinLatLons[i].latLng,
                map: map,
                title: pinLatLons[i].name
            });
            pointCount++; //Add counter to indicate whether we need to reset the zoom.
            var thisLatLng = new google.maps.LatLng(pinLatLons[i].latLng.lat,pinLatLons[i].latLng.lng);
            bounds.extend(thisLatLng); //Extend the bounds of the map.
        }
    }

    //This statement should change the zoom level of the map according to the placement of the markers.
    if (pointCount > 1) {
        map.fitBounds(bounds);
    }
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
        var myObj = {
            "latLng": model.course.holes[hole].tee_boxes[i].location,
            "name": model.course.holes[hole].tee_boxes[i].tee_color_type
        };
        arr.push(myObj);
    }
    return arr;
}

//centers the lat-lon between the first tee and the hole.
function centerMap(hLatLon, pLatLons) {
    var lat = (hLatLon.lat + pLatLons[0].latLng.lat) / 2;
    var lng = (hLatLon.lng + pLatLons[0].latLng.lng) / 2;
    return {"lat": lat, "lng": lng};
}

//Player creation section!
//Player initializer
function addPlayer(){
    var p1Name = document.getElementById("p1Name").value;
    var p1Cap = document.getElementById("p1Cap").value;
    var p1Tees = document.getElementById("p1Tees").value;
    var p2Name = document.getElementById("p2Name").value;
    var p2Cap = document.getElementById("p2Cap").value;
    var p2Tees = document.getElementById("p2Tees").value;
    var p3Name = document.getElementById("p3Name").value;
    var p3Cap = document.getElementById("p3Cap").value;
    var p3Tees = document.getElementById("p3Tees").value;
    var p4Name = document.getElementById("p4Name").value;
    var p4Cap = document.getElementById("p4Cap").value;
    var p4Tees = document.getElementById("p4Tees").value;

    if (p1Name !== "") {
        Player1 = new Player(p1Name,p1Cap,p1Tees);
        players.push(Player1);
    }
    if (p2Name !== "") {
        Player2 = new Player(p2Name,p2Cap,p2Tees);
        players.push(Player2);
    }
    if (p3Name !== "") {
        Player3 = new Player(p3Name,p3Cap,p3Tees);
        players.push(Player3);
    }
    if (p4Name !== "") {
        Player4 = new Player(p4Name,p4Cap,p4Tees);
        players.push(Player4);
    }

    //var parent = document.getElementById("playerScores");
    //var pNameDiv = "<div class='pScore'>"+pName.name+"</div>";
    //var scoreInput = "<select id='" + pName.name + "' class='form-control'><option>1</option><option>2</option><option>3</option>" +
    //    "<option>4</option><option>5</option><option>6</option><option>7</option><option>8</option></select>";
    //var scoreBtn = "<button type='button' class='btn btn-info' onclick='enterScore('" + pName.name + "')'>Enter Score</button></br>";
    //parent.innerHTML += pNameDiv+scoreInput+scoreBtn;
}

//Player object constructor.
function Player(name,handi,tees) {
    this.name = name;
    this.score = {};
    this.handicap = Number(handi);
    this.tee_color = tees;
    document.getElementById("players").innerHTML +=
        "<div class='playerDiv' id='"+this.name+"'>"+this.name+": Handicap: "+this.handicap+
        " Tees: "+this.tee_color+"</div>";
    this.setScore = function (hole, score) {
        this.score[hole] = score;
    };
    this.getTotalScore = function () {
        return this.score.reduce(function (a, b) {
            return a + b;
        }, 0);
    }
}

//Start the round & enter scores!

//starts the round: Loads the first hole map with markers, and the hole-buttons.
function startRound() {
    //TODO: Need to put an if statement here that ends the round if you've completed 18 holes.
    var parent = document.getElementById("golfScoreCard");
    var child = document.getElementById("start");
    parent.removeChild(child);
    child = document.getElementById("players");
    parent.removeChild(child);
    var holeLatLon = getHoleLoc(), pinLatLons = getPinLoc();
    var centerLatLon = centerMap(holeLatLon, pinLatLons);
    parent.innerHTML += "<button class='btn btn-info btn-lg' id='nextHole' onclick='nextHole()'>Next Hole</button>";
    parent.innerHTML += "<button class='btn btn-info btn-lg' id='enterScore' data-toggle='modal' data-target='#addScoreModal'>Enter Score</button>";
    initMap(centerLatLon, holeLatLon, pinLatLons);
}

//Starts the next hole.
function nextHole(){
    var holeLatLon = getHoleLoc(), pinLatLons = getPinLoc();
    var centerLatLon = centerMap(holeLatLon, pinLatLons);
    initMap(centerLatLon, holeLatLon, pinLatLons);
}

//Enters scores for the players.
function enterScore(name){
    console.log(name);
    name.score[hole] = document.getElementById(name);

    //TODO: This should grab the hole# we're on, and add to the player object a holenum:score key/value pair.
    //TODO: Or, perhaps it adds the score to the player score array. This will make it harder to determine what holes need to be done, if the player jumps around.
}

