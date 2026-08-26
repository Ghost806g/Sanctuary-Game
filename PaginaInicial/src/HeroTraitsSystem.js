// =========================================================================
// SISTEMA DE TRAÇOS DO HERÓI (RAÇAS, CLASSES E PROFISSÕES)
// =========================================================================
/* eslint-disable no-unused-vars */

const HeroTraits = {
  // Helpers
  hasEnemyTag: function(enemy, tag) {
    if (!enemy || !enemy.name) return false;
    const n = enemy.name.toLowerCase();
    if (tag === "morto-vivo") {
      return n.includes("esqueleto") || n.includes("zumbi") || n.includes("morte") || n.includes("coveiro") || n.includes("carniça");
    }
    if (tag === "demonio") {
      return n.includes("demônio") || n.includes("diabólico") || n.includes("infernal") || n.includes("súcubo");
    }
    // Verificações robustas com optional chaining para evitar erros do linter
    if (enemy?.tags) {
      if (Array.isArray(enemy.tags) && enemy.tags.includes(tag)) return true;
      if (Array.isArray(enemy.tags.types) && enemy.tags.types.includes(tag)) return true;
    }
    return false;
  },

  // --- RAÇAS ---
  Races: {
    "Humanos": {},
    "Elfos": {
      evasionMod: (baseEv) => baseEv + 15, // +15% Evasão base (se usa escala 0-100)
      takeDamageMod: (baseDmg, type) => type === "Físico" ? baseDmg * 1.15 : baseDmg, // Ossos frágeis
    },
    "Anões": {
      defenseMod: (baseDef) => baseDef * 1.25,
      takeDamageMod: (baseDmg, type) => type === "Fogo" ? baseDmg * 0.70 : baseDmg,
    },
    "Orcs": {
      canCast: (skill) => skill.type !== "Arcano",
      castErrorMsg: "Orcs não possuem intelecto para magias Arcanas complexas.",
    }
  },

  // --- CLASSES BASE ---
  Classes: {
    "Guerreiro": {},
    "Paladino": {
      damageMod: (baseDmg, enemy, skill) => HeroTraits.hasEnemyTag(enemy, "morto-vivo") || HeroTraits.hasEnemyTag(enemy, "demonio") ? baseDmg * 1.3 : baseDmg
    },
    "Ranger": {},
    "Necromante": {
      takeDamageMod: (baseDmg, type) => type === "Luz" ? baseDmg * 1.5 : baseDmg // Sofre muito dano de Luz
    },
    "Arcanista": {},
    "Bárbaro": {}
  },

  // --- PROFISSÕES (Guerreiro e Paladino) ---
  Professions: {
    // GUERREIRO
    "Ferreiro de Guerra": {},
    "Mercenário": {
      critChanceMod: (baseCrit) => baseCrit + 15,
      healReceivedMod: (baseHeal) => baseHeal * 0.5 // Desprezado pela fé (cura cai pela metade)
    },
    "Mestre das Armas": {
      critChanceMod: (baseCrit) => baseCrit + 10,
    },
    "Vanguarda Sangrenta": {
      evasionMod: (baseEv) => 0 // Evasão nula, absorve no peito
    },
    "Cavaleiro Caído": {},

    // PALADINO
    "Inquisidor do Sol": {
      canCast: (skill) => skill.type !== "Cura" && skill.type !== "Suporte",
      castErrorMsg: "Sua profissão abomina suporte. Purifique-os com o fogo e o aço!",
      damageMod: (baseDmg, enemy, skill) => skill.type === "Luz" ? baseDmg * 1.3 : baseDmg
    },
    "Clérigo de Batalha": {
      healMod: (baseHeal) => baseHeal * 2.0,
      damageMod: (baseDmg, enemy, skill) => baseDmg * 0.5
    },
    "Guardião do Juramento": {
      critChanceMod: (baseCrit) => 0, // Incapacidade total de críticos
      defenseMod: (baseDef) => baseDef * 1.4
    },
    "Templário de Prata": {
      damageMod: (baseDmg, enemy, skill) => HeroTraits.hasEnemyTag(enemy, "morto-vivo") ? baseDmg * 1.6 : baseDmg
    },
    "Exorcista Cego": {
      // Erra frequentemente ataques físicos básicos
      hitChanceMod: (baseHit, skill) => skill.type === "Físico" ? baseHit - 25 : baseHit
    },

    // ARCANISTA
    "Erudito do Vazio": {
      // Bônus permanente de XP e um limite de Mana virtualmente inesgotável. Menor HP base.
      // Modificadores de atributo base devem ser feitos nos atributos ou via buffs; 
      // aqui podemos lidar com danos. Mas HP pode ser via defesa ou multiplicador de dano sofrido se não tivermos HP hook.
      // Para manter simples, vamos aumentar dano recebido um pouco.
      takeDamageMod: (baseDmg, type) => baseDmg * 1.15 
    },
    "Alquimista Louco": {
      // Magias causam dano tóxico residual e dobram eficácia de poções.
      healReceivedMod: (baseHeal) => baseHeal * 2.0, 
      // Conjurador instável; há sempre uma chance da magia explodir.
      postActionHook: (hero, enemy, actionResult) => {
         if (actionResult.type === "skill" && Math.random() < 0.15) {
            const backlash = Math.floor(hero.maxHp * 0.1);
            return { log: `💥 MISTURA INSTÁVEL! A magia explodiu na sua cara! Você perdeu ${backlash} HP.`, damageHero: backlash };
         }
         return null;
      }
    },
    "Tecelão do Caos": {
      // Dano de Magia pode escalar aleatoriamente a números absurdos.
      damageMod: (baseDmg, enemy, skill) => skill.type !== "Físico" ? baseDmg * (0.5 + Math.random() * 1.5) : baseDmg,
      // Resistências Elementais nulas
      takeDamageMod: (baseDmg, type) => type !== "Físico" ? baseDmg * 1.5 : baseDmg
    },
    "Arquivista da Ruína": {
      // Conhecimento inato das fraquezas (Aumento colossal no Dano Crítico Mágico)
      critChanceMod: (baseCrit) => baseCrit + 20, 
      // O multiplicador de crítico idealmente seria hookado, mas podemos aumentar o dano crítico base se houver.
    },
    "Invocador de Cinzas": {
      // Resistência massiva ao fogo
      takeDamageMod: (baseDmg, type) => type === "Fogo" ? baseDmg * 0.2 : baseDmg,
      canCast: (skill) => skill.type !== "Gelo" && skill.type !== "Cura",
      castErrorMsg: "Invocadores de Cinzas não podem usar magias de Gelo ou Cura."
    },

    // RANGER
    "Caçador de Cabeças": {
      // Ignora Defesa Física inimiga e soma força aos disparos
      // Inútil em combates a curta distância
      defenseMod: (baseDef) => baseDef * 0.8 // papel, perde defesa
    },
    "Batedor das Sombras": {
      // A maior Evasão do jogo
      evasionMod: (baseEv) => baseEv + 30,
      // Incapaz de utilizar escudos ou armaduras pesadas
      equipStatsMod: (item, atk, def) => {
        const n = item.name ? item.name.toLowerCase() : "";
        if (n.includes("placa") || n.includes("pesad") || item.type === "shield") {
          return { atk: 0, def: 0 }; // Anula atributos de armadura pesada/escudo
        }
        return { atk, def };
      },
      defenseMod: (baseDef) => baseDef * 0.5 
    },
    "Mestre das Feras": {
      // Alta Constituição natural; sangra adversários. Inteligência baixa (difícil magias)
      canCast: (skill) => skill.type !== "Arcano" && skill.type !== "Profano",
      castErrorMsg: "Sua inteligência é animalesca demais para magias complexas."
    },
    "Franco-Atirador Arcano": {
      // Uso de ataques drena Mana
      // Dano híbrido (se houvesse um hook de custo de mana para ataques básicos)
    },
    "Sobrevivente do Ermo": {
      // Aplica veneno eficientemente. Dano base direto extremamente baixo
      damageMod: (baseDmg, enemy, skill) => skill.type === "Físico" ? baseDmg * 0.5 : baseDmg,
      applyStatusMod: (effectObj) => {
        if (effectObj.type === "poison" || effectObj.type === "bleed") {
           effectObj.duration += 2;
           if (effectObj.power) effectObj.power = Math.floor(effectObj.power * 1.5);
           if (effectObj.chance) effectObj.chance += 0.3;
        }
        return effectObj;
      }
    },

    // BARBARO
    "Executor Bestial": {
      // Dano massivo absoluto
      damageMod: (baseDmg, enemy, skill) => baseDmg * 1.3,
      // Lento. Você sempre ataca por último
      evasionMod: (baseEv) => 0
    },
    "Devorador de Carniças": {
      // Cura absurda (cada monstro morto...). Fraco contra luz.
      takeDamageMod: (baseDmg, type) => type === "Luz" ? baseDmg * 1.5 : baseDmg
    },
    "Gladiador Esquecido": {
      // Combina força bruta com evasão. Armaduras quebram mais rápido
      evasionMod: (baseEv) => baseEv + 15,
      defenseMod: (baseDef) => baseDef * 0.7 
    },
    "Xamã de Sangue": {
      // Dano aumenta drasticamente quanto menos HP
      damageMod: (baseDmg, enemy, skill, hero) => hero && hero.currentHp < hero.maxHp * 0.5 ? baseDmg * 1.5 : baseDmg,
      // Cura de poções tem 50% de eficácia
      healReceivedMod: (baseHeal) => baseHeal * 0.5
    },
    "Quebrador de Crânios": {
      // Precisão terrível
      hitChanceMod: (baseHit, skill) => baseHit - 30
    },

    // NECROMANTE
    "Mestre de Ossos": {
      // Pode ignorar defesas. Vulnerável a Fogo e ataques contundentes.
      takeDamageMod: (baseDmg, type) => type === "Fogo" || type === "Físico" ? baseDmg * 1.3 : baseDmg
    },
    "Sacerdote da Morte": {
      // Transferem HP duplo
      healMod: (baseHeal) => baseHeal * 2.0,
      // Não possui habilidades ofensivas diretas
      canCast: (skill) => skill.type !== "Físico",
      castErrorMsg: "Sacerdotes da Morte não se rebaixam a ataques físicos diretos."
    },
    "Colhedor de Almas": {
      // Recebe grande parte do dano como rebote em si mesmo se não matar
      damageMod: (baseDmg, enemy, skill) => enemy && enemy.currentHp < enemy.maxHp * 0.2 ? baseDmg * 3.0 : baseDmg,
      postActionHook: (hero, enemy, actionResult) => {
         // Se ele atacou e o inimigo NÃO morreu, ele toma rebote.
         if (actionResult.type === "skill" && enemy && enemy.currentHp > 0) {
            const backlash = Math.floor(hero.maxHp * 0.05);
            return { log: `🖤 A Morte exige seu dízimo! Como a vítima sobreviveu, a foice rasgou sua própria alma (-${backlash} HP).`, damageHero: backlash };
         }
         return null;
      }
    },
    "Coveiro Maldito": {
      // Baixa chance de dano Crítico
      critChanceMod: (baseCrit) => 0,
      applyStatusMod: (effectObj) => {
        if (effectObj.type === "poison") {
           effectObj.duration += 3;
           if (effectObj.power) effectObj.power = Math.floor(effectObj.power * 2.0);
        }
        return effectObj;
      }
    },
    "Ocultista Sombrio": {
      // Dano puramente Profano altíssimo. Drena sanidade.
      damageMod: (baseDmg, enemy, skill) => skill.type === "Profano" ? baseDmg * 2.0 : baseDmg,
      takeDamageMod: (baseDmg, type) => baseDmg * 1.2 // Propenso a desastres
    }
  },

  // --- FUNÇÕES DE RESOLUÇÃO (HOOKS) ---
  canCast: function(hero, skill) {
    if (this.Races[hero.race]?.canCast && !this.Races[hero.race].canCast(skill)) {
      return { allowed: false, msg: this.Races[hero.race].castErrorMsg || "Sua Raça não permite essa ação." };
    }
    if (this.Classes[hero.class]?.canCast && !this.Classes[hero.class].canCast(skill)) {
      return { allowed: false, msg: this.Classes[hero.class].castErrorMsg || "Sua Classe não permite essa ação." };
    }
    if (this.Professions[hero.profession]?.canCast && !this.Professions[hero.profession].canCast(skill)) {
      return { allowed: false, msg: this.Professions[hero.profession].castErrorMsg || "Sua Profissão não permite essa ação." };
    }
    return { allowed: true };
  },

  getDamageMod: function(hero, enemy, skill, baseDmg) {
    let finalDmg = baseDmg;
    if (this.Races[hero.race]?.damageMod) finalDmg = this.Races[hero.race].damageMod(finalDmg, enemy, skill, hero);
    if (this.Classes[hero.class]?.damageMod) finalDmg = this.Classes[hero.class].damageMod(finalDmg, enemy, skill, hero);
    if (this.Professions[hero.profession]?.damageMod) finalDmg = this.Professions[hero.profession].damageMod(finalDmg, enemy, skill, hero);
    return finalDmg;
  },

  getHealMod: function(hero, baseHeal) {
    let finalHeal = baseHeal;
    if (this.Races[hero.race]?.healMod) finalHeal = this.Races[hero.race].healMod(finalHeal);
    if (this.Classes[hero.class]?.healMod) finalHeal = this.Classes[hero.class].healMod(finalHeal);
    if (this.Professions[hero.profession]?.healMod) finalHeal = this.Professions[hero.profession].healMod(finalHeal);
    return finalHeal;
  },

  getEquipStatsMod: function(hero, item, atk, def) {
    let res = { atk: atk, def: def };
    if (this.Races[hero.race]?.equipStatsMod) res = this.Races[hero.race].equipStatsMod(item, res.atk, res.def, hero);
    if (this.Classes[hero.class]?.equipStatsMod) res = this.Classes[hero.class].equipStatsMod(item, res.atk, res.def, hero);
    if (this.Professions[hero.profession]?.equipStatsMod) res = this.Professions[hero.profession].equipStatsMod(item, res.atk, res.def, hero);
    return res;
  },

  getHealReceivedMod: function(hero, baseHeal) {
    let finalHeal = baseHeal;
    if (this.Races[hero.race]?.healReceivedMod) finalHeal = this.Races[hero.race].healReceivedMod(finalHeal);
    if (this.Classes[hero.class]?.healReceivedMod) finalHeal = this.Classes[hero.class].healReceivedMod(finalHeal);
    if (this.Professions[hero.profession]?.healReceivedMod) finalHeal = this.Professions[hero.profession].healReceivedMod(finalHeal);
    return finalHeal;
  },

  getDefenseMod: function(hero, baseDef) {
    let finalDef = baseDef;
    if (this.Races[hero.race]?.defenseMod) finalDef = this.Races[hero.race].defenseMod(finalDef);
    if (this.Classes[hero.class]?.defenseMod) finalDef = this.Classes[hero.class].defenseMod(finalDef);
    if (this.Professions[hero.profession]?.defenseMod) finalDef = this.Professions[hero.profession].defenseMod(finalDef);
    return finalDef;
  },

  getEvasionMod: function(hero, baseEv) {
    let finalEv = baseEv;
    if (this.Races[hero.race]?.evasionMod) finalEv = this.Races[hero.race].evasionMod(finalEv);
    if (this.Classes[hero.class]?.evasionMod) finalEv = this.Classes[hero.class].evasionMod(finalEv);
    if (this.Professions[hero.profession]?.evasionMod) finalEv = this.Professions[hero.profession].evasionMod(finalEv);
    return finalEv;
  },

  getCritChanceMod: function(hero, baseCrit) {
    let finalCrit = baseCrit;
    if (this.Races[hero.race]?.critChanceMod) finalCrit = this.Races[hero.race].critChanceMod(finalCrit);
    if (this.Classes[hero.class]?.critChanceMod) finalCrit = this.Classes[hero.class].critChanceMod(finalCrit);
    if (this.Professions[hero.profession]?.critChanceMod) finalCrit = this.Professions[hero.profession].critChanceMod(finalCrit);
    return finalCrit;
  },

  getHitChanceMod: function(hero, skill, baseHit) {
    let finalHit = baseHit;
    if (this.Races[hero.race]?.hitChanceMod) finalHit = this.Races[hero.race].hitChanceMod(finalHit, skill);
    if (this.Classes[hero.class]?.hitChanceMod) finalHit = this.Classes[hero.class].hitChanceMod(finalHit, skill);
    if (this.Professions[hero.profession]?.hitChanceMod) finalHit = this.Professions[hero.profession].hitChanceMod(finalHit, skill);
    return finalHit;
  },

  getTakeDamageMod: function(hero, type, baseDmg) {
    let finalDmg = baseDmg;
    if (this.Races[hero.race]?.takeDamageMod) finalDmg = this.Races[hero.race].takeDamageMod(finalDmg, type);
    if (this.Classes[hero.class]?.takeDamageMod) finalDmg = this.Classes[hero.class].takeDamageMod(finalDmg, type);
    if (this.Professions[hero.profession]?.takeDamageMod) finalDmg = this.Professions[hero.profession].takeDamageMod(finalDmg, type);
    return finalDmg;
  }
};