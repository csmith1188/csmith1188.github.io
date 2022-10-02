class Player {
    constructor() {
        this.character;
        this.controller;
    }
    drawHUD() {
        let healthBar = (this.character.hp / this.character.hp_max) * 150;
        if (healthBar >= 150) {
            healthBar = 150;
            ctx.fillStyle = "#00FF00";
        } else if (healthBar >= 100) {
            ctx.fillStyle = "#FF9900";
        } else if (healthBar >= 50) {
            ctx.fillStyle = "#FFFF00";
        } else {
            ctx.fillStyle = "#FF0000";
        }
        ctx.fillRect(game.window.w / 2 - 80, game.window.h - 130, healthBar, 10);

        let lungeBar = this.character.lungePower / 2;
        if (lungeBar >= 150) {
            lungeBar = 150;
            ctx.fillStyle = "#FF00FF";
        } else {
            ctx.fillStyle = "#0000FF";
        }
        ctx.fillRect(game.window.w / 2 - 80, game.window.h - 115, lungeBar, 10);

        let calcSpeed = (((Math.abs(this.character.xspeed) + Math.abs(this.character.yspeed)) / 2) / game.match.map.maxSpeed) * 150;
        if (calcSpeed >= (this.character.maxSpeed / game.match.map.maxSpeed) * 150) {
            ctx.fillStyle = "#FF9900";
        } else {
            ctx.fillStyle = "#00FF00";
        }
        ctx.fillRect(game.window.w / 2 - 80, game.window.h - 100, calcSpeed, 10);
    }
}