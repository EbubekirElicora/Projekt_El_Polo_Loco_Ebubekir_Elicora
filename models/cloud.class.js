/**
 * Repräsentiert eine Wolke, die sich nach links bewegt.
 * Erbt von MovableObject.
 */
class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 500;

    constructor() {
        super();
        this.cloud_images = cloud_images;
        this.loadImage(this.cloud_images.clouds[0]);
        this.x = 200 + Math.random() * 2200;
        this.animate();
    }

    /** Bewegt die Wolke kontinuierlich nach links */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}
