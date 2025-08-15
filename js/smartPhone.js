let gameStarted = false;

/**
 * Checks whether the current device supports touch input (smartphone or tablet).
 * @returns {boolean} True if touch events are supported, otherwise false.
 */
function isTouchDevice() {
  return 'ontouchstart' in window
    || navigator.maxTouchPoints > 0
    || navigator.msMaxTouchPoints > 0;
}

/**
 * Displays the rotate overlay and hides the canvas, white icons, and touch controls.
 * @param {HTMLElement} overlay - The overlay element.
 * @param {HTMLElement} canvasContainer - The container holding the canvas.
 * @param {NodeList} whiteIcons - Collection of white icon elements.
 * @param {HTMLElement} touchControls - The touch controls container.
 */
function showRotateOverlay(overlay, canvasContainer, whiteIcons, touchControls) {
  overlay.classList.remove('hidden');
  overlay.querySelector('.rotate-message').textContent =
    'Please rotate your device to landscape mode to play!';
  touchControls.classList.add('hidden');
}

/**
 * Hides the rotate overlay and shows the canvas or touch controls if needed.
 * @param {HTMLElement} overlay - The overlay element.
 * @param {HTMLElement} canvasContainer - The container holding the canvas.
 * @param {HTMLElement} touchControls - The touch controls container.
 * @param {boolean} isMobileWidth - True if screen width is mobile-sized.
 * @param {boolean} isPortrait - True if screen is in portrait orientation.
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
 * Updates the visibility of white icons based on device type and orientation.
 * @param {NodeList} whiteIcons - Collection of white icon elements.
 * @param {boolean} isTouch - True if the device supports touch.
 * @param {boolean} isPortrait - True if the screen is in portrait mode.
 */
function updateWhiteIconsVisibility(whiteIcons, isTouch, isPortrait) {
  const isMobileWidth = isTouch && window.innerWidth <= 1000;
  whiteIcons.forEach(el => {
    el.classList.toggle('hidden', isMobileWidth && (isPortrait || gameStarted));
  });
}

/**
 * Checks device orientation and adjusts UI elements accordingly.
 * @param {object} refs - Collection of all necessary DOM references.
 */
function checkOrientation(refs) {
  const { overlay, canvasContainer, whiteIcons, touchControls } = refs;
  if (!overlay) return;
  const isTouch = isTouchDevice();
  const isMobileWidth = isTouch && window.innerWidth <= 1400;
  const isPortrait = window.innerHeight > window.innerWidth;
  if (isMobileWidth && isPortrait) {
    showRotateOverlay(overlay, canvasContainer, whiteIcons, touchControls);
  } else {
    hideRotateOverlay(overlay, canvasContainer, touchControls, isMobileWidth, isPortrait);
  }
  updateWhiteIconsVisibility(whiteIcons, isTouch, isPortrait);
}

/**
 * Maps touch buttons to world.keyboard controls.
 * @param {object} refs - Collection of touch button references.
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
    btn.addEventListener('mousedown', () => world.keyboard[key] = true);
    btn.addEventListener('mouseup', () => world.keyboard[key] = false);
    btn.addEventListener('mouseleave', () => world.keyboard[key] = false);
  });
}

/**
 * Creates a start button handler that begins the game and updates the UI.
 * @param {object} refs - DOM references.
 * @param {Function} cbCheckOrientation - Callback to check orientation.
 * @returns {Function} Event handler function.
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
 * Creates a handler for the controls button to hide the main headline if game has started.
 * @param {object} refs - DOM references.
 * @returns {Function} Event handler function.
 */
function controlsHandler(refs) {
  return () => {
    if (gameStarted) refs.mainHeadline.classList.add('hidden');
  };
}

/**
 * Creates a handler for the options back button to hide headline with a slight delay.
 * @param {object} refs - DOM references.
 * @returns {Function} Event handler function.
 */
function optionsBackHandler(refs) {
  return () => {
    if (gameStarted) setTimeout(() => refs.mainHeadline.classList.add('hidden'), 0);
  };
}

/**
 * Creates a restart button handler for the main game to reset state and UI.
 * @param {object} refs - DOM references.
 * @param {Function} cbCheckOrientation - Callback to check orientation.
 * @returns {Function} Event handler function.
 */
function restartHandler(refs, cbCheckOrientation) {
  return () => {
    gameStarted = true;
    refs.touchControls.style.setProperty('display', 'none', 'important');
    refs.canvasContainer.classList.remove('hidden');
    refs.hudBar.classList.remove('hidden');
    cbCheckOrientation();
  };
}

/**
 * Updates visibility of fullscreen button and touch controls based on device and width.
 * @param {HTMLElement} fullscreenToggle - Fullscreen toggle button.
 * @param {HTMLElement} touchControls - Touch controls container.
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
 * Creates a handler for restarting the game from the end screen.
 * Resets the game and starts directly without returning to the menu.
 * @param {object} refs - DOM references.
 * @returns {Function} Event handler function.
 */
function restartEndHandler(refs) {
  return () => {
    world.resetGame();
    world.deadTimestamp = null;
    audio.stopAllSounds();
    audio.clearRestartFlag();
    document.getElementById('end_screen_buttons').classList.add('hidden');
    refs.menu.style.display = 'none';
    refs.canvasContainer.querySelector('canvas').classList.remove('hidden');
    refs.hudBar.classList.remove('hidden');
    refs.touchControls.classList.remove('hidden');
    gameStarted = true;
    checkOrientation(refs);
  };
}

/**
 * Disables dragging and context menu on all touch buttons.
 * @param {HTMLElement} touchControls - The container with all touch buttons.
 */
function disableTouchButtonDefaults(touchControls) {
  touchControls?.querySelectorAll('.touch-btn').forEach(btn => {
    btn.setAttribute('draggable', 'false');
    btn.addEventListener('dragstart', e => e.preventDefault());
    btn.addEventListener('contextmenu', e => e.preventDefault());
  });
}

/**
 * Registers all global event listeners:
 * - window resize & orientation change → orientation check
 * - start button, controls button, options back button
 * - restart buttons for main game and end screen
 * @param {object} refs - DOM references.
 * @param {Function} cbCheckOrientation - Callback for orientation adjustments.
 */
function setupEventListeners(refs, cbCheckOrientation) {
  window.addEventListener('resize', cbCheckOrientation);
  window.addEventListener('orientationchange', cbCheckOrientation);
  setTimeout(cbCheckOrientation, 0);
  window.addEventListener('focus', cbCheckOrientation);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) cbCheckOrientation();});
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
    hudBar: document.getElementById('hud-bar')
  };
  setupTouchControls(refs)
  disableTouchButtonDefaults(refs.touchControls);
  setupEventListeners(refs, () => checkOrientation(refs));
  checkOrientation(refs);
});
