// warp.js - VELOCIDAD MÁXIMA IGUAL EN MÓVILES Y ESCRITORIO 🚀
const canvas = document.getElementById("warpCanvas");
const ctx = canvas.getContext("2d");

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// === VELOCIDAD IGUAL O SUPERIOR EN MÓVILES ===
const numStars = isMobile ? 110 : 180;       // más estrellas en móvil para que se note más
let globalSpeed = 0.1;                        // arranque más rápido
const maxSpeed = 1.6;                         // ¡¡Misma velocidad máxima en todos los dispositivos!!
const acceleration = isMobile ? 0.004 : 0.003; // móviles llegan al tope antes

let stars = [];

// Centro real de la pantalla visible (sin dpr)
let centerX = 0;
let centerY = 0;

class Star {
    static centerX = 0;
    static centerY = 0;

    constructor() {
        this.reset();
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.size = isMobile ? 1.4 : 1.8;
        this.length = 1;
        this.baseSpeed = Math.random() * 0.8 + 0.6;  // estrellas individuales más rápidas
        this.angle = Math.random() * Math.PI * 2;
    }

    update() {
        this.size += 0.025;       // crecen más rápido → estelas más largas
        this.length += 0.28;      // estela crece más agresivamente

        const speed = this.baseSpeed * globalSpeed;
        this.x += Math.cos(this.angle) * speed * this.length;
        this.y += Math.sin(this.angle) * speed * this.length;

        const limit = Math.max(Star.centerX, Star.centerY) * 2.2;
        if (Math.abs(this.x) > limit || Math.abs(this.y) > limit) {
            this.reset();
        }
    }

    draw() {
        const screenX = this.x + Star.centerX;
        const screenY = this.y + Star.centerY;

        const tailLength = this.length * 15;  // estelas más largas y vistosas
        const tailX = screenX - Math.cos(this.angle) * tailLength;
        const tailY = screenY - Math.sin(this.angle) * tailLength;

        const distance = Math.hypot(this.x, this.y);
        const maxDist = Math.max(Star.centerX, Star.centerY);
        const opacity = Math.min(1, distance / (maxDist * 0.6));

        // Color hyperspace clásico (blanco-azulado brillante)
        ctx.strokeStyle = `rgba(220, 245, 255, ${opacity})`;
        ctx.lineWidth = this.size;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
    }
}

// === REDIMENSIONADO PERFECTO ===
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    Star.centerX = canvas.clientWidth / 2;
    Star.centerY = canvas.clientHeight / 2;

    createStars();  // siempre recrear al girar o redimensionar
}

function createStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        const star = new Star();
        // Algunas estrellas ya nacen con estela para que no empiece vacío
        star.length = Math.random() * 40;
        star.size = 1 + Math.random() * 2;
        stars.push(star);
    }
}

// === ANIMACIÓN ULTRA SUAVE ===
let animationId;
let then = Date.now();
const fpsInterval = 1000 / (isMobile ? 35 : 60);  // 35 FPS en móvil sigue siendo súper fluido

function animate() {
    animationId = requestAnimationFrame(animate);
    const now = Date.now();
    const elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        // Aceleración brutal
        if (globalSpeed < maxSpeed) {
            globalSpeed += acceleration;
        }

        stars.forEach(star => {
            star.update();
            star.draw();
        });
    }
}

// === INICIO ===
resizeCanvas();
createStars();
animate();

// === EVENTOS ===
window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", () => setTimeout(resizeCanvas, 150));

if (isMobile) {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) cancelAnimationFrame(animationId);
        else animate();
    });
}

document.addEventListener("touchstart", () => {}, { passive: true });