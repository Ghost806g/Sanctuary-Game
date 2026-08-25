/**
 * DonjonEngine.js
 * Responsável por gerar conteúdo processual (Nomes, Loot, Quests)
 * e gerenciar a exploração de mapas 2D gerados pelo Donjon.
 */

window.donjonData = {
  weaponAdjectives: [
    "Vingativo",
    "Sombrio",
    "Uivante",
    "Ancestral",
    "Amaldiçoado",
    "Esquecido",
    "Brilhante",
    "Profano",
    "Sanguinário",
    "Voraz",
  ],
  weaponNouns: [
    "Vazio",
    "Abismo",
    "Crepúsculo",
    "Rei Louco",
    "Dragão",
    "Lich",
    "Santuário",
    "Espectro",
    "Lamento",
    "Tártaro",
  ],

  quests: [
    "Caçar a fera que espreita nos pântanos.",
    "Recuperar o relicário roubado pelo culto do abismo.",
    "Limpar as catacumbas do vilarejo de mortos-vivos.",
    "Investigar o desaparecimento da caravana do leste.",
  ],

  currentDungeonGrid: null,
  playerX: 0,
  playerY: 0,
};

// ==========================================
// GERAÇÃO PROCEDURAL (NOMES E LOOT)
// ==========================================

window.generateDonjonWeaponName = function (baseName) {
  const adj =
    window.donjonData.weaponAdjectives[
      Math.floor(Math.random() * window.donjonData.weaponAdjectives.length)
    ];
  const noun =
    window.donjonData.weaponNouns[
      Math.floor(Math.random() * window.donjonData.weaponNouns.length)
    ];

  return `${baseName} ${adj} do ${noun}`;
};

window.getRandomDonjonQuest = function () {
  return window.donjonData.quests[
    Math.floor(Math.random() * window.donjonData.quests.length)
  ];
};

window.tryLoadDonjonData = function () {
  fetch("data/donjon_loot.json")
    .then((res) => res.json())
    .then((data) => {
      if (data.adjectives) window.donjonData.weaponAdjectives = data.adjectives;
      if (data.nouns) window.donjonData.weaponNouns = data.nouns;
      console.log("[DonjonEngine] Loot arrays expandidos via JSON.");
    })
    .catch((e) =>
      console.log("[DonjonEngine] Usando dicionário padrão de loot."),
    );

  fetch("data/donjon_quests.json")
    .then((res) => res.json())
    .then((data) => {
      if (data.quests) window.donjonData.quests = data.quests;
    })
    .catch((e) => console.log("[DonjonEngine] Usando quests padrão."));
};

// ==========================================
// EXPLORAÇÃO 2D GRID (MINI-MAPA)
// ==========================================

window.initDonjonGrid = function (gridSize = 10) {
  // Tenta carregar o arquivo JSON do Donjon
  fetch(encodeURI("data/Catacumbas Sombrias 01 (1).json"))
    .then((res) => res.json())
    .then((data) => {
      if (data && data.cells) {
        const cells = data.cells;
        const bit = data.cell_bit;
        let grid = [];
        let startX = -1;
        let startY = -1;

        for (let y = 0; y < cells.length; y++) {
          let row = [];
          for (let x = 0; x < cells[y].length; x++) {
            const val = cells[y][x];
            // Um bloco é andável se for sala (room) ou corredor (corridor) ou escada (stair)
            const isRoom = (val & bit.room) !== 0;
            const isCorridor = (val & bit.corridor) !== 0;
            const isStairUp = (val & bit.stair_up) !== 0;

            if (isRoom || isCorridor || isStairUp) {
              row.push(1); // 1 = Chão
              if (startX === -1) {
                startX = x;
                startY = y;
              }
              if (isStairUp) {
                // O jogador começa na escada de subida
                startX = x;
                startY = y;
              }
            } else {
              row.push(0); // 0 = Parede
            }
          }
          grid.push(row);
        }

        window.donjonData.currentDungeonGrid = grid;
        window.donjonData.playerX = startX !== -1 ? startX : 0;
        window.donjonData.playerY = startY !== -1 ? startY : 0;
        renderDonjonGrid();
        console.log("[DonjonEngine] Mapa carregado via JSON.");
      } else {
        generateFallbackGrid(gridSize);
      }
    })
    .catch((e) => {
      console.log(
        "[DonjonEngine] Falha ao carregar JSON da masmorra, usando fallback.",
        e,
      );
      generateFallbackGrid(gridSize);
    });
};

function generateFallbackGrid(gridSize) {
  let grid = [];
  for (let y = 0; y < gridSize; y++) {
    let row = [];
    for (let x = 0; x < gridSize; x++) {
      row.push(Math.random() > 0.3 ? 1 : 0);
    }
    grid.push(row);
  }
  grid[0][0] = 1;
  window.donjonData.currentDungeonGrid = grid;
  window.donjonData.playerX = 0;
  window.donjonData.playerY = 0;
  renderDonjonGrid();
}

window.renderDonjonGrid = function () {
  const container = document.getElementById("dungeon-grid-container");
  if (!container) return;

  const grid = window.donjonData.currentDungeonGrid;
  if (!grid) return;

  const size = grid.length;
  // Ajusta o CSS para suportar mapas imensos
  const isLargeMap = size > 20;
  const gap = isLargeMap ? "0px" : "1px";

  // Grid Ocupa o painel inteiro de forma responsiva sem scrollbars (Aspect Ratio 1)
  // O PNG gerado pelo Donjon é injetado como fundo para alinhar 1:1 com as salas do JSON
  let html = `<div style="display: grid; grid-template-columns: repeat(${size}, 1fr); gap: ${gap}; height: 68vh; max-width: 100%; aspect-ratio: 1; margin: 0 auto; background-image: url('data/Catacumbas Sombrias 01 (51 x 51).webp'); background-size: 100% 100%; box-shadow: 0 0 30px rgba(0,0,0,0.9); border: 2px solid #222;">`;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cellVal = grid[y][x];
      const isPlayer =
        x === window.donjonData.playerX && y === window.donjonData.playerY;

      // Tudo fica transparente para revelar o PNG perfeito, exceto o jogador
      let color = "transparent";
      let border = "none";

      if (isPlayer) color = "rgba(59, 130, 246, 0.8)"; // Jogador Brilhante (Azul)

      html += `<div 
                onclick="window.moveDonjonPlayer(${x}, ${y})"
                style="aspect-ratio: 1; background: ${color}; border: ${border}; cursor: ${cellVal === 0 ? "not-allowed" : "pointer"}; border-radius: ${isLargeMap ? "0px" : "4px"}; display:flex; justify-content:center; align-items:center; font-size: 0.8rem;"
            >
                ${isPlayer && !isLargeMap ? "🧙" : ""}
            </div>`;
    }
  }
  html += `</div>`;

  container.innerHTML = html;
};

window.moveDonjonPlayer = function (targetX, targetY) {
  const grid = window.donjonData.currentDungeonGrid;
  if (!grid) return;

  // Verifica se não é parede
  if (grid[targetY][targetX] === 0) {
    if (typeof triggerToast === "function") triggerToast("Caminho bloqueado!");
    return;
  }

  // Movimento ortogonal apenas (distância = 1)
  const dx = Math.abs(targetX - window.donjonData.playerX);
  const dy = Math.abs(targetY - window.donjonData.playerY);

  if (dx + dy === 1) {
    window.donjonData.playerX = targetX;
    window.donjonData.playerY = targetY;

    // Simular um passo na masmorra antiga
    if (typeof chooseDungeonPath === "function") {
      chooseDungeonPath("sala " + targetX + "-" + targetY);
    } else {
      console.log("Movido para", targetX, targetY);
    }

    renderDonjonGrid();
  } else {
    if (typeof triggerToast === "function")
      triggerToast("Você só pode se mover para salas adjacentes.");
  }
};

// Auto-init nas tabelas de dados
window.tryLoadDonjonData();

// Adiciona listener global para navegação por teclado no Donjon
window.addEventListener("keydown", function (e) {
  // Só responde se o grid de exploração estiver visível e ativo
  const crossroads = document.getElementById("dungeon-crossroads");
  if (!crossroads || crossroads.classList.contains("hidden")) return;

  // Se estiver em combate ou não tiver grid gerado, ignora
  if (typeof activeCombatInstance !== "undefined" && activeCombatInstance)
    return;
  if (!window.donjonData || !window.donjonData.currentDungeonGrid) return;

  let dx = 0;
  let dy = 0;

  if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") dy = -1;
  else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") dy = 1;
  else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") dx = -1;
  else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") dx = 1;

  if (dx !== 0 || dy !== 0) {
    e.preventDefault(); // Previne rolagem da tela
    const targetX = window.donjonData.playerX + dx;
    const targetY = window.donjonData.playerY + dy;
    window.moveDonjonPlayer(targetX, targetY);
  }
});
