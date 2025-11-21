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
  
  // Centrar cuando solo hay una tarjeta
  if (cards.length === 1) {
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
        e.target.closest(".video-container") ||
        e.target.closest(".video-controls"))
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
        !e.target.closest(".video-container") &&
        !e.target.closest(".video-controls")
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

// Controles de video
function initVideoControls() {
  const videos = document.querySelectorAll('.video-container video');
  
  videos.forEach(video => {
    const container = video.closest('.video-container');
    const playOverlay = container.querySelector('.play-overlay');
    const volumeBtn = container.querySelector('.volume-btn');
    const volumeSlider = container.querySelector('.volume-slider');
    const fullscreenBtn = container.querySelector('.fullscreen-btn');
    const volumeIcon = volumeBtn.querySelector('i');

    // Eventos de play/pause
    video.addEventListener('play', function() {
      playOverlay.classList.add('hidden');
    });
    
    video.addEventListener('pause', function() {
      playOverlay.classList.remove('hidden');
    });
    
    video.addEventListener('ended', function() {
      playOverlay.classList.remove('hidden');
    });

    // Control de volumen - Corregido para no pausar el video
    volumeSlider.addEventListener('input', function(e) {
      e.stopPropagation();
      video.volume = this.value;
      updateVolumeIcon(video.volume, volumeIcon);
    });

    volumeSlider.addEventListener('mousedown', function(e) {
      e.stopPropagation();
    });

    volumeSlider.addEventListener('touchstart', function(e) {
      e.stopPropagation();
    });

    volumeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      video.volume = video.volume === 0 ? 1 : 0;
      volumeSlider.value = video.volume;
      updateVolumeIcon(video.volume, volumeIcon);
    });

    // Pantalla completa
    fullscreenBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFullscreen(container);
    });

    // Actualizar icono de volumen al cargar
    updateVolumeIcon(video.volume, volumeIcon);
  });
}

function updateVolumeIcon(volume, icon) {
  if (volume === 0) {
    icon.className = 'fas fa-volume-mute';
  } else if (volume < 0.5) {
    icon.className = 'fas fa-volume-down';
  } else {
    icon.className = 'fas fa-volume-up';
  }
}

function toggleFullscreen(element) {
  if (!document.fullscreenElement) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  } else {
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
}

// Detección de cambio de orientación en pantalla completa
window.addEventListener('orientationchange', function() {
  if (document.fullscreenElement) {
    console.log('Orientación cambiada en pantalla completa');
  }
});

// También escuchamos el cambio a pantalla completa para ajustar estilos si es necesario
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
  const isFullscreen = !!document.fullscreenElement;
  document.body.classList.toggle('fullscreen-active', isFullscreen);
}

// Inicializar controles de video
initVideoControls();