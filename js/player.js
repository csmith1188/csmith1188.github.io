class Player {
    constructor() {
        this.character;
        this.controller;
        this.camera;
        this.hud = {
            barW: 48
        }
        this.best = {
            air: 0,
            airtime: 0,
            speed: 0,
            damage: 0,
            lap: 0
        }
    }

    drawHUD() {
        let compareX = game.player.camera.x - game.player.character.x;
        let compareY = game.player.camera.y - game.player.character.y;

        ctx.fillStyle = "#000000";
        if (game.debug) {
            ctx.font = '12px consolas';
            ctx.fillText(this.character.x, 10, 80);
            ctx.fillText(this.character.y, 10, 95);
            let aimX = game.player.controller.aimX;
            let aimY = game.player.controller.aimY;
            if (aimX > 100) aimX = 100;
            if (aimX < -100) aimX = -100;
            if (aimY > 100) aimY = 100;
            if (aimY < -100) aimY = -100;
            ctx.fillRect((game.window.w / 2) + aimX, (game.window.h / 2) + aimY, 10, 10);

            /*
            ctx.moveTo((game.window.w / 2), (game.window.h / 2));

            ctx.beginPath();
            ctx.moveTo((game.window.w / 2), (game.window.h / 2)); // Start at center of player
            // radius is known radius value
            // aimX and aimY are the known cursor position
            let lY = 0;
            let lX = aimX/aimY * (x - aimY) + aimX  // What is "x"?
            if ( aimY > 0 ) // The upper circle
                lY = (100^2 - lX^2) ^ 1/2
            else // The lower circle
                lY = -(100^2 - lX^2) ^ 1/2
            ctx.lineTo((game.window.w / 2) + lX, (game.window.h / 2) + lY); // Put the end of the line here
            ctx.stroke(); // Make the line
            */
        }

        ctx.font = '12px consolas';
        ctx.fillText("Air:     " + game.player.best.air, 10, 20);
        ctx.fillText("Airtime: " + game.player.best.airtime, 10, 35);
        ctx.fillText("Speed:   " + game.player.best.speed, 10, 50);
        ctx.fillText("Lap:     " + game.player.best.lap, 10, 65);

        // Map locators
        ctx.fillStyle = "#FF0000";
        ctx.fillRect((game.player.camera.x / game.match.map.w) * game.window.w - 3, 0, 6, 6);
        ctx.fillRect((game.player.camera.x / game.match.map.w) * game.window.w - 3, game.window.h - 6, 6, 6);
        ctx.fillStyle = "#0000FF";
        ctx.fillRect(0, (game.player.camera.y / game.match.map.h) * game.window.h - 3, 6, 6);
        ctx.fillRect(game.window.w - 6, (game.player.camera.y / game.match.map.h) * game.window.h - 3, 6, 6);

        //Background
        ctx.fillStyle = "#000000";
        ctx.fillRect(game.window.w / 2 - compareX - (game.player.character.w / 2), game.window.h / 2 - compareY - (game.player.character.h / 2) + 48, this.hud.barW + 2, 16);
        //Health Bar
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
        ctx.fillRect(game.window.w / 2 - compareX - (game.player.character.w / 2) + 1, game.window.h / 2 - compareY - (game.player.character.h / 2) + 49, healthBar, 4);

        //power bar
        let lungeBar = (this.character.power / this.character.power_max) * this.hud.barW;
        if (lungeBar >= this.hud.barW) {
            lungeBar = this.hud.barW;
            ctx.fillStyle = "#990099";
        } else {
            ctx.fillStyle = "#9999FF";
        }
        ctx.fillRect(game.window.w / 2 - compareX - (game.player.character.w / 2) + 1, game.window.h / 2 - compareY - (game.player.character.h / 2) + 5 + 49, lungeBar, 4);

        //Speed bar
        let calcSpeed = (this.character.xytrueSpeed() / game.match.map.maxSpeed) * this.hud.barW;
        if (calcSpeed >= (this.character.maxSpeed / game.match.map.maxSpeed) * this.hud.barW) {
            ctx.fillStyle = "#FF9900";
        } else if (Math.abs(this.character.xspeed) >= game.match.map.collideDamageSpeed || Math.abs(this.character.yspeed) >= game.match.map.collideDamageSpeed) {
            ctx.fillStyle = "#FFFF00";
        } else {
            ctx.fillStyle = "#00FF00";
        }
        ctx.fillRect(game.window.w / 2 - compareX - (game.player.character.w / 2) + 1, game.window.h / 2 - compareY - (game.player.character.h / 2) + 10 + 49, calcSpeed, 4);
    }
}
