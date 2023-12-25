class Game {
    constructor() {
        this.window = {
            w: 900,
            h: 600,
            dw: 900,
            dh: 600,
            cx: this.w / 2,
            cy: this.h / 2,
        }
        this.paused = false;
        this.debug = false;
        this.allID = 0;
        this.pauseMenu = new Menu_Pause([], new Rect(0, 0, 170, 170))
        this.player = new Player();
        this.lastTimestamp = 0;
        this.fps = 0;
    }

    /*
          :::::::: ::::::::::: :::::::::: :::::::::
        :+:    :+:    :+:     :+:        :+:    :+:
       +:+           +:+     +:+        +:+    +:+
      +#++:++#++    +#+     +#++:++#   +#++:++#+
            +#+    +#+     +#+        +#+
    #+#    #+#    #+#     #+#        #+#
    ########     ###     ########## ###
    */

    step() {
        // Advance the game's master tick counter
        this.ticks++;

        // The next two lines will always max screen
        this.window.h = window.innerHeight;
        this.window.w = window.innerWidth;
        this.player.camera.radius = Math.sqrt((this.window.w / 2) ** 2 + (this.window.h / 2) ** 2)

        canvas.width = this.window.w;
        canvas.height = this.window.h;

        if (!this.paused) {
            this.player.controller.read();

            this.match.step();

        } else {
            this.player.controller.read();
            this.pauseMenu.step();
        }

        // Move camera to next sensible target when player character is inactive or missing
        if (!this.player.character.active) {
            if (this.player.character.lastColNPC)
                if (this.player.character.lastColNPC.active)
                    this.player.camera.target = this.player.character.lastColNPC
                else
                    for (const npc of npcs) {
                        if (npc.active && npc.team == this.player.character.team)
                            this.player.camera.target = npc
                    }
            if (!this.player.camera.target)
                for (const npc of npcs) {
                    if (npc.active)
                        this.player.camera.target = npc
                }
        }

        //Update Camera Position
        if (this.player.camera.target) {
            this.player.camera.x = this.player.camera.target.HB.pos.x;
            this.player.camera.y = this.player.camera.target.HB.pos.y;
        }

        //Performance Check
        const currentTimestamp = performance.now();
        const elapsedMilliseconds = currentTimestamp - this.lastTimestamp;
        this.fps = Math.round(1000 / elapsedMilliseconds);

        // Update last timestamp
        this.lastTimestamp = currentTimestamp;

        //Draw game
        this.draw();
        if (this.paused)
            this.pauseMenu.draw();

    }

/*
          :::::::::  :::::::::      :::     :::       :::
         :+:    :+: :+:    :+:   :+: :+:   :+:       :+:
        +:+    +:+ +:+    +:+  +:+   +:+  +:+       +:+
       +#+    +:+ +#++:++#:  +#++:++#++: +#+  +:+  +#+
      +#+    +#+ +#+    +#+ +#+     +#+ +#+ +#+#+ +#+
     #+#    #+# #+#    #+# #+#     #+#  #+#+# #+#+#
    #########  ###    ### ###     ###   ###   ###
    */

    draw() {
        //Draw Map
        this.match.map.draw(this.player.character);

        //Draw Map Lighting
        this.match.map.lighting();

        //Draw HUD
        this.player.interface.drawHUD();

        //Draw Controller HUD
        this.player.controller.draw();
    }
    
}