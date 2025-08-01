/**
 * Klasse für das Game-Over-Bildschirm-Objekt, das nach Verlust angezeigt wird.
 * Erbt von DrawableObject.
 */
class GameOver extends DrawableObject {

    constructor() {
        super();
        this.gameOver_images = gameOver_images;
        this.loadImage(this.gameOver_images.backGround[0]);
        this.width = 600;
        this.height = 300;
        this.x = 60;
        this.y = 90;
    }
}