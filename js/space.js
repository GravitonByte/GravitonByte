const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  updateSettings();
});

// ===== Detectar móvil con orientación =====
function getSettings() {
  if (window.matchMedia("(orientation: portrait) and (any-pointer: coarse)").matches) {
    return { stars: 70, meteors: 2 }; // 📱 Móvil vertical
  } else if (window.matchMedia("(orientation: landscape) and (any-pointer: coarse)").matches) {
    return { stars: 90, meteors: 3 }; // 📱 Móvil horizontal
  } else {
    return { stars: 120, meteors: Math.floor(window.innerWidth / 300) }; // Escritorio/tablet
  }
}

let settings = getSettings();

// ===== Estrellas fijas =====
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

// ===== Meteoros =====
class Meteor {
  constructor() {
    this.reset(true);
  }
  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : -20;
    this.size = Math.random() * 3 + 2;
    this.speed = Math.random() * 2 + 1.5;
    this.angle = Math.PI / (3 + Math.random()); // ángulo variado
    this.trail = [];
    this.maxTrail = Math.floor(Math.random() * 8) + 6;
  }
  update() {
    const dx = Math.cos(this.angle) * this.speed;
    const dy = Math.sin(this.angle) * this.speed;
    this.x += dx;
    this.y += dy;

    this.trail.unshift({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrail) {
      this.trail.pop();
    }

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

function updateSettings() {
  settings = getSettings();
  generateStars();
  generateMeteors();
}

// Generar al inicio
updateSettings();

// ===== Escuchar cambios de orientación en móviles =====
const portraitQuery = window.matchMedia("(orientation: portrait) and (any-pointer: coarse)");
const landscapeQuery = window.matchMedia("(orientation: landscape) and (any-pointer: coarse)");

function orientationChange() {
  updateSettings();
}

portraitQuery.addEventListener("change", orientationChange);
landscapeQuery.addEventListener("change", orientationChange);

// ===== Dibujar estrellas =====
function drawStars() {
  for (let star of stars) {
    ctx.fillStyle = "white";
    ctx.shadowColor = "white";
    ctx.shadowBlur = 6 * star.glow;
    ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
    star.glow = 0.5 + Math.sin(Date.now() * 0.002 + star.x) * 0.5;
  }
}

// ===== Animación =====
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
