class Controller {
    constructor() {
        this.deadzone = 0.2;
        this.alt = {
            current: false,
            last: false
        }
        this.gamePad;
        this.touch = {
            enabled: false,
            left: {
                img: new Image(),
                offsetx: 10,
                offsety: 10,
                w: 150,
                h: 150,
                centerX: (150 / 2) + 10,
                centerY: game.window.h - (150 / 2) - 10

            }
        }
        this.touch.left.img.src = 'img/touch_left.png'
    }

    read() {
        if (this.gamePad != null) {
            let gp = navigator.getGamepads()[this.gamePad];
            // Get AXES
            if (gp.axes[0] > this.deadzone) this.right = gp.axes[0];
            else if (this.rightKey) this.right = this.rightKey;
            else this.right = 0;
            if (gp.axes[0] < this.deadzone * -1) this.left = gp.axes[0] * -1;
            else if (this.leftKey) this.left = this.leftKey;
            else this.left = 0;
            if (gp.axes[1] > this.deadzone) this.down = gp.axes[1];
            else if (this.downKey) this.down = this.downKey;
            else this.down = 0;
            if (gp.axes[1] < this.deadzone * -1) this.up = gp.axes[1] * -1;
            else if (this.upKey) this.up = this.upKey;
            else this.up = 0;
            if (gp.buttons[4].pressed) this.shift = 1;
            else if (this.shiftKey) this.shift = this.shiftKey;
            else this.shift = 0;
            if (gp.buttons[5].pressed) this.alt.current = 1;
            else if (this.altKey) this.alt.current = this.altKey;
            else this.alt.current = 0;
        }
        if (this.touch.enabled) {
            if (this.leftTouch) this.left = this.leftTouch;
            if (this.rightTouch) this.right = this.rightTouch;
            if (this.upTouch) this.up = this.upTouch;
            if (this.downTouch) this.down = this.downTouch;
        }
    }
    draw() {
        if (this.touch.enabled) {
            ctx.globalAlpha = 0.5;
            ctx.drawImage(this.touch.left.img, this.touch.left.offsetx, game.window.h - this.touch.left.h - this.touch.left.offsety, this.touch.left.w, this.touch.left.h);
            ctx.globalAlpha = 1;
        }
    }
}