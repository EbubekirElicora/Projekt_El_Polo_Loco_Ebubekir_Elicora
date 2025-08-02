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


    fullscreenBtn.classList.add('white-icon');
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    controlsBtn.addEventListener('click', () => {
        world.pauseGame();
        openOptionsFromGame();
    });
    if (optionsBackBtn) {
        optionsBackBtn.addEventListener('click', () => {
            closeOptions();
        });
    }
    document.addEventListener('fullscreenchange', () => handleFullscreenChange());
    if (restartBtn) {
        restartBtn.addEventListener('click', () => restartGame());
    }
    
    audioButton.addEventListener('click', () => {
        audio.toggleMute();
        isCurrentlyMuted = !isCurrentlyMuted;
        audioButton.src = isCurrentlyMuted
            ? 'icons/speaker_mute.png'
            : 'icons/speaker.png';
    });

    /**
     * Schaltet den Vollbildmodus um.
     * @returns {void}
     */
    function toggleFullscreen() {
        if (!isFullscreen()) {
            enterFullscreen(canvasContainer);
            fullscreenBtn.src = 'icons/smallScreen_icon.png';
        } else {
            exitFullscreen();
            fullscreenBtn.src = 'icons/fullScreen_icon.png';
        }
    }

    /**
     * Öffnet die Optionen während des Spiels und pausiert das Spiel.
     * @returns {void}
     */
    function openOptionsFromGame() {
        wasFullscreenBeforeOptions = isFullscreen();
        if (wasFullscreenBeforeOptions) exitFullscreen();
        optionsFromGame = true;
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
     * Schließt die Optionen und setzt die Sichtbarkeit der UI-Elemente entsprechend zurück.
     * @returns {void}
     */
    function closeOptions() {
        optionsSection.classList.add('hidden');
        optionsBackBtn.classList.add('hidden');
        if (optionsFromGame) {
            world.resumeGame();
            menu.classList.add('hidden');
            mainHeadline.classList.remove('hidden');
            canvas.classList.remove('hidden');
            canvasContainer.classList.remove('hidden');
            hudBar.classList.remove('hidden');
            backMenuBtn.classList.remove('hidden');
            optionsFromGame = false;
            if (wasFullscreenBeforeOptions && !isFullscreen()) {
                enterFullscreen(canvasContainer);
            }
        } else {
            menu.classList.remove('hidden');
            mainHeadline.classList.remove('hidden');
            canvas.classList.add('hidden');
            canvasContainer.classList.add('hidden');
            hudBar.classList.add('hidden');
            endButtons.classList.add('hidden');
            backMenuBtn.classList.add('hidden');
        }
    }

    /**
     * Behandelt Änderungen im Vollbildmodus.
     * @returns {void}
     */
    function handleFullscreenChange() {
        if (isFullscreen()) {
            setFullscreenStyles();
        } else {
            resetStylesAfterFullscreen();
        }
    }

    /**
     * Setzt Styles für den Vollbildmodus.
     * @returns {void}
     */
    function setFullscreenStyles() {
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        fullscreenBtn.src = 'icons/smallScreen_icon.png';
        fullscreenBtn.style.width = '64px';
        fullscreenBtn.style.height = '64px';
        endButtons.style.top = '92%';
        hudBar.classList.add('fullscreen-mode');
    }

    /**
     * Setzt Styles zurück, wenn Vollbild verlassen wird.
     * @returns {void}
     */
    function resetStylesAfterFullscreen() {
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
     * Startet das Spiel neu und verlässt gegebenenfalls den Vollbildmodus.
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
     * Führt die Neustartlogik aus.
     * @returns {void}
     */
    function handleRestart() {
        world.audio.stopAllSounds();
        world.character.reset();
        setTimeout(() => {
            world.audio.clearRestartFlag();
        }, 100);
        backToMenu();
    }
});

/**
 * Prüft, ob aktuell Vollbildmodus aktiv ist.
 * @returns {boolean}
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
 * Aktiviert den Vollbildmodus für ein gegebenes Element.
 * @param {HTMLElement} element
 * @returns {void}
 */
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

/**
 * Verlassen des Vollbildmodus.
 * @returns {void}
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}
