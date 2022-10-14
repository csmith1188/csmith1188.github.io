//Variables
let canvas;
let ctx;
//Create Game variables

let gameLoop;
let game;
let allID = 0;
let ticks = 0;


/*
..######..########.########.##.....##.########.
.##....##.##..........##....##.....##.##.....##
.##.......##..........##....##.....##.##.....##
..######..######......##....##.....##.########.
.......##.##..........##....##.....##.##.......
.##....##.##..........##....##.....##.##.......
..######..########....##.....#######..##.......
*/

window.onload = function () {
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    setupInputs();

    //Game
    game = new Game();
    game.debug = false;

    game.match = new Match();
    game.match.map = new Map();

    //Player
    game.player = new Player();
    game.player.controller = new Controller();
    game.player.character = new Character(allID++, (game.match.map.w / 2), (game.match.map.h / 2));
    game.player.camera = new Camera({ target: game.player.character });

    //Enemy
    // game.match.npcs.push(new Enemy(allID++, (game.match.map.w / 2) + 1000, (game.match.map.h / 2) + 500, {target: game.player.character, nameTag: 'Kevin', gfx: 'img/sprites/dark2'})) //Kevin
    // game.player.camera.target = game.match.npcs[game.match.npcs.length-1] //Kevin-vision
    // game.match.npcs.push(new Enemy(allID++, (game.match.map.w / 2) - 1000, (game.match.map.h / 2) + 500, {target: game.match.npcs[game.match.npcs.length-1], nameTag: 'Fren', team: 0})) //Anti-Kevin

    //Blocks
    // game.match.map.blocks.push(new Block(allID++, (game.match.map.w / 2) + 100, (game.match.map.h / 2), {color: '#0000FF'}))
    // game.match.map.blocks.push(new Block(allID++, (game.match.map.w / 2), (game.match.map.h / 2), {color: '#FF9900', w: 48, h: 96}))
    // game.match.map.blocks.push(new JumpPad(allID++, (game.match.map.w / 2) + 100, (game.match.map.h / 2) + 300, {color: '#FF9900'}))
    // game.match.map.blocks.push(new HealthBlock(allID++, (game.match.map.w / 2) + 500, (game.match.map.h / 2) + 500, {color: '#990000', healthCollide: 2}))
    // game.match.map.blocks.push(new HealthBlock(allID++, (game.match.map.w / 2) + 200, (game.match.map.h / 2) + 200, {color: '#996666', healthCollide: 20, tags: ['immobile']}))
    // game.match.map.blocks.push(new HealthBlock(allID++, (game.match.map.w / 2) + 200, (game.match.map.h / 2) + 200, { color: '#66FF66', healthCollide: -1 }))
    game.match.map.blocks.push(new Wave(allID++, 0, (game.match.map.h / 2), { color: '#aaaaFF', w: 48, h: 288, xspeed: 4, dxspeed: 4}))
    // game.player.camera = new Camera({ target: game.match.map.blocks[game.match.map.blocks.length -1] });

    // Speed Strip
    // for (let i = 0; i < game.match.map.w / 48; i++) {
    //     game.match.map.blocks.push(new SpeedPad(allID++, (i * 48 * 10) + 24, (game.match.map.h / 2), { color: '#0066FF' }))
    // }
    //Ball
    // game.match.map.blocks.push(new Ball(allID++, (game.match.map.w / 2) - 200, (game.match.map.h / 2) + 200, { color: '#FFFFFF' }))

    //Debris
    // for (let i = 0; i < 1000; i++) {
    //     let tempx = Math.floor(Math.random() * game.match.map.w);
    //     let tempy = Math.floor(Math.random() * game.match.map.h);
    //     let tempt = Math.floor(Math.random() * 2000);
    //     game.match.map.debris.push(new Debris(allID++, tempx, tempy, { imgFile: 'img/sprites/leaf1.png', w: 12, h: 12, z: tempt }));
    // }
    // game.match.map.debris.push(new Debris(allID++, (game.match.map.w / 2), (game.match.map.h / 2), { imgFile: 'img/sprites/leaf1.png', w: 12, h: 12, z: 100 }));

    // Race Track
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) - 24, (game.match.map.h / 2) - 1000, { color: '#000066', colorActive: '#0000FF', w: 24, h: 144}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) - 500, (game.match.map.h / 2) - 1000, { color: '#000066', colorActive: '#0000FF', w: 24, h: 144}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) - 1000, (game.match.map.h / 2) - 1000, { color: '#000066', colorActive: '#0000FF', w: 24, h: 144}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) - 1250, (game.match.map.h / 2) - 500, { color: '#000066', colorActive: '#0000FF', w: 144, h: 24}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) - 1000, (game.match.map.h / 2), { color: '#000066', colorActive: '#0000FF', w: 144, h: 24}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) - 1250, (game.match.map.h / 2) + 750, { color: '#000066', colorActive: '#0000FF', w: 144, h: 24}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) - 1000, (game.match.map.h / 2) + 1000, { color: '#000066', colorActive: '#0000FF', w: 24, h: 144}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) - 500, (game.match.map.h / 2) + 750, { color: '#000066', colorActive: '#0000FF', w: 24, h: 144}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2), (game.match.map.h / 2) + 1000, { color: '#000066', colorActive: '#0000FF', w: 24, h: 144}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) + 500, (game.match.map.h / 2) + 750, { color: '#000066', colorActive: '#0000FF', w: 24, h: 144}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) + 1000, (game.match.map.h / 2) + 1000, { color: '#000066', colorActive: '#0000FF', w: 24, h: 144}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) + 1250, (game.match.map.h / 2) + 750, { color: '#000066', colorActive: '#0000FF', w: 144, h: 24}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) + 1000, (game.match.map.h / 2), { color: '#000066', colorActive: '#0000FF', w: 144, h: 24}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) + 1250, (game.match.map.h / 2) - 500, { color: '#000066', colorActive: '#0000FF', w: 144, h: 24}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) + 1000, (game.match.map.h / 2) - 1000, { color: '#000066', colorActive: '#0000FF', w: 24, h: 144}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) + 500, (game.match.map.h / 2) - 1000, { color: '#000066', colorActive: '#0000FF', w: 24, h: 144}))
    // game.match.goals.push(new Goal(allID++, (game.match.map.w / 2) + 24, (game.match.map.h / 2) - 1000, { color: '#000066', colorActive: '#0000FF', w: 24, h: 144 }))

    // game.match.npcs.push(new Enemy(allID++, (game.match.map.w / 2) + 1000, (game.match.map.h / 2), {target: game.match.goals[0], nameTag: 'Rais', team: 0, gfx: 'img/sprites/dark1'})) //racer
    
    // game.match.npcs.push(new Enemy(allID++, (game.match.map.w / 2) + 1000, (game.match.map.h / 2) + 1000, {target: game.player.character, nameTag: 'Rais', team: 0, gfx: 'img/sprites/dark1'})) //racer

    // game.player.camera.target = game.match.npcs[game.match.npcs.length-1] //race-vision

    // Random Map
    // for (let i = 0; i < 100; i++) {
    //     let tempx = (Math.floor(Math.random() * (game.match.map.w / 48)) * 48) + 24
    //     let tempy = (Math.floor(Math.random() * (game.match.map.h / 48)) * 48) + 24
    //     let tempw = (Math.ceil(Math.random() * 2) * 48)
    //     let temph = (Math.ceil(Math.random() * 2) * 48)
    //     game.match.map.blocks.push(new Block(allID++, tempx, tempy, {color: '#333333', w: tempw, h: temph}))
    // }
    // for (let i = 0; i < 25; i++) {
    //     let tempx = (Math.floor(Math.random() * (game.match.map.w / 48)) * 48) + 24
    //     let tempy = (Math.floor(Math.random() * (game.match.map.h / 48)) * 48) + 24
    //     game.match.map.blocks.push(new JumpPad(allID++, tempx, tempy, {color: '#FF6600'}))
    // }
    // for (let i = 0; i < 25; i++) {
    //     let tempx = (Math.floor(Math.random() * (game.match.map.w / 48)) * 48) + 24
    //     let tempy = (Math.floor(Math.random() * (game.match.map.h / 48)) * 48) + 24
    //     game.match.map.blocks.push(new SpeedPad(allID++, tempx, tempy, {color: '#9999FF'}))
    // }
    // for (let i = 0; i < 10; i++) {
    //     let tempx = (Math.floor(Math.random() * (game.match.map.w / 48)) * 48) + 24
    //     let tempy = (Math.floor(Math.random() * (game.match.map.h / 48)) * 48) + 24
    //     game.match.map.blocks.push(new HealthBlock(allID++, tempx, tempy, {color: '#660000', healthCollide: -2}))
    // }
    // for (let i = 0; i < 20; i++) {
    //     let tempx = (Math.floor(Math.random() * (game.match.map.w / 48)) * 48) + 24
    //     let tempy = (Math.floor(Math.random() * (game.match.map.h / 48)) * 48) + 24
    //     game.match.map.blocks.push(new HealthBlock(allID++, tempx, tempy, {color: '#006600', healthCollide: 1, powerCollide: 2}))
    // }

    //start game loop
    //Run the step() function every 16ms (60fps)
    gameLoop = setInterval(step, 16);

    draw();

}

/*
..######..########.########.########.
.##....##....##....##.......##.....##
.##..........##....##.......##.....##
..######.....##....######...########.
.......##....##....##.......##.......
.##....##....##....##.......##.......
..######.....##....########.##.......
*/

function step() {

    // Resize screen if needed
    // if (window.innerWidth < game.window.dw) {
    //     game.window.w = window.innerWidth;
    //     game.window.h = game.window.w * (2 / 3)
    //     if (window.innerHeight >= game.window.h)
    //         game.window.h = window.innerHeight;
    // }
    // if (window.innerHeight < game.window.dh) {
    //     game.window.h = window.innerHeight;
    //     game.window.w = game.window.h / (2 / 3);
    // }

    // The next two lines will always max screen (comment out above)
    game.window.h = window.innerHeight;
    game.window.w = window.innerWidth;

    canvas.width = game.window.w;
    canvas.height = game.window.h;

    if (!game.paused) {
        //Handle goals and collisions
        for (const goal of game.match.goals) {
            if (game.match.goalIndex >= game.match.goals.length) {
                game.match.goalIndex = 0;
                game.match.lapEnd = ticks;
                if (game.player.best.lap == 0 || game.player.best.lap > game.match.lapEnd - game.match.lapStart) game.player.best.lap = game.match.lapEnd - game.match.lapStart;
                game.match.lapStart = ticks;
            }
            goal.activeGoal = false;
            if (game.match.goals.indexOf(goal) == game.match.goalIndex)
                goal.activeGoal = true;
            goal.collide([game.player.character, ...game.match.npcs])
        }

        //Do all collision. It has to be in this order, or else pads/blocks won't activate for players and npcs
        for (const block of game.match.map.blocks) {
            block.collide([game.player.character, ...game.match.npcs, ...game.match.map.blocks])
        }
        for (const debris of game.match.map.debris) {
            debris.collide([game.player.character, ...game.match.npcs, ...game.match.map.debris])
        }
        game.player.character.collide([...game.match.npcs, ...game.match.map.blocks, ...game.match.map.debris])
        for (const npc of game.match.npcs) {
            npc.collide([game.player.character, ...game.match.npcs, ...game.match.map.blocks, ...game.match.map.debris])
        }

        //Do all steps and movement
        game.player.controller.read();
        game.player.character.step(game.player.controller);
        for (const npc of game.match.npcs) {
            npc.step(game.player.controller);
        }
        for (const block of game.match.map.blocks) {
            block.step();
        }
        for (const debris of game.match.map.debris) {
            if (debris.active) {
                debris.step();
            } else {
                //Remove it from this list
            }
        }
    }

    //Update Camera Position
    if (game.player.camera.target) {
        game.player.camera.x = game.player.camera.target.x;
        game.player.camera.y = game.player.camera.target.y;
    }

    //Draw game
    draw();
    ticks++;
}

/*
.########..########.....###....##......##
.##.....##.##.....##...##.##...##..##..##
.##.....##.##.....##..##...##..##..##..##
.##.....##.########..##.....##.##..##..##
.##.....##.##...##...#########.##..##..##
.##.....##.##....##..##.....##.##..##..##
.########..##.....##.##.....##..###..###.
*/

function draw() {
    //Clear the canvas 
    ctx.fillStyle = "#333300";
    ctx.fillRect(0, 0, game.window.w, game.window.h);

    //Draw Map
    game.match.map.draw(game.player.character);

    //Draw goals
    for (const goal of game.match.goals) {
        goal.draw(game.player.character);
    }

    //Draw blocks
    for (const block of game.match.map.blocks) {
        block.draw(game.player.character);
    }

    //Draw debris
    for (const debris of game.match.map.debris) {
        debris.draw(game.player.character);
    }


    //Draw npcs
    for (const npc of game.match.npcs) {
        npc.draw(game.player.character);
    }

    //Draw player
    game.player.character.draw();

    //Draw Map Lighting
    game.match.map.lighting();

    //Draw HUD
    game.player.drawHUD();

    //Draw Controller HUD
    game.player.controller.draw();
}

/*
.####.##....##.########..##.....##.########..######.
..##..###...##.##.....##.##.....##....##....##....##
..##..####..##.##.....##.##.....##....##....##......
..##..##.##.##.########..##.....##....##.....######.
..##..##..####.##........##.....##....##..........##
..##..##...###.##........##.....##....##....##....##
.####.##....##.##.........#######.....##.....######.
*/

function setupInputs() {
    document.addEventListener("keydown", function (event) {
        game.player.controller.touch.enabled = false;
        if (event.shiftKey) {
            game.player.controller.shiftKey = Number(event.shiftKey)
        }
        if (event.altKey) {
            event.preventDefault();
            game.player.controller.altKey = Number(event.altKey)
        }
        if (event.key.toLocaleLowerCase() === "w" || event.key === "ArrowUp") game.player.controller.upKey = 1;
        if (event.key.toLocaleLowerCase() === "a" || event.key === "ArrowLeft") game.player.controller.leftKey = 1;
        if (event.key.toLocaleLowerCase() === "s" || event.key === "ArrowDown") game.player.controller.downKey = 1;
        if (event.key.toLocaleLowerCase() === "d" || event.key === "ArrowRight") game.player.controller.rightKey = 1;
        if (event.key.toLocaleLowerCase() === " ") game.player.controller.spaceKey = 1;
        if (event.key === "Escape" || event.key === "Escape") game.paused = !game.paused;
    });
    document.addEventListener("keyup", function (event) {
        game.player.controller.shiftKey = Number(event.shiftKey)
        game.player.controller.altKey = Number(event.altKey)
        if (event.key.toLocaleLowerCase() === "w" || event.key === "ArrowUp") game.player.controller.upKey = 0;
        if (event.key.toLocaleLowerCase() === "a" || event.key === "ArrowLeft") game.player.controller.leftKey = 0;
        if (event.key.toLocaleLowerCase() === "s" || event.key === "ArrowDown") game.player.controller.downKey = 0;
        if (event.key.toLocaleLowerCase() === "d" || event.key === "ArrowRight") game.player.controller.rightKey = 0;
        if (event.key.toLocaleLowerCase() === " ") game.player.controller.spaceKey = 0;
    });
    window.addEventListener('gamepadconnected', (event) => {
        if (event.gamepad.id == "Xbox 360 Controller (XInput STANDARD GAMEPAD)")
            game.player.controller.gamePad = event.gamepad.index;
    });
    window.addEventListener('gamepaddisconnected', (event) => {
        if (event.gamepad.id == "Xbox 360 Controller (XInput STANDARD GAMEPAD)")
            game.player.controller.gamePad = null;
    });
    window.addEventListener('touchstart', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        game.player.controller.touch.enabled = true;
        getTouch(event);
    }, { passive: false });

    window.addEventListener('touchmove', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        getTouch(event, 'move');
    }, { passive: false });

    window.addEventListener('touchend', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        getTouch(event, 'end');
    }, { passive: false });

    window.addEventListener('touchcancel', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        getTouch(event);
    }, { passive: false });
    window.addEventListener('mousemove', (event) => {
        let coords = getCanvasRelative(event, true);
        game.player.controller.aimX = coords.x
        game.player.controller.aimY = coords.y
    })
}

function getCanvasRelative(e, center) {
    // console.log(window.orientation);
    bx = canvas.getBoundingClientRect();
    if (center) {
        let compareX = e.clientX - this.x;
        let compareY = e.clientY - this.y;
        return {
            x: e.clientX - (bx.width / 2),
            y: e.clientY - (bx.height / 2),
            bx: bx
        };
    } else {
        return {
            x: e.clientX - bx.left,
            y: e.clientY - bx.top,
            bx: bx
        };
    }
}


/*
 ########  #######  ##     ##  ######  ##     ##
    ##    ##     ## ##     ## ##    ## ##     ##
    ##    ##     ## ##     ## ##       ##     ##
    ##    ##     ## ##     ## ##       #########
    ##    ##     ## ##     ## ##       ##     ##
    ##    ##     ## ##     ## ##    ## ##     ##
    ##     #######   #######   ######  ##     ##
*/

function getTouch(event, type) {
    if (event.target == canvas) {
        let touchLeftFound = false;
        for (const touch of event.targetTouches) {
            let touchCoord = getCanvasRelative(touch);
            let touchX = touchCoord.x - game.player.controller.touch.left.centerX
            let touchY = touchCoord.y - game.player.controller.touch.left.centerY
            if ((Math.abs(touchX) < game.player.controller.touch.left.w / 2 && Math.abs(touchY) < game.player.controller.touch.left.h / 2) || type == 'move') {
                touchLeftFound = true
                if (touchX < 0) {
                    game.player.controller.leftTouch = (touchX / (game.player.controller.touch.left.w / 2)) * -1;
                    if (game.player.controller.leftTouch > 1) game.player.controller.leftTouch = 1;
                    game.player.controller.rightTouch = 0;
                }
                else if (touchX > 0) {
                    game.player.controller.rightTouch = (touchX / (game.player.controller.touch.left.w / 2));
                    if (game.player.controller.rightTouch > 1) game.player.controller.rightTouch = 1;
                    game.player.controller.leftTouch = 0;
                }
                if (touchY < 0) {
                    game.player.controller.upTouch = (touchY / (game.player.controller.touch.left.h / 2)) * -1;
                    if (game.player.controller.upTouch < 1) game.player.controller.upTouch = 1;
                    game.player.controller.downTouch = 0;
                }
                else if (touchY > 0) {
                    game.player.controller.downTouch = (touchY / (game.player.controller.touch.left.h / 2));
                    if (game.player.controller.downTouch > 1) game.player.controller.downTouch = 1;
                    game.player.controller.upTouch = 0;
                }
            }
        }
        if (!touchLeftFound) {
            game.player.controller.rightTouch = 0;
            game.player.controller.leftTouch = 0;
            game.player.controller.upTouch = 0;
            game.player.controller.downTouch = 0;
        }
    }
}