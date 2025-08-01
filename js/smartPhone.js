document.addEventListener('DOMContentLoaded', () => {
  const overlay         = document.getElementById('rotate-overlay');
  const rotateMessage   = overlay?.querySelector('.rotate-message');
  const mainHeadline    = document.getElementById('main_headline');
  const startBtn        = document.querySelector('#menu button[onclick="startGame()"]');
  const canvasContainer = document.getElementById('canvas-container');
  const controlsBtn     = document.getElementById('controls-btn');
  const optionsBackBtn  = document.getElementById('options-back');
  const whiteIcons      = document.querySelectorAll('.white-icon');
  let   gameStarted     = false;

  function checkOrientation() {
    if (!overlay || !rotateMessage) return;
    const isMobileWidth = window.innerWidth <= 1080;
    const isPortrait    = window.innerHeight > window.innerWidth;
    if (isMobileWidth && isPortrait) {
      overlay.classList.remove('hidden');
      rotateMessage.textContent = 'Bitte drehe dein Handy ins Querformat um spielen zu können!';
      canvasContainer?.classList.add('hidden');
      whiteIcons.forEach(el => el.classList.add('hidden'));
    } else {
      overlay.classList.add('hidden');
      if (gameStarted) {
        canvasContainer?.classList.remove('hidden');
      } else {
        whiteIcons.forEach(el => el.classList.remove('hidden'));
      }
    }
  }

  checkOrientation();
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      gameStarted = true;
      mainHeadline.classList.add('hidden');
      whiteIcons.forEach(el => el.classList.add('hidden'));
      checkOrientation();
    });
  }

  controlsBtn?.addEventListener('click', () => {
    if (gameStarted) {
      mainHeadline.classList.add('hidden');
    }
  });

  optionsBackBtn?.addEventListener('click', () => {
    if (gameStarted) {
      setTimeout(() => {
        mainHeadline.classList.add('hidden');
      }, 0);
    }
  });
});
