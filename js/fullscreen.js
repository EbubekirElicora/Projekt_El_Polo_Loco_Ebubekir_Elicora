window.addEventListener('DOMContentLoaded', () => {
  const fullscreenBtn = document.getElementById('fullscreen-toggle');
  const restartBtn = document.getElementById('restart-btn');
  const endButtons = document.getElementById('end_screen_buttons');
  const canvasContainer = document.getElementById('canvas-container');
  const canvas = document.getElementById('canvas');
  const hudBar = document.getElementById('hud-bar');
  const controlsBtn = document.getElementById('controls-btn');
  const optionsSection = document.getElementById('options');
  const menu = document.getElementById('menu');
  const mainHeadline = document.getElementById('main_headline');
  const backMenuBtn = document.getElementById('back_menu');
  const optionsBackBtn = document.getElementById('options-back');
  const audioButton = document.getElementById('audio-btn');

  let optionsFromGame = false;
  let wasFullscreenBeforeOptions = false;
  let isCurrentlyMuted = false;

  initUI();
  setupEventListeners();

  /** Fügt Click-Listener hinzu und initialisiert Icon-Hefter */
  function initUI() {
    fullscreenBtn.classList.add('white-icon');
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    audioButton.addEventListener('click', toggleMute);
  }

  /** Registriert alle weiteren Events */
  function setupEventListeners() {
    controlsBtn.addEventListener('click', () => { world.pauseGame(); openOptionsFromGame(); });
    optionsBackBtn?.addEventListener('click', closeOptions);
    restartBtn?.addEventListener('click', restartGame);
    document.getElementById('end-restart-btn')
      ?.addEventListener('click', restartGameEnd);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
  }

  /**
   * Schaltet Vollbild um.
   * @returns {void}
   */
  function toggleFullscreen() {
    if (!isFullscreen()) enableFullscreen();
    else disableFullscreen();
  }

  /** Setzt Icon und aktiviert Fullscreen für das Canvas-Container-Element. */
  function enableFullscreen() {
    enterFullscreen(canvasContainer);
    fullscreenBtn.src = 'icons/smallScreen_icon.png';
  }

  /** Deaktiviert Fullscreen und ändert Icon zurück. */
  function disableFullscreen() {
    exitFullscreen();
    fullscreenBtn.src = 'icons/fullScreen_icon.png';
  }

  /**
   * Öffnet das Options-Menü aus dem Spiel heraus.
   * @returns {void}
   */
  function openOptionsFromGame() {
    wasFullscreenBeforeOptions = isFullscreen();
    if (wasFullscreenBeforeOptions) disableFullscreen();
    optionsFromGame = true;
    showOptionsUI();
  }

  /** Zeigt die Options-UI und versteckt alle Spiel-Elemente. */
  function showOptionsUI() {
    optionsSection.classList.remove('hidden');
    menu.classList.add('hidden');
    mainHeadline.classList.add('hidden');
    canvas.classList.add('hidden');
    canvasContainer.classList.add('hidden');
    hudBar.classList.add('hidden');
    endButtons.classList.add('hidden');
    backMenuBtn.classList.add('hidden');
    optionsBackBtn.classList.remove('hidden');
  }

  /**
   * Schließt das Options-Menü und stellt vorherigen Zustand wieder her.
   * @returns {void}
   */
  function closeOptions() {
    optionsSection.classList.add('hidden');
    optionsBackBtn.classList.add('hidden');
    if (optionsFromGame) restoreGameUI();
    else restoreMenuUI();
  }

  /** Setzt Spiel-UI nach Options-Schließen wieder und eventuell Fullscreen zurück. */
  function restoreGameUI() {
    world.resumeGame();
    menu.classList.add('hidden');
    mainHeadline.classList.remove('hidden');
    canvas.classList.remove('hidden');
    canvasContainer.classList.remove('hidden');
    hudBar.classList.remove('hidden');
    backMenuBtn.classList.remove('hidden');
    optionsFromGame = false;
    if (wasFullscreenBeforeOptions && !isFullscreen()) enableFullscreen();
  }

  /** Zeigt das Hauptmenü, versteckt alle Spiel-Elemente. */
  function restoreMenuUI() {
    menu.classList.remove('hidden');
    mainHeadline.classList.remove('hidden');
    canvas.classList.add('hidden');
    canvasContainer.classList.add('hidden');
    hudBar.classList.add('hidden');
    endButtons.classList.add('hidden');
    backMenuBtn.classList.add('hidden');
  }

  /**
   * Reagiert auf fullscreenchange und wendet passende Styles an.
   * @returns {void}
   */
  function handleFullscreenChange() {
    if (isFullscreen()) applyFullscreenStyles();
    else applyWindowedStyles();
  }

  /** Passt CSS für Vollbild an. */
  function applyFullscreenStyles() {
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    fullscreenBtn.src = 'icons/smallScreen_icon.png';
    fullscreenBtn.style.width = '64px';
    fullscreenBtn.style.height = '64px';
    endButtons.style.top = '90%';
    hudBar.classList.add('fullscreen-mode');
  }

  /** Setzt CSS nach Verlassen des Vollbilds zurück. */
  function applyWindowedStyles() {
    canvas.width = 720;
    canvas.height = 480;
    canvas.style.width = '';
    canvas.style.height = '';
    fullscreenBtn.src = 'icons/fullScreen_icon.png';
    fullscreenBtn.style.width = '';
    fullscreenBtn.style.height = '';
    endButtons.style.top = '100.1%';
    hudBar.classList.remove('fullscreen-mode');
  }

  /**
   * Führt den spiel-Neustart durch, verlässt vorher Fullscreen wenn nötig.
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
 * Endscreen-Restart: Reset & direkt weiterspielen (kein Menü).
 * @returns {void}
 */
  function restartGameEnd() {
    world.resetGame();
    world.deadTimestamp = null;
    audio.stopAllSounds();
    audio.clearRestartFlag();
    endButtons.classList.add('hidden');
    canvas.classList.remove('hidden');
    hudBar.classList.remove('hidden');
    menu.classList.remove('hidden');
    world.resumeGame();
  }


  /** Stoppt Sounds, resetet Character und ruft Menü-Return auf. */
  function handleRestart() {
    world.audio.stopAllSounds();
    world.character.reset();
    setTimeout(() => world.audio.clearRestartFlag(), 100);
    backToMenu();
  }

  /**
   * Schaltet Ton ein/aus und ändert das Icon.
   * @returns {void}
   */
  function toggleMute() {
    audio.toggleMute();
    isCurrentlyMuted = !isCurrentlyMuted;
    audioButton.src = isCurrentlyMuted
      ? 'icons/speaker_mute.png'
      : 'icons/speaker.png';
  }
});

/** @returns {boolean} true wenn Fullscreen aktiv ist */
function isFullscreen() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}

/**
 * @param {HTMLElement} element
 * @returns {void}
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) element.requestFullscreen();
  else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
  else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
  else if (element.msRequestFullscreen) element.msRequestFullscreen();
}

/** @returns {void} */
function exitFullscreen() {
  if (document.exitFullscreen) document.exitFullscreen();
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
  else if (document.msExitFullscreen) document.msExitFullscreen();
}
