let gameStarted = false;

/**
 * Erkennt, ob das Gerät Touch unterstützt (Smartphone oder Tablet).
 * @returns {boolean} true, wenn Touch-Events unterstützt werden.
 */
function isTouchDevice() {
  return 'ontouchstart' in window
    || navigator.maxTouchPoints > 0
    || navigator.msMaxTouchPoints > 0;
}

/**
 * Zeigt das Rotate-Overlay an und versteckt Canvas, White-Icons und Touch-Controls.
 * @param {HTMLElement} overlay - Das Overlay-Element.
 * @param {HTMLElement} canvasContainer - Der Canvas-Container.
 * @param {NodeList} whiteIcons - Sammlung der White-Icon Elemente.
 * @param {HTMLElement} touchControls - Der Container der Touch-Controls.
 */
function showRotateOverlay(overlay, canvasContainer, whiteIcons, touchControls) {
  overlay.classList.remove('hidden');
  overlay.querySelector('.rotate-message').textContent =
    'Bitte drehe dein Handy ins Querformat um spielen zu können!';
  canvasContainer.classList.add('hidden');
  whiteIcons.forEach(el => el.classList.add('hidden'));
  touchControls.classList.add('hidden');
}

/**
 * Versteckt das Rotate-Overlay und zeigt Canvas oder Touch-Controls, falls nötig.
 * @param {HTMLElement} overlay - Das Overlay-Element.
 * @param {HTMLElement} canvasContainer - Der Canvas-Container.
 * @param {HTMLElement} touchControls - Der Container der Touch-Controls.
 * @param {boolean} isMobileWidth - true, wenn die Breite mobiltypisch ist.
 * @param {boolean} isPortrait - true, wenn die Orientierung Hochformat ist.
 */
function hideRotateOverlay(overlay, canvasContainer, touchControls, isMobileWidth, isPortrait) {
  overlay.classList.add('hidden');
  if (!isMobileWidth) touchControls.classList.add('hidden');
  if (gameStarted) {
    canvasContainer.classList.remove('hidden');
    if (isMobileWidth && !isPortrait) touchControls.classList.remove('hidden');
  }
}

/**
 * Steuert die Sichtbarkeit der White-Icons basierend auf Gerät & Zustand.
 * @param {NodeList} whiteIcons - Sammlung der White-Icon Elemente.
 * @param {boolean} isTouch - true, wenn Gerät Touch unterstützt.
 * @param {boolean} isPortrait - true, wenn Bildschirm im Hochformat ist.
 */
function updateWhiteIconsVisibility(whiteIcons, isTouch, isPortrait) {
  const isMobileWidth = isTouch && window.innerWidth <= 1000;
  whiteIcons.forEach(el => {
    el.classList.toggle('hidden', isMobileWidth && (isPortrait || gameStarted));
  });
}

/**
 * Prüft Geräteeigenschaften & Ausrichtung und steuert Anzeige-Logik.
 * @param {object} refs - Sammlung aller benötigten DOM-Referenzen.
 */
function checkOrientation(refs) {
  const { overlay, canvasContainer, whiteIcons, touchControls } = refs;
  if (!overlay) return;
  const isTouch = isTouchDevice();
  const isMobileWidth = isTouch && window.innerWidth <= 1200;
  const isPortrait = window.innerHeight > window.innerWidth;
  if (isMobileWidth && isPortrait) {
    showRotateOverlay(overlay, canvasContainer, whiteIcons, touchControls);
  } else {
    hideRotateOverlay(overlay, canvasContainer, touchControls, isMobileWidth, isPortrait);
  }
  updateWhiteIconsVisibility(whiteIcons, isTouch, isPortrait);
}

/**
 * Verbindet Touch-Buttons mit world.keyboard Steuerung.
 * @param {object} refs - Sammlung der Touch-Button Referenzen.
 */
function setupTouchControls(refs) {
  const map = [
    [refs.btnLeft, 'LEFT'],
    [refs.btnRight, 'RIGHT'],
    [refs.btnSpace, 'SPACE'],
    [refs.btnD, 'D']
  ];
  map.forEach(([btn, key]) => {
    btn.addEventListener('touchstart', () => world.keyboard[key] = true);
    btn.addEventListener('touchend', () => world.keyboard[key] = false);
  });
}

/**
 * Handler für Start-Button: Startet das Spiel & aktualisiert UI.
 * @param {object} refs - Sammlung aller benötigten DOM-Referenzen.
 * @param {Function} cbCheckOrientation - Callback für Orientation-Check.
 * @returns {Function} Event-Handler Funktion.
 */
function startGameHandler(refs, cbCheckOrientation) {
  return () => {
    gameStarted = true;
    refs.mainHeadline.classList.add('hidden');
    refs.touchControls.style.removeProperty('display');
    cbCheckOrientation();
  };
}

/**
 * Handler für Controls-Button: Versteckt Headline wenn Spiel gestartet.
 * @param {object} refs - Sammlung aller benötigten DOM-Referenzen.
 * @returns {Function} Event-Handler Funktion.
 */
function controlsHandler(refs) {
  return () => {
    if (gameStarted) refs.mainHeadline.classList.add('hidden');
  };
}

/**
 * Handler für Options-Back-Button: Versteckt Headline verzögert wenn Spiel läuft.
 * @param {object} refs - Sammlung aller benötigten DOM-Referenzen.
 * @returns {Function} Event-Handler Funktion.
 */
function optionsBackHandler(refs) {
  return () => {
    if (gameStarted) setTimeout(() => refs.mainHeadline.classList.add('hidden'), 0);
  };
}

/**
 * Handler für Restart-Button: Setzt Spielzustand zurück & aktualisiert UI.
 * @param {object} refs - Sammlung aller benötigten DOM-Referenzen.
 * @param {Function} cbCheckOrientation - Callback für Orientation-Check.
 * @returns {Function} Event-Handler Funktion.
 */
function restartHandler(refs, cbCheckOrientation) {
  return () => {
    gameStarted = false;
    refs.touchControls.style.setProperty('display', 'none', 'important');
    cbCheckOrientation();
  };
}

/**
 * Setzt die Anzeige von Fullscreen-Button und Touch-Controls
 * basierend auf Gerätetyp und Fensterbreite um.
 *
 * @param {HTMLElement} fullscreenToggle - Das Fullscreen-Toggle-Element.
 * @param {HTMLElement} touchControls - Der Container der Touch-Controls.
 */
function updateControlsVisibility(fullscreenToggle, touchControls) {
  const touch = isTouchDevice();
  const mobileWidth = touch && window.innerWidth <= 1080;
  if (!touch || !mobileWidth) {
    fullscreenToggle.classList.remove('hidden');
    touchControls.classList.add('hidden');
  } else {
    fullscreenToggle.classList.add('hidden');
    touchControls.classList.remove('hidden');
  }
}

/**
 * Handler für den Endscreen-Restart-Button. Setzt das Spiel zurück und
 * startet direkt neu, ohne ins Menü zurückzukehren.
 *
 * @param {object} refs - Sammlung aller wichtigen DOM-Referenzen.
 * @param {HTMLElement} refs.menu - Das Menü-Element.
 * @param {HTMLElement} refs.fullscreenToggle - Der Fullscreen-Toggle-Button.
 * @param {HTMLElement} refs.touchControls - Der Container der Touch-Controls.
 * @returns {Function}
 */
function restartEndHandler(refs) {
  return () => {
    world.resetGame();
    world.deadTimestamp = null;
    audio.stopAllSounds();
    audio.clearRestartFlag();
    document.getElementById('end_screen_buttons').classList.add('hidden');
    refs.menu.style.display = 'none';
    document.getElementById('canvas').classList.remove('hidden');
    document.getElementById('hud-bar').classList.remove('hidden');
    updateControlsVisibility(refs.fullscreenToggle, refs.touchControls);
    gameStarted = true;
  };
}

/**
 * Registriert alle zentralen Event-Listener für die Anwendung:
 * - Fenstergröße & Orientierung → Orientation-Check
 * - Start-Button, Controls-Button, Options-Back-Button
 * - Restart-Button (Hauptspiel) und Endscreen-Restart-Button
 *
 * @param {object} refs - Sammlung aller wichtigen DOM-Referenzen.
 * @param {HTMLElement} refs.startBtn - Der Start-Button im Menü.
 * @param {HTMLElement} refs.controlsBtn - Der Controls-Button im HUD.
 * @param {HTMLElement} refs.optionsBackBtn - Der Zurück-Button in den Optionen.
 * @param {Function} cbCheckOrientation - Callback, um bei Resize/Rotate die Anzeige anzupassen.
 */
function setupEventListeners(refs, cbCheckOrientation) {
  window.addEventListener('resize', cbCheckOrientation);
  window.addEventListener('orientationchange', cbCheckOrientation);
  refs.startBtn.addEventListener('click', startGameHandler(refs, cbCheckOrientation));
  refs.controlsBtn.addEventListener('click', controlsHandler(refs));
  refs.optionsBackBtn.addEventListener('click', optionsBackHandler(refs));
  document.getElementById('restart-btn')
    .addEventListener('click', restartHandler(refs, cbCheckOrientation));
  document.getElementById('end-restart-btn')
    .addEventListener('click', restartEndHandler(refs));
}

document.addEventListener('DOMContentLoaded', () => {
  const refs = {
    overlay: document.getElementById('rotate-overlay'),
    canvasContainer: document.getElementById('canvas-container'),
    whiteIcons: document.querySelectorAll('.white-icon'),
    touchControls: document.getElementById('touch-controls'),
    btnLeft: document.getElementById('touch-left'),
    btnRight: document.getElementById('touch-right'),
    btnSpace: document.getElementById('touch-space'),
    btnD: document.getElementById('touch-d'),
    startBtn: document.querySelector('#menu button[onclick="startGame()"]'),
    controlsBtn: document.getElementById('controls-btn'),
    optionsBackBtn: document.getElementById('options-back'),
    mainHeadline: document.getElementById('main_headline'),
    menu: document.getElementById('menu'),
    fullscreenToggle: document.getElementById('fullscreen-toggle'),
  };
  setupTouchControls(refs);
  setupEventListeners(refs, () => checkOrientation(refs));
  checkOrientation(refs);
});
