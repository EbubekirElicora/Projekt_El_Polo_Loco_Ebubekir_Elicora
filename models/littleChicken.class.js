/**
 * Repräsentiert ein kleines Huhn (LittleChicken), das im Spiel als kleiner Gegner auftritt.
 * Läuft automatisch nach links und spielt eine Laufanimation. Kann durch den Spieler besiegt werden.
 */
class LittleChicken extends MovableObject {
    height = 70;
    width = 50;
    y = 350;
    isDead = false;
    removeFromWorld = false;

    /**
     * Erzeugt ein kleines Huhn mit zufälliger Startposition und Geschwindigkeit.
     * Lädt die entsprechenden Bilder und startet Bewegung + Animation + Sound.
     * 
     * @param {AudioSounds} audio - Das Audio-System des Spiels, um Sounds abzuspielen.
     */
    constructor(audio) {
        super(audio);
        this.enemies_little_images = enemies_little_images;
        this.loadImage(this.enemies_little_images.walking[0]);
        this.loadImages(this.enemies_little_images.walking);
        this.loadImages(this.enemies_little_images.dead);
        this.x = 400 + Math.random() * 2900;
        this.speed = 0.2 + Math.random() * 0.8;
        this.animate();
    }

    /**
     * Startet die Bewegung und Animation (laufen + Sound).
     */
    animate() {
        this.moveInterval = setInterval(() => {
            if (!this.isDead) this.moveLeft();
        }, 1000 / 60);
        this.walkInterval = setInterval(() => {
            if (!this.isDead) this.playAnimation(this.enemies_little_images.walking);
        }, 100);
        this.startLoopingSound('littleChickenRun', true);
    }

    /**
     * Lässt das Huhn sterben (Bildwechsel, stoppt Bewegung + Sound, wird später entfernt).
     */
    die() {
        this.isDead = true;
        this.speed = 0;
        this.loadImage(this.enemies_little_images.dead[0]);
        this.stopLoopingSound('littleChickenRun');
        if (this.audio) this.audio.playCloned('chickenDead');
        setTimeout(() => this.removeFromWorld = true, 1000);
    }

    /**
     * Gibt die Kollisionsbox zurück, leicht verkleinert gegenüber der Grafik.
     * 
     * @returns {Object} Ein zentriertes Rechteck mit horizontalem/vertikalem Padding.
     */
    getCollisionBox() {
        return this.createCenteredBox(this.width * 0.1, this.height * 0.2);
    }
}
