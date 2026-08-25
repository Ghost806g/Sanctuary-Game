/**
 * SISTEMA DE FUSÃO ACUMULATIVA DE HABILIDADES
 * Autor: Antigravity
 *
 * Esse script contém a lógica central para desbloquear novas habilidades
 * baseadas na combinação de habilidades já existentes, mantendo as antigas.
 */

export const SkillsDB = {
  // === HABILIDADES BASE (Tier 1) ===
  fireball: {
    id: "fireball",
    name: "Bola de Fogo",
    type: "base",
    damage: 15,
    manaCost: 5,
    description: "Lança uma esfera de chamas que queima o inimigo.",
  },
  dash: {
    id: "dash",
    name: "Investida",
    type: "base",
    damage: 0,
    manaCost: 10,
    description: "Um avanço rápido para reposicionamento ou fuga.",
  },
  shield: {
    id: "shield",
    name: "Escudo Arcano",
    type: "base",
    damage: 0,
    manaCost: 15,
    description: "Cria uma barreira mágica que absorve dano.",
  },

  // === HABILIDADES FUNDIDAS (Tier 2) ===
  flaming_dash: {
    id: "flaming_dash",
    name: "Investida Flamejante",
    type: "fusion",
    damage: 25,
    manaCost: 20,
    description: "Avança deixando um rastro de fogo e causando dano.",
  },
  fire_shield: {
    id: "fire_shield",
    name: "Escudo de Chamas",
    type: "fusion",
    damage: 10,
    manaCost: 25,
    description: "Um escudo que absorve dano e queima atacantes corpo-a-corpo.",
  },
};

// Receitas: A chave é a junção dos IDs em ordem alfabética.
export const SkillRecipes = {
  "dash+fireball": "flaming_dash",
  "fireball+shield": "fire_shield",
};

/**
 * Função para fundir duas habilidades.
 * @param {string} skillId1 - ID da primeira habilidade
 * @param {string} skillId2 - ID da segunda habilidade
 * @param {object} playerState - Estado do jogador, deve conter um array 'unlockedSkills'
 * @returns {object} Resultado da operação (success, message, newSkill)
 */
export function combineSkills(skillId1, skillId2, playerState) {
  // 1. Normalizar as chaves (ordem alfabética para evitar falha de ordem)
  const sortedIds = [skillId1, skillId2].sort();
  const recipeKey = `${sortedIds[0]}+${sortedIds[1]}`;

  // 2. Checar se a receita existe
  const resultSkillId = SkillRecipes[recipeKey];

  if (resultSkillId) {
    // 3. Checar se o jogador já tem essa habilidade (evita duplicatas)
    if (!playerState.unlockedSkills.includes(resultSkillId)) {
      // REGRA DE OURO: Adicionar a nova, preservando as antigas!
      playerState.unlockedSkills.push(resultSkillId);
      const newSkill = SkillsDB[resultSkillId];
      return {
        success: true,
        message: `Fusão de Sucesso! Você aprendeu a habilidade: ${newSkill.name}!`,
        newSkill: newSkill,
      };
    } else {
      return {
        success: false,
        message: "Você já conhece essa combinação.",
        newSkill: null,
      };
    }
  } else {
    return {
      success: false,
      message: "Essas habilidades não reagem entre si. Tente outra combinação.",
      newSkill: null,
    };
  }
}
