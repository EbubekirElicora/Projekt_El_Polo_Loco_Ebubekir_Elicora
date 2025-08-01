/**
 * Die Klasse `Level` beschreibt ein komplettes Level im Spiel.
 * 
 * Ein Level besteht aus Gegnern, Wolken, Hintergrundobjekten und verschiedenen Items.
 * Es hat ein fest definiertes Ende (`level_end_x`), ab dem keine Bewegung oder Gegner mehr vorkommen sollen.
 * 
 * @class
 */
class Level {

    enemies;
    little_enemies;
    clouds;
    backgroundObjects;
    level_end_x = 4200;
    coins;
    bottles;
    statusBarHealth;
    statusBarBottle;
    statusBarCoin;
    statusBarEndboss;

    /**
     * Erzeugt ein neues Level mit übergebenen Objekten.
     * 
     * @param {MovableObject[]} enemies - Große Gegner, die im Level vorkommen.
     * @param {MovableObject[]} little_enemies - Kleine Gegner, z. B. Küken.
     * @param {Cloud[]} clouds - Wolkenobjekte, die sich im Hintergrund bewegen.
     * @param {BackgroundObject[]} backgroundObjects - Grafische Hintergrundobjekte für die Level-Atmosphäre.
     * @param {Coin[]} coins - Alle Münzen, die im Level eingesammelt werden können.
     * @param {Bottle[]} bottles - Alle Flaschen, die im Level eingesammelt oder geworfen werden können.
     * @param {StatusBar} statusBarHealth - Lebensanzeige des Spielers.
     * @param {StatusBar} statusBarBottle - Anzeige für verfügbare Flaschen.
     * @param {StatusBar} statusBarCoin - Anzeige für gesammelte Münzen.
     * @param {StatusBar} statusBarEndboss - Lebensanzeige des Endgegners.
     */
    constructor(
        enemies,
        little_enemies,
        clouds,
        backgroundObjects,
        coins,
        bottles,
        statusBarHealth,
        statusBarBottle,
        statusBarCoin,
        statusBarEndboss
    ) {
        this.enemies = enemies;
        this.little_enemies = little_enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.statusBarHealth = statusBarHealth;
        this.statusBarBottle = statusBarBottle;
        this.statusBarCoin = statusBarCoin;
        this.statusBarEndboss = statusBarEndboss;
    }
}