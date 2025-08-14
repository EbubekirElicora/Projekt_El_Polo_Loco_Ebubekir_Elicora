/**
 * Represents a throwable object (e.g., a bottle) that can move, rotate, fall, and splash.
 * Inherits from MovableObject.
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

    /** Starts the gravity logic for the object. */
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

    /** Starts the horizontal movement logic for the object. */
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

    /** Starts the rotation animation for the object. */
    startRotationAnimation() {
        this.rotationInterval = setInterval(() => {
            if (this.splashed) return;
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.rotationImages.length;
            this.loadImage(this.rotationImages[this.currentFrameIndex]);
        }, this.frameInterval);
    }

    /** Places the object on the ground, stops movement, and shows the ground image. */
    landOnGround() {
        this.y = this.groundY;
        this.speedY = 0;
        this.onGround = true;
        this.loadImage(this.groundImage);
        this.stopAllIntervals();
    }

    /**
     * Triggers the splash effect: stops movement, plays the splash animation and sound.
     * After a short delay, removes the object from the game world.
     */
    splash() {
        if (this.splashed) return;
        this.splashed = true;
        this.speedY = 0;
        this.stopAllIntervals();
        this.playAnimation(this.splashImages);
        if (this.world?.audio) {
            this.world.audio.playCloned('bottleSplash');
        }
        setTimeout(() => this.removeFromWorld = true, 500);
    }

    /** Stops all active intervals. */
    stopAllIntervals() {
        clearInterval(this.gravityInterval);
        clearInterval(this.rotationInterval);
        clearInterval(this.movementInterval);
        this.gravityInterval = null;
        this.rotationInterval = null;
        this.movementInterval = null;
    }

    /**
     * Returns the collision box of the object.
     * @returns {Object} Collision box with x, y, width, and height properties
     */
    getCollisionBox() {
        return this.createCenteredBox(this.width * 0.1, this.height * 0.1);
    }
}