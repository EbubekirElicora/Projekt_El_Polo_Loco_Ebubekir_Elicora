/**
 * Basisklasse für alle Objekte, die auf dem Canvas gezeichnet werden.
 * Verwaltet Bildladen, Zeichnen, Transformation und Kollisionsprüfungen.
 */
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 150;
    y = 130;
    width = 100;
    height = 150;
    rotation = 0;

    /**
     * Lädt ein Bild für das Objekt.
     * @param {string} path - Pfad zum Bild.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Lädt mehrere Bilder und speichert sie im Cache.
     * @param {string[]} paths - Array von Bildpfaden.
     */
    loadImages(paths) {
        paths.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Zeichnet das Objekt auf den Canvas mit aktuellen Transformationen.
     * @param {CanvasRenderingContext2D} ctx - Canvas-Kontext.
     */
    draw(ctx) {
        ctx.save();
        this.applyTransformations(ctx);
        this.renderImage(ctx);
        ctx.restore();
        this.drawFrame(ctx);
    }

    /**
     * Wendet Rotation und Translation an.
     * @param {CanvasRenderingContext2D} ctx
     */
    applyTransformations(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        ctx.translate(centerX, centerY);
        ctx.scale(Math.cos(this.rotation), 1);
    }

    /**
     * Zeichnet das Bild zentriert.
     * @param {CanvasRenderingContext2D} ctx
     */
    renderImage(ctx) {
        ctx.drawImage(
            this.img, -this.width / 2,
            -this.height / 2, this.width,
            this.height);
    }

    /**
     * Zeichnet den Kollisionsrahmen (für Debugging).
     * @param {CanvasRenderingContext2D} ctx
     */
    drawFrame(ctx) {
        // Debug-Box für wichtige Objekte
        if (this instanceof Character
            || this instanceof Chicken
            || this instanceof LittleChicken
            || this instanceof ThrowableObject
            || this instanceof Coin
            || this instanceof Bottle
            || this instanceof Endboss) {
            const b = this.getCollisionBox();
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'transparent';
            ctx.rect(b.x, b.y, b.width, b.height);
            ctx.stroke();
        }
    }

    /**
     * Gibt die Kollisionsbox zurück.
     * Überschreibbar für präzisere Hitboxen.
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    getCollisionBox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Prüft Kollision mit einem anderen DrawableObject.
     * @param {DrawableObject} other
     * @returns {boolean}
     */
    isColliding(other) {
        const a = this.getCollisionBox();
        const b = other.getCollisionBox();
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    /**
     * Prüft, ob das Objekt von oben auf ein Zielobjekt springt.
     * @param {DrawableObject} target
     * @returns {boolean}
     */
    isJumpingOn(target) {
        const a = this.getCollisionBox();
        const b = target.getCollisionBox();
        const fromAbove = this.speedY < 0 && (a.y + a.height) <= (b.y + 20);
        const horizontal = a.x + a.width > b.x && a.x < b.x + b.width;
        return fromAbove && horizontal;
    }

    /**
     * Erstellt eine gepolsterte Kollisionsbox, zentriert.
     * @param {number} [padX=0] - Horizontaler Padding.
     * @param {number} [padY=0] - Vertikaler Padding.
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    createCenteredBox(padX = 0, padY = 0) {
        return {
            x: this.x + padX / 2,
            y: this.y + padY / 2,
            width: this.width - padX,
            height: this.height - padY
        };
    }
}
