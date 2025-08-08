/**
 * Klasse zur Verwaltung von Audio-Sounds im Spiel.
 * Unterstützt Original-Audios, geklonte Audios (für gleichzeitiges Abspielen),
 * Lautstärkeregelung, Muten und Neustart-Handling.
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
   * Setzt die initialen Lautstärken der Original-Audios,
   * abgestimmt auf die Art des Sounds.
   * @private
   */
  setInitialVolumes() {
    for (let key in this.originalAudioElements) {
      let audio = this.originalAudioElements[key];
      if (key === 'chickenRun' || key === 'littleChickenRun' || key === 'coinCollected') {
        audio.volume = 0.02;
      } else if (key === 'bottleCollect' || key === 'characterHurt' || key === 'characterFall' || key === 'bottleThrow') {
        audio.volume = 0.1;
      } else if (key === 'characterRun' || key === 'characterIdle') {
        audio.volume = 0.2;
      } else {
        audio.volume = 0.5;
      }
    }
  }

  /**
   * Spielt ein Original-Audio ab, wenn es noch nicht läuft.
   * Überspringt Abspielen, wenn gemutet oder Spiel neustartet.
   * @param {string} soundName - Name des Sounds, z.B. 'characterRun'
   * @param {boolean} [shouldLoop=false] - Ob der Sound geloopt werden soll.
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
   * Spielt ein geklontes Audio ab, damit mehrere Instanzen gleichzeitig laufen können.
   * Fügt das geklonte Audio zur Liste hinzu für spätere Kontrolle.
   * @param {string} soundName - Name des Sounds
   * @param {boolean} [shouldLoop=false] - Ob geloopt werden soll
   * @returns {HTMLAudioElement|null} Das geklonte Audio-Element oder null
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
    console.log('[Audio] playCloned', soundName, '->', clone);
    return clone;
  }

  /**
   * Stoppt ein Original-Audio und setzt es auf Anfang.
   * @param {string} soundName - Name des Sounds
   */
  stopOriginal(soundName) {
    const audio = this.originalAudioElements[soundName];
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }

  /**
   * Stoppt alle Sounds (originale und geklonte).
   * Setzt isGameRestarting-Flag, damit keine neuen Sounds starten.
   */
  stopAllSounds() {
    console.log('[Audio] stopAllSounds, clonedCount=', this.currentlyPlayingClonedAudios.length);
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
   * Entfernt das Neustart-Flag, damit wieder Sounds gespielt werden können.
   */
  clearRestartFlag() {
    this.isGameRestarting = false;
  }

  /**
  * Schaltet das Muten aller Sounds um und startet beim Ent­muten
  * automatisch ausgewählte Loop-Sounds neu.
  *
  * - Wenn gemutet wird, bleiben alle originalen und geklonten Audios stumm.
  * - Beim Ent­muten werden die Loops für `chickenRun` und `littleChickenRun`
  *   neu gestartet, damit sie wieder hörbar sind.
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
   * Versucht, ein Audio abzuspielen, fängt Fehler (z.B. Autoplay-Blocker) still ab.
   * @private
   * @param {HTMLAudioElement} audio
   */
  playAudioSafe(audio) {
    const p = audio.play();
    if (p && p.catch) {
      p.catch(() => {
      });
    }
  }
}

/**
Alle Soundfiles
 */
const soundFiles = {
  littleChickenRun: 'audio/little_chicken_run.mp3',
  chickenRun: 'audio/chicken_normal_run.mp3',
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