/**
 * Created by brandon_overy on 11/9/15.
 */

$(function() {
    //var can = document.getElementById("flappyCanvas");
    var mainDiv = document.getElementById("mainDiv");
    var startBtn = '<button type="button" class="myBtn btn btn-success btn-lg" onclick="startGame()">Start ></button>';
    mainDiv.style.backgroundImage = 'url("images/sky.jpg")';
    //mainDiv.innerHTML += startBtn;

    $("#mainDiv").append(startBtn);
});

function startGame() {
    console.log("started");
}