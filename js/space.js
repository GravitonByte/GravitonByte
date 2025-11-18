const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

/* ============================================================
   FUNCIÓN QUE USA VISUAL VIEWPORT (MEJOR QUE innerHeight)
   ============================================================ */
function resizeCanvas() {
  const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;

  canvas.width = vw;
  canvas.height = vh;
}

/* Primera ejecución */
resizeCanvas();

/* Redimensionar correctamente en móviles */
window.visualViewport?.addEventListener("resize", () => {
  resizeCanvas();
  updateSettings();
});

window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    resizeCanvas();
    updateSettings();
  }, 150);
});

/* ============================================================
   DETECTAR DISPOSITIVOS MÓVILES Y ORIENTACIÓN
   ============================================================ */
function getSettings() {
  const isMobile = matchMedia("(any-pointer: coarse)").matches;
  const isPortrait = matchMedia("(orientation: portrait)").matches;

  if (isMobile && isPortrait)
    return { stars: 70, meteors: 2 };      // 📱 Móvil Vertical

  if (isMobile && !isPortrait)
    return { stars: 90, meteors: 3 };      // 📱 Móvil Horizontal

  return { stars: 120, meteors: Math.floor(canvas.width / 300) }; // 🖥 Escritorio/Tablet
}

let settings = getSettings();

/* ============================================================
   ESTRELLAS
   ============================================================ */
let stars = [];

function generateStars() {
  stars = [];
  for (let i = 0; i < settings.stars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.floor(Math.random() * 3) + 1,
      glow: Math.random() * 0.5 + 0.5
    });
  }
}

/* ============================================================
   METEOROS
   ============================================================ */
class Meteor {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : -20;
    this.size = Math.random() * 3 + 2;
    this.speed = Math.random() * 2 + 1.5;
    this.angle = Math.PI / (3 + Math.random());
    this.trail = [];
    this.maxTrail = Math.floor(Math.random() * 8) + 6;
  }

  update() {
    const dx = Math.cos(this.angle) * this.speed;
    const dy = Math.sin(this.angle) * this.speed;

    this.x += dx;
    this.y += dy;

    this.trail.unshift({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrail) this.trail.pop();

    if (this.x > canvas.width + 50 || this.y > canvas.height + 50) {
      this.reset();
    }
  }

  draw() {
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      const fade = 1 - i / this.maxTrail;

      ctx.fillStyle = `rgba(255, ${Math.floor(80 + fade * 170)}, 0, ${fade})`;
      ctx.shadowColor = "orange";
      ctx.shadowBlur = 8 * fade;
      ctx.fillRect(Math.floor(t.x), Math.floor(t.y), this.size, this.size);
    }

    ctx.fillStyle = "#ffff66";
    ctx.shadowColor = "red";
    ctx.shadowBlur = 25;
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
  }
}

let meteors = [];

function generateMeteors() {
  meteors = [];
  for (let i = 0; i < settings.meteors; i++) {
    meteors.push(new Meteor());
  }
}

/* ============================================================
   ACTUALIZAR CONFIGURACIÓN
   ============================================================ */
function updateSettings() {
  settings = getSettings();
  generateStars();
  generateMeteors();
}

/* Inicializar */
updateSettings();

/* ============================================================
   DIBUJAR ESTRELLAS
   ============================================================ */
function drawStars() {
  for (let star of stars) {
    ctx.fillStyle = "white";
    ctx.shadowColor = "white";
    ctx.shadowBlur = 6 * star.glow;

    ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);

    star.glow = 0.5 + Math.sin(Date.now() * 0.002 + star.x) * 0.5;
  }
}

/* ============================================================
   LOOP DE ANIMACIÓN
   ============================================================ */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawStars();

  for (let meteor of meteors) {
    meteor.update();
    meteor.draw();
  }

  requestAnimationFrame(animate);
}

animate();
