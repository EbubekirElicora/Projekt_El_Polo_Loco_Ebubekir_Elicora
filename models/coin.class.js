/**
 * Represents a coin in the game that can move.
 * Inherits from MovableObject.
 */
class Coin extends MovableObject {
    /**
     * Creates a new Coin instance at a specified position.
     * @param {number} x - X-coordinate of the coin
     * @param {number} y - Y-coordinate of the coin
     */
    constructor(x, y) {
        super();
        this.coin_images = coin_images;
        this.loadImage(this.coin_images.coins[0]);
        this.x = x; this.y = y;
        this.width = 150; this.height = 150;
    }

    /**
     * Returns the collision box of the coin, centered with a fixed size.
     * @returns {{x: number, y: number, width: number, height: number}} Collision rectangle
     */
    getCollisionBox() {
        return this.createCenteredBox(90, 90);
    }
}