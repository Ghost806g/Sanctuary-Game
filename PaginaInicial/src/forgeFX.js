/**
 * sidebarDrag.js — Sidebar Arrastável do Sanctuary
 * Torna o #game-navigation um painel flutuante arrastável.
 * Posição salva no localStorage.
 */
(function initSidebarDrag() {
  const STORAGE_KEY = "sanctuary_nav_pos";
  const DEFAULT_X = 10;
  const DEFAULT_Y = 70;

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function savePos(x, y) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y }));
    } catch (e) {
      /* silencioso */
    }
  }

  function loadPos() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      /* silencioso */
    }
    return { x: DEFAULT_X, y: DEFAULT_Y };
  }

  function applyPos(nav, x, y) {
    nav.style.left = x + "px";
    nav.style.top = y + "px";
    nav.style.right = "auto";
    nav.style.bottom = "auto";
  }

  function setupDrag(nav, handle) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    let hasMoved = false;

    handle.addEventListener("mousedown", function (e) {
      e.preventDefault();
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(nav.style.left) || DEFAULT_X;
      startTop = parseInt(nav.style.top) || DEFAULT_Y;
      nav.classList.add("dragging");
      document.body.style.userSelect = "none";
    });

    handle.addEventListener(
      "touchstart",
      function (e) {
        const touch = e.touches[0];
        isDragging = true;
        hasMoved = false;
        startX = touch.clientX;
        startY = touch.clientY;
        startLeft = parseInt(nav.style.left) || DEFAULT_X;
        startTop = parseInt(nav.style.top) || DEFAULT_Y;
        nav.classList.add("dragging");
      },
      { passive: true },
    );

    handle.addEventListener("click", function() {
      if (!hasMoved && window.toggleSidebar) {
        window.toggleSidebar();
      }
    });

    document.addEventListener("mousemove", function (e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;

      const navW = nav.offsetWidth;
      const navH = nav.offsetHeight;
      const maxX = window.innerWidth - navW - 5;
      const maxY = window.innerHeight - navH - 5;

      const newX = clamp(startLeft + dx, 5, maxX);
      const newY = clamp(startTop + dy, 5, maxY);

      applyPos(nav, newX, newY);
    });

    document.addEventListener(
      "touchmove",
      function (e) {
        if (!isDragging) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        const navW = nav.offsetWidth;
        const navH = nav.offsetHeight;
        const maxX = window.innerWidth - navW - 5;
        const maxY = window.innerHeight - navH - 5;

        const newX = clamp(startLeft + dx, 5, maxX);
        const newY = clamp(startTop + dy, 5, maxY);

        applyPos(nav, newX, newY);
      },
      { passive: true },
    );

    function stopDrag() {
      if (!isDragging) return;
      isDragging = false;
      nav.classList.remove("dragging");
      document.body.style.userSelect = "";
      const x = parseInt(nav.style.left) || DEFAULT_X;
      const y = parseInt(nav.style.top) || DEFAULT_Y;
      savePos(x, y);
    }

    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchend", stopDrag);
  }

  function injectHandle(nav) {
    if (document.getElementById("nav-drag-handle")) return;
    const handle = document.createElement("div");
    handle.id = "nav-drag-handle";
    handle.innerHTML = "⠿ &nbsp; ⠿ &nbsp; ⠿";
    handle.title = "Arraste para mover o painel";
    nav.insertBefore(handle, nav.firstChild);
    return handle;
  }

  function init() {
    const nav = document.getElementById("game-navigation");
    if (!nav) {
      setTimeout(init, 300);
      return;
    }

    const pos = loadPos();
    applyPos(nav, pos.x, pos.y);

    const handle = injectHandle(nav);
    if (handle) {
      setupDrag(nav, handle);
    }

    const observer = new MutationObserver(function (mutations) {
      for (const m of mutations) {
        if (m.attributeName === "style") {
          const display = nav.style.display;
          if (display && display !== "none") {
            const savedPos = loadPos();
            if (
              !nav.style.left ||
              nav.style.left === "0px" ||
              nav.style.left === ""
            ) {
              applyPos(nav, savedPos.x, savedPos.y);
            }
          }
        }
      }
    });

    observer.observe(nav, { attributes: true, attributeFilter: ["style"] });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// Efeito de Faíscas para a Forja (Canvas API)
const canvas = document.createElement("canvas");
canvas.id = "forge-fx-canvas";
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "1";

const ctx = canvas.getContext("2d");
let particles = [];
let animationFrameId;

function resizeCanvas() {
  canvas.width = canvas.parentElement
    ? canvas.parentElement.clientWidth
    : window.innerWidth;
  canvas.height = canvas.parentElement
    ? canvas.parentElement.clientHeight
    : window.innerHeight;
}

class Spark {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = canvas.width / 2 + (Math.random() * 200 - 100);
    this.y = canvas.height - 50 + Math.random() * 50;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * -3 - 1;
    this.life = Math.random() * 100 + 50;
    this.opacity = 1;
    this.color = Math.random() > 0.5 ? "255, 150, 0" : "255, 80, 0";
  }

  update() {
    this.x += this.speedX + (Math.random() * 1 - 0.5);
    this.y += this.speedY;
    this.life -= 1;
    this.opacity = this.life / 150;
    if (this.size > 0.1) this.size -= 0.02;

    if (this.life <= 0 || this.opacity <= 0) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `rgba(${this.color}, 1)`;
    ctx.fill();
  }
}

function initForgeFX() {
  const forgeTab = document.getElementById("tab-forge");
  if (!forgeTab) return;

  // Anexa o canvas se ainda não estiver
  if (!document.getElementById("forge-fx-canvas")) {
    forgeTab.insertBefore(canvas, forgeTab.firstChild);
    window.addEventListener("resize", resizeCanvas);
  }

  resizeCanvas();
  particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push(new Spark());
  }

  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animateForgeFX();
}

function animateForgeFX() {
  const forgeTab = document.getElementById("tab-forge");
  if (!forgeTab || forgeTab.classList.contains("hidden")) {
    cancelAnimationFrame(animationFrameId);
    return; // Pause animation if tab is hidden
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fundo pulsante fraco de calor
  ctx.fillStyle = "rgba(255, 100, 0, 0.05)";
  ctx.fillRect(0, canvas.height - 200, canvas.width, 200);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }

  animationFrameId = requestAnimationFrame(animateForgeFX);
}

// Hook global para iniciar animação quando a aba é aberta
const originalSelectTab = window.selectTab;
if (originalSelectTab) {
  window.selectTab = function (tabId) {
    originalSelectTab(tabId);
    if (tabId === "tab-forge") {
      setTimeout(initForgeFX, 100);
    }
  };
} else {
  // Fallback caso selectTab não seja interceptável assim
  document.addEventListener("click", (e) => {
    if (
      e.target &&
      e.target.closest &&
      e.target.closest("[onclick=\"selectTab('tab-forge')\"]")
    ) {
      setTimeout(initForgeFX, 100);
    }
  });
}
