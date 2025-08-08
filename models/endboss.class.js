/**
 * Repräsentiert den Endboss des Spiels.
 * Erbt von MovableObject und verwaltet Animationen, Bewegung und Status.
 */
class Endboss extends MovableObject {
    height = 400;
    width = 250;
    x = 4500;
    startX;
    y = 50;
    speed = 0;
    energy = 100;
    isDead = false; activated = false; attacking = false;
    isHurtAnimationRunning = false; isAnimationFinished = false;
    currentHurtFrame = 0; currentDeadFrame = 0; lastHit = 0;
    hurtTimeout = null; alertInterval = null; hurtInterval = null;
    deadInterval = null; walkInterval = null; moveInterval = null;
    attackInterval = null;

    /**
     * Erstellt den Endboss und lädt alle Animationsbilder.
     * @param {AudioManager} audio Audio-Manager für Soundeffekte
     */
    constructor(audio) {
        super(audio);
        this.startX = this.x;
        this.endboss_images = endboss_images;
        this.loadImage(this.endboss_images.alert[0]);
        this.loadImages(this.endboss_images.alert);
        this.loadImages(this.endboss_images.walk);
        this.loadImages(this.endboss_images.attack);
        this.loadImages(this.endboss_images.hurt);
        this.loadImages(this.endboss_images.dead);
        this.animateAlert();
    }

    /** Startet den Bosskampf, aktiviert den Endboss */
    startBattle() {
        if (this.activated || this.isDead) return;
        this.activated = true;
        clearInterval(this.alertInterval);
        this.playAttackOnce(() => this.startWalking());
    }

    /**
     * Wie weit ist der Boss schon gelaufen?
     */
    get distanceMoved() {
        return this.startX - this.x;
    }


    /** Führt eine Angriffanimation bei Kollision aus */
    collideAttack() {
        if (this.attacking || this.isDead) return;
        this.stopWalking();
        this.playAttackOnce(() => this.startWalking());
    }

    /**
     * Spielt die Angriffanimation einmal ab und ruft callback danach auf
     * @param {Function} callback Funktion nach Animation
     */
    playAttackOnce(callback) {
        this.attacking = true;
        let i = 0;
        const frames = this.endboss_images.attack;
        if (this.attackInterval) {
            clearInterval(this.attackInterval);
            this.attackInterval = null;
        }
        this.attackInterval = setInterval(() => {
            this.img = this.imageCache[frames[i]];
            i++;
            if (i >= frames.length) {
                clearInterval(this.attackInterval);
                this.attackInterval = null;
                this.attacking = false;
                if (callback) callback();
            }
        }, 150);
    }

    /** Startet Bewegung nach links mit Laufanimation und Sound */
    startWalking() {
        this.speed = 2;
        this.walkInterval = setInterval(() => {
            this.playAnimation(this.endboss_images.walk);
        }, 180);
        this.moveInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
        this.startLoopingSound('chickenRun', true);
    }

    /** Stoppt alle Laufanimationen und Bewegung */
    stopWalking() {
        clearInterval(this.walkInterval);
        clearInterval(this.moveInterval);
    }

    /** Wartet-Animation abspielen, wenn Boss noch nicht aktiviert oder verletzt */
    animateAlert() {
        this.alertInterval = setInterval(() => {
            if (!this.isHurtAnimationRunning && !this.activated) {
                this.playAnimation(this.endboss_images.alert);
            }
        }, 200);
    }

    /** Startet die Verletzungsanimation */
    animateHurt() {
        if (this.isHurtAnimationRunning) return;
        this.isHurtAnimationRunning = true;
        this.currentHurtFrame = 0;
        clearInterval(this.alertInterval);
        this.hurtInterval = setInterval(() => this.updateHurtFrame(), 250);
    }

    /** Aktualisiert den Frame der Verletzungsanimation */
    updateHurtFrame() {
        const frames = this.endboss_images.hurt;
        this.img = this.imageCache[frames[this.currentHurtFrame]];
        this.currentHurtFrame++;
        if (this.currentHurtFrame >= frames.length) {
            this.endHurtAnimation();
        }
    }

    /** Beendet die Verletzungsanimation und startet ggf. die Alert-Animation */
    endHurtAnimation() {
        clearInterval(this.hurtInterval);
        this.isHurtAnimationRunning = false;
        this.animateAlert();
    }

    /** Verarbeitet Schaden am Boss */
    hit() {
        if (this.energy <= 0) return;
        this.decreaseEnergy();
        this.startHurtAnimationIfNeeded();
        this.restartAfterPause();
        if (this.energy <= 0) {
            this.die();
        }
    }

    /** Verringert die Energie des Bosses */
    decreaseEnergy() {
        this.energy -= 20;
        this.lastHit = Date.now();
    }

    /** Startet Verletzungsanimation, wenn nicht bereits aktiv */
    startHurtAnimationIfNeeded() {
        if (!this.isHurtAnimationRunning) {
            this.animateHurt();
        }
    }

    /** Nach Verletzung kurz pausieren und dann wieder laufen */
    restartAfterPause() {
        if (this.hurtTimeout) clearTimeout(this.hurtTimeout);
        this.stopWalking();
        this.hurtTimeout = setTimeout(() => {
            if (!this.isDead) {
                this.startWalking();
            }
            this.hurtTimeout = null;
        }, 1000);
    }

    /** Setzt Boss in den Totzustand und stoppt Sound */
    die() {
        this.setDeadState();
        this.stopAllAnimations();
        this.animateDeadOnce();
    }

    /** Spielt die Sterbeanimation einmal ab */
    animateDeadOnce() {
        const frames = this.endboss_images.dead;
        this.currentDeadFrame = 0;
        this.isAnimationFinished = false;
        this.deadInterval = setInterval(() => {
            this.img = this.imageCache[frames[this.currentDeadFrame]];
            this.currentDeadFrame++;
            if (this.currentDeadFrame >= frames.length) {
                clearInterval(this.deadInterval);
                this.removeFromWorld = true;
                this.isAnimationFinished = true;
            }
        }, 600);
    }

    /** Setzt Status auf tot und stoppt Lauf-Sound */
    setDeadState() {
        this.energy = 0;
        this.speed = 0;
        this.isDead = true;
        this.stopLoopingSound('chickenRun');
    }

    /** Stoppt alle Animationen und Bewegungen */
    stopAllAnimations() {
        clearInterval(this.alertInterval);
        clearInterval(this.hurtInterval);
        clearInterval(this.deadInterval);
        clearInterval(this.walkInterval);
        clearInterval(this.moveInterval);
        clearInterval(this.attackInterval);
        this.stopLoopingSound();
    }

    /** Bereinigt Animationen und Timer, wird extern aufgerufen */
    cleanup() {
        clearInterval(this.deadInterval);
        this.stopAllAnimations();
    }

    /**
     * Liefert die Kollisionsbox des Endbosses für Trefferprüfungen.
     * @returns {{x: number, y: number, width: number, height: number}} Kollisionsrechteck
     */
    getCollisionBox() {
        const horizontalPadding = 40;
        const topCut = 50;
        return {
            x: this.x + horizontalPadding / 2,
            y: this.y + topCut,
            width: this.width - horizontalPadding,
            height: this.height - topCut
        };
    }
}