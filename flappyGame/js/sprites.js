/**
 * Created by brandon_overy on 11/13/15.
 */
// sprite variables
var fishSprite,
    backgroundSprite,
    foregroundSprite,
    topCoralSprite,
    bottomCoralSprite,
    splashScreenSprite,
    okButtonSprite;

// sprite constructor
function Sprite(img, x, y, width, height) {
    this.img = img;
    this.x = x*2;
    this.y = y*2;
    this.width = width*2;
    this.height = height*2;
}

// define draw method (prototype)
Sprite.prototype.draw = function(renderingContext, x, y) {
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
};

// initialize sprites
function initSprites(img) {
    fishSprite = [
        new Sprite(img, 176, 115, 42, 28),
        new Sprite(img, 176, 144, 42, 28),
        new Sprite(img, 176, 172, 42, 28)
    ];
    backgroundSprite = new Sprite(img, 0, 0, 138, 114);
    backgroundSprite.color = "#8BE4FD";
    foregroundSprite = new Sprite(img, 138, 0, 112, 56);
    //topCoralSprite = new Sprite();
    //bottomCoralSprite = new Sprite();
    //splashScreenSprite = new Sprite();
    okButtonSprite = new Sprite(img, 119, 191, 40, 14);
}