/* ==========================================================================
   WEDDING INVITATION - INTERACTIVE JAVASCRIPT
   ========================================================================== */

// CONFIGURATION VARIABLES (Easy for user to customize)
const CONFIG = {
  // Target Event Date for Countdown: Year, Month (0-indexed: 9 = Oct), Day, Hour, Min
  eventDate: new Date(2026, 9, 11, 17, 0, 0),
  
  // Google Maps link for Venue
  googleMapsUrl: "https://maps.google.com/?q=Ресторан+Свадебный",
  
  // Music File Path (Replace with your MP3 path e.g. "music/song.mp3")
  audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-acoustic-guitar-113540.mp3"
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI Elements
  initEnvelope();
  initMusicPlayer();
  initCountdown();
  initModals();
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

/* ==========================================================================
   MODAL DIALOG HANDLERS
   ========================================================================== */

function initModals() {
  // Location Modal
  const btnLocation = document.getElementById('btn-open-location');
  const modalLocation = document.getElementById('modal-location');
  const closeLocation = document.getElementById('close-modal-location');
  const btnGoMaps = document.getElementById('btn-go-maps');

  if (btnLocation && modalLocation) {
    btnLocation.addEventListener('click', () => modalLocation.classList.add('active'));
  }
  if (closeLocation && modalLocation) {
    closeLocation.addEventListener('click', () => modalLocation.classList.remove('active'));
  }
  if (btnGoMaps) {
    btnGoMaps.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(CONFIG.googleMapsUrl, '_blank');
    });
  }

  // Gifts Modal
  const btnGifts = document.getElementById('btn-open-gifts');
  const modalGifts = document.getElementById('modal-gifts');
  const closeGifts = document.getElementById('close-modal-gifts');

  if (btnGifts && modalGifts) {
    btnGifts.addEventListener('click', () => modalGifts.classList.add('active'));
  }
  if (closeGifts && modalGifts) {
    closeGifts.addEventListener('click', () => modalGifts.classList.remove('active'));
  }

  // RSVP Modal
  const btnRsvp = document.getElementById('btn-open-rsvp');
  const modalRsvp = document.getElementById('modal-rsvp');
  const closeRsvp = document.getElementById('close-modal-rsvp');
  const rsvpForm = document.getElementById('rsvp-form');

  if (btnRsvp && modalRsvp) {
    btnRsvp.addEventListener('click', () => modalRsvp.classList.add('active'));
  }
  if (closeRsvp && modalRsvp) {
    closeRsvp.addEventListener('click', () => modalRsvp.classList.remove('active'));
  }

  // RSVP Form submission logic
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const guestName = document.getElementById('guest-name').value;
      const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Sí';
      const guestCount = document.getElementById('guest-count').value;
      const guestMessage = document.getElementById('guest-message').value;

      const rsvpData = {
        name: guestName,
        attendance: attendance,
        count: guestCount,
        message: guestMessage,
        date: new Date().toISOString()
      };

      // Save locally
      const savedList = JSON.parse(localStorage.getItem('wedding_rsvp_list') || '[]');
      savedList.push(rsvpData);
      localStorage.setItem('wedding_rsvp_list', JSON.stringify(savedList));

      // Show confirmation alert / modal feedback
      alert(`¡Gracias ${guestName}! Ваше подтверждение принято.`);
      
      rsvpForm.reset();
      modalRsvp.classList.remove('active');
    });
  }

  // Close modals when clicking backdrop outside modal box
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
      }
    });
  });
}
