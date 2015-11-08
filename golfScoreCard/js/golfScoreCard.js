//map crap
//http://openweathermap.org/appid
//var weatherAppId = "19a21ef97ff0f9444517d8fc89ef7a8d";
var accessToken, model, courseLatLon, map, hole = 0, players = [], tees = [];
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
            scoreInit();
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
        var gHLatLon = new google.maps.LatLng(hLatLon.lat,hLatLon.lng); //I had to convert the object to google maps latlng for the fitbounds to work.
        bounds.extend(gHLatLon);
        var hMarker = new google.maps.Marker({
            position: hLatLon,
            map: map,
            title: "Hole"
        });
        for (var i = 0; i < pinLatLons.length; i++) {
            //TODO: Make the tee markers colored according to the tee color.
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
        addPlayerToScorecard(Player1);
        players.push(Player1);
    }
    if (p2Name !== "") {
        Player2 = new Player(p2Name,p2Cap,p2Tees);
        addPlayerToScorecard(Player2);
        players.push(Player2);
    }
    if (p3Name !== "") {
        Player3 = new Player(p3Name,p3Cap,p3Tees);
        addPlayerToScorecard(Player3);
        players.push(Player3);
    }
    if (p4Name !== "") {
        Player4 = new Player(p4Name,p4Cap,p4Tees);
        addPlayerToScorecard(Player4);
        players.push(Player4);
    }

    //This section builds the scoring modal.
    var parent = document.getElementById("playerScores");
    for (var i = 0; i<players.length; i++) {
        parent.innerHTML += '<div class="pScores" id="'+players[i].name+'">'+players[i].name+': </div>';
        parent.innerHTML += '<select class="form-control" id="'+players[i].name+'Select">' +
                '<option>1</option><option>2</option><option>3</option><option>4</option>'+
                '<option>5</option><option>6</option><option>7</option><option>8</option>';
        //TODO: Add an inline selector that will allow for entering putts. Will require restructuring score object.

    }

}

//Player object constructor.
function Player(name,handi,tees) {
    this.name = name;
    this.score = {};
    this.handicap = Number(handi);
    this.tee_color = tees;
    this.getTotalScore = function () {
        return this.score.reduce(function (a, b) {
            return a + b;
        }, 0);
    }
}

//Start the round & enter scores!

//starts the round: Loads the first hole map with markers, and the hole-buttons.
function startRound() {
    //Check if players have been entered.
    if (players.length == 0) {
        alert("Please enter player names before beginning the round.");
        return;
    }

    var parent = document.getElementById("golfScoreCard");
    var child = document.getElementById("start");
    var myHole = hole+1;
    document.getElementById("scoreModalHead").innerHTML = "Enter score for hole " + myHole;
    parent.removeChild(child);
    child = document.getElementById("players");
    parent.removeChild(child);
    var holeLatLon = model.course.holes[hole].green_location, pinLatLons = getPinLoc();
    var centerLatLon = centerMap(holeLatLon, pinLatLons);
    parent.innerHTML += "<button class='btn btn-info btn-lg' id='nextHole' onclick='nextHole()'>Next Hole</button>";
    parent.innerHTML += "<button class='btn btn-info btn-lg' id='enterScore' data-toggle='modal' data-target='#addScoreModal'>Enter Score</button>";
    initMap(centerLatLon, holeLatLon, pinLatLons);
}

//Starts the next hole.
function nextHole(){
    //.length statement takes you to scorecard if you've entered scores for all 18 holes.
    //hole statement takes you to scorecard if you're currently on hole 18 (17, since it's an array index).
    if (Object.keys(players[0].score).length === 18 || hole === 17) {
        openScore();
    }
    hole++;
    var myHole = hole+1; //hole is an array index, where index0 = hole 1.
    var holeLatLon = model.course.holes[hole].green_location;
    var pinLatLons = getPinLoc();
    var centerLatLon = centerMap(holeLatLon, pinLatLons);
    document.getElementById("scoreModalHead").innerHTML = "Enter score for hole " + myHole;
    initMap(centerLatLon, holeLatLon, pinLatLons);
}

//Enters scores for the players.
function enterScore(){
    //Need to grab the scores from the modal select (id: playerName+"Select").
    //Now I have the scores, so I need to add the scores to the player object's score object.

    for (var i = 0; i<players.length; i++) {
        //Enters score into the player object.
        var id = players[i].name+"Select";
        var score = document.getElementById(id).value;
        var thisHole = hole+1;
        players[i].score[thisHole] = score;
        //Enters the score into the scorecard.
        id = players[i].name+"Hole"+thisHole;
        document.getElementById(id).innerHTML = score;
    }


}

function scoreInit() {
//    TODO: This should create the scorecard div.
    var f9 = document.getElementById("frontNine");
    var b9 = document.getElementById("backNine");
    var f9Yards = 0, b9Yards = 0, f9yardageArr = [], b9yardageArr = [];

    //Grab tee colors, put into array. will use this for the pins as well, so I want them easily accessible.
    for (var i = 0; i < (model.course.holes[0].tee_boxes.length-1); i++) {
        tees.push(model.course.holes[0].tee_boxes[i].tee_color_type);
    }

    //Now that I have the tee colors, I need to add each tee's yardage to the scorecard.
    //Front9 loop. Figuring out how to create unique ID's takes thought.
    for (i = 0; i<tees.length; i++) {
        var tableText = "";
        f9Yards = 0;
        tableText += '<tr id="' + tees[i] + '">';
        tableText += '<td>' + tees[i] + '</td>';
        for (var j = 1; j<=9; j++) {
            tableText += '<td>' + model.course.holes[j-1].tee_boxes[i].yards + '</td>';
            f9Yards += model.course.holes[j-1].tee_boxes[i].yards;
        }
        tableText += '<td id="' + tees[i] + 'f9YardsTotal">' + f9Yards + '</td>';
        tableText += '<td id="b9Total' + tees[i] + '"></td>';
        tableText += '<td id="f9grandTotal' + tees[i] + '"></td>';
        tableText += '</tr>';
        f9.innerHTML += tableText;
        f9yardageArr.push(f9Yards);
    }
    //Back9 loop.
    for (i = 0; i<tees.length; i++) {
        tableText = "";
        b9Yards = 0;
        tableText += '<tr id="' + tees[i] + '">';
        tableText += '<td id="' + tees[i] + 'f9Total">' + f9yardageArr[i] + '</td>';
        tableText += '<td>' + tees[i] + '</td>';
        for (j = 10; j<=18; j++) {
            tableText += '<td>' + model.course.holes[j-1].tee_boxes[i].yards + '</td>';
            b9Yards += model.course.holes[j-1].tee_boxes[i].yards;
        }
        tableText += '<td>' + b9Yards + '</td>';
        tableText += '<td id="b9grandTotal' + tees[i] + '"></td>';
        tableText += '</tr>';
        b9.innerHTML += tableText;
        b9yardageArr.push(b9Yards);
    }

    //This loops through and adds some totals to the page.
    for (i = 0; i<b9yardageArr.length; i++) {
        var myId = "b9Total"+tees[i];
        document.getElementById(myId).innerHTML = b9yardageArr[i];
        myId = "f9grandTotal" + tees[i];
        document.getElementById(myId).innerHTML = b9yardageArr[i]+f9yardageArr[i];
        myId = "b9grandTotal" + tees[i];
        document.getElementById(myId).innerHTML = b9yardageArr[i]+f9yardageArr[i];
    }
}

//Adds the appropriate rows for the player object to the scorecard. There's probably an easier way to do this, but this works.
function addPlayerToScorecard(pObj) {
    var f9 = document.getElementById("frontNine");
    var b9 = document.getElementById("backNine");
    //Front9
    var text = "";
    text += '<tr id="' + pObj.name + 'f9ScoreRow">';
    text += '<td>' + pObj.name + '</td>';
    //need ID's on the individual hole scores so I can input values there. Hooray.
    for (var i = 1; i<=9; i++) {
        text += '<td id="' + pObj.name + 'Hole' + i + '"></td>';
    }
    text += '<td id="' + pObj.name + 'f9Total"></td>';
    text += '<td id="' + pObj.name + 'b9TotalForf9Table"></td>';
    text += '<td id="' + pObj.name + 'f9GrandTotal"></td>';
    text += '</tr>';
    f9.innerHTML += text;
    //Back9
    text = "";
    text += '<tr id="' + pObj.name + 'b9ScoreRow">';
    text += '<td id="' + pObj.name + 'f9TotalForb9Table"></td>';
    text += '<td>' + pObj.name + '</td>';
    //need ID's on the individual hole scores so I can input values there. i == 9, so have to change value.
    for (i = 10; i<=18; i++) {
        text += '<td id="' + pObj.name + 'Hole' + i + '"></td>';
    }
    text += '<td id="' + pObj.name + 'b9Total"></td>';
    text += '<td id="' + pObj.name + 'b9GrandTotal"></td>';
    text += '</tr>';
    b9.innerHTML += text;
}

//Opens the scoresheet, closes the map.
function openScore() {
    document.getElementById("map").style.display = "none";
    document.getElementById("f9Div").style.display = "table";
}

//Switches the front9 scoresheet with the back9 scoresheet.
function scoreSwitch(target) {
    if (target == "b9") {
        document.getElementById("f9Div").style.display = "none";
        document.getElementById("b9Div").style.display = "table";
    } else {
        document.getElementById("f9Div").style.display = "table";
        document.getElementById("b9Div").style.display = "none";
    }
}

//Goes to the hole selected.
function gotoHole(h) {
    document.getElementById("map").style.display = "block";
    document.getElementById("f9Div").style.display = "none";
    document.getElementById("b9Div").style.display = "none";
    hole = h-1;
    var myHole = hole+1; //hole is an array index, where index0 = hole 1.
    var holeLatLon = model.course.holes[hole].green_location;
    var pinLatLons = getPinLoc();
    var centerLatLon = centerMap(holeLatLon, pinLatLons);
    document.getElementById("scoreModalHead").innerHTML = "Enter score for hole " + myHole;
    initMap(centerLatLon, holeLatLon, pinLatLons);
}

//Finishes the round.
function finish() {
    var finished = true;
    for (var i = 0; i<players.length; i++) {
        if (Object.keys(players[i].score).length < 18) {
            finished = false;
        }
    }

    if (finished === false) {
        alert("WARNING! Not all scores have been entered.");
    }
    openScore();
}