/**
 * StatusBar zeigt eine visuelle Anzeige für Lebensenergie, Munition etc.
 * Verwendet Bilder-Sets, die prozentual den Status darstellen.
 */
class StatusBar extends DrawableObject {
    percentage = 100;
    counterUp = false;
    statusBarsImages;

    /**
     * @param {string} type - Schlüssel für den Statusbar-Typ (z.B. "health", "ammo")
     * @param {number} x - x-Position auf der Leinwand
     * @param {number} y - y-Position auf der Leinwand
     * @param {boolean} counterUp - Zählt die Statusbar von 0 hoch? (default false)
     */
    constructor(type, x, y, counterUp = false) {
        super();
        this.x = x;
        this.y = y;
        this.width = 240;
        this.height = 60;
        this.counterUp = counterUp;
        this.statusBarsImages = statusbar_images[type];
        this.loadImages(this.statusBarsImages);
        this.setPercentage(counterUp ? 0 : 100);
    }

    /**
     * Setzt den Statuswert und aktualisiert das angezeigte Bild.
     * @param {number} percentage - Wert zwischen 0 und 100
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let imgIndex = this.resolveImageIndex();
        let path = this.statusBarsImages[imgIndex];
        this.img = this.imageCache[path];
    }

    /**
     * Ermittelt das Bild-Index basierend auf Prozentwert und counterUp-Flag.
     * @returns {number} Index des Bildes im statusBarsImages Array
     */
    resolveImageIndex() {
        if (this.counterUp) {
            if (this.percentage >= 100) return 5;
            if (this.percentage >= 75) return 4;
            if (this.percentage >= 50) return 3;
            if (this.percentage >= 25) return 2;
            if (this.percentage > 0) return 1;
            return 0;
        } else {
            if (this.percentage >= 100) return 5;
            if (this.percentage >= 80) return 4;
            if (this.percentage >= 60) return 3;
            if (this.percentage >= 40) return 2;
            if (this.percentage >= 20) return 1;
            return 0;
        }
    }
}
