// warp.js
// ===== Detección de dispositivo móvil y orientación =====
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const portraitQuery = window.matchMedia("(orientation: portrait) and (any-pointer: coarse)");
const landscapeQuery = window.matchMedia("(orientation: landscape) and (any-pointer: coarse)");

// ===== Efecto Warp optimizado para móviles =====
const canvas = document.getElementById("warpCanvas");
const ctx = canvas.getContext("2d");
let stars = [];

// Ajustar número de estrellas según dispositivo para mejor rendimiento
let numStars = isMobile ? 100 : 160;

// Velocidad global con ajustes para móvil
let globalSpeed = isMobile ? 0.15 : 0.05;
const maxSpeed = isMobile ? 1.5 : 1.2;
const acceleration = isMobile ? 0.003 : 0.002;

// Variables para el centro del canvas
let centerX, centerY;

// Función para redimensionar canvas
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    // Actualizar centro del canvas
    centerX = rect.width / 2;
    centerY = rect.height / 2;
    
    // Recrear estrellas cuando cambia el tamaño
    if (stars.length > 0) {
        createStars();
    }
}

// Escuchar cambios de tamaño y orientación
window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", () => {
    setTimeout(resizeCanvas, 100); // Pequeño delay para asegurar dimensiones correctas
});
resizeCanvas();

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.size = isMobile ? 0.8 : 1.5;
        this.length = isMobile ? 0.5 : 1;
        this.maxLength = isMobile ? 15 : 30;
        this.baseSpeed = isMobile 
            ? Math.random() * 0.8 + 0.6 
            : Math.random() * 0.6 + 0.4;
        this.angle = Math.random() * Math.PI * 2;
    }

    update() {
        this.size += isMobile ? 0.02 : 0.01;
        
        // Limitar longitud de estela en móviles
        if (this.length < this.maxLength) {
            this.length += isMobile ? 0.3 : 0.1;
        }
        
        const currentSpeed = this.baseSpeed * globalSpeed;
        this.x += Math.cos(this.angle) * currentSpeed * this.length;
        this.y += Math.sin(this.angle) * currentSpeed * this.length;

        // Usar centerX y centerY para verificar límites
        const maxDistX = centerX * 1.5;
        const maxDistY = centerY * 1.5;
        
        if (Math.abs(this.x) > maxDistX || Math.abs(this.y) > maxDistY) {
            this.reset();
        }
    }

    draw() {
        const distance = Math.sqrt(this.x * this.x + this.y * this.y);
        const maxDistance = Math.max(centerX, centerY) * 1.2;
        const opacity = Math.min(1, distance / (maxDistance * 0.6));
        
        ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
        ctx.lineWidth = this.size;
        ctx.beginPath();
        
        // Dibujar desde el centro calculado
        ctx.moveTo(this.x + centerX, this.y + centerY);
        ctx.lineTo(
            this.x - Math.cos(this.angle) * this.length + centerX,
            this.y - Math.sin(this.angle) * this.length + centerY
        );
        ctx.stroke();
    }
}

function createStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

createStars();

// ===== Sistema de animación optimizado =====
let animationId;
let then = Date.now();
const fpsInterval = isMobile ? 1000 / 30 : 1000 / 60; // 30 FPS en móviles, 60 en desktop

function animate() {
    animationId = requestAnimationFrame(animate);
    
    const now = Date.now();
    const elapsed = now - then;
    
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        
        // Limpiar canvas
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Acelerar progresivamente
        if (globalSpeed < maxSpeed) {
            globalSpeed += acceleration;
        }
        
        // Actualizar y dibujar estrellas
        stars.forEach(star => {
            star.update();
            star.draw();
        });
    }
}

// Iniciar animación
animate();

// ===== Optimizaciones para móviles =====
if (isMobile) {
    // Pausar animación cuando la página no es visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
    
    // Manejar pausa en iOS cuando la app va a segundo plano
    document.addEventListener('webkitvisibilitychange', function() {
        if (document.webkitHidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

// ===== Manejo de la navegación móvil =====
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
}

// Cerrar menú al hacer clic en un enlace (móviles)
if (isMobile) {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });
}

// ===== Mejoras de UX para móviles =====
document.addEventListener('touchstart', function() {}, { passive: true });

// Prevenir zoom en inputs (opcional, según necesidades)
document.addEventListener('touchmove', function(e) {
    if (e.scale !== 1) {
        e.preventDefault();
    }
}, { passive: false });