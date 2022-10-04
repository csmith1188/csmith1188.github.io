class Player {
    constructor() {
        this.character;
        this.controller;
        this.hud = {
            barW: 48
        }
    }

    drawHUD() {

        if (game.debug) {
            ctx.font = '12px serif';
            ctx.fillText(this.character.x, 10, 50);
            ctx.fillText(this.character.y, 10, 70);
        }

        ctx.fillStyle = "#000000";
        ctx.fillRect((game.window.w / 2) - (this.character.w / 2) - 1, (game.window.h / 2) + (this.character.h / 2) - 1, this.hud.barW + 2, 16);
        let healthBar = (this.character.hp / this.character.hp_max) * this.hud.barW;
        if (healthBar >= this.hud.barW) {
            healthBar = this.hud.barW;
            ctx.fillStyle = "#00FF00";
        } else if (healthBar >= this.hud.barW * (2/3)) {
            ctx.fillStyle = "#FF9900";
        } else if (healthBar >= this.hud.barW * (1/3)) {
            ctx.fillStyle = "#FFFF00";
        } else if (healthBar > 0) {
            ctx.fillStyle = "#FF0000";
        } else {
            healthBar = 1;
            ctx.fillStyle = "#FF0000";
        }
        ctx.fillRect((game.window.w / 2) - (this.character.w / 2), (game.window.h / 2) + (this.character.h / 2), healthBar, 4);

        let lungeBar = (this.character.power / this.character.power_max) * this.hud.barW;
        if (lungeBar >= this.hud.barW) {
            lungeBar = this.hud.barW;
            ctx.fillStyle = "#990099";
        } else {
            ctx.fillStyle = "#5555FF";
        }
        ctx.fillRect((game.window.w / 2) - (this.character.w / 2), (game.window.h / 2) + (this.character.h / 2) + 5, lungeBar, 4);


        let calcSpeed = (((Math.abs(this.character.xspeed) + Math.abs(this.character.yspeed)) / 2) / game.match.map.maxSpeed) * this.hud.barW;
        if (calcSpeed >= (this.character.maxSpeed / game.match.map.maxSpeed) * this.hud.barW) {
            ctx.fillStyle = "#FF9900";
        } else if (Math.abs(this.character.xspeed) >= game.match.map.collideDamageSpeed || Math.abs(this.character.xspeed) >= game.match.map.collideDamageSpeed) {
            ctx.fillStyle = "#FFFF00";
        } else {
            ctx.fillStyle = "#00FF00";
        }
        ctx.fillRect((game.window.w / 2) - (this.character.w / 2), (game.window.h / 2) + (this.character.h / 2) + 10, calcSpeed, 4);
    }
}