/**
 * Startet das Spiel und blendet das Menü aus.
 * @returns {void}
 */
function startGame() {
  audio.stopAllSounds();
  audio.clearRestartFlag();
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('canvas').classList.remove('hidden');
  init();
  document.getElementById('fullscreen-toggle').classList.remove('hidden');
  document.getElementById('canvas-container').classList.remove('hidden');
  document.getElementById('hud-bar').classList.remove('hidden');
}

/**
 * Führt den Startbildschirm aus und zeigt danach das Menü.
 * @returns {void}
 */
function runStartup() {
  showStartScreen();
  setTimeout(() => {
    showMenu();
  }, 4000);
}

/**
 * Zeigt den Startbildschirm an.
 * @returns {void}
 */
function showStartScreen() {
  document.getElementById('start_screen').classList.remove('hidden');
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('canvas').classList.add('hidden');
  document.getElementById('main_headline').classList.add('hidden');
}

/**
 * Zeigt das Hauptmenü an.
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
 * Zeigt die Optionen-Seite an.
 * @returns {void}
 */
function showOptions() {
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('main_headline').classList.add('hidden');
  document.getElementById('options').classList.remove('hidden');
}

/**
 * Zeigt das Impressum (rechtliche Hinweise) an.
 * @returns {void}
 */
function showLegal() {
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('main_headline').classList.add('hidden');
  document.getElementById('legal_notice').classList.remove('hidden');
  document.getElementById('options').classList.add('hidden');
}

/**
 * Kehre zum Menü zurück, verlässt ggf. den Vollbildmodus.
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
 * Zeigt das Menü an und setzt den Spielstatus zurück.
 * @returns {void}
 */
function showMenuAndReset() {
  document.getElementById('options').classList.add('hidden');
  document.getElementById('legal_notice').classList.add('hidden');
  document.getElementById('privacy_policy').classList.add('hidden');
  document.getElementById('menu').classList.remove('hidden');
  document.getElementById('main_headline').classList.remove('hidden');
  document.getElementById('end_screen_buttons').classList.add('hidden');
  document.getElementById('canvas').classList.add('hidden');
  document.getElementById('fullscreen-toggle').classList.add('hidden');
  document.getElementById('hud-bar').classList.add('hidden');
  if (typeof world !== 'undefined' && world !== null) {
    world.resetGame();
    world.deadTimestamp = null;
  }
  audio.stopAllSounds();
  audio.clearRestartFlag();
}

/**
 * Zeigt die Datenschutzerklärung an.
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
 * Zeigt die Buttons auf dem Endbildschirm an.
 * @returns {void}
 */
function showEndScreenButtons() {
  document.getElementById('hud-bar').classList.add('hidden');
  document.getElementById('end_screen_buttons').classList.remove('hidden');
}

/**
 * Versucht, das Browserfenster zu schließen.
 * @returns {void}
 */
function quitGame() {
  window.close();
}
