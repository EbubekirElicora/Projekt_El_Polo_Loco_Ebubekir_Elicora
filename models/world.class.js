/**
 * Represents the main game world, including the player character, enemies,
 * level data, rendering, and game state management.
 * The World class is responsible for:
 * - Drawing and updating all objects in the game
 * - Handling collisions, object collection, and enemy removal
 * - Managing camera position, UI elements, and end screens
 * - Pausing, resuming, and resetting the game
 */
class World {
    character = new Character();
    gameOverImg = new GameOver();
    gameWonImg = new GameWon();
    level = level1;
    canvas; ctx; keyboard; audio; animationFrameId; intervalId;
    camera_x = 0; coinCount = 0; bottleCount = 0; lastBottleThrow = 0;
    isGameOver = false; isGameWon = false; isPaused = false;
    hasPlayedGameOverSound = false; hasPlayedGameWonSound = false;
    deadTimestamp = null;
    throwableObjects = [];

    constructor(canvas, keyboard, audio) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.audio = audio;
        this.draw();
        this.setWorld();
        this.startGameLoop();
    }

    /**
     * Links the character to the world and starts enemy hit detection.
     * Runs at 60 frames per second.
     */
    setWorld() {
        this.character.world = this;
        setInterval(() => {
            this.checkCharacterHitsEnemies();
        }, 1000 / 60);
    }

    /**
     * Starts the main game logic loop that runs every 100ms.
     */
    startGameLoop() {
        this.intervalId = setInterval(() => {
            this.checkEndbossTrigger();
            this.checkCollisions();
            this.removeDeadEnemies();
            this.removeDeadLittleEnemies();
            this.checkThrowObjects();
            this.removeUsedThrowables();
            this.collectThrowableBottles();
            this.coinSpin();
            this.updateThrowables();
        }, 100);
    }

    /**
     * Checks if the player has triggered the end boss battle.
     */
    checkEndbossTrigger() {
        const boss = this.level.enemies.find(e => e instanceof Endboss);
        if (boss && this.character.x > 4000) {
            boss.startBattle();
            this.level.statusBarEndboss.setPercentage(boss.energy);
        }
    }

    /**
     * Updates all throwable objects (movement, animation, etc.).
     */
    updateThrowables() {
        this.throwableObjects.forEach(bottle => {
            if (typeof bottle.update === 'function') bottle.update();
        });
    }

    /**
     * Collects throwable bottles from the ground when the character collides with them.
     */
    collectThrowableBottles() {
        this.throwableObjects = this.throwableObjects.filter(bottle => {
            if (bottle.onGround && this.character.isColliding(bottle)) {
                this.bottleCount++;
                this.level.statusBarBottle.setPercentage(this.bottleCount / 5 * 100);
                return false;
            }
            return true;
        });
    }

    /**
     * Removes throwable objects that should no longer exist in the game.
     */
    removeUsedThrowables() {
        let remaining = [];
        for (let b of this.throwableObjects) {
            if (!b.removeFromWorld) remaining.push(b);
        }
        this.throwableObjects = remaining;
    }

    /**
     * Removes dead main enemies from the level.
     */
    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(e => !e.removeFromWorld);
    }

    /**
     * Removes dead small enemies from the level.
     */
    removeDeadLittleEnemies() {
        for (let i = this.level.little_enemies.length - 1; i >= 0; i--) {
            if (this.level.little_enemies[i].removeFromWorld) {
                this.level.little_enemies.splice(i, 1);
            }
        }
    }

    /**
     * Rotates coins for a spinning visual effect.
     */
    coinSpin() {
        this.level.coins.forEach(coin => coin.rotation += 0.2);
    }

    /**
     * Draws all visible objects and handles end-game screens.
     */
    draw() {
        this.clearCanvas();
        if (this.shouldDisplayGameOver()) return;
        this.translateCamera();
        this.drawWorldObjects();
        this.resetCamera();
        this.drawUI();
        this.drawNextFrame();
    }

    /**
     * Clears the entire canvas area.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Moves the camera horizontally by translating the canvas context.
     */
    translateCamera() {
        this.ctx.translate(this.camera_x, 0);
    }

    /**
     * Draws all world objects including background, characters, enemies, and collectibles.
     */
    drawWorldObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.little_enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.displayEndbossBarIfNeeded();
    }

    /**
     * Resets the camera transformation back to the origin.
     */
    resetCamera() {
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws UI elements such as health, bottles, and coins.
     */
    drawUI() {
        this.addToMap(this.level.statusBarHealth);
        this.addToMap(this.level.statusBarBottle);
        this.addToMap(this.level.statusBarCoin);
    }

    /**
     * Requests the next animation frame to continue rendering.
     */
    drawNextFrame() {
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Checks whether to display the Game Over or Game Won screen.
     * @returns {boolean} True if end screen should be displayed, otherwise false.
     */
    shouldDisplayGameOver() {
        if (this.isGameOver) return true;
        if (this.character.energy <= 0) {
            return this.handleDeathDelay();
        }
        if (this.checkWin()) {
            this.displayGameWon();
            return true;
        }
        return false;
    }

    /**
     * Delays the Game Over screen by 600ms after character death.
     * @returns {boolean} True if Game Over should be displayed.
     */
    handleDeathDelay() {
        if (this.deadTimestamp === null) {
            this.deadTimestamp = Date.now();
            return false;
        }
        if (Date.now() - this.deadTimestamp > 600) {
            this.displayGameOver();
            return true;
        }
        return false;
    }

    /**
     * Checks if the player has won the game.
     * @returns {boolean} True if the game is won.
     */
    checkWin() {
        if (this.isGameWon) return true;
        if (this.checkWinCondition()) {
            this.isGameWon = true;
            return true;
        }
        return false;
    }

    /**
     * Checks the win condition: Endboss is dead and the animation is complete.
     * @returns {boolean} True if win condition is met.
     */
    checkWinCondition() {
        const boss = this.level.enemies.find(e => e instanceof Endboss);
        return boss && boss.isDead && boss.isAnimationFinished;
    }

    /**
     * Displays the Game Over screen, pauses the game, and plays the sound.
     */
    displayGameOver() {
        this.pauseGame();
        this.audio.stopAllSounds();
        if (!this.hasPlayedGameOverSound) {
            this.audio.clearRestartFlag();
            this.audio.playOriginal('gameOver');
            this.hasPlayedGameOverSound = true;
        }
        this.displayEndScreen(this.gameOverImg);
    }

    /**
     * Displays the Game Won screen, pauses the game, and plays the sound.
     */
    displayGameWon() {
        this.pauseGame();
        this.audio.stopAllSounds();
        if (!this.hasPlayedGameWonSound) {
            this.audio.clearRestartFlag();
            this.audio.playOriginal('gameWon');
            this.hasPlayedGameWonSound = true;
        }
        this.displayEndScreen(this.gameWonImg);
    }

    /**
     * Draws an end screen image and shows control buttons.
     * @param {object} image - An object with a draw(ctx) method.
     */
    displayEndScreen(image) {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformation
        this.clearCanvas();
        image.draw(this.ctx);
        showEndScreenButtons();
    }

    /**
     * Displays the end boss health bar if active and alive.
     */
    displayEndbossBarIfNeeded() {
        const boss = this.level.enemies.find(e => e instanceof Endboss);
        if (!boss || !boss.activated || boss.isDead) return;
        const bar = this.level.statusBarEndboss;
        bar.x = boss.x + boss.width / 2 - bar.width / 2;
        bar.y = boss.y - 40;
        this.addToMap(bar);
    }

    /**
     * Refreshes the end screen if necessary (Game Over or Game Won).
     */
    refreshEndScreenIfNeeded() {
        if (this.isGameOver || this.character?.energy <= 0) {
            this.displayGameOver();
        } else if (this.isGameWon || this.checkWinCondition?.()) {
            this.displayGameWon();
        }
    }

    /**
     * Adds multiple objects to the rendering map.
     * @param {Array} objects - Array of drawable objects.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Draws an object on the canvas, flipping if necessary.
     * @param {object} obj - Drawable object with draw(ctx) and drawFrame(ctx) methods.
     */
    addToMap(obj) {
        if (obj.otherDirection) this.flipImage(obj);
        obj.draw(this.ctx);
        obj.drawFrame(this.ctx);
        if (obj.otherDirection) this.flipImageBack();
    }

    /**
     * Flips the canvas horizontally for drawing an object.
     * @param {object} obj - Object containing x and width for transformation.
     */
    flipImage(obj) {
        this.ctx.save();
        this.ctx.translate(obj.x + obj.width, 0);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-obj.x, 0);
    }

    /**
     * Restores the canvas after flipping.
     */
    flipImageBack() {
        this.ctx.restore();
    }

    /**
     * Resets the game state via GameReset class.
     */
    resetGame() {
        new GameReset(this).resetGame();
    }

    /**
     * Pauses the game by stopping loops, animations, and sounds.
     */
    pauseGame() {
        if (this.isPaused) return;
        this.isPaused = true;
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.character.cleanup?.();
        this.character.reset();
        [...this.level.enemies, ...this.level.little_enemies, ...this.throwableObjects]
            .forEach(obj => obj.cleanup?.());
        this.audio.stopAllSounds();
    }

    /**
     * Resumes the game by restarting loops and animations.
     */
    resumeGame() {
        if (!this.isPaused) return;
        this.isPaused = false;
        this.draw();
        this.audio.clearRestartFlag();
        this.startGameLoop();
        this.character.applyGravity();
        this.character.animate();
        this.level.enemies.forEach(e => e.animate?.());
        this.level.little_enemies.forEach(e => e.animate?.());
    }
}
window.World = World;