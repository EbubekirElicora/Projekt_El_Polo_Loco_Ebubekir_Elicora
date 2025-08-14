/**
 * Class responsible for resetting the game to its initial state.
 */
class GameReset {
    constructor(world) {
        this.world = world;
    }

    /**
     * Performs a complete game reset:
     * Stops sounds and animations, rebuilds the world, and resets state and UI.
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
     * Stops animations and intervals,
     * and calls cleanup on enemies and throwable objects if available.
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
     * Rebuilds the game world, including the level and character.
     */
    rebuildWorld() {
        initLevel();
        this.world.level = level1;
        this.world.character = new Character();
        this.world.character.world = this.world;
        this.world.character.reset();
    }

    /**
     * Resets game state variables (camera, coins, bottles, and flags) to their initial values.
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
     * Resets the status bars (health, bottles, coins, endboss).
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
     * Resets the UI: hides the canvas, shows the menu, and hides endscreen buttons.
     */
    resetUI() {
        document.getElementById('canvas').classList.add('hidden');
        document.getElementById('menu').classList.remove('hidden');
        document.getElementById('end_screen_buttons').classList.add('hidden');
    }
}