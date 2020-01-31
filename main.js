var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

// Gato Singing
function Gato(game, spritesheet) {
    this.animation = new Animation(spritesheet, 280, 280, 3, .2, 6, true, 0.5);
    this.speed = 100;

    this.ctx = game.ctx;
    Entity.call(this, game, 500, 350);
}

Gato.prototype = new Entity();
Gato.prototype.constructor = Gato;

Gato.prototype.update = function () {

    // this.x += this.game.clockTick * this.speed;
    // if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Gato.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

// Chrono Walk
function Chrono(game, spritesheet) {
    this.animation = new Animation(spritesheet, 180, 280, 6, .2, 6, true, 0.5);
    this.shockedAnimation = new Animation(AM.getAsset("./img/chrono_shocked.png"), 240, 280, 1, .2, 1, true, 0.5);
    this.shocked = false;
    this.speed = 100;

    this.ctx = game.ctx;
    Entity.call(this, game, 0, 350);
}

Chrono.prototype = new Entity();
Chrono.prototype.constructor = Chrono;

Chrono.prototype.update = function () {
    
    if (this.x > 300) this.shocked = true;
    else this.x += this.game.clockTick * this.speed;

    if (this.shockedA) {
        this.shockedAnimation.elapsedTime = 0;
    }
    Entity.prototype.update.call(this);
}

Chrono.prototype.draw = function () {
    if(this.shocked) this.shockedAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    else this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/gato_singing.png");
AM.queueDownload("./img/chrono_walk.png");
AM.queueDownload("./img/chrono_shocked.png");
AM.queueDownload("./img/background.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.png")));
    gameEngine.addEntity(new Gato(gameEngine, AM.getAsset("./img/gato_singing.png")));
    gameEngine.addEntity(new Chrono(gameEngine, AM.getAsset("./img/chrono_walk.png")));

    console.log("All Done!");
});