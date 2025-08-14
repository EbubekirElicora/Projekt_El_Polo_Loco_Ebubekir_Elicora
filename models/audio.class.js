/**
 * All sound files used in the game.
 */
const soundFiles = {
  littleChickenRun: 'audio/little_chicken_run.mp3',
  chickenRun: 'audio/chicken_normal_run.mp3',
  chickenDead: 'audio/chicken_dead.mp3',
  characterRun: 'audio/charakter_run.mp3',
  characterJump: 'audio/charakter_jump.mp3',
  characterFall: 'audio/charakter_falling.mp3',
  characterHurt: 'audio/charakter_hurt.mp3',
  characterIdle: 'audio/charakter_idle.mp3',
  coinCollected: 'audio/coin_collected.mp3',
  bottleSplash: 'audio/bottle_splash.mp3',
  bottleCollect: 'audio/bottle_collect.mp3',
  bottleThrow: 'audio/bottle_throw.mp3',
  gameOver: 'audio/gameOver.mp3',
  gameWon: 'audio/gameWon.mp3',
};

/**
 * Class for managing audio sounds in the game.
 * Supports original audio, cloned audio (for simultaneous playback),
 * volume control, muting, and restart handling.
 */
class AudioSounds {
  constructor() {
    this.originalAudioElements = {};
    for (const [key, path] of Object.entries(soundFiles)) {
      this.originalAudioElements[key] = new Audio(path);
    }
    this.currentlyPlayingClonedAudios = [];
    this.setInitialVolumes();
    this.isMuted = false;
    this.isGameRestarting = false;
  }

  /**
   * Sets the initial volumes for original audios,
   * adjusted to the type of sound.
   * @private
   * @returns {void}
   */
  setInitialVolumes() {
    for (let key in this.originalAudioElements) {
      let audio = this.originalAudioElements[key];
      if (key === 'chickenRun' || key === 'littleChickenRun' || key === 'coinCollected') {
        audio.volume = 0.02;
      } else if (key === 'bottleCollect' || key === 'characterHurt' || key === 'characterFall' || key === 'bottleThrow' || key === 'chickenDead' || key === 'characterJump') {
        audio.volume = 0.1;
      } else if (key === 'characterRun' || key === 'characterIdle') {
        audio.volume = 0.2;
      } else {
        audio.volume = 0.5;
      }
    }
  }

  /**
   * Plays an original audio if it is not already playing.
   * Skips playback if muted or if the game is restarting.
   * @param {string} soundName - The name of the sound (e.g., 'characterRun').
   * @param {boolean} [shouldLoop=false] - Whether the sound should loop.
   * @returns {void}
   */
  playOriginal(soundName, shouldLoop = false) {
    if (this.isMuted || this.isGameRestarting) return;
    const audio = this.originalAudioElements[soundName];
    if (!audio) return;
    if (audio.paused) {
      audio.loop = shouldLoop;
      audio.currentTime = 0;
      this.playAudioSafe(audio);
    }
  }

  /**
   * Plays a cloned audio so multiple instances can play simultaneously.
   * Adds the cloned audio to the list for later control.
   * @param {string} soundName - The name of the sound.
   * @param {boolean} [shouldLoop=false] - Whether the sound should loop.
   * @returns {HTMLAudioElement|null} The cloned audio element or null if not found.
   */
  playCloned(soundName, shouldLoop = false) {
    if (this.isMuted || this.isGameRestarting) return null;
    const original = this.originalAudioElements[soundName];
    if (!original) return null;
    const clone = original.cloneNode();
    clone.loop = shouldLoop;
    clone.volume = original.volume;
    clone.currentTime = 0;
    this.playAudioSafe(clone);
    this.currentlyPlayingClonedAudios.push(clone);
    return clone;
  }

  /**
   * Stops an original audio and resets its playback position.
   * @param {string} soundName - The name of the sound.
   * @returns {void}
   */
  stopOriginal(soundName) {
    const audio = this.originalAudioElements[soundName];
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }

  /**
   * Stops all sounds (original and cloned).
   * Sets the isGameRestarting flag so no new sounds will start.
   * @returns {void}
   */
  stopAllSounds() {
    this.isGameRestarting = true;
    for (let key in this.originalAudioElements) {
      this.stopOriginal(key);
    }
    this.currentlyPlayingClonedAudios.forEach(clone => {
      clone.pause();
      clone.currentTime = 0;
    });
    this.currentlyPlayingClonedAudios = [];
  }

  /**
   * Removes the restart flag so that sounds can be played again.
   * @returns {void}
   */
  clearRestartFlag() {
    this.isGameRestarting = false;
  }

  /**
   * Toggles mute for all sounds and automatically restarts
   * selected loop sounds when unmuted.
   *
   * - When muted, all original and cloned audios remain silent.
   * - When unmuted, loops for `chickenRun` and `littleChickenRun`
   *   are restarted so they are audible again.
   *
   * @returns {void}
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    Object.values(this.originalAudioElements).forEach(audio => {
      audio.muted = this.isMuted;
    });
    this.currentlyPlayingClonedAudios.forEach(clone => {
      clone.muted = this.isMuted;
    });
    if (!this.isMuted) {
      this.playOriginal('chickenRun', true);
      this.playOriginal('littleChickenRun', true);
    }
  }

  /**
   * Tries to play an audio element, catching errors silently
   * (e.g., due to autoplay blockers).
   * @private
   * @param {HTMLAudioElement} audio - The audio element to play.
   * @returns {void}
   */
  playAudioSafe(audio) {
    const p = audio.play();
    if (p && p.catch) {
      p.catch(() => {
      });
    }
  }
}
