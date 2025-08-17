/**
 * Handles all relevant collisions in the game (enemies, coins, bottles, hits, etc.).
 * @returns {void}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.checkCollisions = function () {
    this.checkEnemyCollisions();
    this.checkLittleEnemyCollisions();
    this.collectCoinItems();
    this.collectBottleItems();
    this.checkBottleHits();
  };
})();

/**
 * Checks collisions with main enemies (Chicken, Endboss).
 * @returns {void}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.checkEnemyCollisions = function () {
    this.level.enemies.forEach(enemy => {
      if (enemy instanceof Chicken) this.handleChickenCollision(enemy);
      else if (enemy instanceof Endboss) this.handleEndbossCollision(enemy);
    });
  };
})();

/**
 * Checks collisions with little enemies.
 * @returns {void}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.checkLittleEnemyCollisions = function () {
    this.level.little_enemies.forEach(enemy => {
      if (enemy.isDead || enemy.removeFromWorld) return;
      if (this.character.isColliding(enemy)) {
        const above = this.character.y + this.character.height <= enemy.y + enemy.height / 2;
        if (above && this.character.speedY < 0) {
          enemy.die();
          this.character.bounce();
        } else {
          this.character.hit();
          this.character.hasPlayedHurtSound = false;
          this.level.statusBarHealth.setPercentage(this.character.energy);
        }
      }
    });
  };
})();

/**
 * Handles collision with a Chicken.
 * @param {Chicken} enemy - The Chicken object.
 * @returns {void}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.handleChickenCollision = function (enemy) {
    if (!enemy.isDead && !enemy.removeFromWorld && this.character.isColliding(enemy)) {
      const above = this.character.y + this.character.height <= enemy.y + enemy.height / 2;
      if (above && this.character.speedY < 0) {
        enemy.die();
        this.character.bounce();
      } else {
        this.character.hit();
        this.character.hasPlayedHurtSound = false;
        this.level.statusBarHealth.setPercentage(this.character.energy);
      }
    }
  };
})();

/**
 * Handles collision with the Endboss.
 * @param {Endboss} enemy - The Endboss object.
 * @returns {void}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.handleEndbossCollision = function (enemy) {
    if (this.character.isColliding(enemy) && enemy.activated) {
      enemy.collideAttack();
      this.character.hit();
      this.character.hasPlayedHurtSound = false;
      this.level.statusBarHealth.setPercentage(this.character.energy);
    }
  };
})();

/**
 * Collects coins (checks collision and plays sound).
 * @returns {void}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.collectCoinItems = function () {
    const before = this.coinCount;
    this.level.coins = this.collectItems({
      items: this.level.coins,
      countKey: 'coinCount',
      statusBar: this.level.statusBarCoin,
      maxCount: 5
    });
    if (this.coinCount > before) this.audio.playOriginal('coinCollected');
  };
})();

/**
 * Collects bottles (checks collision and plays sound).
 * @returns {void}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.collectBottleItems = function () {
    const before = this.bottleCount;
    this.level.bottles = this.collectItems({
      items: this.level.bottles,
      countKey: 'bottleCount',
      statusBar: this.level.statusBarBottle,
      maxCount: 5
    });
    if (this.bottleCount > before) this.audio.playCloned('bottleCollect');
    this.collectThrowablePickups();
  };
})();

/**
 * Scan throwableObjects and pick up landed bottles when colliding with the character.
 * Marks the throwable removed and increases bottleCount (max 5).
 * @this {World}
 * @returns {void}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.collectThrowablePickups = function () {
    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
      const t = this.throwableObjects[i];
      if (!t || t.removeFromWorld || t.splashed || !t.pickable) continue;
      if (this.character.isColliding(t)) {
        if (this.bottleCount < 5) {
          this.bottleCount++;
          this.level.statusBarBottle.setPercentage((this.bottleCount / 5) * 100);
          this.audio.playCloned('bottleCollect');
        }
        t.removeFromWorld = true;
        this.throwableObjects.splice(i, 1);
      }
    }
  };
})();

/**
 * Generic item collection method.
 * @param {Object} params - Parameters object.
 * @param {Array} params.items - List of items to collect.
 * @param {string} params.countKey - Name of the counter in the World object.
 * @param {Object} params.statusBar - Status bar to update.
 * @param {number} params.maxCount - Maximum number of items.
 * @returns {Array} Filtered list of items that were not collected.
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.collectItems = function ({ items, countKey, statusBar, maxCount }) {
    return items.filter(item => {
      if (this.character.isColliding(item)) {
        this[countKey]++;
        statusBar.setPercentage((this[countKey] / maxCount) * 100);
        return false;
      }
      return true;
    });
  };
})();

/**
 * Checks if bottles should be thrown and executes the throw.
 * @returns {void}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.checkThrowObjects = function () {
    const now = Date.now();
    if (this.keyboard.D && this.bottleCount > 0 && now - this.lastBottleThrow > 1000) {
      this.lastBottleThrow = now;
      const direction = this.character.otherDirection ? -1 : 1;
      const b = new ThrowableObject(this.character.x + 100 * direction, this.character.y + 100);
      b.world = this;
      b.direction = direction;
      b.startHorizontalMovement();
      this.throwableObjects.push(b);
      this.level.statusBarBottle.setPercentage(--this.bottleCount / 5 * 100);
      this.audio.playCloned('bottleThrow');
      this.character.lastMoveTime = now;
    }
  };
})();

/**
 * Checks all bottle collisions.
 * @returns {void}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.checkBottleHits = function () {
    for (let bottle of this.throwableObjects) {
      this.checkBottleHitChickens(bottle);
      this.checkBottleHitLittleChickens(bottle);
      this.checkBottleHitEndboss(bottle);
    }
  };
})();

/**
 * Checks bottle collisions with main enemies.
 * @param {ThrowableObject} bottle - Thrown bottle.
 * @returns {void}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.checkBottleHitChickens = function (bottle) {
    this.level.enemies.forEach(enemy => {
      if (enemy instanceof Chicken && this.shouldBottleAffectEnemy(bottle, enemy)) {
        enemy.die(false);
        bottle.splash();
      }
    });
  };
})();

/**
 * Checks bottle collisions with little enemies.
 * @param {ThrowableObject} bottle - Thrown bottle.
 * @returns {void}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.checkBottleHitLittleChickens = function (bottle) {
    this.level.little_enemies.forEach(enemy => {
      if (enemy instanceof LittleChicken && this.shouldBottleAffectEnemy(bottle, enemy)) {
        enemy.die(false);
        bottle.splash();
      }
    });
  };
})();

/**
 * Checks bottle collisions with the Endboss.
 * @param {ThrowableObject} bottle - Thrown bottle.
 * @returns {void}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.checkBottleHitEndboss = function (bottle) {
    this.level.enemies.forEach(enemy => {
      if (enemy instanceof Endboss && this.shouldBottleAffectEnemy(bottle, enemy) && !enemy.isDead) {
        enemy.hit();
        bottle.splash();
        this.level.statusBarEndboss.setPercentage(enemy.energy);
      }
    });
  };
})();

/**
 * Determines whether a bottle should affect an enemy.
 * @param {ThrowableObject} bottle - Thrown bottle.
 * @param {Enemy} enemy - Potential enemy.
 * @returns {boolean}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.shouldBottleAffectEnemy = function (bottle, enemy) {
    const isEndboss = enemy instanceof Endboss;
    return bottle.isColliding(enemy) &&
      !bottle.splashed &&
      !enemy.isDead &&
      !bottle.onGround &&
      (!isEndboss || !bottle.onGround);
  };
})();

/**
 * Checks if the character hits enemies (e.g., by jumping on them).
 * @returns {void}
 */
(function () {
  const worldCollision = window.World.prototype;
  worldCollision.checkCharacterHitsEnemies = function () {
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