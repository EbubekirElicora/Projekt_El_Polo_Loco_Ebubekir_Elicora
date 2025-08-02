let canvas;
let world;
let keyboard = new Keyboard();
let audio = new AudioSounds();


/**
 * Initialisiert das Spiel, indem das Canvas geladen,
 * die Welt erstellt und das Hauptcharakter-Objekt ausgegeben wird.
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
 * Event-Listener für Tastendruck. Setzt entsprechende Tastenflags im Keyboard-Objekt auf `true`.
 * Unterstützte Tasten:
 * - Pfeil rechts (→)
 * - Pfeil links (←)
 * - Pfeil hoch (↑)
 * - Pfeil runter (↓)
 * - Leertaste
 * - Taste "D"
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

})

/**
 * Event-Listener für das Loslassen von Tasten. Setzt entsprechende Tastenflags im Keyboard-Objekt auf `false`.
 * Gleiche Tasten wie bei `keydown`.
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

})