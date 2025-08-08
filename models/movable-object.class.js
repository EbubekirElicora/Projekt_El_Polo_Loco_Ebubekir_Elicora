/**
 * Basisklasse für bewegliche Objekte, erweitert DrawableObject.
 * Enthält Bewegung, Schwerkraft, Lebensenergie, Sounds und Animation.
 */
class MovableObject extends DrawableObject {
    damagePerHit = 20;
    invincibleDuration = 1000;
    speed = 0.2;
    otherDirection = false;
    speedY = 0;
    acceleration = 3;
    energy = 100;
    lastHit = 0;
    gravityInterval;

    constructor(audio = null) {
        super();
        this.audio = audio;
        this.currentAudioClone = null;
    }

    /**
     * Startet einen Loop-Sound, z.B. für Bewegungsgeräusche.
     * @param {string} soundName - Name des abzuspielenden Sounds
     */
    startLoopingSound(soundName) {
        console.log('[Movable] startLoopingSound for', this.constructor.name, 'before:', this.currentAudioClone);
        console.log('[Movable] stopLoopingSound for', this.constructor.name, 'current:', this.currentAudioClone);
        if (!this.audio) return;
        this.stopLoopingSound();
        this.currentAudioClone = this.audio.playCloned(soundName, true);
    }

    /**
     * Stoppt den aktuell laufenden Loop-Sound.
     */
    stopLoopingSound() {
        console.log('[Movable] startLoopingSound for', this.constructor.name, 'before:', this.currentAudioClone);
        console.log('[Movable] stopLoopingSound for', this.constructor.name, 'current:', this.currentAudioClone);
        if (this.currentAudioClone) {
            this.currentAudioClone.pause();
            this.currentAudioClone.currentTime = 0;
            this.currentAudioClone = null;
        }
    }

    /**
     * Bereinigt Intervalle und Sounds (z.B. beim Entfernen des Objekts).
     */
    cleanup() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (this.walkInterval) clearInterval(this.walkInterval);
        if (this.gravityInterval) {
            clearInterval(this.gravityInterval);
            this.gravityInterval = null; // wichtig, um mehrfaches Setzen zu verhindern
        }
        this.stopLoopingSound();
    }

    /**
     * Startet die Schwerkraft-Simulation mit festem Intervall.
     */
    applyGravity() {
        if (this.gravityInterval) return;
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
            if (this.y > 130) this.landOnGround();
        }, 1000 / 25);
    }

    /**
     * Prüft, ob das Objekt sich über dem Boden befindet.
     * @returns {boolean}
     */
    isAboveGround() {
        return this instanceof ThrowableObject
            ? !this.onGround
            : this.y < 135;
    }

    /**
     * Setzt das Objekt auf den Boden und stoppt vertikale Bewegung.
     */
    landOnGround() {
        this.y = 135;
        this.speedY = 0;
        this.handleLandingSound();
    }

    /**
     * Verursacht Schaden am Objekt, wenn es nicht gerade unverwundbar ist.
     */
    hit() {
        let now = Date.now();
        if (now - this.lastHit > this.invincibleDuration) {
            this.energy = Math.max(0, this.energy - this.damagePerHit);
            this.lastHit = now;
        }
    }

    /**
     * Prüft, ob das Objekt gerade Schaden erlitten hat (Invincible-Phase).
     * @returns {boolean}
     */
    isHurt() {
        return (Date.now() - this.lastHit) < this.invincibleDuration;
    }

    /**
     * Prüft, ob das Objekt keine Energie mehr hat.
     * @returns {boolean}
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Bewegt das Objekt nach rechts.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Bewegt das Objekt nach links.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Lässt das Objekt springen, setzt die vertikale Geschwindigkeit.
     */
    jump() {
        this.speedY = 35;
    }

    /**
     * Spielt eine Animation anhand eines Bildarrays ab.
     * @param {string[]} images - Array mit Bildpfaden
     */
    playAnimation(images) {
        const idx = this.currentImage++ % images.length;
        const path = images[idx];
        this.img = this.imageCache[path];
    }
}
