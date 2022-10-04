// Blocks are objects that are handled like characters/npcs
// but don't "do" anything except accept collision
// these can be leaves, walls, trees, etc.

class Block {
    constructor(x, y, options) {
        this.x = x;
        this.y = y;
        this.z = 0;
        this.w = 48;
        this.h = 48;
        this.d = 16;
        this.type = 'block';
        this.imgFile = '';  // Leave blank to add collision to a background
        this.color = '';    // Leave blank to add collision to a background
        this.img = new Image();
        this.img.src = this.imgFile;
        this.tags = ['immobile'];
        if (typeof options === 'object')
            for (var key of Object.keys(options)) {
                this[key] = options[key];
            }
    }

    step() {
        return
    }

    draw(camera) {
        if (this.color || this.imgFile) {
            let compareY = camera.y - this.y;
            let compareX = camera.x - this.x;
            if (game.debug) {
                ctx.fillStyle = "#00FF00";
                ctx.fillRect(game.window.w / 2 - compareX - (this.w / 2), game.window.h / 2 - compareY - (this.h / 2), this.w, this.h);
                ctx.fillStyle = "#000000";
                ctx.fillRect(game.window.w / 2 - compareX - 2, game.window.h / 2 - compareY - 2, 4, 4);
            } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(game.window.w / 2 - compareX - (this.w / 2), game.window.h / 2 - compareY - (this.h / 2), this.w, this.h);
            }
        }
    }

    collide() {
        return
    }

}

class JumpPad extends Block {
    constructor(x, y, options) {
        super(x, y, options);
        this.tags = ['immobile', 'nocollide']; //Made it nocollide so you can enter the space
    }

    collide(colliders) {
        // custom collide code "activates" the powerup
        for (const c of colliders) {
            if (c != this) {
                if (Math.abs(this.x - c.x) < this.w && Math.abs(this.y - c.y) < this.h) { // infinite heigft upwards (z)
                    if (Math.abs(c.z) <= 1) c.zspeed += 3 * ((Math.abs(c.xspeed) + Math.abs(c.yspeed)) / 2)
                }
            }
        }
    }
}

class DeathBlock extends Block {
    constructor(x, y, options) {
        super(x, y, options);
        this.tags = ['nocollide', 'immobile'];
        this.damageOnCollision = 0;
        if (typeof options === 'object')
            for (var key of Object.keys(options)) {
                this[key] = options[key];
            }
    }

    collide(colliders) {
        for (const c of colliders) {
            if (c != this)
                if (Math.abs(this.x - c.x) < this.w && Math.abs(this.y - c.y) < this.h && this.z < c.d && c.z < this.d) //depth of the block
                    c.hp -= this.damageOnCollision;

        }
    }
}
