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
        this.debrisAmount = 1000;
        this.debrisSpawn = function () {
            let tempx = Math.floor(Math.random() * this.w);
            let tempy = Math.floor(Math.random() * this.h * 1.5);
            return new Debris(allID++, tempx, tempy, { contained: false, imgFile: 'img/sprites/leaf1.png', w: 12, h: 12, z: this.h - (this.h - tempy) })
        }
        this.windH = 32; //z-height where wind takes place
        this.xwind = 2;
        this.ywind = 0;
        this.lightValue = [0, 0, 128, 0.25]
        if (typeof options == 'object')
            for (const setting of Object.keys(options)) {
                if (this[setting] !== undefined)
                    this[setting] = options[setting];
            }

    }

    postLoad() {
        //INIT DEBRIS
        for (let i = 0; i < 1000; i++) {
            let tempx = Math.floor(Math.random() * this.w);
            let tempy = Math.floor(Math.random() * this.h);
            this.debris.push(new Debris(allID++, tempx, tempy, { imgFile: 'img/sprites/leaf1.png', w: 12, h: 12, z: this.h - (this.h - tempy) }));
        }
        // THIS IS SUPPOSED TO FAST-FORWARD WIND DEBRIS BUT DOESN'T WORK
        // for (let i = 0; i < 60000; i++) {
        //     for (const e of this.debris) {
        //         e.step()
        //     }
        // }
    }

    draw() {
        ctx.drawImage(this.bgimg, (game.player.camera.x * -1) + game.window.w / 2, (game.player.camera.y * -1) + game.window.h / 2, this.w, this.h);
        // ctx.drawImage(this.bgimg, (player.x * -1), (player.y * -1), this.w, this.h);
    }

    step() {
        for (const e of this.debris) {
            if (e.cleanup && !e.active) {
                //Remove debris
                // console.log('removed');
                this.debris = this.debris.filter(function (el) { return el != e; });
            }
            if (this.debris.length < this.debrisAmount) {
                this.debris.push(this.debrisSpawn())
            }
        }
        this.wind();
    }

    wind() {

        for (const e of [game.player.character, ...game.match.npcs, ...this.blocks, ...this.debris]) {
            if (e.wind && e.z + e.hover >= (this.windH * ((e.landable) ? 1 : 0))) {
                e.x += this.xwind * (1 - e.weight);
                e.y += this.ywind * (1 - e.weight);
            }

        }
    }

    lighting() {
        ctx.fillStyle = `rgba(${this.lightValue[0]}, ${this.lightValue[1]}, ${this.lightValue[2]}, ${this.lightValue[3]})`
        ctx.fillRect(0, 0, game.window.w, game.window.h);
    }

}