/**
 * Initialisiert alle Smartphone-spezifischen Interaktionen:
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
   * Prüft Display-Größe und Orientierungswechsel und blendet
   * entweder das Rotate-Overlay oder die Touch-Controls ein/aus.
   * @returns {void}
   */
  function checkOrientation() {
    if (!overlay || !rotateMessage) return;
    const isMobileWidth = window.innerWidth <= 1080;
    const isPortrait    = window.innerHeight > window.innerWidth;
    if (isMobileWidth && isPortrait) {
      showRotateOverlay();
    } else {
      hideRotateOverlay(isMobileWidth, isPortrait);
    }
  }

  /**
   * Verknüpft alle Touch-Buttons mit den entsprechenden world.keyboard-Keys.
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
   * Registriert alle weiteren Event-Listener:
   * - resize / orientationchange → checkOrientation()
   * - Klick auf Start, Controls, Options-Back, Restart
   * @returns {void}
   */
  function setupEventListeners() {
    window.addEventListener('resize',           checkOrientation);
    window.addEventListener('orientationchange',checkOrientation);

    startBtn?.addEventListener('click', () => {
      gameStarted = true;
      mainHeadline.classList.add('hidden');
      whiteIcons.forEach(el => el.classList.add('hidden'));
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
      touchControls?.classList.add('hidden');
    });
  }

  /**
   * Zeigt das Rotate-Overlay und versteckt alle anderen UI-Elemente.
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
   * Versteckt das Rotate-Overlay und zeigt je nach Zustand
   * entweder Touch-Controls (Mobile Landscape) oder White-Icons.
   * @param {boolean} isMobileWidth - true, wenn Breite ≤1080px
   * @param {boolean} isPortrait - true, wenn Höhe > Breite
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
    } else {
      whiteIcons.forEach(el => el.classList.remove('hidden'));
    }
  }

  setupTouchControls();
  setupEventListeners();
  checkOrientation();
});
