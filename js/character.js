class Character {
    constructor(id, spawnx, spawny) {
        this.id = id;
        this.active = true;
        this.team = 0;
        //Location
        this.x = spawnx;
        this.y = spawny;
        this.z = 0;
        this.hover = 12;
        this.w = 48;
        this.h = 48;
        this.d = 16;
        //Speed
        this.xspeed = 0;
        this.yspeed = 0;
        this.zspeed = 0;
        this.maxSpeed = 8;
        this.speedMulti = 0.25;
        this.frictionMulti = 1;
        this.brakes = 0.5;
        this.lungeSpeed = 5;
        this.lungeCost = 100;
        this.jumpCost = 25;
        this.airtime = 0;
        this.weight = 1;
        //Stats
        this.hp = 100;
        this.hp_max = 100;
        this.power = 300;
        this.power_max = 300;
        this.threatMulti = 1;
        //Graphics
        this.img = new Image();
        this.gfx = 'img/sprites/jetbike';
        this.leftgfx = 'img/sprites/jetbike_l';
        this.img.src = this.gfx + '.png'
        this.bot = false;
        this.tags = [];
        //SFX
        this.touchSFX = new Audio('sfx/hardhit_01.wav');
        this.jumpSFX = new Audio('sfx/jump_01.wav');
        this.lungeSFX = new Audio('sfx/pup_01.wav');
        this.brakeSFX = new Audio('sfx/exp_01.wav');
        //Misc?
        this.lastColBlock = null;
        this.lastColNPC = null;
    }

    step(controller) {
        if (this.active) {
            if (this.power < this.power_max) this.power++;
            //Wind
            this.xspeed += game.match.map.xwind * (1 - this.weight);
            this.yspeed += game.match.map.ywind * (1 - this.weight);
            this.zspeed += game.match.map.zwind * (1 - this.weight);
            // Friction
            this.xspeed *= game.match.map.friction * this.frictionMulti;
            this.yspeed *= game.match.map.friction * this.frictionMulti;
            if (this.z > 0) {
                this.zspeed -= game.match.map.gravity;
                // High Score Tracking
                if (!this.bot) {
                    this.airtime++;
                    if (game.player.best.airtime < this.airtime) game.player.best.airtime = this.airtime
                }
            } else {
                this.airtime = 0;
            }
            if (this.z < 0) this.zspeed += game.match.map.gravity;
            if (Math.abs(this.z) < 4) this.zspeed *= 0.8
            if (Math.abs(this.zspeed) < 0.2 && Math.abs(this.z) < 2) {
                this.zspeed = 0;
                this.z = 0;
            }
            this.zspeed *= game.match.map.gravityFriction * this.frictionMulti;
            if (!this.bot) this.userInput(controller);
            else this.AI();
            // Slow down when hitting max speed
            if (this.xspeed > game.match.map.maxSpeed) this.xspeed = game.match.map.maxSpeed;
            else if (this.xspeed < game.match.map.maxSpeed * -1) this.xspeed = game.match.map.maxSpeed * -1;
            if (this.yspeed > game.match.map.maxSpeed) this.yspeed = game.match.map.maxSpeed;
            else if (this.yspeed < game.match.map.maxSpeed * -1) this.yspeed = game.match.map.maxSpeed * -1;
            // Make the move
            this.x += this.xspeed;
            this.y += this.yspeed;
            // Gravity
            this.z += this.zspeed;
            if (this.zspeed > 5)
                if (this.jumpSFX.duration <= 0 || this.jumpSFX.paused)
                    this.jumpSFX.play();
            if (this.z < this.hover * -1) {
                this.z = this.hover * -1;
                this.zspeed *= -1;
                this.xspeed *= 0.85;
                this.yspeed *= 0.85;
                if (game.debug) game.match.map.blocks.push(new Block(this.x, this.y, { color: '#0000FF', tags: ['immobile', 'nocollide'] }))
                game.match.map.blocks.push(new Block(this.x, this.y, { color: '#0000FF', tags: ['immobile', 'nocollide'] }))

            }
            // Break your records!
            if (!this.bot && game.player.best.air < this.z) game.player.best.air = this.z
            if (!this.bot && game.player.best.speed < (Math.abs(this.xspeed) + Math.abs(this.xspeed)) / 2) game.player.best.speed = (Math.abs(this.xspeed) + Math.abs(this.xspeed)) / 2

            // Check for out of bounds
            if (this.x + (this.w / 2) > game.match.map.w) {
                this.x = game.match.map.w - (this.w / 2);
                if (Math.abs(this.xspeed) > game.match.map.collideDamageSpeed) this.hp -= Math.abs(this.xspeed);
                this.xspeed *= -1;
            }
            if (this.x < (this.w / 2)) {
                this.x = (this.w / 2);
                if (Math.abs(this.xspeed) > game.match.map.collideDamageSpeed) this.hp -= Math.abs(this.xspeed);
                this.xspeed *= -1;
            }
            if (this.y + (this.h / 2) > game.match.map.h) {
                this.y = game.match.map.h - (this.h / 2);
                if (Math.abs(this.yspeed) > game.match.map.collideDamageSpeed) this.hp -= Math.abs(this.yspeed);
                this.yspeed *= -1;
            }
            if (this.y < (this.h / 2)) {
                this.y = (this.h / 2);
                if (Math.abs(this.yspeed) > game.match.map.collideDamageSpeed) this.hp -= Math.abs(this.yspeed);
                this.yspeed *= -1;
            }

            //Check HP
            if (this.hp <= 0) {
                this.active = false;
            }
        }
    }

    AI() {
        return
    }

    userInput(controller) {
        // Brakes
        if (controller.shift) this.zspeed -= this.brakes * 3;
        if (controller.shift)
            // if (this.brakeSFX.duration <= 0 || this.brakeSFX.paused)
            this.brakeSFX.play();
        // Lunge
        if (controller.alt.current != controller.alt.last && this.power >= this.lungeCost) {
            if (controller.alt.current) {
                if (this.lungeSFX.duration <= 0 || this.lungeSFX.paused)
                    this.lungeSFX.play();
                if (controller.right) this.xspeed += this.lungeSpeed;
                if (controller.left) this.xspeed -= this.lungeSpeed;
                if (controller.down) this.yspeed += this.lungeSpeed;
                if (controller.up) this.yspeed -= this.lungeSpeed;
                this.power -= this.lungeCost;
            }
            controller.alt.last = controller.alt.current;
        }
        if (controller.space && this.power >= this.jumpCost) {
            this.zspeed += 2
            this.power -= this.jumpCost
        }
        // TODO: Account for moving both directions at once goign too fast
        // Apply player input and character speed if not going faster than max speed
        if (controller.right && this.xspeed < this.maxSpeed) this.xspeed += controller.right * this.speedMulti;
        else if (controller.left && this.xspeed > this.maxSpeed * -1) this.xspeed -= controller.left * this.speedMulti;
        if (controller.up && this.yspeed > this.maxSpeed * -1) this.yspeed -= controller.up * this.speedMulti;
        else if (controller.down && this.yspeed < this.maxSpeed) this.yspeed += controller.down * this.speedMulti;
        // Change the graphics based on direction
        if (controller.left < controller.right) this.img.src = this.gfx + '.png';
        if (controller.left > controller.right) this.img.src = this.leftgfx + '.png';
    }

    draw() {
        if (game.debug) {
            ctx.fillStyle = "#FF0000";
            ctx.fillRect((game.window.w / 2) - (this.w / 2), (game.window.h / 2) - (this.h / 2), this.w, this.h);
            ctx.fillStyle = "#000000";
            ctx.fillRect((game.window.w / 2) - 2, (game.window.h / 2) - 2, 4, 4);
        } else {
            let compareX = game.player.camera.x - this.x;
            let compareY = game.player.camera.y - this.y;
            ctx.drawImage(this.img, game.window.w / 2 - compareX - (this.w / 2), game.window.h / 2 - compareY - (this.h / 2) - this.z, this.w, this.h);

        }
    }

    collide(colliders) {
        for (const c of colliders) {
            if (c != this) {
                if (Math.abs(this.x - c.x) < this.w / 2 + (c.w / 2) && Math.abs(this.y - c.y) < this.h / 2 + (c.h / 2) && this.z < c.d && c.z < this.d) {
                    // THERE WAS A COLLISION!
                    // Remember the things you collided with
                    if (c.team !== undefined) this.lastColNPC = c; //Only npcs have teams
                    else if (!c.tags.includes('debris')) this.lastColBlock = c;
                    let compareY = c.y - this.y;
                    let compareX = c.x - this.x;
                    if (!c.tags.includes('nocollide')) {
                        // Volume by distance
                        let calcSound = 1; //Couldn't figure it out. Plz help my poor ears
                        if (calcSound > 0) {
                            this.touchSFX.volume = calcSound;
                            this.touchSFX.play();
                        }
                        //Direction hit
                        if (Math.abs(compareX) > Math.abs(compareY)) { //side hit
                            if (this.x > c.x) this.x = c.x + c.w + 1;
                            else this.x = c.x - (this.w / 2) - (c.w / 2) - 1;
                            if (c.tags.includes('immobile')) {
                                if (!c.tags.includes('nodamage'))
                                    this.hp -= Math.abs(this.xspeed);
                            } else {
                                if (Math.abs(this.xspeed) > game.match.map.collideDamageSpeed) c.hp -= Math.abs(this.xspeed);
                                if (Math.abs(c.xspeed) > game.match.map.collideDamageSpeed) this.hp -= Math.abs(c.xspeed);
                                c.xspeed *= -1;
                                c.xspeed += this.xspeed;
                            }
                            if (!c.tags.includes('nobounce'))
                                this.xspeed *= -1;
                        } else { //top/bottom hit
                            if (this.y > c.y) this.y = c.y + c.h + 1;
                            else this.y = c.y - (this.h / 2) - (c.h / 2) - 1;
                            if (c.tags.includes('immobile')) {
                                if (!c.tags.includes('nodamage'))
                                    this.hp -= Math.abs(this.yspeed);
                            } else {
                                if (Math.abs(this.yspeed) > game.match.map.collideDamageSpeed) c.hp -= Math.abs(this.yspeed);
                                if (Math.abs(c.yspeed) > game.match.map.collideDamageSpeed) this.hp -= Math.abs(c.yspeed);
                                c.yspeed *= -1;
                                c.yspeed += this.yspeed;
                            }
                            if (!c.tags.includes('nobounce'))
                                this.yspeed *= -1;
                        }
                        // NEEDS TOP HIT!
                    }
                }
            }
        }
    }
}

// AI
// Slow down overall speed if many obstructions in region
// Scan for objects that get closer
// Brake and Strafe away from obstacles while chasing
// Boost or shoot if you can draw a straight line with no collision

class Enemy extends Character {
    constructor(id, spawnx, spawny, options) {
        super(id, spawnx, spawny);
        this.team = 1;
        this.formationRange = 0;
        this.nameTag = '';
        this.bot = true;
        this.target = null;
        this.hp = 100;
        this.hp_max = 100;
        // Less friction means more speed and less control
        this.frictionMulti = Math.random() * 0.1
        this.speedMulti = 0.65 - (this.frictionMulti * 3);
        this.frictionMulti += 0.9;
        this.gfx = 'img/sprites/dark1';
        this.hud = {
            barW: 48
        }
        if (typeof options === 'object')
            for (var key of Object.keys(options)) {
                this[key] = options[key];
            }
        this.leftgfx = this.gfx + '_l'; // Set this after options so you only have to set gfx
        this.img.src = this.gfx
    }

    AI() {
        if (this.target) {
            if (Math.abs(this.x - this.target.x) < this.w / 2 + (this.target.w / 2) + this.formationRange && Math.abs(this.y - this.target.y) < this.h / 2 + (this.target.h / 2) + this.formationRange && this.z < this.target.d && this.target.z < this.d) {
                //Already there
            } else {
                let compareX = this.target.x - this.x;
                let compareY = this.target.y - this.y;
                if (compareX > 0 && this.xspeed < this.maxSpeed) {
                    this.xspeed += this.speedMulti;
                    this.img.src = this.gfx + '.png';
                }
                else if (compareX <= 0 && this.xspeed > this.maxSpeed * -1) {
                    this.xspeed -= this.speedMulti;
                    this.img.src = this.leftgfx + '.png';
                }
                if (compareY < 0 && this.yspeed > this.maxSpeed * -1) this.yspeed -= this.speedMulti;
                else if (compareY >= 0 && this.yspeed < this.maxSpeed) this.yspeed += this.speedMulti;
            }

            if (this.target.team !== undefined) {
                if (this.target.team == this.team) this.formationRange = 100;
                else this.formationRange = 0;
                //The player can never receive a lastCOLNPC because the npc always hits first. this is also why kevin hits so hard
                // console.log(this.target);
                if (this.target.lastColNPC)
                    if (this.target.lastColNPC.team != this.team)
                        this.target = this.target.lastColNPC;
            }

            if (!this.target.active) {
                this.target = null;
                if (game.player.character.team != this.team && !game.player.character.active) {
                    this.target = game.player.character;
                } else {
                    for (const npc of game.match.npcs) {
                        if (npc.active && npc.team != this.team) {
                            this.target = npc
                        }
                    }
                    if (!this.target) this.target = game.match.goals[0];
                    if (!this.target) this.target = this;
                }
            }
        }
    }

    draw() {
        let compareY = game.player.camera.y - this.y;
        let compareX = game.player.camera.x - this.x;
        if (game.debug) {
            ctx.fillStyle = "#00FF00";
            ctx.fillRect(game.window.w / 2 - compareX - (this.w / 2), game.window.h / 2 - compareY - (this.h / 2), this.w, this.h);
            ctx.fillStyle = "#000000";
            ctx.fillRect(game.window.w / 2 - compareX - 2, game.window.h / 2 - compareY - 2, 4, 4);
        } else {
            ctx.drawImage(this.img, game.window.w / 2 - compareX - (this.w / 2), game.window.h / 2 - compareY - (this.h / 2) - this.z, this.w, this.h);
        }

        // ctx.fillStyle = "#000000";
        // ctx.fillRect((game.window.w / 2) - (this.character.w / 2) - 1, (game.window.h / 2) + (this.character.h / 2) - 1, this.hud.barW + 2, 16);
        let healthBar = (this.hp / this.hp_max) * this.hud.barW;
        if (healthBar >= this.hud.barW) {
            healthBar = this.hud.barW;
            ctx.fillStyle = "#00FF00";
        } else if (healthBar >= this.hud.barW * (2 / 3)) {
            ctx.fillStyle = "#FF9900";
        } else if (healthBar >= this.hud.barW * (1 / 3)) {
            ctx.fillStyle = "#FFFF00";
        } else if (healthBar > 0) {
            ctx.fillStyle = "#FF0000";
        } else {
            healthBar = 1;
            ctx.fillStyle = "#FF0000";
        }
        ctx.fillRect(game.window.w / 2 - compareX - (this.w / 2), game.window.h / 2 - compareY + (this.h / 2) - this.z, healthBar, 4);
        if (this.nameTag) {
            ctx.fillStyle = "#000000";
            ctx.font = '15px consolas';
            ctx.fillText(this.nameTag, game.window.w / 2 - compareX - (this.w / 2), game.window.h / 2 - compareY + (this.h / 2) - this.z + 15);
        }
    }

}