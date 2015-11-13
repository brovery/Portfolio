/**
 * Created by brandon_overy on 11/9/15.
 */
var canvas,
    renderingContext,
    width,
    height,
    floppyDude,
    startButton,
    clickText = "Click To Start",
    foregroundPosition = 0,
    frames = 0,
    currentState,
    states = {
        Splash: 0,
        Game: 1,
        Score: 2
    };

function main() {
    canvasSetup();
    document.body.appendChild(canvas);
    loadGraphics();
}

function Fish() {
    this.x = 140;
    this.y = 0;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 1]; // The animation sequence

    this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.25;
    this._jump = 4.6;

    /**
     * Makes the Fish jump
     */
    this.jump = function () {
        this.velocity = -this._jump;
    };

    /**
     * Update sprite animation and position of Fish
     */
    this.update = function () {
// Play animation twice as fast during game state
        var n = currentState === states.Splash ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if (currentState === states.Splash) {
            this.updateIdleFish();
        } else { // Game state
            this.updatePlayingFish();
        }
    };

    /**
     * Runs the fish through its idle animation.
     */
    this.updateIdleFish = function () {
        this.y = height - 280 + 5 * Math.cos(frames / 10);
        this.rotation = 0;
    };

    /**
     * Determines fish animation for the player-controlled fish.
     */
    this.updatePlayingFish = function () {
        this.velocity += this.gravity;
        this.y += this.velocity;

// Change to the score state when fish touches the ground
        if (this.y >= height - foregroundSprite.height - 10) {
            this.y = height - foregroundSprite.height - 10;

            if (currentState === states.Game) {
                currentState = states.Score;
            }

            this.velocity = this._jump; // Set velocity to jump speed for correct rotation
        }

// When fish lacks upward momentum increment the rotation angle
        if (this.velocity >= this._jump) {
            this.frame = 1;
            this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
        } else {
            this.rotation = -0.3;
        }
    };

    /**
     * Draws Fish to canvas renderingContext
     * @param {CanvasRenderingContext2D} renderingContext the context used for drawing
     */
    this.draw = function (renderingContext) {
        renderingContext.save();

// translate and rotate renderingContext coordinate system
        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        var n = this.animation[this.frame];

// draws the fish with center in origo
        fishSprite[n].draw(renderingContext, -fishSprite[n].width / 2, -fishSprite[n].height / 2);

        renderingContext.restore();
    };
}

function onPress(evt) {
    switch (currentState) {
        case state.Splash: // Start the game and update the fish velocity
            currentState = state.Game;
            fish.jump();
            break;
        case state.Game: // Game is in progress. Update velocity
            fish.jump();
            break;
        case state.Score: //fish is dead, scores show up. Now switch back to splash screen.
            //get even location.
            var mouseX = evt.offsetX, mouseY = evt.offsetY;
            if(mouseX == null || mouseY == null) {
                mouseX = evt.touches[0].clientX;
                mouseY = evt.touches[0].clientY;
            }
            //check if hit button
            if(okButton.x < mouseX && mouseX < okButton.width && okButton.y < mouseY && mouseY < okButton.height) {
                currentState = state.Splash;
            }
            break;
    }
}

//define sizes with screen size.
function windowSetup() {
    // Retrieve the width and height of the window
    width = window.innerWidth;
    height = window.innerHeight;

    // Set the width and height if we are on a display with a width > 500px (e.g., a desktop or tablet environment).
    var inputEvent = "touchstart";
    if (width >= 500) {
        width = 380;
        height = 430;
        inputEvent = "mousedown";
    }

    // Create a listener on the input event.
    document.addEventListener(inputEvent, onpress);
}

function canvasSetup() {
    canvas = document.createElement("canvas");
    //Some styles will not work with canvas, so be careful with what you do here.
    canvas.style.border = "1px solid #CCC";

    //set html width & height properties
    canvas.width = width;
    canvas.height = height;
    //set renderingContext, which will now control the Canvas.
    renderingContext = canvas.getContext("2d");
}


function loadGraphics() {
    var img = new Image();
    img.src = "images/sheet.png";
    img.onload = function() {
        initSprites(this);
        renderingContext.fillStyle = backgroundSprite.color;

        //renderingContext.fillRect(0, 0, 600, 400);
        //
        //renderingContext.fillStyle = "#151515";
        //renderingContext.font = "30px Arial";
        //renderingContext.fillText(clickText,220,280);
        //
        //renderingContext.drawImage(floppyDude, 10, 10, 40, 40)
    };
    gameLoop();
    //startButton = new Image();
    //startButton.src = "images/start.png";
    //startButton.onload = function() {
    //    renderingContext.drawImage(startButton, 260, 300, 80, 80)
    //}
}

function gameLoop() {
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}

function update() {
    frames++;

    if (currentState !== states.Score) {
        foregroundPosition = (foregroundPosition - 2) % 14; // Move left two px each frame. Wrap every 14px.
    }

    if (currentState === states.Game) {
        //corals.update();
    }

    fish.update();
}

function render() {
    // Draw background color
    renderingContext.fillRect(0, 0, width, height);

    // Draw background sprites
    backgroundSprite.draw(renderingContext, 0, height - backgroundSprite.height);
    backgroundSprite.draw(renderingContext, backgroundSprite.width, height - backgroundSprite.height);

    //corals.draw(renderingContext);
    fish.draw(renderingContext);

    // Draw foreground sprites
    foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height);
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height);
}