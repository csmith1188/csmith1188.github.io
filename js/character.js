class Character {
    constructor(spawnx, spawny) {
        this.active = true;
        //Location
        this.x = spawnx;
        this.y = spawny;
        this.w = 48;
        this.h = 48;
        //Speed
        this.xspeed = 0;
        this.yspeed = 0;
        this.maxSpeed = 8;
        this.speedMulti = 0.25;
        this.frictionMulti = 1;
        this.brakes = 0.95;
        this.lungeSpeed = 5;
        this.lungePower = 300;
        this.lungePower_max = 300;
        this.lungeCost = 100;
        //Stats
        this.hp = 100;
        this.hp_max = 100;
        //Graphics
        this.img = new Image();
        this.rightgfx = 'img/sprites/jetbike.png';
        this.leftgfx = 'img/sprites/jetbike_l.png';
        this.bot = false;
    }

    step = function (controller) {
        //Movement
        if (this.active) {
            // Gravity
            this.yspeed += game.match.map.gravity;
            // Friction
            this.xspeed *= game.match.map.friction * this.frictionMulti;
            this.yspeed *= game.match.map.friction * this.frictionMulti;
            if (!this.bot) this.userInput(controller);
            else this.AI();
            // Slow down when hitting max speed
            if (this.xspeed > game.match.map.maxSpeed) this.xspeed = game.match.map.maxSpeed;
            else if (this.xspeed < game.match.map.maxSpeed * -1) this.xspeed = game.match.map.maxSpeed * -1;
            if (this.yspeed > game.match.map.maxSpeed) this.yspeed = game.match.map.maxSpeed;
            else if (this.yspeed < game.match.map.maxSpeed * -1) this.yspeed = game.match.map.maxSpeed * -1;
            // Change the graphics based on direction
            if (controller.left < controller.right) this.img.src = this.rightgfx;
            if (controller.left > controller.right) this.img.src = this.leftgfx;
            // Make the move
            this.x += this.xspeed;
            this.y += this.yspeed;

            // Check for out of bounds
            if (this.x + (this.w / 2) > game.match.map.w) {
                this.x = game.match.map.w - (this.w / 2);
                if (Math.abs(this.xspeed) > game.match.map.collideDamageSpeed) this.hp -= Math.abs(this.xspeed);
                this.xspeed *= -0.5;
            }
            if (this.x < (this.w / 2)) {
                this.x = (this.w / 2);
                if (Math.abs(this.xspeed) > game.match.map.collideDamageSpeed) this.hp -= Math.abs(this.xspeed);
                this.xspeed *= -0.5;
            }
            if (this.y + (this.h / 2) > game.match.map.h) {
                this.y = game.match.map.h - (this.h / 2);
                if (Math.abs(this.yspeed) > game.match.map.collideDamageSpeed) this.hp -= Math.abs(this.yspeed);
                this.yspeed *= -0.5;
            }
            if (this.y < (this.h / 2)) {
                this.y = (this.h / 2);
                if (Math.abs(this.yspeed) > game.match.map.collideDamageSpeed) this.hp -= Math.abs(this.yspeed);
                this.yspeed *= -0.5;
            }
        }
    }

    AI() {
        return
    }

    userInput(controller) {
        // Brakes
        this.xspeed *= ((controller.shift) ? this.brakes : 1)
        this.yspeed *= ((controller.shift) ? this.brakes : 1)
        // Lunge
        if (this.lungePower < this.lungePower_max) this.lungePower++;
        if (controller.alt.current != controller.alt.last && this.lungePower >= this.lungeCost) {
            if (controller.alt.current) {
                if (controller.right) this.xspeed += this.lungeSpeed;
                if (controller.left) this.xspeed -= this.lungeSpeed;
                if (controller.down) this.yspeed += this.lungeSpeed;
                if (controller.up) this.yspeed -= this.lungeSpeed;
                this.lungePower -= this.lungeCost;
            }
            controller.alt.last = controller.alt.current;
        }
        // TODO: Account for moving both directions at once goign too fast
        // Apply player input and character speed if not going faster than max speed
        if (controller.right && this.xspeed < this.maxSpeed) this.xspeed += controller.right * this.speedMulti;
        else if (controller.left && this.xspeed > this.maxSpeed * -1) this.xspeed -= controller.left * this.speedMulti;
        if (controller.up && this.yspeed > this.maxSpeed * -1) this.yspeed -= controller.up * this.speedMulti;
        else if (controller.down && this.yspeed < this.maxSpeed) this.yspeed += controller.down * this.speedMulti;
    }

    draw = function (match) {
        ctx.drawImage(this.img, (game.window.w / 2) - (this.w / 2), (game.window.h / 2) - (this.h / 2), this.w, this.h);
    }

    collide(colliders) {
        for (const c of colliders) {
            if (c != this && this.isCollide(this, c)) {
                // console.log(this.isCollide(this, c));
            }
        }
    }

    isCollide(m, c) {
        const rightCol = () => { return c.x > m.x && m.x < c.x + c.w; }
        const leftCol = () => { return c.x > m.x + m.w && m.x + m.w < c.x + c.w; }
        const topCol = () => {return c.y > m.y && m.y < c.y + c.h;}
        const botCol = () => {return c.y > m.y + m.h && m.y + m.h < c.y + c.h;}
        return {r: rightCol(), l: leftCol(), t: topCol(), b: botCol()}
    }
}

// AI
// Slow down overall speed if many obstructions in region
// Scan for objects that get closer
// Brake and Strafe away from obstacles while chasing
// Boost or shoot if you can draw a straight line with no collision

class Enemy extends Character {
    constructor(spawnx, spawny, target) {
        super(spawnx, spawny);
        this.bot = true;
        this.target = target;
        // Less friction means more speed and less control
        this.frictionMulti = Math.random() * 0.1
        this.speedMulti = 0.65 - (this.frictionMulti * 3);
        this.frictionMulti += 0.9;
        console.log(this.frictionMulti);
        this.rightgfx = 'img/sprites/dark1.png';
        this.leftgfx = 'img/sprites/dark1_l.png';
    }

    AI() {
        let compareX = (this.target.x - (this.target.w / 2)) - this.x;
        let compareY = (this.target.y - (this.target.h / 2)) - this.y;
        if (compareX > 0 && this.xspeed < this.maxSpeed) this.xspeed += this.speedMulti;
        else if (compareX <= 0 && this.xspeed > this.maxSpeed * -1) this.xspeed -= this.speedMulti;
        if (compareY < 0 && this.yspeed > this.maxSpeed * -1) this.yspeed -= this.speedMulti;
        else if (compareY >= 0 && this.yspeed < this.maxSpeed) this.yspeed += this.speedMulti;
    }

    draw = function (character) {
        let compareX = this.target.x - this.x;
        let compareY = this.target.y - this.y;
        ctx.drawImage(this.img, game.window.w / 2 - compareX, game.window.h / 2 - compareY, this.w, this.h);
    }

}