/**
 * Class for the victory screen object displayed after winning the game.
 * Inherits from DrawableObject.
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