/**
 * Klasse zum Zurücksetzen des Spiels auf den Anfangszustand.
 */
class GameReset {
    constructor(world) {
        this.world = world;
    }

    /**
     * Führt den kompletten Reset des Spiels aus:
     * Stoppt Sounds und Animationen, baut die Welt neu auf, setzt Status und UI zurück.
     */
    resetGame() {
        this.world.audio.stopAllSounds();
        this.stopAnimation();
        this.rebuildWorld();
        this.resetState();
        this.resetBars();
        this.resetUI();
    }

    /**
     * Stoppt Animationen, Intervalle und ruft bei Gegnern und Wurfobjekten Cleanup auf.
     */
    stopAnimation() {
        if (this.world.animationFrameId) cancelAnimationFrame(this.world.animationFrameId);
        if (this.world.intervalId) clearInterval(this.world.intervalId);
        this.world.level.enemies.forEach(enemy => enemy.cleanup?.());
        this.world.throwableObjects.forEach(obj => obj.cleanup?.());
        this.world.animationFrameId = null;
        this.world.intervalId = null;
    }

    /**
     * Baut die Spielwelt neu auf, inklusive Level und Charakter.
     */
    rebuildWorld() {
        initLevel();
        this.world.level = level1;
        this.world.character = new Character();
        this.world.character.world = this.world;
        this.world.character.reset();
    }

    /**
     * Setzt Spielstatus-Variablen (Kamera, Münzen, Flaschen, Flags) auf Anfangswerte zurück.
     */
    resetState() {
        this.world.camera_x = 0;
        this.world.coinCount = 0;
        this.world.bottleCount = 0;
        this.world.throwableObjects = [];
        this.world.isGameOver = false;
        this.world.isGameWon = false;
        this.world.hasPlayedGameOverSound = false;
        this.world.hasPlayedGameWonSound = false;
        this.world.deadTimestamp = null;
    }

    /**
     * Setzt die Statusleisten (Leben, Flaschen, Münzen, Endboss) zurück.
     */
    resetBars() {
        const health = this.world.level.statusBarHealth;
        const bottle = this.world.level.statusBarBottle;
        const coin = this.world.level.statusBarCoin;
        const endboss = this.world.level.enemies.find(e => e instanceof Endboss);
        health.setPercentage(this.world.character.energy);
        bottle.setPercentage(0);
        coin.setPercentage(0);
        if (endboss) this.world.level.statusBarEndboss.setPercentage(endboss.energy);
    }

    /**
     * Setzt die Benutzeroberfläche zurück: Canvas ausblenden, Menü einblenden, Endscreen-Buttons ausblenden.
     */
    resetUI() {
        document.getElementById('canvas').classList.add('hidden');
        document.getElementById('menu').classList.remove('hidden');
        document.getElementById('end_screen_buttons').classList.add('hidden');
    }
}
