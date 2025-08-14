/**
 * Represents a cloud that moves to the left.
 * Inherits from MovableObject.
 */
class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 500;

    /**
     * Creates a new Cloud instance.
     */
    constructor() {
        super();
        this.cloud_images = cloud_images;
        this.loadImage(this.cloud_images.clouds[0]);
        this.x = 200 + Math.random() * 2200;
        this.animate();
    }

    /** Moves the cloud continuously to the left */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}
