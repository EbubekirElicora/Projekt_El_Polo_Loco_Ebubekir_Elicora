/**
 * Starts the game and hides the menu screen.
 * Initializes the world and game components.
 * 
 * @returns {void}
 */
function startGame() {
  audio.stopAllSounds();
  audio.clearRestartFlag();
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('canvas').classList.remove('hidden');
  document.getElementById('fullscreen-toggle').style.removeProperty('display');
  document.getElementById('canvas-container').classList.remove('hidden');
  document.getElementById('hud-bar').classList.remove('hidden');
  document.getElementById('main_headline').classList.remove('hidden');
  init();
}

/**
 * Runs the startup sequence by showing the start screen
 * and then displaying the menu after a short delay.
 * 
 * @returns {void}
 */
function runStartup() {
  showStartScreen();
  setTimeout(() => {
    showMenu();
  }, 2000);
}

/**
 * Displays the start screen and hides other UI elements.
 * 
 * @returns {void}
 */
function showStartScreen() {
  document.getElementById('start_screen').classList.remove('hidden');
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('canvas').classList.add('hidden');
  document.getElementById('main_headline').classList.add('hidden');
}

/**
 * Displays the main menu and hides gameplay elements.
 * 
 * @returns {void}
 */
function showMenu() {
  document.getElementById('start_screen').classList.add('hidden');
  document.getElementById('menu').classList.remove('hidden');
  document.getElementById('canvas').classList.add('hidden');
  document.getElementById('main_headline').classList.remove('hidden');
  document.getElementById('canvas-container').classList.add('hidden');
}

/**
 * Displays the options/settings screen.
 * 
 * @returns {void}
 */
function showOptions() {
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('main_headline').classList.add('hidden');
  document.getElementById('options').classList.remove('hidden');
}

/**
 * Displays the legal notice screen.
 * 
 * @returns {void}
 */
function showLegal() {
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('main_headline').classList.add('hidden');
  document.getElementById('legal_notice').classList.remove('hidden');
  document.getElementById('options').classList.add('hidden');
}

/**
 * Returns to the menu screen.
 * If in fullscreen mode, it exits fullscreen first before showing the menu.
 * 
 * @returns {void}
 */
function backToMenu() {
  if (isFullscreen()) {
    exitFullscreen();
    function onFullscreenChange() {
      if (!isFullscreen()) {
        document.removeEventListener('fullscreenchange', onFullscreenChange);
        showMenuAndReset();
      }
    }
    document.addEventListener('fullscreenchange', onFullscreenChange);
  } else {
    showMenuAndReset();
  }
}

/**
 * Shows the menu and resets the game state to its default.
 * 
 * @returns {void}
 */
function showMenuAndReset() {
  document.getElementById('options').classList.add('hidden');
  document.getElementById('legal_notice').classList.add('hidden');
  document.getElementById('privacy_policy').classList.add('hidden');
  document.getElementById('menu').classList.remove('hidden');
  document.getElementById('menu').style.removeProperty('display');
  document.getElementById('main_headline').classList.remove('hidden');
  document.getElementById('end_screen_buttons').classList.add('hidden');
  document.getElementById('canvas').classList.add('hidden');
  document.getElementById('hud-bar').classList.add('hidden');
  document.getElementById('touch-controls').style.setProperty('display','none','important');
  document.getElementById('fullscreen-toggle').style.setProperty('display','none','important');
  if (typeof world !== 'undefined' && world !== null) {
    world.resetGame();
    world.deadTimestamp = null;
  }
  audio.stopAllSounds();
  audio.clearRestartFlag();
}

/**
 * Displays the privacy policy screen.
 * 
 * @returns {void}
 */
function showPrivacy() {
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('main_headline').classList.add('hidden');
  document.getElementById('privacy_policy').classList.remove('hidden');
  document.getElementById('options').classList.add('hidden');
  document.getElementById('legal_notice').classList.add('hidden');
}

/**
 * Displays the buttons on the end screen and hides HUD elements.
 * 
 * @returns {void}
 */
function showEndScreenButtons() {
  document.getElementById('hud-bar').classList.add('hidden');
  document.getElementById('end_screen_buttons').classList.remove('hidden');
  document.getElementById('touch-controls').classList.add('hidden');
  document.getElementById('fullscreen-toggle').classList.add('hidden');
}

/**
 * Attempts to close the browser window.
 * This may be blocked by most browsers for security reasons.
 * 
 * @returns {void}
 */
function quitGame() {
  window.close();
}
