let canvas;
let world;
let keyboard = new Keyboard();
let audio = new AudioSounds();

/**
 * Initializes the game by loading the canvas, 
 * creating the world, and setting up the main character object.
 * 
 * @returns {void}
 */
function init() {
    initLevel();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard, audio);
    world.level = level1;
    document.addEventListener('fullscreenchange', () => world?.refreshEndScreenIfNeeded());
    window.addEventListener('resize', () => world?.refreshEndScreenIfNeeded());
}

/**
 * Event listener for key press.
 * Sets the corresponding key flags in the Keyboard object to `true`.
 * Supported keys:
 * - Arrow Right (→)
 * - Arrow Left (←)
 * - Arrow Up (↑)
 * - Arrow Down (↓)
 * - Spacebar
 * - Key "D"
 * 
 * @param {KeyboardEvent} e - The keyboard event.
 * @returns {void}
 */
window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 38) {
        keyboard.UP = true;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (e.keyCode == 68) {
        keyboard.D = true;
    }
});

/**
 * Event listener for key release.
 * Sets the corresponding key flags in the Keyboard object to `false`.
 * Same supported keys as in the `keydown` event.
 * 
 * @param {KeyboardEvent} e - The keyboard event.
 * @returns {void}
 */
window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 38) {
        keyboard.UP = false;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (e.keyCode == 68) {
        keyboard.D = false;
    }
});
