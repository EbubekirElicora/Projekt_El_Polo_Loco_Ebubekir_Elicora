/**
 * Class for an enemy "Chicken", inherits from MovableObject.
 * Controls movement, animation, death, and collision area.
 */
class Chicken extends MovableObject {
    height = 100;
    width = 80;
    y = 330;
    isDead = false;
    removeFromWorld = false;

    /**
     * Creates a new Chicken instance.
     * @param {Object} audio - Audio manager for playing sounds.
     */
    constructor(audio) {
        super(audio);
        this.enemies_normal_images = enemies_normal_images;
        this.loadImage(this.enemies_normal_images.dead[0]);
        this.loadImages(this.enemies_normal_images.walking);
        this.loadImages(this.enemies_normal_images.dead);
        this.x = 400 + Math.random() * 2900;
        this.speed = 0.2 + Math.random() * 0.8;
        this.animate();
    }

    /**
     * Starts animation and movement in fixed intervals.
     * @private
     */
    animate() {
        this.moveInterval = setInterval(() => {
            if (!this.isDead) this.moveLeft();
        }, 1000 / 60);

        this.walkInterval = setInterval(() => {
            if (!this.isDead) this.playAnimation(this.enemies_normal_images.walking);
        }, 100);

        this.startLoopingSound('chickenRun', true);
    }

    /**
     * Kills the chicken, stops movement and sound, and shows dead animation.
     */
    die() {
        this.isDead = true;
        this.speed = 0;
        this.stopLoopingSound('chickenRun');
        if (this.audio) this.audio.playCloned('chickenDead');
        this.loadImage(this.enemies_normal_images.dead[0]);
        setTimeout(() => this.removeFromWorld = true, 1000);
    }

    /**
     * Returns the chicken's collision box.
     * @returns {{x: number, y: number, width: number, height: number}} Collision rectangle.
     */
    getCollisionBox() {
        return this.createCenteredBox(this.width * 0.1, this.height * 0.2);
    }
}
