class Character {
    constructor(spawnx, spawny) {
        this.active = true;
        //Location
        this.x = spawnx;
        this.y = spawny;
        this.w = 32;
        this.h = 32;
        //Speed
        this.xspeed = 0;
        this.yspeed = 0;
        this.maxSpeed = 8;
        this.speedMulti = 0.25;
        this.brakes = 0.95;
        this.lungeSpeed = 5;
        this.lungePower = 300;
        this.lungePower_max = 300;
        //Stats
        this.hp = 1000;
        this.hp_max = 1000;
        //Graphics
        this.img = new Image();
        this.img.src = 'img/sprites/jetbike.png';

    }

    step = function (match, controller) {
        //Movement
        if (this.active) {
            // Gravity
            this.yspeed += match.map.gravity;
            // Friction
            this.xspeed *= match.map.friction;
            this.yspeed *= match.map.friction;
            // Brakes
            this.xspeed *= ((controller.shift) ? this.brakes : 1)
            this.yspeed *= ((controller.shift) ? this.brakes : 1)
            // Lunge
            if (this.lungePower < this.lungePower_max) this.lungePower++;
            if (controller.alt.current != controller.alt.last && this.lungePower >= 100) {
                if (controller.alt.current) {
                    if (controller.right) this.xspeed += this.lungeSpeed;
                    if (controller.left) this.xspeed -= this.lungeSpeed;
                    if (controller.down) this.yspeed += this.lungeSpeed;
                    if (controller.up) this.yspeed -= this.lungeSpeed;
                    this.lungePower -= 100;
                }
                controller.alt.last = controller.alt.current;
            }
            // TODO: Account for moving both directions at once goign too fast
            // Apply player input and character speed if not going faster than max speed
            if (controller.right && this.xspeed < this.maxSpeed) this.xspeed += controller.right * this.speedMulti;
            else if (controller.left && this.xspeed > this.maxSpeed * -1) this.xspeed -= controller.left * this.speedMulti;
            if (controller.up && this.yspeed > this.maxSpeed * -1) this.yspeed -= controller.up * this.speedMulti;
            else if (controller.down && this.yspeed < this.maxSpeed) this.yspeed += controller.down * this.speedMulti;
            // Slow down when hitting max speed
            if (this.xspeed > match.map.maxSpeed) this.xspeed = match.map.maxSpeed;
            else if (this.xspeed < match.map.maxSpeed * -1) this.xspeed = match.map.maxSpeed * -1;
            if (this.yspeed > match.map.maxSpeed) this.yspeed = match.map.maxSpeed;
            else if (this.yspeed < match.map.maxSpeed * -1) this.yspeed = match.map.maxSpeed * -1;
            // Change the graphics based on direction
            if (controller.left < controller.right) this.img.src = 'img/sprites/jetbike.png';
            if (controller.left > controller.right) this.img.src = 'img/sprites/jetbike_l.png';
            // Make the move
            this.x += this.xspeed;
            this.y += this.yspeed;

            // Check for out of bounds
            if (this.x + (this.w / 2) > match.map.w) {
                this.x = match.map.w - (this.w / 2);
                this.hp -= Math.abs(this.xspeed);
                this.xspeed *= -0.5;
            }
            if (this.x < (this.w / 2)) {
                this.x = (this.w / 2);
                this.xspeed *= -0.5;
                this.hp -= Math.abs(this.xspeed);
            }
            if (this.y + (this.h / 2) > match.map.h) {
                this.y = match.map.h - (this.h / 2);
                this.hp -= Math.abs(this.yspeed);
                this.yspeed *= -0.5;
            }
            if (this.y < (this.h / 2)) {
                this.y = (this.h / 2);
                this.hp -= Math.abs(this.yspeed);
                this.yspeed *= -0.5;
            }
        }
    }

    draw = function (match) {
        ctx.drawImage(this.img, (game.window.w / 2) - (this.w / 2), (game.window.h / 2) - (this.h / 2), this.w, this.h);
    }
}