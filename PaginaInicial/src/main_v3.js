// =========================================================================
// SISTEMA DE TRATAMENTO GLOBAL DE ERROS
// =========================================================================
window.addEventListener("error", function (e) {
  console.error("Global Error Caught:", e.error);
  if (typeof triggerToast === "function") {
    triggerToast(`⚠️ Erro Fatal: ${e.message}`, "error");
  }
});

window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled Promise Rejection:", e.reason);
  if (typeof triggerToast === "function") {
    triggerToast(`⚠️ Falha no Vazio: ${e.reason?.message || e.reason}`, "error");
  }
});

// =========================================================================
// SISTEMA DE TRATAMENTO GLOBAL DE ERROS
// =========================================================================
window.addEventListener("error", function (e) {
  console.error("Global Error Caught:", e.error);
  if (typeof triggerToast === "function") {
    triggerToast(`⚠️ Erro Fatal: ${e.message}`, "error");
  }
});

window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled Promise Rejection:", e.reason);
  if (typeof triggerToast === "function") {
    triggerToast(`⚠️ Falha no Vazio: ${e.reason?.message || e.reason}`, "error");
  }
});

// =========================================================================
// BANCO DE DADOS E VARIÁVEIS GLOBAIS DE JOGO
// =========================================================================
const DATABASE_KEY_V5 = "SANCTUARY_APEX_V5";

// ===== Constantes de IDs e classes CSS reutilizados =====
const MV_CLASS_APPLY_SHAKE = "apply-shake";
const MV_ID_ENEMY_CARD = "enemy-viewport-card";
const MV_ID_ENEMY_NAME = "enemy-display-name";
const MV_ID_ENEMY_IMG = "enemy-display-image";
const MV_CLASS_AVATAR_HIT = "avatar-hit";
const MV_ID_CREATION = "creation-chamber";
const MV_ID_HERO_INPUT = "input-hero-name";
const MV_ID_FAST_TRAVEL = "fast-travel-modal";
const MV_ID_DEATH_OVERLAY = "death-overlay";
const MV_ID_GOD_SEAL = "god-mode-seal";
const MV_CLASS_FLASH = "flash";
const MV_CLASS_CRITICAL_HP = "critical-hp";
const MV_CLASS_VALID_DROP = "valid-drop-target";
const MV_CLASS_DRAG_HOVER = "drag-hover";
const MV_TAB_DUNGEON = "tab-dungeon";
const MV_TAB_FICHA = "tab-ficha";
const MV_TAB_SKILLS = "tab-skills";
const MV_TAB_CONQUISTAS = "tab-conquistas";

let appState = {
  activeSlotIndex: 0,
  slots: [null, null, null],
};

window.activeCombatInstance = null;
window.heroCombatState = { statuses: [] }; // Guarda status temporários no combate

// =========================================================================
// MATERIAIS DE FORJA E CRAFTING
// =========================================================================
// Matriz Expandida de 18 Materiais de Forja e Mineração

// =========================================================================
// SISTEMA DE CRIAÇÃO E INICIALIZAÇÃO DE HERÓIS
// =========================================================================
function createFreshHero(name, cls, race, profession) {
  const baseAttrs = {
    forca: 10,
    constituicao: 10,
    agilidade: 10,
    inteligencia: 10,
    sabedoria: 10,
  };

  if (cls === "Bárbaro") {
    cls = "Barbaro";
  }

  // Bônus de Classe
  if (cls === "Guerreiro") {
    baseAttrs.forca = 15;
    baseAttrs.constituicao = 13;
  } else if (cls === "Arcanista") {
    baseAttrs.inteligencia = 16;
    baseAttrs.sabedoria = 12;
  } else if (cls === "Ranger") {
    baseAttrs.agilidade = 16;
    baseAttrs.sabedoria = 12;
  } else if (cls === "Barbaro") {
    baseAttrs.forca = 17;
    baseAttrs.constituicao = 12;
  } else if (cls === "Paladino") {
    baseAttrs.constituicao = 14;
    baseAttrs.sabedoria = 14;
  } else if (cls === "Necromante") {
    baseAttrs.inteligencia = 15;
    baseAttrs.sabedoria = 13;
  }

  // Bônus de Raça
  if (race === "Humano") {
    baseAttrs.forca += 1;
    baseAttrs.constituicao += 1;
    baseAttrs.agilidade += 1;
    baseAttrs.inteligencia += 1;
    baseAttrs.sabedoria += 1;
  } else if (race === "Elfo Sombrio") {
    baseAttrs.agilidade += 3;
    baseAttrs.inteligencia += 2;
  } else if (race === "Anão da Forja") {
    baseAttrs.constituicao += 3;
    baseAttrs.forca += 2;
  } else if (race === "Orc Decaído") {
    baseAttrs.constituicao += 5;
    baseAttrs.forca += 1;
    baseAttrs.inteligencia -= 1;
  }

  // Bônus de Profissão (30 Profissões Especializadas)
  const profBonuses = {
    // Guerreiro
    "Ferreiro de Guerra": { forca: 2, constituicao: 2 },
    "Mercenário de Fossa": { forca: 2, agilidade: 2 },
    "Mestre de Armas": { forca: 2, sabedoria: 2 },
    "Vanguarda Sangrenta": { constituicao: 4 },
    "Cavaleiro Caído": { forca: 2, inteligencia: 2 },
    // Arcanista
    "Erudito do Vazio": { inteligencia: 2, sabedoria: 2 },
    "Alquimista Louco": { inteligencia: 2, constituicao: 2 },
    "Tecelão do Caos": { inteligencia: 2, agilidade: 2 },
    "Arquivista da Ruína": { sabedoria: 4 },
    "Invocador de Cinzas": { inteligencia: 2, forca: 2 },
    // Ranger
    "Caçador de Cabeças": { agilidade: 2, forca: 2 },
    "Batedor das Sombras": { agilidade: 4 },
    "Mestre das Feras": { agilidade: 2, constituicao: 2 },
    "Franco-Atirador Arcano": { agilidade: 2, inteligencia: 2 },
    "Sobrevivente do Ermo": { agilidade: 2, sabedoria: 2 },
    // Barbaro
    "Executor Bestial": { forca: 4 },
    "Devorador de Carniças": { constituicao: 4 },
    "Gladiador Esquecido": { forca: 2, agilidade: 2 },
    "Xamã de Sangue": { constituicao: 2, sabedoria: 2 },
    "Quebrador de Crânios": { forca: 2, constituicao: 2 },
    // Paladino
    "Inquisidor do Sol": { sabedoria: 2, forca: 2 },
    "Clérigo de Batalha": { sabedoria: 4 },
    "Guardião do Juramento": { sabedoria: 2, constituicao: 2 },
    "Templário de Prata": { sabedoria: 2, agilidade: 2 },
    "Exorcista Cego": { sabedoria: 2, inteligencia: 2 },
    // Necromante
    "Mestre de Ossos": { inteligencia: 2, forca: 2 },
    "Sacerdote da Morte": { inteligencia: 2, sabedoria: 2 },
    "Colhedor de Almas": { inteligencia: 2, forca: 2 },
    "Coveiro Maldito": { inteligencia: 2, constituicao: 2 },
    "Ocultista Sombrio": { inteligencia: 4 },
  };

  const profBonus = profBonuses[profession];
  if (profBonus) {
    if (profBonus.forca) baseAttrs.forca += profBonus.forca;
    if (profBonus.agilidade) baseAttrs.agilidade += profBonus.agilidade;
    if (profBonus.inteligencia)
      baseAttrs.inteligencia += profBonus.inteligencia;
    if (profBonus.constituicao)
      baseAttrs.constituicao += profBonus.constituicao;
    if (profBonus.sabedoria) baseAttrs.sabedoria += profBonus.sabedoria;
    if (profBonus.sorte) baseAttrs.sorte += profBonus.sorte;
  }

  const mats = {};
  ALL_MATERIALS.forEach((m) => (mats[m.id] = 0));
  mats.ferro = 6;
  mats.couro = 4; // Start Setup

  const skillTree = {};
  MASTER_SKILLS_DATA[cls].forEach((s) => (skillTree[s.id] = 0));
  skillTree[MASTER_SKILLS_DATA[cls][0].id] = 1;

  return {
    name: name,
    class: cls,
    race: race || "Desconhecido",
    profession: profession || "Nenhuma",
    skills: skillTree,
    level: 1,
    xp: 0,
    maxXp: 120,
    gold: 200,
    stamina: 100,
    statPoints: 5,
    skillPoints: 2,
    dungeonLevel: 1,
    currentHp: 150 + baseAttrs.constituicao * 5, // HP Bônus por CON
    currentMana: 100 + baseAttrs.inteligencia * 5, // MP Bônus por INT
    furia: 0, // Foco / Ultimate
    attributes: baseAttrs,
    materials: mats,
    inBossRestArea: false,
    pantheon: {},
    bestiary: {},
    loreChapters: {},
    floorExploration: 0,
    floorProgress: 0,
    maxDungeonLevel: 1,
    lastBonfireLevel: 1,
    equipment: {
      arma: null,
      capacete: null,
      armadura: null,
      luvas: null,
      botas: null,
      escudo: null,
      anel1: null,
      anel2: null,
      colar1: null,
      colar2: null,
    },
    inventory: [
      {
        id: "init_w",
        name: "Lâmina Enferrujada",
        type: "arma",
        damage: 8,
        power: 8,
        defense: 0,
        durability: 45,
        maxDurability: 100,
        rarity: "Normal",
        desc: "Uma lâmina velha e cheia de ferrugem.",
        intrinsic: null,
      },
      {
        id: "init_p1",
        name: "Elixir de Vida",
        type: "consumivel_hp",
        power: 150,
        rarity: "Normal",
        desc: "Restaura vasto HP.",
      },
    ],
    companions: [
      {
        id: "c_init",
        name: "Lyra, a Silenciosa",
        desc: "Aumenta Chance Crítica.",
        affinity: 10,
        equipped: false,
        passiveId: "cp_crit",
        avatar: "assets/images/lyra.webp",
      },
    ],
    quests: [],
  };
}

function getActiveHero() {
  return appState.slots[appState.activeSlotIndex];
}

async function commitStorage() {
  const hero = getActiveHero();
  if (!hero) return;

  // === SEMPRE salva no localStorage (para navegação Lore ↔ Jogo) ===
  try {
    localStorage.setItem("SANCTUARY_APEX_V5", JSON.stringify(appState));
  } catch (e) {
    console.warn("Falha ao salvar no localStorage:", e);
  }

  // === Salva no SQLite se tiver ID associado ===
  if (!window.mysqlHeroId) return;
  try {
    if (!window.dbService) return;
    await window.dbService.saveHero({
      id: window.mysqlHeroId,
      name: hero.name,
      class: hero.class,
      race: hero.race,
      level: hero.level || 1,
      experience: hero.exp || 0,
      gold: hero.gold || 0,
      save_data: hero,
      current_hp: hero.hp,
      current_mana: hero.mana
    });
  } catch (e) {
    console.error("Falha ao sincronizar com o banco de dados:", e);
  }
}

async function initializeEngine() {
  // Limpa o estado atual
  appState.slots = [null];
  appState.activeSlotIndex = 0;

  // === AUTO-LOAD DO RITUAL DO MENU ===
  const pendingRitual = localStorage.getItem("SANCTUARY_RITUAL_PENDING");
  console.log("[INIT] pendingRitual=", pendingRitual);
  if (pendingRitual) {
    try {
      const ritualData = JSON.parse(pendingRitual);
      console.log("[INIT] parsed ritualData=", ritualData);
      if (ritualData.name && ritualData.class) {
        const newHero = createFreshHero(
          ritualData.name,
          ritualData.class,
          ritualData.race,
          ritualData.profession,
        );
        appState.slots[0] = newHero;

        // Dispara o POST pra salvar no SQLite
        let insertId = null;
        if (window.dbService) {
          insertId = await window.dbService.saveHero({
            name: newHero.name,
            class: newHero.class,
            race: newHero.race,
            level: newHero.level || 1,
            save_data: newHero,
          });
        }
        window.mysqlHeroId = insertId;

        localStorage.removeItem("SANCTUARY_RITUAL_PENDING");
        localStorage.setItem("SANCTUARY_APEX_V5", JSON.stringify(appState));
        
        // Removemos o return; para não abortar a inicialização do engine.
        // E redirecionamos para a Ficha após a inicialização.
        setTimeout(() => {
          navigate(MV_TAB_FICHA);
          if (typeof triggerToast === 'function') {
            triggerToast(`O mundo sangra novamente, seja bem-vindo ${ritualData.name}.`);
          }
        }, 100);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // === CARREGAR HERÓI DO BANCO DE DADOS ===
  const loadHeroId = sessionStorage.getItem("SANCTUARY_LOAD_HERO_ID");
  if (loadHeroId) {
    try {
      let heroes = [];
      if (window.dbService) {
        heroes = await window.dbService.getHeroes();
      }
      const target = heroes.find((h) => h.id == loadHeroId);
      if (target) {
        if (target.save_data) {
          appState.slots[0] = target.save_data;
        } else {
          // Fallback se o save_data for null no banco
          appState.slots[0] = createFreshHero(
            target.name,
            target.class,
            target.race,
            "Nenhuma",
          );
        }
        window.mysqlHeroId = target.id;
        localStorage.setItem("SANCTUARY_APEX_V5", JSON.stringify(appState));
        // Remove o ID da sessão pra não travar num reload aleatório
        sessionStorage.removeItem("SANCTUARY_LOAD_HERO_ID");
      }
    } catch (e) {
      console.error("Erro ao carregar herói do banco:", e);
      window.lastDbError = String(e);
    }
  }

  // === FALLBACK: CARREGAR DO MySQL/LOCALSTORAGE (ex: voltando da Lore) ===
  if (!appState.slots[0]) {
    // Prioridade 1: Carregar o herói mais recente do MySQL (tem o save mais atualizado)
    try {
      let heroes = [];
      if (window.dbService) {
        heroes = await window.dbService.getHeroes();
      }
      if (heroes && heroes.length > 0) {
        const latest = heroes[0]; // ORDER BY id DESC, então o primeiro é o mais recente
        if (latest.save_data) {
          appState.slots[0] = latest.save_data;
        } else {
          appState.slots[0] = createFreshHero(
            latest.name,
            latest.class,
            latest.race,
            "Nenhuma",
          );
        }
        window.mysqlHeroId = latest.id;
        console.log("[INIT] Herói carregado do MySQL (fallback):", latest.name);
      }
    } catch (dbErr) {
      console.warn("Falha ao carregar do MySQL no fallback:", dbErr);
    }

    // Prioridade 2: Carregar do localStorage (caso MySQL falhe)
    if (!appState.slots[0]) {
      try {
        const savedData = localStorage.getItem("SANCTUARY_APEX_V5");
        if (savedData) {
          let parsed = JSON.parse(savedData);
          if (parsed.appState) parsed = parsed.appState;
          if (parsed && Array.isArray(parsed.slots)) {
            const idx =
              typeof parsed.activeSlotIndex === "number"
                ? parsed.activeSlotIndex
                : 0;
            const hero = parsed.slots[idx];
            if (hero && hero.name) {
              appState.slots = parsed.slots;
              appState.activeSlotIndex = idx;
              console.log(
                "[INIT] Herói carregado do localStorage (fallback):",
                hero.name,
              );
            }
          }
        }
      } catch (e) {
        console.error("Erro ao carregar do localStorage:", e);
      }
    }
  }

  // Se nada carregar, redireciona para o Menu
  if (!appState.slots[0]) {
    alert(
      `Falha ao carregar herói. loadHeroId: ${loadHeroId}, error: ${window.lastDbError}`,
    );
    window.location.href = "MenuPrincipal.html";
    return;
  }

  // Corrige ou adiciona arrays que possam faltar em saves antigos (Patch v5.0)
  appState.slots.forEach((hero) => {
    if (hero) {
      if (!hero.materials) {
        hero.materials = {};
      }
      ALL_MATERIALS.forEach((m) => {
        if (hero.materials[m.id] === undefined) {
          hero.materials[m.id] = 0;
        }
      });
      if (!hero.skills) {
        hero.skills = {};
      }
      if (!hero.quests) {
        hero.quests = [];
      }
      if (!hero.companions) {
        hero.companions = [];
      }
      if (hero.inBossRestArea === undefined) {
        hero.inBossRestArea = false;
      }
      if (!hero.pantheon) {
        hero.pantheon = {};
      }
      if (!hero.bestiary) {
        hero.bestiary = {};
      }
      if (!hero.loreChapters) {
        hero.loreChapters = {};
      }

      // COLOQUE ESTAS TRÊS LINHAS AQUI PARA SALVAR OS PERSONAGENS ANTIGOS:
      if (hero.lastBonfireLevel === undefined) {
        hero.lastBonfireLevel = hero.dungeonLevel || 1;
      }
      if (hero.floorExploration === undefined) {
        hero.floorExploration = 0;
      }
      if (hero.floorProgress === undefined) {
        hero.floorProgress = 0;
      }
      // Garante que todos os skills da classe existam (retrocompatibilidade)
      const className = hero.class === "Bárbaro" ? "Barbaro" : hero.class;
      if (className && MASTER_SKILLS_DATA[className]) {
        MASTER_SKILLS_DATA[className].forEach((s) => {
          if (hero.skills[s.id] === undefined) {
            hero.skills[s.id] = 0;
          }
        });
      }
    }
  });
  if (typeof loadUnlockedFusions === "function") {
    appState.slots.forEach((h) => {
      if (h) loadUnlockedFusions(h);
    });
  }
  generateGlobalMarket(); // Inicializa o mercado global ao carregar
  renderAllEngines();

  if (getActiveHero()) {
    setTimeout(() => navigate(MV_TAB_FICHA), 50);
  } else {
    setTimeout(() => navigate("tab-saves"), 50);
  }
}

// =========================================================================
//  CÁLCULO MATEMÁTICO REAL DO ENGINE RPG
// =========================================================================
function _calcEquipStats(hero, passives) {
  let gearAtk = 0;
  let gearDef = 0;
  const setCounts = {};

  Object.values(hero.equipment).forEach((item) => {
    if (!item) {
      return;
    }
    if (item.set) {
      setCounts[item.set] = (setCounts[item.set] || 0) + 1;
    }
    let itemAtk = item.damage || item.power || 0;
    let itemDef = item.defense || item.power || 0;

    if (typeof HeroTraits !== "undefined") {
      const mods = HeroTraits.getEquipStatsMod(hero, item, itemAtk, itemDef);
      itemAtk = mods.atk;
      itemDef = mods.def;
    }

    if (
      ["arma", "anel1", "anel2", "colar1", "colar2"].some(
        (k) => hero.equipment[k] === item,
      )
    ) {
      gearAtk += itemAtk;
    } else {
      gearDef += itemDef;
    }

    if (item.intrinsic && passives[item.intrinsic.type] !== undefined) {
      passives[item.intrinsic.type] += item.intrinsic.value;
    }

    if (item.sockets) {
      item.sockets.forEach((rune) => {
        if (rune && rune.effect) {
          if (rune.effect.critChance) {
            passives.critChance += rune.effect.critChance;
          }
          if (rune.effect.lifeSteal) {
            passives.lifeSteal += rune.effect.lifeSteal;
          }
          if (rune.effect.defMult) {
            gearDef = Math.floor(gearDef * (1 + rune.effect.defMult));
          }
          if (rune.effect.defMult) {
            passives.defMult += rune.effect.defMult;
          }
          if (rune.effect.damageReduction) {
            passives.damageReduction += rune.effect.damageReduction;
          }
          if (rune.effect.poisonChance) {
            passives.poisonChance += rune.effect.poisonChance;
          }
          if (rune.effect.shockChance) {
            passives.shockChance += rune.effect.shockChance;
          }
          if (rune.effect.evasion) {
            passives.evasion += rune.effect.evasion;
          }
          if (rune.effect.staggerBonus) {
            passives.staggerBonus += rune.effect.staggerBonus;
          }
          if (rune.effect.freezeChance) {
            passives.freezeChance += rune.effect.freezeChance;
          }
          if (rune.effect.burn) {
            passives.burnPower += rune.effect.burn.power;
            passives.burnDuration = Math.max(
              passives.burnDuration,
              rune.effect.burn.duration,
            );
          }
        }
      });
    }
  });

  passives.epicPassives = passives.epicPassives || [];
  
  if (typeof window !== "undefined") {
     const allSets = [];
     if (window.BOSS_SETS) allSets.push(...Object.values(window.BOSS_SETS));
     if (window.ELITE_SETS) allSets.push(...Object.values(window.ELITE_SETS));

     Object.keys(setCounts).forEach(setName => {
        const count = setCounts[setName];
        const setDef = allSets.find(s => s.setName === setName);
        if (setDef) {
           setDef.passives.forEach(p => {
              if (count >= p.req) {
                 if (p.type.startsWith("epic_")) {
                    if (!passives.epicPassives.includes(p.type)) {
                        passives.epicPassives.push(p.type);
                    }
                 } else {
                    if (passives[p.type] === undefined) passives[p.type] = 0;
                    passives[p.type] += p.value;
                 }
              }
           });
        }
     });
  }

  return { gearAtk, gearDef };
}

function _calcCompanionStats(hero, passives, gearAtk, gearDef) {
  const equippedComps = hero.companions.filter((c) => c.equipped);
  equippedComps.forEach((comp) => {
    const cp = COMPANION_PASSIVES.find((p) => p.id === comp.passiveId);
    if (cp && cp.buff) {
      if (cp.buff.critChance) {
        passives.critChance += cp.buff.critChance;
      }
      if (cp.buff.dmgMult) {
        gearAtk = Math.floor(gearAtk * (1 + cp.buff.dmgMult));
      }
      if (cp.buff.defMult) {
        gearDef = Math.floor(gearDef * (1 + cp.buff.defMult));
        passives.defMult += cp.buff.defMult;
      }
    }
  });
  return { gearAtk, gearDef };
}

function _calcPantheonStats(hero, passives) {
  const p = {
    pantheonDmgMult: 0,
    pantheonDefMult: 0,
    pantheonMaxMp: 0,
    pantheonGoldFind: 0,
  };
  if (hero.pantheon) {
    if (hero.pantheon.god_war) {
      p.pantheonDmgMult = hero.pantheon.god_war * 0.02;
    }
    if (hero.pantheon.god_shield) {
      p.pantheonDefMult = hero.pantheon.god_shield * 0.03;
    }
    if (hero.pantheon.god_vampire) {
      passives.lifeSteal += hero.pantheon.god_vampire * 0.03;
    }
    if (hero.pantheon.god_eye) {
      passives.critChance += hero.pantheon.god_eye * 0.01;
    }
    if (hero.pantheon.god_greed) {
      p.pantheonGoldFind = hero.pantheon.god_greed * 0.05;
    }
    if (hero.pantheon.god_arcane) {
      p.pantheonMaxMp = hero.pantheon.god_arcane * 15;
    }
  }
  return p;
}

function _calcRelicStats(hero) {
  const r = { relicHp: 0, relicMp: 0, relicAtk: 0, relicDef: 0 };
  hero.inventory.forEach((item) => {
    if (item.type === "relic" && item.relicBonus) {
      if (item.relicBonus.hp) {
        r.relicHp += item.relicBonus.hp;
      }
      if (item.relicBonus.mp) {
        r.relicMp += item.relicBonus.mp;
      }
      if (item.relicBonus.atk) {
        r.relicAtk += item.relicBonus.atk;
      }
      if (item.relicBonus.def) {
        r.relicDef += item.relicBonus.def;
      }
    }
  });
  return r;
}

function computeLiveStats() {
  const hero = getActiveHero();
  if (!hero) {
    return null;
  }

  const passives = {
    critChance: 0.05,
    critDamage: 1.5,
    lifeSteal: 0,
    ignoreDef: 0,
    reflectDmg: 0,
    damageReduction: 0,
    magicResist: 0,
    defMult: 0,
    bestiaryDmg: 0,
    poisonChance: 0,
    shockChance: 0,
    evasion: 0,
    staggerBonus: 0,
    freezeChance: 0,
    burnPower: 0,
    burnDuration: 0,
    statusResist: 0,
    healPower: 1.0,
    thorns: 0,
  };

  const equipStats = _calcEquipStats(hero, passives);
  const compStats = _calcCompanionStats(
    hero,
    passives,
    equipStats.gearAtk,
    equipStats.gearDef,
  );
  const pStats = _calcPantheonStats(hero, passives);
  const rStats = _calcRelicStats(hero);

  // === INNATE CLASS PASSIVES ===
  const lvlScale = Math.floor((hero.level || 1) / 3);
  if (hero.class === "Guerreiro") {
    passives.damageReduction += 0.05 + (lvlScale * 0.01); // Postura de Ferro: 5% DR + 1% a cada 3 nvs
  } else if (hero.class === "Ranger") {
    passives.evasion += 0.10 + (lvlScale * 0.01); // Passos Leves: +10% Evasão + 1% a cada 3 nvs
  } else if (hero.class === "Arcanista") {
    passives.ignoreDef += 0.15 + (lvlScale * 0.015); // Sobrecarga Arcana: 15% Armor Pen + 1.5% a cada 3 nvs
  } else if (["Necromante"].includes(hero.class)) {
    passives.lifeSteal += 0.10 + (lvlScale * 0.01); // Devorador de Vida: 10% Lifesteal + 1% a cada 3 nvs
  } else if (hero.class === "Paladino") {
    passives.statusResist += 0.10 + (lvlScale * 0.02); // Pureza: 10% Resistência a Status + 2% a cada 3 nvs
    passives.healPower += (lvlScale * 0.02); // Amplifica a cura
  }
  
  let barbDmgMult = 1;
  if (["Bárbaro", "Barbaro"].includes(hero.class)) {
    // Fúria Cega: +1% Crítico e +1% Dano a cada 5% de HP perdido
    let maxHp = Math.floor(hero.attributes.constituicao * 15 + 50 + rStats.relicHp);
    let missingHpPercent = 1 - (hero.currentHp / maxHp);
    if (missingHpPercent < 0) missingHpPercent = 0;
    
    let bonusStacks = Math.floor(missingHpPercent / 0.05); // a cada 5%
    passives.critChance += bonusStacks * 0.01;
    barbDmgMult = 1 + (bonusStacks * 0.01);
  }

  let rawAttackScaling = 0;
  const cls = hero.class;
  const levelMult = Math.sqrt(hero.level || 1); // Escala não-linear pelo nível
  
  if (["Guerreiro"].includes(cls)) {
    rawAttackScaling = (hero.attributes.forca * 1.2) * levelMult;
  } else if (["Bárbaro", "Barbaro"].includes(cls)) {
    rawAttackScaling = (hero.attributes.forca * 1.2) * levelMult * barbDmgMult;
  } else if (["Arcanista", "Necromante"].includes(cls)) {
    rawAttackScaling = (hero.attributes.inteligencia * 1.2) * levelMult;
  } else if (["Ranger"].includes(cls)) {
    rawAttackScaling = (hero.attributes.agilidade * 1.2) * levelMult;
  } else if (["Paladino"].includes(cls)) {
    rawAttackScaling = (hero.attributes.sabedoria * 1.2) * levelMult;
  } else {
    rawAttackScaling = (hero.attributes.sabedoria * 1.2) * levelMult;
  }

  let necroSacrificeAtk = 0;
  let necroSacrificeMp = 0;
  let necroSacrificeDef = 0;

  if (cls === "Necromante" && hero.necromancyBook) {
     if (hero.necromancyBook.guerreiro === 2) necroSacrificeAtk = 15;
     if (hero.necromancyBook.mago === 2) necroSacrificeMp = 30;
     if (hero.necromancyBook.guardiao === 2) necroSacrificeDef = 20;
  }

  let finalDef = (hero.attributes.constituicao * 0.5 +
    compStats.gearDef +
    rStats.relicDef +
    necroSacrificeDef) *
    (1 + pStats.pantheonDefMult);

  if (typeof HeroTraits !== "undefined") {
    finalDef = HeroTraits.getDefenseMod(hero, finalDef);
    // Convertendo Evasão (0-100) para multiplicador 0-1
    let traitEv = HeroTraits.getEvasionMod(hero, passives.evasion * 100);
    passives.evasion = traitEv / 100;
  }

  return {
    maxHp: Math.floor(hero.attributes.constituicao * 15 + 50 + rStats.relicHp),
    maxMp: Math.floor(
      hero.attributes.inteligencia * 10 +
        20 +
        pStats.pantheonMaxMp +
        rStats.relicMp +
        necroSacrificeMp
    ),
    maxStamina: Math.floor(100 + hero.attributes.constituicao * 3),
    attack: Math.floor(
      (rawAttackScaling + compStats.gearAtk + rStats.relicAtk + necroSacrificeAtk) *
        (1 + pStats.pantheonDmgMult),
    ),
    defense: Math.floor(finalDef),
    passives: passives,
  };
}


function applyDamageToHero(dmg, type = "physical") {
  const hero = getActiveHero();
  const calc = computeLiveStats();
  let finalDmg = dmg;

  // Redução Proporcional pela Defesa (Padrão AAA)
  // Fórmula: Dano = Dano * (Constante / (Constante + Defesa))
  // Retornos decrescentes: previne imunidade e previne hit-kill absurdo.
  const defenseConstant = 100;
  finalDmg = Math.max(
    1,
    Math.floor(finalDmg * (defenseConstant / (defenseConstant + calc.defense))),
  );

  // Passivas de Defesa
  if (type === "physical") {
    finalDmg = Math.floor(finalDmg * (1 - calc.passives.damageReduction));
  } else {
    finalDmg = Math.floor(finalDmg * (1 - calc.passives.magicResist));
  }

  // Reflexão
  if (calc.passives.reflectDmg > 0) {
    const reflected = Math.floor(finalDmg * calc.passives.reflectDmg);
    if (activeCombatInstance) {
      activeCombatInstance.hp -= reflected;
      appendTerminalLog(
        `🔄 Reflexão punitiva devolveu ${reflected} de dano!`,
        "status",
      );
    }
    triggerToast(`🔄 Reflexão: ${reflected} dano!`);
  }

  // Aplica dano final
  hero.currentHp = Math.max(0, hero.currentHp - finalDmg);
}

// =========================================================================
//  FEEDBACKS, TRANSIÇÕES E JUICE UI GLOBAIS
// =========================================================================
function triggerToast(msg, type) {
  const carrier = document.getElementById("toast-carrier");
  const box = document.createElement("div");
  box.className = "toast-box";
  box.innerHTML = msg;
  carrier.appendChild(box);
  setTimeout(() => {
    box.remove();
  }, 3500);
}

window.writeAutoDiary = async function (payload, type = "auto") {
  const hero = getActiveHero();
  if (!hero) {
    return;
  }
  if (!hero.diaryEntries) {
    hero.diaryEntries = [];
  }

  const isObject = typeof payload === "object" && payload !== null;
  const isAI = isObject && payload.useAI;
  const baseText = isObject ? payload.baseText : payload;

  const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  const date = new Date();
  const dateString = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")} - ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

  const initialText = isAI
    ? "✍️ <i>Desenhando pensamentos em sangue e tinta...</i>"
    : baseText;

  hero.diaryEntries.push({ id, text: initialText, type, date: dateString });
  commitStorage();

  triggerToast("📖 Uma nova página foi forjada no seu Diário de Aventureiro.");
  if (!isAI) {
    appendTerminalLog("📜 [LORE] " + initialText, "reward");
  }

  if (window.renderDiaryFeed) {
    window.renderDiaryFeed();
  }

  if (isAI && window.fetchDynamicDiaryEntry) {
    try {
      const aiText = await window.fetchDynamicDiaryEntry(payload);
      const entry = hero.diaryEntries.find((e) => e.id === id);
      if (entry) {
        entry.text = aiText;
        commitStorage();
        appendTerminalLog("📜 [LORE] " + aiText, "reward");
        if (window.renderDiaryFeed) window.renderDiaryFeed();
      }
    } catch (e) {
      console.error("Failed to generate AI diary entry", e);
      const entry = hero.diaryEntries.find((e) => e.id === id);
      if (entry) {
        entry.text = baseText || "As sombras ofuscam meus pensamentos...";
        commitStorage();
        if (window.renderDiaryFeed) window.renderDiaryFeed();
      }
    }
  }
};

// ====================== TOOLTIP FLUTUANTE DETALHADO ======================
const currentTooltipTimeout = null;

function showItemTooltip(item, e) {
  const tooltip = document.getElementById("item-tooltip");
  if (!item) {
    return;
  }

  const hero = getActiveHero();
  const eq = hero && hero.equipment ? hero.equipment[item.type] : null;

  let html = `
        <div class="tooltip-rarity rare-${item.rarity}">${item.rarity}</div>
        <strong style="font-size:1.15rem; color:var(--gold-glowing);">${item.name}</strong><br>
        <small style="color:var(--text-muted);">${item.type.toUpperCase()}</small>
    `;

  function getDiffHtml(val, eqVal) {
    if (!eqVal) {
      return `<span style="color:#10b981; font-size:0.8rem; margin-left:5px;">(▲ +${val})</span>`;
    }
    const diff = val - eqVal;
    if (diff > 0) {
      return `<span style="color:#10b981; font-size:0.8rem; margin-left:5px;">(▲ +${diff})</span>`;
    }
    if (diff < 0) {
      return `<span style="color:#ef4444; font-size:0.8rem; margin-left:5px;">(▼ ${diff})</span>`;
    }
    return `<span style="color:#9ca3af; font-size:0.8rem; margin-left:5px;">(=)</span>`;
  }

  if (item.damage) {
    html +=
      `<br><span style="color:#f87171;">Dano: ${item.damage}</span>` +
      getDiffHtml(item.damage, eq?.damage || 0);
  }
  if (item.defense) {
    html +=
      `<br><span style="color:#60a5fa;">Defesa: ${item.defense}</span>` +
      getDiffHtml(item.defense, eq?.defense || 0);
  }
  if (item.durability) {
    html +=
      `<br><span style="color:#fcd34d;">Durabilidade: ${item.durability}</span>` +
      getDiffHtml(item.durability, eq?.durability || 0);
  }

  if (item.intrinsic) {
    html += `<div style="margin:10px 0; padding:8px; background:rgba(0,0,0,0.4); border-left:3px solid #a7f3d0;">
            ✨ <strong>${item.intrinsic.label}</strong>
        </div>`;
  }

  html += `<div style="margin-top:12px; font-size:0.85rem; color:var(--text-muted); line-height:1.4;">
        "${item.desc || "Um artefato ancestral do Santuário."}"
    </div>`;

  tooltip.innerHTML = html;
  tooltip.classList.add("show");

  // Posiciona próximo ao mouse
  let x = e.pageX + 20;
  let y = e.pageY + 10;

  // Evita sair da tela
  if (x + 340 > window.innerWidth) {
    x = e.pageX - 340;
  }
  if (y + 220 > window.innerHeight) {
    y = e.pageY - 230;
  }

  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
}

function hideItemTooltip() {
  const tooltip = document.getElementById("item-tooltip");
  tooltip.classList.remove("show");
}

const STATUS_EFFECTS_DB = {
  burn: {
    name: "Queimadura",
    icon: "🔥",
    desc: "Dano contínuo por fogo.",
    color: "#ef4444",
  },
  poison: {
    name: "Veneno",
    icon: "🤢",
    desc: "Dano fixo contínuo.",
    color: "#10b981",
  },
  freeze: {
    name: "Congelamento",
    icon: "❄️",
    desc: "Congela o alvo.",
    color: "#3b82f6",
  },
  stun: {
    name: "Atordoamento",
    icon: "💫",
    desc: "Atordoa o alvo.",
    color: "#f59e0b",
  },
  blind: {
    name: "Cegueira",
    icon: "👁️",
    desc: "Prejudica a visão.",
    color: "#6b7280",
  },
};
function positionTooltip(t, e, w = 380, h = 250) {
  let x = e.pageX + 20,
    y = e.pageY + 10;
  if (x + w > window.innerWidth) {
    x = e.pageX - w - 20;
  }
  if (y + h > window.innerHeight) {
    y = e.pageY - h - 10;
  }
  x = Math.max(10, x);
  y = Math.max(10, y);
  t.style.left = `${x}px`;
  t.style.top = `${y}px`;
}
function hideAllTooltips() {
  document
    .querySelectorAll(".tooltip")
    .forEach((t) => t.classList.remove("show"));
}
function getEffectDescription(e) {
  if (!e) {
    return "Sem efeito especial.";
  }
  const t = e.type;
  if (t === "ignoreDef") {
    return `Ignora <strong>${Math.round(e.value * 100)}%</strong> da defesa.`;
  }
  if (t === "burn") {
    return `Queimadura: <strong>${Math.round(e.ratio * 100)}%</strong> dano/turno por <strong>${e.duration}</strong>t.`;
  }
  if (t === "poison") {
    return `Veneno: <strong>${e.power}</strong> dano/turno por <strong>${e.duration}</strong>t.`;
  }
  if (t === "freeze") {
    return `<strong>${Math.round(e.chance * 100)}%</strong> chance congelar.`;
  }
  if (t === "stun") {
    return `<strong>${Math.round(e.chance * 100)}%</strong> chance atordoar.`;
  }
  if (t === "lifeSteal") {
    return `Converte <strong>${Math.round(e.value * 100)}%</strong> dano em cura.`;
  }
  if (t === "buff_def") {
    return `Defesa +<strong>${e.value}</strong>.`;
  }
  if (t === "heal") {
    return `Cura escala x<strong>${e.ratio}</strong>.`;
  }
  return "Efeito aplicado.";
}
function showSkillTooltip(s, e, r = 0) {
  hideAllTooltips();
  const t = document.getElementById("skill-tooltip");
  let h = `<div class="skill-tooltip-header"><div><div class="tooltip-title" style="color:#d8b4fe;">${s.name}</div><div style="font-size:0.8rem;color:#c084fc;">Rank ${r}/5</div></div><div class="skill-tooltip-cost">💎 Custo: ${s.cost}</div></div><div style="color:#a7f3d0;margin:6px 0;">Tipo: <strong>${s.type.toUpperCase()}</strong></div><div style="color:#fbbf24;margin:6px 0;">Atributo Escala: <strong>${s.stats.toUpperCase()}</strong></div><div style="color:#fca5a5;margin:6px 0;">Escalador: <strong>x${s.ratio}</strong></div>`;
  if (s.effect) {
    h += `<div class="skill-tooltip-effect"><strong>⚡Efeito Adicional:</strong><br/>${getEffectDescription(s.effect)}</div>`;
  }
  if (s.reqStat) {
    h += `<div class="skill-tooltip-passive" style="color:#ef4444; margin:6px 0;"><strong>⚔️ Requisito P/ Uso:</strong><br/>${s.reqStat.id.toUpperCase()} >= ${s.reqStat.value}</div>`;
  }
  h += `<div class="skill-tooltip-passive"><strong>✨ Passiva Rank 5:</strong><br/>${s.passives}</div><div style="margin-top:10px;font-size:0.8rem;color:var(--text-muted);">${s.desc}</div>`;
  t.innerHTML = h;
  t.classList.add("show");
  positionTooltip(t, e, 380, 380);
}
function hideSkillTooltip() {
  document.getElementById("skill-tooltip").classList.remove("show");
}
function showStatusTooltip(sType, dur, e, pwr = null) {
  hideAllTooltips();
  const t = document.getElementById("status-tooltip");
  const inf = STATUS_EFFECTS_DB[sType] || {
    name: sType,
    desc: "Desconhecido",
    icon: "❓",
    color: "#999",
  };
  let h = `<div class="tooltip-title" style="color:${inf.color};">${inf.icon} ${inf.name}</div><div style="color:var(--text-muted);font-size:0.85rem;margin-bottom:10px;">Duração:<strong>${dur}turno(s)</strong></div><div class="status-tooltip-effect">${inf.desc}</div>`;
  if (pwr !== null) {
    h += `<div style="color:#fbbf24;font-size:0.85rem;margin-top:8px;">Potência:<strong>${pwr}</strong></div>`;
  }
  t.innerHTML = h;
  t.classList.add("show");
  positionTooltip(t, e, 320, 200);
}
function hideStatusTooltip() {
  document.getElementById("status-tooltip").classList.remove("show");
}
function showCompanionTooltip(comp, pass, e) {
  hideAllTooltips();
  const t = document.getElementById("companion-tooltip");
  let h = `<div class="tooltip-title"style="color:var(--gold-glowing);">${comp.name}</div><div style="color:var(--text-muted);font-size:0.85rem;margin-bottom:10px;">${comp.desc}</div><div class="companion-tooltip-stat"><span>Lealdade:</span><span style="color:#6ee7b7;font-weight:bold;">💚${comp.affinity}</span></div>`;
  if (pass) {
    h += `<div class="companion-tooltip-passive"><strong>🔮Passiva:</strong><br/>${pass.desc}</div>`;
  }
  h += `<div style="margin-top:8px;font-size:0.8rem;color:var(--text-muted);">Status:${comp.equipped ? "⚔️Equipado" : "⏸️Inativo"}</div>`;
  t.innerHTML = h;
  t.classList.add("show");
  positionTooltip(t, e, 340, 280);
}
function hideCompanionTooltip() {
  document.getElementById("companion-tooltip").classList.remove("show");
}
function showMaterialTooltip(mat, qty, e) {
  hideAllTooltips();
  const t = document.getElementById("material-tooltip");
  const h = `<div class="tooltip-title"style="color:${mat.color};">${mat.name}</div><div class="material-tooltip-info"><div class="material-tooltip-stat">Quantidade:<strong style="color:${mat.color};">${qty}</strong></div></div><div style="font-size:0.8rem;color:var(--text-muted);margin-top:8px;">Usado em forja.</div>`;
  t.innerHTML = h;
  t.classList.add("show");
  positionTooltip(t, e, 300, 180);
}
function hideMaterialTooltip() {
  document.getElementById("material-tooltip").classList.remove("show");
}
function showButtonTooltip(ttl, desc, e) {
  hideAllTooltips();
  const t = document.getElementById("button-tooltip");
  const h = `<div class="tooltip-title"style="color:#fca5a5;">${ttl}</div><div class="button-tooltip-desc">${desc}</div>`;
  t.innerHTML = h;
  t.classList.add("show");
  positionTooltip(t, e, 300, 150);
}
function hideButtonTooltip() {
  document.getElementById("button-tooltip").classList.remove("show");
}

function triggerScreenShake() {
  if (window.JuiceEngine) {
    window.JuiceEngine.shake('severe');
  } else {
    const el = document.body;
    el.classList.remove(MV_CLASS_APPLY_SHAKE);
    void el.offsetWidth;
    el.classList.add(MV_CLASS_APPLY_SHAKE);
  }
}

function generateFloatingText(amount, type = "damage", target = "center") {
  const floater = document.createElement("div");
  floater.className = `dmg-floater type-${type}`;
  
  let prefix = "";
  if (type === "heal") {
    prefix = "+";
    floater.style.color = "#4ade80"; // bright green
    if (window.AudioEngine) window.AudioEngine.play('heal');
  } else if (type === "damage") {
    prefix = "-";
    floater.style.color = "#f87171"; // bright red
    if (window.AudioEngine) window.AudioEngine.play('hit');
    if (window.JuiceEngine) window.JuiceEngine.shake('light');
  } else if (type === "crit") {
    prefix = "CRIT -";
    floater.style.color = "#fbbf24"; // gold
    if (window.AudioEngine) window.AudioEngine.play('crit');
    if (window.JuiceEngine) {
      window.JuiceEngine.shake('severe');
      window.JuiceEngine.hitStop();
    }
  } else if (type === "block") {
    floater.style.color = "#9ca3af";
    if (window.AudioEngine) window.AudioEngine.play('parry');
  }
  
  floater.innerText = `${prefix}${amount}`;

  let startX, startY;
  const heroCard = document.getElementById("player-card"); // or use class .player-card
  const enemyCard = document.getElementById("enemy-card"); // or use class .enemy-card
  const hRect = document.querySelector('.player-card')?.getBoundingClientRect();
  const eRect = document.querySelector('.enemy-card')?.getBoundingClientRect();

  if (target === "hero" && hRect) {
    startX = hRect.left + hRect.width / 2;
    startY = hRect.top + hRect.height / 2 - 50;
  } else if (target === "enemy" && eRect) {
    startX = eRect.left + eRect.width / 2;
    startY = eRect.top + eRect.height / 2 - 50;
  } else {
    startX = window.innerWidth / 2;
    startY = window.innerHeight * 0.4;
  }

  // Spread
  startX += (Math.random() - 0.5) * 140;
  startY += (Math.random() - 0.5) * 80;

  floater.style.left = `${startX}px`;
  floater.style.top = `${startY}px`;

  // Physics vars
  const xEnd = (Math.random() - 0.5) * 150;
  const yEnd = -100 - Math.random() * 100;
  const rot = (Math.random() - 0.5) * 40;
  floater.style.setProperty('--x-end', `${xEnd}px`);
  floater.style.setProperty('--y-end', `${yEnd}px`);
  floater.style.setProperty('--rot-end', `${rot}deg`);

  document.body.appendChild(floater);
  setTimeout(() => floater.remove(), 1500);
}

function appendTerminalLog(text, classType = "normal") {
  // Still write to terminal in case it's ever re-enabled
  const box = document.getElementById("combat-terminal-logs");
  if (box) {
    let col = "#fff";
    if (classType === "combat") col = "var(--red-blood)";
    if (classType === "reward") col = "var(--gold-glowing)";
    if (classType === "system") col = "var(--mana-blue)";
    if (classType === "status") col = "var(--rank-max)";
    box.innerHTML += `<div style="color:${col}; margin-bottom: 5px;">▶ ${text}</div>`;
    box.scrollTop = box.scrollHeight;
  }

  // === FLOATING NOTIFICATION ===
  const container = document.getElementById("floating-log-container");
  if (!container) return;

  let color = "#d4d4d8";
  let borderColor = "rgba(255,255,255,0.08)";
  if (classType === "combat") { color = "#fca5a5"; borderColor = "rgba(220,38,38,0.4)"; }
  if (classType === "reward") { color = "#fbbf24"; borderColor = "rgba(251,191,36,0.4)"; }
  if (classType === "system") { color = "#93c5fd"; borderColor = "rgba(59,130,246,0.3)"; }
  if (classType === "status") { color = "#fb923c"; borderColor = "rgba(251,146,60,0.4)"; }

  const entry = document.createElement("div");
  entry.className = "floating-log-entry";
  entry.style.color = color;
  entry.style.borderColor = borderColor;
  entry.textContent = text.replace(/[▶►⚔️🛡️⚡🔨✨💀☠️🩸⬅️⬆️➡️]/g, "").trim();
  container.appendChild(entry);

  // Limit to 5 visible notifications
  while (container.children.length > 5) {
    container.removeChild(container.firstChild);
  }

  // Auto-remove after animation ends
  setTimeout(() => {
    if (entry.parentNode) entry.parentNode.removeChild(entry);
  }, 4200);
}

// === WEAPON ATTACK VISUAL FX ===
const WEAPON_FX_MAP = {
  Guerreiro: { img: "assets/animations/sword_slash.jpg", anim: "anim-slash" },
  Bárbaro:   { img: "assets/animations/axe_slash.jpg",   anim: "anim-slash" },
  Barbaro:   { img: "assets/animations/axe_slash.jpg",   anim: "anim-slash" },
  Paladino:  { img: "assets/animations/sword_slash.jpg", anim: "anim-slash" },
  Ranger:    { img: "assets/animations/arrow_shot.jpg",  anim: "anim-arrow" },
  Arcanista: { img: "assets/animations/magic_blast.jpg", anim: "anim-magic" },
  Necromante:{ img: "assets/animations/magic_blast.jpg", anim: "anim-magic" },
};

function playWeaponSlashFX() {
  const hero = typeof getActiveHero === "function" ? getActiveHero() : null;
  const heroClass = hero ? hero.class : "Guerreiro";
  const fx = WEAPON_FX_MAP[heroClass] || WEAPON_FX_MAP.Guerreiro;

  // Find the enemy image element to position the FX over it
  const enemyImg = document.getElementById("enemy-display-image");
  if (!enemyImg || enemyImg.style.display === "none") return;

  const rect = enemyImg.getBoundingClientRect();

  // Create the slash overlay
  const slash = document.createElement("img");
  slash.src = fx.img;
  slash.className = `weapon-slash-overlay ${fx.anim}`;
  slash.style.left = `${rect.left + rect.width / 2 - 140}px`;
  slash.style.top = `${rect.top + rect.height / 2 - 140}px`;
  document.body.appendChild(slash);

  // Apply shake + flash to enemy image
  enemyImg.classList.add("enemy-hit-shake", "enemy-impact-flash");

  // Cleanup
  setTimeout(() => {
    if (slash.parentNode) slash.parentNode.removeChild(slash);
    enemyImg.classList.remove("enemy-hit-shake", "enemy-impact-flash");
  }, 600);
}
window.playWeaponSlashFX = playWeaponSlashFX;

const NAV_CATEGORIES = {
  jornada: [
    { id: MV_TAB_DUNGEON, label: "Masmorra [M]" },
    { id: "tab-quests", label: "Caçadas [Q]" },
    { id: "tab-mina", label: "Mina Abissal" },
  ],
  nephalem: [
    { id: MV_TAB_FICHA, label: "Ficha & Baú [I]" },
    { id: MV_TAB_SKILLS, label: "Grimório [K]" },
    { id: "tab-companheiros", label: "Aliados [C]" },
  ],
  refugio: [
    { id: "tab-acampamento", label: "Acampamento" },
    { id: "tab-forge", label: "Forja & Loja [F]" },
    { id: "tab-panteao", label: "O Panteão" },
  ],
  registros: [
    { id: "tab-saves", label: "Saves" },
    { id: "tab-bestiario", label: "Bestiário" },
    { id: MV_TAB_CONQUISTAS, label: "Conquistas" },
  ],
};

window.switchNavCategory = function (catName) {
  document
    .querySelectorAll(".nav-main-item")
    .forEach((el) => el.classList.remove("active"));
  const catEl = document.getElementById("nav-cat-" + catName);
  if (catEl) {
    catEl.classList.add("active");
  }

  const subContainer = document.getElementById("nav-sub");
  if (!subContainer) {
    return;
  }

  subContainer.innerHTML = "";
  const tabs = NAV_CATEGORIES[catName];
  if (!tabs) {
    return;
  }

  tabs.forEach((tab) => {
    subContainer.innerHTML += `<li class="nav-sub-item" id="btn-${tab.id}" onclick="navigate('${tab.id}')">${tab.label}</li>`;
  });

  navigate(tabs[0].id);
};
window.playScreenTransition = function (callback) {
  document.body.classList.add("screen-transitioning");
  setTimeout(() => {
    if (callback) callback();
    setTimeout(() => {
      document.body.classList.remove("screen-transitioning");
    }, 150);
  }, 150);
};

window.navigate = function (tabId, skipCategorySwitch = false) {
  _doNavigate(tabId, skipCategorySwitch);
};

function _doNavigate(tabId, skipCategorySwitch) {
  if (!skipCategorySwitch) {
    // Find which category this tab belongs to
    let parentCat = null;
    for (const [catName, tabs] of Object.entries(NAV_CATEGORIES)) {
      if (tabs.some((t) => t.id === tabId)) {
        parentCat = catName;
        break;
      }
    }

    // If we found a category, we need to ensure its sub-tabs are rendered
    // But we don't want switchNavCategory to auto-navigate to [0] and override our tabId.
    if (parentCat) {
      document
        .querySelectorAll(".nav-main-item")
        .forEach((el) => el.classList.remove("active"));
      const catEl = document.getElementById("nav-cat-" + parentCat);
      if (catEl) {
        catEl.classList.add("active");
      }

      const subContainer = document.getElementById("nav-sub");
      if (subContainer) {
        subContainer.innerHTML = "";
        NAV_CATEGORIES[parentCat].forEach((tab) => {
          subContainer.innerHTML += `<li class="nav-sub-item" id="btn-${tab.id}" onclick="navigate('${tab.id}', true)">${tab.label}</li>`;
        });
      }
    }
  }

  document
    .querySelectorAll(".viewport-content")
    .forEach((el) => el.classList.add("hidden"));
  document
    .querySelectorAll(".nav-sub-item")
    .forEach((el) => el.classList.remove("active"));

  const target = document.getElementById(tabId);
  if (target) {
    target.classList.remove("hidden");
  }

  const subBtn = document.getElementById("btn-" + tabId);
  if (subBtn) {
    subBtn.classList.add("active");
  }

  // Toggle Grimoire Canvas
  if (tabId === MV_TAB_SKILLS && window.startGrimoireCanvas) {
    window.startGrimoireCanvas();
  } else if (window.stopGrimoireCanvas) {
    window.stopGrimoireCanvas();
  }

  renderAllEngines();
}

function renderAllEngines() {
  window.hero = getActiveHero();
  const hero = getActiveHero();
  const hud = document.getElementById("persistent-hud");
  const nav = document.getElementById("game-navigation");

  if (hero) {
    if (typeof hero.xp !== "number" || isNaN(hero.xp) || hero.xp === null)
      hero.xp = 0;
    if (
      typeof hero.maxXp !== "number" ||
      isNaN(hero.maxXp) ||
      hero.maxXp <= 100
    ) {
      // Calculate maxXp based on level (120 * 1.65^level-1)
      let calculatedMax = 120;
      let lvl = parseInt(hero.level) || 1;
      for (let i = 1; i < lvl; i++) {
        calculatedMax = Math.floor(calculatedMax * 1.65);
      }
      hero.maxXp = calculatedMax;
    }
  }

  if (typeof checkAndRenderGodModeSeal === "function") {
    checkAndRenderGodModeSeal(hero);
  }

  if (!hero) {
    hud.style.display = "none";
    nav.style.display = "none";

    renderSavesTab();
    return;
  }

  hud.style.display = "flex";
  nav.style.display = "flex"; // Usar flex para triptych-left

  const calc = computeLiveStats();

  // Limites rígidos para Vitalidade e Barra HUD Superior
  if (hero.currentHp > calc.maxHp) {
    hero.currentHp = calc.maxHp;
  }
  if (hero.currentMana > calc.maxMp) {
    hero.currentMana = calc.maxMp;
  }
  if (hero.stamina > calc.maxStamina) {
    hero.stamina = calc.maxStamina;
  }

  document.getElementById("hud-char-name").innerText = hero.name;
  document.getElementById("hud-char-level").innerText =
    `Nv. ${hero.level} ${hero.class}`;

  // Variáveis Auxiliares (Visuais - Arredondadas)
  const hpText = `${Math.floor(hero.currentHp)}/${calc.maxHp}`;
  const hpPercent = `${(hero.currentHp / calc.maxHp) * 100}%`;
  const mpText = `${Math.floor(hero.currentMana)}/${calc.maxMp}`;
  const mpPercent = `${(hero.currentMana / calc.maxMp) * 100}%`;
  const stText =
    hero.stamina <= 0
      ? `EXAUSTO (${Math.floor(hero.stamina)}/${calc.maxStamina})`
      : `${Math.floor(hero.stamina)}/${calc.maxStamina}`;
  const stPercent = `${(hero.stamina / calc.maxStamina) * 100}%`;
  const stBg =
    hero.stamina <= 0 ? "#ef4444" : "linear-gradient(90deg, #10b981, #059669)";

  let secondaryResVal = 0;
  let secondaryResMax = 100;
  let resLabel = "Fúria";
  let resColor = "#fb923c"; // Orange
  
  if (["Bárbaro", "Barbaro"].includes(hero.class)) {
    secondaryResVal = hero.adrenalina || 0;
    resLabel = "Sangue";
    resColor = "#ef4444"; // Red
  } else if (hero.class === "Paladino") {
    secondaryResVal = hero.fe || 0;
    resLabel = "Fé";
    resColor = "#fde047"; // Yellow
  } else if (hero.class === "Ranger") {
    secondaryResVal = hero.foco !== undefined ? hero.foco : 100;
    resLabel = "Foco";
    resColor = "#86efac"; // Green
  } else if (["Necromante", "Arcanista"].includes(hero.class)) {
    secondaryResVal = hero.almas || 0;
    resLabel = "Almas";
    resColor = "#c084fc"; // Purple
  } else {
    secondaryResVal = hero.furia || 0;
  }

  const fcText = `${Math.floor(secondaryResVal)}/${secondaryResMax}`;
  const fcPercent = `${Math.min(100, Math.max(0, (secondaryResVal / secondaryResMax) * 100))}%`;

  // HUD PERSISTENTE
  document.getElementById("hud-txt-hp").innerText = hpText;
  document.getElementById("hud-fill-hp").style.width = hpPercent;
  document.getElementById("hud-txt-mp").innerText = mpText;
  document.getElementById("hud-fill-mp").style.width = mpPercent;
  document.getElementById("hud-txt-st").innerText = stText;
  document.getElementById("hud-fill-st").style.width = stPercent;
  document.getElementById("hud-fill-st").style.background = stBg;

  const hudFcTxt = document.getElementById("hud-txt-fc");
  if (hudFcTxt) {
    hudFcTxt.innerText = fcText;
    const fillFc = document.getElementById("hud-fill-fc");
    if (fillFc) {
      fillFc.style.width = fcPercent;
      fillFc.style.background = resColor;
    }
    const lblFc = document.getElementById("hud-lbl-fc");
    if (lblFc) {
      lblFc.innerText = resLabel;
      lblFc.style.color = resColor;
    }
  }

  // PAINEL TÁTICO DE COMBATE
  const cTxtHp = document.getElementById("combat-txt-hp");
  if (cTxtHp) {
    cTxtHp.innerText = hpText;
    document.getElementById("combat-fill-hp").style.width = hpPercent;
    document.getElementById("combat-txt-mp").innerText = mpText;
    document.getElementById("combat-fill-mp").style.width = mpPercent;
    document.getElementById("combat-txt-st").innerText = stText;
    document.getElementById("combat-fill-st").style.width = stPercent;
    document.getElementById("combat-fill-st").style.background = stBg;

    const combatFcTxt = document.getElementById("combat-txt-fc");
    if (combatFcTxt) {
      combatFcTxt.innerText = fcText;
      const combatFillFc = document.getElementById("combat-fill-fc");
      if (combatFillFc) {
        combatFillFc.style.width = fcPercent;
        combatFillFc.style.background = resColor;
      }
      const combatLblFc = document.getElementById("combat-lbl-fc");
      if (combatLblFc) {
        let labelText = `🔥 ${resLabel}`;
        if (hero.class === "Necromante" && typeof heroCombatState !== "undefined" && heroCombatState.activeMinions && heroCombatState.activeMinions.length > 0) {
           const minionStr = heroCombatState.activeMinions.map(m => `[${m.icon}${m.hp}]`).join(" ");
           labelText += ` (Tropa: ${minionStr})`;
        }
        combatLblFc.innerText = labelText;
        combatLblFc.style.color = resColor;
      }
    }

    // NOVO: BARRA DE SANIDADE (DARKEST DUNGEON STRESS)
    let sanityContainer = document.getElementById("combat-sanity-container");
    if (!sanityContainer) {
       sanityContainer = document.createElement("div");
       sanityContainer.id = "combat-sanity-container";
       sanityContainer.style.marginTop = "4px";
       sanityContainer.innerHTML = `
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px; font-weight: bold;">
             <span style="color: #c084fc">👁️ Sanidade</span><span id="combat-txt-san">100/100</span>
          </div>
          <div style="height: 12px; background: #1a0525; border-radius: 10px; border: 1px solid #3b0764; overflow: hidden;">
             <div id="combat-fill-san" style="height: 100%; width: 100%; background: linear-gradient(90deg, #7e22ce, #a855f7); transition: width 0.3s ease;"></div>
          </div>
       `;
       const parentDash = cTxtHp.parentElement.parentElement;
       if (parentDash) {
          parentDash.appendChild(sanityContainer);
       }
    }
    
    hero.maxSanity = hero.maxSanity || 100;
    if (hero.sanity === undefined) hero.sanity = hero.maxSanity;
    
    const txtSan = document.getElementById("combat-txt-san");
    const fillSan = document.getElementById("combat-fill-san");
    if (txtSan && fillSan) {
      txtSan.innerText = `${Math.floor(hero.sanity)}/${hero.maxSanity}`;
      fillSan.style.width = `${Math.max(0, (hero.sanity / hero.maxSanity) * 100)}%`;
      
      if (hero.sanity < 30) {
        fillSan.style.background = "linear-gradient(90deg, #dc2626, #991b1b)";
        txtSan.style.color = "#dc2626";
      } else {
        fillSan.style.background = "linear-gradient(90deg, #7e22ce, #a855f7)";
        txtSan.style.color = "#fff";
      }
    }
  }

  // === AVATAR DO JOGADOR NO COMBATE ===
  const avatarImg = document.getElementById("player-avatar-combat-img");
  const avatarName = document.getElementById("player-avatar-combat-name");
  if (avatarImg && avatarName) {
    const classToTarot = {
      Guerreiro: "tarot_class_warrior",
      Arcanista: "tarot_class_arcanist",
      Ranger: "tarot_class_ranger",
      Barbaro: "tarot_class_barbarian",
      Paladino: "tarot_class_paladin",
      Necromante: "tarot_class_necromancer",
    };
    const tarotFile = classToTarot[hero.class] || "tarot_class_warrior";
    avatarImg.src = `./assets/tarot/${tarotFile}.webp`;
    avatarImg.style.display = "block";
    avatarName.innerText = hero.name;
  }

  document.getElementById("hud-txt-gold").innerText = (
    hero.gold || 0
  ).toLocaleString("pt-BR");
  document.getElementById("hud-txt-fragments").innerText = (
    hero.inventory || []
  ).filter((i) => i && i.type === "lore_fragment").length;
  document.getElementById("hud-txt-chapters").innerText = Object.values(
    hero.loreChapters || {},
  ).filter((ch) => ch.completed).length;

  // === BARRA DE XP NA HUD ===
  const hudXpFill = document.getElementById("hud-fill-xp");
  const hudXpText = document.getElementById("hud-txt-xp");
  if (hudXpFill && hudXpText) {
    const xpPercent = Math.min(100, (hero.xp / hero.maxXp) * 100);
    hudXpFill.style.width = `${xpPercent}%`;
    hudXpText.innerText = `XP: ${hero.xp}/${hero.maxXp}`;
  }

  // === FEEDBACK VISUAL DE HP/MANA CRÍTICOS ===
  const hpWrap = document.querySelector(
    "#hud-bars-wrap .bar-wrap:nth-child(1)",
  );
  const mpWrap = document.querySelector(
    "#hud-bars-wrap .bar-wrap:nth-child(2)",
  );
  if (hpWrap) {
    hpWrap.classList.toggle("hp-critical", hero.currentHp / calc.maxHp < 0.3);
  }
  if (mpWrap) {
    mpWrap.classList.toggle("mp-critical", hero.currentMana / calc.maxMp < 0.2);
  }

  // === INDICADOR DE BIOMA NO HUD ===
  const biomeBadge = document.getElementById("hud-biome-badge");
  if (biomeBadge) {
    try {
      const biome = getCurrentBiome();
      biomeBadge.innerText = biome.name;
      biomeBadge.style.color = biome.color;
      biomeBadge.style.borderColor = biome.color;
      biomeBadge.style.background = biome.color + "15";

      let bgPath = "assets/images/dungeon_bg.webp";
      const bName = biome.name.toLowerCase();
      if (bName.includes("catacumba"))
        bgPath = "assets/images/biomes/bg_catacumbas.webp";
      else if (bName.includes("pantano") || bName.includes("pântano"))
        bgPath = "assets/images/biomes/bg_pantano.webp";
      else if (bName.includes("floresta"))
        bgPath = "assets/images/biomes/bg_floresta.webp";
      else if (bName.includes("magma") || bName.includes("vulc"))
        bgPath = "assets/images/biomes/bg_magma.webp";
      else if (bName.includes("cristal"))
        bgPath = "assets/images/biomes/bg_cristal.webp";

      document.body.style.backgroundImage = "none";
      const dungeonTabEl = document.getElementById(MV_TAB_DUNGEON);
      if (dungeonTabEl) {
        dungeonTabEl.style.backgroundImage = `url('${bgPath}')`;
        dungeonTabEl.style.backgroundSize = "cover";
        dungeonTabEl.style.backgroundPosition = "center";
        dungeonTabEl.style.backgroundAttachment = "fixed";
      }
    } catch (error_) {
      console.error(error_);
    }
  }

  // Renderiza Views Especificas Baseadas na aba
  try {
    renderSavesTab();
  } catch (e) {
    console.error("Error in renderSavesTab:", e);
  }
  try {
    renderFichaTab(calc);
  } catch (e) {
    console.error("Error in renderFichaTab:", e);
  }
  try {
    renderGrimorioTab();
  } catch (e) {
    console.error("Error in renderGrimorioTab:", e);
  }
  try {
    renderDungeonTab();
  } catch (e) {
    console.error("Error in renderDungeonTab:", e);
  }
  try {
    renderCompanionsTab();
  } catch (e) {
    console.error("Error in renderCompanionsTab:", e);
  }
  try {
    if (typeof renderMinaTab === "function") renderMinaTab();
  } catch (e) {
    console.error("Error in renderMinaTab:", e);
  }
  try {
    renderForgeAndMarket();
  } catch (e) {
    console.error("Error in renderForgeAndMarket:", e);
  }
  try {
    if (typeof renderUpgradeMesh === "function") renderUpgradeMesh();
  } catch (e) {
    console.error("Error in renderUpgradeMesh:", e);
  }
  try {
    if (typeof renderRepairMesh === "function") renderRepairMesh();
  } catch (e) {
    console.error("Error in renderRepairMesh:", e);
  }
  try {
    if (typeof renderQuestsBoard === "function") renderQuestsBoard();
  } catch (e) {
    console.error("Error in renderQuestsBoard:", e);
  }
  try {
    renderPantheonTab();
  } catch (e) {
    console.error("Error in renderPantheonTab:", e);
  }
  try {
    renderBestiaryTab();
  } catch (e) {
    console.error("Error in renderBestiaryTab:", e);
  }
  try {
    renderSavesTab();
  } catch (e) {
    console.error("Error in renderSavesTab:", e);
  }
}

// =========================================================================
//  RENDERIZAÇÃO DAS ABAS - FUNÇÕES DE DOM MESHING
// =========================================================================

// 1. GESTÃO DOS AKÁSHICOS (SAVES)
function renderSavesTab() {
  const container = document.getElementById("save-slots-deck");
  if (!container) return;

  if (!window.allHeroesCache) {
    container.innerHTML =
      "<p style='color:var(--text-muted);'>Conectando aos Registros Akáshicos...</p>";
    window.allHeroesCache = "loading";
    if (!window.dbService) {
      window.allHeroesCache = [
        { id: 1, name: "Dev Hero", class: "Guerreiro", level: 1 },
      ];
      renderSavesTab();
      return;
    }
    window.dbService.getHeroes()
      .then((data) => {
        window.allHeroesCache = data;
        renderSavesTab();
      })
      .catch((_err) => {
        window.allHeroesCache = null;
        container.innerHTML =
          "<p style='color:#fca5a5;'>Falha ao conectar com o banco de dados local.</p>";
      });
    return;
  }

  if (window.allHeroesCache === "loading") return;

  container.innerHTML = "";

  try {
    if (!Array.isArray(window.allHeroesCache)) {
      throw new Error("allHeroesCache is not an array: " + typeof window.allHeroesCache);
    }
    
    window.allHeroesCache.forEach((hero) => {
      const isCurrent = window.mysqlHeroId === hero?.id;
      container.innerHTML += `
                      <div class="save-slot-card ${isCurrent ? "active-slot" : ""}">
                          <h4 style="font-family:'UnifrakturCook'; font-size:1.8rem; color:var(--gold-glowing);">${hero?.name || "Desconhecido"}</h4>
                          <p style="font-size:0.9rem; color:var(--text-muted); margin: 15px 0;">
                              O <strong>${hero?.class || "N/A"}</strong> — Nível Espiritual ${hero?.level || 1}
                          </p>
                          ${
                            isCurrent
                              ? `<button class="btn btn-small" disabled style="margin-bottom:10px; filter: grayscale(1);">Consciência Ativa</button>`
                              : `<button class="btn btn-small" onclick="loadMySQLHero(${hero?.id})" style="margin-bottom:10px;">Encarnar Consciência</button>`
                          }
                          <button class="btn btn-secondary btn-small" style="color:#fca5a5" onclick="purgeMySQLHero(${hero?.id})">Deletar Registro</button>
                      </div>
                  `;
    });

    // O botão de Vazio fica no final sempre
    container.innerHTML += `
        <div class="save-slot-card">
            <h4 style="font-family:'UnifrakturCook'; font-size:1.8rem; color:var(--gold-glowing);">Altar Espiritual Vazio</h4>
            <p style="font-size:0.9rem; color:var(--text-muted); margin: 15px 0;">
                Uma alma vaga esperando seu mestre místico.
            </p>
            <button class="btn" onclick="openCreationPanel()">Assumir Controle do Vazio</button>
        </div>
    `;
  } catch (err) {
    console.error("Render Saves Error:", err);
    container.innerHTML = `<p style="color: red;">Erro Crítico ao Renderizar: ${err.message}</p>`;
  }
}
function openCreationPanel(index) {
  window.targetSlotForCreation = index;
  document.getElementById(MV_ID_CREATION).classList.remove("hidden");

  // Puxa os dados do Ritual do Menu Principal
  try {
    const tempHero = localStorage.getItem("Sanctuary_NewHeroTemp");
    if (tempHero) {
      const data = JSON.parse(tempHero);
      if (data.name) {
        document.getElementById(MV_ID_HERO_INPUT).value = data.name;
      }
    }
  } catch (error_) {
    console.error(error_);
  }
}
const ROCK_EASTER_EGGS = [
  {
    trigger: "freddie",
    msg: "🎸 O panteão do rock reconhece seu nome! O show deve continuar...",
    item: {
      id: "ee_freddie",
      name: "Microfone Rainha",
      type: "colar",
      rarity: "Mitico",
      power: 150,
      desc: '"O show deve continuar." Pertenceu a uma lenda da realeza do Rock.',
      durability: 999,
      maxDurability: 999,
      intrinsic: {
        type: "critChance",
        value: 0.15,
        label: "+15% Chance de Crítico",
      },
      bonusPassives: [
        { type: "critDamage", value: 2.0, label: "+200% Dano Crítico" },
      ],
    },
  },
  {
    trigger: "ozzy",
    msg: "🦇 O Príncipe das Trevas abençoa sua jornada maldita.",
    item: {
      id: "ee_ozzy",
      name: "Morcego Decapitado",
      type: "relic",
      rarity: "Lendario",
      desc: '"Deixa um gosto estranho na boca." Herança do Príncipe das Trevas. (Efeito Ativo na Mochila)',
      relicBonus: { lifeSteal: 0.2 },
    },
  },
  {
    trigger: "dio",
    msg: "🤘 Holy Diver! Rock N' Roll nunca morre.",
    item: {
      id: "ee_dio",
      name: "Holy Diver",
      type: "anel",
      rarity: "Mitico",
      power: 250,
      desc: '"Você foi longe demais no mar negro..."',
      durability: 999,
      maxDurability: 999,
      intrinsic: {
        type: "critDamage",
        value: 1.5,
        label: "+150% Dano Crítico",
      },
    },
  },
  {
    trigger: "kurt",
    msg: "🎸 Cheira a espírito Nephalem...",
    item: {
      id: "ee_kurt",
      name: "Guitarra Quebrada",
      type: "arma",
      rarity: "Mitico",
      damage: 300,
      desc: '"Cheira a espírito adolescente." Suja e desbotada.',
      durability: 999,
      maxDurability: 999,
      intrinsic: { type: "dmgMult", value: 0.2, label: "+20% Dano Bruto" },
    },
  },
  {
    trigger: "axl",
    msg: "🌹 Bem-vindo à selva, Nephalem. Vai ser um inferno.",
    item: {
      id: "ee_axl",
      name: "Bandana da Destruição",
      type: "capacete",
      rarity: "Mitico",
      defense: 200,
      desc: "Uma bandana vermelha ensopada de suor e glória.",
      durability: 999,
      maxDurability: 999,
      intrinsic: { type: "lifeSteal", value: 0.1, label: "+10% Roubo de Vida" },
    },
  },
  {
    trigger: "bruce",
    msg: "🗡️ Grite por mim, Santuário! O Medo do Escuro chegou.",
    item: {
      id: "ee_bruce",
      name: "A Dama de Ferro",
      type: "armadura",
      rarity: "Mitico",
      defense: 300,
      desc: "Forjada pelos medos do escuro e sangue de donzelas de ferro.",
      durability: 999,
      maxDurability: 999,
      intrinsic: { type: "defMult", value: 0.3, label: "+30% Defesa Total" },
    },
  },
  {
    trigger: "lemmy",
    msg: "♠️ Você sabe que nasceu pra perder, e o jogo é pra otários.",
    item: {
      id: "ee_lemmy",
      name: "Ás de Espadas",
      type: "relic",
      rarity: "Mitico",
      desc: '"Nascido pra perder, vivendo pra vencer." (Efeito Ativo na Mochila)',
      relicBonus: { critChance: 0.15, critDamage: 1.0 },
    },
  },
];

function confirmCharacterCreation() {
  try {
    const name = document.getElementById(MV_ID_HERO_INPUT).value.trim();
    const cls = document.getElementById("select-hero-class").value;
    if (!name) {
      triggerToast("Um Nephalem verdadeiro exige um nome de glória.");
      return;
    }

    const newHero = createFreshHero(name, cls);

    // === APLICA BÔNUS DO RITUAL ===
    try {
      const tempHero = localStorage.getItem("SANCTUARY_RITUAL_PENDING");
      if (tempHero) {
        const data = JSON.parse(tempHero);
        if (data.name === name) {
          // Confirma que é o personagem do ritual
          // Bônus de Origem
          if (data.origin === "Survivor") {
            newHero.attributes.constituicao += 2;
          }
          if (data.origin === "Betrayed") {
            newHero.attributes.forca += 2;
          }
          if (data.origin === "Pactbound") {
            newHero.attributes.inteligencia += 2;
          }

          // Bônus Final
          if (data.bonus === "Power") {
            newHero.attributes.forca += 1;
            newHero.attributes.inteligencia += 1;
          }
          if (data.bonus === "Redemption") {
            newHero.attributes.sabedoria += 2;
          }
          if (data.bonus === "Oblivion") {
            newHero.gold += 50;
          } // Começa com mais moedas

          localStorage.removeItem("SANCTUARY_RITUAL_PENDING"); // Limpa após o uso
        }
      }
    } catch (error_) {
      console.error(error_);
    }

    // Easter Egg Logic
    const lowerName = name.toLowerCase();
    const nameParts = lowerName.split(" ");
    let eggFound = null;
    
    if (typeof ROCK_EASTER_EGGS !== 'undefined') {
      for (const egg of ROCK_EASTER_EGGS) {
        if (nameParts.includes(egg.trigger) || lowerName === egg.trigger) {
          eggFound = egg;
          break;
        }
      }
    }

    if (eggFound) {
      const clonedItem = structuredClone(eggFound.item);
      clonedItem.id = clonedItem.id + "_" + Date.now();
      newHero.inventory.push(clonedItem);

      // Tocar a música respectiva do Easter Egg (assets/audio/ee_nome.mp3)
      try {
        const eeMusic = new Audio("assets/audio/ee_" + eggFound.trigger + ".mp3");
        eeMusic.volume = 0.6;
        eeMusic
          .play()
          .catch((e) =>
            console.log("Áudio do Easter Egg não encontrado ou bloqueado:", e),
          );

        // Encurtar música (fade out e parar após 15 segundos)
        setTimeout(() => {
          let vol = eeMusic.volume;
          const fade = setInterval(() => {
            vol -= 0.05;
            if (vol <= 0) {
              clearInterval(fade);
              eeMusic.pause();
            } else {
              eeMusic.volume = vol;
            }
          }, 200);
        }, 15000);
      } catch (err) {
        console.log("Áudio do Easter Egg falhou:", err);
      }

      // Cria no SQLite (com Easter Egg)
      const createPromise = window.dbService ? window.dbService.saveHero({
        name: newHero.name,
        class: newHero.class,
        race: newHero.race || "Humano",
        level: 1,
        save_data: newHero,
      }) : Promise.resolve(Math.floor(Math.random() * 1000));
      
      createPromise
        .then((insertId) => {
          appState.slots[0] = newHero;
          window.mysqlHeroId = insertId;
          localStorage.setItem("SANCTUARY_APEX_V5", JSON.stringify(appState));
          document.getElementById(MV_ID_CREATION).classList.add("hidden");
          document.getElementById(MV_ID_HERO_INPUT).value = "";

          window.allHeroesCache = null;

          navigate(MV_TAB_FICHA);
          triggerToast(eggFound.msg);
        })
        .catch((err) => {
          console.error(err);
          alert("Erro ao criar personagem no banco de dados.");
        });

      setTimeout(
        () =>
          alert(
            eggFound.msg +
              "\n\nItem LENDÁRIO desbloqueado: " +
              eggFound.item.name +
              "!",
          ),
        300,
      );
    } else {
      // Cria no SQLite (sem Easter Egg)
      const createPromise = window.dbService ? window.dbService.saveHero({
        name: newHero.name,
        class: newHero.class,
        race: newHero.race || "Humano",
        level: 1,
        save_data: newHero,
      }) : Promise.resolve(Math.floor(Math.random() * 1000));
      
      createPromise
        .then((insertId) => {
          appState.slots[0] = newHero;
          window.mysqlHeroId = insertId;
          localStorage.setItem("SANCTUARY_APEX_V5", JSON.stringify(appState));
          document.getElementById(MV_ID_CREATION).classList.add("hidden");
          document.getElementById(MV_ID_HERO_INPUT).value = "";

          window.allHeroesCache = null;

          navigate(MV_TAB_FICHA);
          triggerToast(`O mundo sangra novamente, seja bem-vindo ${name}.`);
        })
        .catch((err) => {
          console.error(err);
          alert("Erro ao criar personagem no banco de dados.");
        });
    }
  } catch (err) {
    console.error("Critical error in confirmCharacterCreation:", err);
    alert("Erro crítico durante a criação: " + err.message);
  }
}
window.loadMySQLHero = async function (id) {
  if (!window.allHeroesCache || window.allHeroesCache === "loading") return;
  const target = window.allHeroesCache.find((h) => h.id === id);
  if (target && target.save_data) {
    appState.slots[0] = target.save_data;
    window.mysqlHeroId = target.id;
    localStorage.setItem("SANCTUARY_APEX_V5", JSON.stringify(appState));
    navigate(MV_TAB_FICHA);
    renderSavesTab(); // Atualiza a aba para marcar como ativo
    triggerToast("Alma encarnada com sucesso.");
  }
};

window.purgeMySQLHero = async function (id) {
  if (
    !confirm(
      "Tem certeza que deseja apagar essa alma para sempre do Banco de Dados?",
    )
  )
    return;
  try {
    if (window.dbService) {
      await window.dbService.deleteHero(id);
    }

    window.allHeroesCache = null; // forçar recarregamento

    // Se deletou o herói atual, manda de volta pro menu
    if (window.mysqlHeroId === id) {
      window.location.href = "MenuPrincipal.html";
      return;
    }
    renderSavesTab();
  } catch (e) {
    console.error(e);
    alert("Erro fatal ao deletar herói.");
  }
};
// 2. FICHA, ATRIBUTOS E INVENTÁRIO (BUBBLE SORT) - VERSÃO PROFISSIONAL + TOOLTIP
function _buildPassivesHtml(calc) {
  let pSum = `<strong>Mecânicas Passivas Ativas na Ficha Mística:</strong><br>`;
  if (calc.passives.critChance > 0.05) {
    pSum += `• Chance Letal de Crítico: +${Math.round((calc.passives.critChance - 0.05) * 100)}%<br>`;
  }
  if (calc.passives.critDamage > 1.5) {
    pSum += `• Potência de Crítico: +${Math.round((calc.passives.critDamage - 1.5) * 100)}%<br>`;
  }
  if (calc.passives.lifeSteal > 0) {
    pSum += `• Roubo de Vida: ${Math.round(calc.passives.lifeSteal * 100)}%<br>`;
  }
  if (calc.passives.ignoreDef > 0) {
    pSum += `• Penetração de Armadura: ${Math.round(calc.passives.ignoreDef * 100)}%<br>`;
  }
  if (calc.passives.reflectDmg > 0) {
    pSum += `• Reflexão de Dano: ${Math.round(calc.passives.reflectDmg * 100)}%<br>`;
  }
  if (calc.passives.defMult > 0) {
    pSum += `• Carapaça Mística: +${Math.round(calc.passives.defMult * 100)}% Defesa<br>`;
  }
  if (calc.passives.damageReduction > 0) {
    pSum += `• Redução de Dano: -${Math.round(calc.passives.damageReduction * 100)}%<br>`;
  }
  if (calc.passives.magicResist > 0) {
    pSum += `• Resistência Mágica: -${Math.round(calc.passives.magicResist * 100)}%<br>`;
  }

  if (
    pSum === `<strong>Mecânicas Passivas Ativas na Ficha Mística:</strong><br>`
  ) {
    pSum += "Nenhuma alteração passiva conectada ao seu corpo material ainda.";
  }
  return pSum;
}

function _buildAttributesHtml(hero) {
  // Define global handler if it isn't defined yet
  if (!window.allocateAttributePoint) {
    window.allocateAttributePoint = function (attr) {
      const h = getActiveHero();
      if (!h || h.statPoints <= 0) return;
      if (h.attributes[attr] !== undefined) {
        h.statPoints -= 1;
        h.attributes[attr] += 1;

        if (attr === "constituicao") {
          h.currentHp += 15;
        } else if (attr === "inteligencia") {
          h.currentMana += 10;
        }

        commitStorage();
        if (typeof renderAllEngines === "function") renderAllEngines();
        if (typeof triggerToast === "function")
          triggerToast(`✨ Ponto alocado em ${attr.toUpperCase()}!`);
      }
    };
  }

  const ATTR_TOOLTIPS = {
    forca:
      "FOR — +1.5 Dano Físico/pt. Escala: Guerreiro, Bárbaro, Paladino(Martelo).",
    constituicao: "CON — +15 HP Máx/pt, +0.5 Defesa/pt, +3 Estamina Máx/pt.",
    agilidade: "AGI — +1.5 Dano/pt (Ranger). Afeta evasão e velocidade.",
    inteligencia:
      "INT — +10 Mana Máx/pt, +1.5 Dano Mágico/pt (Arcanista, Necromante).",
    sabedoria: "SAB — +1.5 Dano/pt (Paladino). Escala curas e suportes.",
  };

  let html = "";
  Object.keys(hero.attributes).forEach((attr) => {
    const tooltip = ATTR_TOOLTIPS[attr] || "";
    html += `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.4); padding:12px; border-radius:4px; border:1px solid #2a0b0d;" title="${tooltip}">
                <span style="text-transform:uppercase; font-size:0.9rem; font-weight:bold; color:var(--gold-dim); letter-spacing:1px;">${attr} <span class="attr-tooltip-icon">❓</span></span>
                <div style="display:flex; align-items:center; gap:15px;">
                    <strong style="font-size:1.4rem; color:#fff; text-shadow:0 0 5px #000;">${hero.attributes[attr]}</strong>
                    ${hero.statPoints > 0 ? `<button class="btn btn-success" style="padding:4px 12px; width:auto; border-radius:12px;" onclick="allocateAttributePoint('${attr}')">+1</button>` : ""}
                </div>
            </div>
        `;
  });
  return html;
}

function _buildPaperdollHtml(hero) {
  const classToTarot = {
    Guerreiro: "tarot_class_warrior",
    Arcanista: "tarot_class_arcanist",
    Ranger: "tarot_class_ranger",
    Bárbaro: "tarot_class_barbarian",
    Barbaro: "tarot_class_barbarian",
    Paladino: "tarot_class_paladin",
    Necromante: "tarot_class_necromancer",
  };
  const tarotFile = classToTarot[hero.class] || "tarot_class_warrior";

  const leftSlots = [
    { key: "capacete", label: "Capacete", icon: "⛑️" },
    { key: "arma", label: "Arma Principal", icon: "⚔️" },
    { key: "luvas", label: "Luvas", icon: "🧤" },
    { key: "anel1", label: "Anel Esquerdo", icon: "💍" },
    { key: "colar1", label: "Colar 1", icon: "📿" },
  ];

  const rightSlots = [
    { key: "armadura", label: "Armadura", icon: "🛡️" },
    { key: "escudo", label: "Escudo", icon: "🛡️" },
    { key: "botas", label: "Botas", icon: "🥾" },
    { key: "anel2", label: "Anel Direito", icon: "💍" },
    { key: "colar2", label: "Colar 2", icon: "📿" },
  ];

  function buildSlot(slot) {
    const item = hero.equipment[slot.key];
    let content = "";
    if (item) {
      const stats = [];
      if (item.damage) {
        stats.push(`Dano: <strong>${item.damage}</strong>`);
      }
      if (item.defense) {
        stats.push(`Defesa: <strong>${item.defense}</strong>`);
      }
      if (item.durability) {
        stats.push(`Durab.: ${item.durability}`);
      }

      content = `
                <strong style="color:var(--gold-glowing); font-size:1.05rem;">${item.name}</strong>
                <div style="font-size:0.8rem; color:#a5f3fc; margin:4px 0;">${stats.join(" • ")}</div>
                ${item.intrinsic ? `<div style="font-size:0.75rem; color:#a7f3d0; margin-top:6px;">✨ ${item.intrinsic.label}</div>` : ""}
                ${
                  item.sockets
                    ? `<div style="display:flex; justify-content:center; gap:4px; margin-top:8px;">` +
                      item.sockets
                        .map((s) =>
                          s
                            ? `<div style="width:12px; height:12px; border-radius:50%; background:#a855f7; box-shadow:0 0 5px #a855f7;" title="${s.name}"></div>`
                            : `<div style="width:12px; height:12px; border-radius:50%; border:1px solid #555; background:rgba(0,0,0,0.5);"></div>`,
                        )
                        .join("") +
                      `</div>`
                    : ""
                }
            `;
    } else {
      content = `<span style="color:#555; font-size:0.9rem;">${slot.label} Vazio</span>`;
    }

    return `
            <div class="eq-slot ${item ? "active-equip" : ""}" 
                 data-slot-key="${slot.key}"
                 ondragenter="event.preventDefault()"
                 ondragover="window.handleDragOver(event)"
                 ondragleave="window.handleDragLeave(event)"
                 ondrop="window.handleDrop(event, '${slot.key}')"
                 onclick="unequipItem('${slot.key}')"
                 onmouseenter="${item ? `showItemTooltip(hero.equipment['${slot.key}'], event)` : ""}"
                 onmouseleave="hideItemTooltip()">
                <div class="eq-slot-icon" style="pointer-events: none;">${slot.icon}</div>
                <div class="eq-slot-info" style="pointer-events: none;">${content}</div>
            </div>
        `;
  }

  const leftHtml = leftSlots.map(buildSlot).join("");
  const rightHtml = rightSlots.map(buildSlot).join("");

  return `
      <div class="paperdoll-3d-layout" onmousemove="window.handlePaperdoll3D(event)" onmouseleave="window.resetPaperdoll3D()">
          <div class="paperdoll-column left-column">
              ${leftHtml}
          </div>
          <div class="paperdoll-center-avatar">
              <div style="animation: floatAvatar 4s ease-in-out infinite; transform-style: preserve-3d;">
                  <div class="pd-avatar-mesh" id="pd-avatar-mesh">
                      <img src="./assets/tarot/${tarotFile}.webp" alt="${hero.class}" class="pd-avatar-img" onerror="this.src='./assets/tarot/tarot_class_warrior.webp'">
                      <div class="pd-avatar-glow"></div>
                  </div>
              </div>
          </div>
          <div class="paperdoll-column right-column">
              ${rightHtml}
          </div>
      </div>
  `;
}

function _buildInventoryDeckHtml(hero, filter) {
  let contentHTML = "";
  let itemCount = 0;
  hero.inventory.forEach((item, index) => {
    const isEquip = [
      "arma",
      "capacete",
      "armadura",
      "luvas",
      "botas",
      "escudo",
      "anel",
      "colar",
    ].includes(item.type);
    const isPot = item.type.includes("consumivel");
    const isSpecial = item.type === "lore_fragment" || item.type === "relic";

    if (filter === "Equipamentos" && !isEquip) {
      return;
    }
    if (filter === "Consumíveis" && !isPot) {
      return;
    }
    if (filter === "Especiais" && !isSpecial) {
      return;
    }
    itemCount++;

    let statsHTML = "";
    if (item.damage) {
      statsHTML += `⚔️ Dano: <strong>${item.damage}</strong><br>`;
    }
    if (item.defense) {
      statsHTML += `🛡️ Defesa: <strong>${item.defense}</strong><br>`;
    }
    if (item.power) {
      statsHTML += `⚡ Poder: <strong>+${item.power}</strong><br>`;
    }
    if (item.durability) {
      statsHTML += `🔨 Durab: <strong>${item.durability}</strong><br>`;
    }

    let extraPassives = "";
    if (item.bonusPassives && item.bonusPassives.length > 0) {
      extraPassives = item.bonusPassives
        .map(
          (p) =>
            `<div style="font-size:0.75rem; color:#a7f3d0; margin-top:2px;">✨ ${p.label}</div>`,
        )
        .join("");
    }

    contentHTML += `
            <div class="item-card rare-${item.rarity}" 
                 ${isEquip ? `draggable="true" ondragstart="window.handleDragStart(event, ${index}, '${item.type}')" ondragend="window.handleDragEnd(event)"` : ""}
                 onmouseenter="showItemTooltip(hero.inventory[${index}], event)" 
                 onmouseleave="hideItemTooltip()"
                 style="display: flex; flex-direction: column; cursor: ${isEquip ? "grab" : "default"};">
                <div style="flex-grow: 1; pointer-events: none;">
                    <div class="item-title-row">
                        <strong class="item-name">${item.name}</strong>
                        <span class="item-rarity-tag">${item.rarity}</span>
                    </div>
                    <div class="item-stats-row">${statsHTML}</div>
                    ${item.intrinsic ? `<div class="item-passive-box">✨ ${item.intrinsic.label}</div>${extraPassives}` : ""}
                    ${
                      item.sockets
                        ? `<div style="display:flex; gap:4px; margin-top:8px; padding-bottom:4px;">` +
                          item.sockets
                            .map((s) =>
                              s
                                ? `<div style="width:12px; height:12px; border-radius:50%; background:#a855f7; box-shadow:0 0 5px #a855f7;" title="${s.name}"></div>`
                                : `<div style="width:12px; height:12px; border-radius:50%; border:1px solid #555; background:rgba(0,0,0,0.5);"></div>`,
                            )
                            .join("") +
                          `</div>`
                        : ""
                    }
                    <div class="item-desc-text">"${item.desc || "Um artefato ancestral do Santuário."}"</div>
                </div>
                <div style="display:flex; gap:8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
                    ${
                      item.type === "lore_fragment"
                        ? `<button class="btn btn-secondary btn-small" style="flex:1; background: rgba(255,255,255,0.05); border-color: var(--rarity-color, #fff); color: var(--rarity-color, #fff); box-shadow: 0 0 10px rgba(255,255,255,0.05) inset;" onclick="openLoreWithFragment('${item.fragmentId}')">Ler Fragmento</button>`
                        : item.type === "relic"
                          ? `<span style="flex:1; text-align:center; color:#fbbf24; font-size:0.8rem; font-style:italic;">Efeito Ativo na Mochila</span>`
                          : !isPot
                            ? `
                        <button class="btn btn-small" style="flex:1; background: rgba(0,0,0,0.3); border: 1px solid var(--rarity-color, #fff); color: var(--rarity-color, #fff); text-shadow: 0 0 5px var(--rarity-color, #fff); box-shadow: inset 0 0 10px rgba(255,255,255,0.05);" onclick="equipItemFromInventory(${index})">Equipar</button>
                        <button class="btn btn-small" style="flex:1; background:rgba(220,38,38,0.1); border: 1px solid #dc2626; color:#fca5a5;" onclick="disassembleItem(${index})">Desmontar</button>
                    `
                            : `<button class="btn btn-small" style="flex:1; background: rgba(0,0,0,0.3); border: 1px solid var(--rarity-color, #10b981); color: var(--rarity-color, #10b981);" onclick="useConsumable(${index})">Consumir</button>`
                    }
                </div>
            </div>
        `;
  });

  const MIN_SLOTS = 15;
  for (let i = itemCount; i < MIN_SLOTS; i++) {
    contentHTML += `<div class="empty-slot"><span style="opacity: 0.15">Espaço Vazio</span></div>`;
  }

  return contentHTML;
}

function renderFichaTab(calc) {
  const hero = getActiveHero();
  document.getElementById("char-sheet-title").innerText =
    `${hero.name} — ${hero.class}`;
  document.getElementById("sheet-stat-attack").innerText = calc.attack;
  document.getElementById("sheet-stat-defense").innerText = calc.defense;
  document.getElementById("sheet-txt-xp").innerText =
    `${hero.xp}/${hero.maxXp}`;
  document.getElementById("sheet-fill-xp").style.width =
    `${(hero.xp / hero.maxXp) * 100}%`;

  document.getElementById("sheet-passives-summary").innerHTML =
    _buildPassivesHtml(calc);

  const ptBadge = document.getElementById("sheet-stat-points");
  if (hero.statPoints > 0) {
    ptBadge.innerText = `${hero.statPoints} Pontos Livres`;
    ptBadge.style.display = "inline-block";
  } else {
    ptBadge.style.display = "none";
  }

  const necroContainer = document.getElementById("necromancer-book-container");
  if (necroContainer) {
    if (hero.class === "Necromante") {
      necroContainer.innerHTML = `
        <button class="btn btn-magic" style="width: 100%; margin-bottom: 25px; padding: 15px; font-size: 1.2rem; border-color: #c084fc; color: #e9d5ff;" onclick="openNecromancyBook()">
          💀 Abrir Livro dos Mortos
        </button>
      `;
    } else {
      necroContainer.innerHTML = "";
    }
  }

  const attrBox = document.getElementById("attributes-allocation-engine");
  attrBox.innerHTML = _buildAttributesHtml(hero);

  const paperdoll = document.getElementById("paperdoll-slots-mesh");
  paperdoll.style.gridTemplateColumns = "repeat(auto-fit, minmax(140px, 1fr))";
  paperdoll.style.gap = "12px";
  paperdoll.innerHTML = _buildPaperdollHtml(hero);

  window.setInventoryFilter = function (f) {
    window.currentInventoryFilter = f;
    renderAllEngines();
  };

  const invDeck = document.getElementById("inventory-deck-mesh");
  const filter = window.currentInventoryFilter || "Tudo";

  const filterSelect = document.getElementById("inventory-filter-select");
  if (filterSelect && filterSelect.value !== filter) {
    filterSelect.value = filter;
  }

  invDeck.innerHTML = _buildInventoryDeckHtml(hero, filter);
}

window.handlePaperdoll3D = function (e) {
  const container = e.currentTarget;
  const avatar = document.getElementById("pd-avatar-mesh");
  if (!avatar) return;
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const rotateX = -(y / rect.height) * 20; // 20 deg tilt
  const rotateY = (x / rect.width) * 20;
  avatar.style.transform = `translateZ(30px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  avatar.style.transition = "transform 0.1s ease-out";
};

window.resetPaperdoll3D = function () {
  const avatar = document.getElementById("pd-avatar-mesh");
  if (avatar) {
    avatar.style.transform = "translateZ(0) rotateX(0deg) rotateY(0deg)";
    avatar.style.transition = "transform 0.5s ease-out";
  }
};

function openLoreWithFragment(fragmentId) {
  window.location.href = "Lore.html?fragment=" + encodeURIComponent(fragmentId);
}

window.handleDragStart = function (event, index, itemType) {
  // Fix for Tauri/WebView dataTransfer: use global variables
  window._draggedItemIndex = index;
  window._draggedItemType = itemType;

  // Also try dataTransfer as fallback
  try {
    event.dataTransfer.setData("text/plain", index);
  } catch (e) {
    /* dataTransfer fallback */
  }

  event.target.style.opacity = "0.5";

  document.querySelectorAll(".eq-slot").forEach((slot) => {
    const slotKey = slot.dataset.slotKey;
    if (!slotKey) return;
    if (
      slotKey === itemType ||
      (itemType === "anel" && slotKey.startsWith("anel")) ||
      (itemType === "colar" && slotKey.startsWith("colar"))
    ) {
      slot.classList.add(MV_CLASS_VALID_DROP);
    } else {
      slot.classList.add("invalid-drop-target");
    }
  });
};

window.handleDragEnd = function (event) {
  event.target.style.opacity = "1";
  document.querySelectorAll(".eq-slot").forEach((slot) => {
    slot.classList.remove(MV_CLASS_VALID_DROP);
    slot.classList.remove("invalid-drop-target");
    slot.classList.remove(MV_CLASS_DRAG_HOVER);
  });
  setTimeout(() => {
    window._draggedItemIndex = null;
    window._draggedItemType = null;
  }, 100);
};

window.handleDragOver = function (event) {
  event.preventDefault(); // Necessary to allow dropping
  const slot = event.currentTarget;
  if (slot.classList.contains(MV_CLASS_VALID_DROP)) {
    slot.classList.add(MV_CLASS_DRAG_HOVER);
  }
};

window.handleDragLeave = function (event) {
  event.currentTarget.classList.remove(MV_CLASS_DRAG_HOVER);
};

window.handleDrop = function (event, targetSlotKey) {
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget.classList.remove(MV_CLASS_DRAG_HOVER);

  let index = window._draggedItemIndex;
  let itemType = window._draggedItemType;

  // Fallback
  if (index == null) {
    const indexStr = event.dataTransfer.getData("text/plain");
    if (indexStr) index = parseInt(indexStr);
  }

  if (index == null) {
    triggerToast(
      "Erro interno: Item n\u00E3o reconhecido no drag and drop.",
      "error",
    );
    return;
  }

  let isValid = false;
  if (targetSlotKey === itemType) isValid = true;
  if (itemType === "anel" && targetSlotKey.startsWith("anel")) isValid = true;
  if (itemType === "colar" && targetSlotKey.startsWith("colar")) isValid = true;

  if (isValid) {
    equipItemToSpecificSlot(index, targetSlotKey);
  } else {
    triggerToast("Este item n\u00E3o pode ser equipado neste slot!", "error");
  }
};

function equipItemToSpecificSlot(index, slotKey) {
  const hero = getActiveHero();
  const item = hero.inventory[index];
  if (!item) return;

  const currentEquipped = hero.equipment[slotKey];
  hero.equipment[slotKey] = item;
  hero.inventory.splice(index, 1);

  if (currentEquipped) {
    hero.inventory.push(currentEquipped);
  }

  commitStorage();
  renderAllEngines();
  triggerToast(`Equipado: ${item.name}`);
}

function equipItemFromInventory(index) {
  const hero = getActiveHero();
  const item = hero.inventory[index];
  if (!item) {
    return;
  }

  let slotKey = item.type;

  // Mapeamento de tipos para slots múltiplos
  if (slotKey === "anel") {
    slotKey = hero.equipment.anel1 ? "anel2" : "anel1";
  } else if (slotKey === "colar") {
    slotKey = hero.equipment.colar1 ? "colar2" : "colar1";
  }

  const currentEquipped = hero.equipment[slotKey];
  hero.equipment[slotKey] = item;
  hero.inventory.splice(index, 1);

  if (currentEquipped) {
    hero.inventory.push(currentEquipped);
  }

  commitStorage();
  renderAllEngines();
  triggerToast(`Equipado: ${item.name} → ${slotKey}`);
}

function unequipItem(slotKey) {
  const hero = getActiveHero();
  const item = hero.equipment[slotKey];
  if (!item) {
    return;
  }

  hero.equipment[slotKey] = null;
  hero.inventory.push(item);

  commitStorage();
  renderAllEngines();
  triggerToast(`Desequipado: ${item.name}`);
}

window.disassembleItem = function (index) {
  const hero = getActiveHero();
  const item = hero.inventory[index];
  if (!item) {
    return;
  }

  // Calcula recompensas
  const goldReturn = Math.floor((item.power || item.damage || 10) * 1.5);
  const materialAmount = Math.floor((item.power || item.damage || 10) / 8) + 2;

  const goodMats = [
    "mithril",
    "prata",
    "ouro_bruto",
    "esmeralda",
    "adamantium",
    "diamante",
    "lagrima_divina",
  ];
  const commonMats = ["ferro", "cobre", "couro", "carvao"];

  // Distribui materiais
  for (let i = 0; i < materialAmount; i++) {
    let chosenMat;
    if (Math.random() /* nosonar */ < 0.45 && item.rarity !== "Normal") {
      chosenMat =
        goodMats[Math.floor(Math.random() /* nosonar */ * goodMats.length)];
    } else {
      chosenMat =
        commonMats[Math.floor(Math.random() /* nosonar */ * commonMats.length)];
    }
    hero.materials[chosenMat] = (hero.materials[chosenMat] || 0) + 1;
  }

  hero.gold += goldReturn;

  const itemName = item.name;
  hero.inventory.splice(index, 1);

  commitStorage();
  renderAllEngines();

  triggerScreenShake();
  triggerToast(
    `⚒️ ${itemName} foi desmontado com sucesso!<br>+${goldReturn} 🪙 | +${materialAmount} materiais`,
  );
};

function triggerInventorySort(criteria) {
  const hero = getActiveHero();
  if (!hero || hero.inventory.length <= 1) {
    return;
  }
  const arr = hero.inventory;
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      let shouldSwap = false;
      if (criteria === "dano" && arr[j].power < arr[j + 1].power) {
        shouldSwap = true;
      }
      if (criteria === "raridade") {
        const weight = { Normal: 1, Magico: 2, Raro: 3, Lendario: 4 };
        if (weight[arr[j].rarity] < weight[arr[j + 1].rarity]) {
          shouldSwap = true;
        }
      }
      if (shouldSwap) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  hero.inventory = arr;
  commitStorage();
  renderAllEngines();
  triggerToast(
    `A magia Bubble Sort reordenou fisicamente o seu inventário procedimental.`,
  );
}

// 3. GRIMÓRIO MÍSTICO
function renderGrimorioTab() {
  const hero = getActiveHero();
  const shelf = document.getElementById("skills-shelf-mesh");
  const equippedShelf = document.getElementById("skills-equipped-mesh");

  if (!shelf) return;
  shelf.innerHTML = "";
  if (equippedShelf) equippedShelf.innerHTML = "";

  if (!hero.skills) hero.skills = {};
  if (!hero.equippedSkills) hero.equippedSkills = [];

  const totalEquipped = hero.equippedSkills.length;
  document.getElementById("skills-free-points").innerText =
    `${hero.skillPoints} (Equipadas: ${totalEquipped}/7)`;

  let className = hero.class === "Bárbaro" ? "Barbaro" : hero.class;
  const classSkills = MASTER_SKILLS_DATA[className] || [];

  classSkills.forEach((skill) => {
    const currentRank = hero.skills[skill.id] || 0;
    const isMaxed = currentRank >= 5;

    let resName = "Mana";
    let resSuffix = "MP";
    
    if (["Bárbaro", "Barbaro"].includes(hero.class)) {
      resName = "Sangue";
      resSuffix = "HP";
    } else if (hero.class === "Guerreiro") {
      resName = "Fúria";
      resSuffix = "FR";
    } else if (hero.class === "Paladino") {
      resName = "Fé";
      resSuffix = "FÉ";
    } else if (hero.class === "Ranger") {
      resName = "Foco";
      resSuffix = "FC";
    }

    let reqWarningTag = skill.reqStat
      ? `<div class="rune-req-warning">⚠️ Requer ${skill.reqStat.id.toUpperCase()} >= ${skill.reqStat.value}</div>`
      : "";
    let effectTag = skill.effect
      ? `<span class="rune-tag rune-effect">${skill.effect.type.toUpperCase()}</span>`
      : "";
    const starIcon = isMaxed ? " 🌟" : "";

    const skillTypeClass = `type-${skill.type
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")}`;

    const cardHtml = `
          <div class="skill-card ${skillTypeClass} ${isMaxed ? "maxed-out" : ""}">
              <div class="skill-card-content">
                  <div class="skill-header">
                      <div class="skill-title-group">
                          <div style="display: flex; align-items: center; gap: 10px;">
                              ${skill.icon ? `<img src="${skill.icon}" style="width:32px; height:32px; border-radius:4px; object-fit:cover; border:1px solid rgba(255,255,255,0.2); box-shadow:0 0 5px rgba(0,0,0,0.8);" onerror="this.style.display='none'">` : ""}
                              <span class="skill-name">${skill.name}${starIcon}</span>
                          </div>
                          <div class="skill-runes-container">
                              <span class="rune-tag rune-cost">${skill.cost} ${resSuffix}</span>
                              <span class="rune-tag rune-type">${skill.type.toUpperCase()}</span>
                              <span class="rune-tag" style="color:#fbbf24; border-color:rgba(251, 191, 36, 0.3);">Escala: ${skill.stats.toUpperCase()} (x${skill.ratio})</span>
                              ${effectTag}
                          </div>
                          ${reqWarningTag}
                      </div>
                      <div class="skill-rank-seal">
                          <span class="rank-number">${currentRank}</span><span class="rank-max">/5</span>
                      </div>
                  </div>
                  
                  <p class="skill-desc">${skill.desc}</p>
                  <div class="skill-passive-lock ${isMaxed ? "passive-unlocked" : ""}">
                      <strong>Poder Desperto:</strong> ${skill.passives}
                  </div>
              </div>
              
              <div style="display: flex; gap: 10px; margin-top: 15px;">
                  <button class="btn btn-grimoire-upgrade" style="flex: 2; font-size: 0.85rem;" ${currentRank >= 5 || hero.skillPoints <= 0 ? "disabled" : ""} onclick="upgradeSkillRank('${skill.id}')">
                      ${currentRank >= 5 ? "Iluminação Alcançada" : "Aprofundar (-1 Ponto)"}
                  </button>
                  <button class="btn" style="flex: 1; font-size: 0.85rem; border-color: ${hero.equippedSkills.includes(skill.id) ? "#ef4444" : "#10b981"}; color: ${hero.equippedSkills.includes(skill.id) ? "#fca5a5" : "#6ee7b7"};" ${currentRank === 0 ? "disabled" : ""} onclick="toggleSkillEquip('${skill.id}')">
                      ${hero.equippedSkills.includes(skill.id) ? "Desequipar" : "Equipar"}
                  </button>
              </div>
          </div>
      `;

    if (hero.equippedSkills.includes(skill.id) && equippedShelf) {
      equippedShelf.innerHTML += cardHtml;
    } else {
      shelf.innerHTML += cardHtml;
    }
  });

  updateFusionDropdowns();
}

function updateFusionDropdowns() {
  const hero = getActiveHero();
  const select1 = document.getElementById("fusion-skill-1");
  const select2 = document.getElementById("fusion-skill-2");

  if (!select1 || !select2) return;

  const val1 = select1.value;
  const val2 = select2.value;

  let className = hero.class === "Bárbaro" ? "Barbaro" : hero.class;
  const classSkills = MASTER_SKILLS_DATA[className] || [];

  let optionsHtml =
    '<option value="" style="color:#9ca3af">Selecione uma magia...</option>';

  classSkills.forEach((skill) => {
    if (hero.skills && hero.skills[skill.id] > 0) {
      optionsHtml += `<option value="${skill.id}">${skill.name} (Rank ${hero.skills[skill.id]})</option>`;
    }
  });
  select1.innerHTML = optionsHtml;
  select2.innerHTML = optionsHtml;

  if (val1) select1.value = val1;
  if (val2) select2.value = val2;
}

function upgradeSkillRank(id) {
  const hero = getActiveHero();
  const sk = MASTER_SKILLS_DATA[hero.class].find((s) => s.id === id);

  if (sk && sk.reqStat) {
     if ((hero.attributes[sk.reqStat.id] || 0) < sk.reqStat.value) {
        return triggerToast(`Requisito não atendido: ${sk.reqStat.id} >= ${sk.reqStat.value}`);
     }
  }
  
  if (sk && sk.reqSkill) {
     const reqRank = hero.skills[sk.reqSkill.id] || 0;
     if (reqRank < sk.reqSkill.rank) {
        return triggerToast(`Habilidade anterior insuficiente (Requer Rank ${sk.reqSkill.rank})`);
     }
  }

  if (hero.skillPoints > 0 && (hero.skills[id] || 0) < 5) {
    hero.skills[id] = (hero.skills[id] || 0) + 1;
    hero.skillPoints--;
    commitStorage();
    renderAllEngines();
    triggerToast("O selo místico da habilidade foi quebrado e expandido!");
  } else if (hero.skillPoints <= 0) {
    triggerToast("Pontos de Aprofundamento insuficientes!");
  }
}

window.toggleSkillEquip = function (id) {
  const hero = getActiveHero();
  if (!hero) return;
  if (!hero.equippedSkills) hero.equippedSkills = [];

  const index = hero.equippedSkills.indexOf(id);
  if (index > -1) {
    // Desequipa
    hero.equippedSkills.splice(index, 1);
  } else {
    // Equipa
    if (hero.equippedSkills.length >= 7) {
      return triggerToast(
        "Você só pode equipar até 7 magias ativas no deck de combate.",
      );
    }
    hero.equippedSkills.push(id);
  }
  commitStorage();
  renderAllEngines();
};

// 4. COMPANHEIROS
function renderCompanionsTab() {
  const hero = getActiveHero();
  const mesh = document.getElementById("companions-mesh");
  mesh.innerHTML = "";
  if (hero.companions.length === 0) {
    mesh.innerHTML = `<div style="color:var(--text-muted); font-style:italic;">Não existem almas seguidoras em seu bando de guerra. Resgate-os nos eventos aleatórios das masmorras infernais.</div>`;
    return;
  }

  hero.companions.forEach((c) => {
    const passInfo = COMPANION_PASSIVES.find((p) => p.id === c.passiveId);
    mesh.innerHTML += `
                    <div class="comp-card ${c.equipped ? "active-comp" : ""}" onmouseenter="showCompanionTooltip({name:'${c.name.replace(/'/g, "\\'")}', desc:'${c.desc.replace(/'/g, "\\'")}', affinity:${c.affinity}, equipped:${c.equipped}}, ${passInfo ? `{desc:'${passInfo.desc.replace(/'/g, "\\'")}'}` : "null"}, event)" onmouseleave="hideCompanionTooltip()" style="display:flex; gap:15px; text-align:left;">
                        <img src="${c.avatar}" alt="${c.name}" style="width:100px; height:150px; border-radius:4px; object-fit:cover; border:1px solid #333;" onerror="this.style.display='none'">
                        <div style="flex:1;">
                            <div style="font-size:1.4rem; font-family:'UnifrakturCook'; font-weight:bold; color:var(--gold-glowing); margin-bottom:5px;">${c.name}</div>
                            <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom:12px;">${c.desc}</div>
                            <div style="font-size:0.85rem; font-weight:bold; color:var(--mana-blue);">Nível de Lealdade Vínculada: Coração Nv. ${c.affinity}</div>
                            <div class="comp-affinity-bar"><div class="comp-affinity-fill" style="width:${Math.min(100, c.affinity)}%"></div></div>
                            <div class="comp-passive-box">${passInfo ? passInfo.desc : "Não possui bonificadores catalogados em sua alma."}</div>
                            <div style="display:flex; gap:10px; margin-top:15px;">
                                <button class="btn btn-secondary btn-small" onclick="interactCompanion('${c.id}')">Sentar na Fogueira (+1 Lealdade)</button>
                                <button class="btn btn-small" onclick="toggleCompanion('${c.id}')">${c.equipped ? "Dispensar a Retaguarda" : "Convocar para a Linha de Combate"}</button>
                            </div>
                        </div>
                    </div>
    `;
  });
}
function interactCompanion(id) {
  const h = getActiveHero();
  const c = h.companions.find((x) => x.id === id);
  if (c) {
    c.affinity += 1;
    triggerToast(`A intimidade e laços de guerra com ${c.name} aumentaram!`);
    commitStorage();
    renderAllEngines();
  }
}
function toggleCompanion(id) {
  const h = getActiveHero();
  h.companions.forEach((c) => {
    if (c.id === id) {
      c.equipped = !c.equipped;
    } else {
      c.equipped = false;
    }
  });
  commitStorage();
  renderAllEngines();
  triggerToast("Formação de guerra estratégica ajustada com perfeição.");
}

// 5. A MINA ABISSAL (NOVO GATHERING)
function renderMinaTab() {
  const hero = getActiveHero();
  document.getElementById("mine-floor-indicator").innerText = hero.dungeonLevel;
  const mesh = document.getElementById("materials-grid-mesh");
  mesh.innerHTML = "";

  ALL_MATERIALS.forEach((m) => {
    if (hero.materials[m.id] > 0) {
      mesh.innerHTML += `
                        <div class="mat-item-card" style="border-color:${m.color}33;" onmouseenter="showMaterialTooltip({name:'${m.name}', color:'${m.color}'}, ${hero.materials[m.id]}, event)" onmouseleave="hideMaterialTooltip()">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                ${m.icon ? `<img src="${m.icon}" style="width:28px; height:28px; object-fit:contain; filter: drop-shadow(0 0 2px ${m.color});">` : ""}
                                <span style="color:${m.color}; font-size:1.1rem; text-shadow:0 0 5px ${m.color}55;">${m.name}</span> 
                            </div>
                            <span style="font-size:1.4rem; color:#fff; font-family:monospace;">${hero.materials[m.id]}</span>
                        </div>
                    `;
    }
  });
}
function executeMining() {
  const hero = getActiveHero();
  if (hero.stamina < 15) {
    return triggerToast(
      "Braços fatigados... Descanso compulsório requerido. Visite a fogueira.",
    );
  }

  hero.stamina -= 15;

  const t1 = ["ferro", "cobre", "carvao", "couro"];
  const t2 = ["prata", "ouro_bruto", "quartzo", "escama"];
  const t3 = ["mithril", "esmeralda", "rubi", "pano_espectral"];
  const t4 = ["adamantium", "platina", "diamante", "chifre_demoniaco"];

  let pool = t1;
  if (hero.dungeonLevel > 5) {
    pool = pool.concat(t2);
  }
  if (hero.dungeonLevel > 10) {
    pool = pool.concat(t3);
  }
  if (hero.dungeonLevel > 15) {
    pool = pool.concat(t4);
  }

  const rolledMatId =
    pool[Math.floor(Math.random() /* nosonar */ * pool.length)];
  const amtBase = Math.floor(Math.random() /* nosonar */ * 3) + 1;
  const finalAmt =
    rolledMatId === "ferro" || rolledMatId === "couro" ? amtBase * 2 : amtBase; // Boost em material comum

  hero.materials[rolledMatId] += finalAmt;
  const matInfo = ALL_MATERIALS.find((m) => m.id === rolledMatId);

  document.getElementById("mining-result").innerHTML = `
                <span style="color:${matInfo.color}; text-shadow:0 0 8px ${matInfo.color}88; font-size:1.4rem;">
                    ⛏️ CRASH! A picareta rompeu rochas antigas. Mãos sujas revelam: +${finalAmt}x ${matInfo.name} puro.
                </span>
            `;
  triggerScreenShake();
  commitStorage();
  renderAllEngines();
}

// 6. ACAMPAMENTO E TREINO
function performConditioning(attr) {
  const hero = getActiveHero();
  if (hero.gold < 50 || hero.stamina < 30) {
    return triggerToast(
      "A economia ou estamina corporal de Sanctuary estão exauridas em seu ser.",
    );
  }
  hero.gold -= 50;
  hero.stamina -= 30;
  hero.attributes[attr]++;
  triggerScreenShake();
  commitStorage();
  renderAllEngines();
  triggerToast(
    `🏋️ Músculo rasgado e curado. ${attr.toUpperCase()} escalado absurdamente no treinamento de base.`,
  );
}
function restCharacterFull() {
  const hero = getActiveHero();
  const calc = computeLiveStats();
  hero.stamina = calc.maxStamina;
  hero.currentHp = calc.maxHp;
  hero.currentMana = calc.maxMp;
  commitStorage();
  renderAllEngines();
  triggerToast(
    "As brasas celestes queimam... Seus status físicos, espirituais e estamina foram 100% restituídos nas fogueiras quentes.",
  );
}

// 7. LOJA E FORJA AVANÇADA
function buyShopItem(type, cost) {
  const h = getActiveHero();
  if (h.gold < cost) {
    return triggerToast(
      "Os mercadores riem da sua falta de moedas reluzentes.",
    );
  }
  h.gold -= cost;
  if (type === "pot_hp") {
    h.inventory.push({
      id: "pot_hp_" + Date.now(),
      name: "Poção Escarlate Extrema",
      type: "consumivel_hp",
      rarity: "Normal",
      power: 200,
      desc: "Mendigos matariam por este HP engarrafado.",
    });
  }
  if (type === "pot_mp") {
    h.inventory.push({
      id: "pot_mp_" + Date.now(),
      name: "Frasco de Fumaça Azul",
      type: "consumivel_mp",
      rarity: "Normal",
      power: 150,
      desc: "Regenera 150 Mentes Arcanas.",
    });
  }
  commitStorage();
  renderAllEngines();
  triggerToast("O pacto de compra foi selado sem impostos governamentais.");
}
function sellTrashLoot() {
  const h = getActiveHero();
  if (h.inventory.length === 0) {
    return triggerToast("O Vazio cósmico reside em seu Inventário Baú Geral.");
  }
  let profit = 0;
  h.inventory.forEach((i) => {
    if (i.rarity === "Normal") {
      profit += 15;
    } else if (i.rarity === "Magico") {
      profit += 45;
    } else if (i.rarity === "Raro") {
      profit += 150;
    } else {
      profit += 600;
    }
  });
  h.gold += profit;
  h.inventory = [];
  commitStorage();
  renderAllEngines();
  triggerToast(
    `💰 Mercador Goblin Comprou suas sucatas por ${profit} Moedas pesadas!`,
  );
}
// ====================== FORJA + UPGRADE ======================
function executeBlacksmithForge() {
  const hero = getActiveHero();
  const tier = document.getElementById("forge-tier-select").value;
  const focus = document.getElementById("forge-focus-select").value;

  let req = {};
  if (tier === "Normal") {
    req = { ferro: 6, cobre: 4 };
  }
  if (tier === "Magico") {
    req = { prata: 6, escama: 4, quartzo: 2 };
  }
  if (tier === "Raro") {
    req = { mithril: 6, ouro_bruto: 4, esmeralda: 2 };
  }
  if (tier === "Lendario") {
    req = { adamantium: 8, diamante: 4, lagrima_divina: 2 };
  }

  let canCraft = true;
  Object.keys(req).forEach((k) => {
    if ((hero.materials[k] || 0) < req[k]) {
      canCraft = false;
    }
  });
  if (!canCraft) {
    return triggerToast("Faltam materiais para forjar!");
  }

  Object.keys(req).forEach((k) => {
    hero.materials[k] -= req[k];
  });

  const types = [
    "arma",
    "capacete",
    "armadura",
    "luvas",
    "botas",
    "escudo",
    "anel",
  ];
  const prefixes = [
    "Aniquilador",
    "Titã",
    "Mortalha",
    "Infernal",
    "Celestial",
    "Abissal",
    "Voraz",
  ];
  const cType = types[Math.floor(Math.random() /* nosonar */ * types.length)];

  let basePower =
    hero.level * 7 +
    (tier === "Lendario"
      ? 85
      : tier === "Raro"
        ? 48
        : tier === "Magico"
          ? 26
          : 9);
  if (focus === "damage") {
    basePower = Math.floor(basePower * 1.28);
  }
  if (focus === "defense") {
    basePower = Math.floor(basePower * 1.15);
  }

  let damage = 0,
    defense = 0;
  if (["arma", "escudo"].includes(cType)) {
    damage = basePower;
  } else {
    defense = Math.floor(basePower * 1.15); // Armaduras ganham bônus
  }

  let intrinsic = null;
  if (tier !== "Normal") {
    intrinsic = JSON.parse(
      JSON.stringify(
        ITEM_PASSIVES_POOL[
          Math.floor(Math.random() /* nosonar */ * ITEM_PASSIVES_POOL.length)
        ],
      ),
    );
    if (focus === "crit" && intrinsic.type.includes("crit")) {
      intrinsic.value = Math.floor(intrinsic.value * 1.7);
    }
    if (focus === "vamp" && intrinsic.type === "lifeSteal") {
      intrinsic.value = Math.floor(intrinsic.value * 1.9);
    }
  }

  const durability =
    35 + Math.floor(hero.level * 2.5) + (tier === "Lendario" ? 40 : 0);

  hero.inventory.push({
    id: "forge_" + Date.now(),
    name: `${prefixes[Math.floor(Math.random() /* nosonar */ * prefixes.length)]} ${cType.charAt(0).toUpperCase() + cType.slice(1)} [${tier}]`,
    type: cType,
    rarity: tier,
    damage: damage,
    defense: defense,
    durability: durability,
    maxDurability: durability,
    power: basePower,
    desc: `Forjado com ${focus === "balanced" ? "equilíbrio" : focus}. A bigorna cósmica cantou ao martelo.`,
    intrinsic: intrinsic,
  });

  triggerScreenShake();
  commitStorage();
  renderAllEngines();
  triggerToast(`🔨 Item lendário forjado com foco em ${focus}!`);
}

function executeAdvancedForge() {
  const tier = document.getElementById("forge-tier-select").value;
  const focus = document.getElementById("forge-focus-select").value; // Novo: Foco
}

// ====================== NOVO: UPGRADE DE ITENS ======================
// function renderForgeAndMarket() {
//   renderGlobalMarket();
//   renderUpgradeInventory();
// }

function renderUpgradeInventory() {
  const hero = getActiveHero();
  const container = document.getElementById("upgrade-inventory-mesh");
  container.innerHTML = "";

  const upgradable = hero.inventory.filter(
    (item) => !item.type.includes("consumivel"),
  );

  if (upgradable.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:20px;">Nenhum equipamento elegível para upgrade no momento.</p>`;
    return;
  }

  upgradable.forEach((item, globalIndex) => {
    const realIndex = hero.inventory.indexOf(item);
    const costGold = Math.floor(item.power * 1.8 + 60);
    const costMat = Math.floor(item.power / 4) + 5;

    container.innerHTML += `
                    <div class="item-card rare-${item.rarity}" style="margin-bottom:12px;">
                        <div class="item-title-row">
                            <strong class="item-name">${item.name}</strong>
                            <span class="item-rarity-tag">${item.rarity}</span>
                        </div>
                        <div class="item-stats-row">Poder: <strong>+${item.power}</strong> | ${item.type.toUpperCase()}</div>
                        ${item.intrinsic ? `<div class="item-passive-box">✨ ${item.intrinsic.label}</div>` : ""}
                        
                        <div style="margin-top:12px; font-size:0.85rem; color:var(--gold-dim);">
                            Custo Upgrade: <strong>${costGold} 🪙</strong> + <strong>${costMat} Materiais Variados</strong>
                        </div>
                    </div>
                `;
  });
}

function performItemUpgrade(invIndex) {
  const hero = getActiveHero();
  const item = hero.inventory[invIndex];
  if (!item || item.type.includes("consumivel")) {
    return;
  }

  const costGold = Math.floor(item.power * 1.8 + 60);
  const costMat = Math.floor(item.power / 4) + 5;

  if (hero.gold < costGold) {
    return triggerToast("Não há ouro suficiente para pagar o ferreiro.");
  }

  // Consome materiais aleatórios (mais realista)
  let matsSpent = 0;
  const matKeys = Object.keys(hero.materials).filter(
    (k) => hero.materials[k] > 0,
  );
  if (matKeys.length === 0) {
    return triggerToast("Você precisa de materiais para reforçar o item.");
  }

  for (let i = 0; i < costMat; i++) {
    const randomMat =
      matKeys[Math.floor(Math.random() /* nosonar */ * matKeys.length)];
    if (hero.materials[randomMat] > 0) {
      hero.materials[randomMat]--;
      matsSpent++;
    }
  }

  if (matsSpent < costMat / 2) {
    return triggerToast("Materiais insuficientes para a melhoria.");
  }

  hero.gold -= costGold;

  // Upgrade principal
  const powerGain = Math.floor(item.power * 0.45) + 12;
  item.power += powerGain;

  // Chance de melhorar raridade / passiva
  if (Math.random() /* nosonar */ < 0.65 && item.rarity !== "Lendario") {
    const rarities = ["Normal", "Magico", "Raro", "Lendario"];
    const currentIdx = rarities.indexOf(item.rarity);
    item.rarity = rarities[Math.min(currentIdx + 1, 3)];
  }

  // Fortalecer ou adicionar passiva
  if (!item.intrinsic && Math.random() /* nosonar */ < 0.55) {
    item.intrinsic = JSON.parse(
      JSON.stringify(
        ITEM_PASSIVES_POOL[
          Math.floor(Math.random() /* nosonar */ * ITEM_PASSIVES_POOL.length)
        ],
      ),
    );
  } else if (item.intrinsic) {
    item.intrinsic.value = Math.floor(item.intrinsic.value * 1.25);
  }

  triggerScreenShake();
  commitStorage();
  renderAllEngines();
  triggerToast(
    `⚒️ ${item.name} foi aprimorado com sucesso! +${powerGain} Poder.`,
  );
}

function transmuteItems() {
  const hero = getActiveHero();
  const rarities = ["Normal", "Magico", "Raro", "Lendario"];

  for (let r = rarities.length - 1; r >= 0; r--) {
    const currentRarity = rarities[r];
    const candidates = hero.inventory.filter(
      (i) => !i.type.includes("consumivel") && i.rarity === currentRarity,
    );

    if (candidates.length >= 3) {
      // Remove 3 itens
      for (let i = 0; i < 3; i++) {
        const idx = hero.inventory.indexOf(candidates[i]);
        hero.inventory.splice(idx, 1);
      }

      // Cria item superior
      const newRarity = rarities[Math.min(r + 1, 3)];
      const types = [
        "arma",
        "capacete",
        "armadura",
        "luvas",
        "botas",
        "escudo",
        "anel",
      ];
      const newType =
        types[Math.floor(Math.random() /* nosonar */ * types.length)];

      let damage = 0;
      let defense = 0;
      const basePower = Math.floor(hero.level * 12 + 45);

      if (["arma", "escudo"].includes(newType)) {
        damage = basePower;
      } else {
        defense = Math.floor(basePower * 1.15);
      }

      const newItem = {
        id: "transmute_" + Date.now(),
        name: `Relíquia Transmutada [${newRarity}]`,
        type: newType,
        rarity: newRarity,
        damage: damage,
        defense: defense,
        power: basePower,
        desc: "Nascido da fusão alquímica de três relíquias.",
        intrinsic:
          ITEM_PASSIVES_POOL[
            Math.floor(Math.random() /* nosonar */ * ITEM_PASSIVES_POOL.length)
          ],
        durability: 60 + hero.level * 3,
        maxDurability: 60 + hero.level * 3,
      };

      hero.inventory.push(newItem);
      commitStorage();
      renderAllEngines();
      triggerToast(
        `🌟 TRANSMUTAÇÃO BEM-SUCEDIDA! Um item ${newRarity} foi criado das cinzas!`,
      );
      return;
    }
  }

  triggerToast(
    "Você precisa de pelo menos 3 itens da mesma raridade para transmutar.",
  );
}

// ====================== NOVO: SISTEMA DE ENCHANTAMENTO ======================
function renderEnchantInventory() {
  const hero = getActiveHero();
  const container = document.getElementById("enchant-inventory-mesh");
  container.innerHTML = "";

  const enchantable = hero.inventory.filter(
    (item) => !item.type.includes("consumivel") && item.rarity !== "Normal",
  );

  if (enchantable.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:25px;">Você precisa de itens Mágicos ou superiores para encantar.</p>`;
    return;
  }

  enchantable.forEach((item, idx) => {
    const realIndex = hero.inventory.indexOf(item);
    container.innerHTML += `
            <div class="item-card rare-${item.rarity}" style="margin-bottom:12px;">
                <div class="item-title-row">
                    <strong>${item.name}</strong>
                    <span class="item-rarity-tag">${item.rarity}</span>
                </div>
                <div class="item-stats-row">Poder: +${item.power}</div>
                ${item.intrinsic ? `<div class="item-passive-box">✨ ${item.intrinsic.label}</div>` : ""}
                
                <button class="btn btn-magic btn-small" style="margin-top:12px; width:100%;" 
                        onclick="performEnchantment(${realIndex})">
                    ✨ Encantar Item (Alto Risco)
                </button>
            </div>
        `;
  });
}

function performEnchantment(invIndex) {
  const hero = getActiveHero();
  const item = hero.inventory[invIndex];
  if (!item || item.type.includes("consumivel")) {
    return;
  }

  const costGold = 120;
  const costEpic = 2;
  const costDivine = 1;

  if (
    hero.gold < costGold ||
    (hero.materials.essencia_epica || 0) < costEpic ||
    (hero.materials.lagrima_divina || 0) < costDivine
  ) {
    return triggerToast("Faltam recursos para o ritual de encantamento.");
  }

  if (
    !confirm(
      `Deseja realmente encantar "${item.name}"?\n\nCusto: ${costGold} PO + 2 Essência Épica + 1 Lágrima Divina\nRisco: 15% de destruir o item.`,
    )
  ) {
    return;
  }

  hero.gold -= costGold;
  hero.materials.essencia_epica =
    (hero.materials.essencia_epica || 0) - costEpic;
  hero.materials.lagrima_divina =
    (hero.materials.lagrima_divina || 0) - costDivine;

  const success = Math.random() /* nosonar */ > 0.15; // 85% de sucesso

  if (success) {
    // Adiciona ou melhora enchant
    if (!item.intrinsic || Math.random() /* nosonar */ < 0.6) {
      item.intrinsic = JSON.parse(
        JSON.stringify(
          ITEM_PASSIVES_POOL[
            Math.floor(Math.random() /* nosonar */ * ITEM_PASSIVES_POOL.length)
          ],
        ),
      );
      item.intrinsic.value = Math.floor(
        item.intrinsic.value * (1.4 + Math.random() /* nosonar */ * 0.6),
      );
    } else {
      item.intrinsic.value = Math.floor(item.intrinsic.value * 1.35);
    }
    item.power = Math.floor(item.power * 1.18);
    triggerToast(
      `✨ Encantamento bem-sucedido! ${item.name} ganhou um poder místico.`,
    );
  } else {
    // Falha crítica
    if (Math.random() /* nosonar */ < 0.6) {
      hero.inventory.splice(invIndex, 1);
      triggerToast(
        "💥 O ritual falhou... O item foi destruído pela energia instável.",
      );
      triggerScreenShake();
    } else {
      item.power = Math.floor(item.power * 0.75);
      triggerToast(
        "⚠️ O encantamento falhou parcialmente. O item foi enfraquecido.",
      );
    }
  }

  commitStorage();
  renderAllEngines();
}

// ====================== SISTEMA DE SOCKETS E RUNAS ======================

const RUNE_POOL = [
  {
    id: "r_crit",
    name: "Runa de Fúria",
    type: "offense",
    effect: { critChance: 0.08, critDamage: 0.25 },
    desc: "+8% Crit Chance e +25% Crit Dano",
  },
  {
    id: "r_vamp",
    name: "Runa Vampírica",
    type: "vamp",
    effect: { lifeSteal: 0.12 },
    desc: "+12% Roubo de Vida",
  },
  {
    id: "r_def",
    name: "Runa de Proteção",
    type: "defense",
    effect: { defMult: 0.15 },
    desc: "+15% Defesa Total",
  },
  {
    id: "r_fire",
    name: "Runa de Chamas",
    type: "element",
    effect: { burn: { power: 25, duration: 3 } },
    desc: "Aplica Queimadura em ataques",
  },
  {
    id: "r_ice",
    name: "Runa Glacial",
    type: "element",
    effect: { freezeChance: 0.25 },
    desc: "25% chance de Congelar",
  },
];

function addSocketsToItem(item) {
  if (!item.sockets) {
    item.sockets = [];
  }
  const maxSockets =
    item.rarity === "Lendario" ? 3 : item.rarity === "Raro" ? 2 : 1;
  while (item.sockets.length < maxSockets) {
    item.sockets.push(null); // socket vazio
  }
}

function renderSocketInventory() {
  const hero = getActiveHero();
  const container = document.getElementById("socket-inventory-mesh");
  container.innerHTML = "";

  const socketable = hero.inventory.filter(
    (item) => !item.type.includes("consumivel"),
  );

  socketable.forEach((item, idx) => {
    const realIndex = hero.inventory.indexOf(item);
    if (!item.sockets) {
      addSocketsToItem(item);
    }

    let socketsHTML = "";
    item.sockets.forEach((rune, sIdx) => {
      socketsHTML += `
                <div style="display:inline-block; width:48px; height:48px; border:2px dashed #666; margin:2px; border-radius:6px; background:#111; text-align:center; line-height:44px; font-size:1.4rem;">
                    ${rune ? "⚡" : "◌"}
                </div>`;
    });

    container.innerHTML += `
            <div class="item-card rare-${item.rarity}" style="margin-bottom:12px;">
                <div class="item-title-row">
                    <strong>${item.name}</strong>
                    <span class="item-rarity-tag">${item.rarity}</span>
                </div>
                <div>Sockets: ${socketsHTML}</div>
                ${item.intrinsic ? `<div class="item-passive-box">✨ ${item.intrinsic.label}</div>` : ""}
                
                <button class="btn btn-magic btn-small" style="margin-top:8px;" onclick="openRuneInsertion(${realIndex})">
                    Inserir Runa
                </button>
            </div>
        `;
  });
}

const selectedItemForRune = null;

window.openRuneInsertion = function (invIndex) {
  const hero = getActiveHero();
  const item = hero.inventory[invIndex];

  // Busca a primeira runa disponível no inventário
  const runeIndex = hero.inventory.findIndex((i) => i.type === "rune");

  if (runeIndex === -1) {
    return triggerToast(
      "Você não possui nenhuma Runa no inventário. Fabrique uma na Forja!",
    );
  }

  const runeItem = hero.inventory[runeIndex];
  const emptySlot = item.sockets.findIndex((s) => s === null);

  if (emptySlot === -1) {
    return triggerToast("Este equipamento não possui Sockets vazios.");
  }

  if (
    confirm(
      `Deseja inserir a [${runeItem.name}] no equipamento [${item.name}]?`,
    )
  ) {
    // Insere a runa
    item.sockets[emptySlot] = {
      id: runeItem.runeId,
      name: runeItem.name,
      effect: runeItem.runeEffect,
    };

    // Gasta a runa
    hero.inventory.splice(runeIndex, 1);

    triggerToast(
      `⚡ Runa fundida com sucesso! O poder de ${item.name} evoluiu.`,
    );
    commitStorage();
    renderAllEngines();
  }
};

// ====================== FABRICAÇÃO DE RUNAS ======================
function craftRune() {
  const hero = getActiveHero();
  const selected = document.getElementById("rune-craft-select").value;

  let cost = {};
  let runeData = null;

  switch (selected) {
    case "r_crit":
      cost = { ferro: 8, prata: 4 };
      runeData = RUNE_POOL[0];
      hero.gold -= 120;
      break;
    case "r_vamp":
      cost = { mithril: 6 };
      runeData = RUNE_POOL[1];
      hero.materials.essencia_maior = (hero.materials.essencia_maior || 0) - 3;
      hero.gold -= 180;
      break;
    case "r_def":
      cost = { ferro: 10, couro: 5 };
      runeData = RUNE_POOL[2];
      hero.gold -= 100;
      break;
    case "r_fire":
      cost = { rubi: 6 };
      runeData = RUNE_POOL[3];
      hero.materials.essencia_epica = (hero.materials.essencia_epica || 0) - 4;
      hero.gold -= 250;
      break;
    case "r_ice":
      cost = { quartzo: 6, escama: 4 };
      runeData = RUNE_POOL[4];
      hero.gold -= 220;
      break;
  }

  // Verifica custo
  let canCraft = true;
  Object.keys(cost).forEach((mat) => {
    if ((hero.materials[mat] || 0) < cost[mat]) {
      canCraft = false;
    }
  });

  if (!canCraft || hero.gold < 0) {
    return triggerToast("Faltam materiais ou ouro para forjar esta runa.");
  }

  // Consome materiais
  Object.keys(cost).forEach((mat) => {
    hero.materials[mat] -= cost[mat];
  });

  // Adiciona a runa no inventário
  hero.inventory.push({
    id: "rune_" + Date.now(),
    name: runeData.name,
    type: "rune",
    rarity: "Magico",
    power: 0,
    desc: runeData.desc,
    runeId: runeData.id,
    runeEffect: runeData.effect,
  });

  commitStorage();
  renderAllEngines();
  triggerToast(`🔨 Runa ${runeData.name} forjada com sucesso!`);
}

function performRuneInsertion(itemIndex, runeId) {
  const hero = getActiveHero();
  const item = hero.inventory[itemIndex];
  const rune = RUNE_POOL.find((r) => r.id === runeId);
  if (!item || !rune) {
    return;
  }

  // Encontra primeiro socket vazio
  const emptySlot = item.sockets.findIndex((s) => s === null);
  if (emptySlot === -1) {
    return triggerToast("Este item não tem sockets vazios.");
  }

  item.sockets[emptySlot] = rune;

  triggerToast(`⚡ Runa ${rune.name} inserida com sucesso!`);
  commitStorage();
  renderAllEngines();
}

window.toggleHardmode = function () {
  const hero = getActiveHero();
  if (!hero) return;

  // Se estiver desativado e o jogador for ativar, rodamos os avisos do criador
  if (!hero.hardmode) {
    const aviso1 = window.confirm(
      "Opa, pera lá criatura! ksksksk Você tem CERTEZA que quer ativar isso?\n\nEsse é disparado o modo mais difícil do jogo, fiz de propósito pros reclamões que acham que tão fortes. Papo reto, você vai morrer de primeira.\n\nQuer mesmo ligar essa loucura?",
    );
    if (!aviso1) return;

    const aviso2 = window.confirm(
      "Beleza então, você foi avisado ksksksk!\n\nNão tive pena nenhuma de fazer esse modo, botei pra torar mesmo. A partir de agora é você e Deus pra conseguir passar desses andares!\n\nConfirma a sua sentença de morte?",
    );
    if (!aviso2) return;
  }

  hero.hardmode = !hero.hardmode;
  commitStorage();
  if (hero.hardmode) {
    triggerScreenShake();
    appendTerminalLog(
      "🔥 [MODO SOULSLIKE ATIVADO] A masmorra escurece... A morte espreita em cada sombra. Monstros agora são 300% mais fortes e concedem 5x mais EXP e Ouro!",
      "status",
    );
  } else {
    appendTerminalLog(
      "🕯️ [MODO SOULSLIKE DESATIVADO] A luz retorna aos corredores. A masmorra voltou ao normal.",
      "reward",
    );
  }

  const btns = [document.getElementById("btn-toggle-hardmode-sidebar")];

  btns.forEach((btn) => {
    if (btn) {
      btn.innerText = hero.hardmode
        ? "🔥 Desativar Modo Soulslike"
        : "🔥 Ativar Modo Soulslike";
      btn.style.borderColor = hero.hardmode ? "#f87171" : "#dc2626";
      btn.style.color = hero.hardmode ? "#f87171" : "#fca5a5";
    }
  });
};

// ====================== REPARO DE ITENS ======================
function renderRepairMesh() {
  const hero = getActiveHero();
  const container = document.getElementById("repair-mesh");
  container.innerHTML = "";

  const brokenItems = hero.inventory.filter(
    (item) =>
      item.durability !== undefined &&
      item.durability < (item.maxDurability || 100),
  );

  if (brokenItems.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:20px;">Todos os equipamentos estão em bom estado.</p>`;
    return;
  }

  brokenItems.forEach((item, idx) => {
    const realIndex = hero.inventory.indexOf(item);
    const maxDur = item.maxDurability || 100;
    const cost = Math.floor((maxDur - item.durability) * 1.8);

    container.innerHTML += `
            <div class="item-card rare-${item.rarity}" style="margin-bottom:12px;">
                <strong>${item.name}</strong> — Durab: ${item.durability}/${maxDur}
                <button class="btn btn-success btn-small" style="margin-top:8px; width:100%;" 
                        onclick="repairItem(${realIndex}, ${cost})">
                    Reparar (${cost} 🪙)
                </button>
            </div>
        `;
  });
}

function repairItem(invIndex, cost) {
  const hero = getActiveHero();
  const item = hero.inventory[invIndex];
  if (!item || hero.gold < cost) {
    return triggerToast("Ouro insuficiente para reparo.");
  }

  hero.gold -= cost;
  item.durability = item.maxDurability || 100;
  triggerToast(`🔧 ${item.name} foi reparado completamente!`);
  commitStorage();
  renderAllEngines();
}

function repairAllItems() {
  const hero = getActiveHero();
  let totalCost = 0;

  hero.inventory.forEach((item) => {
    if (
      item.durability !== undefined &&
      item.durability < (item.maxDurability || 100)
    ) {
      totalCost += Math.floor(
        ((item.maxDurability || 100) - item.durability) * 1.8,
      );
    }
  });

  if (totalCost === 0) {
    return triggerToast("Todos os equipamentos estão em perfeito estado.");
  }
  if (hero.gold < totalCost) {
    return triggerToast(`Ouro insuficiente. Você precisa de ${totalCost} 🪙`);
  }

  if (!confirm(`Reparar TODOS os itens danificados por ${totalCost} 🪙?`)) {
    return;
  }

  hero.gold -= totalCost;
  hero.inventory.forEach((item) => {
    if (item.durability !== undefined) {
      item.durability = item.maxDurability || 100;
    }
  });

  triggerToast("🔧 Todos os equipamentos foram reparados com perfeição!");
  commitStorage();
  renderAllEngines();
}

// 8. MURAL DE CAÇADAS E QUESTS
function generateProceduralQuest() {
  const h = getActiveHero();
  if (h.quests.length >= 6) {
    return triggerToast("Mural entupido. Assasine e colete os pendentes.");
  }

  const typeQ = Math.random() /* nosonar */ > 0.5 ? "Kill" : "Gather";
  const reward_gold = Math.floor(h.level * 80 + 200);
  const reward_xp = Math.floor(h.level * 60 + 150);

  const q = {
    id: Date.now(),
    type: typeQ,
    status: "ativo",
    progress: 0,
    gold: reward_gold,
    xp: reward_xp,
  };

  if (typeQ === "Kill") {
    const enemies = [
      "Esqueletos Possuídos",
      "Zumbis Anciãos",
      "Demônios Menores",
      "Espectrais Furiosos",
      "Chefes de Horda",
    ];
    q.target = Math.floor(Math.random() /* nosonar */ * 4) + 2;
    q.enemyType =
      enemies[Math.floor(Math.random() /* nosonar */ * enemies.length)];
    q.title = `Extermínio: ${q.enemyType}`;
    q.desc = `Elimine ${q.target} ${q.enemyType} nas profundezas da Masmorra. Recompensa: ${reward_gold} 🪙 + ${reward_xp} XP`;
  } else {
    const m =
      ALL_MATERIALS[
        Math.floor(
          Math.random() /* nosonar */ * Math.min(12, ALL_MATERIALS.length),
        )
      ];
    if (!m) {
      return triggerToast("Erro ao gerar contrato de coleta.");
    }
    q.target = Math.floor(Math.random() /* nosonar */ * 5) + 3;
    q.matId = m.id;
    q.title = `Coleta: ${m.name}`;
    q.desc = `Colete ${q.target} unidades de ${m.name} nas Minas. Recompensa: ${reward_gold} 🪙 + ${reward_xp} XP`;
  }

  h.quests.push(q);
  commitStorage();
  renderAllEngines();
  triggerToast(
    "✅ Novo contrato arrancado do Mural com sua digital sangrenta!",
  );
}
// ====================== SISTEMA DE QUESTS (CORRIGIDO) ======================
function renderQuestsBoard() {
  const h = getActiveHero();
  const mesh = document.getElementById("quests-board-mesh");
  mesh.innerHTML = "";

  if (h.quests.length === 0) {
    mesh.innerHTML = `<div style="color:var(--text-muted); font-style:italic; text-align:center; padding:40px; background:rgba(20,5,15,0.5); border-radius:8px;">
                    ⚔️ Você é um mercenário desempregado.<br>Aceite contratos pendurados no Mural acima.
                </div>`;
    return;
  }

  h.quests.forEach((q) => {
    let isReady = false;
    let progressText = "";
    let progressPercent = 0;

    if (q.type === "Kill") {
      progressPercent = Math.min(
        100,
        Math.floor((q.progress / q.target) * 100),
      );
      progressText = `⚔️ ${q.progress}/${q.target} abatidos`;
      if (q.progress >= q.target) {
        isReady = true;
      }
    } else if (q.type === "Gather") {
      const currentMat = h.materials[q.matId] || 0;
      const matName =
        ALL_MATERIALS.find((m) => m.id === q.matId)?.name || q.matId;
      progressPercent = Math.min(
        100,
        Math.floor((currentMat / q.target) * 100),
      );
      progressText = `⛏️ ${currentMat}/${q.target} ${matName}`;
      if (currentMat >= q.target) {
        isReady = true;
      }
    }

    const isCompleted = q.status === "concluido";
    const borderColor = isCompleted
      ? "#555"
      : isReady
        ? "#6ee7b7"
        : "var(--gold)";

    mesh.innerHTML += `
                    <div style="background:#0a0203; border: 2px solid ${borderColor}; border-left: 6px solid ${borderColor}; padding:18px; border-radius:6px; margin-bottom:15px;">
                        <div style="display:flex; justify-content:space-between; align-items:start; gap:20px;">
                            <div style="flex:1;">
                                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                                    <strong style="color:${borderColor}; font-size:1.25rem;">${q.title}</strong>
                                    ${isReady ? '<span style="background:#6ee7b7; color:#000; padding:2px 8px; border-radius:12px; font-size:0.8rem; font-weight:bold;">✓ PRONTO</span>' : ""}
                                </div>
                                <p style="font-size:0.9rem; color:var(--text-muted); margin:8px 0;">${q.desc}</p>
                                <div style="margin-top:10px;">
                                    <div style="background:rgba(100,100,100,0.2); height:6px; border-radius:3px; overflow:hidden;">
                                        <div style="background:${isReady ? "#6ee7b7" : "var(--gold)"}; height:100%; width:${progressPercent}%; transition:width 0.3s;"></div>
                                    </div>
                                </div>
                                <div style="font-size:0.85rem; color:var(--mana-blue); margin-top:8px; font-weight:bold;">
                                    ${progressText} | Recompensa: <span style="color:var(--gold)">💰${q.gold}</span> | <span style="color:#a5f3fc">⭐${q.xp}</span>
                                </div>
                            </div>
                            
                            <div style="text-align:right; min-width:150px;">
                                ${
                                  isCompleted
                                    ? `<div style="color:#6ee7b7; font-weight:bold; text-align:center;">✅ Contrato Honrado!</div>`
                                    : `
                                    <button class="btn ${isReady ? "" : "disabled"}" style="padding:12px 20px; font-size:0.95rem; width:100%; ${isReady ? "background:linear-gradient(135deg,#6ee7b7,#10b981);" : ""};" 
                                            ${!isReady ? "disabled" : ""} 
                                            onclick="turnInQuest(${q.id})">
                                        ${isReady ? "💰 Coletar" : "⏳ Andamento"}
                                    </button>
                                `
                                }
                            </div>
                        </div>
                    </div>`;
  });
}

function turnInQuest(id) {
  const h = getActiveHero();
  const q = h.quests.find((x) => x.id === id);
  if (!q || q.status === "concluido") {
    triggerToast("Este contrato já foi honrado.");
    return;
  }

  // Verificação de completude
  let canComplete = false;
  if (q.type === "Kill" && q.progress >= q.target) {
    canComplete = true;
  }
  if (q.type === "Gather" && (h.materials[q.matId] || 0) >= q.target) {
    canComplete = true;
  }

  if (!canComplete) {
    triggerToast("Este contrato ainda não foi cumprido.");
    return;
  }

  // Entrega da quest
  if (q.type === "Gather") {
    h.materials[q.matId] -= q.target;
  }

  q.status = "concluido";
  h.gold += q.gold;

  const leveled = addExperience(q.xp);

  commitStorage();
  renderAllEngines();

  if (leveled) {
    triggerToast("🌟 LEVEL UP ABSOLUTO CONQUISTADO NAS PROFUNDEZAS!");
  } else {
    triggerToast(
      `✅ Contrato completado! +${q.gold} PO e ${q.xp} XP recebidos.`,
    );
  }
}

window.clearCompletedQuests = function () {
  const h = getActiveHero();
  const initialCount = h.quests.length;

  // Filtra mantendo APENAS as missões que NÃO estão concluídas
  h.quests = h.quests.filter((q) => q.status !== "concluido");

  if (h.quests.length < initialCount) {
    commitStorage();
    renderAllEngines();
    triggerToast("🔥 Contratos honrados foram queimados e removidos do mural.");
  } else {
    triggerToast("Não há contratos concluídos para limpar no momento.");
  }
};

// =========================================================================
//  ENGINE DE COMBATE E MASMORRAS (STATUS EFFECTS E PÓS-BOSS SAFE ROOM)
// =========================================================================
const MONSTER_DATABASE = {
  1: { n: "Esqueleto Amaldiçoado de Prata", hp: 80, atk: 12, type: "Físico" },
  2: { n: "Demônio Escarlate Inferior", hp: 150, atk: 25, type: "Fogo" },
  3: { n: "Gárgula de Gelo Perfeito", hp: 300, atk: 45, type: "Gelo" },
  4: { n: "Víbora Fantasma Profana", hp: 600, atk: 75, type: "Profano" },
};

const BOSS_DATABASE = {
  5: {
    n: "Rei Esqueleto Ancestral (Senhor dos Ossos)",
    hp: 800,
    atk: 55,
    type: "Profano",
  },
  10: {
    n: "O Açougueiro Carniceiro Abissal",
    hp: 1800,
    atk: 110,
    type: "Físico",
  },
  15: { n: "Belial, Avatar Mentiroso", hp: 4000, atk: 190, type: "Fogo" },
  20: {
    n: "DIABLO, O ABSOLUTO MAL SUPREMO",
    hp: 10000,
    atk: 350,
    type: "Fogo",
  },
};


function renderDungeonTab() {
  const hero = getActiveHero();
  const biome = getCurrentBiome();

  const mainPanel = document.getElementById("dungeon-main-panel");
  if (mainPanel) {
    mainPanel.style.borderColor = biome.color;
    mainPanel.style.boxShadow = `inset 0 0 20px ${biome.color}11`;
  }

  const header = mainPanel ? mainPanel.querySelector(".panel-header") : null;
  if (header) {
    header.style.color = biome.color;
    header.style.borderBottomColor = biome.color;

    header.innerHTML = `
                    ${biome.name}
                    <span style="font-size: 1.5rem; color: ${biome.color}; background: #1a0505; padding: 5px 15px; border-radius: 6px; border: 1px solid ${biome.color};" id="dungeon-floor-tag">Andar: ${hero.dungeonLevel}</span>
                `;
  }

  // --- CORREÇÃO: INJETANDO A PORCENTAGEM NA BARRA VISUAL ---
  const expl = hero.floorExploration || 0;
  const progressFill = document.getElementById("boss-progress-fill");
  const progressText = document.getElementById("boss-progress-text");
  if (progressFill) {
    progressFill.style.width = `${expl}%`;
    progressFill.style.background = `linear-gradient(90deg, #1a0505, ${biome.color})`;
  }
  if (progressText) {
    progressText.innerText = `Distância da Arena do Chefe: ${expl}%`;
  }
  // ---------------------------------------------------------

  // --- CONTROLE DE ESCADARIAS ---
  const btnDescend = document.getElementById("btn-descend-floor");
  if (btnDescend) {
    if (hero.floorCleared) {
      btnDescend.style.opacity = "1";
      btnDescend.style.pointerEvents = "auto";
      btnDescend.style.background = "linear-gradient(90deg, #10b981, #059669)";
      btnDescend.style.color = "#fff";
      btnDescend.innerHTML = "▼ Descer Escadarias";
    } else {
      btnDescend.style.opacity = "0.5";
      btnDescend.style.pointerEvents = "none";
      btnDescend.style.background = "#333";
      btnDescend.style.color = "#777";
      btnDescend.innerHTML = "🔒 Escadas Trancadas";
    }
  }
  // ---------------------------------------------------------
  const btnCorpse = document.getElementById("btn-recover-corpse");
  if (
    hero.corpse &&
    hero.corpse.active &&
    hero.corpse.level === hero.dungeonLevel
  ) {
    if (btnCorpse) {
      btnCorpse.classList.remove("hidden");
      btnCorpse.innerText = `🩸 Tocar na Mancha de Sangue (+${hero.corpse.gold} PO / +${hero.corpse.xp} XP)`;
    }
  } else {
    if (btnCorpse) {
      btnCorpse.classList.add("hidden");
    }
  }

  // Controle de blocos de UI
  const safeRoomView = document.getElementById("safe-room-view");
  const combatView = document.getElementById("combat-view");
  const crossroadsView = document.getElementById("dungeon-crossroads");

  // 2. Se estiver na Fogueira do Boss
  if (hero.inBossRestArea) {
    combatView.classList.add("hidden");
    safeRoomView.classList.remove("hidden");
    if (crossroadsView) {
      crossroadsView.classList.add("hidden");
    }
    return;
  } else {
    safeRoomView.classList.add("hidden");
    combatView.classList.remove("hidden");
  }

  // 3. Se NÃO houver combate ativo (Modo de Exploração do Labirinto)
  if (!activeCombatInstance) {
    document.getElementById(MV_ID_ENEMY_CARD).classList.add("hidden");
    document.getElementById("combat-skills-injection-deck").innerHTML = "";
    if (crossroadsView) {
      crossroadsView.classList.remove("hidden");
    } // Mostra as direções!
    return;
  }

  // 4. SE ESTIVER EM COMBATE (Esconde as direções e mostra o monstro)
  if (crossroadsView) {
    crossroadsView.classList.add("hidden");
  }
  document.getElementById(MV_ID_ENEMY_CARD).classList.remove("hidden");
  document.getElementById(MV_ID_ENEMY_NAME).innerText =
    activeCombatInstance.name;
  document.getElementById("enemy-display-hp-text").innerText =
    `HP Vital Inimigo: ${activeCombatInstance.hp}/${activeCombatInstance.maxHp}`;
  document.getElementById("enemy-display-hp-fill").style.width =
    `${Math.max(0, (activeCombatInstance.hp / activeCombatInstance.maxHp) * 100)}%`;

  // ================= NOVO: RENDER POSTURA =================
  const staggerFill = document.getElementById("enemy-display-stagger-fill");
  if (staggerFill && activeCombatInstance.posture !== undefined) {
    let postPercent = Math.max(
      0,
      (activeCombatInstance.posture / activeCombatInstance.maxPosture) * 100,
    );
    // Se o monstro teve postura quebrada, a barra fica vazia
    if (activeCombatInstance.staggerBroken) {
      postPercent = 0;
    }
    staggerFill.style.width = `${postPercent}%`;
  }
  // =======================================================
  document.getElementById("enemy-stats-meta").innerText =
    `Dano de Impacto Bruto Base: ${activeCombatInstance.atk}`;

  // Render Status Effect Tray Enemy
  const tray = document.getElementById("enemy-status-tray");
  tray.innerHTML = "";
  activeCombatInstance.statuses.forEach((st) => {
    let cName = "status-badge ";
    if (st.type === "burn") cName += "status-burn";
    if (st.type === "freeze") cName += "status-freeze";
    if (st.type === "poison") cName += "status-poison";
    if (st.type === "stun") cName += "status-stun";
    if (st.type === "blind") cName += "status-blind";
    tray.innerHTML += `<span class="${cName}" onmouseenter="showStatusTooltip('${st.type}', ${st.duration}, event, ${st.power || 0})" onmouseleave="hideStatusTooltip()">${st.type.toUpperCase()} (${st.duration}t)</span>`;
  });

  // Render Status Effect Tray Hero
  const heroTray = document.getElementById("hero-status-tray");
  if (heroTray) {
    heroTray.innerHTML = "";
    if (heroCombatState.statuses) {
      heroCombatState.statuses.forEach((st) => {
        let cName = "status-badge ";
        if (st.type === "burn") cName += "status-burn";
        if (st.type === "freeze") cName += "status-freeze";
        if (st.type === "poison") cName += "status-poison";
        if (st.type === "stun") cName += "status-stun";
        if (st.type === "blind") cName += "status-blind";
        heroTray.innerHTML += `<span class="${cName}" onmouseenter="showStatusTooltip('${st.type}', ${st.duration}, event, ${st.power || 0})" onmouseleave="hideStatusTooltip()">${st.type.toUpperCase()} (${st.duration}t)</span>`;
      });
    }
  }

  const enemyImg = document.getElementById(MV_ID_ENEMY_IMG);
  if (enemyImg) {
    if (activeCombatInstance.staggerBroken) {
      enemyImg.classList.add("stagger-broken-img");
    } else {
      enemyImg.classList.remove("stagger-broken-img");
    }
  }

  // Renderiza Botões de Habilidades do Grimório no Combate Dinamicamente
  const basicDeck = document.getElementById("combat-basic-actions-deck");
  if (basicDeck) basicDeck.style.display = "none"; // Hide old hardcoded layout

  const skDeck = document.getElementById("combat-skills-injection-deck");
  skDeck.className = "combat-grid-container";
  skDeck.innerHTML = `
      <button class="btn-icon-combat type-fisico" onclick="processCombatRound('ataque')" title="Ataque Físico [1]"><span class="hotkey-badge">1</span><img src="assets/images/icons/attack.svg" style="width:36px;height:36px;pointer-events:none;" onerror="this.outerHTML='⚔️'"></button>
      <button class="btn-icon-combat type-cura" onclick="drinkPotionFromCombat('hp')" title="Elixir de Vida [2]"><span class="hotkey-badge">2</span><img src="assets/images/icons/health.svg" style="width:36px;height:36px;pointer-events:none;" onerror="this.outerHTML='💊'"></button>
      <button class="btn-icon-combat type-arcano" onclick="drinkPotionFromCombat('mp')" title="Elixir de Mana [3]"><span class="hotkey-badge">3</span><img src="assets/images/icons/mana.svg" style="width:36px;height:36px;pointer-events:none;" onerror="this.outerHTML='🧪'"></button>
      <button class="btn-icon-combat type-suporte" onclick="retreatFromFight()" title="Retirada [4]"><span class="hotkey-badge">4</span><img src="assets/images/icons/flee.svg" style="width:36px;height:36px;pointer-events:none;" onerror="this.outerHTML='🏃'"></button>
      <button class="btn-icon-combat type-suporte" onclick="toggleCombatPosition()" title="Mudar Posição [V]"><span class="hotkey-badge">V</span>🛡️</button>
  `;
  let skillIndex = 0;
  if (hero.equippedSkills && hero.equippedSkills.length > 0) {
    hero.equippedSkills.forEach((skillId) => {
      const sk = MASTER_SKILLS_DATA[hero.class].find(s => s.id === skillId);
      if (!sk) return;
      const r = hero.skills[sk.id] || 0;
      if (r > 0) {
        if (skillIndex >= 7) return;
        const hotkey = 5 + skillIndex;
        const bgImg = sk.icon
          ? `style="background-image: url('${sk.icon}'); background-size: cover; background-position: center;"`
          : "";
        skDeck.innerHTML += `<button class="btn-icon-combat" ${bgImg} onclick="castCombatSkill('${sk.id}')" onmouseenter="showSkillTooltip(MASTER_SKILLS_DATA['${hero.class}'].find(s=>s.id==='${sk.id}'), event, ${r})" onmouseleave="hideSkillTooltip()" title="${sk.name} (Rank ${r}) [${hotkey}]"><span class="hotkey-badge">${hotkey}</span>${sk.icon ? "" : "🔮"}</button>`;
        skillIndex++;
      }
    });
  }
}

window.toggleCombatPosition = function() {
  if (!activeCombatInstance || isActionOnCooldown || (heroCombatState.atb || 0) < 100) return;
  
  heroCombatState.position = heroCombatState.position === "retaguarda" ? "vanguarda" : "retaguarda";
  const posName = heroCombatState.position === "retaguarda" ? "Retaguarda (Longe)" : "Vanguarda (Corpo a Corpo)";
  
  appendTerminalLog(`🛡️ Você se moveu para a ${posName}. Seu turno foi gasto!`, "status");
  triggerToast(`Movido para ${posName}`);
  
  // Update visual
  const avatarImg = document.getElementById("player-avatar-combat-img");
  if (avatarImg) {
      avatarImg.style.transform = heroCombatState.position === "retaguarda" ? "scale(0.8) translateX(-20px)" : "scale(1) translateX(0)";
  }

  // Passa o turno
  heroCombatState.atb = 0;
  resumeCombatTicker();
}

function moveDungeonFloor(dir) {
  const hero = getActiveHero();
  if (dir !== 1) {
    return;
  }
  if (activeCombatInstance) {
    return triggerToast(
      "Você está em combate! Derrote o inimigo antes de descer.",
    );
  }
  if (!hero.floorCleared) {
    return triggerToast(
      "A escadaria está trancada. Você deve explorar este andar completamente (100%) e vencer o Guardião.",
    );
  }
  if (hero.stamina < 5) {
    return triggerToast("O cansaço quebra as suas pernas. Durma na fogueira.");
  }
  hero.stamina -= 5;

  hero.dungeonLevel++;
  if (!hero.maxDungeonLevel) {
    hero.maxDungeonLevel = hero.dungeonLevel;
  }
  if (hero.dungeonLevel > hero.maxDungeonLevel) {
    hero.maxDungeonLevel = hero.dungeonLevel;
  }

  // Trava as escadarias para o próximo nível
  hero.floorCleared = false;
  hero.floorExploration = 0;

  // Não invoca combate direto, apenas desce e espera o jogador explorar
  activeCombatInstance = null;
  document.getElementById(MV_ID_ENEMY_CARD).classList.add("hidden");
  appendTerminalLog(
    "Você desce as escadarias sombrias. O ar fica mais pesado. Explore o andar para avançar.",
    "system",
  );

  commitStorage();
  renderAllEngines();
}

function exploreCurrentFloor() {
  const hero = getActiveHero();
  
  if (hero.floorCleared) {
    return triggerToast("A área está limpa. Você precisa descer para o próximo nível!");
  }

  if (activeCombatInstance) {
    return triggerToast("Você está em combate! Derrote o inimigo primeiro.");
  }
  if (hero.stamina < 5) {
    return triggerToast(
      "Exaustão extrema barra seu avanço. Durma na fogueira.",
    );
  }
  hero.stamina -= 5;

  hero.floorExploration = 0;
  hero.floorCleared = false;

  appendTerminalLog(
    "🔄 Você decide retornar aos recantos ocultos do andar atual. Novos perigos surgirão.",
    "system",
  );

  activeCombatInstance = null;
  document.getElementById(MV_ID_ENEMY_CARD).classList.add("hidden");

  commitStorage();
  renderAllEngines();
}

// O Motor das Encruzilhadas do Andar
window.chooseDungeonPath = function (direction) {
  const hero = getActiveHero();
  
  if (hero.floorCleared) {
    return triggerToast("A área está limpa e as escadarias estão abertas. Você deve avançar para o próximo andar!");
  }

  // RESTRIÇÃO: Bloqueia exploração durante combate ativo
  if (activeCombatInstance) {
    return triggerToast(
      "⚔️ Há um inimigo na sua frente! Lute ou fuja antes de explorar.",
    );
  }
  if (hero.stamina < 2) {
    return triggerToast(
      "Cansaço físico absoluto. Você não tem estamina para explorar. Descanse.",
    );
  }

  hero.stamina -= 2;
  const roll = Math.random(); /* nosonar */

  appendTerminalLog(
    `Você avança cautelosamente pela <strong>${direction}</strong>...`,
    "system",
  );

  if (direction === "esquerda") {
    if (roll < 0.4) {
      const gold =
        Math.floor(Math.random() /* nosonar */ * 100) + hero.dungeonLevel * 10;
      hero.gold += gold;
      appendTerminalLog(
        `🎁 Você topa com os restos de um aventureiro desavisado. Encontrou +${gold} PO.`,
        "reward",
      );
    } else if (roll < 0.7) {
      const trapDmg = Math.floor(hero.attributes.constituicao * 2) + 10;
      hero.currentHp = Math.max(1, hero.currentHp - trapDmg);
      appendTerminalLog(
        `⚠️ ARMADILHA! O teto cede despejando estacas de osso. -${trapDmg} de HP.`,
        "combat",
      );
      triggerScreenShake();
    } else {
      initCombatInstance(false);
    }
  } else if (direction === "reto") {
    if (roll < 0.8) {
      initCombatInstance(false);
    } else {
      const matId = ["ferro", "cobre", "carvao"][
        Math.floor(Math.random() /* nosonar */ * 3)
      ];
      hero.materials[matId] = (hero.materials[matId] || 0) + 2;
      appendTerminalLog(
        `⛏️ Você raspa a parede incrustada no caminho reto. Coletou +2 ${matId.toUpperCase()}.`,
        "reward",
      );
      initCombatInstance(false);
    }
  } else if (direction === "direita") {
    if (roll < 0.6) {
      initCombatInstance(false);
      if (activeCombatInstance) {
        activeCombatInstance.name = "Veterano: " + activeCombatInstance.name;
        activeCombatInstance.maxHp = Math.floor(
          activeCombatInstance.maxHp * 1.5,
        );
        activeCombatInstance.hp = activeCombatInstance.maxHp;
        activeCombatInstance.atk = Math.floor(activeCombatInstance.atk * 1.35);
        appendTerminalLog(
          "🔥 PERIGO! A escuridão revela uma abominação veterana incrivelmente forte!",
          "combat",
        );
      }
    } else if (roll < 0.9) {
      const heal = Math.floor(hero.attributes.constituicao * 6);
      hero.currentHp = Math.min(
        hero.currentHp + heal,
        computeLiveStats().maxHp,
      );
      appendTerminalLog(
        `✨ Um brilho reconfortante vaza de uma fenda. Estar ali cicatrizou o corpo (+${heal} HP).`,
        "reward",
      );
    } else {
      hero.materials["essencia_menor"] =
        (hero.materials["essencia_menor"] || 0) + 1;
      appendTerminalLog(
        `🌟 AURA PURA! Você extrai 1x Essência Menor do centro do corredor.`,
        "reward",
      );
    }
  }

  // Adiciona 20% de progresso a cada escolha
  if (!hero.floorCleared) {
    hero.floorExploration = (hero.floorExploration || 0) + 15;
  } else {
    appendTerminalLog(
      "🚪 As escadarias já estão abertas. Você pode descer, ou continuar farmando as sobras.",
      "system",
    );
  }

  // Se atingir 100% e não tiver limpado
  if (hero.floorExploration >= 100 && !hero.floorCleared) {
    hero.floorExploration = 100;
    const isBossFloor = hero.dungeonLevel % 5 === 0;

    if (isBossFloor) {
      appendTerminalLog(
        "💀 A aura do andar mudou... Você sente uma presença colossal à frente! O Lorde do Bioma o aguarda.",
        "status",
      );
      initCombatInstance(true);
    } else {
      appendTerminalLog(
        "🚪 Você encontrou as escadarias para o próximo andar! Porém, um Elite guarda o caminho.",
        "status",
      );
      initCombatInstance(false);
      if (activeCombatInstance) {
        activeCombatInstance.name =
          "Guardião Escarlate: " + activeCombatInstance.name;
        activeCombatInstance.maxHp = Math.floor(
          activeCombatInstance.maxHp * 2.0,
        );
        activeCombatInstance.hp = activeCombatInstance.maxHp;
        activeCombatInstance.atk = Math.floor(activeCombatInstance.atk * 1.5);
        activeCombatInstance.isElite = true;
      }
    }
    hero.isFightingGuardian = true;
  }

  commitStorage();
  renderAllEngines();
};

function getCurrentBiome() {
  const hero = getActiveHero();
  const level = hero.dungeonLevel || 1; // Default to 1 if undefined or 0
  let biomeIndex = Math.floor((Math.max(1, level) - 1) / 5);

  if (biomeIndex < 0) biomeIndex = 0;
  if (biomeIndex >= BIOMES.length) {
    biomeIndex = BIOMES.length - 1;
  }

  return BIOMES[biomeIndex] || { name: "Bioma Desconhecido", color: "#444" };
}

// Mecânica de Recuperar o Corpo
window.checkCorpseRecovery = function () {
  const hero = getActiveHero();

  if (
    hero.corpse &&
    hero.corpse.active &&
    hero.corpse.level === hero.dungeonLevel
  ) {
    hero.gold += hero.corpse.gold;
    addExperience(hero.corpse.xp); // Reaproveita a função da engine que checa level up

    appendTerminalLog(
      `🩸 Você estende a mão e absorve os ecos do seu passado sangrento. <strong>Recuperou ${hero.corpse.gold} PO e ${hero.corpse.xp} XP!</strong>`,
      "reward",
    );
    triggerToast(`Almas Recuperadas: +${hero.corpse.gold} PO`);

    // Zera o corpo
    hero.corpse.active = false;
    hero.corpse.gold = 0;
    hero.corpse.xp = 0;

    commitStorage();
    renderAllEngines();
  }
};

// ====================== MECÂNICA DO PANTEÃO ======================
window.renderPantheonTab = function () {
  const hero = getActiveHero();
  const mesh = document.getElementById("pantheon-mesh");
  if (!mesh) {
    return;
  }
  mesh.innerHTML = "";

  PANTHEON_GODS.forEach((god) => {
    const currentLevel = hero.pantheon[god.id] || 0;
    const isMaxed = currentLevel >= god.maxLevel;

    // Calcula o custo dinâmico (aumenta 50% a cada nível)
    let costHTML = "";
    if (!isMaxed) {
      const costMult = Math.pow(1.5, currentLevel);
      Object.keys(god.costBase).forEach((k) => {
        const amount = Math.floor(god.costBase[k] * costMult);
        if (k === "ouro") {
          costHTML += `<span style="color:var(--gold-glowing)">${amount} 🪙</span><br>`;
        } else {
          const matName = ALL_MATERIALS.find((m) => m.id === k)?.name || k;
          costHTML += `<span style="color:#cbd5e1">${amount}x ${matName}</span><br>`;
        }
      });
    }

    const borderColor = isMaxed ? "var(--gold-glowing)" : "#3b0764"; // Roxo escuro se não max

    mesh.innerHTML += `
            <div class="panel" style="background: rgba(10,5,15,0.9); text-align:center; border: 1px solid ${borderColor}; padding: 25px;">
                <h3 style="color:#d8b4fe; margin-bottom:10px; font-size:1.4rem;">${god.name}</h3>
                <p style="font-size:0.85rem; color:var(--text-muted); min-height: 40px;">${god.desc}</p>
                
                <div style="margin: 15px 0; padding: 12px; background: rgba(0,0,0,0.7); border: 1px dashed var(--gold-dim); border-radius: 4px;">
                    <strong style="color:var(--stamina-green); font-size: 1.1rem;">Bônus: ${(currentLevel * god.effectValue * (god.effectType.includes("Mp") ? 1 : 100)).toFixed(0)}${god.effectType.includes("Mp") ? "" : "%"}</strong><br>
                    <span style="font-size:0.8rem; color:#aaa; font-weight:bold;">Nível de Devoção: ${currentLevel}/${god.maxLevel}</span>
                </div>
                
                ${
                  !isMaxed
                    ? `
                    <div style="font-size: 0.85rem; font-weight: bold; margin-bottom: 15px; min-height: 60px;">
                        <div style="color:var(--red-blood); margin-bottom:5px; text-transform:uppercase; font-size:0.75rem;">Exigência do Sacrifício:</div>
                        ${costHTML}
                    </div>
                    <button class="btn" style="background: linear-gradient(180deg, #581c87, #3b0764); border-color:#a855f7; width:100%;" onclick="sacrificeToGod('${god.id}')">🩸 Ofertar Tributo</button>
                `
                    : `
                    <div style="font-size: 0.95rem; font-weight: bold; color: var(--gold-glowing); margin-top: 30px; text-transform:uppercase;">Deus Satisfeito</div>
                `
                }
            </div>
        `;
  });
};

window.sacrificeToGod = function (godId) {
  const hero = getActiveHero();
  const god = PANTHEON_GODS.find((g) => g.id === godId);
  if (!god) {
    return;
  }

  const currentLevel = hero.pantheon[god.id] || 0;
  if (currentLevel >= god.maxLevel) {
    return;
  }

  const costMult = Math.pow(1.5, currentLevel);
  let canAfford = true;
  const costs = {};

  // Verificador de Caixa
  Object.keys(god.costBase).forEach((k) => {
    costs[k] = Math.floor(god.costBase[k] * costMult);
    if (k === "ouro") {
      if (hero.gold < costs[k]) {
        canAfford = false;
      }
    } else {
      if ((hero.materials[k] || 0) < costs[k]) {
        canAfford = false;
      }
    }
  });

  if (!canAfford) {
    return triggerToast(
      "Os Deuses rejeitam sua oferenda miserável. Reúna mais recursos.",
    );
  }

  // Pagamento do Sacrifício
  Object.keys(costs).forEach((k) => {
    if (k === "ouro") {
      hero.gold -= costs[k];
    } else {
      hero.materials[k] -= costs[k];
    }
  });

  hero.pantheon[god.id] = currentLevel + 1;
  triggerScreenShake();
  commitStorage();
  renderAllEngines();
  triggerToast(
    `⚡ O CÉU TREME! <strong>${god.name}</strong> absorveu a oferenda. Seu poder aumentou!`,
  );
};

// ====================== MOTOR DO BESTIÁRIO MACABRO ======================
function getBestiaryKillCount(monsterName) {
  const hero = getActiveHero();
  if (!hero || !hero.bestiary) {
    return 0;
  }
  const cleanName = monsterName.replace(/^☠️\s*/, "");
  return (
    hero.bestiary[monsterName] ||
    hero.bestiary[`☠️ ${cleanName}`] ||
    hero.bestiary[cleanName] ||
    0
  );
}

function _initBestiaryMonsters() {
  const allMonsters = [];
  BIOMES.forEach((biome) => {
    biome.monsters.forEach((monster) => {
      allMonsters.push({
        biome: biome.name,
        name: monster.name,
        hp: monster.hp,
        atk: monster.atk,
        desc: monster.specialDesc || `Uma criatura perigosa das ${biome.name}.`,
        isElite: monster.isElite || false,
        isBoss: false,
      });
    });
    if (biome.boss) {
      allMonsters.push({
        biome: biome.name,
        name: biome.boss.name,
        hp: biome.boss.hp,
        atk: biome.boss.atk,
        desc: biome.boss.specialDesc || `O chefe lendário das ${biome.name}.`,
        isElite: false,
        isBoss: true,
      });
    }
  });
  return allMonsters;
}

function _buildBestiaryHtml(allMonsters) {
  let html = "";
  allMonsters.forEach((m) => {
    const kills = getBestiaryKillCount(m.name);
    const nameLabel = kills >= 10 ? m.name : "???";
    const hpLabel = kills >= 10 ? m.hp || "Escalável" : "???";
    const atkLabel = kills >= 10 ? m.atk || "Escalável" : "???";
    const description =
      kills >= 10
        ? m.desc
        : "🔒 Sob a névoa do desconhecido. Ceife pelo menos 10 desta criatura para extrair fragmentos de sua fisionomia.";

    let track1 = `<span style="color:#64748b">❌ Bloqueado (10 abates)</span>`;
    let track2 = `<span style="color:#64748b">❌ Bloqueado (50 abates)</span>`;
    let track3 = `<span style="color:#64748b">❌ Bloqueado (100 abates)</span>`;

    if (kills >= 10) {
      track1 = `<span style="color:var(--stamina-green)">👁️ ATIVO: Anatomia e HP Base revelados</span>`;
    }
    if (kills >= 50) {
      track2 = `<span style="color:var(--stamina-green)">⚔️ ATIVO: Ignora 10% de Defesa física do alvo</span>`;
    }
    if (kills >= 100) {
      track3 = `<span style="color:var(--gold-glowing)">🪙 ATIVO: +20% de Ouro e Chance de Drops</span>`;
    }

    const progress = Math.min((kills / 100) * 100, 100);
    const cardBorder =
      kills >= 100
        ? "1px solid var(--gold-dim)"
        : kills >= 50
          ? "1px solid #7f1d1d"
          : "1px solid #270707";

    html += `
            <div class="panel" style="background: rgba(12,4,4,0.95); border: ${cardBorder}; padding: 20px; position: relative; border-radius: 6px; margin-bottom: 16px;">
                <div style="position: absolute; top: 12px; right: 15px; font-size: 0.75rem; background: #2a0808; padding: 2px 8px; border-radius: 4px; color: #f87171; font-weight: bold; border: 1px solid #4c0505;">
                    ${kills} Abates
                </div>
                <h3 style="color: ${kills >= 10 ? "#ef4444" : "#4b5563"}; font-family: 'Cinzel', serif; font-size: 1.25rem; margin-bottom: 6px; text-transform: uppercase;">${nameLabel}</h3>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px;">
                    Bioma: <span style="color:#93c5fd">${m.biome}</span> | Tipo: <span style="color:#fbbf24">${m.isBoss ? "Chefe" : m.isElite ? "Elite" : "Inimigo"}</span>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px;">
                    HP Estimado: <span style="color:#f87171">${hpLabel}</span> | Ataque Base: <span style="color:#f59e0b">${atkLabel}</span>
                </div>
                <p style="font-size: 0.85rem; color: #cbd5e1; font-style: italic; min-height: 50px; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 4px; border-left: 3px solid #b91c1c; margin-bottom: 15px; line-height: 1.4;">
                    "${description}"
                </p>
                <div style="font-size: 0.8rem; display: flex; flex-direction: column; gap: 6px; background: rgba(20,10,10,0.4); padding: 10px; border-radius: 4px;">
                    <div style="font-weight: bold; font-size: 0.7rem; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">Marcos de Caça:</div>
                    <div>${track1}</div>
                    <div>${track2}</div>
                    <div>${track3}</div>
                </div>
                <div style="background: #1a0505; height: 6px; border-radius: 10px; margin-top: 15px; overflow: hidden; border: 1px solid #3b0707;">
                    <div style="background: linear-gradient(90deg, #7f1d1d 0%, #ef4444 100%); width: ${progress}%; height: 100%;"></div>
                </div>
                ${kills >= 10 ? `<button class="btn" style="width:100%; margin-top: 15px; background: transparent; border: 1px solid #4b5563; font-size: 0.8rem; color: #9ca3af;" onclick="window.location.href='Lore.html'">Ler Tratado Bestial no Tomo de Lore</button>` : ""}
            </div>
        `;
  });
  return html;
}

window.renderBestiaryTab = function () {
  const hero = getActiveHero();
  const mesh = document.getElementById("bestiary-mesh");
  if (!mesh || !hero) {
    return;
  }
  mesh.innerHTML = "";

  const allMonsters = _initBestiaryMonsters();

  if (allMonsters.length === 0) {
    mesh.innerHTML = `<p style="color:var(--text-muted); text-align:center; width:100%;">Nenhum monstro catalogado ainda.</p>`;
    return;
  }

  mesh.innerHTML =
    `<div style="margin-bottom: 18px; color: #f8fafc; font-size: 0.95rem;">Bestiário atualizado para os biomas atuais do jogo. Abates em todos os continentes do Santuário são registrados.</div>` +
    _buildBestiaryHtml(allMonsters);
};

// LÓGICA DE TURNOS E PROCESSAMENTO DE STATUS APLICADOS PELAS HABILIDADES
function processStatusArray(arr, targetName) {
  let dmgAccumulated = 0;
  let skipTurn = false;
  let isBlind = false;
  for (let i = arr.length - 1; i >= 0; i--) {
    const st = arr[i];
    if (st.type === "burn") {
      dmgAccumulated += st.power;
      appendTerminalLog(
        `🔥 A queimadura no ${targetName} aplica ${st.power} de DANO GRAVE INEVITÁVEL!`,
        "status",
      );
    }
    if (st.type === "poison") {
      dmgAccumulated += st.power;
      st.power = Math.floor(st.power * 1.5);
      appendTerminalLog(
        `🤢 O veneno se agrava e degrada o ${targetName} causando ${st.power} de dano!`,
        "status",
      );
    }
    if (st.type === "stun" || st.type === "freeze") {
      skipTurn = true;
      appendTerminalLog(
        `❄️ PARALISIA ATIVA: ${targetName} encontra-se CONGELADO ou ATORDOADO perdendo a rodada toda!`,
        "status",
      );
    }
    if (st.type === "blind") {
      isBlind = true;
      appendTerminalLog(
        `👁️ A visão de ${targetName} está cegada pelas magias... precisão severamente afetada.`,
        "status",
      );
    }

    st.duration--;
    if (st.duration <= 0) {
      arr.splice(i, 1);
    }
  }
  return { dmg: dmgAccumulated, skip: skipTurn, blind: isBlind };
}

function processHeroStatusArray(arr) {
  let dmgAccumulated = 0;
  let skipTurn = false;
  let isBlind = false;

  for (let i = arr.length - 1; i >= 0; i--) {
    const st = arr[i];
    if (st.type === "poison") {
      dmgAccumulated += st.power;
      appendTerminalLog(`🤢 O veneno em seu sangue causa ${st.power} de dano!`, "danger");
    }
    if (st.type === "bleed") {
      dmgAccumulated += st.power;
      appendTerminalLog(`🩸 Você está sangrando! ${st.power} de dano!`, "danger");
    }
    if (st.type === "burn") {
      dmgAccumulated += st.power;
      appendTerminalLog(`🔥 Seu corpo arde em chamas! ${st.power} de dano!`, "danger");
    }
    if (st.type === "blind") {
      isBlind = true;
      appendTerminalLog(`👁️ Sua visão está turva. Você pode errar seu próximo ataque.`, "danger");
    }
    if (st.type === "stun") {
      skipTurn = true;
      appendTerminalLog(`⚡ Você está paralisado e perdeu o turno!`, "danger");
    }
    st.duration--;
    if (st.duration <= 0) {
      arr.splice(i, 1);
    }
  }
  return { dmg: dmgAccumulated, skip: skipTurn, blind: isBlind };
}

function applyStatusToHero(effectObj) {
  if (!effectObj) return;
  const hero = getActiveHero();
  if (!hero) return;
  
  const calc = computeLiveStats();
  if (calc.passives.statusResist > 0) {
    if (Math.random() < calc.passives.statusResist) {
      appendTerminalLog(`✨ Você RESISTIU a um efeito de [${effectObj.type.toUpperCase()}]!`, "reward");
      return;
    }
  }

  heroCombatState.statuses = heroCombatState.statuses || [];
  // Evitar duplicar o mesmo status se já existir, ou pode só renovar a duração. 
  // Para MVP, vamos só empilhar (ou renovar)
  const existing = heroCombatState.statuses.find(s => s.type === effectObj.type);
  if (existing) {
     existing.duration = Math.max(existing.duration, effectObj.duration);
     if (effectObj.power) existing.power = Math.max(existing.power, effectObj.power);
  } else {
     heroCombatState.statuses.push({
       type: effectObj.type,
       duration: effectObj.duration,
       power: effectObj.power || 0
     });
  }
  appendTerminalLog(`☠️ Você foi afligido por [${effectObj.type.toUpperCase()}]!`, "danger");
  renderHeroStatusBadges();
}

function renderHeroStatusBadges() {
  const avatarImg = document.getElementById("player-avatar-combat-img");
  if (!avatarImg) return;
  let container = document.getElementById("hero-status-badges");
  if (!container) {
     container = document.createElement("div");
     container.id = "hero-status-badges";
     container.className = "enemy-status-badges"; // reusa o css do inimigo
     // Posicionar sobre a foto do herói
     container.style.position = "absolute";
     container.style.top = "5px";
     container.style.right = "5px";
     container.style.display = "flex";
     container.style.gap = "4px";
     
     if (avatarImg.parentElement) {
       avatarImg.parentElement.style.position = "relative";
       avatarImg.parentElement.appendChild(container);
     }
  }
  container.innerHTML = "";
  if (!heroCombatState.statuses) return;
  const uniqueTypes = [...new Set(heroCombatState.statuses.map(s => s.type))];
  uniqueTypes.forEach(type => {
    let icon = "💀";
    if (type === "poison") icon = "🧪";
    if (type === "burn") icon = "🔥";
    if (type === "bleed") icon = "🩸";
    if (type === "stun") icon = "⚡";
    if (type === "blind") icon = "👁️";
    if (type === "armor_break") icon = "🛡️";
    
    const b = document.createElement("div");
    b.className = `status-badge ${type}`;
    b.innerText = icon;
    b.title = type.toUpperCase();
    container.appendChild(b);
  });
}

function applyStatusToHero(effectObj) {
  if (!effectObj) return;
  const hero = getActiveHero();
  if (!hero) return;
  
  const calc = computeLiveStats();
  if (calc.passives.statusResist > 0) {
    if (Math.random() < calc.passives.statusResist) {
      appendTerminalLog(`✨ Você RESISTIU a um efeito de [${effectObj.type.toUpperCase()}]!`, "reward");
      return;
    }
  }

  heroCombatState.statuses = heroCombatState.statuses || [];
  // Evitar duplicar o mesmo status se já existir, ou pode só renovar a duração. 
  // Para MVP, vamos só empilhar (ou renovar)
  const existing = heroCombatState.statuses.find(s => s.type === effectObj.type);
  if (existing) {
     existing.duration = Math.max(existing.duration, effectObj.duration);
     if (effectObj.power) existing.power = Math.max(existing.power, effectObj.power);
  } else {
     heroCombatState.statuses.push({
       type: effectObj.type,
       duration: effectObj.duration,
       power: effectObj.power || 0
     });
  }
  appendTerminalLog(`☠️ Você foi afligido por [${effectObj.type.toUpperCase()}]!`, "danger");
  renderHeroStatusBadges();
}

function renderHeroStatusBadges() {
  const avatarImg = document.getElementById("player-avatar-combat-img");
  if (!avatarImg) return;
  let container = document.getElementById("hero-status-badges");
  if (!container) {
     container = document.createElement("div");
     container.id = "hero-status-badges";
     container.className = "enemy-status-badges"; // reusa o css do inimigo
     // Posicionar sobre a foto do herói
     container.style.position = "absolute";
     container.style.top = "5px";
     container.style.right = "5px";
     container.style.display = "flex";
     container.style.gap = "4px";
     
     if (avatarImg.parentElement) {
       avatarImg.parentElement.style.position = "relative";
       avatarImg.parentElement.appendChild(container);
     }
  }
  container.innerHTML = "";
  if (!heroCombatState.statuses) return;
  const uniqueTypes = [...new Set(heroCombatState.statuses.map(s => s.type))];
  uniqueTypes.forEach(type => {
    let icon = "💀";
    if (type === "poison") icon = "🧪";
    if (type === "burn") icon = "🔥";
    if (type === "bleed") icon = "🩸";
    if (type === "stun") icon = "⚡";
    if (type === "blind") icon = "👁️";
    if (type === "armor_break") icon = "🛡️";
    
    const b = document.createElement("div");
    b.className = `status-badge ${type}`;
    b.innerText = icon;
    b.title = type.toUpperCase();
    container.appendChild(b);
  });
}

function applyStatusToEnemy(effectObj, skillDamage) {
  if (!effectObj) return;

  if (typeof HeroTraits !== "undefined") {
    const hero = getActiveHero();
    if (hero) effectObj = HeroTraits.getApplyStatusMod(hero, effectObj);
  }

  const enemy = activeCombatInstance;
  if (!enemy || !enemy.statuses) return;

  const hasStatus = (type) => enemy.statuses.some(s => s.type === type);
  const removeStatus = (type) => {
     enemy.statuses = enemy.statuses.filter(s => s.type !== type);
  };

  // --- REAÇÕES QUÍMICAS (COMBOS) ---
  // 1. Veneno + Fogo = Explosão Tóxica
  if ((effectObj.type === "burn" && hasStatus("poison")) || (effectObj.type === "poison" && hasStatus("burn"))) {
     removeStatus("poison");
     removeStatus("burn");
     const comboDmg = Math.floor(skillDamage * 2.5) + 50;
     enemy.hp -= comboDmg;
     enemy.currentHp = enemy.hp;
     generateFloatingText(comboDmg, "damage", "enemy");
     triggerScreenShake();
     appendTerminalLog(`💥 REAÇÃO QUÍMICA! Fogo e Veneno causaram uma EXPLOSÃO TÓXICA de ${comboDmg} de dano!`, "reward");
     return;
  }

  // 2. Sangramento + Gelo = Necrose
  if ((effectObj.type === "freeze" && hasStatus("bleed")) || (effectObj.type === "bleed" && hasStatus("freeze"))) {
     removeStatus("bleed");
     removeStatus("freeze");
     enemy.statuses.push({ type: "necrosis", duration: 3, power: 0 }); 
     appendTerminalLog(`🥶🩸 REAÇÃO QUÍMICA! O Sangue congelou, causando NECROSE PROFUNDA! A defesa do inimigo derreteu.`, "reward");
     return;
  }
  // --------------------------------

  if (effectObj.type === "burn") {
    enemy.statuses.push({ type: "burn", duration: effectObj.duration, power: Math.floor(skillDamage * effectObj.ratio) });
  } else if (effectObj.type === "poison") {
    enemy.statuses.push({ type: "poison", duration: effectObj.duration, power: effectObj.power });
  } else if (effectObj.type === "bleed") {
    enemy.statuses.push({ type: "bleed", duration: effectObj.duration, power: Math.floor(skillDamage * (effectObj.ratio || 0.2)) });
  } else if (["stun", "freeze", "blind", "armor_break"].includes(effectObj.type)) {
    if (Math.random() < (effectObj.chance || 1.0)) {
       enemy.statuses.push({ type: effectObj.type, duration: effectObj.duration || 1 });
    }
  }
}

// =========================================================================
//  SISTEMA DE TURNOS ATIVOS & QTE (CLAIR OBSCUR STYLE)
// =========================================================================
window.combatTickerInterval = null;
window.isCombatPaused = false;
window.qteSuccess = false;



function startEnemyTurnTelegraph() {
  const card = document.getElementById(MV_ID_ENEMY_CARD);
  if (card) card.classList.add("enemy-telegraphing");

  appendTerminalLog(`⚠️ ${activeCombatInstance.name} está preparando um ataque! Prepare-se para ESQUIVAR!`, "combat");

  const overlay = document.getElementById("qte-overlay");
  if (overlay) {
    overlay.classList.remove("hidden");
    const circle = document.getElementById("qte-circle");
    if (circle) {
      circle.style.animation = 'none';
      void circle.offsetWidth;
      circle.style.animation = null;
    }
  }

  qteSuccess = false;
  let qteResolved = false;
  const qteStartTime = Date.now();

  const finalizeQte = (success) => {
    if (qteResolved) return;
    qteResolved = true;
    qteSuccess = success;
    document.removeEventListener("keydown", dodgeListener);
    
    showQteResult(qteSuccess);
    
    setTimeout(() => {
      if (card) card.classList.remove("enemy-telegraphing");
      if (overlay) overlay.classList.add("hidden");
      resolveEnemyAttack(qteSuccess);
    }, 400); // Mostra o resultado um pouquinho antes de sumir
  };

  const dodgeListener = (e) => {
    if (e.code === "Space" && overlay && !overlay.classList.contains("hidden")) {
      e.preventDefault();
      const elapsed = Date.now() - qteStartTime;
      // Sweet spot na animação (HARDCORE): 65% a 80% de 1000ms (650ms a 800ms)
      if (elapsed >= 650 && elapsed <= 800) {
        finalizeQte(true);
      } else {
        finalizeQte(false);
      }
    }
  };
  document.addEventListener("keydown", dodgeListener);

  setTimeout(() => {
    if (!qteResolved) finalizeQte(false);
  }, 1000); // Timeout maximo (reduzido para 1000ms para ficar mais rápido)
}

function showQteResult(success) {
  const overlay = document.getElementById("qte-overlay");
  if (!overlay) return;
  const text = document.createElement("div");
  text.className = success ? "qte-success-text" : "qte-fail-text";
  text.innerText = success ? "ESQUIVA PERFEITA!" : "FALHA";
  overlay.appendChild(text);
  setTimeout(() => text.remove(), 1000);
}

// ============================================================================
// SISTEMA DE IA DE MONSTROS (Monster Brain Engine 2.0)
// ============================================================================
function getActionPool(enemy, baseDmg) {
  return {
    basic: { type: "attack", dmg: baseDmg, log: `O ${enemy.name} desfere um golpe rápido! (Ataque Básico)` },
    heavy: { type: "heavy_attack", dmg: Math.floor(baseDmg * 1.5), log: `O ${enemy.name} canaliza sua fúria num Ataque Pesado brutal!` },
    defend: { type: "defend", dmg: 0, log: `O ${enemy.name} assume uma Postura Defensiva!` },
    debuff: { type: "debuff", dmg: Math.floor(baseDmg * 0.5), log: `O ${enemy.name} lança uma praga! (Ataque Mágico)` },
    heal: { type: "heal", dmg: 0, log: `O ${enemy.name} regenera suas feridas! (Cura)` }
  };
}

function selectActionWeighted(weights, actionPool) {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  let chosenAction = "basic";
  for (let key in weights) {
    if (random < weights[key]) {
      chosenAction = key;
      break;
    }
    random -= weights[key];
  }
  return actionPool[chosenAction];
}

function calculateCommonAction(enemy, hero, calc, hpPercent, heroHpPercent, baseDmg) {
  const actionPool = getActionPool(enemy, baseDmg);
  let weights = { basic: 60, heavy: 10, defend: 10, debuff: 10, heal: 10 };

  // Consciência Situacional Básica
  if (hpPercent >= 1.0) weights.heal = 0;
  if (enemy.aiDefendTurn) weights.defend = 0; // Evitar defender duas vezes seguidas
  if (heroHpPercent < 0.25) {
    weights.heavy += 40; // Tenta finalizar se o herói estiver morrendo
    weights.heal = 0;
    weights.defend = 0;
  }

  return selectActionWeighted(weights, actionPool);
}

function calculateEliteAction(enemy, hero, calc, hpPercent, heroHpPercent, baseDmg) {
  let actionPool = getActionPool(enemy, baseDmg);
  const ai = enemy.aiType || "balanced";
  let weights = { basic: 40, heavy: 20, defend: 10, debuff: 10, heal: 10 };

  // Personalidades Distintas
  if (ai === "aggressive") {
    weights = { basic: 30, heavy: 50, defend: 0, debuff: 20, heal: 0 };
    if (heroHpPercent < 0.3) weights.heavy += 60; // Bloodlust
  } else if (ai === "defensive") {
    weights = { basic: 40, heavy: 10, defend: 30, debuff: 0, heal: 20 };
    if (hpPercent < 0.4) { weights.defend += 50; weights.heal += 50; }
  } else if (ai === "caster") {
    weights = { basic: 20, heavy: 10, defend: 10, debuff: 60, heal: 20 };
  }

  // Verificações Lógicas (Utility)
  if (hpPercent >= 1.0) weights.heal = 0;
  if (enemy.aiDefendTurn) weights.defend = 0;
  
  const isHeroPoisoned = heroCombatState.statuses && heroCombatState.statuses.some(s => s.type === "poison");
  if (isHeroPoisoned) weights.debuff = 0; // Não gasta turno debuffando quem já tá sofrendo

  // Injetar Habilidades Únicas do Elite (do Banco de Dados)
  if (window.MONSTER_MOVESETS && window.MONSTER_MOVESETS[enemy.baseName]) {
    const uniqueSkills = window.MONSTER_MOVESETS[enemy.baseName];
    uniqueSkills.forEach(skill => {
      const onCooldown = enemy.cooldowns[skill.id] && enemy.cooldowns[skill.id] > 0;
      if (!onCooldown) {
        actionPool[skill.id] = { type: skill.type || "heavy_attack", dmg: Math.floor(baseDmg * skill.dmgMultiplier), log: skill.log, skillId: skill.id, effect: skill.effect };
        weights[skill.id] = skill.weight + (heroHpPercent < 0.4 ? 20 : 0); // Fica mais provável se o herói tá fraco
      }
    });
  }

  const chosen = selectActionWeighted(weights, actionPool);
  if (chosen.skillId && window.MONSTER_MOVESETS[enemy.baseName]) {
    const sk = window.MONSTER_MOVESETS[enemy.baseName].find(s => s.id === chosen.skillId);
    if (sk) enemy.cooldowns[chosen.skillId] = sk.cooldown; // Inicia cooldown
  }

  // Adiciona a reflexão ao log
  appendTerminalLog(`🧠 *O Elite ${enemy.name} avalia suas condições antes de agir...*`, "status");

  return chosen;
}

function calculateBossAction(enemy, hero, calc, hpPercent, heroHpPercent, baseDmg) {
  let actionPool = getActionPool(enemy, baseDmg);
  let weights = { basic: 20, heavy: 30, defend: 10, debuff: 20, heal: 10 };

  if (hpPercent >= 1.0) weights.heal = 0;
  if (enemy.aiDefendTurn) weights.defend = 0;

  // Aprendizado e Fase
  if (!enemy.isEnraged && hpPercent <= 0.5) {
    enemy.isEnraged = true;
    appendTerminalLog(`💀 FÚRIA DO CHEFE! ${enemy.name} perdeu o controle! Seus atributos de ataque aumentaram em 50%!`, "danger");
    enemy.atk = Math.floor(enemy.atk * 1.5);
    baseDmg = Math.floor(enemy.atk * (0.9 + Math.random() * 0.2));
    
    // Purificar debuffs no chefe ao entrar em Enrage
    if (activeCombatInstance.statuses) {
      activeCombatInstance.statuses = activeCombatInstance.statuses.filter(s => s.type !== "poison" && s.type !== "burn");
      appendTerminalLog(`🔥 A fúria purificou as aflições de ${enemy.name}!`, "danger");
    }
  }

  if (enemy.isEnraged) {
    weights.heavy += 50;
    weights.basic -= 10;
    weights.heal = 0;
    weights.defend = 0; // Chefes em fúria não defendem
  }

  // Punição de Aprendizado: Se o herói tiver menos de 30% de HP, Boss aniquila
  if (heroHpPercent <= 0.3) {
    weights.heavy += 100;
  }

  // Injetar Habilidades Únicas do Boss (do Banco de Dados)
  if (window.MONSTER_MOVESETS && window.MONSTER_MOVESETS[enemy.baseName]) {
    const uniqueSkills = window.MONSTER_MOVESETS[enemy.baseName];
    uniqueSkills.forEach(skill => {
      const onCooldown = enemy.cooldowns[skill.id] && enemy.cooldowns[skill.id] > 0;
      if (!onCooldown) {
        actionPool[skill.id] = { type: skill.type || "heavy_attack", dmg: Math.floor(baseDmg * skill.dmgMultiplier), log: skill.log, skillId: skill.id, effect: skill.effect };
        // Skills de Boss têm peso gigante se não estiverem em cooldown
        weights[skill.id] = skill.weight * (enemy.isEnraged ? 2 : 1);
      }
    });
  }

  const chosen = selectActionWeighted(weights, actionPool);
  if (chosen.skillId && window.MONSTER_MOVESETS[enemy.baseName]) {
    const sk = window.MONSTER_MOVESETS[enemy.baseName].find(s => s.id === chosen.skillId);
    if (sk) enemy.cooldowns[chosen.skillId] = sk.cooldown;
  }

  if (chosen.skillId) {
    appendTerminalLog(`⚠️ *O Chefe ${enemy.name} está preparando uma habilidade massiva!*`, "danger");
  }

  return chosen;
}

function executeMonsterAI(enemy, hero, calc) {
  // Inicializa memória da IA
  if (!enemy.cooldowns) enemy.cooldowns = {};
  if (!enemy.turnCounter) enemy.turnCounter = 0;
  enemy.turnCounter++;

  // Diminui cooldowns a cada turno
  for (let skId in enemy.cooldowns) {
    if (enemy.cooldowns[skId] > 0) {
      enemy.cooldowns[skId]--;
    }
  }

  const hpPercent = enemy.currentHp / enemy.maxHp;
  const heroHpPercent = hero.currentHp / calc.maxHp;
  let baseDmg = enemy.atk;
  baseDmg = Math.floor(baseDmg * (0.9 + Math.random() * 0.2)); // Variação de dano 90% a 110%

  // Roteador Hierárquico
  if (enemy.isBoss) {
    return calculateBossAction(enemy, hero, calc, hpPercent, heroHpPercent, baseDmg);
  } else if (enemy.isElite) {
    return calculateEliteAction(enemy, hero, calc, hpPercent, heroHpPercent, baseDmg);
  } else {
    return calculateCommonAction(enemy, hero, calc, hpPercent, heroHpPercent, baseDmg);
  }
}


// ============================================================================
// SISTEMA DE IA DE MONSTROS (Monster Brain Engine 2.0)
// ============================================================================
function getActionPool(enemy, baseDmg) {
  return {
    basic: { type: "attack", dmg: baseDmg, log: `O ${enemy.name} desfere um golpe rápido! (Ataque Básico)` },
    heavy: { type: "heavy_attack", dmg: Math.floor(baseDmg * 1.5), log: `O ${enemy.name} canaliza sua fúria num Ataque Pesado brutal!` },
    defend: { type: "defend", dmg: 0, log: `O ${enemy.name} assume uma Postura Defensiva!` },
    debuff: { type: "debuff", dmg: Math.floor(baseDmg * 0.5), log: `O ${enemy.name} lança uma praga! (Ataque Mágico)` },
    heal: { type: "heal", dmg: 0, log: `O ${enemy.name} regenera suas feridas! (Cura)` }
  };
}

function selectActionWeighted(weights, actionPool) {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  let chosenAction = "basic";
  for (let key in weights) {
    if (random < weights[key]) {
      chosenAction = key;
      break;
    }
    random -= weights[key];
  }
  return actionPool[chosenAction];
}

function calculateCommonAction(enemy, hero, calc, hpPercent, heroHpPercent, baseDmg) {
  const actionPool = getActionPool(enemy, baseDmg);
  let weights = { basic: 60, heavy: 10, defend: 10, debuff: 10, heal: 10 };

  // Consciência Situacional Básica
  if (hpPercent >= 1.0) weights.heal = 0;
  if (enemy.aiDefendTurn) weights.defend = 0; // Evitar defender duas vezes seguidas
  if (heroHpPercent < 0.25) {
    weights.heavy += 40; // Tenta finalizar se o herói estiver morrendo
    weights.heal = 0;
    weights.defend = 0;
  }

  return selectActionWeighted(weights, actionPool);
}

function calculateEliteAction(enemy, hero, calc, hpPercent, heroHpPercent, baseDmg) {
  let actionPool = getActionPool(enemy, baseDmg);
  const ai = enemy.aiType || "balanced";
  let weights = { basic: 40, heavy: 20, defend: 10, debuff: 10, heal: 10 };

  // Personalidades Distintas
  if (ai === "aggressive") {
    weights = { basic: 30, heavy: 50, defend: 0, debuff: 20, heal: 0 };
    if (heroHpPercent < 0.3) weights.heavy += 60; // Bloodlust
  } else if (ai === "defensive") {
    weights = { basic: 40, heavy: 10, defend: 30, debuff: 0, heal: 20 };
    if (hpPercent < 0.4) { weights.defend += 50; weights.heal += 50; }
  } else if (ai === "caster") {
    weights = { basic: 20, heavy: 10, defend: 10, debuff: 60, heal: 20 };
  }

  // Verificações Lógicas (Utility)
  if (hpPercent >= 1.0) weights.heal = 0;
  if (enemy.aiDefendTurn) weights.defend = 0;
  
  const isHeroPoisoned = heroCombatState.statuses && heroCombatState.statuses.some(s => s.type === "poison");
  if (isHeroPoisoned) weights.debuff = 0; // Não gasta turno debuffando quem já tá sofrendo

  // Injetar Habilidades Únicas do Elite (do Banco de Dados)
  if (window.MONSTER_MOVESETS && window.MONSTER_MOVESETS[enemy.baseName]) {
    const uniqueSkills = window.MONSTER_MOVESETS[enemy.baseName];
    uniqueSkills.forEach(skill => {
      const onCooldown = enemy.cooldowns[skill.id] && enemy.cooldowns[skill.id] > 0;
      if (!onCooldown) {
        actionPool[skill.id] = { type: skill.type || "heavy_attack", dmg: Math.floor(baseDmg * skill.dmgMultiplier), log: skill.log, skillId: skill.id, effect: skill.effect };
        weights[skill.id] = skill.weight + (heroHpPercent < 0.4 ? 20 : 0); // Fica mais provável se o herói tá fraco
      }
    });
  }

  const chosen = selectActionWeighted(weights, actionPool);
  if (chosen.skillId && window.MONSTER_MOVESETS[enemy.baseName]) {
    const sk = window.MONSTER_MOVESETS[enemy.baseName].find(s => s.id === chosen.skillId);
    if (sk) enemy.cooldowns[chosen.skillId] = sk.cooldown; // Inicia cooldown
  }

  // Adiciona a reflexão ao log
  appendTerminalLog(`🧠 *O Elite ${enemy.name} avalia suas condições antes de agir...*`, "status");

  return chosen;
}

function calculateBossAction(enemy, hero, calc, hpPercent, heroHpPercent, baseDmg) {
  let actionPool = getActionPool(enemy, baseDmg);
  let weights = { basic: 20, heavy: 30, defend: 10, debuff: 20, heal: 10 };

  if (hpPercent >= 1.0) weights.heal = 0;
  if (enemy.aiDefendTurn) weights.defend = 0;

  // Aprendizado e Fase
  if (!enemy.isEnraged && hpPercent <= 0.5) {
    enemy.isEnraged = true;
    appendTerminalLog(`💀 FÚRIA DO CHEFE! ${enemy.name} perdeu o controle! Seus atributos de ataque aumentaram em 50%!`, "danger");
    enemy.atk = Math.floor(enemy.atk * 1.5);
    baseDmg = Math.floor(enemy.atk * (0.9 + Math.random() * 0.2));
    
    // Purificar debuffs no chefe ao entrar em Enrage
    if (activeCombatInstance.statuses) {
      activeCombatInstance.statuses = activeCombatInstance.statuses.filter(s => s.type !== "poison" && s.type !== "burn");
      appendTerminalLog(`🔥 A fúria purificou as aflições de ${enemy.name}!`, "danger");
    }
  }

  if (enemy.isEnraged) {
    weights.heavy += 50;
    weights.basic -= 10;
    weights.heal = 0;
    weights.defend = 0; // Chefes em fúria não defendem
  }

  // Punição de Aprendizado: Se o herói tiver menos de 30% de HP, Boss aniquila
  if (heroHpPercent <= 0.3) {
    weights.heavy += 100;
  }

  // Injetar Habilidades Únicas do Boss (do Banco de Dados)
  if (window.MONSTER_MOVESETS && window.MONSTER_MOVESETS[enemy.baseName]) {
    const uniqueSkills = window.MONSTER_MOVESETS[enemy.baseName];
    uniqueSkills.forEach(skill => {
      const onCooldown = enemy.cooldowns[skill.id] && enemy.cooldowns[skill.id] > 0;
      if (!onCooldown) {
        actionPool[skill.id] = { type: skill.type || "heavy_attack", dmg: Math.floor(baseDmg * skill.dmgMultiplier), log: skill.log, skillId: skill.id, effect: skill.effect };
        // Skills de Boss têm peso gigante se não estiverem em cooldown
        weights[skill.id] = skill.weight * (enemy.isEnraged ? 2 : 1);
      }
    });
  }

  const chosen = selectActionWeighted(weights, actionPool);
  if (chosen.skillId && window.MONSTER_MOVESETS[enemy.baseName]) {
    const sk = window.MONSTER_MOVESETS[enemy.baseName].find(s => s.id === chosen.skillId);
    if (sk) enemy.cooldowns[chosen.skillId] = sk.cooldown;
  }

  if (chosen.skillId) {
    appendTerminalLog(`⚠️ *O Chefe ${enemy.name} está preparando uma habilidade massiva!*`, "danger");
  }

  return chosen;
}




// =========================================================================
//  COMBATE ROTINAS E MOTOR DE DANO (VERSÃO CORRIGIDA E COMPLETA)
// =========================================================================
let isActionOnCooldown = false;



function checkBossPhaseTransition(enemy) {
  if (enemy.isBoss && enemy.phase2 && !enemy.inPhase2) {
    const hpPercent = enemy.currentHp / enemy.maxHp;

    if (hpPercent <= enemy.phase2.threshold) {
      enemy.inPhase2 = true;

      // CORREÇÃO: Aplica o escalonamento Híbrido do Andar na Fase 2!
      const hero = getActiveHero();
      const scale =
        1 + hero.dungeonLevel * 0.1 + (Math.pow(1.04, hero.dungeonLevel) - 1);

      enemy.name = enemy.phase2.name;
      enemy.atk = Math.floor(enemy.phase2.atk * scale);
      enemy.def = Math.floor((enemy.phase2.def || enemy.def || 0) * scale);

      enemy.currentHp += enemy.phase2.healOnTransform;
      if (enemy.currentHp > enemy.maxHp) {
        enemy.currentHp = enemy.maxHp;
      }

      const enemyBoard = document.getElementById(MV_ID_ENEMY_CARD);
      if (enemyBoard) {
        enemyBoard.classList.add("boss-phase-2-active");
      }

      const nameDisplay = document.getElementById(MV_ID_ENEMY_NAME);
      if (nameDisplay) {
        nameDisplay.innerText = enemy.name;
        nameDisplay.classList.add("boss-phase-2-text");
      }

      document.body.classList.add(MV_CLASS_APPLY_SHAKE);
      setTimeout(() => {
        document.body.classList.remove(MV_CLASS_APPLY_SHAKE);
      }, 500);

      appendTerminalLog(`🔥🔥 FASE 2: ${enemy.phase2.message} 🔥🔥`, "status");
    }
  }
}

function _applySkillEffects(
  hero,
  calc,
  skillObj,
  heroCombatState,
  activeCombatInstance,
) {
  let rawDmg = calc.attack;
  let isHealSkill = false;
  if (rawDmg < 5) {
    rawDmg = 5 + Math.floor(hero.level * 1.2);
  }

  if (skillObj) {
    const rank = hero.skills[skillObj.id] || 1;
    const statKey = skillObj.stats || skillObj.stat;
    rawDmg = skillObj.ratio * (hero.attributes[statKey] * 2.0);
    if (rank >= 5) {
      rawDmg *= 1.35;
    }

    if (skillObj.effect) {
      if (skillObj.effect.type === "buff_def") {
        heroCombatState.defBuff += skillObj.effect.value;
      }
      if (skillObj.effect.type === "dodge") {
        heroCombatState.dodge = 1;
      }
      if (skillObj.effect.type === "blood_to_mana") {
        hero.currentHp = Math.max(1, hero.currentHp - 25);
        hero.currentMana = Math.min(
          calc.maxMp,
          hero.currentMana + skillObj.effect.value,
        );
        isHealSkill = true;
      }
      if (skillObj.effect.type === "summonMinion") {
        let maxMinions = 3;
        heroCombatState.activeMinions = heroCombatState.activeMinions || [];
        
         let numToSummon = skillObj.effect.value;
         for (let i = 0; i < numToSummon; i++) {
            if (heroCombatState.activeMinions.length >= maxMinions) {
              const rndIdx = Math.floor(Math.random() * heroCombatState.activeMinions.length);
              const bonus = rank >= 5 ? 35 : 25;
              heroCombatState.activeMinions[rndIdx].hp += bonus;
              heroCombatState.activeMinions[rndIdx].maxHp += bonus;
              appendTerminalLog(`💀 Os ossos de ${heroCombatState.activeMinions[rndIdx].name} foram reforçados (+${bonus} HP)!`, "reward");
            } else {
              const types = [];
              const book = hero.necromancyBook || {};
              
              if (book.guerreiro !== 2) {
                const g = { id: "guerreiro", name: "Guerreiro Esqueleto", icon: "⚔️", hp: 50, dmgMult: 1.0 };
                if (book.guerreiro === 1) { g.name = "Guerreiro (Ofensivo)"; g.hp = 30; g.dmgMult = 1.5; }
                types.push(g);
              }
              if (book.mago !== 2) {
                const m = { id: "mago", name: "Mago Esqueleto", icon: "🔮", hp: 25, dmgMult: 2.0 };
                if (book.mago === 1) { m.name = "Mago (Sifão)"; m.dmgMult = 1.5; m.siphon = true; }
                types.push(m);
              }
              if (book.guardiao !== 2) {
                const g2 = { id: "guardiao", name: "Guardião de Ossos", icon: "🛡️", hp: 100, dmgMult: 0.5 };
                if (book.guardiao === 1) { g2.name = "Guardião (Colosso)"; g2.hp = 150; }
                types.push(g2);
              }
              
              if (types.length === 0) {
                 types.push({ id: "guerreiro", name: "Esqueleto Frágil", icon: "💀", hp: 10, dmgMult: 0.5 });
              }
              
              let t = Object.assign({}, types[Math.floor(Math.random() * types.length)]);
              if (rank >= 5) {
                 t.hp += 25; // Ossos de Aço
              }
              t.maxHp = t.hp;
              heroCombatState.activeMinions.push(t);
              appendTerminalLog(`💀 A morte ergueu um ${t.name}! [${t.icon}${t.hp}]`, "reward");
            }
         }
        isHealSkill = true; 
      }
      if (skillObj.effect.type === "sacrificeMinion") {
        heroCombatState.activeMinions = heroCombatState.activeMinions || [];
        if (heroCombatState.activeMinions.length > 0) {
          heroCombatState.activeMinions.sort((a, b) => a.hp - b.hp);
          const sac = heroCombatState.activeMinions.shift();
          
          hero.currentMana = Math.min(calc.maxMp, hero.currentMana + 30);
          const healValue = Math.floor(calc.maxHp * 0.2);
          hero.currentHp = Math.min(calc.maxHp, hero.currentHp + healValue);
          appendTerminalLog(`🦴 Sacrifício Macabro! O ${sac.name} (${sac.icon}) foi estilhaçado para curar ${healValue} HP e 30 Mana!`, "reward");
          if (rank >= 5) {
             rawDmg = calc.attack * 2;
          } else {
             isHealSkill = true;
          }
        } else {
          appendTerminalLog(`❌ Nenhum lacaio ativo para sacrificar!`, "status");
          isHealSkill = true;
        }
      }
      if (skillObj.effect.type === "summonMinion") {
        let maxMinions = 3;
        heroCombatState.activeMinions = heroCombatState.activeMinions || [];
        
         let numToSummon = skillObj.effect.value;
         for (let i = 0; i < numToSummon; i++) {
            if (heroCombatState.activeMinions.length >= maxMinions) {
              const rndIdx = Math.floor(Math.random() * heroCombatState.activeMinions.length);
              const bonus = rank >= 5 ? 35 : 25;
              heroCombatState.activeMinions[rndIdx].hp += bonus;
              heroCombatState.activeMinions[rndIdx].maxHp += bonus;
              appendTerminalLog(`💀 Os ossos de ${heroCombatState.activeMinions[rndIdx].name} foram reforçados (+${bonus} HP)!`, "reward");
            } else {
              const types = [];
              const book = hero.necromancyBook || {};
              
              if (book.guerreiro !== 2) {
                const g = { id: "guerreiro", name: "Guerreiro Esqueleto", icon: "⚔️", hp: 50, dmgMult: 1.0 };
                if (book.guerreiro === 1) { g.name = "Guerreiro (Ofensivo)"; g.hp = 30; g.dmgMult = 1.5; }
                types.push(g);
              }
              if (book.mago !== 2) {
                const m = { id: "mago", name: "Mago Esqueleto", icon: "🔮", hp: 25, dmgMult: 2.0 };
                if (book.mago === 1) { m.name = "Mago (Sifão)"; m.dmgMult = 1.5; m.siphon = true; }
                types.push(m);
              }
              if (book.guardiao !== 2) {
                const g2 = { id: "guardiao", name: "Guardião de Ossos", icon: "🛡️", hp: 100, dmgMult: 0.5 };
                if (book.guardiao === 1) { g2.name = "Guardião (Colosso)"; g2.hp = 150; }
                types.push(g2);
              }
              
              if (types.length === 0) {
                 types.push({ id: "guerreiro", name: "Esqueleto Frágil", icon: "💀", hp: 10, dmgMult: 0.5 });
              }
              
              let t = Object.assign({}, types[Math.floor(Math.random() * types.length)]);
              if (rank >= 5) {
                 t.hp += 25; // Ossos de Aço
              }
              t.maxHp = t.hp;
              heroCombatState.activeMinions.push(t);
              appendTerminalLog(`💀 A morte ergueu um ${t.name}! [${t.icon}${t.hp}]`, "reward");
            }
         }
        isHealSkill = true; 
      }
      if (skillObj.effect.type === "sacrificeMinion") {
        heroCombatState.activeMinions = heroCombatState.activeMinions || [];
        if (heroCombatState.activeMinions.length > 0) {
          heroCombatState.activeMinions.sort((a, b) => a.hp - b.hp);
          const sac = heroCombatState.activeMinions.shift();
          
          hero.currentMana = Math.min(calc.maxMp, hero.currentMana + 30);
          const healValue = Math.floor(calc.maxHp * 0.2);
          hero.currentHp = Math.min(calc.maxHp, hero.currentHp + healValue);
          appendTerminalLog(`🦴 Sacrifício Macabro! O ${sac.name} (${sac.icon}) foi estilhaçado para curar ${healValue} HP e 30 Mana!`, "reward");
          if (rank >= 5) {
             rawDmg = calc.attack * 2;
          } else {
             isHealSkill = true;
          }
        } else {
          appendTerminalLog(`❌ Nenhum lacaio ativo para sacrificar!`, "status");
          isHealSkill = true;
        }
      }
      if (
        skillObj.effect.type === "heal" ||
        skillObj.effect.type === "heal_self"
      ) {
        let hV =
          hero.attributes[statKey] *
          skillObj.effect.ratio *
          (rank >= 5 ? 2 : 1);
        
        if (typeof HeroTraits !== "undefined") {
          hV = HeroTraits.getHealMod(hero, hV);
          hV = HeroTraits.getHealReceivedMod(hero, hV); // herói se curando
        }
        
        hV = Math.floor(hV);
        hero.currentHp = Math.min(calc.maxHp, hero.currentHp + hV);
        generateFloatingText(Math.floor(hV), "heal", "hero");
        appendTerminalLog(
          `✨ A sagrada arte da cura [${skillObj.name}] transmutou feridas suturando o seu HP em ${Math.floor(hV)} pontos!`,
          "reward",
        );
        isHealSkill = true;
      }
      if (
        skillObj.effect.type === "execute" &&
        activeCombatInstance.hp / activeCombatInstance.maxHp <=
          skillObj.effect.threshold
      ) {
        rawDmg = activeCombatInstance.maxHp * 10;
        appendTerminalLog(
          "☠️ FADALIDADE DO EXECUTOR: Abate rápido! O monstro sofreu sangria irreversível.",
          "reward",
        );
      }
    }
    if (!isHealSkill) {
      appendTerminalLog(`🔮 O Herói conjurou: ${skillObj.name}...`);
    }
  }
  return { rawDmg, isHealSkill };
}





// Usar consumíveis fora do combate (inventário)







// ================= SAFE ROOM =================
window.restInSafeRoom = function () {
  const h = getActiveHero();
  const c = computeLiveStats();
  h.currentHp = c.maxHp;
  h.currentMana = c.maxMp;
  h.stamina = c.maxStamina;

  // NOVO: Salva este andar como a última fogueira acesa! Se morrer, volta pra cá.
  h.lastBonfireLevel = h.dungeonLevel;

  appendTerminalLog(
    "✨ A Fogueira Encantada do Santuário suturou o tecido necrótico, limpando as impurezas.",
    "reward",
  );

  // EMBOSCADA NA FOGUEIRA (8%)
  if (Math.random() /* nosonar */ < 0.08) {
    appendTerminalLog(
      "🔪 O PESADELO DESPERTA! Um Caçador das Sombras emboscou você enquanto dormia!",
      "combat",
    );
    triggerScreenShake();
    h.inBossRestArea = false;
    initCombatInstance(false);
    activeCombatInstance.name = "Caçador das Sombras [Assassino]";
    activeCombatInstance.atk = Math.floor(activeCombatInstance.atk * 1.5);
    triggerToast("🔥 EMBOSCADA! Defenda-se imediatamente!");
  } else {
    triggerToast("Cura Espiritual Absoluta Processada.");
  }

  commitStorage();
  renderAllEngines();
};

window.talkToMemoryGuardian = function () {
  const h = getActiveHero();
  if (!h.loreChapters) {
    h.loreChapters = {};
  }

  let completed = 0;
  Object.values(h.loreChapters).forEach((ch) => {
    if (ch.completed) {
      completed++;
    }
  });

  if (completed === 0) {
    appendTerminalLog(
      "🗣️ O Guardião das Memórias: 'Sua mente ainda está vazia. O abismo devora os ignorantes. Encontre as páginas perdidas.'",
      "normal",
    );
  } else if (completed < 4) {
    appendTerminalLog(
      `🗣️ O Guardião das Memórias: 'Vejo que você já domou ${completed} capítulo(s) do caos. A verdade fragmenta a alma, mas o aço forjado na dor não quebra.'`,
      "reward",
    );
  } else {
    appendTerminalLog(
      "🗣️ O Guardião das Memórias: 'Você leu todos os capítulos do Santuário. A profecia final aguarda a sua leitura na Cronologia. O sacrifício será recompensado.'",
      "reward",
    );
  }
  triggerToast("O Guardião observa seus passos.");
  commitStorage();
  renderAllEngines();
};

window.leaveSafeRoom = function () {
  const h = getActiveHero();
  h.inBossRestArea = false;
  h.dungeonLevel++;
  if (!h.maxDungeonLevel) {
    h.maxDungeonLevel = h.dungeonLevel;
  }
  if (h.dungeonLevel > h.maxDungeonLevel) {
    h.maxDungeonLevel = h.dungeonLevel;
  }

  h.floorExploration = 0;
  h.floorCleared = false;
  h.floorProgress = 0;

  appendTerminalLog(
    "A pesada porta de ferro negro caiu bloqueando o retorno. Fumaça paira e você entra na zona perigosa escura do próximo andar profundo das criptas.",
    "system",
  );
  commitStorage();
  renderAllEngines();
};

window.fastTravelTo = function (targetLevel) {
  const h = getActiveHero();
  if (!h.maxDungeonLevel) {
    h.maxDungeonLevel = h.dungeonLevel;
  }
  if (targetLevel > h.maxDungeonLevel) {
    return triggerToast(
      "Bioma bloqueado! Avance mais andares para liberar esta viagem.",
    );
  }
  h.dungeonLevel = targetLevel;
  appendTerminalLog(
    "✨ As névoas se dissiparam e a caravana das sombras te deixou em um novo bioma conhecido.",
    "system",
  );
  closeFastTravelModal();
  commitStorage();
  renderAllEngines();
};

window.openFastTravelModal = function () {
  const h = getActiveHero();
  if (!h) {
    return;
  }
  const maxLevel = h.maxDungeonLevel || h.dungeonLevel;

  const listContainer = document.getElementById("fast-travel-list");
  listContainer.innerHTML = "";

  BIOMES.forEach((biome, index) => {
    const targetLevel = index * 5 + 1;
    const isUnlocked = maxLevel >= targetLevel;

    const btn = document.createElement("button");
    btn.className = isUnlocked ? "btn btn-secondary" : "btn";
    btn.style.textAlign = "left";
    btn.style.padding = "12px";
    btn.style.fontSize = "1rem";
    btn.style.display = "flex";
    btn.style.justifyContent = "space-between";

    if (isUnlocked) {
      btn.innerHTML = `<span style="color:${biome.color};">${biome.name} (Nível ${targetLevel})</span> <span style="color:#10b981;">✔ Desbloqueado</span>`;
      btn.onclick = () => fastTravelTo(targetLevel);
    } else {
      btn.style.opacity = "0.5";
      btn.style.cursor = "not-allowed";
      btn.innerHTML = `<span style="color:#6b7280;">Desconhecido (Nível ${targetLevel})</span> <span style="color:#ef4444;">🔒 Bloqueado</span>`;
    }
    listContainer.appendChild(btn);
  });

  document.getElementById(MV_ID_FAST_TRAVEL).style.display = "flex";
};

window.closeFastTravelModal = function () {
  document.getElementById(MV_ID_FAST_TRAVEL).style.display = "none";
};

// getCurrentBiome definido anteriormente — duplicata removida

// BOOT THE ENGINE CORE
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", () => {
    initializeEngine();
  });
} else {
  initializeEngine();
}

window.allocateAttributePoint = function (attr) {
  const hero = getActiveHero();
  if (!hero) {
    return;
  }

  if (hero.statPoints > 0) {
    hero.attributes[attr]++;
    hero.statPoints--;
    commitStorage();
    renderAllEngines();
    triggerToast(
      `✨ O atributo <strong style="text-transform:uppercase;">${attr}</strong> foi aprimorado!`,
    );
  } else {
    triggerToast("Você não possui Pontos Livres de atributo.");
  }
};

// ====================== MERCADO GLOBAL ======================
var globalMarketItems = [];

function generateGlobalMarket() {
  globalMarketItems = [];
  const hero = getActiveHero();
  const floor = hero ? hero.dungeonLevel : 1;

  const types = [
    "arma",
    "capacete",
    "armadura",
    "luvas",
    "botas",
    "escudo",
    "anel",
  ];
  const prefixes = [
    "Ébano",
    "Celestial",
    "Abissal",
    "Primal",
    "Arcano",
    "Sanguíneo",
    "Eterno",
    "Voraz",
  ];

  const itemCount = 4 + Math.floor(floor / 4);

  for (let i = 0; i < itemCount; i++) {
    let rarity = "Normal";
    const roll = Math.random(); /* nosonar */
    if (roll < 0.28) {
      rarity = "Magico";
    }
    if (roll < 0.09) {
      rarity = "Raro";
    }
    if (roll < 0.025 && floor >= 10) {
      rarity = "Lendario";
    }

    const cType = types[Math.floor(Math.random() /* nosonar */ * types.length)];
    const basePower = 15 + Math.floor(floor * 5);
    const power = Math.floor(
      basePower *
        (rarity === "Lendario"
          ? 3.0
          : rarity === "Raro"
            ? 2.0
            : rarity === "Magico"
              ? 1.55
              : 1.0),
    );

    let damage = 0;
    let defense = 0;

    if (["arma", "escudo"].includes(cType)) {
      damage = power;
    } else {
      defense = Math.floor(power * 1.12);
    }

    let intrinsic = null;
    if (rarity !== "Normal") {
      intrinsic = JSON.parse(
        JSON.stringify(
          ITEM_PASSIVES_POOL[
            Math.floor(Math.random() /* nosonar */ * ITEM_PASSIVES_POOL.length)
          ],
        ),
      );
    }

    const price = Math.floor(
      power * 4.2 +
        (rarity === "Lendario" ? 380 : rarity === "Raro" ? 140 : 55),
    );

    globalMarketItems.push({
      id: "market_" + Date.now() + "_" + i,
      name: `${cType.toUpperCase()} ${prefixes[Math.floor(Math.random() /* nosonar */ * prefixes.length)]} [${rarity}]`,
      type: cType,
      rarity: rarity,
      damage: damage,
      defense: defense,
      power: power,
      price: price,
      intrinsic: intrinsic,
      desc: `Item encontrado nas profundezas do andar ${floor}.`,
    });
  }
}

function renderGlobalMarket() {
  const container = document.getElementById("global-market-grid");
  if (!container) {
    return;
  }
  container.innerHTML = "";

  globalMarketItems.forEach((item) => {
    container.innerHTML += `
                    <div class="item-card rare-${item.rarity}" style="cursor:pointer;" onclick="buyMarketItem('${item.id}')">
                        <div class="item-title-row">
                            <strong class="item-name">${item.name}</strong>
                            <span class="item-rarity-tag">${item.rarity}</span>
                        </div>
                        <div class="item-stats-row">Poder: <strong>+${item.power}</strong></div>
                        ${item.intrinsic ? `<div class="item-passive-box">✨ ${item.intrinsic.label}</div>` : ""}
                        <div style="color:var(--gold-glowing); font-weight:900; font-size:1.25rem; margin-top:12px;">
                            ${item.price} 🪙
                        </div>
                        <button class="btn btn-success btn-small" style="width:100%; margin-top:10px;">Comprar no Mercado</button>
                    </div>
                `;
  });
}

window.buyMarketItem = function (itemId) {
  const hero = getActiveHero();
  const item = globalMarketItems.find((i) => i.id === itemId);
  if (!item) {
    return;
  }

  if (hero.gold < item.price) {
    return triggerToast(
      "Você não tem ouro suficiente para comprar esta relíquia.",
    );
  }

  hero.gold -= item.price;

  hero.inventory.push({
    id: item.id,
    name: item.name,
    type: item.type,
    rarity: item.rarity,
    damage: item.damage || 0,
    defense: item.defense || 0,
    power: item.power || item.damage || item.defense || 15,
    intrinsic: item.intrinsic,
    desc: item.desc || "Item adquirido no Mercado Global.",
    durability: 50 + Math.floor(hero.level * 2),
    maxDurability: 50 + Math.floor(hero.level * 2),
  });

  triggerToast(
    `✅ Compra realizada! ${item.name} adicionado ao seu inventário.`,
  );
  commitStorage();
  renderAllEngines();
};

window.refreshGlobalMarket = function () {
  generateGlobalMarket();
  renderGlobalMarket();
  triggerToast("O Mercado Global foi atualizado com novas mercadorias...");
};

// Atualizar renderForgeAndMarket
function renderForgeAndMarket() {
  renderGlobalMarket();
  renderUpgradeInventory();
  renderEnchantInventory();
  renderSocketInventory();
  renderRepairMesh();
}

// =========================================================================
//  SISTEMA DE EVENTOS NARRATIVOS NA MASMORRA
// =========================================================================
const DUNGEON_EVENTS = [
  // === EVENTOS UNIVERSAIS (qualquer bioma) ===
  {
    icon: "🕯️",
    title: "Altar Esquecido",
    desc: "Uma fogueira crepita num recanto escondido. Um altar de pedra emana calor reconfortante. Runas antigas brilham.",
    choices: [
      {
        text: "🙏 Rezar no altar",
        action: (h) => {
          const heal = Math.floor(h.attributes.sabedoria * 4);
          h.currentHp = Math.min(h.currentHp + heal, computeLiveStats().maxHp);
          return `Uma luz dourada te envolveu. +${heal} HP restaurados.`;
        },
        color: "#a7f3d0",
      },
      {
        text: "💰 Saquear as oferendas",
        action: (h) => {
          const g = 30 + Math.floor(Math.random() /* nosonar */ * 80);
          h.gold += g;
          return `Você encontrou ${g} PO entre as oferendas. Os deuses não parecem satisfeitos...`;
        },
        color: "#fbbf24",
      },
      {
        text: "👁️ Examinar as runas",
        action: (h) => {
          h.xp += 25;
          return `As runas revelam segredos antigos. +25 XP de conhecimento arcano.`;
        },
        color: "#93c5fd",
      },
    ],
  },
  {
    icon: "🧙",
    title: "Mercador Errante",
    desc: 'Um velho encapuzado aparece das sombras. "Tenho raridades, Nephalem... por um preço." Sua mochila transborda.',
    choices: [
      {
        text: "💊 Comprar Elixir de Vida (30 PO)",
        action: (h) => {
          if (h.gold < 30) {
            return "Não tem ouro suficiente!";
          }
          h.gold -= 30;
          h.inventory.push({
            id: "pot_event",
            name: "Elixir de Vida",
            type: "consumivel_hp",
            power: 200,
            rarity: "Magico",
            desc: "Elixir comprado de um errante.",
          });
          return `Um frasco brilhante foi adicionado ao seu inventário.`;
        },
        color: "#a7f3d0",
      },
      {
        text: "🔮 Comprar Essência Menor (50 PO)",
        action: (h) => {
          if (h.gold < 50) {
            return "Não tem ouro suficiente!";
          }
          h.gold -= 50;
          h.materials.essencia_menor = (h.materials.essencia_menor || 0) + 2;
          return `+2 Essência Menor adicionadas à arca.`;
        },
        color: "#c084fc",
      },
      {
        text: "🚶 Ignorar e seguir",
        action: () =>
          `O mercador desaparece nas sombras como se nunca estivesse ali.`,
        color: "#6b7280",
      },
    ],
  },
  {
    icon: "⚠️",
    title: "Armadilha Arcana",
    desc: "O chão brilha com glifos. Antes que você possa reagir, uma armadilha mágica se ativa! Teste de agilidade!",
    choices: [
      {
        text: "🏃 Tentar esquivar (AGI)",
        action: (h) => {
          const roll =
            Math.floor(Math.random() /* nosonar */ * 20) +
            1 +
            Math.floor(h.attributes.agilidade / 3);
          if (roll >= 14) {
            return `Reflexos felinos! Você desvia no último instante. Ileso.`;
          }
          const dmg = 15 + Math.floor(Math.random() /* nosonar */ * 20);
          h.currentHp = Math.max(1, h.currentHp - dmg);
          return `Muito lento! Os glifos explodem. -${dmg} HP.`;
        },
        color: "#fcd34d",
      },
      {
        text: "🛡️ Resistir com força (CON)",
        action: (h) => {
          const roll =
            Math.floor(Math.random() /* nosonar */ * 20) +
            1 +
            Math.floor(h.attributes.constituicao / 3);
          if (roll >= 12) {
            return `Seu corpo aguentou o impacto! Apenas arranhões.`;
          }
          const dmg = 20 + Math.floor(Math.random() /* nosonar */ * 15);
          h.currentHp = Math.max(1, h.currentHp - dmg);
          return `A energia atravessa sua defesa. -${dmg} HP.`;
        },
        color: "#fca5a5",
      },
    ],
  },
  {
    icon: "📜",
    title: "Inscrição na Parede",
    desc: '"Aquele que avança sem olhar para trás encontrará o que buscava... ou a morte." As palavras pulsam.',
    choices: [
      {
        text: "📖 Estudar a inscrição",
        action: (h) => {
          h.xp += 40;
          return `Conhecimento ancestral flui para você. +40 XP.`;
        },
        color: "#93c5fd",
      },
      {
        text: "✋ Tocar nas palavras",
        action: (h) => {
          const r = Math.random(); /* nosonar */
          if (r < 0.5) {
            const g = 60 + Math.floor(Math.random() /* nosonar */ * 60);
            h.gold += g;
            return `As runas revelam um compartimento secreto! +${g} PO!`;
          } else {
            const d = 10 + Math.floor(Math.random() /* nosonar */ * 15);
            h.currentHp = Math.max(1, h.currentHp - d);
            return `Uma descarga arcana queima seus dedos! -${d} HP.`;
          }
        },
        color: "#fbbf24",
      },
    ],
  },
  {
    icon: "💀",
    title: "Cadáver de Aventureiro",
    desc: "Um corpo coberto de teias repousa contra a parede. Ainda segura uma bolsa e um diário manchado de sangue.",
    choices: [
      {
        text: "🎒 Revistar a bolsa",
        action: (h) => {
          const g = 20 + Math.floor(Math.random() /* nosonar */ * 50);
          h.gold += g;
          const m = ["ferro", "cobre", "carvao", "couro"][
            Math.floor(Math.random() /* nosonar */ * 4)
          ];
          h.materials[m] = (h.materials[m] || 0) + 3;
          return `Encontrou ${g} PO e +3 ${m.toUpperCase()}.`;
        },
        color: "#fbbf24",
      },
      {
        text: "📔 Ler o diário",
        action: (h) => {
          h.xp += 30;
          return `"Dia 47... as sombras ficam mais densas..." O conhecimento do falecido agora é seu. +30 XP.`;
        },
        color: "#93c5fd",
      },
      {
        text: "🙏 Dar descanso ao corpo",
        action: (h) => {
          const heal = Math.floor(h.attributes.sabedoria * 2);
          h.currentHp = Math.min(h.currentHp + heal, computeLiveStats().maxHp);
          return `Uma paz inexplicável envolve você. Karma bom restaura +${heal} HP.`;
        },
        color: "#a7f3d0",
      },
    ],
  },
  {
    icon: "🔮",
    title: "Cristal Pulsante",
    desc: "Uma formação cristalina emite pulsos de luz roxa. Parece reagir à sua presença. O ar vibra.",
    choices: [
      {
        text: "⚡ Absorver a energia",
        action: (h) => {
          const r = Math.random(); /* nosonar */
          if (r < 0.6) {
            h.currentMana = Math.min(
              h.currentMana + 50,
              computeLiveStats().maxMp,
            );
            return `Energia pura! +50 Mana restaurada.`;
          } else {
            const d = 15;
            h.currentHp = Math.max(1, h.currentHp - d);
            return `A energia era instável! Sobrecarga arcana: -${d} HP.`;
          }
        },
        color: "#c084fc",
      },
      {
        text: "⛏️ Extrair o cristal",
        action: (h) => {
          h.materials.quartzo = (h.materials.quartzo || 0) + 2;
          return `O cristal se fragmenta em pedaços utilizáveis. +2 Quartzo Arcano.`;
        },
        color: "#fbcfe8",
      },
    ],
  },
  {
    icon: "🐀",
    title: "Ninho de Criaturas",
    desc: "Você ouve guinchos e arranhões vindos de um buraco na parede. Algo brilha lá dentro entre os ossos roídos.",
    choices: [
      {
        text: "🤚 Enfiar a mão",
        action: (h) => {
          const r = Math.random(); /* nosonar */
          if (r < 0.5) {
            const g = 40 + Math.floor(Math.random() /* nosonar */ * 40);
            h.gold += g;
            return `Entre os ossos, moedas esquecidas! +${g} PO!`;
          } else {
            const d = 10 + Math.floor(Math.random() /* nosonar */ * 10);
            h.currentHp = Math.max(1, h.currentHp - d);
            return `UGH! Uma criatura mordeu sua mão! -${d} HP.`;
          }
        },
        color: "#fbbf24",
      },
      {
        text: "🔥 Queimar o ninho",
        action: (h) => {
          h.xp += 15;
          return `O fogo elimina a ameaça. Cinzas e um cheiro terrível. +15 XP.`;
        },
        color: "#ef4444",
      },
      {
        text: "🚶 Passar ao largo",
        action: () => `Às vezes a sabedoria está em deixar quieto.`,
        color: "#6b7280",
      },
    ],
  },
  {
    icon: "🗿",
    title: "Estátua Guardiã",
    desc: "Uma estátua imponente de guerreiro antigo bloqueia parcialmente o corredor. Seus olhos de rubi parecem te seguir.",
    choices: [
      {
        text: "⚔️ Desafiar a estátua",
        action: (h) => {
          const roll = Math.floor(Math.random() /* nosonar */ * 20) + 1;
          if (roll >= 15) {
            h.xp += 60;
            return `Crítico! A estátua se curva. Ela reconhece sua força. +60 XP!`;
          }
          const d = 25;
          h.currentHp = Math.max(1, h.currentHp - d);
          return `A estátua golpeia! Rolagem ${roll}. -${d} HP!`;
        },
        color: "#ef4444",
      },
      {
        text: "💎 Arrancar os olhos de rubi",
        action: (h) => {
          h.materials.rubi = (h.materials.rubi || 0) + 1;
          return `Um rubi! +1 Rubi de Sangue. A estátua parece... triste.`;
        },
        color: "#f87171",
      },
      {
        text: "🙇 Reverenciar",
        action: (h) => {
          h.stamina = Math.min(h.stamina + 20, computeLiveStats().maxStamina);
          return `A estátua brilha brevemente. Você se sente revigorado. +20 Estamina.`;
        },
        color: "#a7f3d0",
      },
    ],
  },
  {
    icon: "🌊",
    title: "Fonte Misteriosa",
    desc: "Uma fonte de água cristalina brota do chão de pedra. A água tem um brilho incomum. Beber ou não beber?",
    choices: [
      {
        text: "🥤 Beber da fonte",
        action: (h) => {
          const r = Math.random(); /* nosonar */
          if (r < 0.65) {
            const calc = computeLiveStats();
            h.currentHp = calc.maxHp;
            h.currentMana = calc.maxMp;
            return `A água divina restaura tudo! HP e Mana totalmente restaurados!`;
          }
          return `A água tem gosto de ferrugem. Nada aconteceu.`;
        },
        color: "#60a5fa",
      },
      {
        text: "🫗 Encher um frasco",
        action: (h) => {
          h.inventory.push({
            id: "pot_fonte",
            name: "Água Mística",
            type: "consumivel_hp",
            power: 250,
            rarity: "Raro",
            desc: "Água coletada de uma fonte misteriosa.",
          });
          return `Você encheu um frasco. Item adicionado ao inventário!`;
        },
        color: "#93c5fd",
      },
    ],
  },
  {
    icon: "👻",
    title: "Espectro Sussurrante",
    desc: '"Nephalem..." Um espírito translúcido flutua à sua frente. Não parece hostil... ainda.',
    choices: [
      {
        text: "🗣️ Conversar",
        action: (h) => {
          h.xp += 50;
          return `O espectro conta histórias do passado. Sabedoria ancestral absorvida. +50 XP.`;
        },
        color: "#93c5fd",
      },
      {
        text: "⚔️ Atacar preventivamente",
        action: (h) => {
          const g = 30 + Math.floor(Math.random() /* nosonar */ * 40);
          h.gold += g;
          return `O espectro se dissolve, deixando para trás ectoplasma cristalizado. +${g} PO.`;
        },
        color: "#ef4444",
      },
      {
        text: "🙏 Oferecer respeito",
        action: (h) => {
          h.materials.essencia_menor = (h.materials.essencia_menor || 0) + 1;
          return `O espectro sorri e se dissipa. Uma essência flutuou até sua mão. +1 Essência Menor.`;
        },
        color: "#ddd6fe",
      },
    ],
  },
];

let narrativeEventActive = false;

function triggerNarrativeEvent() {
  if (narrativeEventActive) {
    return;
  }
  const event =
    DUNGEON_EVENTS[
      Math.floor(Math.random() /* nosonar */ * DUNGEON_EVENTS.length)
    ];
  narrativeEventActive = true;

  const modal = document.getElementById("narrative-event-modal");
  document.getElementById("event-icon").textContent = event.icon;
  document.getElementById("event-title").textContent = event.title;
  document.getElementById("event-desc").textContent = event.desc;
  document.getElementById("event-result").style.display = "none";
  document.getElementById("event-close-btn").style.display = "none";

  const choicesDiv = document.getElementById("event-choices");
  choicesDiv.innerHTML = "";
  choicesDiv.style.display = "flex";

  event.choices.forEach((choice, _i) => {
    const btn = document.createElement("button");
    btn.style.cssText = `padding:14px 20px; font-size:0.95rem; background:rgba(0,0,0,0.5); border:1px solid ${choice.color}; color:${choice.color}; border-radius:6px; cursor:pointer; font-family:'Cinzel',serif; transition:all 0.3s; text-align:left;`;
    btn.textContent = choice.text;
    btn.onmouseover = () => {
      btn.style.background = choice.color + "20";
      btn.style.transform = "scale(1.02)";
    };
    btn.onmouseout = () => {
      btn.style.background = "rgba(0,0,0,0.5)";
      btn.style.transform = "scale(1)";
    };
    btn.onclick = () => resolveNarrativeEvent(choice);
    choicesDiv.appendChild(btn);
  });

  modal.style.display = "flex";
}

function resolveNarrativeEvent(choice) {
  const hero = getActiveHero();
  const resultText = choice.action(hero);

  document.getElementById("event-choices").style.display = "none";
  const resultDiv = document.getElementById("event-result");
  resultDiv.style.display = "block";
  resultDiv.style.background = "rgba(0,0,0,0.4)";
  resultDiv.style.border = `1px solid ${choice.color}`;
  resultDiv.style.color = choice.color;
  resultDiv.innerHTML = `✦ ${resultText}`;
  document.getElementById("event-close-btn").style.display = "block";

  commitStorage();
  renderAllEngines();
}

window.closeNarrativeEvent = function () {
  document.getElementById("narrative-event-modal").style.display = "none";
  narrativeEventActive = false;
};

// Integrar eventos na exploração - patch das funções existentes
const _originalChoosePath = window.chooseDungeonPath;
window.chooseDungeonPath = function (direction) {
  _originalChoosePath(direction);
  // 30% de chance de evento narrativo após cada escolha de caminho
  if (Math.random() /* nosonar */ < 0.3 && !narrativeEventActive) {
    setTimeout(() => triggerNarrativeEvent(), 600);
  }
};

const _originalExplore = exploreCurrentFloor;
window.exploreCurrentFloor = function () {
  _originalExplore();
  // 20% de chance ao farmar
  if (Math.random() /* nosonar */ < 0.2 && !narrativeEventActive) {
    setTimeout(() => triggerNarrativeEvent(), 600);
  }
};
// Sobrescreve a referência global
// eslint-disable-next-line no-func-assign
exploreCurrentFloor = window.exploreCurrentFloor;

// =========================================================================
//  SISTEMA DE ÁUDIO — Web Audio API SFX
// =========================================================================
const GameAudio = {
  ctx: null,
  volume: 0.3,
  muted: false,

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error_) {
      console.error(error_);
    }
  },

  play(type) {
    if (this.muted || !this.ctx) {
      return;
    }
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = this.volume * 0.15;

    switch (type) {
      case "hit":
        osc.type = "sawtooth";
        osc.frequency.value = 180;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
        break;
      case "crit":
        osc.type = "square";
        osc.frequency.value = 300;
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
        break;
      case "levelup": {
        osc.type = "sine";
        osc.frequency.value = 523;
        gain.gain.value = this.volume * 0.1;
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = "sine";
        osc2.frequency.value = 659;
        gain2.gain.value = this.volume * 0.1;
        osc2.start(ctx.currentTime + 0.15);
        osc2.stop(ctx.currentTime + 0.5);
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.type = "sine";
        osc3.frequency.value = 784;
        gain3.gain.value = this.volume * 0.1;
        osc3.start(ctx.currentTime + 0.3);
        osc3.stop(ctx.currentTime + 0.65);
        break;
      }
      case "death":
        osc.type = "sawtooth";
        osc.frequency.value = 200;
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1);
        break;
      case "reward":
        osc.type = "triangle";
        osc.frequency.value = 880;
        gain.gain.value = this.volume * 0.08;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
        break;
      case "click":
        osc.type = "sine";
        osc.frequency.value = 600;
        gain.gain.value = this.volume * 0.05;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
        break;
      case "achieve": {
        osc.type = "sine";
        osc.frequency.value = 440;
        gain.gain.value = this.volume * 0.12;
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
        const a2 = ctx.createOscillator();
        const ag2 = ctx.createGain();
        a2.connect(ag2);
        ag2.connect(ctx.destination);
        a2.type = "sine";
        a2.frequency.value = 554;
        ag2.gain.value = this.volume * 0.12;
        a2.start(ctx.currentTime + 0.1);
        a2.stop(ctx.currentTime + 0.6);
        const a3 = ctx.createOscillator();
        const ag3 = ctx.createGain();
        a3.connect(ag3);
        ag3.connect(ctx.destination);
        a3.type = "sine";
        a3.frequency.value = 659;
        ag3.gain.value = this.volume * 0.12;
        a3.start(ctx.currentTime + 0.2);
        a3.stop(ctx.currentTime + 0.7);
        const a4 = ctx.createOscillator();
        const ag4 = ctx.createGain();
        a4.connect(ag4);
        ag4.connect(ctx.destination);
        a4.type = "sine";
        a4.frequency.value = 880;
        ag4.gain.value = this.volume * 0.1;
        a4.start(ctx.currentTime + 0.35);
        a4.stop(ctx.currentTime + 0.9);
        break;
      }
    }
  },
};
// Inicializa no primeiro clique
document.addEventListener(
  "click",
  () => {
    if (!GameAudio.ctx) {
      GameAudio.init();
    }
  },
  { once: true },
);

window.toggleGameAudio = function () {
  GameAudio.muted = !GameAudio.muted;
  const btn = document.getElementById("game-audio-toggle");
  btn.textContent = GameAudio.muted ? "🔇 Mudo" : "🔊 Áudio";
};
window.setGameVolume = function (val) {
  GameAudio.volume = parseInt(val) / 100;
};

// Patch death para tocar som
const _origDeath = window.handleHeroDeath;

// =========================================================================
//  SISTEMA DE CONQUISTAS / ACHIEVEMENTS
// =========================================================================
const ACHIEVEMENTS_DB = [
  {
    id: "first_blood",
    icon: "⚔️",
    name: "Primeiro Sangue",
    desc: "Derrote seu primeiro monstro.",
    check: (h) => (h.stats?.kills || 0) >= 1,
    max: 1,
    progress: (h) => Math.min(1, h.stats?.kills || 0),
  },
  {
    id: "slayer_50",
    icon: "💀",
    name: "Exterminador",
    desc: "Mate 50 monstros no total.",
    check: (h) => (h.stats?.kills || 0) >= 50,
    max: 50,
    progress: (h) => h.stats?.kills || 0,
  },
  {
    id: "slayer_200",
    icon: "☠️",
    name: "Ceifador",
    desc: "Mate 200 monstros no total.",
    check: (h) => (h.stats?.kills || 0) >= 200,
    max: 200,
    progress: (h) => h.stats?.kills || 0,
  },
  {
    id: "boss_first",
    icon: "👹",
    name: "Caçador de Chefes",
    desc: "Derrote seu primeiro Boss.",
    check: (h) => (h.stats?.bossKills || 0) >= 1,
    max: 1,
    progress: (h) => Math.min(1, h.stats?.bossKills || 0),
  },
  {
    id: "boss_all",
    icon: "🐲",
    name: "Dominador",
    desc: "Derrote 7 Bosses diferentes.",
    check: (h) => (h.stats?.bossKills || 0) >= 7,
    max: 7,
    progress: (h) => h.stats?.bossKills || 0,
  },
  {
    id: "legendary",
    icon: "🗡️",
    name: "Lâmina Dourada",
    desc: "Obtenha um item Lendário.",
    check: (h) => h.inventory.some((i) => i.rarity === "Lendario"),
    max: 1,
    progress: (h) => (h.inventory.some((i) => i.rarity === "Lendario") ? 1 : 0),
  },
  {
    id: "forge_5",
    icon: "🔨",
    name: "Mestre da Forja",
    desc: "Forje 5 melhorias na forja.",
    check: (h) => (h.stats?.forges || 0) >= 5,
    max: 5,
    progress: (h) => h.stats?.forges || 0,
  },
  {
    id: "coward",
    icon: "🏃",
    name: "Covarde Sábio",
    desc: "Fuja 10 vezes de combates.",
    check: (h) => (h.stats?.retreats || 0) >= 10,
    max: 10,
    progress: (h) => h.stats?.retreats || 0,
  },
  {
    id: "miner_25",
    icon: "⛏️",
    name: "Minerador Obsessivo",
    desc: "Minere 25 vezes na Mina Abissal.",
    check: (h) => (h.stats?.mines || 0) >= 25,
    max: 25,
    progress: (h) => h.stats?.mines || 0,
  },
  {
    id: "level_10",
    icon: "⭐",
    name: "Veterano",
    desc: "Alcance o nível 10.",
    check: (h) => h.level >= 10,
    max: 10,
    progress: (h) => h.level,
  },
  {
    id: "level_25",
    icon: "🌟",
    name: "Lenda",
    desc: "Alcance o nível 25.",
    check: (h) => h.level >= 25,
    max: 25,
    progress: (h) => h.level,
  },
  {
    id: "level_50",
    icon: "💫",
    name: "Semideus",
    desc: "Alcance o nível 50.",
    check: (h) => h.level >= 50,
    max: 50,
    progress: (h) => h.level,
  },
  {
    id: "gold_1000",
    icon: "💰",
    name: "Avarento",
    desc: "Acumule 1.000 PO de uma vez.",
    check: (h) => h.gold >= 1000,
    max: 1000,
    progress: (h) => h.gold,
  },
  {
    id: "gold_10000",
    icon: "👑",
    name: "Rei das Moedas",
    desc: "Acumule 10.000 PO de uma vez.",
    check: (h) => h.gold >= 10000,
    max: 10000,
    progress: (h) => h.gold,
  },
  {
    id: "death_5",
    icon: "💀",
    name: "Imortal Teimoso",
    desc: "Morra 5 vezes.",
    check: (h) => (h.stats?.deaths || 0) >= 5,
    max: 5,
    progress: (h) => h.stats?.deaths || 0,
  },
  {
    id: "floor_10",
    icon: "🏰",
    name: "Explorador",
    desc: "Alcance o andar 10 da masmorra.",
    check: (h) => h.dungeonLevel >= 10,
    max: 10,
    progress: (h) => h.dungeonLevel,
  },
  {
    id: "floor_25",
    icon: "🌋",
    name: "Viajante do Abismo",
    desc: "Alcance o andar 25 da masmorra.",
    check: (h) => h.dungeonLevel >= 25,
    max: 25,
    progress: (h) => h.dungeonLevel,
  },
  {
    id: "companion",
    icon: "🤝",
    name: "Amizade Improvável",
    desc: "Recrute seu primeiro companheiro.",
    check: (h) => (h.companions?.length || 0) >= 1,
    max: 1,
    progress: (h) => h.companions?.length || 0,
  },
  {
    id: "full_equip",
    icon: "🛡️",
    name: "Totalmente Equipado",
    desc: "Equipe itens em todos os slots.",
    check: (h) => Object.values(h.equipment || {}).every((e) => e !== null),
    max: 1,
    progress: (h) =>
      Object.values(h.equipment || {}).every((e) => e !== null) ? 1 : 0,
  },
  {
    id: "lore_chapter",
    icon: "📖",
    name: "Historiador",
    desc: "Complete um capítulo de Lore.",
    check: (h) =>
      Object.values(h.loreChapters || {}).some((ch) => ch.completed),
    max: 1,
    progress: (h) =>
      Object.values(h.loreChapters || {}).some((ch) => ch.completed) ? 1 : 0,
  },
];

function initHeroStats(hero) {
  if (!hero.stats) {
    hero.stats = {};
  }
  if (!hero.stats.kills) {
    hero.stats.kills = 0;
  }
  if (!hero.stats.bossKills) {
    hero.stats.bossKills = 0;
  }
  if (!hero.stats.deaths) {
    hero.stats.deaths = 0;
  }
  if (!hero.stats.retreats) {
    hero.stats.retreats = 0;
  }
  if (!hero.stats.mines) {
    hero.stats.mines = 0;
  }
  if (!hero.stats.forges) {
    hero.stats.forges = 0;
  }
  if (!hero.achievements) {
    hero.achievements = [];
  }
  if (!hero.necromancyBook) {
    hero.necromancyBook = { guerreiro: 0, mago: 0, guardiao: 0 };
  }
}

function checkAchievements() {
  const hero = getActiveHero();
  if (!hero) {
    return;
  }
  initHeroStats(hero);

  ACHIEVEMENTS_DB.forEach((ach) => {
    if (hero.achievements.includes(ach.id)) {
      return;
    }
    if (ach.check(hero)) {
      hero.achievements.push(ach.id);
      showAchievementPopup(ach);
      GameAudio.play("achieve");
    }
  });
  commitStorage();
}

function showAchievementPopup(ach) {
  const popup = document.createElement("div");
  popup.className = "achievement-popup";
  popup.innerHTML = `
                <div class="ap-icon">${ach.icon}</div>
                <div>
                    <div class="ap-text">🏆 ${ach.name}</div>
                    <div class="ap-sub">${ach.desc}</div>
                </div>
            `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 4500);
}

function renderAchievementsTab() {
  const hero = getActiveHero();
  if (!hero) {
    return;
  }
  initHeroStats(hero);

  const mesh = document.getElementById("achievements-mesh");
  const counter = document.getElementById("achievement-counter");
  if (!mesh) {
    return;
  }

  const unlocked = hero.achievements?.length || 0;
  if (counter) {
    counter.textContent = `Desbloqueadas: ${unlocked}/${ACHIEVEMENTS_DB.length}`;
  }

  mesh.innerHTML = "";
  ACHIEVEMENTS_DB.forEach((ach) => {
    const isUnlocked = hero.achievements?.includes(ach.id);
    const progress = Math.min(ach.max, ach.progress(hero));
    const pct = Math.min(100, (progress / ach.max) * 100);

    mesh.innerHTML += `
                    <div class="achievement-card ${isUnlocked ? "unlocked" : "locked"}">
                        <div class="achievement-icon">${ach.icon}</div>
                        <div class="achievement-name">${ach.name}</div>
                        <div class="achievement-desc">${ach.desc}</div>
                        <div class="achievement-progress"><div class="achievement-progress-fill" style="width:${pct}%;"></div></div>
                        <div style="font-size:0.75rem; color:${isUnlocked ? "#fbbf24" : "#4b5563"}; margin-top:4px;">${isUnlocked ? "✅ Desbloqueada!" : `${progress}/${ach.max}`}</div>
                    </div>
                `;
  });
}

// Patch renderAllEngines para incluir conquistas
const _origRenderAll = renderAllEngines;
// eslint-disable-next-line no-func-assign
renderAllEngines = function () {
  _origRenderAll();
  // Verificar conquistas a cada renderização
  const tabConq = document.getElementById(MV_TAB_CONQUISTAS);
  if (tabConq && !tabConq.classList.contains("hidden")) {
    renderAchievementsTab();
  }
  checkAchievements();
};

// Patch navigate para renderizar conquistas ao abrir a aba
const _origNavigate = navigate;
navigate = function (tab) {
  _origNavigate(tab);
  if (tab === MV_TAB_CONQUISTAS) {
    renderAchievementsTab();
  }
};

// Incrementar contadores de stats nos momentos certos:
// Kill tracking - sobrescrever o processamento pós-combate
const _origInitCombat = window.initCombatInstance;

// Track deaths
const _origDeath2 = window.handleHeroDeath;
window.handleHeroDeath = function () {
  const hero = getActiveHero();
  initHeroStats(hero);
  hero.stats.deaths++;
  GameAudio.play("death");
  _origDeath2();
};

// =========================================================================
//  HOTKEYS DE TECLADO — COMBATE E NAVEGAÇÃO
// =========================================================================
document.addEventListener("keydown", (e) => {
  if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) {
    return;
  }

  const key = e.key.toLowerCase();
  const dungeonTab = document.getElementById(MV_TAB_DUNGEON);
  const inCombat =
    activeCombatInstance &&
    dungeonTab &&
    !dungeonTab.classList.contains("hidden");

  if (inCombat) {
    // Evitar que o espaço role a tela para baixo durante o combate
    if (key === " ") {
      e.preventDefault();
      // A lógica da esquiva (QTE) é tratada separadamente no dodgeListener.
      return;
    }
    if (key === "1") {
      e.preventDefault();
      processCombatRound("ataque");
      return;
    }
    if (key === "2") {
      e.preventDefault();
      drinkPotionFromCombat("hp");
      return;
    }
    if (key === "3") {
      e.preventDefault();
      drinkPotionFromCombat("mp");
      return;
    }
    if (key === "4") {
      e.preventDefault();
      retreatFromFight();
      return;
    }
    const hero = getActiveHero();
    if (hero && key >= "5" && key <= "9") {
      const skillBtns = document.querySelectorAll(
        "#combat-skills-injection-deck button",
      );
      // Os primeiros 4 botões são: Ataque, HP, MP, Fuga. As habilidades começam no índice 4.
      const skillIdx = (parseInt(key) - 5) + 4;
      if (skillBtns[skillIdx]) {
        e.preventDefault();
        skillBtns[skillIdx].click();
        return;
      }
    }
  }

  const inExploration =
    dungeonTab && !dungeonTab.classList.contains("hidden") && !inCombat;
  if (inExploration) {
    if (key === "arrowleft") {
      e.preventDefault();
      chooseDungeonPath("esquerda");
      return;
    }
    if (key === "arrowup") {
      e.preventDefault();
      chooseDungeonPath("reto");
      return;
    }
    if (key === "arrowright") {
      e.preventDefault();
      chooseDungeonPath("direita");
      return;
    }
  }

  if (key === "i") {
    navigate(MV_TAB_FICHA);
    return;
  }
  if (key === "m") {
    navigate(MV_TAB_DUNGEON);
    return;
  }
  if (key === "k") {
    navigate(MV_TAB_SKILLS);
    return;
  }
  if (key === "c") {
    navigate("tab-companheiros");
    return;
  }
  if (key === "f") {
    navigate("tab-forge");
    return;
  }
  if (key === "q") {
    navigate("tab-quests");
    return;
  }

  if (key === "escape") {
    const deathOverlay = document.getElementById(MV_ID_DEATH_OVERLAY);
    if (deathOverlay && deathOverlay.classList.contains("active")) {
      closeDeath();
      return;
    }
    if (narrativeEventActive) {
      closeNarrativeEvent();
      return;
    }
    const ftModal = document.getElementById(MV_ID_FAST_TRAVEL);
    if (ftModal && ftModal.style.display !== "none") {
      closeFastTravelModal();
      return;
    }
  }
});

// =========================================================================
//  SISTEMA DE COMBO
// =========================================================================
// comboCounter e runStats (Variáveis Globais) gerenciados pelo CombatEngine.js


function updateComboUI() {
  const el = document.getElementById("combo-counter");
  const numEl = document.getElementById("combo-number");
  const multEl = document.getElementById("combo-mult");
  if (!el || !numEl || !multEl) {
    return;
  }

  if (comboCounter < 2) {
    el.classList.remove("visible");
    return;
  }

  numEl.textContent = comboCounter;
  const mult = getComboMultiplier();
  multEl.textContent = `x${mult.toFixed(1)}`;

  el.classList.add("visible");
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");

  // Fúria visual quando combo >= 12
  if (comboCounter >= 12) {
    numEl.classList.add("combo-fury");
  } else {
    numEl.classList.remove("combo-fury");
  }
}

// =========================================================================
//  SISTEMA DE VIGNETTE DE DANO
// =========================================================================
let vignetteTimeout = null;

function triggerDamageVignette(currentHp, maxHp) {
  const vig = document.getElementById("damage-vignette");
  if (!vig) {
    return;
  }

  const hpPercent = currentHp / maxHp;

  // Flash de dano
  vig.classList.remove(MV_CLASS_FLASH, MV_CLASS_CRITICAL_HP);
  void vig.offsetWidth;
  vig.classList.add(MV_CLASS_FLASH);

  // Shake no avatar do jogador
  const avatarImg = document.getElementById("player-avatar-combat-img");
  if (avatarImg) {
    avatarImg.classList.remove(MV_CLASS_AVATAR_HIT);
    void avatarImg.offsetWidth;
    avatarImg.classList.add(MV_CLASS_AVATAR_HIT);
    setTimeout(() => avatarImg.classList.remove(MV_CLASS_AVATAR_HIT), 400);
  }

  clearTimeout(vignetteTimeout);
  vignetteTimeout = setTimeout(() => {
    vig.classList.remove(MV_CLASS_FLASH);
    // Se HP < 20%, mantém a vignette pulsando
    if (hpPercent < 0.2) {
      vig.classList.add(MV_CLASS_CRITICAL_HP);
    }
  }, 400);
}

function clearDamageVignette() {
  const vig = document.getElementById("damage-vignette");
  if (vig) {
    vig.classList.remove(MV_CLASS_FLASH, MV_CLASS_CRITICAL_HP);
  }
}

// =========================================================================
//  CICLO DIA/NOITE & ACAMPAMENTO DADOS
// =========================================================================
function updateTimeUI() {
  const hero = getActiveHero();
  if (!hero) {
    return;
  }
  if (!hero.gameTime) {
    hero.gameTime = { turnos: 0, isNight: false };
  }

  const badge = document.getElementById("hud-time-badge");
  if (badge) {
    if (hero.gameTime.isNight) {
      badge.innerHTML = "🌙 Noite";
      badge.style.color = "#a78bfa";
      badge.style.borderColor = "#a78bfa";
      badge.style.background = "rgba(167,139,250,0.1)";
    } else {
      badge.innerHTML = "☀️ Dia";
      badge.style.color = "#fbbf24";
      badge.style.borderColor = "#fbbf24";
      badge.style.background = "rgba(251,191,36,0.1)";
    }
  }
}

function advanceTime(turns) {
  const hero = getActiveHero();
  if (!hero) {
    return;
  }
  if (!hero.gameTime) {
    hero.gameTime = { turnos: 0, isNight: false };
  }

  hero.gameTime.turnos += turns;
  const wasNight = hero.gameTime.isNight;
  hero.gameTime.isNight = hero.gameTime.turnos % 30 >= 15;

  if (hero.gameTime.isNight !== wasNight) {
    const panel = document.getElementById("dungeon-main-panel");
    if (hero.gameTime.isNight) {
      triggerToast("🌙 A Escuridão Caiu. Os monstros ficaram mais agressivos.");
      if (panel) {
        panel.style.background = "linear-gradient(180deg, #05051a, #0a0203)";
      }
    } else {
      triggerToast(
        "☀️ Uma fresta de Sol ilumina a masmorra. O ambiente se acalma.",
      );
      if (panel) {
        panel.style.background = "linear-gradient(180deg, #1f1a1a, #0a0203)";
      }
    }
  }
  updateTimeUI();
}

// Interceptar chamadas para avançar o tempo
const origProcessCombat = window.processCombatRound;
window.processCombatRound = function (actionType) {
  advanceTime(1);
  origProcessCombat(actionType);
};
const origExplore = window.exploreCurrentFloor;
window.exploreCurrentFloor = function () {
  advanceTime(3);
  origExplore();
};
const origMoveDungeon = window.moveDungeonFloor;
window.moveDungeonFloor = function (dir) {
  advanceTime(5);
  origMoveDungeon(dir);
};
const origInitCombat = window.initCombatInstance;
window.initCombatInstance = function (isBoss) {
  origInitCombat(isBoss);
  const hero = getActiveHero();
  if (activeCombatInstance && hero && hero.gameTime && hero.gameTime.isNight) {
    activeCombatInstance.atk = Math.floor(activeCombatInstance.atk * 1.2);
    activeCombatInstance.nightBoost = true;
    appendTerminalLog(
      `🌙 A Noite fortalece o ${activeCombatInstance.name}! (+20% ATK)`,
      "status",
    );
  }
};

// Modificar renderAllEngines para atualizar tempo
const origRenderAll = window.renderAllEngines;
window.renderAllEngines = function () {
  origRenderAll();
  updateTimeUI();
};

// Mini Game de Dados
window.playDiceGame = function () {
  const hero = getActiveHero();
  const betInput = document.getElementById("dice-bet-input");
  const resultDiv = document.getElementById("dice-game-result");
  const bet = parseInt(betInput.value);

  if (isNaN(bet) || bet <= 0) {
    resultDiv.innerHTML = `<span style="color:#ef4444;">Aposta inválida!</span>`;
    return;
  }
  if (hero.gold < bet) {
    resultDiv.innerHTML = `<span style="color:#ef4444;">Você não tem PO suficiente!</span>`;
    return;
  }

  hero.gold -= bet;
  resultDiv.innerHTML = `<span style="color:#9ca3af;">Girando os dados... 🎲</span>`;

  setTimeout(() => {
    const heroRoll = Math.floor(Math.random() /* nosonar */ * 20) + 1;
    const npcRoll = Math.floor(Math.random() /* nosonar */ * 20) + 1;
    const win = heroRoll > npcRoll;

    if (win) {
      hero.gold += bet * 2;
      resultDiv.innerHTML = `<span style="color:#10b981;">Você rolou ${heroRoll} vs ${npcRoll}. Você GANHOU ${bet * 2} PO! 🎉</span>`;
      appendTerminalLog(
        `🎲 APOSTA: Ganhou ${bet * 2} PO do Mendigo.`,
        "reward",
      );
    } else {
      resultDiv.innerHTML = `<span style="color:#ef4444;">Você rolou ${heroRoll} vs ${npcRoll}. Você PERDEU ${bet} PO! 💀</span>`;
      appendTerminalLog(
        `🎲 APOSTA: Perdeu ${bet} PO para o Mendigo.`,
        "combat",
      );
    }
    commitStorage();
    renderAllEngines();
  }, 600);
};

// ==========================================
//         MODO DEUS (GOD MODE)
// ==========================================
window.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "g") {
    e.preventDefault();
    const hero = getActiveHero();
    if (!hero) {
      return alert(
        "Você precisa estar com um personagem carregado para usar os comandos divinos.",
      );
    }

    const password = prompt("Console Divino. Insira a palavra de poder:");
    if (password !== "IgorGod") {
      if (password !== null) {
        alert("Acesso negado. Os deuses rejeitam sua oferta.");
      }
      return;
    }

    if (hero.isGodMode) {
      // DESATIVAR GOD MODE E RESTAURAR
      if (hero.godModeBackup) {
        const backup = JSON.parse(hero.godModeBackup);
        Object.assign(hero, backup);
        delete hero.godModeBackup;
        hero.isGodMode = false;

        // Remover selo visual
        const seal = document.getElementById(MV_ID_GOD_SEAL);
        if (seal) {
          seal.remove();
        }

        commitStorage();
        renderAllEngines();
        alert("Os poderes divinos se esvaem. Você volta a ser um mero mortal.");
      } else {
        alert("Erro crítico: Nenhum backup divino encontrado.");
      }
    } else {
      // ATIVAR GOD MODE E BACKUP
      const backupStr = JSON.stringify(hero);
      hero.godModeBackup = backupStr;
      hero.isGodMode = true;

      // BOOST ABSURDO
      hero.level = 999;
      hero.gold += 1000000;
      hero.skillPoints += 999;
      hero.statPoints += 999;
      hero.baseAttributes = {
        str: 5000,
        agi: 5000,
        int: 5000,
        vit: 5000,
        luk: 5000,
      };
      hero.materials = {
        essencia_menor: 999,
        essencia_maior: 999,
        essencia_epica: 999,
        lagrima_divina: 999,
        ferro: 999,
        couro: 999,
        tecido: 999,
        madeira: 999,
        runa: 999,
        gema: 999,
      };

      commitStorage();
      renderAllEngines();

      // Curar 100% dos novos stats
      const calc = computeLiveStats();
      hero.currentHp = calc.maxHp;
      hero.currentMana = calc.maxMp;
      commitStorage();
      renderAllEngines();

      checkAndRenderGodModeSeal(hero);
      alert(
        "Acesso Divino Concedido. Você transcendeu a mortalidade. Bom teste!",
      );
    }
  }
});

function checkAndRenderGodModeSeal(hero) {
  let seal = document.getElementById(MV_ID_GOD_SEAL);
  if (!hero || !hero.isGodMode) {
    if (seal) {
      seal.remove();
    }
    return;
  }
  if (!seal) {
    seal = document.createElement("div");
    seal.id = MV_ID_GOD_SEAL;
    seal.style.position = "fixed";
    seal.style.top = "10px";
    seal.style.left = "50%";
    seal.style.transform = "translateX(-50%)";
    seal.style.background = "rgba(220, 38, 38, 0.9)";
    seal.style.color = "#fff";
    seal.style.fontWeight = "bold";
    seal.style.padding = "8px 24px";
    seal.style.borderRadius = "0 0 16px 16px";
    seal.style.boxShadow = "0 0 20px rgba(220, 38, 38, 0.8)";
    seal.style.zIndex = "99999";
    seal.style.animation = "pulse 1.5s infinite alternate";
    seal.style.pointerEvents = "none";
    seal.style.textShadow = "0 0 5px #000";
    seal.innerHTML = "⚠️ GOD MODE ACTIVE ⚠️";
    document.body.appendChild(seal);

    // Add keyframes for pulsing if not exists
    if (!document.getElementById("god-pulse-style")) {
      const style = document.createElement("style");
      style.id = "god-pulse-style";
      style.innerHTML = `
                        @keyframes pulse {
                            from { opacity: 0.7; transform: translateX(-50%) scale(1); }
                            to { opacity: 1; transform: translateX(-50%) scale(1.05); }
                        }
                    `;
      document.head.appendChild(style);
    }
  }
}

// --- VITE MODULE EXPORTS ---
if (typeof window !== "undefined") window.createFreshHero = createFreshHero;
if (typeof window !== "undefined") window.getActiveHero = getActiveHero;
if (typeof window !== "undefined") window.commitStorage = commitStorage;
if (typeof window !== "undefined") window.initializeEngine = initializeEngine;
if (typeof window !== "undefined") window._calcEquipStats = _calcEquipStats;
if (typeof window !== "undefined")
  window._calcCompanionStats = _calcCompanionStats;
if (typeof window !== "undefined")
  window._calcPantheonStats = _calcPantheonStats;
if (typeof window !== "undefined") window._calcRelicStats = _calcRelicStats;
if (typeof window !== "undefined") window.computeLiveStats = computeLiveStats;
if (typeof window !== "undefined")
  window.getBestiaryCombatBonus = getBestiaryCombatBonus;
if (typeof window !== "undefined") window.applyDamageToHero = applyDamageToHero;
if (typeof window !== "undefined") window.triggerToast = triggerToast;
if (typeof window !== "undefined") window.showItemTooltip = showItemTooltip;
if (typeof window !== "undefined") window.hideItemTooltip = hideItemTooltip;
if (typeof window !== "undefined") window.positionTooltip = positionTooltip;
if (typeof window !== "undefined") window.hideAllTooltips = hideAllTooltips;
if (typeof window !== "undefined")
  window.getEffectDescription = getEffectDescription;
if (typeof window !== "undefined") window.showSkillTooltip = showSkillTooltip;
if (typeof window !== "undefined") window.hideSkillTooltip = hideSkillTooltip;
if (typeof window !== "undefined") window.showStatusTooltip = showStatusTooltip;
if (typeof window !== "undefined") window.hideStatusTooltip = hideStatusTooltip;
if (typeof window !== "undefined")
  window.showCompanionTooltip = showCompanionTooltip;
if (typeof window !== "undefined")
  window.hideCompanionTooltip = hideCompanionTooltip;
if (typeof window !== "undefined")
  window.showMaterialTooltip = showMaterialTooltip;
if (typeof window !== "undefined")
  window.hideMaterialTooltip = hideMaterialTooltip;
if (typeof window !== "undefined") window.showButtonTooltip = showButtonTooltip;
if (typeof window !== "undefined") window.hideButtonTooltip = hideButtonTooltip;
if (typeof window !== "undefined")
  window.triggerScreenShake = triggerScreenShake;
if (typeof window !== "undefined")
  window.generateFloatingText = generateFloatingText;
if (typeof window !== "undefined") window.appendTerminalLog = appendTerminalLog;
if (typeof window !== "undefined") window._doNavigate = _doNavigate;
if (typeof window !== "undefined") window.renderAllEngines = renderAllEngines;
if (typeof window !== "undefined") window.renderSavesTab = renderSavesTab;
if (typeof window !== "undefined") window.openCreationPanel = openCreationPanel;
if (typeof window !== "undefined")
  window.confirmCharacterCreation = confirmCharacterCreation;
if (typeof window !== "undefined")
  window._buildPassivesHtml = _buildPassivesHtml;
if (typeof window !== "undefined")
  window._buildAttributesHtml = _buildAttributesHtml;
if (typeof window !== "undefined")
  window._buildPaperdollHtml = _buildPaperdollHtml;
if (typeof window !== "undefined")
  window._buildInventoryDeckHtml = _buildInventoryDeckHtml;
if (typeof window !== "undefined") window.renderFichaTab = renderFichaTab;
if (typeof window !== "undefined")
  window.openLoreWithFragment = openLoreWithFragment;
if (typeof window !== "undefined")
  window.equipItemToSpecificSlot = equipItemToSpecificSlot;
if (typeof window !== "undefined")
  window.equipItemFromInventory = equipItemFromInventory;
if (typeof window !== "undefined") window.unequipItem = unequipItem;
if (typeof window !== "undefined")
  window.triggerInventorySort = triggerInventorySort;
if (typeof window !== "undefined") window.renderGrimorioTab = renderGrimorioTab;
if (typeof window !== "undefined")
  window.updateFusionDropdowns = updateFusionDropdowns;
if (typeof window !== "undefined") window.upgradeSkillRank = upgradeSkillRank;
if (typeof window !== "undefined")
  window.renderCompanionsTab = renderCompanionsTab;
if (typeof window !== "undefined") window.interactCompanion = interactCompanion;
if (typeof window !== "undefined") window.toggleCompanion = toggleCompanion;
if (typeof window !== "undefined") window.renderMinaTab = renderMinaTab;
if (typeof window !== "undefined") window.executeMining = executeMining;
if (typeof window !== "undefined")
  window.performConditioning = performConditioning;
if (typeof window !== "undefined") window.restCharacterFull = restCharacterFull;
if (typeof window !== "undefined") window.buyShopItem = buyShopItem;
if (typeof window !== "undefined") window.sellTrashLoot = sellTrashLoot;
if (typeof window !== "undefined")
  window.executeBlacksmithForge = executeBlacksmithForge;
if (typeof window !== "undefined")
  window.executeAdvancedForge = executeAdvancedForge;
if (typeof window !== "undefined")
  window.renderUpgradeInventory = renderUpgradeInventory;
if (typeof window !== "undefined")
  window.performItemUpgrade = performItemUpgrade;
if (typeof window !== "undefined") window.transmuteItems = transmuteItems;
if (typeof window !== "undefined")
  window.renderEnchantInventory = renderEnchantInventory;
if (typeof window !== "undefined")
  window.performEnchantment = performEnchantment;
if (typeof window !== "undefined") window.addSocketsToItem = addSocketsToItem;
if (typeof window !== "undefined")
  window.renderSocketInventory = renderSocketInventory;
if (typeof window !== "undefined") window.craftRune = craftRune;
if (typeof window !== "undefined")
  window.performRuneInsertion = performRuneInsertion;
if (typeof window !== "undefined") window.renderRepairMesh = renderRepairMesh;
if (typeof window !== "undefined") window.repairItem = repairItem;
if (typeof window !== "undefined") window.repairAllItems = repairAllItems;
if (typeof window !== "undefined")
  window.generateProceduralQuest = generateProceduralQuest;
if (typeof window !== "undefined") window.renderQuestsBoard = renderQuestsBoard;
if (typeof window !== "undefined") window.turnInQuest = turnInQuest;
if (typeof window !== "undefined")
  window.initCombatInstance = initCombatInstance;
if (typeof window !== "undefined") window.renderDungeonTab = renderDungeonTab;
if (typeof window !== "undefined") window.moveDungeonFloor = moveDungeonFloor;
if (typeof window !== "undefined")
  window.exploreCurrentFloor = exploreCurrentFloor;
if (typeof window !== "undefined") window.getCurrentBiome = getCurrentBiome;
if (typeof window !== "undefined")
  window.getBestiaryKillCount = getBestiaryKillCount;
if (typeof window !== "undefined")
  window._initBestiaryMonsters = _initBestiaryMonsters;
if (typeof window !== "undefined")
  window._buildBestiaryHtml = _buildBestiaryHtml;
if (typeof window !== "undefined")
  window.processStatusArray = processStatusArray;
if (typeof window !== "undefined")
  window.applyStatusToEnemy = applyStatusToEnemy;
if (typeof window !== "undefined")
  window.checkBossPhaseTransition = checkBossPhaseTransition;
if (typeof window !== "undefined")
  window._applySkillEffects = _applySkillEffects;
if (typeof window !== "undefined") window._calcHeroFinalDmg = _calcHeroFinalDmg;
if (typeof window !== "undefined")
  window.internalHeroActionExecution = internalHeroActionExecution;
if (typeof window !== "undefined") window.addExperience = addExperience;
if (typeof window !== "undefined")
  window.checkAndRenderGodModeSeal = checkAndRenderGodModeSeal;
if (typeof window !== "undefined")
  window._generateLoreFragments = _generateLoreFragments;
if (typeof window !== "undefined")
  window._generateBossRelics = _generateBossRelics;
if (typeof window !== "undefined") window.finalizeCombatWin = finalizeCombatWin;
if (typeof window !== "undefined")
  window.generateGlobalMarket = generateGlobalMarket;
if (typeof window !== "undefined")
  window.renderGlobalMarket = renderGlobalMarket;
if (typeof window !== "undefined")
  window.renderForgeAndMarket = renderForgeAndMarket;
if (typeof window !== "undefined")
  window.triggerNarrativeEvent = triggerNarrativeEvent;
if (typeof window !== "undefined")
  window.resolveNarrativeEvent = resolveNarrativeEvent;
if (typeof window !== "undefined") window.initHeroStats = initHeroStats;
if (typeof window !== "undefined") window.checkAchievements = checkAchievements;
if (typeof window !== "undefined")
  window.showAchievementPopup = showAchievementPopup;
if (typeof window !== "undefined")
  window.renderAchievementsTab = renderAchievementsTab;
if (typeof window !== "undefined")
  window.getComboMultiplier = getComboMultiplier;
if (typeof window !== "undefined") window.updateComboUI = updateComboUI;
if (typeof window !== "undefined")
  window.triggerDamageVignette = triggerDamageVignette;
if (typeof window !== "undefined")
  window.clearDamageVignette = clearDamageVignette;
if (typeof window !== "undefined") window.updateTimeUI = updateTimeUI;
if (typeof window !== "undefined") window.advanceTime = advanceTime;
if (typeof window !== "undefined")
  window.checkAndRenderGodModeSeal = checkAndRenderGodModeSeal;

window.emergencyRest = function () {
  const hero = getActiveHero();
  if (!hero) return;
  const calc = computeLiveStats();

  hero.currentHp = calc.maxHp;
  hero.currentMana = calc.maxMp;
  hero.stamina = calc.maxStamina;

  if (hero.dungeonLevel > 1) {
    hero.dungeonLevel--;
  }
  hero.floorProgress = 0;
  hero.floorExploration = 0;
  hero.floorCleared = false;
  hero.isFightingGuardian = false;
  activeCombatInstance = null;

  commitStorage();
  renderAllEngines();
  triggerToast(
    "Você descansou. HP, Mana e Estamina restaurados. Você recuou um andar.",
  );
};

// ================= TOGGLE SIDEBAR =================
window.toggleSidebar = function() {
  const sidebar = document.getElementById('game-navigation');
  if (sidebar) {
    sidebar.classList.toggle('collapsed');
  }
};

// =========================================================================
//  LIVRO DOS MORTOS (NECROMANTE)
// =========================================================================

window.openNecromancyBook = function() {
  const modal = document.getElementById("necromancy-book-modal");
  if (modal) {
    modal.style.display = "flex";
    renderNecromancyBook();
  }
};

window.renderNecromancyBook = function() {
  const hero = getActiveHero();
  if (!hero || hero.class !== "Necromante") return;
  if (!hero.necromancyBook) hero.necromancyBook = { guerreiro: 0, mago: 0, guardiao: 0 };
  
  const content = document.getElementById("necromancy-book-content");
  if (!content) return;

  const book = hero.necromancyBook;

  const buildSection = (type, title, icon, options) => {
    let html = `<div style="background: rgba(0,0,0,0.5); border: 1px solid #333; padding: 15px; border-radius: 8px;">`;
    html += `<h3 style="color: #e9d5ff; border-bottom: 1px solid #c084fc; padding-bottom: 5px; margin-bottom: 10px;">${icon} ${title}</h3>`;
    html += `<div style="display: flex; flex-direction: column; gap: 10px;">`;
    
    options.forEach((opt, idx) => {
       const isSelected = book[type] === idx;
       const btnColor = isSelected ? "#c084fc" : "#444";
       const textColor = isSelected ? "#fff" : "#aaa";
       html += `
         <div style="display: flex; gap: 15px; justify-content: space-between; align-items: center; border: 1px solid ${btnColor}; padding: 12px; border-radius: 4px; background: ${isSelected ? 'rgba(192, 132, 252, 0.1)' : 'transparent'};">
           <div style="color: ${textColor}; flex: 1; padding-right: 10px;">
              <strong style="display: block; margin-bottom: 4px;">${opt.name}</strong>
              <span style="font-size: 0.85rem; line-height: 1.4; display: block;">${opt.desc}</span>
           </div>
           <button class="btn" style="min-width: 120px; border-color: ${btnColor}; color: ${isSelected ? '#c084fc' : '#aaa'};" onclick="setNecromancySpecialization('${type}', ${idx})">
             ${isSelected ? "Ativo" : "Selecionar"}
           </button>
         </div>
       `;
    });
    
    html += `</div></div>`;
    return html;
  };

  const guerreiroOpts = [
    { name: "Legião Esqueleto (Padrão)", desc: "50 HP | Dano Físico Moderado" },
    { name: "Ofensiva (Especialização)", desc: "30 HP | Dano aumentado em 50%" },
    { name: "Sacrifício Solitário", desc: "Não invoca Guerreiros. +15 de Dano Bruto permanentemente." }
  ];

  const magoOpts = [
    { name: "Mestres do Arcano (Padrão)", desc: "25 HP | Dano Mágico Alto" },
    { name: "Sifão Vital (Especialização)", desc: "Dano reduzido, mas parte do dano cura o Necromante." },
    { name: "Sacrifício Solitário", desc: "Não invoca Magos. +30 de Mana Máxima permanentemente." }
  ];

  const guardiaoOpts = [
    { name: "Muralha de Ossos (Padrão)", desc: "100 HP | Dano Baixo" },
    { name: "Colosso (Especialização)", desc: "150 HP | Dano Baixo" },
    { name: "Sacrifício Solitário", desc: "Não invoca Guardiões. +20 de Defesa permanentemente." }
  ];

  content.innerHTML = 
    buildSection("guerreiro", "Guerreiros Esqueletos", "⚔️", guerreiroOpts) +
    buildSection("mago", "Magos Esqueletos", "🔮", magoOpts) +
    buildSection("guardiao", "Guardiões de Ossos", "🛡️", guardiaoOpts);
};

window.setNecromancySpecialization = function(type, idx) {
  const hero = getActiveHero();
  if (!hero || hero.class !== "Necromante") return;
  if (!hero.necromancyBook) hero.necromancyBook = { guerreiro: 0, mago: 0, guardiao: 0 };
  
  hero.necromancyBook[type] = idx;
  commitStorage();
  
  window.renderNecromancyBook();
  
  const calc = computeLiveStats();
  renderFichaTab(calc);
  
  triggerToast("Grimório atualizado!");
};

// =========================================================================
//  LIVRO DOS MORTOS (NECROMANTE)
// =========================================================================

window.openNecromancyBook = function() {
  const modal = document.getElementById("necromancy-book-modal");
  if (modal) {
    modal.style.display = "flex";
    renderNecromancyBook();
  }
};

window.renderNecromancyBook = function() {
  const hero = getActiveHero();
  if (!hero || hero.class !== "Necromante") return;
  if (!hero.necromancyBook) hero.necromancyBook = { guerreiro: 0, mago: 0, guardiao: 0 };
  
  const content = document.getElementById("necromancy-book-content");
  if (!content) return;

  const book = hero.necromancyBook;

  const buildSection = (type, title, icon, options) => {
    let html = `<div style="background: rgba(0,0,0,0.5); border: 1px solid #333; padding: 15px; border-radius: 8px;">`;
    html += `<h3 style="color: #e9d5ff; border-bottom: 1px solid #c084fc; padding-bottom: 5px; margin-bottom: 10px;">${icon} ${title}</h3>`;
    html += `<div style="display: flex; flex-direction: column; gap: 10px;">`;
    
    options.forEach((opt, idx) => {
       const isSelected = book[type] === idx;
       const btnColor = isSelected ? "#c084fc" : "#444";
       const textColor = isSelected ? "#fff" : "#aaa";
       html += `
         <div style="display: flex; gap: 15px; justify-content: space-between; align-items: center; border: 1px solid ${btnColor}; padding: 12px; border-radius: 4px; background: ${isSelected ? 'rgba(192, 132, 252, 0.1)' : 'transparent'};">
           <div style="color: ${textColor}; flex: 1; padding-right: 10px;">
              <strong style="display: block; margin-bottom: 4px;">${opt.name}</strong>
              <span style="font-size: 0.85rem; line-height: 1.4; display: block;">${opt.desc}</span>
           </div>
           <button class="btn" style="min-width: 120px; border-color: ${btnColor}; color: ${isSelected ? '#c084fc' : '#aaa'};" onclick="setNecromancySpecialization('${type}', ${idx})">
             ${isSelected ? "Ativo" : "Selecionar"}
           </button>
         </div>
       `;
    });
    
    html += `</div></div>`;
    return html;
  };

  const guerreiroOpts = [
    { name: "Legião Esqueleto (Padrão)", desc: "50 HP | Dano Físico Moderado" },
    { name: "Ofensiva (Especialização)", desc: "30 HP | Dano aumentado em 50%" },
    { name: "Sacrifício Solitário", desc: "Não invoca Guerreiros. +15 de Dano Bruto permanentemente." }
  ];

  const magoOpts = [
    { name: "Mestres do Arcano (Padrão)", desc: "25 HP | Dano Mágico Alto" },
    { name: "Sifão Vital (Especialização)", desc: "Dano reduzido, mas parte do dano cura o Necromante." },
    { name: "Sacrifício Solitário", desc: "Não invoca Magos. +30 de Mana Máxima permanentemente." }
  ];

  const guardiaoOpts = [
    { name: "Muralha de Ossos (Padrão)", desc: "100 HP | Dano Baixo" },
    { name: "Colosso (Especialização)", desc: "150 HP | Dano Baixo" },
    { name: "Sacrifício Solitário", desc: "Não invoca Guardiões. +20 de Defesa permanentemente." }
  ];

  content.innerHTML = 
    buildSection("guerreiro", "Guerreiros Esqueletos", "⚔️", guerreiroOpts) +
    buildSection("mago", "Magos Esqueletos", "🔮", magoOpts) +
    buildSection("guardiao", "Guardiões de Ossos", "🛡️", guardiaoOpts);
};

window.setNecromancySpecialization = function(type, idx) {
  const hero = getActiveHero();
  if (!hero || hero.class !== "Necromante") return;
  if (!hero.necromancyBook) hero.necromancyBook = { guerreiro: 0, mago: 0, guardiao: 0 };
  
  hero.necromancyBook[type] = idx;
  commitStorage();
  
  window.renderNecromancyBook();
  
  const calc = computeLiveStats();
  renderFichaTab(calc);
  
  triggerToast("Grimório atualizado!");
};