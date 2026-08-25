const fs = require('fs');

const fusions = `
// =========================================================================
//  SISTEMA DE FUSÃO ACUMULATIVA DE HABILIDADES
// =========================================================================

const MASTER_FUSION_DATA = {
  Guerreiro: [
    {
      id: "f_g12", name: "Impacto Escudeiro Brutal", cost: 25, ratio: 2.0, stats: STAT_FORCA, type: TYPE_FISICO,
      effect: { type: "stun", chance: 0.5, duration: 2 },
      desc: "Um avanço perfurante seguido de uma escudada letal. Ignora defesa parcial e atordoa o inimigo.",
      passives: "Rank 5: Chance de atordoar sobe para 80%."
    },
    {
      id: "f_g23", name: "Fortaleza Viva", cost: 30, ratio: 1.0, stats: STAT_CON, type: TYPE_FISICO,
      effect: { type: "buff_def", value: 50, duration: 3 },
      desc: "Assume uma postura impenetrável e contra-ataca. Grande aumento de defesa.",
      passives: "Rank 5: Ganha imunidade a atordoamentos enquanto a postura durar."
    },
    {
      id: "f_g14", name: "Grito Rasga-Armadura", cost: 20, ratio: 1.2, stats: STAT_FORCA, type: TYPE_FISICO,
      effect: { type: "ignoreDef", value: 0.4 },
      desc: "Um rugido que estilhaça a guarda inimiga junto com um golpe.",
      passives: "Rank 5: Passa a ignorar 70% da defesa."
    },
    {
      id: "f_g45", name: "Fenda Sísmica Ofuscante", cost: 35, ratio: 2.2, stats: STAT_FORCA, type: TYPE_FISICO,
      effect: { type: "blind", chance: 0.6, duration: 2 },
      desc: "Fende o chão com tanta força que detritos ofuscam a visão de todos.",
      passives: "Rank 5: Causa +30% de dano se o alvo ficar cego."
    },
    {
      id: "f_g15", name: "Descent Perfurante", cost: 40, ratio: 2.5, stats: STAT_FORCA, type: TYPE_FISICO,
      effect: { type: "ignoreDef", value: 0.5 },
      desc: "Combina o salto do Fender Solo com a mira do Impacto Perfurante.",
      passives: "Rank 5: Dano crítico garantido se o alvo estiver com defesa reduzida."
    }
  ],
  Arcanista: [
    {
      id: "f_a12", name: "Vórtice de Fogo e Gelo", cost: 35, ratio: 2.2, stats: STAT_INT, type: TYPE_ARCANO,
      effect: { type: "freeze", chance: 0.4, duration: 1 },
      desc: "Funde chamas extremas e gelo permafrost. Causa choque térmico imediato.",
      passives: "Rank 5: Se congelar, queima o alvo ao mesmo tempo (dano extra)."
    },
    {
      id: "f_a13", name: "Plasma Volátil", cost: 40, ratio: 2.5, stats: STAT_INT, type: TYPE_FOGO,
      effect: { type: "burn", duration: 4, ratio: 0.4 },
      desc: "Energiza o fogo com eletricidade. O fogo passa a ser energia pura.",
      passives: "Rank 5: Queimadura dobra de dano se o alvo estiver cego pelo raio."
    },
    {
      id: "f_a24", name: "Barreira de Permafrost", cost: 30, ratio: 0, stats: STAT_INT, type: TYPE_SUPORTE,
      effect: { type: "buff_def", value: 40, duration: 3 },
      desc: "O Escudo de Mana congela. Além da defesa, quem bater sofrerá lentidão ou congelamento.",
      passives: "Rank 5: 30% de chance de congelar o atacante corpo-a-corpo."
    },
    {
      id: "f_a34", name: "Escudo Tesla", cost: 35, ratio: 1.0, stats: STAT_INT, type: TYPE_RAIO,
      effect: { type: "blind", chance: 0.4, duration: 2 },
      desc: "O escudo irradia relâmpagos. Eletrocuta qualquer inimigo próximo.",
      passives: "Rank 5: Reflete 50% do dano recebido como dano de Raio."
    },
    {
      id: "f_a14", name: "Aura de Imolação Arcana", cost: 45, ratio: 1.5, stats: STAT_INT, type: TYPE_FOGO,
      effect: { type: "burn", duration: 5, ratio: 0.3 },
      desc: "Você se torna o epicentro de uma tempestade de chamas protetora.",
      passives: "Rank 5: Ganha imunidade a danos de fogo e gelo enquanto a aura persistir."
    }
  ],
  Ranger: [
    {
      id: "f_r12", name: "Flecha Envenenada Explosiva", cost: 30, ratio: 2.0, stats: STAT_AGI, type: TYPE_FISICO,
      effect: { type: "poison", duration: 3, ratio: 0.3 },
      desc: "Uma flecha que espalha toxinas em área no momento do impacto.",
      passives: "Rank 5: O veneno se espalha para os monstros adjacentes."
    },
    {
      id: "f_r23", name: "Disparo Penetrante Venenoso", cost: 35, ratio: 2.4, stats: STAT_AGI, type: TYPE_FISICO,
      effect: { type: "ignoreDef", value: 0.4 },
      desc: "Flecha veloz que atravessa armaduras para injetar peçonha.",
      passives: "Rank 5: 100% de chance de acerto crítico contra alvos envenenados."
    },
    {
      id: "f_r34", name: "Armadilha de Espinhos Mortais", cost: 25, ratio: 1.5, stats: STAT_AGI, type: TYPE_FISICO,
      effect: { type: "stun", chance: 0.6, duration: 2 },
      desc: "Uma arapuca que além de imobilizar, causa um intenso sangramento.",
      passives: "Rank 5: O atordoamento dura 1 turno a mais."
    },
    {
      id: "f_r14", name: "Chuva de Armadilhas", cost: 40, ratio: 1.8, stats: STAT_AGI, type: TYPE_FISICO,
      effect: { type: "stun", chance: 0.4, duration: 1 },
      desc: "Dispara redes e espinhos pelo ar que prendem todo o campo.",
      passives: "Rank 5: Aumenta a velocidade (AGI) do herói em 20% ao conjurar."
    },
    {
      id: "f_r25", name: "Tiro Fantasma", cost: 45, ratio: 3.0, stats: STAT_AGI, type: TYPE_FISICO,
      effect: { type: "blind", chance: 0.5, duration: 1 },
      desc: "O arqueiro desaparece momentaneamente e dispara do ponto cego do inimigo.",
      passives: "Rank 5: Invulnerável no turno de uso."
    }
  ],
  Barbaro: [
    {
      id: "f_b12", name: "Golpe Hemorrágico Devastador", cost: 35, ratio: 2.5, stats: STAT_FORCA, type: TYPE_FISICO,
      effect: { type: "bleed", duration: 4, ratio: 0.5 },
      desc: "Um corte tão profundo que a hemorragia é praticamente fatal.",
      passives: "Rank 5: O dano de sangramento ignora todas as resistências."
    },
    {
      id: "f_b23", name: "Frenesi do Sanguinário", cost: 40, ratio: 1.5, stats: STAT_FORCA, type: TYPE_FISICO,
      effect: { type: "buff_atk", value: 40, duration: 3 },
      desc: "Entra num estado de loucura, aumentando o ataque quanto mais sangra o inimigo.",
      passives: "Rank 5: Rouba 20% da vida de todo o dano causado sob frenesi."
    },
    {
      id: "f_b34", name: "Grito de Guerra Ensurdecedor", cost: 25, ratio: 0, stats: STAT_FORCA, type: TYPE_SUPORTE,
      effect: { type: "stun", chance: 0.7, duration: 1 },
      desc: "Rugido gutural que paralisa todos de medo.",
      passives: "Rank 5: Diminui a defesa do inimigo atordoado em 30%."
    },
    {
      id: "f_b14", name: "Terremoto Bárbaro", cost: 45, ratio: 2.8, stats: STAT_FORCA, type: TYPE_FISICO,
      effect: { type: "stun", chance: 0.5, duration: 1 },
      desc: "Esmaga o solo liberando toda a raiva acumulada.",
      passives: "Rank 5: O dano base dobra se o Herói estiver com menos de 30% de HP."
    },
    {
      id: "f_b25", name: "Carnificina Giratória", cost: 50, ratio: 3.2, stats: STAT_FORCA, type: TYPE_FISICO,
      effect: { type: "bleed", duration: 3, ratio: 0.3 },
      desc: "Gira com as armas espalhando destruição e sangue para todos os lados.",
      passives: "Rank 5: Chance de acerto crítico aumentada em 50% durante a execução."
    }
  ],
  Paladino: [
    {
      id: "f_p12", name: "Julgamento Divino", cost: 35, ratio: 2.2, stats: STAT_SAB, type: TYPE_SAGRADO,
      effect: { type: "stun", chance: 0.4, duration: 1 },
      desc: "A luz celestial não apenas queima os ímpios, mas também os pune com imobilização.",
      passives: "Rank 5: O atordoamento não pode ser resistido por mortos-vivos ou demônios."
    },
    {
      id: "f_p23", name: "Escudo do Mártir", cost: 40, ratio: 1.0, stats: STAT_CON, type: TYPE_SAGRADO,
      effect: { type: "buff_def", value: 60, duration: 3 },
      desc: "Uma aura dourada intransponível. Cura ferimentos menores ao absorver golpes.",
      passives: "Rank 5: Absorve 100% de um ataque letal, deixando o Paladino com 1 HP (uma vez)."
    },
    {
      id: "f_p34", name: "Consagração Curativa", cost: 45, ratio: 0, stats: STAT_SAB, type: TYPE_SUPORTE,
      effect: { type: "regen", value: 50, duration: 4 },
      desc: "Santifica o chão, curando o herói e seus aliados massivamente.",
      passives: "Rank 5: Aumenta a defesa máxima de todos que pisam no solo consagrado."
    },
    {
      id: "f_p14", name: "Lâmina da Redenção", cost: 35, ratio: 2.5, stats: STAT_FORCA, type: TYPE_SAGRADO,
      effect: { type: "ignoreDef", value: 0.3 },
      desc: "Um corte imbuído com poder sagrado e que rasga armaduras corruptas.",
      passives: "Rank 5: Concede um pequeno escudo (20% do dano) ao atacante."
    },
    {
      id: "f_p25", name: "Fúria dos Céus", cost: 55, ratio: 3.5, stats: STAT_SAB, type: TYPE_SAGRADO,
      effect: { type: "blind", chance: 0.8, duration: 2 },
      desc: "Invoca um pilar de luz avassalador.",
      passives: "Rank 5: Reduz em 50% todo o dano sagrado recebido no próximo turno."
    }
  ],
  Necromante: [
    {
      id: "f_n12", name: "Explosão de Ossos Pestilenta", cost: 35, ratio: 2.0, stats: STAT_INT, type: TYPE_SOMBRIO,
      effect: { type: "poison", duration: 4, ratio: 0.3 },
      desc: "Ossos infundidos com peste explodem liberando miasma no inimigo.",
      passives: "Rank 5: A duração do veneno sobe para 6 turnos."
    },
    {
      id: "f_n23", name: "Foice de Drenar Almas", cost: 40, ratio: 2.5, stats: STAT_INT, type: TYPE_SOMBRIO,
      effect: { type: "regen", value: 40, duration: 1 },
      desc: "Cortar a essência inimiga não só machuca, como regenera a vida do lançador rapidamente.",
      passives: "Rank 5: Cura equivale a 50% do dano causado."
    },
    {
      id: "f_n34", name: "Muralha de Cadáveres", cost: 45, ratio: 1.0, stats: STAT_INT, type: TYPE_SUPORTE,
      effect: { type: "buff_def", value: 50, duration: 4 },
      desc: "Levanta um muro profano para se esconder e absorver impacto.",
      passives: "Rank 5: Atacantes corpo-a-corpo sofrem dano de espinhos profanos."
    },
    {
      id: "f_n14", name: "Tempestade de Almas", cost: 55, ratio: 3.0, stats: STAT_INT, type: TYPE_SOMBRIO,
      effect: { type: "blind", chance: 0.6, duration: 2 },
      desc: "Centenas de espíritos rasgam o alvo, deixando-o desorientado e ferido.",
      passives: "Rank 5: Reduz permanentemente 10% do ataque do inimigo afetado."
    },
    {
      id: "f_n25", name: "Maldição Pura", cost: 30, ratio: 0, stats: STAT_INT, type: TYPE_SUPORTE,
      effect: { type: "ignoreDef", value: 1.0 }, // Remove armor
      desc: "Apodrece a armadura e proteção mágica do inimigo, reduzindo-a a zero momentaneamente.",
      passives: "Rank 5: A maldição também drena a regeneração natural do monstro."
    }
  ]
};

const MASTER_FUSION_RECIPES = {
  // Guerreiro
  "g1+g2": "f_g12", "g2+g3": "f_g23", "g1+g4": "f_g14", "g4+g5": "f_g45", "g1+g5": "f_g15",
  // Arcanista
  "a1+a2": "f_a12", "a1+a3": "f_a13", "a2+a4": "f_a24", "a3+a4": "f_a34", "a1+a4": "f_a14",
  // Ranger
  "r1+r2": "f_r12", "r2+r3": "f_r23", "r3+r4": "f_r34", "r1+r4": "f_r14", "r2+r5": "f_r25",
  // Bárbaro
  "b1+b2": "f_b12", "b2+b3": "f_b23", "b3+b4": "f_b34", "b1+b4": "f_b14", "b2+b5": "f_b25",
  // Paladino
  "p1+p2": "f_p12", "p2+p3": "f_p23", "p3+p4": "f_p34", "p1+p4": "f_p14", "p2+p5": "f_p25",
  // Necromante
  "n1+n2": "f_n12", "n2+n3": "f_n23", "n3+n4": "f_n34", "n1+n4": "f_n14", "n2+n5": "f_n25"
};
`;

const filepath = 'd:/SANCTUARY_Tauri_Nova/PaginaInicial/src/database.js';
fs.appendFileSync(filepath, fusions, 'utf8');
console.log("Fusion Data Appended");
