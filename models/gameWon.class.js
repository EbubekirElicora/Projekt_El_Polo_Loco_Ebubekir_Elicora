/**
 * Klasse für das Gewinn-Bildschirm-Objekt, das nach Sieg angezeigt wird.
 * Erbt von DrawableObject.
 */
class GameWon extends DrawableObject {

    constructor() {
        super();
        this.win_images = win_images;
        this.loadImage(this.win_images.backGround[0]);
        this.width = 600;
        this.height = 300;
        this.x = 60;
        this.y = 90;
    }
}
