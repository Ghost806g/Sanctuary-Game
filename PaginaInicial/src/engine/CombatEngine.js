// ==========================================
// COMBAT ENGINE EXTRACTED FROM MAIN_V3
// ==========================================

function initCombatInstance(isBoss, forceElite = false) {
  const h = getActiveHero();
  heroCombatState = { statuses: [], defBuff: 0, atkBuff: 0, dodge: 0, activeMinions: [] };
  // Reset combo e stats da run
  comboCounter = 0;
  updateComboUI();
  // runStats não deve ser resetado por combate, apenas ao iniciar uma nova run.

  const biome = getCurrentBiome(); // Conecta com o sistema de Biomas!
  const lvl = h.dungeonLevel;
  
  // Limpa o cache visual de Bosses antigos (ex: Phase 2)
  const nameDisplay = document.getElementById(MV_ID_ENEMY_NAME);
  if (nameDisplay) nameDisplay.classList.remove("boss-phase-2-text");
  const enemyBoard = document.getElementById(MV_ID_ENEMY_CARD);
  if (enemyBoard) enemyBoard.classList.remove("boss-phase-2-active");

  if (isBoss) {
    // Clona o boss do bioma para a memória
    activeCombatInstance = structuredClone(biome.boss);
    activeCombatInstance.name = `☠️ ${activeCombatInstance.name}`;
    activeCombatInstance.baseName = activeCombatInstance.name; // Para o Bestiário

    // Escalonamento extra pelo andar (Curva Híbrida AAA)
    const scale = 1 + lvl * 0.1 + (Math.pow(1.04, lvl) - 1);
    activeCombatInstance.hp = Math.floor(activeCombatInstance.hp * scale);
    activeCombatInstance.maxHp = activeCombatInstance.hp;
    activeCombatInstance.atk = Math.floor(activeCombatInstance.atk * scale);
    
    // NOVO: Escalonamento de Defesa, XP e Ouro do Chefe
    activeCombatInstance.def = Math.floor((activeCombatInstance.def || 10) * scale);
    activeCombatInstance.xpDrop = Math.floor((activeCombatInstance.xpDrop || 50) * scale);
    activeCombatInstance.goldDrop = Math.floor((activeCombatInstance.goldDrop || 20) * scale);

    activeCombatInstance.statuses = [];

    document.getElementById(MV_ID_ENEMY_CARD).classList.add("boss-mode");
    appendTerminalLog(
      `⚠️ EFEITO DE ÁREA ATIVO: [${biome.fieldEffect.name}] - ${biome.fieldEffect.desc}`,
      "status",
    );
    appendTerminalLog(
      `🚨 O CHEFE DO BIOMA DESPERTOU: ${activeCombatInstance.name} bloqueia a saída das ${biome.name}!`,
      "combat",
    );
  } else {
    // Sorteia um monstro comum do bioma
    const randomIndex = Math.floor(
      Math.random() /* nosonar */ * biome.monsters.length,
    );
    const baseMonster = biome.monsters[randomIndex];

    activeCombatInstance = structuredClone(baseMonster);
    activeCombatInstance.baseName = activeCombatInstance.name; // Para o Bestiário

    // Escalonamento para o monstro não ficar fraco no final do bioma (Curva Híbrida)
    let scale = 1 + (lvl - 1) * 0.08 + (Math.pow(1.035, lvl - 1) - 1);

    if (hero.hardmode) {
      scale *= 3.0; // MODO SOULSLIKE: 300% mais forte
    }

    activeCombatInstance.hp = Math.floor(activeCombatInstance.hp * scale);
    activeCombatInstance.maxHp = activeCombatInstance.hp;
    activeCombatInstance.atk = Math.floor(activeCombatInstance.atk * scale);
    
    // NOVO: Escalonamento de Defesa, XP e Ouro
    activeCombatInstance.def = Math.floor((activeCombatInstance.def || 5) * scale);
    activeCombatInstance.xpDrop = Math.floor((activeCombatInstance.xpDrop || 10) * scale);
    activeCombatInstance.goldDrop = Math.floor((activeCombatInstance.goldDrop || 5) * scale);

    activeCombatInstance.statuses = [];

    // ================= NOVO: SISTEMA DE SUFIXOS DE ELITE =================
    activeCombatInstance.affixes = [];
    if (forceElite || (lvl >= 5 && Math.random() /* nosonar */ < 0.25)) {
      const possibleAffixes = [
        { id: "vampiric", name: "Vampírico" },
        { id: "armored", name: "Blindado" },
        { id: "agile", name: "Ágil" },
      ];
      const affix =
        possibleAffixes[
          Math.floor(Math.random() /* nosonar */ * possibleAffixes.length)
        ];
      activeCombatInstance.affixes.push(affix.id);
      activeCombatInstance.name = `${activeCombatInstance.name} [${affix.name}]`;
      activeCombatInstance.isElite = true; // Agora ele é reconhecido pelo Cérebro 2.0 como Elite!
      activeCombatInstance.hp = Math.floor(activeCombatInstance.hp * 1.3); // +30% HP
      activeCombatInstance.atk = Math.floor(activeCombatInstance.atk * 1.2); // +20% Dano

      // Cria um moveset dinâmico para esse Elite gerado proceduralmente
      window.MONSTER_MOVESETS = window.MONSTER_MOVESETS || {};
      if (affix.id === "vampiric") {
         window.MONSTER_MOVESETS[activeCombatInstance.name] = [{ id: "vampiric_bite", name: "Mordida Vampírica", weight: 40, dmgMultiplier: 1.3, type: "heavy_attack", effect: "vampiric", cooldown: 2, log: `O ${activeCombatInstance.name} drena sua força vital para se curar!` }];
      } else if (affix.id === "armored") {
         window.MONSTER_MOVESETS[activeCombatInstance.name] = [{ id: "iron_defense", name: "Defesa de Ferro", weight: 30, dmgMultiplier: 0, type: "defend", cooldown: 3, effect: "stun", log: `O ${activeCombatInstance.name} se fecha numa guarda intransponível que repele seu ataque!` }];
      } else if (affix.id === "agile") {
         window.MONSTER_MOVESETS[activeCombatInstance.name] = [{ id: "lightning_strike", name: "Golpe Relâmpago", weight: 40, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 2, log: `O ${activeCombatInstance.name} desaparece e ressurge cortando o ar num instante!` }];
      }
      activeCombatInstance.baseName = activeCombatInstance.name; // Faz o router achar a skill
    }
    // ==================================================================

    document.getElementById(MV_ID_ENEMY_CARD).classList.remove("boss-mode");
    appendTerminalLog(`🍃 Você explora as ${biome.name}...`, "system");
    appendTerminalLog(
      `⚠️ EFEITO DO MAPA: [${biome.fieldEffect.name}]`,
      "status",
    );
    if (activeCombatInstance.affixes.length > 0) {
      appendTerminalLog(
        `⚔️ 💀 ELITE ENCONTRADO: ${activeCombatInstance.name} espreitava nas sombras!`,
        "combat",
      );
    } else {
      appendTerminalLog(
        `⚔️ Um ${activeCombatInstance.name} selvagem ataca!`,
        "combat",
      );
    }
  }

  // ================= NOVO: SISTEMA DE IA DE MONSTROS ====================
  if (!activeCombatInstance.aiType) {
    // Se o inimigo não tiver uma IA predefinida no database, sorteia uma.
    const aiTypes = ["aggressive", "defensive", "caster", "balanced"];
    activeCombatInstance.aiType = aiTypes[Math.floor(Math.random() * aiTypes.length)];
  }

  // ================= NOVO: SISTEMA DE POSTURA (STAGGER) =================
  let postureMultiplier = isBoss ? 0.8 : 0.4;
  if (
    activeCombatInstance.affixes &&
    activeCombatInstance.affixes.includes("armored")
  ) {
    postureMultiplier += 0.3;
  }
  if (
    activeCombatInstance.affixes &&
    activeCombatInstance.affixes.includes("agile")
  ) {
    postureMultiplier -= 0.2;
  }

  activeCombatInstance.maxPosture = Math.floor(
    activeCombatInstance.maxHp * postureMultiplier,
  );
  activeCombatInstance.maxPosture = Math.max(
    10,
    activeCombatInstance.maxPosture,
  ); // Mínimo 10
  activeCombatInstance.posture = activeCombatInstance.maxPosture;
  // =====================================================================

  // INJEÇÃO VISUAL (Juice): Muda as cores da placa de combate para combinar com o bioma!
  const card = document.getElementById(MV_ID_ENEMY_CARD);
  card.style.background = `linear-gradient(180deg, ${biome.color}33 0%, #050102 100%)`;
  card.style.borderColor = biome.color;
  document.getElementById(MV_ID_ENEMY_NAME).style.color = biome.color;

  // INJEÇÃO DA IMAGEM DO MONSTRO
  const enemyImg = document.getElementById(MV_ID_ENEMY_IMG);
  if (enemyImg) {
    const BESTIARY = {
      // === BIOMA 1: Catacumbas Sombrias ===
      "Rato Mutante": "rato_mutante",
      "Rato Tumular": "rato_tumular",
      "Esqueleto de Guarda": "esqueleto_guarda",
      "Esqueleto Mago": "esqueleto_mago",
      Zumbi: "zumbi_putrefo",
      "Roda de Esqueletos": "roda_esqueletos",
      "Morcego Vampiro": "morcego_vampiro",
      "Carrasco Zumbi": "carrasco_zumbi",
      "Aranha das Criptas": "aranha_criptas",
      "Lodo Carnívoro": "lodo_carnivoro",
      Dulahn: "dulahn_algoz",
      Algoz: "dulahn_algoz",
      "Cavaleiro do Crisol": "cavaleiro_crisol",
      Crisol: "cavaleiro_crisol",
      "Morte Menor": "morte_menor",
      "Paladino Corrompido": "paladino_corrompido",
      "Amálgama de Ossos": "amalgama_ossos",
      Amálgama: "amalgama_ossos",
      Necromante: "lorde_necromante_do_abismo",
      "Lich Desperto": "lich_desperto_do_abismo",
      // === BIOMA 2: Pântano de Peste ===
      "Sapo Demoníaco": "sapo_demoniaco",
      Sapo: "sapo_demoniaco",
      "Cultista do Lodo": "cultista_do_lodo",
      Cultista: "cultista_do_lodo",
      "Lodo Ácido": "lodo_acido",
      "Corvo da Podridão": "corvo_da_podridao",
      Corvo: "corvo_da_podridao",
      "Sanguessuga Gigante": "sanguessuga_gigante",
      Sanguessuga: "sanguessuga_gigante",
      "Verme da Lama": "verme_da_lama",
      Verme: "verme_da_lama",
      "Bruxa Menor": "bruxa_menor",
      "Cão Infectado": "cao_infectado",
      "Troll de Podridão": "troll_de_podridao",
      Troll: "troll_de_podridao",
      "Árvore Podre": "arvore_podre_andante",
      Vex: "vex_bruxa",
      "Bruxa do Pântano": "vex_bruxa",
      "Macaco Guardião": "macaco_guardiao",
      Omen: "o_omen_caido",
      Hidra: "hidra_corrompida",
      // === BIOMA 3: Forja Profana dos Abismos ===
      "Diabrete Ferreiro": "diabrete_ferreiro",
      "Golem de Magma": "golem_de_magma",
      "Súcubo Torturadora": "sucubo_torturadora",
      "Mineiro Enlouquecido": "mineiro_enlouquecido",
      "Demônio de Fornalha": "demonio_fornalha_menor",
      "Verme de Magma": "verme_de_magma",
      "Morcego de Fogo": "morcego_de_fogo",
      "Escravo de Cinzas": "escravo_de_cinzas",
      "Lagarto Escamoso": "lagarto_escamoso",
      "Elemental do Fogo": "elemental_do_fogo",
      Ignis: "ignis_arauto_chamas",
      Zodd: "zodd_imortal",
      "Perseguidor Flutuante": "perseguidor_flutuante",
      "Dragão de Magma": "dragao_magma_terrestre",
      "Demônio Capra": "demonio_capra",
      "Senhor da Forja": "senhor_da_forja",
      "Abominação de Carne": "abominacao_carne_derretida",
      // === BOSSES ===
      Açougueiro: "o_acougueiro_carniceiro_abissal",
      Forja: "o_acougueiro_carniceiro_abissal",
      Cristal: "rei_de_cristal_estilhacado",
      Artorias: "artorias_o_corrompido",
      Belial: "belial_avatar_mentiroso",
      Diablo: "diablo_o_absoluto_mal_supremo",
      Priscilla: "priscilla_a_desperta",
      Eclipse: "senhor_do_eclipse_eterno",
      "Rei Esqueleto": "rei_esqueleto_ancestral_senhor_dos_ossos",
    };

    let imgPath = null;
    const cleanName = (activeCombatInstance.name || "")
      .replace(/^☠️\s*/, "")
      .replace(/^Guardião Escarlate:\s*/i, "")
      .replace(/\[.*?\]/g, "")
      .trim()
      .toLowerCase();

    for (const [key, val] of Object.entries(BESTIARY)) {
      if (cleanName.includes(key.toLowerCase())) {
        imgPath = `bestiary/${val}.webp`;
        break;
      }
    }

    if (imgPath) {
      enemyImg.src = imgPath;
      enemyImg.style.display = "block";
    } else {
      enemyImg.style.display = "none";
    }
  }

  card.classList.remove("hidden");
  

  // --- TRIGGERS EPIC PASSIVES (onStartCombat) ---
  const calc = computeLiveStats();
  processEpicPassives("onStartCombat", h, calc, activeCombatInstance, {});

  if (typeof startCombatTicker === 'function') startCombatTicker();
}

window.startCombatTicker = function () {
  isCombatPaused = false;
  if (combatTickerInterval) clearInterval(combatTickerInterval);
  
  const timeline = document.getElementById("combat-atb-timeline");
  if (timeline) timeline.classList.remove("hidden");

  heroCombatState.atb = 0;
  heroCombatState.statuses = heroCombatState.statuses || [];
  if (activeCombatInstance) activeCombatInstance.atb = 0;

  combatTickerInterval = setInterval(() => {
    if (!activeCombatInstance || isCombatPaused) return;
    
    const hero = getActiveHero();
    const heroSpeed = hero.attributes.agilidade || 10;
    const enemySpeed = activeCombatInstance.lvl ? 10 + activeCombatInstance.lvl : 12;

    // MODO WAIT (Ativo): Se for o turno do jogador, o ATB do monstro congela
    if ((heroCombatState.atb || 0) < 100) {
      heroCombatState.atb = Math.min(100, (heroCombatState.atb || 0) + heroSpeed * 0.30);
      activeCombatInstance.atb = Math.min(100, (activeCombatInstance.atb || 0) + enemySpeed * 0.30);
    }

    const markerHero = document.getElementById("atb-marker-hero");
    const markerEnemy = document.getElementById("atb-marker-enemy");
    if (markerHero) markerHero.style.left = `${heroCombatState.atb}%`;
    if (markerEnemy) markerEnemy.style.left = `${activeCombatInstance.atb}%`;

    if (activeCombatInstance.atb >= 100) {
       isCombatPaused = true;
       
       const enemyStatRet = processStatusArray(activeCombatInstance.statuses, activeCombatInstance.name);
       if (enemyStatRet.dmg > 0) {
         activeCombatInstance.hp -= enemyStatRet.dmg;
         activeCombatInstance.currentHp = activeCombatInstance.hp;
         generateFloatingText(enemyStatRet.dmg, "damage", "enemy");
         const enemyImg = document.getElementById(MV_ID_ENEMY_IMG);
         if (enemyImg) {
           enemyImg.classList.remove(MV_CLASS_AVATAR_HIT);
           void enemyImg.offsetWidth;
           enemyImg.classList.add(MV_CLASS_AVATAR_HIT);
           setTimeout(() => { const img = document.getElementById(MV_ID_ENEMY_IMG); if (img) img.classList.remove(MV_CLASS_AVATAR_HIT); }, 400);
         }
         checkBossPhaseTransition(activeCombatInstance);
         if (activeCombatInstance.hp <= 0) {
           return finalizeCombatWin();
         }
       }
       
       if (activeCombatInstance.staggerBroken) {
         const hasStun = activeCombatInstance.statuses.some((st) => st.type === "stun");
         if (!hasStun) {
           activeCombatInstance.posture = activeCombatInstance.maxPosture;
           activeCombatInstance.staggerBroken = false;
           appendTerminalLog("🔄 O monstro recuperou o fôlego e retomou sua postura defensiva!", "combat");
         }
       }

       if (enemyStatRet.skip || activeCombatInstance.staggerBroken) {
         activeCombatInstance.atb = 0;
         isCombatPaused = false;
       } else {
         startEnemyTurnTelegraph();
       }
    } else if (heroCombatState.atb >= 100 && !heroCombatState.turnReady) {
       heroCombatState.turnReady = true;
       
       if (heroCombatState.statuses && heroCombatState.statuses.length > 0) {
         const heroStatRet = processHeroStatusArray(heroCombatState.statuses);
         
         if (heroStatRet.dmg > 0) {
           hero.currentHp -= heroStatRet.dmg;
           generateFloatingText(heroStatRet.dmg, "damage", "hero");
           triggerDamageVignette(hero.currentHp, getActiveHero().maxHp || 100);
           if (hero.currentHp <= 0) {
             handleHeroDeath();
           }
         }
         
         if (heroStatRet.skip) {
           heroCombatState.atb = 0;
           heroCombatState.turnReady = false;
         }
       }
    }
  }, 50);
};

window.resumeCombatTicker = function () {
  isCombatPaused = false;
};

window.processCombatRound = function () {
  if (!activeCombatInstance || isActionOnCooldown || (heroCombatState.atb || 0) < 100) {
    return;
  }
  heroCombatState.turnReady = false;
  isActionOnCooldown = true;
  setTimeout(() => {
    isActionOnCooldown = false;
  }, 750);

  internalHeroActionExecution(null);
};

window.castCombatSkill = function (skillId) {
  if (!activeCombatInstance || isActionOnCooldown || (heroCombatState.atb || 0) < 100) {
    return;
  }
  heroCombatState.turnReady = false;
  
  const hero = getActiveHero();
  const sk = MASTER_SKILLS_DATA[hero.class].find((x) => x.id === skillId);
  if (!sk) {
    return;
  }

  // Novo: Validação de Traços de Herói (Raça, Classe, Profissão)
  if (typeof HeroTraits !== "undefined") {
    const castValidation = HeroTraits.canCast(hero, sk);
    if (!castValidation.allowed) {
      return triggerToast(`⚠️ Bloqueio de Traço: ${castValidation.msg}`, "error");
    }
  }

  if (sk.costType === "focus" || sk.costType === "ultimate") {
    // Ultima / Suprema (usa toda a energia secundária da classe)
    if (["Bárbaro", "Barbaro"].includes(hero.class) && (hero.adrenalina || 0) < 100) return triggerToast("Você precisa de 100 de Sangue/Adrenalina!");
    if (hero.class === "Guerreiro" && (hero.furia || 0) < 100) return triggerToast("Você precisa de 100 de Fúria Máxima!");
    if (hero.class === "Paladino" && (hero.fe || 0) < 100) return triggerToast("Você precisa de 100 de Fé Intocável!");
    if (hero.class === "Ranger" && (hero.foco === undefined ? 100 : hero.foco) < 100) return triggerToast("Foco Máximo exigido para disparo fatal!");
    if (["Necromante", "Arcanista"].includes(hero.class) && (hero.almas || 0) < 100) return triggerToast("Você precisa de 100 Almas Devoradas!");
    
    hero.furia = 0; hero.adrenalina = 0; hero.fe = 0; hero.foco = 0; hero.almas = 0;
  } else {
    // Custos comuns
    if (["Bárbaro", "Barbaro"].includes(hero.class)) {
      if (hero.currentHp <= sk.cost) {
        return triggerToast("Vida insuficiente para o sacrifício de sangue!");
      }
      hero.currentHp -= sk.cost;
      hero.adrenalina = Math.min(100, (hero.adrenalina || 0) + 15);
    } else if (hero.class === "Guerreiro") {
      if ((hero.furia || 0) < sk.cost) {
        return triggerToast(`Você precisa de ${sk.cost} de Fúria!`);
      }
      hero.furia -= sk.cost;
    } else if (hero.class === "Ranger") {
      let f = hero.foco === undefined ? 100 : hero.foco;
      if (f < sk.cost) {
        return triggerToast(`Foco insuficiente! Faltam ${sk.cost - f} pontos.`);
      }
      
      // --- MIRA IMPLACÁVEL (RANGER) ---
      if (heroCombatState.position === "retaguarda" && f === 100) {
         heroCombatState.rangerHeadshot = true;
         appendTerminalLog("🎯 MIRA IMPLACÁVEL! Seu foco de atirador é absoluto, o disparo será devastador!", "reward");
      }
      
      hero.foco = f - sk.cost;
    } else {
      // Classes mágicas e divinas (Necromante, Arcanista, Paladino - Custo base de Mana)
      if (hero.class === "Necromante" && sk.id === "n5" && (hero.almas || 0) < 20) {
        return triggerToast("Você precisa de 20 Almas para forjar a Armadura de Ossos!");
      }
      
      let finalCost = sk.cost;
      const biome = typeof getCurrentBiome === "function" ? getCurrentBiome() : null;
      if (biome && biome.name) {
         const bName = biome.name.toLowerCase();
         if ((bName.includes("tundra") || bName.includes("gelo") || bName.includes("congelada")) && sk.type === "Fogo") {
            finalCost *= 2;
            triggerToast("🔥❄️ O frio extremo dobra o custo da sua magia de fogo!");
         }
      }
      
      if (hero.currentMana < finalCost) {
        if (hero.class === "Arcanista") {
           // --- MAGIA DE SANGUE (ARCANISTA) ---
           const missingMana = finalCost - hero.currentMana;
           const bloodCost = missingMana * 2;
           if (hero.currentHp <= bloodCost) {
              return triggerToast("Sua vida é muito baixa para conjurar Magia de Sangue!");
           }
           hero.currentHp -= bloodCost;
           hero.currentMana = 0;
           appendTerminalLog(`🩸 MAGIA DE SANGUE! Faltavam ${missingMana} de Mana. Você canalizou sua força vital e sacrificou ${bloodCost} HP para conjurar!`, "danger");
           triggerScreenShake();
        } else {
           if (hero.class === "Paladino") return triggerToast("Sua Mana Sagrada se esgotou! Impossível conjurar.");
           return triggerToast("Mana Arcana insuficiente para conjurar a habilidade.");
        }
      } else {
        hero.currentMana -= finalCost;
      }
      
      // Dedução secundária após confirmar a mana
      if (hero.class === "Necromante" && sk.id === "n5") {
         hero.almas -= 20;
      }
    }
  }

  isActionOnCooldown = true;
  setTimeout(() => {
    isActionOnCooldown = false;
  }, 750);

  internalHeroActionExecution(sk);
};

function internalHeroActionExecution(skillObj) {
  const hero = getActiveHero();
  const calc = computeLiveStats();
  const enemy = activeCombatInstance;

  // Armazena se estamos batendo num inimigo quebrado
  const isHittingBrokenEnemy = enemy.staggerBroken;

  // ================= NOVO: FASE DOS LACAIOS (MINIONS) =================
  heroCombatState.activeMinions = heroCombatState.activeMinions || [];
  if (heroCombatState.activeMinions.length > 0) {
    let totalDmg = 0;
    heroCombatState.activeMinions.sort((a, b) => a.id.localeCompare(b.id));

    let logs = [];
    let siphonHeal = 0;
    heroCombatState.activeMinions.forEach(minion => {
       let dmg = Math.floor((hero.level * 1.5 + hero.attributes.inteligencia * 0.5 + 5) * minion.dmgMult);
       totalDmg += dmg;
       logs.push(`${minion.icon}${dmg}`);
       if (minion.siphon) {
           siphonHeal += Math.floor(dmg * 1.0); // Wait, in the plan I said "todos os ataques deles curam o Necromante". The dmg is relatively low (25-50 dmg), so 1.0 (100% of their dmg) is better, or maybe 50%? Let's do 100% since it's an entire specialization choice. Wait, plan says "10%". Let's stick to Math.floor(dmg * 0.2) to make it noticeable. Actually, I'll do 50% of the Mage's damage.
       }
    });

    enemy.hp -= totalDmg;
    enemy.currentHp = enemy.hp;
    generateFloatingText(totalDmg, "damage", "enemy");
    appendTerminalLog(`💀 A Tropa de Ossos ataca! [ ${logs.join(" | ")} ] (Total: ${totalDmg} Dano Sombrio)`, "combat");
    
    // Mago Siphon Heal
    if (siphonHeal > 0) {
      hero.currentHp = Math.min(calc.maxHp, hero.currentHp + siphonHeal);
      appendTerminalLog(`🔮 Sifão Vital! Seus Magos sugaram ${siphonHeal} HP.`, "status");
      triggerDamageVignette(hero.currentHp, calc.maxHp);
    }

    // Lifesteal base da build
    if (calc.passives.lifeSteal > 0) {
      const heal = Math.floor(totalDmg * calc.passives.lifeSteal);
      if (heal > 0) {
         hero.currentHp = Math.min(calc.maxHp, hero.currentHp + heal);
         appendTerminalLog(`🧛 Vampirismo! Os lacaios sifonaram ${heal} HP para você.`, "status");
         triggerDamageVignette(hero.currentHp, calc.maxHp);
      }
    }
    
    if (enemy.hp <= 0) {
      handleEnemyDeath(enemy);
      return;
    }
  }
  // ====================================================================

  const d20 = Math.floor(Math.random() /* nosonar */ * 20) + 1;
  document.getElementById("dice-d20-visual").innerText = d20;

  if (d20 > (runStats.bestRoll || 0)) {
    runStats.bestRoll = d20;
  }

  if (d20 === 1) {
    appendTerminalLog(
      "💀 ROLAGEM D20 MÁQUINA = 1: FALHA CRÍTICA ABSOLUTA. A lâmina escorregou suada.",
      "combat",
    );
    triggerScreenShake();
    comboCounter = 0;
    updateComboUI();
  } else {
    const ef = _applySkillEffects(
      hero,
      calc,
      skillObj,
      heroCombatState,
      activeCombatInstance,
    );

    if (!ef.isHealSkill) {
      let finalDmg = _calcHeroFinalDmg(
        hero,
        calc,
        skillObj,
        enemy,
        ef.rawDmg,
        d20,
      );

      if (finalDmg > 0) {
        comboCounter++;
        if (comboCounter > (runStats.maxCombo || 0)) {
          runStats.maxCombo = comboCounter;
        }
        const comboMult = getComboMultiplier();
        if (comboMult > 1) {
          finalDmg = Math.floor(finalDmg * comboMult);
        }
        updateComboUI();
        runStats.damageDealt = (runStats.damageDealt || 0) + finalDmg;

        enemy.hp -= finalDmg;
        enemy.currentHp = enemy.hp;
        generateFloatingText(finalDmg, "damage", "enemy");
        playWeaponSlashFX();
        
        // --- BRUTALIDADE PRIMITIVA (ORC) ---
        if (hero.race === "Orcs" && (heroCombatState.orcCooldown || 0) <= 0) {
           heroCombatState.orcCooldown = 4;
           activeCombatInstance.statuses = activeCombatInstance.statuses || [];
           activeCombatInstance.statuses.push({ type: "stun", duration: 1 });
           activeCombatInstance.statuses.push({ type: "armorBreak", duration: 2 });
           appendTerminalLog("👹 BRUTALIDADE PRIMITIVA! A força do impacto atordoou e quebrou a armadura do inimigo!", "reward");
           triggerScreenShake();
        }
        


        // ================= NOVO: GANHO DE RECURSOS (HERÓI ATACANDO) =================
        if (hero.class === "Guerreiro") {
          hero.furia = Math.min(100, (hero.furia || 0) + 15);
        } else if (hero.class === "Ranger") {
          if (!skillObj || skillObj.cost === 0) {
            hero.foco = Math.min(100, (hero.foco !== undefined ? hero.foco : 100) + 10);
          }
        } else if (["Necromante", "Arcanista"].includes(hero.class)) {
          hero.almas = Math.min(100, (hero.almas || 0) + 5);
        } else if (hero.class === "Paladino") {
          hero.fe = Math.min(100, (hero.fe || 0) + 10);
        }
        // =========================================================================

        // ================= NOVO: DANO DE POSTURA =================
        if (enemy.posture !== undefined && !isHittingBrokenEnemy) {
          const staggerBonus = calc.passives.staggerBonus || 0; // multiplicador adicional
          const postureDmg = Math.floor(finalDmg + finalDmg * staggerBonus);
          enemy.posture -= postureDmg;

          if (enemy.posture <= 0) {
            enemy.posture = 0; // Fica em 0 até o próximo turno
            enemy.staggerBroken = true; // Flag visual que persiste no render
            enemy.statuses.push({ type: "stun", duration: 1 }); // 2 = sobrevive ao processamento do turno atual
            appendTerminalLog(
              `🛡️💥 POSTURA QUEBRADA! O ${enemy.name} foi atordoado pelo impacto!`,
              "reward",
            );
            triggerScreenShake();
          }
        }
        // =========================================================

        // ANIMAÇÃO DE DANO NO MONSTRO
        if (finalDmg > 0) {
          const enemyImg = document.getElementById(MV_ID_ENEMY_IMG);
          if (enemyImg) {
            enemyImg.classList.remove(MV_CLASS_AVATAR_HIT);
            void enemyImg.offsetWidth; // trigger reflow
            enemyImg.classList.add(MV_CLASS_AVATAR_HIT);
            setTimeout(() => {
              const img = document.getElementById(MV_ID_ENEMY_IMG);
              if (img) img.classList.remove(MV_CLASS_AVATAR_HIT);
            }, 400);
          }
        }

        if (comboCounter >= 5) {
          appendTerminalLog(
            `🔥 COMBO x${comboCounter}! Multiplicador: x${comboMult.toFixed(1)} — Dano amplificado: ${finalDmg}!`,
            "reward",
          );
        } else if (enemy.def > 0) {
          appendTerminalLog(
            `⚔️ Impacto! Armadura inimiga absorveu parte do golpe. Dano Físico Real: ${finalDmg}.`,
            "normal",
          );
        } else {
          appendTerminalLog(
            `⚔️ Impacto Perfeito! Você causou ${finalDmg} DE DANO FRONTAL.`,
            "normal",
          );
        }
      }

      checkBossPhaseTransition(enemy);

      if (skillObj && skillObj.effect && finalDmg > 0) {
        applyStatusToEnemy(skillObj.effect, finalDmg);
      }

      let lStealValue = 0;
      if (skillObj && skillObj.effect && skillObj.effect.type === "lifeSteal") {
        lStealValue += finalDmg * skillObj.effect.value;
      }
      if (calc.passives.lifeSteal > 0) {
        lStealValue += finalDmg * calc.passives.lifeSteal;
      }

      if (lStealValue > 0 && finalDmg > 0) {
        lStealValue = Math.floor(lStealValue);
        hero.currentHp = Math.min(calc.maxHp, hero.currentHp + lStealValue);
        appendTerminalLog(
          `🧛 Vampirismo! O sifão injetou ${Math.floor(lStealValue)} de sangue vital em você.`,
          "status",
        );
        generateFloatingText(Math.floor(lStealValue), "heal", "hero");
      }
    }
  }

  // ================= NOVO: POST ACTION HOOK =================
  if (typeof HeroTraits !== "undefined") {
    const actionResult = { type: skillObj ? "skill" : "attack", skillObj };
    const hookEffects = HeroTraits.postActionHook(hero, activeCombatInstance, actionResult);
    if (hookEffects && hookEffects.length > 0) {
      hookEffects.forEach(ef => {
        if (ef.damageHero) {
          hero.currentHp = Math.max(0, hero.currentHp - ef.damageHero);
          generateFloatingText(ef.damageHero, "damage", "hero");
          triggerDamageVignette(hero.currentHp, calc.maxHp);
        }
        if (ef.log) {
          appendTerminalLog(ef.log, "danger");
        }
      });
      if (hero.currentHp <= 0) {
         return handleHeroDeath();
      }
    }
  }
  // ==========================================================

  // ================= POSTURA: RESET =================
  // Removido: o reset imediato quebrava a imersão visual e a mecânica.
  // A postura agora só se recupera quando o atordoamento acabar (no final do turno).
  // ==================================================
  if (activeCombatInstance.hp <= 0) {
    return finalizeCombatWin();
  }

  // (O processamento de status do inimigo foi movido para o Ticker ATB dele)

  // ATB: O inimigo não ataca mais imediatamente aqui.
  // Apenas encerramos o turno do jogador e retomamos o Ticker do Combate.
  heroCombatState.atb = 0;
  
  if (heroCombatState.orcCooldown > 0) heroCombatState.orcCooldown--;
  if (heroCombatState.humanPotionCooldown > 0) heroCombatState.humanPotionCooldown--;
  
  if (calc && calc.passives && calc.passives.epicPassives && calc.passives.epicPassives.includes("epic_troll_heart")) {
      const healAmt = Math.floor(calc.maxHp * 0.03);
      if (healAmt > 0 && hero.currentHp < calc.maxHp) {
          hero.currentHp = Math.min(calc.maxHp, hero.currentHp + Math.max(1, healAmt));
          generateFloatingText(healAmt, "heal", "hero");
          appendTerminalLog("💚 O Coração de Troll pulsou! Você regenerou vida das suas feridas.", "reward");
      }
  }

  // --- TRIGGERS EPIC PASSIVES (onEndTurn) ---
  processEpicPassives("onEndTurn", hero, calc, activeCombatInstance, {});

  resumeCombatTicker();

  const biome = getCurrentBiome();
  if (biome.fieldEffect.onTurnEnd) {
    biome.fieldEffect.onTurnEnd(hero);
    appendTerminalLog(
      `🔥 O ambiente das ${biome.name} castiga seu corpo!`,
      "combat",
    );
  }

  Object.keys(hero.equipment).forEach((slot) => {
    const item = hero.equipment[slot];
    if (
      item &&
      item.durability !== undefined &&
      Math.random() /* nosonar */ < 0.35
    ) {
      item.durability = Math.max(0, item.durability - 1);
      if (item.durability <= 0) {
        hero.equipment[slot] = null;
        appendTerminalLog(
          `⚠️ Seu item [${item.name}] estilhaçou-se no combate e quebrou!`,
          "combat",
        );
      }
    }
  });

  if (hero.currentHp <= 0) {
    handleHeroDeath();
  } else {
    // (A recuperação de postura foi movida para o Ticker ATB do inimigo)

    commitStorage();
    renderAllEngines();
  }
}

function _applyBiomeMagicImpact(currentDmg, skillObj) {
  if (!skillObj || !skillObj.type) return currentDmg;
  
  const biome = typeof getCurrentBiome === "function" ? getCurrentBiome() : null;
  if (!biome || !biome.name) return currentDmg;

  const bName = biome.name.toLowerCase();
  
  if (bName.includes("tundra") || bName.includes("gelo") || bName.includes("congelada")) {
     if (skillObj.type === "Fogo") return currentDmg * 0.5;
     if (skillObj.type === "Gelo") return currentDmg * 1.5;
  }
  
  if (bName.includes("pântano") || bName.includes("pantano") || bName.includes("agua") || bName.includes("água") && skillObj.type === "Raio") {
    return currentDmg * 1.5;
  }

  return currentDmg;
}

function _calcHeroFinalDmg(hero, calc, skillObj, enemy, rawDmg, d20) {
  let finalDmg = rawDmg;
  
  if (heroCombatState.atkBuff) {
     finalDmg = Math.max(1, finalDmg * (1 + heroCombatState.atkBuff / 100));
  }
  
  if (typeof HeroTraits !== "undefined") {
    finalDmg = HeroTraits.getDamageMod(hero, enemy, skillObj || {}, finalDmg);
  }

  // --- IMPACTO DE BIOMA NO DANO MÁGICO ---
  finalDmg = _applyBiomeMagicImpact(finalDmg, skillObj);

  if (skillObj && enemy.tags && enemy.tags.magicImmune) {
    const tiposMagicos = ["Fogo", "Gelo", "Arcano", "Luz", "Veneno", "Profano"];
    if (tiposMagicos.includes(skillObj.type)) {
      appendTerminalLog(
        "🛡️ O escudo arcano do monstro absorveu o ataque completamente! Imune!",
        "status",
      );
      finalDmg = 0;
    }
  }

  const isExhausted = hero.stamina <= 0;
  if (isExhausted) {
    appendTerminalLog(
      "⚠️ EXAUSTÃO EXTREMA: Seus músculos falham. Dano reduzido e sem chance de crítico!",
      "status",
    );
  }

  let critChance = calc.passives.critChance;
  if (typeof HeroTraits !== "undefined") {
    // A função retorna um valor (0-100) e critChance do calc costuma ser (0.0-1.0), mas vamos assumir que as traits lidam bem com a escala,
    // Em HeroTraitsSystem usamos +15, logo precisa ser convertido para decimal aqui
    let traitCrit = HeroTraits.getCritChanceMod(hero, critChance * 100);
    critChance = traitCrit / 100;
  }

  if ((!isExhausted &&(Math.random() /* nosonar */ < critChance || d20 === 20 || heroCombatState.rangerHeadshot) && finalDmg > 0)) {
    finalDmg *= calc.passives.critDamage;
    if (d20 === 20) {
      finalDmg *= 1.5;
    }
    appendTerminalLog("💥 ACERTO CRÍTICO LETAL!", "reward");
    
    // --- EPIC PASSIVE: FRENESI DE SANGUE ---
    if (calc.passives.epicPassives && calc.passives.epicPassives.includes("epic_blood_frenzy")) {
       const healAmt = Math.floor(calc.maxHp * 0.05);
       hero.currentHp = Math.min(calc.maxHp, hero.currentHp + healAmt);
       heroCombatState.atkBuff = (heroCombatState.atkBuff || 0) + 10;
       if (typeof generateFloatingText !== "undefined") generateFloatingText(healAmt, "heal", "hero");
       appendTerminalLog("🦇 FRENESI DE SANGUE! O crítico curou sua vitalidade e aumentou sua fúria!", "reward");
    }

    // --- TRIGGERS EPIC PASSIVES (onCrit) ---
    let critPayload = { rawDmg: finalDmg };
    critPayload = processEpicPassives("onCrit", hero, calc, enemy, critPayload);
    finalDmg = critPayload.rawDmg;
    
    triggerScreenShake();
  }

  if (isExhausted && finalDmg > 0) {
    finalDmg = Math.floor(finalDmg * 0.5);
  }

  // --- NOVO: SISTEMA DE PRECISÃO E ESQUIVA (Hit Chance) ---
  // Precisão do Herói
  let heroAccuracy = 0.95 + hero.attributes.agilidade * 0.002;
  if (typeof HeroTraits !== "undefined") {
    // Traits podem subtrair -25 por exemplo. Convertendo para decimal:
    let traitHit = HeroTraits.getHitChanceMod(hero, skillObj || {}, heroAccuracy * 100);
    heroAccuracy = traitHit / 100;
  }

  // --- IMPACTO DA POSIÇÃO (VANGUARDA / RETAGUARDA) ---
  if (heroCombatState.position === "retaguarda") {
     if (hero.class === "Guerreiro" || hero.class === "Bárbaro" || hero.class === "Barbaro" || hero.class === "Paladino") {
        if (!skillObj || !skillObj.type) { // Ataque físico
           heroAccuracy -= 0.5;
           finalDmg *= 0.5;
           appendTerminalLog(`⚠️ Na retaguarda, ataques corpo a corpo são fracos e imprecisos!`, "danger");
        }
     } else if ((hero.class === "Ranger" || hero.class === "Arcanista" || hero.class === "Necromante")&& (skillObj && skillObj.type || hero.class === "Ranger")) {
        finalDmg *= 1.25;
        heroAccuracy += 0.1;
     }
  } else {
     if (hero.class === "Ranger" || hero.class === "Arcanista" || hero.class === "Necromante") {
        heroAccuracy -= 0.15;
     }
  }

  // Esquiva do Monstro
  let enemyEvasion = 0.0;
  if (enemy.tags && enemy.tags.dodgeChance) {
    enemyEvasion += enemy.tags.dodgeChance;
  }
  if (enemy.affixes && enemy.affixes.includes("agile")) {
    enemyEvasion += 0.3;
  }

  const hitChance = Math.max(0.05, Math.min(1.0, heroAccuracy - enemyEvasion));

  if (
    !enemy.staggerBroken &&
    !heroCombatState.rangerHeadshot &&
    Math.random() /* nosonar */ > hitChance &&
    (!skillObj || !skillObj.type)
  ) {
    appendTerminalLog(
      `💨 [MISS] O ataque falhou! O inimigo esquivou ou você errou o golpe!`,
      "status",
    );
    generateFloatingText("MISS", "block", "enemy");
    processEpicPassives("onMiss", hero, calc, enemy, {});
    return 0; // Miss completo
  }
  // --------------------------------------------------------

  if (finalDmg > 0) {
    const enemyDef = enemy.def || 0;
    let armorPen = calc.passives.ignoreDef || 0;
    const bestiaryBonus = getBestiaryCombatBonus(enemy);

    if (bestiaryBonus.dmgMult > 0) {
      finalDmg = Math.floor(finalDmg * (1 + bestiaryBonus.dmgMult));
      armorPen += bestiaryBonus.ignoreDef;
      appendTerminalLog(
        `🧠 Seu conhecimento do bestiário inflige +${Math.round(bestiaryBonus.dmgMult * 100)}% de DANO REAL e penetra a armadura do ${enemy.name}!`,
        "reward",
      );
    }

    if (skillObj && skillObj.effect && skillObj.effect.type === "ignoreDef") {
      armorPen += skillObj.effect.value;
    }

    if (heroCombatState.rangerHeadshot) {
      armorPen = 1.0; // Ignora 100% da defesa
      heroCombatState.rangerHeadshot = false; // Consome o efeito
    }

    // --- EPIC PASSIVE: CARRASCO IMPIEDOSO ---
    if (calc.passives.epicPassives && calc.passives.epicPassives.includes("epic_executioner") && enemy.hp / enemy.maxHp < 0.3) {
      armorPen = 1.0;
      appendTerminalLog("☠️ CARRASCO IMPIEDOSO! O golpe executou a fraqueza ignorando a armadura!", "reward");
    }

    // --- TRIGGERS EPIC PASSIVES (onAttack) ---
    let attackPayload = { skillObj, rawDmg, finalDmg, armorPen };
    attackPayload = processEpicPassives("onAttack", hero, calc, enemy, attackPayload);
    finalDmg = attackPayload.finalDmg;
    armorPen = attackPayload.armorPen;

    const effectiveDef = Math.floor(enemyDef * Math.max(0, 1 - armorPen));

    if (
      enemy.affixes &&
      enemy.affixes.includes("armored") &&
      (!skillObj || !skillObj.type)
    ) {
      appendTerminalLog(
        `🛡️ O casco [Blindado] ignorou grande parte da sua força bruta!`,
        "status",
      );
      finalDmg = Math.floor(finalDmg * 0.6);
    }

    if (enemy.aiDefendTurn) {
       appendTerminalLog(`🛡️ O inimigo bloqueou a maior parte do seu dano devido à Postura Defensiva!`, "status");
       finalDmg = Math.floor(finalDmg * 0.3); // 70% Damage reduction
       enemy.aiDefendTurn = false; // Consome o escudo
    }

    // --- NOVO: BÔNUS MASSIVO SE POSTURA QUEBRADA ---
    if (enemy.staggerBroken) {
      finalDmg = Math.floor(finalDmg * 2.5); // 150% de dano bônus no stagger
      appendTerminalLog(
        `💥 GOLPE DE MISERICÓRDIA! O inimigo estava paralisado e indefeso! DANO MASSIVO!`,
        "reward",
      );
    }

    // --- NOVO: VARIÂNCIA DE DANO (RNG ±10%) ---
    finalDmg = Math.floor(finalDmg * (0.9 + Math.random() /* nosonar */ * 0.2));

    // Fórmula AAA de Retornos Decrescentes (mesma usada em LoL/Diablo)
    const DEFENSE_CONSTANT = 100;
    finalDmg = Math.floor(
      Math.max(
        1,
        finalDmg * (DEFENSE_CONSTANT / (DEFENSE_CONSTANT + effectiveDef)),
      ),
    );
  }
  
  if (finalDmg > 0) {
    // Adiciona variação aleatória de dano (90% a 110%) para não ficar estático
    const variance = 0.9 + (Math.random() /* nosonar */ * 0.2);
    finalDmg = Math.floor(finalDmg * variance);
  }
  
  return finalDmg;
}

function _processSanitySystem(hero) {
  // Apenas monstros formidáveis causam dano de sanidade
  const isFormidable = activeCombatInstance.lvl >= 5 || activeCombatInstance.type === "boss" || (activeCombatInstance.tags && activeCombatInstance.tags.elite);
  if (!isFormidable) return;
  if (heroCombatState.determinationTested) return;

  // Dano Base de Sanidade
  hero.sanity = Math.max(0, (hero.sanity || 100) - (Math.floor(Math.random() * 8) + 4));

  if (hero.sanity > 0) return;

  // --- INTERVENÇÃO DIVINA (PALADINO) ---
  if (hero.class === "Paladino" && (hero.fe || 0) >= 100) {
      hero.fe = 0;
      hero.sanity = hero.maxSanity || 100;
      appendTerminalLog("☀️ A LUZ PREVALECE! Sua Fé Intocável purificou as trevas de sua mente! (100 de Fé consumidos)", "reward");
      triggerScreenShake();
      return;
  }

  // --- TRANSFERÊNCIA DE LOUCURA (NECROMANTE) ---
  if (hero.class === "Necromante" && heroCombatState.activeMinions && heroCombatState.activeMinions.length > 0) {
      const sac = heroCombatState.activeMinions.shift();
      hero.sanity = hero.maxSanity || 100;
      appendTerminalLog(`💀 LOUCURA TRANSFERIDA! Você despejou seu terror na mente do ${sac.name}!`, "reward");
      triggerScreenShake();
      return;
  }

  // --- TESTE DE DETERMINAÇÃO PADRÃO ---
  heroCombatState.determinationTested = true;
  const isVirtuous = Math.random() < 0.35; // 35% Virtude

  if (isVirtuous) {
      appendTerminalLog("🌟 TESTE DE DETERMINAÇÃO: VIRTUDE! Você encontrou força no desespero!", "reward");
      heroCombatState.atkBuff = (heroCombatState.atkBuff || 0) + 50;
      heroCombatState.defBuff = (heroCombatState.defBuff || 0) + 50;
      hero.sanity = hero.maxSanity || 100;
  } else {
      appendTerminalLog("💀 TESTE DE DETERMINAÇÃO: AFLIÇÃO! A loucura tomou conta da sua mente!", "danger");
      heroCombatState.atkBuff = (heroCombatState.atkBuff || 0) - 30;
      heroCombatState.defBuff = (heroCombatState.defBuff || 0) - 30;
  }
  
  triggerScreenShake();
}

function resolveEnemyAttack(success) {
  const hero = getActiveHero();
  const calc = computeLiveStats();
  
  // Reseta o bloqueio do turno passado, caso o herói não tenha atacado
  if (activeCombatInstance.aiDefendTurn && !success) {
      activeCombatInstance.aiDefendTurn = false;
  }

  if (success) {
     heroCombatState.atb = 100;
     appendTerminalLog("🛡️ ESQUIVA PERFEITA! Seu turno foi recuperado instantaneamente!", "reward");
     if (activeCombatInstance.posture !== undefined) {
         activeCombatInstance.posture = Math.max(0, activeCombatInstance.posture - 15); // Nerf: Postura quebra mais difícil
         if (activeCombatInstance.posture <= 0) {
            activeCombatInstance.staggerBroken = true;
            activeCombatInstance.statuses.push({ type: "stun", duration: 1 });
            appendTerminalLog("💥 O INIMIGO FOI ATORDOADO APÓS SEU PARRY PERFEITO!", "reward");
            triggerScreenShake();
         }
     }
  } else {
     const action = executeMonsterAI(activeCombatInstance, hero, calc);
     appendTerminalLog(`🧠 ${action.log}`, "combat");
     
     if (action.type === "defend") {
        activeCombatInstance.aiDefendTurn = true;
        activeCombatInstance.atb = 0;
        resumeCombatTicker();
        return;
     }
     
     if (action.type === "heal") {
        const healAmt = Math.floor(activeCombatInstance.maxHp * 0.15);
        activeCombatInstance.hp = Math.min(activeCombatInstance.maxHp, activeCombatInstance.hp + healAmt);
        activeCombatInstance.currentHp = activeCombatInstance.hp;
        generateFloatingText(healAmt, "heal", "enemy");
        activeCombatInstance.atb = 0;
        resumeCombatTicker();
        return;
     }

     if (action.type === "debuff") {
        applyStatusToHero({ type: "poison", duration: 3, power: Math.max(5, Math.floor(action.dmg * 0.5)) });
     }
     
     // Novo Sistema de Status Únicos de Chefes/Elites
     if (action.effect && action.effect !== "vampiric") {
        applyStatusToHero({ type: action.effect, duration: 2, power: Math.max(2, Math.floor(action.dmg * 0.1)) });
     }

     let enemyRawDmg = action.dmg;
     
     // --- IMUNIDADE A DANO (BÁRBARO) ---
     if (heroCombatState.immuneToDamage) {
        enemyRawDmg = 0;
        appendTerminalLog(`🛡️ SUA FÚRIA CEGA IGNORA A DOR! O ataque do inimigo não surtiu efeito!`, "reward");
        heroCombatState.immuneToDamage = false; // Consome a imunidade
     }

     const totalDef = calc.defense + (heroCombatState.defBuff || 0);
     let damageTaken = Math.floor(Math.max(1, enemyRawDmg * (100 / (100 + Math.max(0, totalDef)))));

     // Proteção extra se tiver imunidade
     if (enemyRawDmg === 0) damageTaken = 0;

     if (typeof HeroTraits !== "undefined") {
       // Assume físico se a IA não especificou tipo de dano mágico
       let attackType = action.skillType || "Físico";
       damageTaken = HeroTraits.getTakeDamageMod(hero, attackType, damageTaken);
     }

     // --- EPIC PASSIVE: CORAÇÃO DE TROLL (FRAQUEZA A FOGO) ---
     if (calc.passives.epicPassives && calc.passives.epicPassives.includes("epic_troll_heart") && action.skillType === "Fogo") {
         damageTaken *= 2;
         appendTerminalLog("🔥 CORAÇÃO DE TROLL! Sua regeneração acelerada faz a carne queimar horrivelmente! Dano de fogo dobrado!", "danger");
     }

     if (action.effect === "vampiric") {
        const healAmt = Math.floor(damageTaken * 0.5);
        activeCombatInstance.hp = Math.min(activeCombatInstance.maxHp, activeCombatInstance.hp + healAmt);
        activeCombatInstance.currentHp = activeCombatInstance.hp;
        generateFloatingText(healAmt, "heal", "enemy");
     }

     if (hero.class === "Paladino" && Math.random() < 0.1) {
       damageTaken = 0;
       appendTerminalLog("🛡️ ÉGIDE DIVINA! Sua fé bloqueou 100% do ataque inimigo.", "reward");
     }

     // --- TRIGGERS EPIC PASSIVES (onDamageTaken) ---
     let damagePayload = { damageTaken, attackType: action.skillType || "Físico", isCrit: heroCombatState.staggerBroken };
     damagePayload = processEpicPassives("onDamageTaken", hero, calc, activeCombatInstance, damagePayload);
     damageTaken = damagePayload.damageTaken;

     // --- EPIC PASSIVE: CARAPAÇA PEÇONHENTA ---
     if (calc.passives.epicPassives && calc.passives.epicPassives.includes("epic_poison_shell") && damageTaken > 0 && (!action.skillType || action.skillType === "Físico")) {
         activeCombatInstance.statuses = activeCombatInstance.statuses || [];
         activeCombatInstance.statuses.push({ type: "poison", duration: 3, power: 15 });
         appendTerminalLog("🕷️ CARAPAÇA PEÇONHENTA! O impacto no seu equipamento liberou um gás tóxico, envenenando severamente o inimigo!", "reward");
     }

     // --- SISTEMA DE POSTURA DO HERÓI (ESTAMINA) ---
     if (heroCombatState.staggerBroken) {
        damageTaken *= 2; // Inimigo crita automaticamente um herói fadigado
        appendTerminalLog(`⚠️ GOLPE FULMINANTE! Você estava sem guarda (Estamina 0) e sofreu Crítico!`, "danger");
        heroCombatState.staggerBroken = false; // Consome o stagger após o golpe crítico
     }

     // --- SISTEMA DE SANIDADE (DARKEST DUNGEON) ---
     _processSanitySystem(hero);

     if (damageTaken > 0) {
        // O herói perde estamina ao apanhar
        if (hero.stamina > 0) {
           hero.stamina = Math.max(0, hero.stamina - Math.floor(damageTaken * 0.2));
           if (hero.stamina <= 0) {
              if (hero.class === "Guerreiro") {
                 appendTerminalLog(`🛡️💥 SUA GUARDA FOI QUEBRADA! Mas a dor só alimenta seu ódio! (Adrenalina: Defesa ZERADA, Turno Imediato)`, "reward");
                 heroCombatState.staggerBroken = false;
                 heroCombatState.defBuff = -9999;
                 heroCombatState.atb = 100;
                 heroCombatState.statuses = []; // Limpa debuffs
                 triggerScreenShake();
              } else {
                 heroCombatState.staggerBroken = true;
                 appendTerminalLog(`🛡️💥 SUA GUARDA FOI QUEBRADA! O próximo ataque inimigo será devastador!`, "danger");
                 triggerScreenShake();
              }
           }
        }
        
        // ================= NOVO: MINION SHIELD =================
        heroCombatState.activeMinions = heroCombatState.activeMinions || [];
       let actualDamageToHero = damageTaken;

       if (heroCombatState.activeMinions.length > 0) {
          heroCombatState.activeMinions.sort((a, b) => {
             const priority = { "guardiao": 1, "guerreiro": 2, "mago": 3 };
             return priority[a.id] - priority[b.id];
          });

          while (heroCombatState.activeMinions.length > 0 && actualDamageToHero > 0) {
             let minion = heroCombatState.activeMinions[0];
             if (minion.hp >= actualDamageToHero) {
               minion.hp -= actualDamageToHero;
               appendTerminalLog(`🛡️ O ${minion.name} absorveu ${actualDamageToHero} de dano! (${minion.icon} restam ${minion.hp} HP)`, "normal");
               actualDamageToHero = 0;
             } else {
               actualDamageToHero -= minion.hp;
               heroCombatState.activeMinions.shift(); // Destroys it
               appendTerminalLog(`💀 Escudo Quebrado! O ${minion.name} foi destroçado!`, "combat");
             }
          }
       }
       // =======================================================

       hero.currentHp -= actualDamageToHero;
       
       // --- ÚLTIMO SUSPIRO (BÁRBARO) ---
       if (hero.currentHp <= 0 && ["Bárbaro", "Barbaro"].includes(hero.class) && !heroCombatState.barbarianLastStandUsed) {
          hero.currentHp = 1;
          heroCombatState.barbarianLastStandUsed = true;
          heroCombatState.atkBuff = (heroCombatState.atkBuff || 0) + 100;
          heroCombatState.immuneToDamage = true;
          appendTerminalLog(`🩸 ÚLTIMO SUSPIRO! Você se recusa a morrer! (HP cravado em 1, Imunidade a Dano e +100% de Ataque pelo próximo turno)`, "reward");
          triggerScreenShake();
       }
       
       runStats.damageTaken = (runStats.damageTaken || 0) + damageTaken;
       
       if (hero.class === "Guerreiro") {
         hero.furia = Math.min(100, (hero.furia || 0) + 10);
       } else if (["Bárbaro", "Barbaro"].includes(hero.class)) {
         hero.adrenalina = Math.min(100, (hero.adrenalina || 0) + 10);
       }

       if (activeCombatInstance.affixes && activeCombatInstance.affixes.includes("vampiric")) {
          const heal = Math.floor(damageTaken * 0.3);
          activeCombatInstance.currentHp = Math.min(activeCombatInstance.maxHp, activeCombatInstance.currentHp + heal);
          activeCombatInstance.hp = activeCombatInstance.currentHp;
          appendTerminalLog(`🦇 O inimigo [Vampírico] curou-se em ${heal} HP!`, "status");
       }

       if (activeCombatInstance.tags && activeCombatInstance.tags.poisonHit) {
          heroCombatState.statuses = heroCombatState.statuses || [];
          heroCombatState.statuses.push({ type: "poison", duration: 3, power: Math.max(5, Math.floor(damageTaken * 0.3)) });
          appendTerminalLog(`☣️ A peçonha escorreu! Você foi ENVENENADO!`, "combat");
       }

       triggerDamageVignette(hero.currentHp, calc.maxHp);
       appendTerminalLog(`🩸 Ataque Brutal! Você sofreu ${damageTaken} de DANO REAL!`, "combat");
       triggerScreenShake();
     }
  }

  activeCombatInstance.atb = 0;
  resumeCombatTicker();
  
  if (hero.currentHp <= 0) {
    handleHeroDeath();
  }
  renderAllEngines();
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

  // Inteligência Artificial Universal (Utility AI)
  if (typeof window.executeUtilityAI === "function") {
      return window.executeUtilityAI(enemy, hero, calc, baseDmg);
  } else {
      // Fallback de segurança caso o motor de IA falhe em carregar
      return calculateCommonAction(enemy, hero, calc, hpPercent, heroHpPercent, baseDmg);
  }
}

function processEpicPassives(trigger, hero, calc, enemy, payload) {
  if (!calc || !calc.passives || !calc.passives.epicPassives || calc.passives.epicPassives.length === 0) return payload;
  
  calc.passives.epicPassives.forEach(passive => {
      switch(trigger) {
          case "onCrit":
              if (passive === "epic_dulahn_execute" && Math.random() < 0.15) { 
                 enemy.statuses = enemy.statuses || []; 
                 enemy.statuses.push({ type: "stun", duration: 1, power: 0 }); 
                 appendTerminalLog("💀 A Clemência do Algoz Atordoou o inimigo com o crítico!", "reward"); 
              }
              if (passive === "epic_shadow_cultist" && payload && payload.rawDmg) {
                 payload.rawDmg = Math.floor(payload.rawDmg * 1.5);
              }
              break;
              
          case "onAttack":
              if (passive === "epic_lesser_death" && (!payload.skillObj || !payload.skillObj.type)) { 
                 enemy.statuses = enemy.statuses || []; 
                 enemy.statuses.push({ type: "poison", duration: 3, power: 10 }); 
                 appendTerminalLog("☠️ A Lâmina Pútrida envenenou o alvo!", "reward"); 
              }
              if (passive === "epic_corrupt_paladin" && hero.hp >= calc.maxHp) payload.finalDmg = Math.floor(payload.finalDmg * 1.5);
              if (passive === "epic_bone_amalgam") payload.armorPen = (payload.armorPen || 0) + 0.15;
              if (passive === "epic_fallen_omen" && enemy.statuses && enemy.statuses.find(s => s.type === "poison")) payload.finalDmg = Math.floor(payload.finalDmg * 1.2);
              if (passive === "epic_blood_beast" && enemy.statuses && enemy.statuses.find(s => s.type === "poison" || s.type === "bleed")) {
                  const healAmt = Math.floor(payload.finalDmg * 0.05);
                  hero.hp = Math.min(calc.maxHp, hero.hp + healAmt);
                  if (typeof generateFloatingText !== "undefined") generateFloatingText(healAmt, "heal", "hero");
              }
              if (passive === "epic_ignis_flame" && Math.random() < 0.2) { 
                 enemy.statuses = enemy.statuses || []; 
                 enemy.statuses.push({ type: "burn", duration: 3, power: calc.passives.burnPower || 15 }); 
                 appendTerminalLog("🔥 O Toque do Arauto incendiou o alvo!", "reward"); 
              }
              if (passive === "epic_pursuer_flight" && typeof heroCombatState !== "undefined" && heroCombatState.position === "retaguarda") {
                 payload.finalDmg += Math.floor(payload.rawDmg * 0.15);
                 payload.armorPen = 1.0;
              }
              if (passive === "epic_capra_demon" && Math.random() < 0.1 && (typeof heroCombatState !== "undefined" && !heroCombatState.capraTriggered)) {
                 heroCombatState.capraTriggered = true;
                 enemy.statuses = enemy.statuses || []; enemy.statuses.push({ type: "armorBreak", duration: 2, power: 0 });
                 appendTerminalLog("🐃 Os Chifres Capra romperam a defesa inimiga!", "reward");
              }
              if (passive === "epic_fire_guard" && payload.skillObj && payload.skillObj.type === "Fogo") payload.finalDmg = Math.floor(payload.finalDmg * 1.4);
              if (passive === "epic_living_wood" && (!payload.skillObj || !payload.skillObj.type)) hero.stamina = Math.min(hero.maxStamina || 100, hero.stamina + 1);
              if (passive === "epic_artorias" && (enemy.isBoss || enemy.isElite)) payload.finalDmg = Math.floor(payload.finalDmg * 1.25);
              if (passive === "epic_femto" && (!payload.skillObj || !payload.skillObj.type)) payload.armorPen = (payload.armorPen || 0) + 0.5;
              if (passive === "epic_crystal_sage" && payload.skillObj && payload.skillObj.type === "Gelo") {
                 payload.finalDmg = Math.floor(payload.finalDmg * 1.3);
                 if (Math.random() < 0.15) { enemy.statuses = enemy.statuses || []; enemy.statuses.push({ type: "freeze", duration: 1, power: 0 }); appendTerminalLog("❄️ Zero Absoluto congelou o inimigo!", "reward"); }
              }
              break;
              
          case "onDamageTaken":
              if (passive === "epic_crucible_iron" && typeof heroCombatState !== "undefined" && heroCombatState.aiDefendTurn) { 
                 payload.damageTaken = Math.floor(payload.damageTaken * 0.5); 
                 appendTerminalLog("🛡️ Muralha do Crisol reduziu o dano pela metade!", "reward"); 
              }
              if (passive === "epic_kelpie_drown" && payload.attackType !== "Físico" && Math.random() < 0.1) { 
                 payload.damageTaken = 0; 
                 appendTerminalLog("💧 A Miragem Aquática anulou o feitiço inimigo!", "reward"); 
              }
              if (passive === "epic_magma_dragon" && payload.attackType === "Físico") { 
                 const reflect = Math.floor(payload.damageTaken * 0.15); 
                 enemy.hp -= reflect; 
                 if (typeof generateFloatingText !== "undefined") generateFloatingText(reflect, "fire", "enemy"); 
                 appendTerminalLog(`🔥 A Escama de Magma refletiu ${reflect} de Dano!`, "reward"); 
              }
              if (passive === "epic_elder_magma" && payload.attackType === "Fogo") payload.damageTaken = 0;
              if (passive === "epic_grunbeld" && payload.attackType === "Fogo") { 
                 const reflect = payload.damageTaken; 
                 enemy.hp -= reflect; 
                 payload.damageTaken = 0; 
                 if (typeof generateFloatingText !== "undefined") generateFloatingText(reflect, "fire", "enemy"); 
                 appendTerminalLog("🔥 Fornalha Viva refletiu todo o dano de fogo!", "reward"); 
              }
              if (passive === "epic_silver_golem") payload.damageTaken = Math.max(0, payload.damageTaken - 10);
              if (passive === "epic_headless_ape" && payload.isCrit) { 
                 if(typeof heroCombatState !== "undefined") heroCombatState.atkBuff = (heroCombatState.atkBuff || 0) + 100; 
                 appendTerminalLog("🦍 A Ira Enlouquecida dobrou seu próximo ataque!", "danger"); 
              }
              break;
              
          case "onMiss":
              if (passive === "epic_renna_illusion" && Math.random() < 0.5) { 
                 appendTerminalLog("❄️ O Véu de Renna abriu uma brecha para um contra-ataque livre!", "reward"); 
              }
              break;
              
          case "onEndTurn":
              if (passive === "epic_swamp_witch" && enemy) { 
                 enemy.tags = enemy.tags || {}; enemy.tags.dodgeChance = (enemy.tags.dodgeChance || 0) + 0.2; 
              }
              if (passive === "epic_zodd_immortal" && hero.hp / calc.maxHp < 0.2) { 
                 calc.passives.lifeSteal += 0.3; 
                 appendTerminalLog("🦇 Sangue Imortal! Seu roubo de vida aumentou drasticamente!", "reward"); 
              }
              if (passive === "epic_red_wyvern" && typeof heroCombatState !== "undefined") { 
                 heroCombatState.turnCounter = (heroCombatState.turnCounter || 0) + 1; 
                 if(heroCombatState.turnCounter >= 4) { 
                     heroCombatState.extraAction = true; heroCombatState.turnCounter = 0; 
                     appendTerminalLog("🐉 Mergulho Abrasador! Você ganhou um turno extra!", "reward"); 
                 } 
              }
              if (passive === "epic_lava_centipede" && enemy && enemy.statuses) { 
                 const burn = enemy.statuses.find(s => s.type === "burn"); 
                 if (burn) { burn.power += 20; appendTerminalLog("🔥 Anéis de Calor potencializaram a queimadura inimiga!", "danger"); } 
              }
              if (passive === "epic_riful_west" && typeof heroCombatState !== "undefined") { 
                 heroCombatState.rifulBonus = Math.min(0.2, (heroCombatState.rifulBonus || 0) + 0.02); 
              }
              break;
              
          case "onStartCombat":
              if (passive === "epic_priscilla_awake" && typeof heroCombatState !== "undefined") { 
                 heroCombatState.immuneToDamage = true; 
                 appendTerminalLog("❄️ Ocultação Ilusória: Você não receberá dano no primeiro ataque!", "reward"); 
              }
              if (passive === "epic_refuge_demon") { 
                 calc.maxHp += 150; 
                 hero.hp += 150; 
              }
              break;
      }
  });
  return payload;
}

function getBestiaryCombatBonus(enemy) {
  const hero = getActiveHero();
  if (!hero || !hero.bestiary) {
    return { dmgMult: 0, ignoreDef: 0, kills: 0 };
  }
  const baseName =
    enemy && enemy.baseName
      ? enemy.baseName
      : enemy && enemy.name
        ? enemy.name
        : null;
  if (!baseName) {
    return { dmgMult: 0, ignoreDef: 0, kills: 0 };
  }

  const kills =
    hero.bestiary[baseName] ||
    hero.bestiary[baseName.replace(/^☠️\s*/, "")] ||
    0;
  const threshold = 50;
  if (kills >= threshold) {
    return { dmgMult: 0.15, ignoreDef: 0.15, kills };
  }
  return { dmgMult: 0, ignoreDef: 0, kills };
}

function getComboMultiplier() {
  if (comboCounter < 3) {
    return 1.0;
  }
  if (comboCounter < 5) {
    return 1.15;
  }
  if (comboCounter < 8) {
    return 1.3;
  }
  if (comboCounter < 12) {
    return 1.5;
  }
  return 2.0; // Fúria Nephalem
}

window.handleHeroDeath = function () {
  const hero = getActiveHero();
  if (hero) {
    hero.currentHp = computeLiveStats().maxHp;
    
    // Penalidade
    const goldLost = Math.floor(hero.gold * 0.1);
    hero.gold = Math.max(0, hero.gold - goldLost);

    const deathOverlay = document.getElementById("death-overlay");
    if (deathOverlay) {
      const randomMsg = DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)];
      const msgEl = document.getElementById("death-message-text");
      if (msgEl) msgEl.innerText = randomMsg;
      
      const statsEl = document.getElementById("death-run-stats");
      if (statsEl) {
        statsEl.innerHTML = `
          <div>⚔️ Inimigo Fatal: ${activeCombatInstance ? activeCombatInstance.name : "Desconhecido"}</div>
          <div>🔥 Andar: ${hero.dungeonLevel || 1}</div>
        `;
      }
      
      const penEl = document.getElementById("death-penalties-info");
      if (penEl) {
        penEl.innerHTML = `<div>💸 Ouro perdido: <span style="color:#f87171">-${goldLost}</span></div>`;
      }
      
      deathOverlay.classList.add("active");
    }
    
    commitStorage();
  }
  
  if (typeof combatTickerInterval !== 'undefined' && combatTickerInterval) {
    clearInterval(combatTickerInterval);
  }
  activeCombatInstance = null;
  clearDamageVignette();
  
  if (typeof renderAllEngines === 'function') {
    renderAllEngines();
  }
};

function finalizeCombatWin() {
  if (typeof combatTickerInterval !== 'undefined' && combatTickerInterval) clearInterval(combatTickerInterval);
  const hero = getActiveHero();
  if (!hero) {
    return;
  }

  clearDamageVignette();

  // Se o monstro não tiver xp/gold no banco de dados, gera dinamicamente baseado na Vida Máxima e no desafio (Andar)
  let xpW =
    activeCombatInstance.xp ||
    Math.floor((activeCombatInstance.maxHp || 100) * 1.5);
  let goldW =
    activeCombatInstance.gold ||
    Math.floor((activeCombatInstance.maxHp || 100) * 0.5);

  if (activeCombatInstance.isBoss) {
    xpW = Math.floor(xpW * 2.5);
    goldW = Math.floor(goldW * 2);
  }

  if (
    activeCombatInstance.affixes &&
    activeCombatInstance.affixes.includes("wealthy")
  ) {
    goldW *= 3;
    appendTerminalLog(
      `💰 O monstro [Afortunado] derrubou sacos repletos de moedas brilhantes!`,
      "status",
    );
  }

  if (hero.gameTime && hero.gameTime.isNight) {
    xpW = Math.floor(xpW * 1.1);
  }

  if (hero.hardmode) {
    xpW *= 5;
    goldW *= 5;
  }

  if (activeCombatInstance && activeCombatInstance.baseName) {
    const mName = activeCombatInstance.baseName;
    hero.bestiary[mName] = (hero.bestiary[mName] || 0) + 1;
  }

  runStats.monstersKilled = (runStats.monstersKilled || 0) + 1;
  runStats.goldEarned = (runStats.goldEarned || 0) + goldW;

  _generateLoreFragments(hero, activeCombatInstance);

  hero.gold += goldW;

  if (activeCombatInstance.isBoss) {
    if (window.writeAutoDiary) {
      window.writeAutoDiary({
        useAI: true,
        eventType: "boss_kill",
        baseText: `As chamas de ${activeCombatInstance.baseName} foram extintas por minha lâmina. O andar ${hero.dungeonLevel} agora chora a perda do seu mestre.`,
        enemyName: activeCombatInstance.baseName,
        hpPercent: Math.round((hero.hp / hero.maxHp) * 100),
        dungeonLevel: hero.dungeonLevel,
      });
    }

    hero.materials["essencia_maior"] =
      (hero.materials["essencia_maior"] || 0) + 2;
    hero.materials["essencia_epica"] =
      (hero.materials["essencia_epica"] || 0) + 1;
    hero.materials["lagrima_divina"] =
      (hero.materials["lagrima_divina"] || 0) + 1;
    appendTerminalLog(
      `🏆 LORDE ANIQUILADO! O baú expele ${goldW} Ouro e ${xpW} XP. Espólios divinos resgatados!`,
      "reward",
    );

    const bossLoot1 = generateProceduralLoot(hero.dungeonLevel, "Lendario", activeCombatInstance);
    bossLoot1.name = `Despojo do ${activeCombatInstance.baseName}`;
    hero.inventory.push(bossLoot1);

    if (Math.random() /* nosonar */ < 0.1) {
      const bossLoot2 = generateProceduralLoot(hero.dungeonLevel, "Mitico", activeCombatInstance);
      hero.inventory.push(bossLoot2);
      appendTerminalLog(
        `🚨 GOTA MÍTICA! O Boss dropou o item divino: ${bossLoot2.name}!`,
        "reward",
      );
    }

    _generateBossRelics(hero, activeCombatInstance);

    if (addExperience(xpW)) {
      triggerToast("⭐ LEVEL UP DA ESPADA ⭐");
    }

    hero.inBossRestArea = true;
    activeCombatInstance = null;
    commitStorage();
    renderAllEngines();
    return;
  }

  hero.floorProgress = (hero.floorProgress || 0) + 1;
  appendTerminalLog(
    `Progresso do andar: ${hero.floorProgress}/5 monstros derrotados.`,
    "status",
  );

  const poolMats = ALL_MATERIALS.slice(0, 14);
  const randMat =
    poolMats[Math.floor(Math.random() /* nosonar */ * poolMats.length)];
  hero.materials[randMat.id] += 1;

  let dropMsg = `1x ${randMat.name}`;

  const dropChance = activeCombatInstance.isElite ? 0.6 : 0.15;
  if (Math.random() /* nosonar */ < dropChance) {
    const mobDrop = generateProceduralLoot(hero.dungeonLevel, null, activeCombatInstance);
    hero.inventory.push(mobDrop);
    dropMsg += ` | 📦 Drop: ${mobDrop.name} (${mobDrop.rarity})`;
  }

  appendTerminalLog(
    `🏆 O sangue lavou as rochas: +${goldW} Ouro. Experiência: +${xpW} XP. Espólios: ${dropMsg}.`,
    "reward",
  );

  hero.quests.forEach((q) => {
    if (q.status === "ativo" && q.type === "Kill") {
      q.progress++;
      if (q.progress >= q.target) {
        q.progress = q.target;
        triggerToast(`Mural de Caçadas concluído: Extermínio! (${q.title})`);
      }
    }
  });

  if (addExperience(xpW)) {
    triggerToast("⭐ TRANSCENDÊNCIA LEVEL UP ⭐");
  }

  if (hero.floorExploration >= 100) {
    hero.floorCleared = true;
    hero.isFightingGuardian = false;
    appendTerminalLog(
      "⚔️ A ameaça foi neutralizada. As escadarias estão livres para o próximo andar.",
      "status",
    );
  }

  activeCombatInstance = null;
  commitStorage();
  renderAllEngines();
}

function _generateLoreFragments(hero, activeCombatInstance) {
  const loreFragmentsOwned = hero.inventory.filter(
    (i) => i.type === "lore_fragment",
  ).length;
  const loreFragmentsRead = hero.loreChapters
    ? Object.values(hero.loreChapters).flatMap((ch) => ch.fragments || [])
        .length
    : 0;
  const loreDiscoveryBonus = Math.min(
    0.12,
    (loreFragmentsOwned + loreFragmentsRead) * 0.01,
  );

  const biome = getCurrentBiome();
  const candidates = MEMORY_FRAGMENT_POOL.filter((f) => f.biome === biome.name);

  if (candidates.length >= 3) {
    const fragmentBoss = candidates[2];
    const fragmentMobs = [candidates[0], candidates[1]];

    let droppedFragment = null;

    if (activeCombatInstance.isBoss) {
      droppedFragment = fragmentBoss;
    } else {
      const fragmentBaseChance = Math.min(
        0.35,
        (activeCombatInstance.isElite ? 0.15 : 0.05) + loreDiscoveryBonus,
      );
      if (loreDiscoveryBonus > 0 && Math.random() /* nosonar */ < 0.1) {
        appendTerminalLog(
          `📖 A ressonância de suas memórias aumenta a chance de descobrir fragmentos de lore!`,
          "status",
        );
      }
      if (Math.random() /* nosonar */ < fragmentBaseChance) {
        droppedFragment =
          fragmentMobs[
            Math.floor(Math.random() /* nosonar */ * fragmentMobs.length)
          ];
      }
    }

    if (droppedFragment) {
      const alreadyOwned = hero.inventory.some(
        (i) =>
          i.type === "lore_fragment" && i.fragmentId === droppedFragment.id,
      );
      const alreadyRead =
        hero.loreChapters &&
        hero.loreChapters[droppedFragment.chapter] &&
        hero.loreChapters[droppedFragment.chapter].fragments &&
        hero.loreChapters[droppedFragment.chapter].fragments.includes(
          droppedFragment.id,
        );

      if (!alreadyOwned && !alreadyRead) {
        hero.inventory.push({
          id: `frag_${droppedFragment.id}_${Date.now()}`,
          fragmentId: droppedFragment.id,
          chapter: droppedFragment.chapter,
          type: "lore_fragment",
          name: droppedFragment.name,
          desc: droppedFragment.desc,
          rarity: "Lendario",
        });
        if (activeCombatInstance.isBoss) {
          appendTerminalLog(
            `📜 O Chefão deixou cair a peça vital da História: ${droppedFragment.name}.`,
            "reward",
          );
        } else {
          appendTerminalLog(
            `📜 Fragmento de Memória encontrado no cadáver: ${droppedFragment.name}.`,
            "reward",
          );
        }
        triggerToast(
          `🧠 Fragmento de Lore encontrado! Abra o Lore para montar sua memória.`,
        );
      }
    }
  }
}

function _generateBossRelics(hero, activeCombatInstance) {
  const relicMap = {
    "Lorde Necromante": {
      id: "relic_1",
      name: "Osso Profano",
      desc: "+20 Max HP, +5 Def",
      attr: { hp: 20, def: 5 },
    },
    "Hidra Corrompida": {
      id: "relic_2",
      name: "Glândula Venenosa",
      desc: "+15 Atk",
      attr: { atk: 15 },
    },
    "Senhor da Forja": {
      id: "relic_3",
      name: "Coração Derretido",
      desc: "+30 Def, +20 Max HP",
      attr: { def: 30, hp: 20 },
    },
    "Dragão Filhote": {
      id: "relic_4",
      name: "Brasa Eterna",
      desc: "+25 Atk",
      attr: { atk: 25 },
    },
    "Illfang, o Rei Kobold": {
      id: "relic_5",
      name: "Lâmina do Rei",
      desc: "+35 Atk, -10 Def",
      attr: { atk: 35, def: -10 },
    },
    "X'rphan, o Dragão Branco": {
      id: "relic_6",
      name: "Cristal Absoluto",
      desc: "+50 Max Mana, +20 Def",
      attr: { mp: 50, def: 20 },
    },
    "The Gleam Eyes": {
      id: "relic_7",
      name: "Olho do Eclipse",
      desc: "+60 Atk, -30 Def",
      attr: { atk: 60, def: -30 },
    },
  };

  const relicData = relicMap[activeCombatInstance.baseName];
  if (relicData) {
    const hasRelic = hero.inventory.find((i) => i.id === relicData.id);
    if (!hasRelic) {
      hero.inventory.push({
        id: relicData.id,
        name: `👑 ${relicData.name}`,
        type: "relic",
        rarity: "Lendario",
        desc: `Relíquia de Chefe: ${relicData.desc}. Efeito passivo quando na mochila.`,
        relicBonus: relicData.attr,
      });
      appendTerminalLog(
        `✨ Você obteve a Relíquia Única: ${relicData.name}! Fornecerá poderes passivos na mochila.`,
        "reward",
      );
      if (window.writeAutoDiary) {
        window.writeAutoDiary({
          useAI: true,
          eventType: "relic_found",
          baseText: `O destino sorriu para a carnificina. Encontrei ${relicData.name}, um artefato que vibra com o poder de antigos deuses.`,
          relicName: relicData.name,
        });
      }
    }
  }
}

window.drinkPotionFromCombat = function (type) {
  const h = getActiveHero();
  if (!activeCombatInstance) {
    return;
  }
  if (heroCombatState.potionsUsed >= 2) {
    return triggerToast(
      "🤢 Toxicidade Arcana! Seu corpo rejeita mais poções neste combate.",
    );
  }

  const strType = type === "hp" ? "consumivel_hp" : "consumivel_mp";
  const idx = h.inventory.findIndex(
    (i) => i.type === strType || i.type === "consumivel",
  );
  if (idx > -1) {
    h.inventory.splice(idx, 1);
    heroCombatState.potionsUsed = (heroCombatState.potionsUsed || 0) + 1;

    if (type === "hp") {
      const calc = computeLiveStats();
      let healAmt = calc.maxHp - h.currentHp;
      if (typeof HeroTraits !== "undefined") {
        healAmt = HeroTraits.getHealReceivedMod(h, healAmt);
      }
      h.currentHp = Math.min(calc.maxHp, h.currentHp + Math.floor(healAmt));
      generateFloatingText(200, "heal", "hero");
    } else {
      h.currentMana = computeLiveStats().maxMp;
    }
    appendTerminalLog(
      `O líquido espesso desceu inflamando o corpo. (Toxicidade: ${heroCombatState.potionsUsed}/2)`,
      "system",
    );
    commitStorage();
    renderAllEngines();

    if (h.race === "Humanos" && (heroCombatState.humanPotionCooldown || 0) <= 0) {
       heroCombatState.humanPotionCooldown = 3;
       appendTerminalLog("🧍 BOLSOS OCULTOS! Sua destreza permitiu engolir a poção em um piscar de olhos, ignorando a perda de turno!", "reward");
       return; // Não toma ataque covarde
    }

    setTimeout(() => {
      if (activeCombatInstance) {
        const calc = computeLiveStats();
        const enemyRawDmg = activeCombatInstance.atk;
        const totalDef = calc.defense + (heroCombatState.defBuff || 0);
        let damageTaken = Math.floor(
          Math.max(1, enemyRawDmg - totalDef * 0.6),
        );
        
        if (typeof HeroTraits !== "undefined") {
          damageTaken = HeroTraits.getTakeDamageMod(h, "Físico", damageTaken);
        }

        h.currentHp -= damageTaken;
        runStats.damageTaken = (runStats.damageTaken || 0) + damageTaken;
        triggerDamageVignette(h.currentHp, calc.maxHp);
        appendTerminalLog(
          `🩸 Enquanto você bebia, o ${activeCombatInstance.name} atacou covardemente! Sofreu ${damageTaken} DANO!`,
          "combat",
        );
        triggerScreenShake();

        if (h.currentHp <= 0) {
          handleHeroDeath();
        } else {
          commitStorage();
          renderAllEngines();
        }
      }
    }, 600);
  } else {
    triggerToast(
      "Seu inventário está em chamas... Não há frascos disponíveis!",
    );
  }
};

window.retreatFromFight = function () {
  const hero = getActiveHero();
  // RESTRIÇÃO: Não pode fugir do Guardião/Boss do andar
  if (hero && hero.isFightingGuardian) {
    return triggerToast(
      "☠️ O Guardião bloqueia todas as saídas! Não há como fugir desta luta!",
    );
  }
  activeCombatInstance = null;
  appendTerminalLog(
    "🏃 Covardia Estratégica. Você evadiu pelas sombras e retornou.",
    "story",
  );
  commitStorage();
  renderAllEngines();
};

function addExperience(amount) {
  const hero = getActiveHero();
  if (!hero) {
    return false;
  }

  hero.xp += amount;
  let leveled = false;

  while (hero.xp >= hero.maxXp) {
    hero.xp -= hero.maxXp;
    hero.level++;
    hero.statPoints += 3;
    hero.skillPoints += 2;
    hero.maxXp = Math.floor(hero.maxXp * 1.65);
    leveled = true;
  }

  // Animação de Level Up
  if (leveled) {
    if (window.writeAutoDiary) {
      const levelMsgs = [
        `A essência de sangue corrói minhas veias, mas me fortalece. Nível ${hero.level} atingido.`,
        `Meu corpo mudou. A escuridão deste lugar já não me assusta tanto. Cheguei ao nível de poder ${hero.level}.`,
        `Mais experiente. Mais letal. O nível ${hero.level} me aproxima do meu destino final no Santuário.`,
      ];
      window.writeAutoDiary(levelMsgs[hero.level % levelMsgs.length]);
    }
    const overlay = document.getElementById("levelup-overlay");
    const lvlTxt = document.getElementById("levelup-text");
    const lvlNum = document.getElementById("levelup-new-level");
    if (overlay && lvlTxt) {
      if (lvlNum) {
        lvlNum.innerText = `Nível ${hero.level}`;
      }
      overlay.classList.remove("active");
      lvlTxt.classList.remove("active");
      void overlay.offsetWidth; // force reflow
      overlay.classList.add("active");
      lvlTxt.classList.add("active");
      setTimeout(() => {
        overlay.classList.remove("active");
        lvlTxt.classList.remove("active");
      }, 1900);
    }
    // Toast especial de level up
    const carrier = document.getElementById("toast-carrier");
    const box = document.createElement("div");
    box.className = "toast-box levelup-toast";
    box.innerHTML = `⭐ NÍVEL ${hero.level} ALCANÇADO! +3 Atributos, +2 Habilidades`;
    carrier.appendChild(box);
    setTimeout(() => box.remove(), 5000);
  }

  return leveled;
}

window.useConsumable = function (index) {
  const hero = getActiveHero();
  const item = hero.inventory[index];
  if (!item) {
    return;
  }

  const calc = computeLiveStats();

  if (item.type === "consumivel_hp" || item.type === "consumivel") {
    let rawHeal = item.power || 150;
    if (typeof HeroTraits !== "undefined") {
      rawHeal = HeroTraits.getHealReceivedMod(hero, rawHeal);
    }
    const healed = Math.min(rawHeal, calc.maxHp - hero.currentHp);
    hero.currentHp = Math.min(calc.maxHp, hero.currentHp + rawHeal);
    hero.inventory.splice(index, 1);
    generateFloatingText(healed, "heal", "hero");
    triggerToast(`🩸 ${item.name} consumido! +${healed} HP recuperado.`);
  } else if (item.type === "consumivel_mp") {
    const restored = Math.min(item.power || 100, calc.maxMp - hero.currentMana);
    hero.currentMana = Math.min(
      calc.maxMp,
      hero.currentMana + (item.power || 100),
    );
    hero.inventory.splice(index, 1);
    triggerToast(`🔮 ${item.name} consumido! +${restored} Mana restaurada.`);
  } else {
    triggerToast(`⚠️ ${item.name} não é um consumível.`);
    return;
  }

  commitStorage();
  renderAllEngines();
};

function generateProceduralLoot(dungeonLvl, forceRarity = null, enemy = null) {
  const types = [
    {
      id: "arma",
      names: [
        "Espada",
        "Lâmina",
        "Machado",
        "Montante",
        "Foice",
        "Maça",
        "Katar",
      ],
    },
    {
      id: "capacete",
      names: ["Elmo", "Coroa", "Capuz", "Máscara", "Diadema", "Protetor"],
    },
    {
      id: "armadura",
      names: ["Placa", "Couraça", "Manto", "Veste", "Armadura", "Cota"],
    },
    { id: "luvas", names: ["Manoplas", "Luvas", "Braçadeiras", "Punhos"] },
    { id: "botas", names: ["Botas", "Grevas", "Passos", "Sapatos"] },
    {
      id: "escudo",
      names: ["Escudo", "Égide", "Baluarte", "Broquel", "Defensor"],
    },
    { id: "anel", names: ["Anel", "Selo", "Aliança", "Aro"] },
    { id: "colar", names: ["Amuleto", "Colar", "Pingente", "Talismã"] },
  ];

  const adjectives = [
    "Esquecido(a)",
    "Corrompido(a)",
    "Sanguinário(a)",
    "Imortal",
    "Abissal",
    "Radiante",
    "Sombrio(a)",
    "Profano(a)",
    "Divino(a)",
    "Infernal",
    "do Rei Louco",
    "das Catacumbas",
    "do Arauto",
  ];

  const rarities = [
    { name: "Comum", chance: 45, passives: 0, mult: 1.0 },
    { name: "Incomum", chance: 30, passives: 0, mult: 1.3 },
    { name: "Raro", chance: 15, passives: 1, mult: 1.8 },
    { name: "Epico", chance: 7.5, passives: 2, mult: 2.5 },
    { name: "Lendario", chance: 2.3, passives: 3, mult: 4.0 },
    { name: "Mitico", chance: 0.2, passives: 4, mult: 7.5 },
  ];

  let rObj;
  if (forceRarity) {
    rObj = rarities.find((r) => r.name === forceRarity) || rarities[0];
  } else {
    const roll = Math.random() /* nosonar */ * 100;
    let current = 0;
    for (const r of rarities) {
      current += r.chance;
      if (roll <= current) {
        rObj = r;
        break;
      }
    }
    if (!rObj) {
      rObj = rarities[0];
    }
  }

  const t = types[Math.floor(Math.random() /* nosonar */ * types.length)];
  const baseN =
    t.names[Math.floor(Math.random() /* nosonar */ * t.names.length)];
  const adj =
    adjectives[Math.floor(Math.random() /* nosonar */ * adjectives.length)];

  const powerBase = dungeonLvl * 7 + 20;
  const finalPower = Math.floor(
    powerBase * rObj.mult * (0.8 + Math.random() /* nosonar */ * 0.4),
  );

  let setName = "";
  if (enemy && typeof window !== "undefined") {
     const cleanName = enemy.baseName.replace(/ \[.*\]$/, "");
     if (window.BOSS_SETS && window.BOSS_SETS[cleanName]) {
         setName = window.BOSS_SETS[cleanName].setName;
     } else if (window.ELITE_SETS && window.ELITE_SETS[cleanName]) {
         setName = window.ELITE_SETS[cleanName].setName;
     }
  }
  
  const finalName = setName ? `${baseN} da ${setName}` : `${baseN} ${adj}`;

  const item = {
    id:
      "proc_" +
      Date.now() +
      "_" +
      Math.floor(Math.random() /* nosonar */ * 1000),
    name: finalName,
    type: t.id,
    rarity: rObj.name,
    set: setName || undefined,
    desc: setName ? `Peça do conjunto lendário: ${setName}.` : `Um equipamento imbuído com as energias do andar ${dungeonLvl}.`,
    durability: 100 + Math.floor(dungeonLvl * 2),
    maxDurability: 100 + Math.floor(dungeonLvl * 2),
  };

  if (item.type === "arma") {
    item.damage = finalPower;
  } else if (
    ["capacete", "armadura", "luvas", "botas", "escudo"].includes(item.type)
  ) {
    item.defense = finalPower;
  } else {
    item.power = finalPower;
  }

  if (rObj.passives > 0) {
    const selectedPassives = [];
    const pool = [...ITEM_PASSIVES_POOL];
    for (let i = 0; i < rObj.passives; i++) {
      if (pool.length === 0) {
        break;
      }
      const pIdx = Math.floor(Math.random() /* nosonar */ * pool.length);
      const pass = structuredClone(pool[pIdx]);
      pass.value = pass.value * (rObj.mult * 0.7);

      if (pass.label.includes("%")) {
        pass.label = pass.label.replace(
          /\d+%/,
          Math.round(pass.value * 100) + "%",
        );
      } else if (pass.label.includes("+")) {
        pass.label = pass.label.replace(/\+\d+/, "+" + Math.round(pass.value));
      }
      selectedPassives.push(pass);
      pool.splice(pIdx, 1);
    }
    if (selectedPassives.length > 0) {
      item.intrinsic = selectedPassives[0];
      if (selectedPassives.length > 1) {
        item.bonusPassives = selectedPassives.slice(1);
      }
    }
  }
  return item;
}


// --- COMBAT ENGINE MODULE ---

// ===== Constantes de CSS/IDs reutilizados =====
const CE_CLASS_AVATAR_HIT = "avatar-hit";
const CE_ID_ENEMY_CARD = "enemy-viewport-card";
const CE_ID_ENEMY_NAME = "enemy-display-name";
const CE_CLASS_APPLY_SHAKE = "apply-shake";
const CE_CLASS_CRITICAL_HP = "critical-hp";
const CE_CLASS_FLASH = "flash";

// Mapeamento de nomes de monstros → arquivo de imagem no bestiário
const BESTIARY_IMAGES = {
  "Rato Mutante": "rato_mutante",
  "Esqueleto de Guarda": "esqueleto_guarda",
  "Esqueleto Mago": "esqueleto_mago",
  "Zumbi Pútrido": "zumbi_putrefo",
  "Zumbi Putrefo": "zumbi_putrefo",
  "Roda de Esqueletos": "roda_esqueletos",
  "Morcego Vampiro": "morcego_vampiro",
  "Carrasco Zumbi": "carrasco_zumbi",
  "Rato Tumular": "rato_tumular",
  "Aranha das Criptas": "aranha_criptas",
  "Lodo Carnívoro": "lodo_carnivoro",
  "Dulahn, O Algoz Decapitado": "dulahn_algoz",
  "Cavaleiro do Crisol Decaído": "cavaleiro_crisol",
  "Morte Menor": "morte_menor",
  "Paladino Corrompido": "paladino_corrompido",
  "Amálgama de Ossos": "amalgama_ossos",
  "Lorde Necromante": "lorde_necromante_do_abismo",
  "Lich Desperto do Abismo": "lich_desperto_do_abismo",
  "Sapo Demoníaco": "sapo_demoniaco",
  "Cultista do Lodo": "cultista_do_lodo",
  "Lodo Ácido": "lodo_acido",
  "Corvo da Podridão": "corvo_da_podridao",
  "Sanguessuga Gigante": "sanguessuga_gigante",
  "Verme da Lama": "verme_da_lama",
  "Bruxa Menor do Pântano": "bruxa_menor",
  "Cão Infectado": "cao_infectado",
  "Troll de Podridão": "troll_de_podridao",
  "Árvore Podre Andante": "arvore_podre_andante",
  "Vex, A Bruxa do Pântano": "vex_bruxa",
  "Macaco Guardião Sem Cabeça": "macaco_guardiao",
  "O Omen Caído": "o_omen_caido",
  "Hidra Corrompida": "hidra_corrompida",
  "Senhor da Forja": "o_acougueiro_carniceiro_abissal",
  "Diabrete Ferreiro": "cultista_do_lodo",
  "Elementar de Fogo": "Gemini_Generated_Image_hede2thede2thede",
  "Lagarto de Lava": "sanguessuga_gigante",
  "Lobo de Ruína": "cao_infectado",
  "Leshen Ancião": "arvore_podre_andante",
  "Elemental de Gelo": "Gemini_Generated_Image_hede2thede2thede",
  "Lobo das Estrelas": "morcego_vampiro",
  "Cavaleiro Caído": "o_omen_caido",
  "Sombra Distorcida": "amalgama_ossos",
  "Rei Esqueleto Ancestral": "rei_esqueleto_ancestral_senhor_dos_ossos",
  "Rei de Cristal Estilhaçado": "rei_de_cristal_estilhacado",
  "Artorias, O Corrompido": "artorias_o_corrompido",
  "Belial, Avatar Mentiroso": "belial_avatar_mentiroso",
  "Diablo, O Absoluto": "diablo_o_absoluto_mal_supremo",
  "Priscilla, A Desperta": "priscilla_a_desperta",
  "Senhor do Eclipse Eterno": "senhor_do_eclipse_eterno",
};

function getMonsterImagePath(monsterName) {
  // Tenta match exato primeiro
  if (BESTIARY_IMAGES[monsterName]) {
    return `./bestiary/${BESTIARY_IMAGES[monsterName]}.webp`;
  }

  // Remove possible prefixes and suffixes
  let cleanName = monsterName.replace("☠️ ", "").trim().toLowerCase();
  for (const [key, val] of Object.entries(BESTIARY_IMAGES)) {
    if (cleanName.includes(key.toLowerCase())) {
      return `./bestiary/${val}.webp`;
    }
  }
  return null;
}

function triggerMonsterHit() {
  const enemyImg = document.getElementById("enemy-display-image");
  if (enemyImg) {
    enemyImg.classList.remove(CE_CLASS_AVATAR_HIT);
    void enemyImg.offsetWidth;
    enemyImg.classList.add(CE_CLASS_AVATAR_HIT);
    setTimeout(() => enemyImg.classList.remove(CE_CLASS_AVATAR_HIT), 400);
  }
}


function renderDungeonTab() {
  const hero = getActiveHero();
  const biome = getCurrentBiome();

  const header = document
    .getElementById("dungeon-main-panel")
    .querySelector(".panel-header");
  if (header) {
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
  }
  if (progressText) {
    progressText.innerText = `DISTÂNCIA DA ARENA DO CHEFE: ${expl}%`;
  }
  // ---------------------------------------------------------

  // --- CONTROLE DE ESCADARIAS ---
  const btnDescend = document.getElementById("btn-descend-floor");
  if (btnDescend) {
    if (hero.floorCleared) {
      btnDescend.style.display = "block";
      btnDescend.disabled = false;
      btnDescend.style.boxShadow = "0 0 15px #22c55e";
      btnDescend.innerText = "Descer Escadarias (Liberado!)";
    } else {
      btnDescend.style.display = "none";
      btnDescend.disabled = true;
      btnDescend.style.boxShadow = "none";
      btnDescend.innerText = "Descer Escadarias";
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
    document.getElementById(CE_ID_ENEMY_CARD).classList.add("hidden");
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
  document.getElementById(CE_ID_ENEMY_CARD).classList.remove("hidden");
  document.getElementById(CE_ID_ENEMY_NAME).innerText =
    activeCombatInstance.name +
    (activeCombatInstance.level ? ` (Nv ${activeCombatInstance.level})` : "");

  const enemyImg = document.getElementById("enemy-display-image");
  if (enemyImg) {
    const imgPath = getMonsterImagePath(
      activeCombatInstance.baseName || activeCombatInstance.name,
    );
    if (imgPath) {
      enemyImg.src = imgPath;
      enemyImg.style.display = "inline-block";
    } else {
      enemyImg.style.display = "none";
    }
  }
  document.getElementById("enemy-display-hp-text").innerText =
    `HP Vital Inimigo: ${activeCombatInstance.hp}/${activeCombatInstance.maxHp}`;
  document.getElementById("enemy-display-hp-fill").style.width =
    `${Math.max(0, (activeCombatInstance.hp / activeCombatInstance.maxHp) * 100)}%`;
  document.getElementById("enemy-stats-meta").innerText =
    `Dano de Impacto Bruto Base: ${activeCombatInstance.atk}`;

  // Render Status Effect Tray Enemy
  const tray = document.getElementById("enemy-status-tray");
  tray.innerHTML = "";
  activeCombatInstance.statuses.forEach((st) => {
    let cName = "status-badge ";
    if (st.type === "burn") {
      cName += "status-burn";
    }
    if (st.type === "freeze") {
      cName += "status-freeze";
    }
    if (st.type === "poison") {
      cName += "status-poison";
    }
    if (st.type === "stun") {
      cName += "status-stun";
    }
    if (st.type === "blind") {
      cName += "status-blind";
    }
    tray.innerHTML += `<span class="${cName}" onmouseenter="showStatusTooltip('${st.type}', ${st.duration}, event, ${st.power || 0})" onmouseleave="hideStatusTooltip()">${st.type.toUpperCase()} (${st.duration}t)</span>`;
  });

  // Renderiza Botões de Habilidades do Grimório no Combate Dinamicamente
  const skDeck = document.getElementById("combat-skills-injection-deck");
  skDeck.innerHTML = "";
  let skillIndex = 0;
  MASTER_SKILLS_DATA[hero.class].forEach((sk) => {
    const r = hero.skills[sk.id] || 0;
    if (r > 0 && hero.equippedSkills && hero.equippedSkills.includes(sk.id)) {
      const hotkey = 5 + skillIndex;
      skDeck.innerHTML += `<button class="btn btn-secondary" style="font-size:0.9rem; padding:12px; background: linear-gradient(90deg, #1e1b4b, #050102); text-align:left; letter-spacing:0;" onclick="castCombatSkill('${sk.id}')" onmouseenter="showSkillTooltip(MASTER_SKILLS_DATA['${hero.class}'].find(s=>s.id==='${sk.id}'), event, ${r})" onmouseleave="hideSkillTooltip()"><span class="hotkey-hint">${hotkey}</span> 🔮 ${sk.name} (Rank ${r}) — Exige ${sk.cost} de Reserva Mana</button>`;
      skillIndex++;
    }
  });
}

function moveDungeonFloor(dir) {
  const hero = getActiveHero();
  if (dir !== 1) {
    return;
  } // Só permite descer por esse botão agora
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
  document.getElementById(CE_ID_ENEMY_CARD).classList.add("hidden");
  appendTerminalLog(
    "Você desce as escadarias sombrias. O ar fica mais pesado. Explore o andar para avançar.",
    "system",
  );

  commitStorage();
  renderAllEngines();
}

function exploreCurrentFloor(type = null) {
  const hero = getActiveHero();
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

  if (type === "ELITE") {
    initCombatInstance(false, true); // forceElite = true
  } else if (type === "BOSS") {
    initCombatInstance(true);
  } else {
    initCombatInstance(false);
  }

  commitStorage();
  renderAllEngines();
}

// O Motor das Encruzilhadas do Andar
window.chooseDungeonPath = function (direction) {
  const hero = getActiveHero();
  if (hero.stamina < 2) {
    return triggerToast(
      "Cansaço físico absoluto. Você não tem estamina para explorar. Descanse.",
    );
  }

  hero.stamina -= 2;
  hero.floorExploration = (hero.floorExploration || 0) + 34;
  if (hero.floorExploration > 100) {
    hero.floorExploration = 100;
  }

  // Atualiza a UI da barra
  const bar = document.getElementById("boss-progress-fill");
  const txt = document.getElementById("boss-progress-text");
  if (bar) {
    bar.style.width = hero.floorExploration + "%";
  }
  if (txt) {
    txt.innerText = `DISTÂNCIA DA ARENA DO CHEFE: ${hero.floorExploration}%`;
  }

  const roll = Math.random();
  appendTerminalLog(
    `Você avança cautelosamente pela <strong>${direction}</strong>...`,
    "system",
  );

  // REGRA DE OURO: 100% DE EXPLORAÇÃO INVOCA O GUARDIÃO/BOSS!
  if (hero.floorExploration >= 100 && !hero.floorCleared) {
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
      initCombatInstance(false, true);
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
    commitStorage();
    renderAllEngines();
    return;
  }

  if (direction === "esquerda") {
    if (roll < 0.4) {
      const gold = Math.floor(Math.random() * 100) + hero.dungeonLevel * 10;
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
      const matId = ["ferro", "cobre", "carvao"][Math.floor(Math.random() * 3)];
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

  // Não precisamos mais do bloco redundante de 100% aqui, já foi tratado no início da função.

  commitStorage();
  renderAllEngines();
};

function getCurrentBiome() {
  const hero = getActiveHero();
  // Divide o andar por 5 para achar o índice do bioma (Andares 1-5 = Bioma 0, 6-10 = Bioma 1...)
  let biomeIndex = Math.floor((hero.dungeonLevel - 1) / 5);

  // Se o jogador passar do último bioma criado, mantém o último
  if (biomeIndex >= BIOMES.length) {
    biomeIndex = BIOMES.length - 1;
  }

  return BIOMES[biomeIndex];
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

window.renderBestiaryTab = function () {
  const hero = getActiveHero();
  const mesh = document.getElementById("bestiary-mesh");
  if (!mesh || !hero) {
    return;
  }
  mesh.innerHTML = "";

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

  if (allMonsters.length === 0) {
    mesh.innerHTML = `<p style="color:var(--text-muted); text-align:center; width:100%;">Nenhum monstro catalogado ainda.</p>`;
    return;
  }

  mesh.innerHTML = `<div style="margin-bottom: 18px; color: #f8fafc; font-size: 0.95rem;">Bestiário atualizado para os biomas atuais do jogo. Abates em todos os continentes do Santuário são registrados.</div>`;

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

    mesh.innerHTML += `
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

function applyStatusToEnemy(effectObj, skillDamage) {
  if (!effectObj) {
    return;
  }
  if (effectObj.type === "burn") {
    activeCombatInstance.statuses.push({
      type: "burn",
      duration: effectObj.duration,
      power: Math.floor(skillDamage * effectObj.ratio),
    });
  }
  if (effectObj.type === "poison") {
    activeCombatInstance.statuses.push({
      type: "poison",
      duration: effectObj.duration,
      power: effectObj.power,
    });
  }
  if (
    ["stun", "freeze", "blind"].includes(effectObj.type) &&
    Math.random() < effectObj.chance
  ) {
    activeCombatInstance.statuses.push({
      type: effectObj.type,
      duration: effectObj.duration,
    });
  }
}

// =========================================================================
//  COMBATE ROTINAS E MOTOR DE DANO (VERSÃO CORRIGIDA E COMPLETA)
// =========================================================================



function checkBossPhaseTransition(enemy) {
  if (enemy.isBoss && enemy.phase2 && !enemy.inPhase2) {
    const hpPercent = enemy.currentHp / enemy.maxHp;

    if (hpPercent <= enemy.phase2.threshold) {
      enemy.inPhase2 = true;

      // CORREÇÃO: Aplica o escalonamento do Andar na Fase 2!
      const hero = getActiveHero();
      const scale = 1 + hero.dungeonLevel * 0.15;

      enemy.name = enemy.phase2.name;
      enemy.atk = Math.floor(enemy.phase2.atk * scale);
      enemy.def = Math.floor((enemy.phase2.def || 0) * scale);

      enemy.currentHp += enemy.phase2.healOnTransform;
      if (enemy.currentHp > enemy.maxHp) {
        enemy.currentHp = enemy.maxHp;
      }

      const enemyBoard = document.getElementById(CE_ID_ENEMY_CARD);
      if (enemyBoard) {
        enemyBoard.classList.add("boss-phase-2-active");
      }

      const nameDisplay = document.getElementById(CE_ID_ENEMY_NAME);
      if (nameDisplay) {
        nameDisplay.innerText = enemy.name;
        nameDisplay.classList.add("boss-phase-2-text");
      }

      document.body.classList.add(CE_CLASS_APPLY_SHAKE);
      setTimeout(() => {
        document.body.classList.remove(CE_CLASS_APPLY_SHAKE);
      }, 500);

      appendTerminalLog(`🔥🔥 FASE 2: ${enemy.phase2.message} 🔥🔥`, "status");
    }
  }
}


const DEATH_MESSAGES = [
  "A escuridão consumiu sua alma... mas o Santuário nunca esquece seus caídos.",
  "Suas cinzas se espalharam pelo chão da masmorra. O abismo sorriu.",
  "O frio da morte envolveu seus ossos. Mas as fogueiras ainda queimam.",
  "Seu sangue alimentou as pedras antigas. A masmorra ficou mais forte.",
  "Os corvos cantaram sua derúba. Mas lendas não morrem facilmente.",
  "A lâmina inimiga encontrou seu coração. Mas o Nephalem é eterno.",
  "Seus olhos se fecharam... e quando reabriram, a fogueira ardia.",
  "O chão bebeu seu sangue. O Santuário exige mais de você.",
  "Cada morte é uma lição. Cada retorno, uma oportunidade.",
  "As sombras riram ao ver você cair. Mas você já caiu antes.",
];


window.closeDeath = function () {
  document.getElementById("death-overlay").classList.remove("active");
  if (typeof switchTab === "function") {
    switchTab("tab-town");
  } else if (typeof navigate === "function") {
    navigate("tab-town");
  }
};


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
  if (Math.random() < 0.08) {
    appendTerminalLog(
      "🔪 O PESADELO DESPERTA! Um Caçador das Sombras emboscou você enquanto dormia!",
      "combat",
    );
    triggerScreenShake();
    h.inBossRestArea = false;
    initCombatInstance(false);

    window.combatEngine = {
      executeAction: function (action) {
        if (action === "attack") {
          window.processCombatRound("physical");
        } else if (action === "magic") {
          window.processCombatRound("magic");
        } else if (action === "item") {
          window.processCombatRound("potion_hp");
        } else if (action === "flee") {
          window.retreatFromFight();
          window.closeCombatJRPG();
        }
      },
    };
  }
};

// ==========================================
// MÉTODOS DE COMBO E STATS RECUPERADOS
// ==========================================
window.comboCounter = 0;
window.runStats = {
  monstersKilled: 0,
  damageDealt: 0,
  damageTaken: 0,
  goldEarned: 0,
  maxCombo: 0,
  bestRoll: 0,
};


window.updateComboUI = function () {
  const el = document.getElementById("combo-counter");
  const numEl = document.getElementById("combo-number");
  const multEl = document.getElementById("combo-mult");
  if (!el || !numEl || !multEl) return;

  if (typeof comboCounter === "undefined") window.comboCounter = 0;

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

  if (comboCounter >= 12) {
    numEl.classList.add("combo-fury");
  } else {
    numEl.classList.remove("combo-fury");
  }
};

// ==========================================
// SISTEMA DE VIGNETTE DE DANO (RESTAURADO)
// ==========================================
window.vignetteTimeout = null;

window.triggerDamageVignette = function (currentHp, maxHp) {
  const vig = document.getElementById("damage-vignette");
  if (!vig) {
    return;
  }

  const hpPercent = currentHp / maxHp;

  vig.classList.remove(CE_CLASS_FLASH, CE_CLASS_CRITICAL_HP);
  void vig.offsetWidth;
  vig.classList.add(CE_CLASS_FLASH);

  const avatarImg = document.getElementById("player-avatar-combat-img");
  if (avatarImg) {
    avatarImg.classList.remove(CE_CLASS_AVATAR_HIT);
    void avatarImg.offsetWidth;
    avatarImg.classList.add(CE_CLASS_AVATAR_HIT);
    setTimeout(() => avatarImg.classList.remove(CE_CLASS_AVATAR_HIT), 400);
  }

  clearTimeout(window.vignetteTimeout);
  window.vignetteTimeout = setTimeout(() => {
    vig.classList.remove(CE_CLASS_FLASH);
    if (hpPercent < 0.2) {
      vig.classList.add(CE_CLASS_CRITICAL_HP);
    }
  }, 400);
};

window.clearDamageVignette = function () {
  const vig = document.getElementById("damage-vignette");
  if (vig) {
    vig.classList.remove(CE_CLASS_FLASH, CE_CLASS_CRITICAL_HP);
  }
};
