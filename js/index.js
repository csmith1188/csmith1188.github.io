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

    game.match = new Match();
    game.match.map = new Map();

    //Player
    game.player = new Player();
    game.player.controller = new Controller();
    game.player.character = new Character(game.window.w / 2, game.window.h / 2);

    //start game loop
    gameLoop = setInterval(step, 16);
}

function step() {
    game.player.controller.read();
    game.player.character.step(game.match, game.player.controller);
    draw();
}

function draw() {
    //Clear the canvas 
    ctx.fillStyle = "#333300";
    ctx.fillRect(0, 0, 1280, 720);

    //Draw Map
    game.match.map.draw(game.player.character);

    //Draw player
    game.player.character.draw();

    //Draw HUD
    game.player.drawHUD();
}

function setupInputs() {
    document.addEventListener("keydown", function (event) {
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
    });
    document.addEventListener("keyup", function (event) {
        game.player.controller.shiftKey = Number(event.shiftKey)
        game.player.controller.altKey = Number(event.altKey)
        if (event.key.toLocaleLowerCase() === "w" || event.key === "ArrowUp") game.player.controller.upKey = 0;
        else if (event.key.toLocaleLowerCase() === "a" || event.key === "ArrowLeft") game.player.controller.leftKey = 0;
        else if (event.key.toLocaleLowerCase() === "s" || event.key === "ArrowDown") game.player.controller.downKey = 0;
        else if (event.key.toLocaleLowerCase() === "d" || event.key === "ArrowRight") game.player.controller.rightKey = 0;
    });
    window.addEventListener('gamepadconnected', (event) => {
        console.log(event);
        if (event.gamepad.id == "Xbox 360 Controller (XInput STANDARD GAMEPAD)")
            game.player.controller.gamePad = event.gamepad.index;
    });
    window.addEventListener('gamepaddisconnected', (event) => {
        console.log(event);
        if (event.gamepad.id == "Xbox 360 Controller (XInput STANDARD GAMEPAD)")
            game.player.controller.gamePad = null;
    });
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