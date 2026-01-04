const icons = document.querySelectorAll(".icon");
const email = document.getElementById("email-floor");

const gravity = 0.9;
const bounce = 0.65;
const offset = 8;

const states = [];

icons.forEach((icon, i) => {
  states.push({
    el: icon,
    y: -140 - i * 40,
    vy: 0
  });
});

function animate() {
  const emailRect = email.getBoundingClientRect();
  const iconHeight = icons[0].offsetHeight;
  const floorY = emailRect.top - iconHeight - offset;

  states.forEach((s) => {
    s.vy += gravity;
    s.y += s.vy;

    if (s.y >= floorY) {
      s.y = floorY;
      s.vy *= -bounce;

      s.el.classList.add("glow");
      setTimeout(() => s.el.classList.remove("glow"), 120);
    }

    s.el.style.transform = `translateY(${s.y}px)`;
  });

  requestAnimationFrame(animate);
}

animate();
