/**
 * Klasse für ein werfbares Objekt (z.B. eine Flasche), das sich bewegt, rotiert, fällt und splashen kann.
 * Erbt von MovableObject.
 */
class ThrowableObject extends MovableObject {
    splashed = false;
    onGround = false;
    groundY = 330;
    currentFrameIndex = 0;
    frameInterval = 100;
    gravityInterval;
    rotationInterval;
    movementInterval;

    /**
     * Erstellt eine neue ThrowableObject-Instanz.
     * @param {number} x - Startposition X
     * @param {number} y - Startposition Y
     * @param {number} [groundY=330] - Y-Position des Bodens
     */
    constructor(x, y, groundY = 330) {
        super();
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 100;
        this.groundY = groundY;
        this.rotationImages = bottle_images.rotation;
        this.splashImages = bottle_images.splash;
        this.groundImage = bottle_images.groundBottle[0];
        this.loadImage(this.rotationImages[0]);
        this.loadImages(this.rotationImages);
        this.loadImages(this.splashImages);
        this.speedY = 30;
        this.startGravity();
        this.startRotationAnimation();
    }

    /** Startet die Schwerkraft-Logik für das Objekt */
    startGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.onGround || this.splashed) return;
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
            if (this.y > this.groundY) {
                this.landOnGround();
            }
        }, 1000 / 25);
    }

    /** Startet die horizontale Bewegungs-Logik des Objekts */
    startHorizontalMovement() {
        const direction = this.world?.character.otherDirection ? -1 : 1;
        this.movementInterval = setInterval(() => {
            if (this.onGround || this.splashed) {
                clearInterval(this.movementInterval);
                return;
            }
            this.x += 10 * direction;
        }, 25);
    }

    /** Startet die Rotationsanimation des Objekts */
    startRotationAnimation() {
        this.rotationInterval = setInterval(() => {
            if (this.splashed) return;
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.rotationImages.length;
            this.loadImage(this.rotationImages[this.currentFrameIndex]);
        }, this.frameInterval);
    }

    /** Setzt das Objekt auf den Boden, stoppt Bewegungen und zeigt das Bodenbild */
    landOnGround() {
        this.y = this.groundY;
        this.speedY = 0;
        this.onGround = true;
        this.loadImage(this.groundImage);
        this.stopAllIntervals();
    }

    /** 
     * Löst den Splash-Effekt aus: stoppt Bewegung, zeigt Splash-Animation und spielt Sound.
     * Danach wird das Objekt nach kurzer Zeit aus der Welt entfernt.
     */
    splash() {
        if (this.splashed) return;
        this.splashed = true;
        this.speedY = 0;
        this.stopAllIntervals();
        this.playAnimation(this.splashImages);
        if (this.world?.audio) {
            this.world.audio.playOriginal('bottleSplash');
        }
        setTimeout(() => this.removeFromWorld = true, 500);
    }

    /** Stoppt alle laufenden Intervalle */
    stopAllIntervals() {
        clearInterval(this.gravityInterval);
        clearInterval(this.rotationInterval);
        clearInterval(this.movementInterval);
        this.gravityInterval = null;
        this.rotationInterval = null;
        this.movementInterval = null;
    }

    /** 
     * Gibt die Kollisionsbox des Objekts zurück.
     * @returns {Object} Kollisionsbox mit Eigenschaften x, y, width, height
     */
    getCollisionBox() {
        return this.createCenteredBox(this.width * 0.1, this.height * 0.1);
    }
}
