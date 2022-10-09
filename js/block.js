// Blocks are objects that are handled like characters/npcs
// but don't "do" anything except accept collision
// these can be leaves, walls, trees, etc.


/*
      :::::::::  :::        ::::::::   ::::::::  :::    :::
     :+:    :+: :+:       :+:    :+: :+:    :+: :+:   :+:
    +:+    +:+ +:+       +:+    +:+ +:+        +:+  +:+
   +#++:++#+  +#+       +#+    +:+ +#+        +#++:++
  +#+    +#+ +#+       +#+    +#+ +#+        +#+  +#+
 #+#    #+# #+#       #+#    #+# #+#    #+# #+#   #+#
#########  ########## ########   ########  ###    ###
*/

class Block {
    constructor(id, x, y, options) {
        this.id = id;
        this.active = true;
        this.cleanup = false;
        this.startDelay = 0;
        this.x = x;
        this.y = y;
        this.z = 0;
        this.w = 48;
        this.h = 48;
        this.d = 16;
        this.frictionMulti = 1.0;
        this.shadow = 0;
        this.type = 'block';
        this.imgFile = '';  // Leave blank to add collision to a background
        this.color = '';    // Leave blank to add collision to a background
        this.img = new Image();
        this.img.src = this.imgFile;
        this.tags = ['immobile'];
        this.runFunc = function () { return }
        if (typeof options === 'object')
            for (var key of Object.keys(options)) {
                this[key] = options[key];
            }
        this.img.src = this.imgFile;
        this.startDelay = this.startDelay + ticks
    }

    step() {
        if (this.active && ticks >= this.startDelay)
            this.runFunc()
    }

    draw(options) {
        if (this.active && ticks >= this.startDelay) {
            let compareY = game.player.camera.y - this.y;
            let compareX = game.player.camera.x - this.x;
            if (this.imgFile) {
                ctx.drawImage(this.img, game.window.w / 2 - compareX - (this.w / 2), game.window.h / 2 - compareY - (this.h / 2) - this.z, this.w, this.h);
            } else if (this.color) {
                if (game.debug) {
                    ctx.fillStyle = "#00FF00";
                    ctx.fillRect(game.window.w / 2 - compareX - (this.w / 2), game.window.h / 2 - compareY - (this.h / 2), this.w, this.h);
                    ctx.fillStyle = "#000000";
                    ctx.fillRect(game.window.w / 2 - compareX - 2, game.window.h / 2 - compareY - 2, 4, 4);
                } else {
                    if (this.activeGoal) {
                        ctx.fillStyle = this.colorActive;
                        ctx.fillRect(game.window.w / 2 - compareX - (this.w / 2), game.window.h / 2 - compareY - (this.h / 2) - this.z, this.w, this.h);
                    } else {
                        ctx.fillStyle = this.color;
                        ctx.fillRect(game.window.w / 2 - compareX - (this.w / 2), game.window.h / 2 - compareY - (this.h / 2) - this.z, this.w, this.h);
                    }
                }
            }
        }
    }

    collide() {
        return
    }

}

/*
      ::::::::   ::::::::      :::     :::
    :+:    :+: :+:    :+:   :+: :+:   :+:
   +:+        +:+    +:+  +:+   +:+  +:+
  :#:        +#+    +:+ +#++:++#++: +#+
 +#+   +#+# +#+    +#+ +#+     +#+ +#+
#+#    #+# #+#    #+# #+#     #+# #+#
########   ########  ###     ### ##########
*/

class Goal extends Block {
    constructor(id, x, y, options) {
        super(id, x, y, options);
        this.tags = ['immobile', 'nocollide']; //Made it nocollide so you can enter the space
        this.activeGoal = false;
        this.type = 'goal';
        this.touchSFX = new Audio('sfx/coin_01.wav');
    }

    collide(colliders, options) {
        // custom collide code "activates" the powerup
        for (const c of colliders) {
            if (c != this) {
                //Goals collide infinitely upwards
                if (Math.abs(this.x - c.x) < this.w / 2 + (c.w / 2) && Math.abs(this.y - c.y) < this.h / 2 + (c.h / 2)) {
                    if (this.activeGoal && !c.bot) {
                        game.match.goalIndex++;
                        this.touchSFX.play();
                    } else
                        if (this == c.target) {
                            if (game.match.goals.indexOf(this) + 1 >= game.match.goals.length)
                                c.target = game.match.goals[0]
                            else
                                c.target = game.match.goals[game.match.goals.indexOf(this) + 1]
                        }
                }
            }
        }
    }
}

/*
    :::       :::     :::     :::     ::: ::::::::::
   :+:       :+:   :+: :+:   :+:     :+: :+:
  +:+       +:+  +:+   +:+  +:+     +:+ +:+
 +#+  +:+  +#+ +#++:++#++: +#+     +:+ +#++:++#
+#+ +#+#+ +#+ +#+     +#+  +#+   +#+  +#+
#+#+# #+#+#  #+#     #+#   #+#+#+#   #+#
###   ###   ###     ###     ###     ##########
*/

class Wave extends Block {
    constructor(id, x, y, options) {
        super(id, x, y, options);
        this.spawnX = x;
        this.spawnY = y;
        this.tags = ['immobile', 'nocollide']; //Made it nocollide so you can enter the space
        this.xspeed = 0;
        this.yspeed = 0; //Change this if you want the wave to fall off the map -_-
        this.dxspeed = 0;
        this.dyspeed = 0; //Change this if you want the wave to fall off the map -_-
        this.speedChange = false; //Can the speed of this be changed?
        this.bounce = false;
        this.repeat = 0;
        this.zforce = 1;
        this.xyforce = 0.05;
        if (typeof options === 'object')
            for (var key of Object.keys(options)) {
                this[key] = options[key];
            }
        this.img.src = this.imgFile;
        this.startDelay = this.startDelay + ticks
    }

    step() {
        if (this.active && ticks >= this.startDelay) {
            this.x += this.xspeed;
            this.y += this.yspeed;
            if (this.x > game.match.map.w || this.x < 0) {
                if (this.bounce) {
                    this.xspeed *= -1;
                }
                else
                    if (this.repeat) {
                        // this.active = false;
                        this.x = this.spawnX;
                        this.y = this.spawnY;

                    }

            }
            if (this.y > game.match.map.h || this.y < 0) {
                if (this.bounce) {
                    this.yspeed *= -1;
                }
                else
                    if (this.repeat) {
                        // this.active = false;
                        this.x = this.spawnX;
                        this.y = this.spawnY;
                    }
            }

            //Reset speed changes
            if (!this.speedChange) {
                if (this.xspeed > 0 && Math.abs(this.xspeed) != Math.abs(this.dxspeed)) this.xspeed = this.dxspeed;
                if (this.xspeed < 0 && Math.abs(this.xspeed) != Math.abs(this.dxspeed)) this.xspeed = this.dxspeed * -1;
            }
        }
    }

    collide(colliders, options) {
        if (this.active && ticks >= this.startDelay) {
            for (const c of colliders) {
                if (c != this) {
                    if (Math.abs(this.x - c.x) < this.w / 2 + (c.w / 2) && Math.abs(this.y - c.y) < this.h / 2 + (c.h / 2) && this.z < c.d && c.z < this.d) {
                        let compareX = c.x - this.x;
                        let compareY = c.y - this.y;
                        let xpeak = 1 - Math.abs(compareX) / (this.w / 2);
                        if (xpeak < 0) xpeak = 0;
                        let ypeak = 1 - Math.abs(compareY) / (this.h / 2);
                        if (ypeak < 0) ypeak = 0;
                        if (this.xspeed != 0 && Math.abs(this.xspeed) >= Math.abs(this.yspeed)) {
                            // X
                            //Same direction
                            if ((c.xspeed >= 0 && this.xspeed >= 0) || (c.xspeed < 0 && this.xspeed < 0))
                                c.zspeed += Math.abs(this.zforce * xpeak) * Math.abs(c.xspeed)
                            //Opposite
                            else if ((c.xspeed >= 0 && this.xspeed < 0) || (c.xspeed < 0 && this.xspeed >= 0))
                                c.zspeed += this.zforce * xpeak * Math.abs(c.xspeed) * 3
                        } else if (this.yspeed != 0) {
                            // Y
                            //Same direction
                            if ((c.yspeed >= 0 && this.yspeed >= 0) || (c.yspeed < 0 && this.yspeed < 0))
                            c.zspeed += Math.abs(this.zforce * ypeak) * Math.abs(c.yspeed)
                            //Opposite
                            else if ((c.yspeed >= 0 && this.yspeed < 0) || (c.yspeed < 0 && this.yspeed >= 0))
                            c.zspeed += Math.abs(this.zforce * ypeak) * Math.abs(c.yspeed) * 3
                            
                        } else {
                            c.zspeed += Math.abs(this.zforce * ypeak) * ((Math.abs(c.xspeed) + Math.abs(c.yspeed)) / 2)
                        }
                        c.xspeed += this.xspeed * this.xyforce * xpeak
                        c.yspeed += this.yspeed * this.xyforce * xpeak
                    }
                }
            }
        }
    }

    draw(options) {
        if (this.active && ticks >= this.startDelay) {
            let compareY = game.player.camera.y - this.y;
            let compareX = game.player.camera.x - this.x;
            if (this.imgFile) {
                ctx.drawImage(this.img, game.window.w / 2 - compareX - (this.w / 2), game.window.h / 2 - compareY - (this.h / 2) - this.z, this.w, this.h);
            } else if (this.color) {
                if (game.debug) {
                    ctx.fillStyle = "#00FF00";
                    ctx.fillRect(game.window.w / 2 - compareX - (this.w / 2), game.window.h / 2 - compareY - (this.h / 2), this.w, this.h);
                    ctx.fillStyle = "#000000";
                    ctx.fillRect(game.window.w / 2 - compareX - 2, game.window.h / 2 - compareY - 2, 4, 4);
                } else {
                    // Create gradient
                    let grd = ctx.createLinearGradient(game.window.w / 2 - compareX - (this.w / 2), 0, game.window.w / 2 - compareX - (this.w / 2) + this.w, 0);
                    grd.addColorStop(0, "rgba(0, 0, 255, 0.2)");
                    grd.addColorStop(0.5, "rgba(255, 255, 255, 0.8)"); //Crest point
                    grd.addColorStop(1, "rgba(0, 0, 255, 0.2)");
                    // Fill with gradient
                    ctx.fillStyle = grd;
                    ctx.fillRect(game.window.w / 2 - compareX - (this.w / 2), game.window.h / 2 - compareY - (this.h / 2), this.w, this.h);

                }
            }
        }
    }

}

/*
      :::::::::  :::::::::: :::::::::  :::::::::  ::::::::::: ::::::::
     :+:    :+: :+:        :+:    :+: :+:    :+:     :+:    :+:    :+:
    +:+    +:+ +:+        +:+    +:+ +:+    +:+     +:+    +:+
   +#+    +:+ +#++:++#   +#++:++#+  +#++:++#:      +#+    +#++:++#++
  +#+    +#+ +#+        +#+    +#+ +#+    +#+     +#+           +#+
 #+#    #+# #+#        #+#    #+# #+#    #+#     #+#    #+#    #+#
#########  ########## #########  ###    ### ########### ########
*/

class Debris extends Block {
    constructor(id, x, y, options) {
        super(id, x, y, options);
        this.tags = ['nocollide', 'immobile', 'debris'];
        this.cleanup = true;
        this.blown = false;
        this.z = 0;
        this.xspeed = 0;
        this.yspeed = 0;
        this.zspeed = 0;
        this.dxspeed = 0;
        this.dyspeed = 0;
        this.hover = 0;
        this.weight = 0.2;
        this.terminalVel = 1;
        this.alwaysDying = false;
        this.livetime = 300;
        this.gravity = true;
        this.landable = true;
        this.wind = true;
        this.contained = false; //Cannot leave the map boundaries
        this.jetphys = false; //Can the speed of this be changed?
        this.speedChange = true; //Can this have its speed changed from dspeed?
        if (typeof options === 'object')
            for (var key of Object.keys(options)) {
                this[key] = options[key];
            }
        this.img.src = this.imgFile;
    }

    step() {
        if (this.active && ticks >= this.startDelay) {
            if (this.livetime == 0) {
                this.active = false;
                return
            }

            if (this.active) {
                if (this.jetphys) {
                    this.xspeed *= game.match.map.friction * this.frictionMulti * this.weight;
                    this.yspeed *= game.match.map.friction * this.frictionMulti * this.weight;
                }

                // Gravity is true or false ( * 0 or * 1)
                if (this.z > 0 && this.zspeed > -1 * this.terminalVel) this.zspeed -= game.match.map.gravity * this.weight * this.frictionMulti * Number(this.gravity);

                this.x += this.xspeed;
                this.y += this.yspeed;
                this.z += this.zspeed;

                if (this.alwaysDying) {
                    this.livetime--;
                }

                if (this.z < this.hover * -1) {
                    if (!this.alwaysDying) this.livetime--;
                    this.z = this.hover * -1;
                    this.zspeed *= -1 * this.weight;
                    this.xspeed *= 0.85;
                    this.yspeed *= 0.85;
                }

                if (this.contained) {
                    if (this.x > game.match.map.w) this.xspeed *= -1;
                    if (this.x < 0) this.xspeed *= -1;
                    if (this.y > game.match.map.h) this.xspeed *= -1;
                    if (this.y < 0) this.xspeed *= -1;
                }

                //Reset speed changes
                if (!this.speedChange) {
                    if (this.xspeed > 0 && Math.abs(this.xspeed) != Math.abs(this.dxspeed)) this.xspeed = this.dxspeed;
                    if (this.xspeed < 0 && Math.abs(this.xspeed) != Math.abs(this.dxspeed)) this.xspeed = this.dxspeed * -1;
                }
            }
        }
    }

    collide(colliders, options) {
        if (this.active && ticks >= this.startDelay) {
            // can be blown around
            if (this.blown) {
                for (const c of colliders) {
                    if (c != this && c.team != undefined) {
                        if (Math.abs(this.x - c.x) < this.w / 2 + (c.w / 2) && Math.abs(this.y - c.y) < this.h / 2 + (c.h / 2) && this.z < c.d && c.z < this.d) {
                            // this.xspeed += c.xspeed * this.weight;
                            // this.yspeed += c.yspeed * this.weight;
                            // this.zspeed += c.zspeed * this.weight;
                        }
                    }
                }
            }
        }
    }

}

/*
      :::::::::      :::     :::        :::
     :+:    :+:   :+: :+:   :+:        :+:
    +:+    +:+  +:+   +:+  +:+        +:+
   +#++:++#+  +#++:++#++: +#+        +#+
  +#+    +#+ +#+     +#+ +#+        +#+
 #+#    #+# #+#     #+# #+#        #+#
#########  ###     ### ########## ##########
*/

class Ball extends Block {
    constructor(id, x, y, options) {
        super(id, x, y, options);
        this.tags = ['nodamage']; //Made it nocollide so you can enter the space
        this.type = 'ball';
        this.xspeed = 0;
        this.yspeed = 0;
        this.zspeed = 0;
        this.frictionMulti = 1.005;
    }

    step() {
        if (this.active) {
            // Friction
            this.xspeed *= game.match.map.friction * this.frictionMulti;
            this.yspeed *= game.match.map.friction * this.frictionMulti;
            if (this.z > 0) this.zspeed -= game.match.map.gravity;
            if (this.z < 0) this.zspeed += game.match.map.gravity;
            if (Math.abs(this.z) < 4) this.zspeed *= 0.8
            if (Math.abs(this.zspeed) < 0.2 && Math.abs(this.z) < 2) {
                this.zspeed = 0;
                this.z = 0;
            }
            this.zspeed *= game.match.map.gravityFriction * this.frictionMulti;
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
            if (this.z < this.hover * -1) {
                this.z = this.hover * -1;
                this.zspeed *= -1;
                if (game.debug) game.match.map.blocks.push(new Block(this.x, this.y, { color: '#0000FF', tags: ['immobile', 'nocollide'] }))
            }

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
        }
    }
}

/*
      :::::::::     :::     ::::::::: ::::::::::: ::::::::::: ::::::::  :::    ::: :::            ::: ::::::::::: ::::::::  :::::::::   ::::::::
     :+:    :+:  :+: :+:   :+:    :+:    :+:         :+:    :+:    :+: :+:    :+: :+:          :+: :+:   :+:    :+:    :+: :+:    :+: :+:    :+:
    +:+    +:+ +:+   +:+  +:+    +:+    +:+         +:+    +:+        +:+    +:+ +:+         +:+   +:+  +:+    +:+    +:+ +:+    +:+ +:+
   +#++:++#+ +#++:++#++: +#++:++#:     +#+         +#+    +#+        +#+    +:+ +#+        +#++:++#++: +#+    +#+    +:+ +#++:++#:  +#++:++#++
  +#+       +#+     +#+ +#+    +#+    +#+         +#+    +#+        +#+    +#+ +#+        +#+     +#+ +#+    +#+    +#+ +#+    +#+        +#+
 #+#       #+#     #+# #+#    #+#    #+#         #+#    #+#    #+# #+#    #+# #+#        #+#     #+# #+#    #+#    #+# #+#    #+# #+#    #+#
###       ###     ### ###    ###    ###     ########### ########   ########  ########## ###     ### ###     ########  ###    ###  ########
*/


/*
      :::::::::      :::      :::::::: ::::::::::: ::::::::          :::::::::     :::     :::::::::   ::::::::
     :+:    :+:   :+: :+:   :+:    :+:    :+:    :+:    :+:         :+:    :+:  :+: :+:   :+:    :+: :+:    :+:
    +:+    +:+  +:+   +:+  +:+           +:+    +:+                +:+    +:+ +:+   +:+  +:+    +:+ +:+
   +#++:++#+  +#++:++#++: +#++:++#++    +#+    +#+                +#++:++#+ +#++:++#++: +#+    +:+ +#++:++#++
  +#+    +#+ +#+     +#+        +#+    +#+    +#+                +#+       +#+     +#+ +#+    +#+        +#+
 #+#    #+# #+#     #+# #+#    #+#    #+#    #+#    #+#         #+#       #+#     #+# #+#    #+# #+#    #+#
#########  ###     ###  ######## ########### ########          ###       ###     ### #########   ########
*/

class JumpPad extends Block {
    constructor(id, x, y, options) {
        super(id, x, y, options);
        this.tags = ['immobile', 'nocollide']; //Made it nocollide so you can enter the space
        this.jumpBoost = 3;
    }

    collide(colliders, options) {
        // custom collide code "activates" the powerup
        for (const c of colliders) {
            if (c != this) {
                if (Math.abs(this.x - c.x) < this.w / 2 + (c.w / 2) && Math.abs(this.y - c.y) < this.h / 2 + (c.h / 2) && this.z < c.d && c.z < this.d) {
                    // if (Math.abs(c.z) <= 1)
                    c.zspeed += this.jumpBoost * ((Math.abs(c.xspeed) + Math.abs(c.yspeed)) / 2)
                }
            }
        }
    }
}

class SpeedPad extends Block {
    constructor(id, x, y, options) {
        super(id, x, y, options);
        this.tags = ['immobile', 'nocollide']; //Made it nocollide so you can enter the space
    }

    collide(colliders, options) {
        // custom collide code "activates" the powerup
        for (const c of colliders) {
            if (c != c.team != undefined) {
                if (Math.abs(this.x - c.x) < this.w / 2 + (c.w / 2) && Math.abs(this.y - c.y) < this.h / 2 + (c.h / 2) && this.z < c.d && c.z < this.d) {
                    c.xspeed *= 1.1
                    c.yspeed *= 1.1
                }
            }
        }
    }
}

class HealthBlock extends Block {
    constructor(id, x, y, options) {
        super(id, x, y, options);
        this.tags = ['nocollide', 'immobile'];
        this.healthCollide = 0;
        this.powerCollide = 0;
        if (typeof options === 'object')
            for (var key of Object.keys(options)) {
                this[key] = options[key];
            }
    }

    collide(colliders, options) {
        for (const c of colliders) {
            if (c != this)
                if (Math.abs(this.x - c.x) < this.w / 2 + (c.w / 2) && Math.abs(this.y - c.y) < this.h / 2 + (c.h / 2) && this.z < c.d && c.z < this.d) { //depth of the block
                    c.hp += this.healthCollide;
                    c.power += this.powerCollide;
                }
            if (c.hp > c.hp_max) c.hp = c.hp_max;
            if (c.power > c.power_max) c.power = c.power_max;
        }
    }
}

// class HealthItem extends Block {
//     constructor(id, x, y, options) {
//         super(id, x, y, options);
//         this.tags = ['immobile', 'nocollide']; //Made it nocollide so you can enter the space
//         this.healing = 50;
//     }
//     collide(colliders, options) {
//         // custom collide code "activates" the powerup
//         for (const c of colliders) {
//             if (c != this) {
//                 if (Math.abs(this.x - c.x) < this.w  / 2 + (c.w /2) && Math.abs(this.y - c.y) < this.h / 2  + (c.h /2) && this.z < c.d && c.z < this.d) {
//                     if (!c.bot) {
//                         c.hp += this.healing;
//                         game.match.map.blocks.splice(arr.findIndex(block => {return block.id === 3;})
//                     }
//                 }
//             }
//         }
//     }
// }
