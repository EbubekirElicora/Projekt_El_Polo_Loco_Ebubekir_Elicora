/**
 * Represents a background object that can move.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }

  /**
   * Creates an array of background objects with multiple layers.
   * @param {number} [segments=8] - The number of segments to generate.
   * @returns {BackgroundObject[]} An array containing the generated background objects.
   */
  static createBackground(segments = 8) {
    let backgroundObjects = [];
    let layers = [
      background_images.air,
      background_images.third_layer,
      background_images.second_layer,
      background_images.first_layer
    ];
    for (let i = -1; i < segments - 1; i++) {
      let x = i * 719;
      layers.forEach(layer => {
        let img = layer[Math.abs(i) % layer.length];
        backgroundObjects.push(new BackgroundObject(img, x));
      });
    }
    return backgroundObjects;
  }
}
