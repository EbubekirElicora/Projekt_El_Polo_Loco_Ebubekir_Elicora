/**
 * Klasse für einen Gegner "Chicken", erbt von MovableObject.
 * Steuert Bewegung, Animation, Tod und Kollisionsbereich.
 */
class Chicken extends MovableObject {
    height = 100;
    width = 80;
    y = 330;
    isDead = false;
    removeFromWorld = false;

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
     * Startet Animation und Bewegung in festen Intervallen.
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
     * Lässt das Chicken sterben, stoppt Bewegung und Sound, zeigt Tote-Animation.
     */
    die() {
        this.isDead = true;
        this.speed = 0;
        this.stopLoopingSound('chickenRun');
        this.loadImage(this.enemies_normal_images.dead[0]);
        setTimeout(() => this.removeFromWorld = true, 1000);
    }

    /**
     * Gibt die Kollisionsbox des Chickens zurück.
     * @returns {{x: number, y: number, width: number, height: number}} Kollisionsrechteck
     */
    getCollisionBox() {
        return this.createCenteredBox(this.width * 0.1, this.height * 0.2);
    }
}
