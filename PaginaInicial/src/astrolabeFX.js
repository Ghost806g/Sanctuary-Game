// astrolabeFX.js
(function initAstrolabeCanvas() {
  window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('astrolabe-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;

    let particles = [];
    const maxParticles = 60;
    const cx = 200, cy = 200;

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        const angle = Math.random() * Math.PI * 2;
        const radius = 40 + Math.random() * 40;
        this.x = cx + Math.cos(angle) * radius;
        this.y = cy + Math.sin(angle) * radius;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.life = Math.random() * 0.5 + 0.5;
        this.decay = Math.random() * 0.01 + 0.005;
        this.color = Math.random() > 0.5 ? 'rgba(255, 215, 0, ' : 'rgba(96, 165, 250, ';
        this.size = Math.random() * 2 + 1;
        this.orbitSpeed = (Math.random() - 0.5) * 0.02;
        this.angle = angle;
        this.radius = radius;
      }
      update() {
        this.angle += this.orbitSpeed;
        this.radius += 0.2;
        this.x = cx + Math.cos(this.angle) * this.radius + this.vx;
        this.y = cy + Math.sin(this.angle) * this.radius + this.vy;
        this.life -= this.decay;
        if (this.life <= 0 || this.radius > 200) {
          this.reset();
        }
      }
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.life + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color + '1)';
        ctx.fill();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    function loop() {
      // LAG FIX: Don't draw if hidden!
      const wrapper = document.getElementById('combat-atb-timeline');
      if (!wrapper || wrapper.classList.contains('hidden')) {
        requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let p of particles) {
        p.update();
        p.draw(ctx);
      }
      requestAnimationFrame(loop);
    }
    loop();
  });
})();
