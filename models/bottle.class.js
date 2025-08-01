/**
 * Klasse für Flaschen-Objekte, die sich bewegbar sind.
 * Erbt von MovableObject.
 */
class Bottle extends MovableObject {
    height = 100;
    width = 80;
    y = 330;

    constructor() {
        super();
        this.loadImage(bottle_images.groundBottle[0]);
        this.x = 400 + Math.random() * 2900;
    }

    /**
     * Gibt die Kollisionsbox der Flasche zurück.
     * @returns {Object} Kollisionsrechteck zentriert an der Flasche
     */
    getCollisionBox() {
        return this.createCenteredBox(40, 20);
    }
}
