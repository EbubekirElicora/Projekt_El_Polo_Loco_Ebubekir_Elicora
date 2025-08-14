/**
 * Base class for all objects drawn on the canvas.
 * Manages image loading, drawing, transformations, and collision detection.
 */
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 150;
    y = 130;
    width = 100;
    height = 150;
    rotation = 0;

    /**
     * Loads an image for the object.
     * @param {string} path - Path to the image.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images and stores them in the cache.
     * @param {string[]} paths - Array of image paths.
     */
    loadImages(paths) {
        paths.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the object on the canvas with current transformations.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    draw(ctx) {
        ctx.save();
        this.applyTransformations(ctx);
        this.renderImage(ctx);
        ctx.restore();
        this.drawFrame(ctx);
    }

    /**
     * Applies rotation and translation transformations.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    applyTransformations(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        ctx.translate(centerX, centerY);
        ctx.scale(Math.cos(this.rotation), 1);
    }

    /**
     * Renders the image centered at the object's position.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    renderImage(ctx) {
        ctx.drawImage(
            this.img, -this.width / 2,
            -this.height / 2, this.width,
            this.height);
    }

    /**
     * Draws the collision frame (for debugging purposes).
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawFrame(ctx) {
        if (this instanceof Character
            || this instanceof Chicken || this instanceof LittleChicken || this instanceof ThrowableObject
            || this instanceof Coin || this instanceof Bottle || this instanceof Endboss) {
            const b = this.getCollisionBox();
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'transparent';
            ctx.rect(b.x, b.y, b.width, b.height);
            ctx.stroke();
        }
    }

    /**
     * Returns the collision box.
     * Can be overridden for more precise hitboxes.
     * @returns {{x: number, y: number, width: number, height: number}} - Collision box dimensions.
     */
    getCollisionBox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Checks collision with another DrawableObject.
     * @param {DrawableObject} other - Another drawable object.
     * @returns {boolean} True if colliding, false otherwise.
     */
    isColliding(other) {
        const a = this.getCollisionBox();
        const b = other.getCollisionBox();
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    /**
     * Checks if the object is jumping on a target object from above.
     * @param {DrawableObject} target - Target object.
     * @returns {boolean} True if jumping on top of the target.
     */
    isJumpingOn(target) {
        const a = this.getCollisionBox();
        const b = target.getCollisionBox();
        const fromAbove = this.speedY < 0 && (a.y + a.height) <= (b.y + 20);
        const horizontal = a.x + a.width > b.x && a.x < b.x + b.width;
        return fromAbove && horizontal;
    }

    /**
     * Creates a padded collision box, centered.
     * @param {number} [padX=0] - Horizontal padding.
     * @param {number} [padY=0] - Vertical padding.
     * @returns {{x: number, y: number, width: number, height: number}} - Padded collision box.
     */
    createCenteredBox(padX = 0, padY = 0) {
        return {
            x: this.x + padX / 2,
            y: this.y + padY / 2,
            width: this.width - padX,
            height: this.height - padY
        };
    }
}