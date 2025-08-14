/**
 * Represents a small chicken (LittleChicken) that appears as a minor enemy in the game.
 * Automatically walks to the left and plays a walking animation.
 * Can be defeated by the player.
 */
class LittleChicken extends MovableObject {
    height = 70;
    width = 50;
    y = 350;
    isDead = false;
    removeFromWorld = false;

    /**
     * Creates a small chicken with a random starting position and speed.
     * Loads the corresponding images and starts movement, animation, and sound.
     * 
     * @param {AudioSounds} audio - The game's audio system for playing sounds.
     */
    constructor(audio) {
        super(audio);
        this.enemies_little_images = enemies_little_images;
        this.loadImage(this.enemies_little_images.walking[0]);
        this.loadImages(this.enemies_little_images.walking);
        this.loadImages(this.enemies_little_images.dead);
        this.x = 400 + Math.random() * 2900;
        this.speed = 0.2 + Math.random() * 0.8;
        this.animate();
    }

    /**
     * Starts movement and animation (walking + sound).
     */
    animate() {
        this.moveInterval = setInterval(() => {
            if (!this.isDead) this.moveLeft();
        }, 1000 / 60);
        this.walkInterval = setInterval(() => {
            if (!this.isDead) this.playAnimation(this.enemies_little_images.walking);
        }, 100);
        this.startLoopingSound('littleChickenRun', true);
    }

    /**
     * Kills the chicken (changes sprite, stops movement + sound, and schedules removal).
     */
    die() {
        this.isDead = true;
        this.speed = 0;
        this.loadImage(this.enemies_little_images.dead[0]);
        this.stopLoopingSound('littleChickenRun');
        if (this.audio) this.audio.playCloned('chickenDead');
        setTimeout(() => this.removeFromWorld = true, 1000);
    }

    /**
     * Returns the collision box, slightly smaller than the visual sprite.
     * 
     * @returns {Object} A centered rectangle with horizontal and vertical padding.
     */
    getCollisionBox() {
        return this.createCenteredBox(this.width * 0.1, this.height * 0.2);
    }
}
