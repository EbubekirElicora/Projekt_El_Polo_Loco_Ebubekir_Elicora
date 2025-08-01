/**
 * Repräsentiert ein Hintergrundobjekt, das sich bewegen kann.
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
   * Erzeugt ein Array von Hintergrundobjekten mit mehreren Layern.
   * @param {number} [segments=8]
   * @returns {BackgroundObject[]}
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
