// =========================================================================
//  ENGINE DE FUSÃO DE HABILIDADES (Integrado ao main_v3.js e skillTree)
// =========================================================================

/**
 * Tenta fundir duas habilidades usando o Herói Ativo e a MASTER_FUSION_RECIPES.
 * @param {string} skillId1 ID da habilidade 1 (ex: 'g1')
 * @param {string} skillId2 ID da habilidade 2 (ex: 'g2')
 * @returns {object} Resultado contendo success (boolean) e message (string).
 */
async function attemptFusion(skillId1, skillId2) {
  if (!appState || appState.activeSlotIndex === null) {
    return { success: false, message: "Nenhum herói ativo." };
  }

  const hero = appState.slots[appState.activeSlotIndex];
  if (!hero || !hero.skills) {
    return {
      success: false,
      message: "Herói não possui árvore de habilidades.",
    };
  }

  // Verifica se o herói possui as duas habilidades (rank > 0)
  if (!hero.skills[skillId1] || hero.skills[skillId1] === 0) {
    return {
      success: false,
      message: `Habilidade base faltando ou no rank 0: ${skillId1}`,
    };
  }
  if (!hero.skills[skillId2] || hero.skills[skillId2] === 0) {
    return {
      success: false,
      message: `Habilidade base faltando ou no rank 0: ${skillId2}`,
    };
  }

  // Normaliza a chave para criar o ID da nova habilidade gerada pela IA
  const sortedIds = [skillId1, skillId2].sort();
  const recipeKey = `${sortedIds[0]}+${sortedIds[1]}`;
  const fusionId = "f_ai_" + recipeKey.replace("+", "_");

  // Verifica se já possui a fusão
  if (hero.skills[fusionId] && hero.skills[fusionId] > 0) {
    return {
      success: false,
      message: "A mente do herói já domina este poder.",
    };
  }

  if (!hero.customFusions) {
    hero.customFusions = {};
  }

  let fusionSkillObj = hero.customFusions[fusionId];

  // Se ainda não gerou essa fusão, invoca a IA
  if (!fusionSkillObj) {
    if (typeof window.fetchDynamicFusion !== "function") {
      return {
        success: false,
        message: "Motor de IA offline. Impossível canalizar novas magias.",
      };
    }

    let className = hero.class === "Bárbaro" ? "Barbaro" : hero.class;
    const s1 = MASTER_SKILLS_DATA[className].find((s) => s.id === skillId1);
    const s2 = MASTER_SKILLS_DATA[className].find((s) => s.id === skillId2);

    if (!s1 || !s2) {
      return { success: false, message: "Erro ao ler as essências originais." };
    }

    let aiResult = await window.fetchDynamicFusion(s1, s2, hero.class);
    if (!aiResult) {
      console.warn(
        "Gemini API falhou (provável limite de cota 429). Acionando Fallback Procedural.",
      );

      // Sorteia um adjetivo criativo e sombrio
      const adjList = [
        "Profano(a)",
        "Amaldiçoado(a)",
        "Abissal",
        "Sombrio(a)",
        "Corrompido(a)",
        "do Eclipse",
        "Macabro(a)",
      ];
      const randAdj = adjList[Math.floor(Math.random() * adjList.length)];

      // Extrai as palavras para tentar formar um nome coerente
      const prefix = s1.name.split(" ")[0] || s1.name;
      const suffixParts = s2.name.split(" ");
      const suffix =
        suffixParts.length > 1 ? suffixParts.slice(1).join(" ") : s2.name;
      let combinedName =
        prefix === suffix ? `${prefix} Aprimorado` : `${prefix} ${suffix}`;
      combinedName = `${combinedName} ${randAdj}`;

      // Combina as descrições mecanicamente
      const desc1 = (s1.desc || "").replace(/\.$/, "");
      const desc2 = (s2.desc || "").replace(/\.$/, "");

      // Herança forte de efeito (cópia profunda para evitar sobrescrita de referências)
      let finalEffect = null;
      if (s1.effect) finalEffect = JSON.parse(JSON.stringify(s1.effect));
      else if (s2.effect) finalEffect = JSON.parse(JSON.stringify(s2.effect));

      aiResult = {
        name: combinedName,
        desc: `União técnica de poderes: ${desc1}, enquanto simultaneamente incorpora as propriedades da segunda base (${desc2}).`,
        passives: `Rank 5 (Herdado): ${s2.passives || "O ataque adquire 20% de chance extra de causar efeitos críticos."}`,
        effect: finalEffect,
      };
    }

    // Calcula matematicamente o custo e o dano
    const mathCost = Math.floor((s1.cost + s2.cost) * 0.7); // 70% da soma do custo
    const mathRatio = parseFloat(((s1.ratio + s2.ratio) * 0.6).toFixed(1)); // 60% da soma do ratio

    fusionSkillObj = {
      id: fusionId,
      name: aiResult.name || "Poder Inominável",
      cost: mathCost,
      ratio: mathRatio,
      stats: s1.stats, // Usa o stats da habilidade 1 como base
      type:
        aiResult.effect?.type === "heal" ||
        aiResult.effect?.type === "regen" ||
        aiResult.effect?.type === "buff_def" ||
        aiResult.effect?.type === "buff_atk"
          ? "suporte"
          : s1.type,
      effect: aiResult.effect,
      desc: aiResult.desc || "Uma técnica profana indescritível.",
      passives: aiResult.passives || "Rank 5: O poder oculto desperta.",
    };

    hero.customFusions[fusionId] = fusionSkillObj;
  }

  // ==========================================
  // SUCESSO! APLICANDO AS MUDANÇAS NO HERÓI
  // ==========================================

  // 1. Destrava na árvore de habilidades
  hero.skills[fusionId] = 1;

  // 2. Injéta dinamicamente no MASTER_SKILLS_DATA para renderização
  let className = hero.class === "Bárbaro" ? "Barbaro" : hero.class;
  const alreadyInjected = MASTER_SKILLS_DATA[className].find(
    (s) => s.id === fusionId,
  );
  if (!alreadyInjected) {
    MASTER_SKILLS_DATA[className].push(fusionSkillObj);
  }

  // Salva o jogo
  if (typeof commitStorage === "function") {
    commitStorage();
  } else if (typeof saveGame === "function") {
    saveGame();
  }

  return {
    success: true,
    message: `Fusão Perfeita! Você despertou: ${fusionSkillObj.name}!`,
    skill: fusionSkillObj,
  };
}

/**
 * Utilitário: Inicializa as habilidades de fusão já destravadas pelo herói
 * Deve ser chamado ao carregar o jogo, para garantir que as fusões estejam no MASTER_SKILLS_DATA
 */
function loadUnlockedFusions(hero) {
  if (!hero || !hero.class || !hero.skills) return;

  let className = hero.class === "Bárbaro" ? "Barbaro" : hero.class;
  const fusionDataList =
    typeof MASTER_FUSION_DATA !== "undefined"
      ? MASTER_FUSION_DATA[className]
      : null;

  for (let skillId in hero.skills) {
    if (hero.skills[skillId] > 0) {
      // Fusão estática antiga
      if (
        skillId.startsWith("f_") &&
        !skillId.startsWith("f_ai_") &&
        fusionDataList
      ) {
        const fusionSkillObj = fusionDataList.find((s) => s.id === skillId);
        if (fusionSkillObj) {
          const alreadyInjected = MASTER_SKILLS_DATA[className].find(
            (s) => s.id === skillId,
          );
          if (!alreadyInjected) {
            MASTER_SKILLS_DATA[className].push(fusionSkillObj);
          }
        }
      }
      // Fusão de IA customizada
      if (
        skillId.startsWith("f_ai_") &&
        hero.customFusions &&
        hero.customFusions[skillId]
      ) {
        const fusionSkillObj = hero.customFusions[skillId];
        const alreadyInjected = MASTER_SKILLS_DATA[className].find(
          (s) => s.id === skillId,
        );
        if (!alreadyInjected) {
          MASTER_SKILLS_DATA[className].push(fusionSkillObj);
        }
      }
    }
  }
}
