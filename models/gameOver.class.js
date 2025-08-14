/**
 * Class representing the Game Over screen object, shown after losing.
 * Inherits from DrawableObject.
 */
class GameOver extends DrawableObject {

    /**
     * Creates the Game Over screen and loads the background image.
     */
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