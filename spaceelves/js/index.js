// Global canvas and game
let canvas;
let ctx;
let game;
let allID = 0;

window.onload = function () {
    canvas = document.getElementById("game-canvas");
    scale_canvas = document.getElementById("scale-canvas");
    ctx = canvas.getContext("2d");
    sctx = scale_canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    sctx.imageSmoothingEnabled = false;
    
    game = new Game();

    game.match = new Start_Screen();
    // game.match = new DebugMatch();
    // game.match = new Match_ForEver();
    // game.match = new Match_OnlineMP();

    //Run the step() function every 16ms (60fps)
    setInterval(game.step.bind(game), 16);
}