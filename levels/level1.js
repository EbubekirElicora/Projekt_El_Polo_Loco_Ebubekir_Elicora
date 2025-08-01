let level1;

function initLevel() {
    level1 = new Level(
        [
            new Chicken(audio),
            new Chicken(audio),
            new Chicken(audio),
            new Endboss(audio)
        ],
        [
            new LittleChicken(audio),
            new LittleChicken(audio),
            new LittleChicken(audio),
            new LittleChicken(audio),
            new LittleChicken(audio),
        ],
        [
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
        ],
        BackgroundObject.createBackground(8),
        [
            new Coin(600, 280),
            new Coin(1200, 20),
            new Coin(1800, 20),
            new Coin(2400, 20),
            new Coin(3000, 280)
        ],
        [
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle()
        ],
        new StatusBar('health', 40, 40, false),
        new StatusBar('bottle', 40, 0, true),
        new StatusBar('coin', 40, 85, true),
        new StatusBar('endboss', 400, 8, false));
}
