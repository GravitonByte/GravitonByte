//index.js
document.addEventListener("DOMContentLoaded", function () {
  function detectDevice() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      document.body.classList.add("mobile");
    } else {
      document.body.classList.remove("mobile");
    }
  }

  window.addEventListener("resize", detectDevice);
  window.addEventListener("orientationchange", detectDevice);
  detectDevice();

  const titleElements = document.querySelectorAll(".binary-title");
  const binaryCharacters = "01";

  function getRandomBinary() {
    return binaryCharacters[
      Math.floor(Math.random() * binaryCharacters.length)
    ];
  }

  function animateCharacter(characterElement, targetChar, maxIterations) {
    let iterations = 0;
    const interval = setInterval(() => {
      if (iterations >= maxIterations) {
        characterElement.textContent =
          targetChar === " " ? "\u00A0" : targetChar;
        clearInterval(interval);
      } else {
        characterElement.textContent = getRandomBinary();
      }
      iterations++;
    }, 100);
  }

  function animateTitle(element, text) {
    const characters = text.split("");
    element.innerHTML = characters
      .map((char) => `<span>${getRandomBinary()}</span>`)
      .join("");
    const characterElements = element.querySelectorAll("span");

    characterElements.forEach((charElement, index) => {
      animateCharacter(charElement, characters[index], 20 + index * 2);
      charElement.addEventListener("mouseenter", () => {
        animateCharacter(charElement, getRandomBinary(), 20);
      });
      charElement.addEventListener("mouseleave", () => {
        animateCharacter(charElement, characters[index], 20);
      });
      charElement.addEventListener("touchstart", () => {
        animateCharacter(charElement, getRandomBinary(), 20);
      });
      charElement.addEventListener("touchend", () => {
        // Restablecer el caracter correcto al finalizar el toque
        setTimeout(() => {
          animateCharacter(charElement, characters[index], 20);
        }, 200); // Ajustar el tiempo según sea necesario
      });
    });
  }

  function showTitles() {
    titleElements.forEach((element) => {
      const text = element.textContent;
      element.classList.add("visible");
      animateTitle(element, text);
    });
  }

  setTimeout(showTitles, 500);

  function loadDynamicCSS() {
    if (!document.querySelector('link[href*="../css/index.css"]')) {
      var cssLink = document.createElement("link");
      cssLink.href = "../css/index.css?v=" + Math.floor(Math.random() * 1000);
      cssLink.rel = "stylesheet";
      document.head.appendChild(cssLink);
    }
  }

  function loadDynamicJS() {
    if (!document.querySelector('script[src*="index.js"]')) {
      var jsLink = document.createElement("script");
      jsLink.src = "index.js?v=" + Math.floor(Math.random() * 1000);
      document.head.appendChild(jsLink);
    }
  }

  // Cargar archivos CSS y JS dinámicamente
  loadDynamicCSS();
  loadDynamicJS();
});

const audio = document.getElementById("miAudio");
const slider = document.getElementById("controlVolumen");
const toggle = document.getElementById("audioToggle");

// iniciar en silencio
audio.volume = 0;
toggle.textContent = "♪";

// función para actualizar estado del botón
function updateButtonState(isPlaying) {
  toggle.classList.toggle("active", isPlaying);
  toggle.textContent = "♪";
  toggle.setAttribute("aria-label", isPlaying ? "Pausar música" : "Activar música");
}

// click en el botón
toggle.addEventListener("click", async () => {
  if (audio.paused || audio.volume === 0) {
    if (audio.volume === 0) audio.volume = 0.6;
    slider.value = Math.round(audio.volume * 100);
    try { await audio.play(); } catch (err) { console.error(err); }
    updateButtonState(true);
  } else {
    audio.pause();
    updateButtonState(false);
  }
});

// sincronizar con slider
slider.addEventListener("input", () => {
  audio.volume = slider.value / 100;
  if (audio.volume === 0) {
    audio.pause();
    updateButtonState(false);
  } else {
    if (audio.paused) audio.play().catch(() => {});
    updateButtonState(true);
  }
});

// loop infinito
audio.addEventListener("ended", () => {
  if (audio.volume > 0) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
});

// Navegación desde "Sobre mí / About"
document.addEventListener("DOMContentLoaded", () => {
  const aboutLink = document.getElementById("about-link");
  if (aboutLink) {
    aboutLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "about.html";
    });
  }
});

// Navegación desde "Habilidades / Skills"
document.addEventListener("DOMContentLoaded", () => {
  const skillsLink = document.getElementById("skills-link");
  if (skillsLink) {
    skillsLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "skills.html";
    });
  }
});

// Navegación desde "Proyectos / Projects"
document.addEventListener("DOMContentLoaded", () => {
  const projectsLink = document.getElementById("projects-link");
  if (projectsLink) {
    projectsLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "projects.html";
    });
  }
});

// Navegación desde "Contacto / Contact"
document.addEventListener("DOMContentLoaded", () => {
  const contactLink = document.getElementById("contact-link");
  if (contactLink) {
    contactLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "contact.html";
    });
  }
});