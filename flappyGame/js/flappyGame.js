/**
 * Created by brandon_overy on 11/9/15.
 */
var canvas, renderingContext, width, height, floppyDude, startButton;
var clickText = "Click To Start";

function main() {
    canvasSetup();
    document.body.appendChild(canvas);
    loadGraphics();
}

function canvasSetup() {
    canvas = document.createElement("canvas");
    //Some styles will not work with canvas, so be careful with what you do here.
    canvas.style.border = "1px solid #CCC";

    //set html width & height properties
    canvas.width = 600;
    canvas.height = 400;
    //set renderingContext, which will now control the Canvas.
    renderingContext = canvas.getContext("2d");
}

function loadGraphics() {
    floppyDude = new Image();
    floppyDude.src = "images/cat.jpg";
    floppyDude.onload = function() {
        renderingContext.fillStyle = "#70C5CF";
        renderingContext.fillRect(0, 0, 600, 400);

        renderingContext.fillStyle = "#151515";
        renderingContext.font = "30px Arial";
        renderingContext.fillText(clickText,220,280);

        renderingContext.drawImage(floppyDude, 10, 10, 40, 40)
    };

    startButton = new Image();
    startButton.src = "images/start.png";
    startButton.onload = function() {
        renderingContext.drawImage(startButton, 260, 300, 80, 80)
    }

}