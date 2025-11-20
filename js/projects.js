// Carrusel
const track = document.querySelector(".carousel-track");
const cards = Array.from(track.children);
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
let index = 0;

function updateCarousel() {
  const gap = 20;
  const cardWidth = cards[0].offsetWidth;
  const moveAmount = cardWidth + gap;
  track.style.transform = `translateX(${-index * moveAmount}px)`;

  prevButton.classList.toggle("disabled", index === 0);
  nextButton.classList.toggle(
    "disabled",
    index >= cards.length - getCardsToShow()
  );
}

function getCardsToShow() {
  const w = window.innerWidth;
  if (w <= 768) return 1;
  if (w <= 1024) return 2;
  return 3;
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

// Flip de tarjetas y control de videos
let lastFlippedCard = null;

cards.forEach((card) => {
  const video = card.querySelector("video");
  const playOverlay = card.querySelector(".play-overlay");
  const videoContainer = card.querySelector(".video-container");
  
  // Configurar eventos para el video
  if (video) {
    video.addEventListener("play", function() {
      playOverlay.classList.add("hidden");
    });
    
    video.addEventListener("pause", function() {
      playOverlay.classList.remove("hidden");
    });
    
    video.addEventListener("ended", function() {
      playOverlay.classList.remove("hidden");
    });
    
    // Reproducir/pausar al hacer clic en el overlay
    playOverlay.addEventListener("click", function(e) {
      e.stopPropagation();
      video.play();
    });
    
    // Pausar video al hacer clic en el contenedor (excepto en móviles)
    if (window.innerWidth > 768) {
      videoContainer.addEventListener("click", function(e) {
        e.stopPropagation();
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });
    }
  }

  const flipCard = (e) => {
    if (
      e &&
      (e.target.closest(".play-overlay") ||
        e.target.closest("video") ||
        e.target.closest(".video-container"))
    ) {
      return;
    }

    const wasFlipped = card.classList.contains("flipped");

    if (lastFlippedCard && lastFlippedCard !== card) {
      lastFlippedCard.classList.remove("flipped");
      const lastVideo = lastFlippedCard.querySelector("video");
      if (lastVideo) {
        lastVideo.pause();
        lastVideo.currentTime = 0;
      }
    }

    card.classList.toggle("flipped");

    if (!wasFlipped) {
      lastFlippedCard = card;
    } else {
      const currentVideo = card.querySelector("video");
      if (currentVideo) {
        currentVideo.pause();
        currentVideo.currentTime = 0;
      }
    }
  };

  card.addEventListener("click", flipCard);

  let touchStartTime = 0;
  card.addEventListener("touchend", (e) => {
    const now = Date.now();
    if (now - touchStartTime < 500) {
      if (
        !e.target.closest(".play-overlay") &&
        !e.target.closest("video") &&
        !e.target.closest(".video-container")
      ) {
        e.preventDefault();
        flipCard(e);
      }
    }
  });

  card.addEventListener("touchstart", () => {
    touchStartTime = Date.now();
  });
});

window.addEventListener("resize", () => {
  index = Math.max(0, Math.min(index, cards.length - getCardsToShow()));
  updateCarousel();
});

updateCarousel();