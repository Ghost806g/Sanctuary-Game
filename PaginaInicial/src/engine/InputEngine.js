/**
 * SANCTUARY - Input Engine
 * Gerencia atalhos globais de teclado para navegação e combate (Restaurado do Dev Backup)
 */

document.addEventListener("keydown", (e) => {
  // Ignorar inputs se foco estiver em campos de texto
  if (
    ["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName.toUpperCase())
  ) {
    return;
  }

  const key = e.key.toLowerCase();
  const dungeonTab = document.getElementById("tab-dungeon");
  const inCombat =
    typeof activeCombatInstance !== "undefined" &&
    activeCombatInstance &&
    dungeonTab &&
    !dungeonTab.classList.contains("hidden");

  // 1. ATALHOS DE COMBATE (Quando monstro está vivo)
  if (inCombat) {
    if (key === "1") {
      e.preventDefault();
      if (typeof processCombatRound === "function")
        processCombatRound("ataque");
      return;
    }
    if (key === "2") {
      e.preventDefault();
      if (typeof drinkPotionFromCombat === "function")
        drinkPotionFromCombat("hp");
      return;
    }
    if (key === "3") {
      e.preventDefault();
      if (typeof drinkPotionFromCombat === "function")
        drinkPotionFromCombat("mp");
      return;
    }
    if (key === "4") {
      e.preventDefault();
      if (typeof retreatFromFight === "function") retreatFromFight();
      return;
    }

    // Magias dinâmicas (5, 6, 7, 8...) baseadas nas skills equipadas
    const hero = typeof getActiveHero === "function" ? getActiveHero() : null;
    if (
      hero &&
      hero.equippedSkills &&
      hero.equippedSkills.length > 0 &&
      typeof MASTER_SKILLS_DATA !== "undefined" &&
      MASTER_SKILLS_DATA[hero.class]
    ) {
      // Cria a lista de skills equipadas válidas (rank > 0) na mesma ordem da UI
      const validEquippedSkills = [];
      hero.equippedSkills.forEach((skillId) => {
        const sk = MASTER_SKILLS_DATA[hero.class].find((s) => s.id === skillId);
        if (sk && (hero.skills[sk.id] || 0) > 0) {
          validEquippedSkills.push(sk);
        }
      });

      const skillIndex = parseInt(key) - 5;
      if (skillIndex >= 0 && skillIndex < validEquippedSkills.length) {
        e.preventDefault();
        if (typeof castCombatSkill === "function")
          castCombatSkill(validEquippedSkills[skillIndex].id);
        return;
      }
    }
  }
  // 2. NAVEGAÇÃO DA MASMORRA (Quando NÃO está em combate)
  else if (dungeonTab && !dungeonTab.classList.contains("hidden")) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (typeof chooseDungeonPath === "function")
        chooseDungeonPath("esquerda");
      return;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (typeof chooseDungeonPath === "function") chooseDungeonPath("reto");
      return;
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (typeof chooseDungeonPath === "function") chooseDungeonPath("direita");
      return;
    }
  }

  // 3. ATALHOS GLOBAIS DE NAVEGAÇÃO (Abas)
  const navMap = {
    m: "tab-dungeon",
    q: "tab-quests",
    i: "tab-ficha",
    k: "tab-skills",
    c: "tab-companheiros",
    f: "tab-forge",
  };
  if (navMap[key] && typeof window.navigate === "function") {
    window.navigate(navMap[key]);
    return;
  }

  // 4. EASTER EGG (O Abismo)
  window.inputBuffer = (window.inputBuffer || "") + key;
  if (window.inputBuffer.length > 10) {
    window.inputBuffer = window.inputBuffer.substring(
      window.inputBuffer.length - 6,
    );
  }
  if (window.inputBuffer.includes("abismo")) {
    window.inputBuffer = "";
    if (typeof playClick === "function") playClick();
    alert("👁️ O Abismo ouviu seu chamado... Algo se moveu na escuridão.");
  }
});

// 5. ATALHO GLOBAL DE FULLSCREEN E GOD MODE
window.isFs = true; // Default do Tauri
window.addEventListener("keydown", async function (e) {
  if (e.altKey && e.key === "Enter") {
    e.preventDefault();
    window.isFs = !window.isFs;
    try {
      const invoke = window.__TAURI__?.core?.invoke;
      if (invoke) {
        await invoke("set_fullscreen", { state: window.isFs });
      }
    } catch (err) {
      console.error("Tauri fullscreen fail:", err);
    }
  }

  // GOD MODE
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "g") {
    e.preventDefault();
    const hero = typeof getActiveHero === "function" ? getActiveHero() : null;
    if (!hero) {
      return alert(
        "Você precisa estar com um personagem carregado para usar os comandos divinos.",
      );
    }

    const password = prompt("Console Divino. Insira a palavra de poder:");
    if (password !== "IgorGod") {
      if (password !== null)
        alert("Acesso negado. Os deuses rejeitam sua oferta.");
      return;
    }

    if (hero.isGodMode) {
      if (hero.godModeBackup) {
        const backup = JSON.parse(hero.godModeBackup);
        Object.assign(hero, backup);
        delete hero.godModeBackup;
        hero.isGodMode = false;
        if (typeof commitStorage === "function") commitStorage();
        if (typeof renderAllEngines === "function") renderAllEngines();
        alert("Os poderes divinos se esvaem. Você volta a ser um mero mortal.");
      }
    } else {
      hero.godModeBackup = JSON.stringify(hero);
      hero.isGodMode = true;
      hero.level = 99;
      hero.gold += 999999;
      hero.currentHp = 99999;
      Object.keys(hero.attributes).forEach((k) => (hero.attributes[k] = 999));
      Object.keys(hero.materials || {}).forEach(
        (k) => (hero.materials[k] = 999),
      );
      if (typeof commitStorage === "function") commitStorage();
      if (typeof renderAllEngines === "function") renderAllEngines();
      alert("Aura Dourada envolve seu corpo. Modo Divino Ativado.");
    }
  }
});
