/**
 * Klasse für den spielbaren Charakter, erbt von MovableObject.
 * Verwaltet Bewegung, Animation, Sounds und Kollision.
 */
class Character extends MovableObject {
    height = 300;
    y = 80;
    speed = 10;
    world;
    lastAnimationUpdate = 0;
    moved = false;
    isFallingSoundPlaying = false;
    isJumpingSoundPlayed = false;
    hasPlayedHurtSound = false;
    lastMoveTime = Date.now();
    currentTime = Date.now();
    animationFrameId = null;

    /**
     * Initialisiert den Charakter mit Bildern und startet die Animation.
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
     * Startet die Animations- und Bewegungs-Loop.
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
     * Stoppt Animationen und räumt auf.
     */
    cleanup() {
        super.cleanup();
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Verarbeitet Tastatureingaben und bewegt den Charakter.
     * @private
     */
    handleMovement() {
        this.moved = false;
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.otherDirection = false;
            this.moveRight();
            this.moved = true;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.otherDirection = true;
            this.moveLeft();
            this.moved = true;
        }
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.moved = true;
        }
        if (this.moved) {
            this.lastMoveTime = Date.now();
        }
    }

    /**
     * Wählt die passende Animation basierend auf dem Zustand des Charakters.
     * @private
     */
    handleAnimation() {
        const idleTime = this.currentTime - this.lastMoveTime;
        if (this.isDead()) {
            this._onDead();
        } else if (this.isHurt()) {
            this._onHurt();
        } else if (this.isAboveGround()) {
            this._onJump();
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this._onWalk();
        } else {
            this._onIdle(idleTime);
        }
    }

    /**
     * Animation und Verhalten bei Tod.
     * @private
     */
    _onDead() {
        this.playAnimation(character_images.dead);
        this.isJumpingSoundPlayed = false;
        this.isFallingSoundPlaying = false;
        this.hasPlayedHurtSound = false;
        const endboss = this.world.level.enemies.find(e => e instanceof Endboss);
        if (endboss) {
            endboss.stopLoopingSound('chickenRun');
        }
    }

    /**
     * Animation und Verhalten bei Verletzung.
     * @private
     */
    _onHurt() {
        this.playAnimation(character_images.hurt);
        if (!this.hasPlayedHurtSound) {
            this.world.audio.playOriginal('characterHurt');
            this.hasPlayedHurtSound = true;
        }
        this.world.audio.stopOriginal('characterRun');
        this.world.audio.stopOriginal('characterFall');
        this.isJumpingSoundPlayed = false;
        this.isFallingSoundPlaying = false;
    }

    /**
     * Animation und Verhalten beim Springen.
     * @private
     */
    _onJump() {
        this.playAnimation(character_images.jumping);
        this.handleJumpAndFallSound();
        this.world.audio.stopOriginal('characterRun');
        this.hasPlayedHurtSound = false;
    }

    /**
     * Animation und Verhalten beim Laufen.
     * @private
     */
    _onWalk() {
        this.playAnimation(character_images.walking);
        this.world.audio.playOriginal('characterRun');
        this.hasPlayedHurtSound = false;
    }

    /**
     * Animation und Verhalten beim Stehen (Idle).
     * @param {number} idleTime - Dauer seit der letzten Bewegung in ms
     * @private
     */
    _onIdle(idleTime) {
        this.world.audio.stopOriginal('characterRun');
        if (idleTime < 5000) {
            this.playAnimation(character_images.shortIdle);
        } else {
            this.playAnimation(character_images.longIdle);
        }
        this.hasPlayedHurtSound = false;
    }

    /**
     * Spielt Sounds passend zu Sprung- und Fallbewegungen ab.
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
     * Spielt den Landungs-Sound ab und stoppt Fall-Sound.
     * @private
     */
    handleLandingSound() {
        if (this.isFallingSoundPlaying) {
            this.world.audio.stopOriginal('characterFall');
            this.isFallingSoundPlaying = false;
            this.isJumpingSoundPlayed = false;
        }
    }

    /**
     * Aktualisiert die Kamera-Position basierend auf der Charakter-Position.
     * @private
     */
    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Springt nach oben mit definiertem Impuls.
     */
    bounce() {
        this.speedY = 30;
    }

    /**
     * Prüft, ob der Charakter auf einem Gegner springt.
     * @param {MovableObject} enemy - Gegner-Objekt
     * @returns {boolean} true wenn springend auf dem Gegner
     */
    isJumpingOn(enemy) {
        return super.isJumpingOn(enemy);
    }

    /**
     * Setzt den Charakter zurück und stoppt Sounds und Animationen.
     */
    reset() {
        this.hasPlayedHurtSound = false;
        this.lastHit = 0;
        this.world.audio.stopOriginal('characterHurt');
        this.world.audio.stopOriginal('characterRun');
        this.world.audio.stopOriginal('characterFall');
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Gibt die Kollisionsbox des Charakters zurück.
     * @returns {{x: number, y: number, width: number, height: number}} Kollisionsrechteck
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
