/**
 * sidebarDrag.js — Sidebar Arrastável do Sanctuary
 * Torna o #game-navigation um painel flutuante arrastável.
 * Posição salva no localStorage.
 * Zero dependências externas.
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
    // Remover sticky/right para garantir que position:fixed funcione limpo
    nav.style.right = "auto";
    nav.style.bottom = "auto";
  }

  function setupDrag(nav, handle) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    handle.addEventListener("mousedown", function (e) {
      e.preventDefault();
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(nav.style.left) || DEFAULT_X;
      startTop = parseInt(nav.style.top) || DEFAULT_Y;
      nav.classList.add("dragging");
      document.body.style.userSelect = "none";
    });

    // Touch support
    handle.addEventListener(
      "touchstart",
      function (e) {
        const touch = e.touches[0];
        isDragging = true;
        startX = touch.clientX;
        startY = touch.clientY;
        startLeft = parseInt(nav.style.left) || DEFAULT_X;
        startTop = parseInt(nav.style.top) || DEFAULT_Y;
        nav.classList.add("dragging");
      },
      { passive: true },
    );

    document.addEventListener("mousemove", function (e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

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
    // Evita duplicar se já existe
    if (document.getElementById("nav-drag-handle")) return;

    const handle = document.createElement("div");
    handle.id = "nav-drag-handle";
    handle.innerHTML = "⠿ &nbsp; ⠿ &nbsp; ⠿";
    handle.title = "Arraste para mover o painel";

    // Inserir como primeiro filho do aside
    nav.insertBefore(handle, nav.firstChild);

    return handle;
  }

  function init() {
    const nav = document.getElementById("game-navigation");
    if (!nav) {
      // Tentar novamente — pode ser que o DOM ainda não carregou o aside
      setTimeout(init, 300);
      return;
    }

    // Restaurar posição salva
    const pos = loadPos();
    applyPos(nav, pos.x, pos.y);

    // Injetar o cabo de arrasto
    const handle = injectHandle(nav);
    if (handle) {
      setupDrag(nav, handle);
    }

    // Observer para quando o nav fica visível (JS seta display:flex)
    // Garantir que a posição é reaplicada
    const observer = new MutationObserver(function (mutations) {
      for (const m of mutations) {
        if (m.attributeName === "style") {
          const display = nav.style.display;
          if (display && display !== "none") {
            // Reaplicar posição (o JS de jogo pode resetar o style)
            const savedPos = loadPos();
            // Só reaplicar se left não estiver setado ainda
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

  // Inicializar quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
