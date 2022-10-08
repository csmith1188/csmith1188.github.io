class Map {
    constructor(options) {
        this.w = 7200;
        this.h = 4800;
        this.friction = 0.99;
        this.gravity = 1;
        this.gravityFriction = 0.9;
        this.maxSpeed = 20;
        this.collideDamageSpeed = 5;
        this.bgimg = new Image();
        this.bgimg.src = "img/maps/forest.png";
        this.blocks = [];
        this.debris = [];
        this.xwind = 0.005;
        this.ywind = 0.0;
        this.zwind = 0.005;
        // this.debris = function() {return new Debris(allID++, 0, 0, { imgFile: 'img/sprites/leaf1.png', w: 12, h: 12, z: 0 })}
        // this.debrisRate = 60;
        this.lightValue = [0, 0, 128, 0.25]
        if (typeof options == 'object')
            for (const setting of Object.keys(options)) {
                if (this[setting] !== undefined)
                    this[setting] = options[setting];
            }
    }

    draw() {
        ctx.drawImage(this.bgimg, (game.player.camera.x * -1) + game.window.w / 2, (game.player.camera.y * -1) + game.window.h / 2, this.w, this.h);
        // ctx.drawImage(this.bgimg, (player.x * -1), (player.y * -1), this.w, this.h);
    }

    step() {
        this.wind();
        //if debris length is
    }

    wind() {
        //This is supposed to change the wind randomly (drift)
    }

    lighting() {
        ctx.fillStyle = `rgba(${this.lightValue[0]}, ${this.lightValue[1]}, ${this.lightValue[2]}, ${this.lightValue[3]})`
        ctx.fillRect(0, 0, game.window.w, game.window.h);
    }

}