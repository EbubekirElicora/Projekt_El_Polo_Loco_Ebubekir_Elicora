/**
 * Class for bottle objects that can move.
 * Inherits from MovableObject.
 */
class Bottle extends MovableObject {
    height = 100;
    width = 80;
    y = 330;

    /**
     * Creates a new Bottle instance with a random x-position.
     */
    constructor() {
        super();
        this.loadImage(bottle_images.groundBottle[0]);
        this.x = 400 + Math.random() * 2900;
    }

    /**
    * Returns the collision box of the bottle.
    * @returns {Object} A collision rectangle centered on the bottle.
    */
    getCollisionBox() {
        return this.createCenteredBox(40, 20);
    }
}
