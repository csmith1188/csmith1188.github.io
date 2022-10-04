//Variables
let canvas;
let ctx;
//Create Game variables

let gameLoop;
let game;
let player;


window.onload = function () {
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    setupInputs()

    //Game
    game = new Game();
    game.debug = false;

    game.match = new Match();
    game.match.map = new Map();

    //Player
    game.player = new Player();
    game.player.controller = new Controller();
    game.player.character = new Character(game.match.map.w / 2, game.match.map.h / 2);
    
    //Enemy
    // game.match.npcs.push(new Enemy(24, 24, game.player.character))
    game.match.npcs.push(new Enemy((game.match.map.w / 2) + 1000, (game.match.map.h / 2) + 500, game.player.character))
    // game.match.npcs.push(new Enemy((game.match.map.w / 2) + 600, (game.match.map.h / 2) - 100, game.player.character))
    // game.match.npcs.push(new Enemy((game.match.map.w / 2) - 500, (game.match.map.h / 2) + 200, game.player.character))
    // game.match.npcs.push(new Enemy((game.match.map.w / 2) + 100, (game.match.map.h / 2) + 100, game.player.character))

    
    //Blocks
    // game.match.map.blocks.push(new Block((game.match.map.w / 2) + 100, (game.match.map.h / 2), {color: '#0000FF'}))
    // game.match.map.blocks.push(new JumpPad((game.match.map.w / 2) + 100, (game.match.map.h / 2) + 100, {color: '#FF9900'}))
    // game.match.map.blocks.push(new DeathBlock((game.match.map.w / 2) + 500, (game.match.map.h / 2) + 500, {color: '#990000', damageOnCollision: 2}))
    // game.match.map.blocks.push(new DeathBlock((game.match.map.w / 2) + 200, (game.match.map.h / 2) + 200, {color: '#996666', damageOnCollision: 20, tags: ['immobile']}))


    for (let i = 0; i < 100; i++) {
        let tempx = Math.floor(Math.random() *(game.match.map.w / 48)) * 48
        let tempy = Math.floor(Math.random() *(game.match.map.h / 48)) * 48
        game.match.map.blocks.push(new Block(tempx, tempy, {color: '#333333'}))
    }
    for (let i = 0; i < 50; i++) {
        let tempx = Math.floor(Math.random() *(game.match.map.w / 48)) * 48
        let tempy = Math.floor(Math.random() *(game.match.map.h / 48)) * 48
        game.match.map.blocks.push(new JumpPad(tempx, tempy, {color: '#FF6600'}))
    }
    for (let i = 0; i < 25; i++) {
        let tempx = Math.floor(Math.random() *(game.match.map.w / 48)) * 48
        let tempy = Math.floor(Math.random() *(game.match.map.h / 48)) * 48
        game.match.map.blocks.push(new DeathBlock(tempx, tempy, {color: '#660000', damageOnCollision: 2}))
    }



    //start game loop
    //Run the step() function every 16ms (60fps)
    gameLoop = setInterval(step, 16);

    draw();

}

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
        //Do all collision. It has to be in this order, or else pads/blocks won't activate
        for (const block of game.match.map.blocks) {
            block.collide([game.player.character, ...game.match.npcs])
        }
        for (const npc of game.match.npcs) {
            npc.collide([game.player.character, ...game.match.npcs, ...game.match.map.blocks])
        }
        game.player.character.collide([...game.match.npcs, ...game.match.map.blocks])

        //Do all steps and movement
        game.player.controller.read();
        game.player.character.step(game.player.controller);
        for (const npc of game.match.npcs) {
            npc.step(game.player.controller);
        }
        for (const block of game.match.map.blocks) {
            block.step();
        }
    }
    //Draw game
    draw();
}

function draw() {
    //Clear the canvas 
    ctx.fillStyle = "#333300";
    ctx.fillRect(0, 0, 1280, 720);

    //Draw Map
    game.match.map.draw(game.player.character);
    
    
    //Draw blocks
    for (const block of game.match.map.blocks) {
        block.draw(game.player.character);
    }
    
    //Draw npcs
    for (const npc of game.match.npcs) {
        npc.draw(game.player.character);
    }

    //Draw player
    game.player.character.draw();

    //Draw HUD
    game.player.drawHUD();

    //Draw Controller HUD
    game.player.controller.draw();
}

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
}

function getCanvasRelative(e) {
    // console.log(window.orientation);
    bx = canvas.getBoundingClientRect();
    return {
        x: e.clientX - bx.left,
        y: e.clientY - bx.top,
        bx: bx
    };
}

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

function checkIntersection(r1, r2) {
    if (r1.x > r2.x + r2.width) {
        return false;
    } else if (r1.x + r1.width <= r2.x) {
        return false;
    } else if (r1.y >= r2.y + r2.height) {
        return false;
    } else if (r1.y + r1.height <= r2.y) {
        return false;
    } else {
        return true;
    }
}