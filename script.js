/* ==========================================================================
   WEDDING INVITATION - INTERACTIVE JAVASCRIPT
   ========================================================================== */

// CONFIGURATION VARIABLES (Easy for user to customize)
const CONFIG = {
  // Target Event Date for Countdown: Year, Month (0-indexed: 9 = Oct), Day, Hour, Min
  eventDate: new Date(2026, 9, 11, 18, 0, 0),
  
  // Google Maps link for Venue
  googleMapsUrl: "https://maps.app.goo.gl/EGWA563mdZ9zKLfy8?g_st=atm",
  
  // Music File Path (Replace with your MP3 path e.g. "music/song.mp3")
  audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-acoustic-guitar-113540.mp3"
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI Elements
  initEnvelope();
  initMusicPlayer();
  initCountdown();
});

/* ==========================================================================
   ENVELOPE OPENING LOGIC
   ========================================================================== */

function initEnvelope() {
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const reopenBtn = document.getElementById('btn-reopen-envelope');
  const audio = document.getElementById('wedding-audio');

  if (waxSealBtn && envelopeWrapper) {
    waxSealBtn.addEventListener('click', () => {
      // 1. Trigger flap 3D rotate animation
      envelopeWrapper.classList.add('opening');

      // 2. Play music if possible
      if (audio) {
        audio.play().then(() => {
          updatePlayIcon(true);
        }).catch(err => {
          console.log("Audio autoplay prevented by browser policy:", err);
        });
      }

      // 3. Slide envelope up to reveal full invitation card
      setTimeout(() => {
        envelopeWrapper.classList.add('opened');
      }, 700);
    });
  }

  // Re-open envelope button in floating toolbar
  if (reopenBtn && envelopeWrapper) {
    reopenBtn.addEventListener('click', () => {
      envelopeWrapper.classList.remove('opened');
      envelopeWrapper.classList.remove('opening');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   MUSIC PLAYER LOGIC
   ========================================================================== */

function initMusicPlayer() {
  const audio = document.getElementById('wedding-audio');
  const playPauseBtn = document.getElementById('btn-play-pause');
  const floatMusicBtn = document.getElementById('btn-float-music');

  if (!audio) return;

  // Set audio source from config
  audio.src = CONFIG.audioUrl;

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', toggleAudio);
  }

  if (floatMusicBtn) {
    floatMusicBtn.addEventListener('click', toggleAudio);
  }

  function toggleAudio() {
    if (audio.paused) {
      audio.play().then(() => {
        updatePlayIcon(true);
      }).catch(err => {
        alert("Не удалось воспроизвести аудио. Выберите ваш аудиофайл.");
      });
    } else {
      audio.pause();
      updatePlayIcon(false);
    }
  }
}

function updatePlayIcon(isPlaying) {
  const playPauseBtn = document.getElementById('btn-play-pause');
  const floatMusicBtn = document.getElementById('btn-float-music');

  const iconClass = isPlaying ? 'fa-pause' : 'fa-play';

  if (playPauseBtn) {
    playPauseBtn.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
  }
  if (floatMusicBtn) {
    floatMusicBtn.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
  }
}

/* ==========================================================================
   COUNTDOWN TIMER LOGIC
   ========================================================================== */

function initCountdown() {
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = CONFIG.eventDate.getTime() - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  update();
  setInterval(update, 1000);
}
