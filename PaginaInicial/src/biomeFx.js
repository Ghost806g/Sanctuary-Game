/**
 * SANCTUARY BIOME FX ENGINE
 * Motor 3D de partículas em Canvas
 */

class BiomeParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.currentBiome = "default";
    this.isActive = false;

    // Interação
    this.mouseX = 0;
    this.mouseY = 0;
    this.shakeIntensity = 0;

    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (e) => this.handleMouseMove(e));
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.width = rect.width;
    this.height = rect.height;
  }

  handleMouseMove(e) {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  }

  triggerShake(intensity = 20) {
    this.shakeIntensity = intensity;
  }

  setBiome(biomeName) {
    const name = biomeName.toLowerCase();
    this.particles = [];

    if (name.includes("catacumba")) this.currentBiome = "catacumbas";
    else if (name.includes("pântano") || name.includes("pantano"))
      this.currentBiome = "pantano";
    else if (name.includes("floresta")) this.currentBiome = "floresta";
    else if (name.includes("magma") || name.includes("vulcão"))
      this.currentBiome = "magma";
    else if (name.includes("cristal") || name.includes("gelo"))
      this.currentBiome = "cristal";
    else this.currentBiome = "none";

    if (this.currentBiome !== "none") {
      this.generateParticles();
      if (!this.isActive) {
        this.isActive = true;
        this.animate();
      }
    } else {
      this.isActive = false;
      if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  generateParticles() {
    let count = 0;

    if (this.currentBiome === "catacumbas") count = 40;
    else if (this.currentBiome === "pantano") count = 80;
    else if (this.currentBiome === "magma") count = 150;
    else if (this.currentBiome === "floresta") count = 60;
    else if (this.currentBiome === "cristal") count = 100;

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const p = {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: 0,
      vy: 0,
      size: 0,
      opacity: Math.random(),
      life: Math.random() * 100,
      maxLife: 100 + Math.random() * 200,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.05,
    };

    if (this.currentBiome === "catacumbas") {
      p.size = 50 + Math.random() * 150;
      p.vx = (Math.random() - 0.5) * 0.5;
      p.vy = (Math.random() - 0.5) * 0.2;
    } else if (this.currentBiome === "pantano") {
      p.size = 5 + Math.random() * 20;
      p.vx = (Math.random() - 0.5) * 1;
      p.vy = -0.5 - Math.random() * 1.5;
    } else if (this.currentBiome === "magma") {
      p.size = 1 + Math.random() * 4;
      p.vx = (Math.random() - 0.5) * 0.5;
      p.vy = -1 - Math.random() * 3;
      p.baseX = p.x;
      p.waveSpeed = 0.02 + Math.random() * 0.05;
    } else if (this.currentBiome === "floresta") {
      p.size = 10 + Math.random() * 30;
      p.vx = 0.5 + Math.random() * 2;
      p.vy = 1 + Math.random() * 3;
    } else if (this.currentBiome === "cristal") {
      p.size = 2 + Math.random() * 6;
      p.vx = (Math.random() - 0.5) * 0.3;
      p.vy = -0.2 - Math.random() * 0.8;
      p.blinkSpeed = 0.02 + Math.random() * 0.05;
    }

    return p;
  }

  updateParticle(p) {
    // Shake logic
    let shakeX = 0;
    let shakeY = 0;
    if (this.shakeIntensity > 0) {
      shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      shakeY = (Math.random() - 0.5) * this.shakeIntensity;
    }

    // Mouse Repulsion (Parallax 3D pseudo-effect)
    let dx = p.x - this.mouseX;
    let dy = p.y - this.mouseY;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      let force = (100 - dist) / 100;
      p.x += dx * force * 0.05;
      p.y += dy * force * 0.05;
    }

    // Biome specific updates
    if (this.currentBiome === "catacumbas") {
      p.x += p.vx + shakeX;
      p.y += p.vy + shakeY;
      if (p.x < -p.size) p.x = this.width + p.size;
      if (p.x > this.width + p.size) p.x = -p.size;
      if (p.y < -p.size) p.y = this.height + p.size;
      if (p.y > this.height + p.size) p.y = -p.size;

      p.life += 0.5;
      p.currentOpacity = Math.sin((p.life / p.maxLife) * Math.PI) * 0.15;
      if (p.life >= p.maxLife) Object.assign(p, this.createParticle());
    } else if (this.currentBiome === "pantano") {
      p.x += p.vx + shakeX;
      p.y += p.vy + shakeY;
      p.angle += p.spin;
      if (p.y < -p.size)
        Object.assign(p, this.createParticle(), { y: this.height + p.size });

      p.life += 1;
      p.currentOpacity = Math.sin((p.life / p.maxLife) * Math.PI) * 0.4;
      if (p.life >= p.maxLife)
        Object.assign(p, this.createParticle(), { y: this.height + p.size });
    } else if (this.currentBiome === "magma") {
      p.life += 1;
      p.x = p.baseX + Math.sin(p.life * p.waveSpeed) * 20 + shakeX;
      p.y += p.vy + shakeY;

      if (p.y < -10)
        Object.assign(p, this.createParticle(), { y: this.height + 10 });
      p.currentOpacity = Math.sin((p.life / p.maxLife) * Math.PI) * 0.9;
      if (p.life >= p.maxLife)
        Object.assign(p, this.createParticle(), { y: this.height + 10 });
    } else if (this.currentBiome === "floresta") {
      p.x += p.vx + shakeX;
      p.y += p.vy + shakeY;
      p.angle += p.spin;

      if (p.y > this.height + p.size || p.x > this.width + p.size) {
        Object.assign(p, this.createParticle(), {
          y: -p.size,
          x: Math.random() * this.width - 100,
        });
      }
      p.currentOpacity = 0.4;
    } else if (this.currentBiome === "cristal") {
      p.x += p.vx + shakeX;
      p.y += p.vy + shakeY;
      p.angle += p.spin;
      p.life += p.blinkSpeed;

      if (p.y < -p.size)
        Object.assign(p, this.createParticle(), { y: this.height + p.size });
      p.currentOpacity = Math.abs(Math.sin(p.life)) * 0.7 + 0.1;
    }
  }

  drawParticle(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.angle);

    if (this.currentBiome === "catacumbas") {
      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
      gradient.addColorStop(0, `rgba(200, 200, 210, ${p.currentOpacity})`);
      gradient.addColorStop(1, "rgba(200, 200, 210, 0)");
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (this.currentBiome === "pantano") {
      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
      gradient.addColorStop(0, `rgba(74, 222, 128, ${p.currentOpacity})`);
      gradient.addColorStop(1, "rgba(74, 222, 128, 0)");
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (this.currentBiome === "magma") {
      this.ctx.fillStyle = `rgba(255, 100, 20, ${p.currentOpacity})`;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = "#f97316";
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (this.currentBiome === "floresta") {
      this.ctx.fillStyle = `rgba(5, 5, 10, ${p.currentOpacity})`;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = "#000";
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (this.currentBiome === "cristal") {
      this.ctx.fillStyle = `rgba(167, 243, 208, ${p.currentOpacity})`;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = "#6ee7b7";
      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size);
      this.ctx.lineTo(p.size * 0.5, 0);
      this.ctx.lineTo(0, p.size);
      this.ctx.lineTo(-p.size * 0.5, 0);
      this.ctx.closePath();
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  animate() {
    if (!this.isActive || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Apply global composite operations for better blending
    if (this.currentBiome === "catacumbas")
      this.ctx.globalCompositeOperation = "screen";
    else if (this.currentBiome === "pantano")
      this.ctx.globalCompositeOperation = "color-dodge";
    else if (this.currentBiome === "magma")
      this.ctx.globalCompositeOperation = "screen";
    else if (this.currentBiome === "floresta")
      this.ctx.globalCompositeOperation = "source-over";
    else if (this.currentBiome === "cristal")
      this.ctx.globalCompositeOperation = "screen";

    for (const p of this.particles) {
      this.updateParticle(p);
      this.drawParticle(p);
    }

    // Decay shake
    if (this.shakeIntensity > 0) {
      this.shakeIntensity -= 1.0;
      if (this.shakeIntensity < 0) this.shakeIntensity = 0;
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Global hook
let globalBiomeEngine = null;

window.setBiomeCanvasEffect = function (biomeName) {
  if (!globalBiomeEngine) {
    globalBiomeEngine = new BiomeParticleSystem("biome-canvas-fx");
  }
  globalBiomeEngine.setBiome(biomeName);
};

window.triggerBiomeCanvasShake = function (intensity = 20) {
  if (globalBiomeEngine) {
    globalBiomeEngine.triggerShake(intensity);
  }
};
