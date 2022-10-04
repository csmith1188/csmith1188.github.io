class Player {
    constructor() {
        this.character;
        this.controller;
        this.hud = {
            barW: 48
        }
        this.best = {
            air: 0,
            airtime: 0,
            speed: 0,
            damage: 0
        }
    }

    drawHUD() {

        ctx.fillStyle = "#000000";

        if (game.debug) {
            ctx.font = '15px serif';
            ctx.fillText(this.character.x, 10, 50);
            ctx.fillText(this.character.y, 10, 70);
        }

        ctx.font = '12px Arial';
        ctx.fillText("Air:     " + game.player.best.air, 10, 20);
        ctx.fillText("Airtime: " + game.player.best.airtime, 10, 35);
        ctx.fillText("Speed:   " + game.player.best.speed, 10, 50);

        ctx.fillStyle = "#FF0000";
        ctx.fillRect((game.player.character.x / game.match.map.w) * game.window.w - 3, 0, 6, 6);
        ctx.fillRect((game.player.character.x / game.match.map.w) * game.window.w - 3, game.window.h - 6, 6, 6);
        ctx.fillStyle = "#0000FF";
        ctx.fillRect(0, (game.player.character.y / game.match.map.h) * game.window.h - 3, 6, 6);
        ctx.fillRect(game.window.w - 6, (game.player.character.y / game.match.map.h) * game.window.h - 3, 6, 6);


        ctx.fillStyle = "#000000";
        ctx.fillRect((game.window.w / 2) - (this.character.w / 2) - 1, (game.window.h / 2) + (this.character.h / 2) - 1, this.hud.barW + 2, 16);
        let healthBar = (this.character.hp / this.character.hp_max) * this.hud.barW;
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