/**
 * Represents the playable character.
 * Inherits from MovableObject.
 * Handles movement, animation, sounds, and collision detection.
 */
class Character extends MovableObject {
    height = 300;
    y = 80;
    speed = 8;
    world;
    lastAnimationUpdate = 0;
    hurtSoundCooldown = 0;
    jumpFrame = 0;
    isInJumpAnimation = false;
    moved = false;
    isFallingSoundPlaying = false;
    isJumpingSoundPlayed = false;
    hasPlayedHurtSound = false;
    hasPlayedIdleSound = false;
    lastMoveTime = Date.now();
    currentTime = Date.now();
    animationFrameId = null;

    /**
     * Initializes the character with images and starts the animation loop.
     */
    constructor() {
        super().loadImage(character_images.shortIdle[0]);
        this.loadImages(character_images.walking);
        this.loadImages(character_images.jumping);
        this.loadImages(character_images.dead);
        this.loadImages(character_images.hurt);
        this.loadImages(character_images.shortIdle);
        this.loadImages(character_images.longIdle);
        this.applyGravity();
        this.animate();
    }

    /**
     * Starts the animation and movement loop.
     * @private
     */
    animate() {
        const loop = () => {
            this.currentTime = Date.now();
            this.handleMovement();
            this.updateCamera();
            if (!this.lastAnimationUpdate || this.currentTime - this.lastAnimationUpdate >= 100) {
                this.handleAnimation();
                this.lastAnimationUpdate = this.currentTime;
            }
            this.animationFrameId = requestAnimationFrame(loop);
        };
        this.animationFrameId = requestAnimationFrame(loop);
    }

    /**
     * Stops animations and cleans up resources.
     */
    cleanup() {
        super.cleanup();
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Handles the character's movement based on keyboard input.
     * Includes left/right movement, jumping, and boss boundary restrictions.
     */
    handleMovement() {
        this.moved = false;
        const boss = this.getBoss();
        this.handleRightMovement(boss);
        this.handleLeftMovement();
        this.handleJump();
        if (this.moved) {
            this.lastMoveTime = Date.now();
        }
    }

    /**
     * Finds and returns the end boss in the current level.
     * @returns {Endboss|undefined} Endboss instance or undefined if not present.
     */
    getBoss() {
        return this.world.level.enemies.find(e => e instanceof Endboss);
    }

    /**
     * Handles right movement.
     * Restricts movement if the end boss is active.
     * @param {Endboss|undefined} boss - Reference to the end boss if present.
     */
    handleRightMovement(boss) {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.otherDirection = false;
            this.moveRight();
            this.moved = true;
            this.applyBossClamp(boss);
        }
    }

    /**
     * Handles left movement.
     */
    handleLeftMovement() {
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.otherDirection = true;
            this.moveLeft();
            this.moved = true;
        }
    }

    /**
     * Executes a jump if the space key is pressed and the character is on the ground.
     */
    handleJump() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.moved = true;
            this.world.audio.playCloned('characterJump');
            this.isJumpingSoundPlayed = true;
            this.isInJumpAnimation = true;
            this.jumpFrame = 0;
        }
    }

    /**
     * Play jump frames: ascent (0-5) while going up, descent (6-end) while falling.
     * @param {string[]} images
     */
    playJumpAnimation(images) {
        if (!images || !images.length) return;
        this.jumpFrame = this.jumpFrame || 0;
        const ascentEnd = 5, descentStart = 6;
        if (this.speedY > 0) {
            const end = Math.min(ascentEnd, images.length - 1), len = Math.max(1, end + 1);
            this.img = this.imageCache[images[this.jumpFrame++ % len]];
        } else {
            const start = Math.min(descentStart, images.length - 1), len = Math.max(1, images.length - start);
            this.img = this.imageCache[images[start + (this.jumpFrame++ % len)]];
        }
    }

    /**
     * Restricts the maximum X position so the character cannot pass the end boss.
     * @param {Endboss|undefined} boss - Reference to the end boss if present.
     */
    applyBossClamp(boss) {
        if (boss?.activated) {
            const clampX = boss.x + boss.width / 2 - this.width / 2;
            if (this.x > clampX) {
                this.x = clampX;
            }
        }
    }

    /**
     * Selects the appropriate animation based on the character's state.
     * @private
     */
    handleAnimation() {
        const idleTime = this.currentTime - this.lastMoveTime;
        if (this.isDead()) {
            this._onDead();
        } else if (this.isHurt()) {
            this._onHurt();
        } else if (this.isAboveGround() || this.isInJumpAnimation) {
            this._onJump();
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this._onWalk();
        } else {
            this._onIdle(idleTime);
        }
    }

    /**
     * Animation and behavior when dead.
     * @private
     */
    _onDead() {
        this.playAnimation(character_images.dead);
        this.isJumpingSoundPlayed = false;
        this.isFallingSoundPlaying = false;
        this.hasPlayedHurtSound = false;
        this.isInJumpAnimation = false;
        const endboss = this.world.level.enemies.find(e => e instanceof Endboss);
        if (endboss) {
            endboss.stopLoopingSound('chickenRun');
        }
    }

    /**
     * Animation and behavior when hurt.
     * @private
     */
    _onHurt() {
        this.playAnimation(character_images.hurt);
        let now = Date.now();
        if (now - this.hurtSoundCooldown > 60) {
            this.world.audio.playOriginal('characterHurt');
            this.world.audio.stopOriginal('characterIdle');
            this.hasPlayedIdleSound = false;
            this.hurtSoundCooldown = now;
        }
        this.world.audio.stopOriginal('characterRun');
        this.world.audio.stopOriginal('characterFall');
        this.isJumpingSoundPlayed = false;
        this.isFallingSoundPlaying = false;
        this.isInJumpAnimation = false;
    }

    /**
     * Animation and behavior when jumping.
     * @private
     */
    _onJump() {
        this.playJumpAnimation(character_images.jumping);
        this.handleJumpAndFallSound();
        this.world.audio.stopOriginal('characterRun');
        this.hasPlayedHurtSound = false;
    }

    /**
     * Animation and behavior when walking.
     * @private
     */
    _onWalk() {
        this.playAnimation(character_images.walking);
        this.world.audio.playOriginal('characterRun');
        this.hasPlayedHurtSound = false;
    }

    /**
     * Animation and behavior when idle.
     * @param {number} idleTime - Time since last movement in milliseconds.
     * @private
     */
    _onIdle(idleTime) {
        this.world.audio.stopOriginal('characterRun');
        if (idleTime < 5000) {
            this.playAnimation(character_images.shortIdle);
            if (this.hasPlayedIdleSound) {
                this.world.audio.stopOriginal('characterIdle');
                this.hasPlayedIdleSound = false;
            }
        } else {
            this.playAnimation(character_images.longIdle);
            if (!this.hasPlayedIdleSound) {
                this.world.audio.playOriginal('characterIdle');
                this.hasPlayedIdleSound = true;
            }
        }
        this.hasPlayedHurtSound = false;
    }

    /**
     * Plays sounds related to jumping and falling.
     * @private
     */
    handleJumpAndFallSound() {
        if (!this.isJumpingSoundPlayed && this.speedY > 0) {
            this.world.audio.playOriginal('characterJump');
            this.isJumpingSoundPlayed = true;
        }
        if (this.speedY < 0 && !this.isFallingSoundPlaying) {
            this.world.audio.playOriginal('characterFall', true);
            this.isFallingSoundPlaying = true;
        }
    }

    /**
     * Plays landing sound and stops fall sound.
     * @private
     */
    handleLandingSound() {
        if (this.isFallingSoundPlaying) {
            this.world.audio.stopOriginal('characterFall');
        }
        this.isFallingSoundPlaying = false;
        this.isJumpingSoundPlayed = false;
        this.isInJumpAnimation = false;
        this.jumpFrame = 0;
    }

    /**
     * Updates the camera position based on the character's position.
     * @private
     */
    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Makes the character bounce upwards with a fixed impulse.
     */
    bounce() {
        this.speedY = 30;
    }

    /**
     * Checks whether the character is jumping on an enemy.
     * @param {MovableObject} enemy - The enemy object.
     * @returns {boolean} True if jumping on the enemy, otherwise false.
     */
    isJumpingOn(enemy) {
        return super.isJumpingOn(enemy);
    }

    /**
     * Resets the character's state, stopping sounds and animations.
     */
    reset() {
        this.hasPlayedHurtSound = false;
        this.lastHit = 0;
        this.isInJumpAnimation = false;
        this.jumpFrame = 0;
        this.world.audio.stopOriginal('characterHurt');
        this.world.audio.stopOriginal('characterRun');
        this.world.audio.stopOriginal('characterFall');
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Returns the collision box of the character.
     * @returns {{x: number, y: number, width: number, height: number}} The collision rectangle.
     */
    getCollisionBox() {
        const horizontalPadding = 40;
        const topCut = 100;
        return {
            x: this.x + horizontalPadding / 2,
            y: this.y + topCut,
            width: this.width - horizontalPadding,
            height: this.height - topCut
        };
    }
}