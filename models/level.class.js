/**
 * The `Level` class represents a complete level in the game.
 * A level consists of enemies, clouds, background objects, and various items.
 * It has a defined end (`level_end_x`), after which no movement or new enemies should appear.
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
     * Creates a new level with the provided objects.
     * 
     * @param {MovableObject[]} enemies - Large enemies present in the level.
     * @param {MovableObject[]} little_enemies - Small enemies, e.g., chicks.
     * @param {Cloud[]} clouds - Cloud objects moving in the background.
     * @param {BackgroundObject[]} backgroundObjects - Graphical background elements for atmosphere.
     * @param {Coin[]} coins - All coins that can be collected in the level.
     * @param {Bottle[]} bottles - All bottles that can be collected or thrown.
     * @param {StatusBar} statusBarHealth - Player's health bar.
     * @param {StatusBar} statusBarBottle - Display for available bottles.
     * @param {StatusBar} statusBarCoin - Display for collected coins.
     * @param {StatusBar} statusBarEndboss - Endboss health bar.
     */
    constructor(
        enemies, little_enemies, clouds, backgroundObjects,
        coins, bottles, statusBarHealth, statusBarBottle, statusBarCoin, statusBarEndboss
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
