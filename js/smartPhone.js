/**
 * Initialisiert alle Smartphone-/Tablet-spezifischen Interaktionen:
 * - Drehen-Warnung (Portrait)
 * - Touch-Controls (Landscape)
 * - Verstecken/Einblenden von UI-Elementen beim Start, Restart, Options
 */
document.addEventListener('DOMContentLoaded', () => {
  const overlay         = document.getElementById('rotate-overlay');
  const rotateMessage   = overlay?.querySelector('.rotate-message');
  const mainHeadline    = document.getElementById('main_headline');
  const startBtn        = document.querySelector('#menu button[onclick="startGame()"]');
  const canvasContainer = document.getElementById('canvas-container');
  const controlsBtn     = document.getElementById('controls-btn');
  const optionsBackBtn  = document.getElementById('options-back');
  const whiteIcons      = document.querySelectorAll('.white-icon');
  const touchControls   = document.getElementById('touch-controls');
  const btnLeft         = document.getElementById('touch-left');
  const btnRight        = document.getElementById('touch-right');
  const btnSpace        = document.getElementById('touch-space');
  const btnD            = document.getElementById('touch-d');

  let gameStarted = false;

  /**
   * Erkennt, ob das Gerät Touch unterstützt (Smartphone oder Tablet).
   * @returns {boolean} true, wenn das Gerät Touch-Events unterstützt
   */
  function isTouchDevice() {
    return 'ontouchstart' in window
        || navigator.maxTouchPoints > 0
        || navigator.msMaxTouchPoints > 0;
  }

  /**
   * Prüft Bildschirmgröße, Gerätetyp und Orientierung, 
   * um Rotate-Overlay oder Touch-Controls ein- bzw. auszublenden.
   * @returns {void}
   */
  function checkOrientation() {
    if (!overlay || !rotateMessage) return;
    const isTouch       = isTouchDevice();
    const isMobileWidth = isTouch && window.innerWidth <= 1200;
    const isPortrait    = window.innerHeight > window.innerWidth;

    if (isMobileWidth && isPortrait) {
      showRotateOverlay();
    } else {
      hideRotateOverlay(isMobileWidth, isPortrait);
    }

    updateWhiteIconsVisibility();
  }

  /**
   * Verknüpft Touch-Buttons mit den entsprechenden Keyboard-Keys in `world.keyboard`.
   * @returns {void}
   */
  function setupTouchControls() {
    const map = [
      [btnLeft,  'LEFT'],
      [btnRight, 'RIGHT'],
      [btnSpace, 'SPACE'],
      [btnD,     'D']
    ];
    map.forEach(([btn, key]) => {
      btn.addEventListener('touchstart', () => world.keyboard[key] = true);
      btn.addEventListener('touchend',   () => world.keyboard[key] = false);
    });
  }

  /**
   * Registriert alle Event-Listener für Resize, Orientation, Start, Controls, Options-Back und Restart.
   * @returns {void}
   */
  function setupEventListeners() {
    window.addEventListener('resize',           checkOrientation);
    window.addEventListener('orientationchange',checkOrientation);

    startBtn?.addEventListener('click', () => {
      gameStarted = true;
      mainHeadline.classList.add('hidden');
      touchControls?.style.removeProperty('display');
      checkOrientation();
    });

    controlsBtn?.addEventListener('click', () => {
      if (gameStarted) mainHeadline.classList.add('hidden');
    });

    optionsBackBtn?.addEventListener('click', () => {
      if (gameStarted) setTimeout(() => mainHeadline.classList.add('hidden'), 0);
    });

    const restartBtn = document.getElementById('restart-btn');
    restartBtn?.addEventListener('click', () => {
      gameStarted = false;
      touchControls?.style.setProperty('display', 'none', 'important');
      checkOrientation();
    });
  }

  /**
   * Zeigt das Rotate-Overlay an und versteckt Canvas, White-Icons und Touch-Controls.
   * @returns {void}
   */
  function showRotateOverlay() {
    overlay.classList.remove('hidden');
    rotateMessage.textContent =
      'Bitte drehe dein Handy ins Querformat um spielen zu können!';
    canvasContainer?.classList.add('hidden');
    whiteIcons.forEach(el => el.classList.add('hidden'));
    touchControls?.classList.add('hidden');
  }

  /**
   * Versteckt das Rotate-Overlay und zeigt je nach Zustand Canvas oder Touch-Controls.
   * @param {boolean} isMobileWidth – true, wenn Breite ≤1200px
   * @param {boolean} isPortrait    – true, wenn Höhe > Breite
   * @returns {void}
   */
  function hideRotateOverlay(isMobileWidth, isPortrait) {
    overlay.classList.add('hidden');
    if (!isMobileWidth) {
      touchControls?.classList.add('hidden');
    }
    if (gameStarted) {
      canvasContainer?.classList.remove('hidden');
      if (isMobileWidth && !isPortrait) {
        touchControls?.classList.remove('hidden');
      }
    }
  }

  /**
   * Steuert die Sichtbarkeit der White-Icons basierend auf Gerät, Bildschirmgröße und Spielstatus.
   * @returns {void}
   */
  function updateWhiteIconsVisibility() {
    const isTouch       = isTouchDevice();
    const isMobileWidth = isTouch && window.innerWidth <= 1000;
    const isPortrait    = window.innerHeight > window.innerWidth;

    if (isMobileWidth && (isPortrait || gameStarted)) {
      whiteIcons.forEach(el => el.classList.add('hidden'));
    } else {
      whiteIcons.forEach(el => el.classList.remove('hidden'));
    }
  }

  // → Initialisierung
  setupTouchControls();
  setupEventListeners();
  checkOrientation();
});
