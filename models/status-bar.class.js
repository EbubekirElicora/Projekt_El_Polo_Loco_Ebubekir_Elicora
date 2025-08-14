/**
 * StatusBar displays a visual indicator for health, ammo, or other metrics.
 * Uses image sets that reflect the current percentage of the status.
 */
class StatusBar extends DrawableObject {
    percentage = 100;
    counterUp = false;
    statusBarsImages;

    /**
     * @param {string} type - Key for the type of status bar (e.g., "health", "ammo")
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {boolean} counterUp - If true, counts the status bar from 0 up (default false)
     */
    constructor(type, x, y, counterUp = false) {
        super();
        this.x = x;
        this.y = y;
        this.width = 240;
        this.height = 60;
        this.counterUp = counterUp;
        this.statusBarsImages = statusbar_images[type];
        this.loadImages(this.statusBarsImages);
        this.setPercentage(counterUp ? 0 : 100);
    }

    /**
     * Sets the status percentage and updates the displayed image.
     * @param {number} percentage - Value between 0 and 100
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let imgIndex = this.resolveImageIndex();
        let path = this.statusBarsImages[imgIndex];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the image index based on the percentage and counterUp flag.
     * @returns {number} Index of the image in the statusBarsImages array
     */
    resolveImageIndex() {
        if (this.counterUp) {
            if (this.percentage >= 100) return 5;
            if (this.percentage >= 75) return 4;
            if (this.percentage >= 50) return 3;
            if (this.percentage >= 25) return 2;
            if (this.percentage > 0) return 1;
            return 0;
        } else {
            if (this.percentage >= 100) return 5;
            if (this.percentage >= 80) return 4;
            if (this.percentage >= 60) return 3;
            if (this.percentage >= 40) return 2;
            if (this.percentage >= 20) return 1;
            return 0;
        }
    }
}