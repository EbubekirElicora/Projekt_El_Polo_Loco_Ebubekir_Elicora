/**
 * Represents the final boss of the game.
 * Inherits from MovableObject and handles animations, movement, and state management.
 */
class Endboss extends MovableObject {
    height = 400;
    width = 250;
    x = 4500;
    startX;
    y = 50;
    speed = 0;
    energy = 100;
    isDead = false; activated = false; attacking = false;
    isHurtAnimationRunning = false; isAnimationFinished = false;
    currentHurtFrame = 0; currentDeadFrame = 0; lastHit = 0;
    hurtTimeout = null; alertInterval = null; hurtInterval = null;
    deadInterval = null; walkInterval = null; moveInterval = null;
    attackInterval = null;

    /**
     * Creates the Endboss and loads all animation images.
     * @param {AudioManager} audio - Audio manager for sound effects.
     */
    constructor(audio) {
        super(audio);
        this.startX = this.x;
        this.endboss_images = endboss_images;
        this.loadImage(this.endboss_images.alert[0]);
        this.loadImages(this.endboss_images.alert);
        this.loadImages(this.endboss_images.walk);
        this.loadImages(this.endboss_images.attack);
        this.loadImages(this.endboss_images.hurt);
        this.loadImages(this.endboss_images.dead);
        this.animateAlert();
    }

    /** Starts the boss fight and activates the Endboss. */
    startBattle() {
        if (this.activated || this.isDead) return;
        this.activated = true;
        clearInterval(this.alertInterval);
        this.playAttackOnce(() => this.startWalking());
    }

    /**
     * Gets the distance the boss has moved from its start position.
     * @returns {number} Distance moved in pixels.
     */
    get distanceMoved() {
        return this.startX - this.x;
    }

    /** Performs an attack animation upon collision. */
    collideAttack() {
        if (this.attacking || this.isDead) return;
        this.stopWalking();
        this.playAttackOnce(() => this.startWalking());
    }

    /**
     * Plays the attack animation once, then calls the callback.
     * @param {Function} callback - Function to call after the animation finishes.
     */
    playAttackOnce(callback) {
        this.attacking = true;
        let i = 0;
        const frames = this.endboss_images.attack;
        if (this.attackInterval) {
            clearInterval(this.attackInterval);
            this.attackInterval = null;
        }
        this.attackInterval = setInterval(() => {
            this.img = this.imageCache[frames[i]];
            i++;
            if (i >= frames.length) {
                clearInterval(this.attackInterval);
                this.attackInterval = null;
                this.attacking = false;
                if (callback) callback();
            }
        }, 150);
    }

    /** Starts moving left with walking animation and sound. */
    startWalking() {
        this.speed = 2;
        this.walkInterval = setInterval(() => {
            this.playAnimation(this.endboss_images.walk);
        }, 180);
        this.moveInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
        this.startLoopingSound('chickenRun', true);
    }

    /** Stops all walking animations and movement. */
    stopWalking() {
        clearInterval(this.walkInterval);
        clearInterval(this.moveInterval);
        this.walkInterval = null;
        this.moveInterval = null;
    }

    /** Updates the animation based on the current state. */
    animate() {
        if (this.isDead) return;
        if (!this.activated) {
            if (!this.alertInterval) this.animateAlert();
            return;
        }
        if (this.activated && !this.walkInterval && !this.moveInterval) {
            this.startWalking();
        }
    }

    /** Plays the idle alert animation if boss is not yet activated or hurt. */
    animateAlert() {
        this.alertInterval = setInterval(() => {
            if (!this.isHurtAnimationRunning && !this.activated) {
                this.playAnimation(this.endboss_images.alert);
            }
        }, 200);
    }

    /** Starts the hurt animation sequence. */
    animateHurt() {
        if (this.isHurtAnimationRunning) return;
        this.isHurtAnimationRunning = true;
        this.currentHurtFrame = 0;
        clearInterval(this.alertInterval);
        this.hurtInterval = setInterval(() => this.updateHurtFrame(), 100);
    }

    /** Updates the current frame of the hurt animation. */
    updateHurtFrame() {
        const frames = this.endboss_images.hurt;
        this.img = this.imageCache[frames[this.currentHurtFrame]];
        this.currentHurtFrame++;
        if (this.currentHurtFrame >= frames.length) {
            this.endHurtAnimation();
        }
    }

    /** Ends the hurt animation and resumes alert animation if applicable. */
    endHurtAnimation() {
        clearInterval(this.hurtInterval);
        this.isHurtAnimationRunning = false;
        this.animateAlert();
    }

    /** Applies damage to the boss and triggers hurt animation. */
    hit() {
        if (this.energy <= 0) return;
        this.decreaseEnergy();
        this.startHurtAnimationIfNeeded();
        this.restartAfterPause();
        if (this.energy <= 0) {
            this.die();
        }
    }

    /** Reduces the boss's energy. */
    decreaseEnergy() {
        this.energy -= 20;
        this.lastHit = Date.now();
    }

    /** Starts hurt animation if it is not already running. */
    startHurtAnimationIfNeeded() {
        if (!this.isHurtAnimationRunning) {
            this.animateHurt();
        }
    }

    /** Pauses after hurt animation, then resumes walking. */
    restartAfterPause() {
        if (this.hurtTimeout) clearTimeout(this.hurtTimeout);
        const oldSpeed = this.speed;
        this.speed = Math.max(0.5, oldSpeed * 1.5);
        this.hurtTimeout = setTimeout(() => {
            if (!this.isDead) {
                this.speed = oldSpeed + 0.5;
            }
            this.hurtTimeout = null;
        }, 1000);
    }

    /** Puts the boss into dead state and stops sound. */
    die() {
        this.setDeadState();
        this.stopAllAnimations();
        this.animateDeadOnce();
    }

    /** Plays the death animation once. */
    animateDeadOnce() {
        const frames = this.endboss_images.dead;
        this.currentDeadFrame = 0;
        this.isAnimationFinished = false;
        this.deadInterval = setInterval(() => {
            this.img = this.imageCache[frames[this.currentDeadFrame]];
            this.currentDeadFrame++;
            if (this.currentDeadFrame >= frames.length) {
                clearInterval(this.deadInterval);
                this.removeFromWorld = true;
                this.isAnimationFinished = true;
            }
        }, 600);
    }

    /** Sets the boss state to dead and stops running sound. */
    setDeadState() {
        this.energy = 0;
        this.speed = 0;
        this.isDead = true;
        this.stopLoopingSound('chickenRun');
    }

    /** Stops all active animations, intervals, and movement. */
    stopAllAnimations() {
        clearInterval(this.alertInterval);
        clearInterval(this.hurtInterval);
        clearInterval(this.deadInterval);
        clearInterval(this.walkInterval);
        clearInterval(this.moveInterval);
        clearInterval(this.attackInterval);
        this.alertInterval = null;
        this.hurtInterval = null;
        this.deadInterval = null;
        this.walkInterval = null;
        this.moveInterval = null;
        this.attackInterval = null;
        this.stopLoopingSound();
    }

    /** Cleans up all intervals and animations, called externally. */
    cleanup() {
        clearInterval(this.deadInterval);
        this.stopAllAnimations();
    }

    /**
     * Returns the boss's collision box for hit detection.
     * @returns {{x: number, y: number, width: number, height: number}} Collision rectangle.
     */
    getCollisionBox() {
        const horizontalPadding = 40;
        const topCut = 50;
        return {
            x: this.x + horizontalPadding / 2,
            y: this.y + topCut,
            width: this.width - horizontalPadding,
            height: this.height - topCut
        };
    }
}