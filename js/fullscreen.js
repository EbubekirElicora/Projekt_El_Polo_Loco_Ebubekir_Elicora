let optionsFromGame = false;
let wasFullscreenBeforeOptions = false;
let isCurrentlyMuted = localStorage.getItem('isMuted') === 'true';
const elements = {};

/**
 * Initialize and cache frequently used DOM element references.
 * Populates the global `elements` object with references to UI elements.
 * @returns {void}
 */
function initElements() {
  elements.fullscreenBtn = document.getElementById('fullscreen-toggle');
  elements.restartBtn = document.getElementById('restart-btn');
  elements.endButtons = document.getElementById('end_screen_buttons');
  elements.canvasContainer = document.getElementById('canvas-container');
  elements.canvas = document.getElementById('canvas');
  elements.hudBar = document.getElementById('hud-bar');
  elements.controlsBtn = document.getElementById('controls-btn');
  elements.optionsSection = document.getElementById('options');
  elements.menu = document.getElementById('menu');
  elements.mainHeadline = document.getElementById('main_headline');
  elements.backMenuBtn = document.getElementById('back_menu');
  elements.optionsBackBtn = document.getElementById('options-back');
  elements.audioButton = document.getElementById('audio-btn');
  elements.touchControls = document.getElementById('touch-controls');
}

/**
 * Determine whether the document is currently displayed in fullscreen.
 * Uses vendor-prefixed properties for broader browser support.
 * @returns {boolean} True if the document is in fullscreen mode, false otherwise.
 */
function isFullscreen() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}

/**
 * Request fullscreen for a specific element with vendor-prefixed fallbacks.
 * @param {HTMLElement} element - The DOM element to request fullscreen for.
 * @returns {void}
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) element.requestFullscreen();
  else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
  else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
  else if (element.msRequestFullscreen) element.msRequestFullscreen();
}

/**
 * Exit fullscreen mode with vendor-prefixed fallbacks.
 * @returns {void}
 */
function exitFullscreen() {
  if (document.exitFullscreen) document.exitFullscreen();
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
  else if (document.msExitFullscreen) document.msExitFullscreen();
}

/**
 * Toggle fullscreen state for the application.
 * If not fullscreen -> enable fullscreen, otherwise disable it.
 * @returns {void}
 */
function toggleFullscreen() {
  if (!isFullscreen()) enableFullscreen();
  else disableFullscreen();
}

/**
 * Enable fullscreen for the canvas container and update the fullscreen icon.
 * Side effects: requests fullscreen and changes `elements.fullscreenBtn.src`.
 * @returns {void}
 */
function enableFullscreen() {
  enterFullscreen(elements.canvasContainer);
  elements.fullscreenBtn.src = 'icons/smallScreen_icon.png';
}

/**
 * Disable fullscreen and update the fullscreen icon.
 * Side effects: exits fullscreen and changes `elements.fullscreenBtn.src`.
 * @returns {void}
 */
function disableFullscreen() {
  exitFullscreen();
  elements.fullscreenBtn.src = 'icons/fullScreen_icon.png';
}

/**
 * Apply CSS/UI changes appropriate for fullscreen gameplay.
 * Sets canvas sizing, adjusts icon size, repositions end buttons, and toggles HUD class.
 * @returns {void}
 */
function applyFullscreenStyles() {
  elements.canvas.style.width = '100vw';
  elements.canvas.style.height = '100vh';
  elements.fullscreenBtn.src = 'icons/smallScreen_icon.png';
  elements.fullscreenBtn.style.width = '64px';
  elements.fullscreenBtn.style.height = '64px';
  elements.endButtons.style.top = '90%';
  elements.hudBar.classList.add('fullscreen-mode');
  setLandscapeFullscreenSizes();
}

/**
 * Adjusts the fullscreen button and touch control button sizes 
 * when in fullscreen mode and the screen is in landscape orientation.
 * 
 * This function increases the fullscreen toggle button size to 80x80 pixels
 * and each touch control button to 120x120 pixels, for better usability on wider screens.
 * 
 * @returns {void}
 */
function setLandscapeFullscreenSizes() {
  const fullscreenButton = elements.fullscreenBtn || document.getElementById('fullscreen-toggle');
  const touchControlsElement = elements.touchControls || document.getElementById('touch-controls');
  if (window.innerWidth <= window.innerHeight) return;
  if (fullscreenButton) {
    fullscreenButton.style.width = '80px';
    fullscreenButton.style.height = '80px';
  }
  if (touchControlsElement) {
    const touchButtons = touchControlsElement.querySelectorAll('.touch-btn');
    touchButtons.forEach(touchButton => {
      touchButton.style.width = '120px';
      touchButton.style.height = '120px';
    });
  }
}

/**
 * Restore CSS/UI for windowed gameplay.
 * Resets canvas dimensions, icon, and HUD class to their windowed state.
 * @returns {void}
 */
function applyWindowedStyles() {
  elements.canvas.width = 720;
  elements.canvas.height = 480;
  elements.canvas.style.width = '';
  elements.canvas.style.height = '';
  elements.fullscreenBtn.src = 'icons/fullScreen_icon.png';
  elements.fullscreenBtn.style.width = '';
  elements.fullscreenBtn.style.height = '';
  elements.endButtons.style.top = '100.1%';
  elements.hudBar.classList.remove('fullscreen-mode');
  resetTouchControlSizes();
}

/**
 * Resets the fullscreen button and touch control button sizes 
 * to their default CSS-defined dimensions.
 * 
 * This is intended to be called when exiting fullscreen mode or 
 * when switching back to portrait orientation.
 * 
 * @returns {void}
 */
function resetTouchControlSizes() {
  const fullscreenButton = elements.fullscreenBtn || document.getElementById('fullscreen-toggle');
  const touchControlsElement = elements.touchControls || document.getElementById('touch-controls');
  if (fullscreenButton) {
    fullscreenButton.style.width = '';
    fullscreenButton.style.height = '';
  }
  if (touchControlsElement) {
    const touchButtons = touchControlsElement.querySelectorAll('.touch-btn');
    touchButtons.forEach(touchButton => {
      touchButton.style.width = '';
      touchButton.style.height = '';
    });
  }
}

/**
 * React to changes in the fullscreen state and apply the correct styles.
 * Intended to be used as a fullscreenchange event handler.
 * @returns {void}
 */
function handleFullscreenChange() {
  if (isFullscreen()) applyFullscreenStyles();
  else applyWindowedStyles();
}

/**
 * Update the audio button icon to reflect the current mute state.
 * Uses the global `isCurrentlyMuted` flag.
 * @returns {void}
 */
function updateAudioIcon() {
  if (!elements.audioButton) return; // guard falls element nicht vorhanden
  elements.audioButton.src = isCurrentlyMuted ? 'icons/speaker_mute.png' : 'icons/speaker.png';
}

/**
 * Toggle the game's audio mute state.
 * Calls into an external `audio` API, updates local state, the UI, and localStorage.
 * Side effects: toggles audio, updates `isCurrentlyMuted`, updates `localStorage`.
 * @returns {void}
 */
function toggleMute() {
  audio.toggleMute();
  isCurrentlyMuted = audio.isMuted;
  updateAudioIcon();
  localStorage.setItem('isMuted', isCurrentlyMuted);
}

/**
 * Show the options/settings section and hide the main game/menu UI.
 * Side effects: modifies many element classes to hide/show UI pieces.
 * @returns {void}
 */
function showOptionsUI() {
  elements.optionsSection.classList.remove('hidden');
  elements.menu.classList.add('hidden');
  elements.mainHeadline.classList.add('hidden');
  elements.canvas.classList.add('hidden');
  elements.canvasContainer.classList.add('hidden');
  elements.hudBar.classList.add('hidden');
  elements.endButtons.classList.add('hidden');
  elements.backMenuBtn.classList.add('hidden');
  elements.optionsBackBtn.classList.remove('hidden');
}

/**
 * Restore the gameplay UI after closing options and resume the world.
 * If the game was fullscreen prior to opening options, re-enable fullscreen.
 * Side effects: resumes the game via `world.resumeGame()` and toggles UI classes.
 * @returns {void}
 */
function restoreGameUI() {
  world.resumeGame();
  elements.menu.classList.add('hidden');
  elements.mainHeadline.classList.remove('hidden');
  elements.canvas.classList.remove('hidden');
  elements.canvasContainer.classList.remove('hidden');
  elements.hudBar.classList.remove('hidden');
  elements.backMenuBtn.classList.remove('hidden');
  elements.optionsSection.classList.add('hidden');
  elements.optionsBackBtn.classList.add('hidden');
  optionsFromGame = false;
  if (wasFullscreenBeforeOptions && !isFullscreen()) enableFullscreen();
}

/**
 * Restore the main menu UI (non-game view).
 * Side effects: toggles visibility classes to show the menu and hide game UI.
 * @returns {void}
 */
function restoreMenuUI() {
  elements.menu.classList.remove('hidden');
  elements.mainHeadline.classList.remove('hidden');
  elements.canvas.classList.add('hidden');
  elements.canvasContainer.classList.add('hidden');
  elements.hudBar.classList.add('hidden');
  elements.endButtons.classList.add('hidden');
  elements.backMenuBtn.classList.add('hidden');
}

/**
 * Open the options UI while the game is running.
 * Stores whether the game was fullscreen beforehand and disables fullscreen if needed.
 * @returns {void}
 */
function openOptionsFromGame() {
  wasFullscreenBeforeOptions = isFullscreen();
  if (wasFullscreenBeforeOptions) disableFullscreen();
  optionsFromGame = true;
  showOptionsUI();
}

/**
 * Close the options UI and restore either the game UI (if opened from game) or the menu UI.
 * @returns {void}
 */
function closeOptions() {
  elements.optionsSection.classList.add('hidden');
  elements.optionsBackBtn.classList.add('hidden');
  if (optionsFromGame) restoreGameUI();
  else restoreMenuUI();
}

/**
 * Internal restart handler used after exiting fullscreen (if necessary).
 * Resets character state and audio, then navigates back to the main menu.
 * Side effects: calls `world.audio.stopAllSounds()`, `world.character.reset()` and `backToMenu()`.
 * @returns {void}
 */
function handleRestart() {
  world.audio.stopAllSounds();
  world.character.reset();
  setTimeout(() => world.audio.clearRestartFlag(), 100);
  backToMenu(elements.backMenuBtn);
}

/**
 * Restart the game. If currently fullscreen, exit fullscreen first and wait for
 * the fullscreenchange event before calling the restart handler.
 * @returns {void}
 */
function restartGame() {
  if (isFullscreen()) {
    exitFullscreen();
    document.addEventListener('fullscreenchange', handleRestart, { once: true });
  } else {
    handleRestart();
  }
}

/**
 * Restart the game from the end screen.
 * Resets world state, stops audio, hides end-screen buttons and resumes the game.
 * Side effects: calls `world.resetGame()`, `audio.stopAllSounds()`, `world.resumeGame()`.
 * @returns {void}
 */
function restartGameEnd() {
  world.resetGame();
  world.deadTimestamp = null;
  audio.stopAllSounds();
  audio.clearRestartFlag();
  elements.endButtons.classList.add('hidden');
  elements.canvas.classList.remove('hidden');
  elements.hudBar.classList.remove('hidden');
  elements.menu.classList.remove('hidden');
  world.resumeGame();
}

/**
 * Wire up initial event listeners and perform UI initialization after DOM is ready.
 * - Initializes cached elements
 * - Sets up click handlers for fullscreen, audio, controls, options, restart
 * - Hooks fullscreenchange to update styles
 * - Updates audio icon based on saved preference
 * @returns {void}
 */
window.addEventListener('DOMContentLoaded', () => {
  initElements();
  if (isCurrentlyMuted) {
    audio.toggleMute();
  }
  elements.fullscreenBtn.classList.add('white-icon');
  elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
  elements.audioButton.addEventListener('click', toggleMute);
  elements.controlsBtn.addEventListener('click', () => {
    world.pauseGame();
    openOptionsFromGame();
  });
  elements.optionsBackBtn?.addEventListener('click', closeOptions);
  elements.restartBtn?.addEventListener('click', restartGame);
  document.getElementById('end-restart-btn')?.addEventListener('click', restartGameEnd);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  updateAudioIcon();
});
