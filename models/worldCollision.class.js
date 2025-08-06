(function() {
  const worldCollision = window.World.prototype;

  /**
   * Prüft alle relevanten Kollisionen im Spiel (Feinde, Münzen, Flaschen, Treffer etc.).
   * @returns {void}
   */
  worldCollision.checkCollisions = function() {
    this.checkEnemyCollisions();
    this.checkLittleEnemyCollisions();
    this.collectCoinItems();
    this.collectBottleItems();
    this.checkBottleHits();
  };

  /**
   * Prüft Kollisionen mit Hauptfeinden (Chicken, Endboss).
   * @returns {void}
   */
  worldCollision.checkEnemyCollisions = function() {
    this.level.enemies.forEach(enemy => {
      if (enemy instanceof Chicken) this.handleChickenCollision(enemy);
      else if (enemy instanceof Endboss) this.handleEndbossCollision(enemy);
    });
  };

  /**
   * Prüft Kollisionen mit kleinen Feinden.
   * @returns {void}
   */
  worldCollision.checkLittleEnemyCollisions = function() {
    this.level.little_enemies.forEach(enemy => {
      if (enemy.isDead || enemy.removeFromWorld) return;
      if (this.character.isColliding(enemy)) {
        const isAbove = this.character.y + this.character.height <= enemy.y + enemy.height / 2;
        const isFalling = this.character.speedY < 0;
        if (isAbove && isFalling) {
          enemy.die();
          this.character.bounce();
        } else {
          this.character.hit();
          this.level.statusBarHealth.setPercentage(this.character.energy);
        }
      }
    });
  };

  /**
   * Behandelt die Kollision mit einem Chicken.
   * @param {Chicken} enemy - Das Chicken-Objekt.
   * @returns {void}
   */
  worldCollision.handleChickenCollision = function(enemy) {
    if (!enemy.isDead && !enemy.removeFromWorld && this.character.isColliding(enemy)) {
      const isAbove = this.character.y + this.character.height <= enemy.y + enemy.height / 2;
      const isFalling = this.character.speedY < 0;
      if (isAbove && isFalling) {
        enemy.die();
        this.character.bounce();
      } else {
        this.character.hit();
        this.level.statusBarHealth.setPercentage(this.character.energy);
      }
    }
  };

  /**
   * Behandelt die Kollision mit dem Endboss.
   * @param {Endboss} enemy - Das Endboss-Objekt.
   * @returns {void}
   */
  worldCollision.handleEndbossCollision = function(enemy) {
    if (this.character.isColliding(enemy) && enemy.activated) {
      enemy.collideAttack();
      this.character.hit();
      this.level.statusBarHealth.setPercentage(this.character.energy);
    }
  };

  /**
   * Sammeln von Münzen (prüft Kollision, spielt Sound ab).
   * @returns {void}
   */
  worldCollision.collectCoinItems = function() {
    const before = this.coinCount;
    this.level.coins = this.collectItems({
      items: this.level.coins,
      countKey: 'coinCount',
      statusBar: this.level.statusBarCoin,
      maxCount: 5
    });
    if (this.coinCount > before) this.audio.playOriginal('coinCollected');
  };

  /**
   * Sammeln von Flaschen (prüft Kollision, spielt Sound ab).
   * @returns {void}
   */
  worldCollision.collectBottleItems = function() {
    const before = this.bottleCount;
    this.level.bottles = this.collectItems({
      items: this.level.bottles,
      countKey: 'bottleCount',
      statusBar: this.level.statusBarBottle,
      maxCount: 5
    });
    if (this.bottleCount > before) this.audio.playOriginal('bottleCollect');
  };

  /**
   * Allgemeine Methode zum Sammeln von Items.
   * @param {Object} params - Parameter-Objekt.
   * @param {Array} params.items - Liste der zu sammelnden Items.
   * @param {string} params.countKey - Name des Zählers im World-Objekt.
   * @param {Object} params.statusBar - Statusleiste, die aktualisiert wird.
   * @param {number} params.maxCount - Maximale Anzahl des Items.
   * @returns {Array} Gefilterte Liste mit nicht eingesammelten Items.
   */
  worldCollision.collectItems = function({ items, countKey, statusBar, maxCount }) {
    return items.filter(item => {
      if (this.character.isColliding(item)) {
        this[countKey]++;
        statusBar.setPercentage((this[countKey] / maxCount) * 100);
        return false;
      }
      return true;
    });
  };

  /**
   * Prüft, ob Flaschen geworfen werden sollen und führt den Wurf aus.
   * @returns {void}
   */
  worldCollision.checkThrowObjects = function() {
    const now = Date.now();
    if (this.keyboard.D && this.bottleCount > 0 && now - this.lastBottleThrow > 1000) {
      this.lastBottleThrow = now;
      let b = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      b.world = this;
      this.throwableObjects.push(b);
      this.bottleCount--;
      this.level.statusBarBottle.setPercentage(this.bottleCount / 5 * 100);
      this.audio.playOriginal('bottleThrow');
    }
  };

  /**
   * Prüft alle Flaschen-Kollisionen.
   * @returns {void}
   */
  worldCollision.checkBottleHits = function() {
    for (let bottle of this.throwableObjects) {
      this.checkBottleHitChickens(bottle);
      this.checkBottleHitLittleChickens(bottle);
      this.checkBottleHitEndboss(bottle);
    }
  };

  /**
   * Prüft Flaschen-Kollision mit Hauptfeinden.
   * @param {ThrowableObject} bottle - Geworfene Flasche.
   * @returns {void}
   */
  worldCollision.checkBottleHitChickens = function(bottle) {
    this.level.enemies.forEach(enemy => {
      if (enemy instanceof Chicken && this.shouldBottleAffectEnemy(bottle, enemy)) {
        enemy.die();
        bottle.splash();
      }
    });
  };

  /**
   * Prüft Flaschen-Kollision mit kleinen Feinden.
   * @param {ThrowableObject} bottle - Geworfene Flasche.
   * @returns {void}
   */
  worldCollision.checkBottleHitLittleChickens = function(bottle) {
    this.level.little_enemies.forEach(enemy => {
      if (enemy instanceof LittleChicken && this.shouldBottleAffectEnemy(bottle, enemy)) {
        enemy.die();
        bottle.splash();
      }
    });
  };

  /**
   * Prüft Flaschen-Kollision mit dem Endboss.
   * @param {ThrowableObject} bottle - Geworfene Flasche.
   * @returns {void}
   */
  worldCollision.checkBottleHitEndboss = function(bottle) {
    this.level.enemies.forEach(enemy => {
      if (enemy instanceof Endboss && this.shouldBottleAffectEnemy(bottle, enemy) && !enemy.isDead) {
        enemy.hit();
        bottle.splash();
        this.level.statusBarEndboss.setPercentage(enemy.energy);
      }
    });
  };

  /**
   * Überprüft, ob eine Flasche einen Feind beeinflussen soll.
   * @param {ThrowableObject} bottle - Geworfene Flasche.
   * @param {Enemy} enemy - Potenzieller Gegner.
   * @returns {boolean}
   */
  worldCollision.shouldBottleAffectEnemy = function(bottle, enemy) {
    const isEndboss = enemy instanceof Endboss;
    return bottle.isColliding(enemy) &&
      !bottle.splashed &&
      !enemy.isDead &&
      !bottle.onGround &&
      (!isEndboss || !bottle.onGround);
  };

  /**
   * Prüft, ob Charakter Feinde trifft (z.B. durch Draufspringen).
   * @returns {void}
   */
  worldCollision.checkCharacterHitsEnemies = function() {
    const enemies = [...this.level.enemies, ...this.level.little_enemies];
    enemies.forEach(enemy => {
      if (!enemy.isDead && this.character.isColliding(enemy)) {
        if (this.character.isJumpingOn(enemy)) {
          enemy.die();
          this.character.bounce();
        } else if (!this.character.isHurt()) {
          this.character.hit();
        }
      }
    });
  };
})();
