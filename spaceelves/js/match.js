class Match {
    constructor() {
        this.startTicks = ticks;
        this.map = new Map();
        this.bots = [];
        this.blocks = []; // Different from map blocks. Think powerups and dropped items
        this.runFuncs = []; // A list of functions to run every step
    }

    step() {
        for (const e of this.bots) {
            if (e.cleanup && !e.active) {
                //Remove npcs
                this.npcs = this.npcs.filter(function (el) { return el != e; });
            }
        }

        // Run all runFuncs
        for (const func in this.runFucts) {
            func();
        }
    }
}
/*
      ::::::::      :::       :::   :::   ::::::::::            :::   :::    ::::::::  :::::::::  :::::::::: ::::::::
    :+:    :+:   :+: :+:    :+:+: :+:+:  :+:                  :+:+: :+:+:  :+:    :+: :+:    :+: :+:       :+:    :+:
   +:+         +:+   +:+  +:+ +:+:+ +:+ +:+                 +:+ +:+:+ +:+ +:+    +:+ +:+    +:+ +:+       +:+
  :#:        +#++:++#++: +#+  +:+  +#+ +#++:++#            +#+  +:+  +#+ +#+    +:+ +#+    +:+ +#++:++#  +#++:++#++
 +#+   +#+# +#+     +#+ +#+       +#+ +#+                 +#+       +#+ +#+    +#+ +#+    +#+ +#+              +#+
#+#    #+# #+#     #+# #+#       #+# #+#                 #+#       #+# #+#    #+# #+#    #+# #+#       #+#    #+#
########  ###     ### ###       ### ##########          ###       ###  ########  #########  ########## ########
*/
class Match_LoneWarrior extends Match {
    constructor() {
        super();
        this.map = new Map_FieldCity();
        this.name = "The Lone Warrior";
        this.description = "Survive against the endless waves of enemies.";
        this.waves = 0;
        this.waveTime = 2700; // 1 wave every 45 seconds  
        this.setup();
    }

    setup() {

        // if the ticks minus the starticks is less than 240 seconds, write the match name and description to the center of the screen
        this.map.drawFunc.push(
            function () {
                if (ticks - this.startTicks < 240) {
                    let alpha = 1 - (ticks - this.startTicks) / 240;
                    ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
                    ctx.font = "30px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText(this.name, game.window.w / 2, game.window.h / 2 - 30);
                    ctx.font = "20px Arial";
                    ctx.fillText(this.description, game.window.w / 2, game.window.h / 2 + 10);
                }
            }.bind(this)
        )


        this.map.blocks.push(new Block(allID++, (this.map.w / 2) - 300, (this.map.h / 2) - 0, 0, 128, 128, 64, { color: [101, 101, 101], colorSide: [201, 201, 201] }))
        // this.map.blocks[this.map.blocks.length - 1].HB.pos.z = 100;

        this.map.blocks.push(new Block(allID++, (this.map.w / 2), (this.map.h / 2), 0, 10, 10, 128, { color: [101, 101, 101], colorSide: [201, 201, 201] }))

        for (let i = 0; i < 30; i++) {
            let ran = function () { return Math.floor(Math.random() * 4) + 1 }
            this.map.blocks.push(new Block(allID++, Math.round(Math.random() * this.map.w), Math.round(Math.random() * this.map.h), 0, ran() * 32, ran() * 32, ran() * 32, { color: [101, 101, 101], colorSide: [201, 201, 201] }))
        }

        //ammo
        for (let i = 0; i < 10; i++) {
            this.map.blocks.push(new Ammo_Ballistic(allID++, Math.round(Math.random() * this.map.w), Math.round(Math.random() * this.map.h), 0, 128, 128, 64))
            this.map.blocks.push(new Ammo_Plasma(allID++, Math.round(Math.random() * this.map.w), Math.round(Math.random() * this.map.h), 0, 128, 128, 64))
            this.map.blocks.push(new HealthPickup(allID++, Math.round(Math.random() * this.map.w), Math.round(Math.random() * this.map.h), 0, 128, 128, 64))
        }

        // //wave
        // this.map.blocks.push(new Block(
        //     allID++,
        //     (this.map.w / 2) + 100,
        //     (this.map.h / 2) + 100,
        //     0, 32, 32, 16,
        //     { color: [50, 50, 255], colorSide: [150, 150, 250], solid: false, opacity: 0.5 }
        // ));
        // this.map.blocks[this.map.blocks.length - 1].runFunc.push(
        //     function () {
        //         this.HB.pos.z = sineAnimate(10, 0.05) + 10;
        //     }.bind(this.map.blocks[this.map.blocks.length - 1])
        // );
        // this.map.blocks[this.map.blocks.length - 1].trigger =
        //     function (actor, side) {
        //         actor.speed.z += sineAnimate(0.5, 0.05) + 0.5
        //     }.bind(this.map.blocks[this.map.blocks.length - 1]); //end wave

        // //wave
        // this.map.blocks.push(new Block(
        //     allID++,
        //     (this.map.w / 2) + 100,
        //     (this.map.h / 2) + 164,
        //     0, 32, 32, 16,
        //     { color: [50, 50, 255], colorSide: [150, 150, 250], solid: false, opacity: 0.5 }
        // ));
        // this.map.blocks[this.map.blocks.length - 1].runFunc.push(
        //     function () {
        //         this.HB.pos.z = sineAnimate(10, 0.05, 60) + 10 + 16;
        //     }.bind(this.map.blocks[this.map.blocks.length - 1])
        // );
        // this.map.blocks[this.map.blocks.length - 1].trigger =
        //     function (actor, side) {
        //         if (actor.HB.pos.z >= this.HB.pos.z)
        //             actor.speed.z += sineAnimate(0.5, 0.05) + 0.5
        //     }.bind(this.map.blocks[this.map.blocks.length - 1]); //end wave

        this.map.runFunc.push(
            () => {
                if (game.player.character.active && ticks % this.waveTime == 0) {
                    game.match.waves++; // 1 wave every 60 seconds

                    for (let i = 0; i < Math.ceil(this.waves / 2); i++) {
                        game.match.bots.push(new Bot()) //Kevin / Jae'Sin
                        game.match.bots[game.match.bots.length - 1].character = new Character(
                            allID++,
                            (this.map.w / 2),
                            (this.map.h / 2),
                            game.match.bots[game.match.bots.length - 1],
                            // { target: game.player.character, name: 'Jaysin', gfx: 'img/sprites/dark2', team: 1 }
                            {
                                target: game.player.character,
                                // target: game.match.bots[game.match.bots.length - 1].character,
                                name: getName(), team: 1, gfx: 'img/sprites/dark2', color: [0, 0, 255],
                                hover: 16, airAccel: new Vect3(0.15, 0.15, 1),
                                runFunc: [
                                    function () { }.bind(game.match.bots[game.match.bots.length - 1].character)
                                ]
                            }
                        );
                        game.match.bots[game.match.bots.length - 1].character.HB = new Cylinder(new Vect3(Math.round(Math.random() * this.map.w), Math.round(Math.random() * this.map.h), 0), 29, 37);
                        //ammo
                        for (let i = 0; i < 5; i++) {
                            this.map.blocks.push(new Ammo_Ballistic(allID++, Math.round(Math.random() * this.map.w), Math.round(Math.random() * this.map.h), 0, 128, 128, 64))
                            this.map.blocks.push(new Ammo_Plasma(allID++, Math.round(Math.random() * this.map.w), Math.round(Math.random() * this.map.h), 0, 128, 128, 64))
                            this.map.blocks.push(new HealthPickup(allID++, Math.round(Math.random() * this.map.w), Math.round(Math.random() * this.map.h), 0, 128, 128, 64))
                        }
                    }
                    if (ticks % this.waveTime * 2 == 0) {
                        let spawns = (this.waves > 1) ? Math.floor(this.waves / 4) : 1;
                        for (let i = 0; i < spawns; i++) {
                            // Friendly
                            game.match.bots.push(new Bot()) //Big ounce / Loh'Ghan
                            game.match.bots[game.match.bots.length - 1].character = new Character(
                                allID++,
                                (this.map.w / 2),
                                (this.map.h / 2),
                                game.match.bots[game.match.bots.length - 1],
                                {
                                    target: null,
                                    // target: game.match.bots[game.match.bots.length - 1].character,
                                    name: getName(), team: 0, gfx: 'img/sprites/dark1', color: [0, 255, 0],
                                    hover: 16, airAccel: new Vect3(0.15, 0.15, 1),
                                    runFunc: [
                                        function () { }.bind(game.match.bots[game.match.bots.length - 1].character)
                                    ]
                                }
                            );
                            game.match.bots[game.match.bots.length - 1].character.HB = new Cylinder(new Vect3(Math.round(Math.random() * this.map.w), Math.round(Math.random() * this.map.h), 0), 29, 37);
                        }
                    }
                }
            }
        )
    }
}