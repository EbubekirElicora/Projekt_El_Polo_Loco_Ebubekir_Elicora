class World {
    character = new Character();
    gameOverImg = new GameOver();
    gameWonImg = new GameWon();
    level = level1;
    canvas;
    ctx;
    keyboard;
    audio;
    animationFrameId;
    intervalId;
    camera_x = 0;
    coinCount = 0;
    bottleCount = 0;
    lastBottleThrow = 0;
    throwableObjects = [];
    isGameOver = false;
    isGameWon = false;
    isPaused = false;
    hasPlayedGameOverSound = false;
    hasPlayedGameWonSound = false;
    deadTimestamp = null;

    /**
     * Erstellt eine neue Spielwelt.
     * @param {HTMLCanvasElement} canvas - Das Canvas-Element für die Anzeige.
     * @param {Keyboard} keyboard - Die Tastatursteuerung.
     * @param {AudioController} audio - Audio-Controller für Sounds.
     */
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
     * Verknüpft den Charakter mit der Welt und startet die Prüfung auf Treffer bei Gegnern mit 60fps.
     */
    setWorld() {
        this.character.world = this;
        setInterval(() => {
            this.checkCharacterHitsEnemies();
        }, 1000 / 60);
    }

    /**
     * Startet die Haupt-Logik-Schleife des Spiels, die alle 100ms aufgerufen wird.
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
     * Startet den Endboss-Kampf, wenn der Spieler eine bestimmte Position überschritten hat.
     */
    checkEndbossTrigger() {
        const boss = this.level.enemies.find(e => e instanceof Endboss);
        if (boss && this.character.x > 4000) {
            boss.startBattle();
            this.level.statusBarEndboss.setPercentage(boss.energy);
        }
    }

    /**
     * Aktualisiert alle geworfenen Objekte (Position, Animation usw.).
     */
    updateThrowables() {
        this.throwableObjects.forEach(bottle => {
            if (typeof bottle.update === 'function') bottle.update();
        });
    }

    /**
     * Prüft, ob der Charakter Flaschen auf dem Boden aufsammelt und aktualisiert den Zähler.
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
     * Entfernt Flaschen aus der Liste, die nicht mehr im Spiel sein sollen.
     */
    removeUsedThrowables() {
        let remaining = [];
        for (let b of this.throwableObjects) {
            if (!b.removeFromWorld) remaining.push(b);
        }
        this.throwableObjects = remaining;
    }

    /**
     * Entfernt tote Hauptfeinde aus dem Level.
     */
    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(e => !e.removeFromWorld);
    }

    /**
     * Entfernt tote kleine Feinde aus dem Level.
     */
    removeDeadLittleEnemies() {
        for (let i = this.level.little_enemies.length - 1; i >= 0; i--) {
            if (this.level.little_enemies[i].removeFromWorld) {
                this.level.little_enemies.splice(i, 1);
            }
        }
    }

    /**
     * Animiert Münzen durch eine Rotation für einen besseren optischen Effekt.
     */
    coinSpin() {
        this.level.coins.forEach(coin => coin.rotation += 0.2);
    }

    /**
     * Startet den Render-/Zeichen-Loop und zeichnet alle sichtbaren Objekte.
     * Bricht ab, falls Game Over oder Sieg angezeigt werden soll.
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
     * Löscht den gesamten Canvas-Bereich.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Verschiebt die Zeichenfläche horizontal entsprechend der Kamera-Position.
     */
    translateCamera() {
        this.ctx.translate(this.camera_x, 0);
    }

    /**
     * Zeichnet alle Welt-Objekte (Hintergrund, Wolken, Münzen, Flaschen, Charakter, Gegner etc.).
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
     * Setzt die Kamera-Transformation zurück (zurück zum Ursprung).
     */
    resetCamera() {
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Zeichnet die UI-Elemente (Lebensbalken, Flaschenanzahl, Münzanzahl).
     */
    drawUI() {
        this.addToMap(this.level.statusBarHealth);
        this.addToMap(this.level.statusBarBottle);
        this.addToMap(this.level.statusBarCoin);
    }

    /**
     * Fordert den Browser auf, den nächsten Frame zu rendern.
     * Ruft rekursiv die draw()-Methode auf.
     */
    drawNextFrame() {
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Prüft, ob Game Over oder Sieg angezeigt werden soll.
     * @returns {boolean} true wenn Game Over oder Sieg angezeigt wird, sonst false.
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
     * Verzögert das Anzeigen des Game Over Bildschirms um 600ms nach dem Tod.
     * @returns {boolean} true wenn Game Over angezeigt werden soll, sonst false.
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
     * Prüft, ob der Spieler das Spiel gewonnen hat.
     * @returns {boolean} true wenn Sieg, sonst false.
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
     * Win-Bedingung: Endboss ist tot und Animationssequenz ist fertig.
     * @returns {boolean} true wenn Sieg-Bedingung erfüllt ist.
     */
    checkWinCondition() {
        const boss = this.level.enemies.find(e => e instanceof Endboss);
        return boss && boss.isDead && boss.isAnimationFinished;
    }

    /**
     * Zeigt den Game Over Bildschirm an, pausiert das Spiel und spielt Sound ab.
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
     * Zeigt den Sieges-Bildschirm an, pausiert das Spiel und spielt Sound ab.
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
     * Zeichnet einen Endscreen (Game Over oder Sieg) und zeigt Buttons an.
     * @param {object} image Bildobjekt mit draw(ctx)-Methode.
     */
    displayEndScreen(image) {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset Transformation
        this.clearCanvas();
        image.draw(this.ctx);
        showEndScreenButtons();
    }

    /**
     * Zeigt die Lebensleiste des Endbosses an, wenn dieser aktiv ist und lebt.
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
     * Aktualisiert den Endscreen bei Bedarf (Game Over oder Sieg).
     */
    refreshEndScreenIfNeeded() {
        if (this.isGameOver || this.character?.energy <= 0) {
            this.displayGameOver();
        } else if (this.isGameWon || this.checkWinCondition?.()) {
            this.displayGameWon();
        }
    }

    /**
     * Fügt eine Liste von Objekten zum Zeichnen hinzu.
     * @param {Array} objects Liste von zeichnbaren Objekten.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Zeichnet ein Objekt auf den Canvas, inklusive Flip bei "otherDirection".
     * @param {object} obj Zeichenbares Objekt mit draw(ctx)-Methode.
     */
    addToMap(obj) {
        if (obj.otherDirection) this.flipImage(obj);
        obj.draw(this.ctx);
        obj.drawFrame(this.ctx);
        if (obj.otherDirection) this.flipImageBack();
    }

    /**
     * Spiegelt das Canvas horizontal, um Objekte in "otherDirection" zu zeichnen.
     * @param {object} obj Objekt mit x und width für die Transformation.
     */
    flipImage(obj) {
        this.ctx.save();
        this.ctx.translate(obj.x + obj.width, 0);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-obj.x, 0);
    }

    /**
     * Setzt die Canvas-Transformation nach flipImage zurück.
     */
    flipImageBack() {
        this.ctx.restore();
    }

    /**
     * Startet einen Reset des Spiels (via externer Klasse GameReset).
     */
    resetGame() {
        new GameReset(this).resetGame();
    }

    /**
     * Pausiert das Spiel: Stoppt Animation, Intervalle, Sound und setzt Flag.
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
     * Setzt das Spiel fort: startet Loop und Animationen wieder.
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