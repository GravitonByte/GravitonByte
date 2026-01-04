// =====================
// CARRUSEL
// =====================
const track = document.querySelector(".carousel-track");
const cards = Array.from(track.children);
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");

let index = 0;
let lastFlippedCard = null;

function getCardsToShow() {
  const w = window.innerWidth;
  if (w <= 768) return 1;
  if (w <= 1024) return 2;
  return 3;
}

function updateCarousel() {
  if (!cards.length) return;

  const gap = 20;
  const cardWidth = cards[0].offsetWidth;
  const moveAmount = cardWidth + gap;

  if (cards.length === 1 && window.innerWidth > 768) {
    track.style.transform = `translateX(${moveAmount}px)`;
  } else {
    track.style.transform = `translateX(${-index * moveAmount}px)`;
  }

  prevButton.classList.toggle("disabled", index === 0);
  nextButton.classList.toggle(
    "disabled",
    index >= cards.length - getCardsToShow()
  );
}

nextButton.addEventListener("click", () => {
  if (index < cards.length - getCardsToShow()) {
    index++;
    updateCarousel();
  }
});

prevButton.addEventListener("click", () => {
  if (index > 0) {
    index--;
    updateCarousel();
  }
});

// =====================
// VIDEO HELPERS
// =====================
function playVideo(card) {
  const video = card.querySelector("video");
  const overlay = card.querySelector(".play-overlay");
  if (!video) return;

  video.muted = true;
  video.playsInline = true;

  if (!video.dataset.loaded) {
    video.load();
    video.dataset.loaded = "true";
  }

  const playPromise = video.play();
  if (playPromise) {
    playPromise
      .then(() => overlay?.classList.add("hidden"))
      .catch(() => overlay?.classList.remove("hidden"));
  }
}

function stopVideo(card) {
  const video = card.querySelector("video");
  const overlay = card.querySelector(".play-overlay");
  if (!video) return;

  video.pause();
  video.currentTime = 0;
  overlay?.classList.remove("hidden");
}

// =====================
// FLIP DE TARJETAS
// =====================
cards.forEach(card => {
  const video = card.querySelector("video");
  const overlay = card.querySelector(".play-overlay");
  const container = card.querySelector(".video-container");

  const flipCard = e => {
    if (
      e.target.closest(".video-container") ||
      e.target.closest(".video-controls")
    ) return;

    const wasFlipped = card.classList.contains("flipped");

    if (lastFlippedCard && lastFlippedCard !== card) {
      lastFlippedCard.classList.remove("flipped");
      stopVideo(lastFlippedCard);
    }

    card.classList.toggle("flipped");

    if (!wasFlipped) {
      lastFlippedCard = card;
      setTimeout(() => playVideo(card), 400);
    } else {
      stopVideo(card);
    }
  };

  card.addEventListener("click", flipCard);

  // Overlay play
  overlay?.addEventListener("click", e => {
    e.stopPropagation();
    playVideo(card);
  });

  // Click video (desktop toggle)
  container?.addEventListener("click", e => {
    if (window.innerWidth > 768) {
      e.stopPropagation();
      video.paused ? playVideo(card) : stopVideo(card);
    }
  });

  // Touch support
  let touchTime = 0;
  card.addEventListener("touchstart", () => (touchTime = Date.now()));
  card.addEventListener("touchend", e => {
    if (Date.now() - touchTime < 500) {
      e.preventDefault();
      flipCard(e);
    }
  });
});

// =====================
// CONTROLES DE VIDEO
// =====================
function initVideoControls() {
  document.querySelectorAll(".video-container").forEach(container => {
    const video = container.querySelector("video");
    const overlay = container.querySelector(".play-overlay");
    const volumeBtn = container.querySelector(".volume-btn");
    const volumeSlider = container.querySelector(".volume-slider");
    const fullscreenBtn = container.querySelector(".fullscreen-btn");
    const volumeIcon = volumeBtn?.querySelector("i");

    if (!video) return;

    video.addEventListener("play", () => overlay?.classList.add("hidden"));
    video.addEventListener("pause", () => overlay?.classList.remove("hidden"));
    video.addEventListener("ended", () => overlay?.classList.remove("hidden"));

    if (window.innerWidth > 768 && volumeSlider && volumeBtn) {
      volumeSlider.addEventListener("input", e => {
        e.stopPropagation();
        video.volume = volumeSlider.value;
        updateVolumeIcon(video.volume, volumeIcon);
      });

      volumeBtn.addEventListener("click", e => {
        e.stopPropagation();
        video.volume = video.volume === 0 ? 1 : 0;
        volumeSlider.value = video.volume;
        updateVolumeIcon(video.volume, volumeIcon);
      });
    } else {
      volumeBtn?.remove();
      volumeSlider?.remove();
    }

    fullscreenBtn?.addEventListener("click", e => {
      e.stopPropagation();
      toggleFullscreen(container);
    });

    container.addEventListener("touchstart", () => {
      container.classList.add("show-controls");
      clearTimeout(container._hide);
      container._hide = setTimeout(
        () => container.classList.remove("show-controls"),
        2500
      );
    });
  });
}

function updateVolumeIcon(volume, icon) {
  if (!icon) return;
  icon.className =
    volume === 0
      ? "fas fa-volume-mute"
      : volume < 0.5
      ? "fas fa-volume-down"
      : "fas fa-volume-up";
}

// =====================
// FULLSCREEN (iOS SAFE)
// =====================
function toggleFullscreen(container) {
  const video = container.querySelector("video");

  if (video?.webkitEnterFullscreen) {
    video.webkitEnterFullscreen();
    return;
  }

  if (!document.fullscreenElement) {
    container.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

// =====================
// PRELOAD OPTIMIZADO
// =====================
function preloadVideos() {
  document.querySelectorAll("video[data-preload='true']").forEach(video => {
    if (video.dataset.loaded) return;
    video.muted = true;
    video.playsInline = true;
    video.load();
    video.dataset.loaded = "true";
  });
}

function preloadOnView() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target.querySelector("video");
          if (video && !video.dataset.loaded) {
            video.load();
            video.dataset.loaded = "true";
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "300px" }
  );

  document.querySelectorAll(".card").forEach(card => observer.observe(card));
}

// =====================
// EVENTOS GLOBALES
// =====================
window.addEventListener("resize", () => {
  index = Math.max(0, Math.min(index, cards.length - getCardsToShow()));
  updateCarousel();
  initVideoControls();
});

window.addEventListener("DOMContentLoaded", () => {
  updateCarousel();
  preloadVideos();
  preloadOnView();
  initVideoControls();
});
