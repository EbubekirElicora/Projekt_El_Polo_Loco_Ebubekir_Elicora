/**
 * Base class for movable objects, extends DrawableObject.
 * Handles movement, gravity, energy, sounds, and animations.
 */
class MovableObject extends DrawableObject {
    damagePerHit = 20;
    invincibleDuration = 1000;
    speed = 0.2;
    otherDirection = false;
    speedY = 0;
    acceleration = 3;
    energy = 100;
    lastHit = 0;
    gravityInterval;

    constructor(audio = null) {
        super();
        this.audio = audio;
        this.currentAudioClone = null;
    }

    /**
     * Starts a looping sound, e.g., for movement noises.
     * @param {string} soundName - Name of the sound to play.
     */
    startLoopingSound(soundName) {
        if (!this.audio) return;
        this.stopLoopingSound();
        this.currentAudioClone = this.audio.playCloned(soundName, true);
    }

    /**
     * Stops the currently playing looping sound.
     */
    stopLoopingSound() {
        if (this.currentAudioClone) {
            this.currentAudioClone.pause();
            this.currentAudioClone.currentTime = 0;
            this.currentAudioClone = null;
        }
    }

    /**
     * Cleans up intervals and sounds (e.g., when removing the object from the world).
     */
    cleanup() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (this.walkInterval) clearInterval(this.walkInterval);
        if (this.gravityInterval) {
            clearInterval(this.gravityInterval);
            this.gravityInterval = null; // prevent multiple sets
        }
        this.stopLoopingSound();
    }

    /**
     * Starts gravity simulation with a fixed interval.
     */
    applyGravity() {
        if (this.gravityInterval) return;
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
            if (this.y > 130) this.landOnGround();
        }, 1000 / 25);
    }

    /**
     * Checks if the object is above the ground.
     * @returns {boolean}
     */
    isAboveGround() {
        return this instanceof ThrowableObject
            ? !this.onGround
            : this.y < 135;
    }

    /**
     * Places the object on the ground and stops vertical movement.
     */
    landOnGround() {
        this.y = 135;
        this.speedY = 0;
        this.handleLandingSound();
    }

    /**
     * Inflicts damage on the object if it is not currently invincible.
     */
    hit() {
        let now = Date.now();
        if (now - this.lastHit > this.invincibleDuration) {
            this.energy = Math.max(0, this.energy - this.damagePerHit);
            this.lastHit = now;
        }
    }

    /**
     * Checks if the object is currently in its invincible phase.
     * @returns {boolean}
     */
    isHurt() {
        return (Date.now() - this.lastHit) < this.invincibleDuration;
    }

    /**
     * Checks if the object has no remaining energy.
     * @returns {boolean}
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the object jump by setting vertical speed.
     */
    jump() {
        this.speedY = 35;
    }

    /**
     * Plays an animation from an array of images.
     * @param {string[]} images - Array of image paths.
     */
    playAnimation(images) {
        const idx = this.currentImage++ % images.length;
        const path = images[idx];
        this.img = this.imageCache[path];
    }
}