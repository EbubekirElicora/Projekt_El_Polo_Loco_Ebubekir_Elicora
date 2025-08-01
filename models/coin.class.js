/**
 * Repräsentiert eine Münze im Spiel, die sich bewegen kann.
 * Erbt von MovableObject.
 */
class Coin extends MovableObject {
    constructor(x, y) {
        super();
        this.coin_images = coin_images;
        this.loadImage(this.coin_images.coins[0]);
        this.x = x; this.y = y;
        this.width = 150; this.height = 150;
    }

    /**
     * Liefert die Kollisionsbox der Münze, zentriert mit festgelegter Größe.
     * @returns {{x: number, y: number, width: number, height: number}} Kollisionsrechteck
     */
    getCollisionBox() {
        return this.createCenteredBox(90, 90);
    }
}
