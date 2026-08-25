const ALL_MATERIALS = [
  {
    id: "ferro",
    name: "Ferro Bruto",
    color: "#9ca3af",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon1.webp",
  },
  {
    id: "cobre",
    name: "Cobre Oxidado",
    color: "#b45309",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon2.webp",
  },
  {
    id: "carvao",
    name: "Carvão Mineral",
    color: "#333",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon3.webp",
  },
  {
    id: "couro",
    name: "Couro Esfolado",
    color: "#78350f",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon4.webp",
  },
  {
    id: "prata",
    name: "Prata Pura",
    color: "#e2e8f0",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon5.webp",
  },
  {
    id: "ouro_bruto",
    name: "Ouro Bruto",
    color: "#fbbf24",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon6.webp",
  },
  {
    id: "quartzo",
    name: "Quartzo Arcano",
    color: "#fbcfe8",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon7.webp",
  },
  {
    id: "escamas",
    name: "Escamas de Réptil",
    color: "#10b981",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon8.webp",
  },
  {
    id: "mithril",
    name: "Mithril Leve",
    color: "#38bdf8",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon9.webp",
  },
  {
    id: "esmeralda",
    name: "Esmeralda Polida",
    color: "#34d399",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon10.webp",
  },
  {
    id: "rubi",
    name: "Rubi de Sangue",
    color: "#ef4444",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon11.webp",
  },
  {
    id: "pano_espectral",
    name: "Pano Espectral",
    color: "#c084fc",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon12.webp",
  },
  {
    id: "adamantium",
    name: "Adamantium",
    color: "#f43f5e",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon13.webp",
  },
  {
    id: "platina",
    name: "Platina Maciça",
    color: "#cbd5e1",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon14.webp",
  },
  {
    id: "diamante",
    name: "Diamante Perfeito",
    color: "#e0f2fe",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon15.webp",
  },
  {
    id: "chifre_demoniaco",
    name: "Chifre Demoníaco",
    color: "#b91c1c",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon16.webp",
  },
  {
    id: "essencia_menor",
    name: "Essênci Menor",
    color: "#ddd6fe",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon17.webp",
  },
  {
    id: "essencia_maior",
    name: "Essênci Maior",
    color: "#c084fc",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon18.webp",
  },
  {
    id: "essencia_epica",
    name: "Essênci Épica",
    color: "#a855f7",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon19.webp",
  },
  {
    id: "lagrima_divina",
    name: "Lágrima Divina",
    color: "#fef08a",
    icon: "assets/images/items/minerals/PNG/Transperent/Icon20.webp",
  },
];

// ====================== BOSS SETS (CONJUNTOS ELITE) ======================
window.BOSS_SETS = {
  "Hidra Corrompida": {
     setName: "Escamas da Hidra",
     passives: [
       { req: 2, label: "Pele Escamosa", desc: "+20% de HP Máximo", type: "hpMult", value: 0.2 },
       { req: 4, label: "Coração da Hidra", desc: "Regenera 3% do HP ao fim do turno, mas sofre 2x de dano de Fogo", type: "epic_troll_heart", value: 1 }
     ]
  },
  "Illfang, o Rei Kobold": {
     setName: "Herança de Illfang",
     passives: [
       { req: 2, label: "Reflexos do Rei", desc: "+15% Evasão Focada", type: "evasion", value: 0.15 },
       { req: 4, label: "Carapaça Peçonhenta", desc: "Ao sofrer dano físico, inflige veneno severo no atacante", type: "epic_poison_shell", value: 1 }
     ]
  },
  "Lorde Necromante": {
     setName: "Veste da Morte Inevitável",
     passives: [
       { req: 2, label: "Força Profana", desc: "+20% Ataque Bruto", type: "atkMult", value: 0.2 },
       { req: 4, label: "Carrasco Impiedoso", desc: "Ignora 100% da Armadura de inimigos com < 30% HP", type: "epic_executioner", value: 1 }
     ]
  },
  "The Gleam Eyes": {
     setName: "Fúria do Demônio",
     passives: [
       { req: 2, label: "Gula Demoníaca", desc: "+10% Roubo de Vida", type: "lifeSteal", value: 0.10 },
       { req: 4, label: "Frenesi de Sangue", desc: "Críticos curam 5% do HP e dão +10% de Ataque", type: "epic_blood_frenzy", value: 1 }
     ]
  }
};

const BIOME_CATACUMBAS = "Catacumbas Sombrias";
const BIOME_PANTANO = "Pântano de Peste";
const BIOME_MAGMA = "Cavernas de Magma";
const BIOME_CRISTAL = "Abismo de Cristal";
const SKILL_SEDE_DE_SANGUE = "Sede de Sangue";

const MEMORY_FRAGMENT_POOL = [
  {
    id: "frag_catacumbas_1",
    chapters: "catacumbas",
    biome: BIOME_CATACUMBAS,
    name: "Página Rasgada: O Ritual",
    desc: "Uma pedaço de pergaminho queimados descrevendo uma ritual antigos nas catacumbas.",
  },
  {
    id: "frag_catacumbas_2",
    chapters: "catacumbas",
    biome: BIOME_CATACUMBAS,
    name: "Página Rasgada: A Vigília",
    desc: "Notas de vigília que descrevem monstros ancestrais à espreita nos corredores.",
  },
  {
    id: "frag_catacumbas_3",
    chapters: "catacumbas",
    biome: BIOME_CATACUMBAS,
    name: "Página Rasgada: A Oração",
    desc: "Uma canto roto que revela segredos dos culto dos Senhor dos Ossos.",
  },
  {
    id: "frag_pantano_1",
    chapters: "pantano",
    biome: BIOME_PANTANO,
    name: "Diário Ensanguentado: Ve",
    desc: "Notas de uma caçador sobre  bruxa Ve e seus encantamentos de lama.",
  },
  {
    id: "frag_pantano_2",
    chapters: "pantano",
    biome: BIOME_PANTANO,
    name: "Diário Ensanguentado: A Névoa",
    desc: "Entradas sobre o miasmas dos pântanos e as feras escondidas n lama.",
  },
  {
    id: "frag_pantano_3",
    chapters: "pantano",
    biome: BIOME_PANTANO,
    name: "Diário Ensanguentado: O Coração dos Lodo",
    desc: "Passagens que descrevem  origem corrupta das criaturas de lama.",
  },
  {
    id: "frag_magma_1",
    chapters: "magma",
    biome: BIOME_MAGMA,
    name: "Fragmentos de Memórias: Calor",
    desc: "Palavras manchadas de sangue que falam de uma forjas ancestral e seus horrores.",
  },
  {
    id: "frag_magma_2",
    chapters: "magma",
    biome: BIOME_MAGMA,
    name: "Fragmentos de Memórias: O Ferreiro",
    desc: "Uma registros sobre uma senhor de forjas que dominava chamas vivas.",
  },
  {
    id: "frag_magma_3",
    chapters: "magma",
    biome: BIOME_MAGMA,
    name: "Fragmentos de Memórias: A Lava",
    desc: "Uma relato sobre florestas de fogo e monstros feitos de magma.",
  },
  {
    id: "frag_cristal_1",
    chapters: "cristal",
    biome: BIOME_CRISTAL,
    name: "Carta Congelada: O Dragão",
    desc: "Uma carta lacrada com gelo que menciona o Dragão Branco e seus juramentos.",
  },
  {
    id: "frag_cristal_2",
    chapters: "cristal",
    biome: BIOME_CRISTAL,
    name: "Carta Congelada: Os Cristais",
    desc: "Fragmentos de uma carta descrevendo cristais que roubam calor e memórias.",
  },
  {
    id: "frag_cristal_3",
    chapters: "cristal",
    biome: BIOME_CRISTAL,
    name: "Carta Congelada: O Altar",
    desc: "Uma registros de uma altar ancestral onde  histórias dos Santuário foi selada.",
  },
];

// ====================== BOSS SETS (CONJUNTOS ELITE) ======================
window.BOSS_SETS = {
  "Hidra Corrompida": {
     setName: "Escamas da Hidra",
     passives: [
       { req: 2, label: "Pele Escamosa", desc: "+20% de HP Máximo", type: "hpMult", value: 0.2 },
       { req: 4, label: "Coração da Hidra", desc: "Regenera 3% do HP ao fim do turno, mas sofre 2x de dano de Fogo", type: "epic_troll_heart", value: 1 }
     ]
  },
  "Illfang, o Rei Kobold": {
     setName: "Herança de Illfang",
     passives: [
       { req: 2, label: "Reflexos do Rei", desc: "+15% Evasão Focada", type: "evasion", value: 0.15 },
       { req: 4, label: "Carapaça Peçonhenta", desc: "Ao sofrer dano físico, inflige veneno severo no atacante", type: "epic_poison_shell", value: 1 }
     ]
  },
  "Lorde Necromante": {
     setName: "Veste da Morte Inevitável",
     passives: [
       { req: 2, label: "Força Profana", desc: "+20% Ataque Bruto", type: "atkMult", value: 0.2 },
       { req: 4, label: "Carrasco Impiedoso", desc: "Ignora 100% da Armadura de inimigos com < 30% HP", type: "epic_executioner", value: 1 }
     ]
  },
  "The Gleam Eyes": {
     setName: "Fúria do Demônio",
     passives: [
       { req: 2, label: "Gula Demoníaca", desc: "+10% Roubo de Vida", type: "lifeSteal", value: 0.10 },
       { req: 4, label: "Frenesi de Sangue", desc: "Críticos curam 5% do HP e dão +10% de Ataque", type: "epic_blood_frenzy", value: 1 }
     ]
  }
};

// Passivas únicas Fornecidas por Companheiros
const COMPANION_PASSIVES = [
  {
    id: "cp_crit",
    name: "Foco dos Atirador",
    desc: "+10% Chance Crítica Global",
    buff: { critChance: 0.1 },
  },
  {
    id: "cp_def",
    name: "Guardião de Escudo",
    desc: "+20% Defesa Total",
    buff: { defMult: 0.2 },
  },
  {
    id: "cp_heal",
    name: "Aura de Sacerdotisa",
    desc: "Regenera 5% HP por turnos de combates",
    buff: { regenHp: 0.05 },
  },
  {
    id: "cp_dmg",
    name: SKILL_SEDE_DE_SANGUE,
    desc: "+15% Dano Final Bruto",
    buff: { dmgMult: 0.15 },
  },
  // Tarot Passives
  {
    id: "cp_tarot_0",
    name: "Passos Imprudentes",
    desc: "+25% de Esquiva, mas perde 2% Max HP por turno.",
    buff: { dodgeMult: 0.25, hpDrain: 0.02 },
  },
  {
    id: "cp_tarot_1",
    name: "Mestria Arcana",
    desc: "-30% Custo de Mana.",
    buff: { manaCostMult: -0.3 },
  },
  {
    id: "cp_tarot_4",
    name: "Autoridade Implacável",
    desc: "+25% Defesa Global e +10% HP Máximo.",
    buff: { defMult: 0.25, hpMult: 0.1 },
  },
  {
    id: "cp_tarot_7",
    name: "Ímpeto Vanguardista",
    desc: "+50% Dano Crítico e +1 Ação no 1º turno.",
    buff: { critDmgMult: 0.5, firstTurnAction: 1 },
  },
  {
    id: "cp_tarot_9",
    name: "Isolamento Curativo",
    desc: "Regenera 10% HP ao descansar no Acampamento.",
    buff: { restRegenMult: 0.1 },
  },
  {
    id: "cp_tarot_13",
    name: "Colheita Inevitável",
    desc: "+40% Dano em inimigos com < 30% HP.",
    buff: { executeDmgMult: 0.4 },
  },
  {
    id: "cp_tarot_15",
    name: "Pacto de Sangue",
    desc: "15% Roubo de Vida. Drena 5% do HP do Herói no início da Batalha.",
    buff: { lifesteal: 0.15, battleStartDrain: 0.05 },
  },
  {
    id: "cp_tarot_16",
    name: "Ruína e Proteção",
    desc: "Garante 1 Ponto de Proteção (Absorve o primeiro golpe fatal).",
    buff: { cheatDeath: 1 },
  },
  {
    id: "cp_tarot_21",
    name: "Harmonia Cósmica",
    desc: "Aumenta todos os Status Base em 10%.",
    buff: { allStatsMult: 0.1 },
  },
];

// ====================== BOSS SETS (CONJUNTOS ELITE) ======================
window.BOSS_SETS = {
  "Hidra Corrompida": {
     setName: "Escamas da Hidra",
     passives: [
       { req: 2, label: "Pele Escamosa", desc: "+20% de HP Máximo", type: "hpMult", value: 0.2 },
       { req: 4, label: "Coração da Hidra", desc: "Regenera 3% do HP ao fim do turno, mas sofre 2x de dano de Fogo", type: "epic_troll_heart", value: 1 }
     ]
  },
  "Illfang, o Rei Kobold": {
     setName: "Herança de Illfang",
     passives: [
       { req: 2, label: "Reflexos do Rei", desc: "+15% Evasão Focada", type: "evasion", value: 0.15 },
       { req: 4, label: "Carapaça Peçonhenta", desc: "Ao sofrer dano físico, inflige veneno severo no atacante", type: "epic_poison_shell", value: 1 }
     ]
  },
  "Lorde Necromante": {
     setName: "Veste da Morte Inevitável",
     passives: [
       { req: 2, label: "Força Profana", desc: "+20% Ataque Bruto", type: "atkMult", value: 0.2 },
       { req: 4, label: "Carrasco Impiedoso", desc: "Ignora 100% da Armadura de inimigos com < 30% HP", type: "epic_executioner", value: 1 }
     ]
  },
  "The Gleam Eyes": {
     setName: "Fúria do Demônio",
     passives: [
       { req: 2, label: "Gula Demoníaca", desc: "+10% Roubo de Vida", type: "lifeSteal", value: 0.10 },
       { req: 4, label: "Frenesi de Sangue", desc: "Críticos curam 5% do HP e dão +10% de Ataque", type: "epic_blood_frenzy", value: 1 }
     ]
  }
};

const COMPANION_GATCHA_POOL = [
  {
    id: "comp_fool",
    name: "Zephyr, O Louco",
    desc: "Sua sorte é lendária, mas sua imprudência é fatal.",
    passiveId: "cp_tarot_0",
    rarity: "epic",
    baseAffinity: 1,
    avatar: "assets/zephyr.webp",
    arcana: 0,
  },
  {
    id: "comp_magician",
    name: "Kael'thas, O Mago",
    desc: "Manipulador das energias etéreas. Reduz custos arcanos.",
    passiveId: "cp_tarot_1",
    rarity: "rare",
    baseAffinity: 1,
    avatar: "assets/kaelthas.webp",
    arcana: 1,
  },
  {
    id: "comp_emperor",
    name: "Tiberius, O Imperador",
    desc: "Senhor da guerra. Sua mera presença endurece as armaduras.",
    passiveId: "cp_tarot_4",
    rarity: "epic",
    baseAffinity: 1,
    avatar: "assets/tiberius.webp",
    arcana: 4,
  },
  {
    id: "comp_chariot",
    name: "Viktoria, A Carruagem",
    desc: "A vanguarda destrutiva. Perfeita para finalizar combates.",
    passiveId: "cp_tarot_7",
    rarity: "rare",
    baseAffinity: 1,
    avatar: "assets/viktoria.webp",
    arcana: 7,
  },
  {
    id: "comp_hermit",
    name: "Ancião Wu, O Eremita",
    desc: "Sabedoria ancestral focada na sobrevivência fora dos combates.",
    passiveId: "cp_tarot_9",
    rarity: "common",
    baseAffinity: 1,
    avatar: "assets/anciaowu.webp",
    arcana: 9,
  },
  {
    id: "comp_death",
    name: "Malthael, A Morte",
    desc: "O Carrasco Sombrio. Quando o inimigo fraqueja, sua foice finaliza.",
    passiveId: "cp_tarot_13",
    rarity: "legendary",
    baseAffinity: 1,
    avatar: "assets/malthael.webp",
    arcana: 13,
  },
  {
    id: "comp_devil",
    name: "Lilith, O Diabo",
    desc: "Cura através do sangue derramado, mas o custo é seu próprio sofrimento.",
    passiveId: "cp_tarot_15",
    rarity: "epic",
    baseAffinity: 1,
    avatar: "assets/lilith.webp",
    arcana: 15,
  },
  {
    id: "comp_tower",
    name: "Goliath, A Torre",
    desc: "Um colosso de pedra. Ele suportará o que o herói não puder.",
    passiveId: "cp_tarot_16",
    rarity: "legendary",
    baseAffinity: 1,
    avatar: "assets/goliath.webp",
    arcana: 16,
  },
  {
    id: "comp_world",
    name: "Aethelgard, O Mundo",
    desc: "A entidade cósmica suprema. O pináculo da harmonia do universo.",
    passiveId: "cp_tarot_21",
    rarity: "mythic",
    baseAffinity: 1,
    avatar: "assets/aethelgard.webp",
    arcana: 21,
  },
  {
    id: "comp_lyra",
    name: "Lyra, a Silenciosa",
    desc: "Assassina ágil com grande chance de causar ferimentos letais.",
    passiveId: "cp_crit",
    rarity: "epic",
    baseAffinity: 1,
    avatar: "assets/lyra.webp",
    arcana: 2,
  },
];

// ====================== BOSS SETS (CONJUNTOS ELITE) ======================
window.BOSS_SETS = {
  "Hidra Corrompida": {
     setName: "Escamas da Hidra",
     passives: [
       { req: 2, label: "Pele Escamosa", desc: "+20% de HP Máximo", type: "hpMult", value: 0.2 },
       { req: 4, label: "Coração da Hidra", desc: "Regenera 3% do HP ao fim do turno, mas sofre 2x de dano de Fogo", type: "epic_troll_heart", value: 1 }
     ]
  },
  "Illfang, o Rei Kobold": {
     setName: "Herança de Illfang",
     passives: [
       { req: 2, label: "Reflexos do Rei", desc: "+15% Evasão Focada", type: "evasion", value: 0.15 },
       { req: 4, label: "Carapaça Peçonhenta", desc: "Ao sofrer dano físico, inflige veneno severo no atacante", type: "epic_poison_shell", value: 1 }
     ]
  },
  "Lorde Necromante": {
     setName: "Veste da Morte Inevitável",
     passives: [
       { req: 2, label: "Força Profana", desc: "+20% Ataque Bruto", type: "atkMult", value: 0.2 },
       { req: 4, label: "Carrasco Impiedoso", desc: "Ignora 100% da Armadura de inimigos com < 30% HP", type: "epic_executioner", value: 1 }
     ]
  },
  "The Gleam Eyes": {
     setName: "Fúria do Demônio",
     passives: [
       { req: 2, label: "Gula Demoníaca", desc: "+10% Roubo de Vida", type: "lifeSteal", value: 0.10 },
       { req: 4, label: "Frenesi de Sangue", desc: "Críticos curam 5% do HP e dão +10% de Ataque", type: "epic_blood_frenzy", value: 1 }
     ]
  }
};

// Passivas Mágicas Geradas Dinamicamente nos Equipamentos Forjados ou Dropados
const ITEM_PASSIVES_POOL = [
  { type: "critChance", value: 0.05, label: "+5% Chance de Críticos" },
  { type: "critChance", value: 0.1, label: "+10% Chance de Críticos" },
  { type: "critDamage", value: 0.2, label: "+20% Dano Críticos" },
  { type: "lifeSteal", value: 0.1, label: "10% Roubo de Vida Físico" },
  { type: "lifeSteal", value: 0.15, label: "15% Roubo de Vida Físico" },
  { type: "ignoreDef", value: 0.1, label: "Ignora 10% de Armaduras Inimiga" },
  { type: "reflectDmg", value: 0.1, label: "Reflete 10% dos Dano Sofrido" },

  // === PASSIVAS DE DEFESA (melhoradas) ===
  {
    label: "Carapaç de Aço",
    type: "defMult",
    value: 0.08,
    desc: "+8% de Defesa Total",
  },
  {
    label: "Escudo Etéreo",
    type: "defMult",
    value: 0.12,
    desc: "+12% de Defesa Total",
  },
  {
    label: "Reflexo Punitivo",
    type: "reflectDmg",
    value: 0.15,
    desc: "Devolve 15% dos danos recebidos",
  },
  {
    label: "Barreira Vital",
    type: "damageReduction",
    value: 0.1,
    desc: "Reduz danos físicos em 10%",
  },
  {
    label: "Véu Arcano",
    type: "magicResist",
    value: 0.18,
    desc: "+18% Resistência Mágica",
  },
  {
    label: "Sangue de Titã",
    type: "lifeSteal",
    value: 0.06,
    desc: "Roubo de Vida em ataques",
  },
  {
    label: "Blindagem Reforada",
    type: "defMult",
    value: 0.2,
    desc: "+20% Defes (Lendários)",
  },

  // Passivas ofensivas (mantidas para equilíbrio)
  {
    label: "Fúria Cortante",
    type: "critChance",
    value: 0.08,
    desc: "+8% Chance de Críticos",
  },
  {
    label: "Golpes Devastador",
    type: "critDamage",
    value: 0.25,
    desc: "+25% Dano Críticos",
  },
  {
    label: SKILL_SEDE_DE_SANGUE,
    type: "lifeSteal",
    value: 0.09,
    desc: "+9% Roubo de Vida",
  },
  {
    label: "Perfuração",
    type: "ignoreDef",
    value: 0.12,
    desc: "Ignora 12% de Defes inimigas",
  },
];

// ====================== BOSS SETS (CONJUNTOS ELITE) ======================
window.BOSS_SETS = {
  "Hidra Corrompida": {
     setName: "Escamas da Hidra",
     passives: [
       { req: 2, label: "Pele Escamosa", desc: "+20% de HP Máximo", type: "hpMult", value: 0.2 },
       { req: 4, label: "Coração da Hidra", desc: "Regenera 3% do HP ao fim do turno, mas sofre 2x de dano de Fogo", type: "epic_troll_heart", value: 1 }
     ]
  },
  "Illfang, o Rei Kobold": {
     setName: "Herança de Illfang",
     passives: [
       { req: 2, label: "Reflexos do Rei", desc: "+15% Evasão Focada", type: "evasion", value: 0.15 },
       { req: 4, label: "Carapaça Peçonhenta", desc: "Ao sofrer dano físico, inflige veneno severo no atacante", type: "epic_poison_shell", value: 1 }
     ]
  },
  "Lorde Necromante": {
     setName: "Veste da Morte Inevitável",
     passives: [
       { req: 2, label: "Força Profana", desc: "+20% Ataque Bruto", type: "atkMult", value: 0.2 },
       { req: 4, label: "Carrasco Impiedoso", desc: "Ignora 100% da Armadura de inimigos com < 30% HP", type: "epic_executioner", value: 1 }
     ]
  },
  "The Gleam Eyes": {
     setName: "Fúria do Demônio",
     passives: [
       { req: 2, label: "Gula Demoníaca", desc: "+10% Roubo de Vida", type: "lifeSteal", value: 0.10 },
       { req: 4, label: "Frenesi de Sangue", desc: "Críticos curam 5% do HP e dão +10% de Ataque", type: "epic_blood_frenzy", value: 1 }
     ]
  }
};

// ====================== ELITE SETS (CONJUNTO) ======================
window.ELITE_SETS = {
  // --- BIOMA 1: CATACUMBAS ---
  "Dulahn, O Algoz Decapitado": {
    setName: "Clemência do Algoz",
    passives: [
      { req: 2, label: "Frieza da Morte", desc: "+10% Dano Crítico", type: "critDamage", value: 0.1 },
      { req: 4, label: "Execução Fria", desc: "Acertos Críticos têm 15% de chance de Atordoar (Stun)", type: "epic_dulahn_execute", value: 1 }
    ]
  },
  "Cavaleiro do Crisol Decaído": {
    setName: "Ferro do Crisol",
    passives: [
      { req: 2, label: "Aço Maciço", desc: "+15% Defesa Total", type: "defMult", value: 0.15 },
      { req: 4, label: "Muralha do Crisol", desc: "Reduz o dano sofrido em 50% após você defender", type: "epic_crucible_iron", value: 1 }
    ]
  },
  "Morte Menor": {
    setName: "Ceifador Gélido",
    passives: [
      { req: 2, label: "Toque Sinistro", desc: "+5% Evasão Focada", type: "evasion", value: 0.05 },
      { req: 4, label: "Lâmina Pútrida", desc: "Ataques corpo-a-corpo infligem Veneno", type: "epic_lesser_death", value: 1 }
    ]
  },
  "Paladino Corrompido": {
    setName: "Fé Quebrada",
    passives: [
      { req: 2, label: "Zelo Profano", desc: "+10% Poder de Cura", type: "healPower", value: 0.1 },
      { req: 4, label: "Devoção Cega", desc: "+50% de Dano Físico enquanto seu HP estiver em 100%", type: "epic_corrupt_paladin", value: 1 }
    ]
  },
  "Amálgama de Ossos": {
    setName: "Osso Maciço",
    passives: [
      { req: 2, label: "Estrutura Rígida", desc: "+10% HP Máximo", type: "hpMult", value: 0.1 },
      { req: 4, label: "Fragmentos Ósseos", desc: "Ignora passivamente 15% da Armadura Inimiga", type: "epic_bone_amalgam", value: 1 }
    ]
  },

  // --- BIOMA 2: PÂNTANO ---
  "Vex, A Bruxa do Pântano": {
    setName: "Hex do Pântano",
    passives: [
      { req: 2, label: "Magia Obscura", desc: "+10% Resistência Mágica", type: "magicResist", value: 0.1 },
      { req: 4, label: "Maldição Vex", desc: "+30% de Dano Mágico, mas reduz Precisão", type: "epic_swamp_witch", value: 1 }
    ]
  },
  "Macaco Guardião Sem Cabeça": {
    setName: "Fúria Primata",
    passives: [
      { req: 2, label: "Agilidade Selvagem", desc: "+10% Evasão Focada", type: "evasion", value: 0.1 },
      { req: 4, label: "Ira Enlouquecida", desc: "Receber um Crítico duplica o dano do seu próximo ataque", type: "epic_headless_ape", value: 1 }
    ]
  },
  "O Omen Caído": {
    setName: "Agouro Obscuro",
    passives: [
      { req: 2, label: "Toque Tóxico", desc: "+10% Chance de Veneno", type: "poisonChance", value: 0.1 },
      { req: 4, label: "Faro Nefasto", desc: "+20% de Dano em alvos Envenenados", type: "epic_fallen_omen", value: 1 }
    ]
  },
  "Besta Sanguinária": {
    setName: "Pele Sanguinária",
    passives: [
      { req: 2, label: "Gula Feroz", desc: "+5% Roubo de Vida", type: "lifeSteal", value: 0.05 },
      { req: 4, label: "Dreno Pestilento", desc: "Drena 5% do HP do alvo ao atacar monstros Envenenados", type: "epic_blood_beast", value: 1 }
    ]
  },
  "Kelpie, o Cavalo do Afogamento": {
    setName: "Correnteza Sombria",
    passives: [
      { req: 2, label: "Fluidez da Água", desc: "+10% Resistência Mágica", type: "magicResist", value: 0.1 },
      { req: 4, label: "Miragem Aquática", desc: "10% de chance de anular um ataque mágico recebido", type: "epic_kelpie_drown", value: 1 }
    ]
  },

  // --- BIOMA 3: VULCÃO ---
  "Ignis, O Arauto das Chamas": {
    setName: "Chama Eterna",
    passives: [
      { req: 2, label: "Essência Ígnea", desc: "+15 Poder de Queimadura", type: "burnPower", value: 15 },
      { req: 4, label: "Toque do Arauto", desc: "Ataques têm 20% de chance de aplicar Burn (Queimadura)", type: "epic_ignis_flame", value: 1 }
    ]
  },
  "Zodd, O Imortal": {
    setName: "Grito de Zodd",
    passives: [
      { req: 2, label: "Vigor Brutal", desc: "+15% HP Máximo", type: "hpMult", value: 0.15 },
      { req: 4, label: "Sangue Imortal", desc: "Se o HP cair abaixo de 20%, ganha 30% de Roubo de Vida", type: "epic_zodd_immortal", value: 1 }
    ]
  },
  "Perseguidor Flutuante": {
    setName: "Voo do Perseguidor",
    passives: [
      { req: 2, label: "Levitação", desc: "+10% Evasão Focada", type: "evasion", value: 0.1 },
      { req: 4, label: "Ataque Aéreo", desc: "+15% de Dano Verdadeiro ao atacar da Retaguarda", type: "epic_pursuer_flight", value: 1 }
    ]
  },
  "Dragão de Magma Terrestre": {
    setName: "Escama de Magma",
    passives: [
      { req: 2, label: "Calor Intenso", desc: "Reduz Dano Recebido em 5%", type: "damageReduction", value: 0.05 },
      { req: 4, label: "Casca Vulcânica", desc: "Reflete 15% do dano corpo a corpo recebido como Dano de Fogo", type: "epic_magma_dragon", value: 1 }
    ]
  },
  "Demônio Capra": {
    setName: "Chifres Capra",
    passives: [
      { req: 2, label: "Golpe Esmagador", desc: "+10% Dano Crítico", type: "critDamage", value: 0.1 },
      { req: 4, label: "Rompe-Defesas", desc: "10% de chance de causar Quebra de Armadura no primeiro golpe", type: "epic_capra_demon", value: 1 }
    ]
  },

  // --- BIOMA 4: CAVERNAS DE FOGO (LOWER) ---
  "Golem de Magma Ancião": {
    setName: "Pedra Derretida",
    passives: [
      { req: 2, label: "Núcleo Estável", desc: "+15% Defesa Total", type: "defMult", value: 0.15 },
      { req: 4, label: "Trilha de Fogo", desc: "Imunidade total a Burn (Queimadura)", type: "epic_elder_magma", value: 1 }
    ]
  },
  "Guarda-fogo Ancestral": {
    setName: "Vigília do Fogo",
    passives: [
      { req: 2, label: "Brasas Avulsas", desc: "+5% Resistência Mágica", type: "magicResist", value: 0.05 },
      { req: 4, label: "Vontade da Chama", desc: "Magias de Fogo causam +40% de dano", type: "epic_fire_guard", value: 1 }
    ]
  },
  "Cavaleiro Negro de Fumaça": {
    setName: "Fumaça Negra",
    passives: [
      { req: 2, label: "Mortalha Sombria", desc: "+10% Evasão Focada", type: "evasion", value: 0.1 },
      { req: 4, label: "Vulto Cansado", desc: "+25% Evasão extra contra ataques físicos", type: "epic_black_smoke", value: 1 }
    ]
  },
  "Wyvern Vermelho Menor": {
    setName: "Céu Escarlate",
    passives: [
      { req: 2, label: "Asas Velozes", desc: "+5% Chance de Críticos", type: "critChance", value: 0.05 },
      { req: 4, label: "Mergulho Abrasador", desc: "Ataque Duplo a cada 4 turnos", type: "epic_red_wyvern", value: 1 }
    ]
  },
  "Centopei de Lava": {
    setName: "Carapaça Ardente",
    passives: [
      { req: 2, label: "Múltiplas Pernas", desc: "+5% Evasão Focada", type: "evasion", value: 0.05 },
      { req: 4, label: "Anéis de Calor", desc: "Inimigos próximos sofrem Dano Contínuo Aumentado (+20 de Dano)", type: "epic_lava_centipede", value: 1 }
    ]
  },

  // --- BIOMA 5: FLORESTA SOMBRIA ---
  "Madeira Viva": {
    setName: "Raiz Antiga",
    passives: [
      { req: 2, label: "Seiva Revigorante", desc: "+10% HP Máximo", type: "hpMult", value: 0.1 },
      { req: 4, label: "Fotossíntese Bruta", desc: "Recupera 1 de Estamina ao usar Ataques Físicos simples", type: "epic_living_wood", value: 1 }
    ]
  },
  "Priscilla, A Desperta": {
    setName: "Abraço de Priscilla",
    passives: [
      { req: 2, label: "Passos de Neve", desc: "+10% Evasão Focada", type: "evasion", value: 0.1 },
      { req: 4, label: "Ocultação Ilusória", desc: "Imunidade a dano no primeiro turno de cada combate", type: "epic_priscilla_awake", value: 1 }
    ]
  },
  "O Demônio do Refúgio": {
    setName: "Guarda do Refúgio",
    passives: [
      { req: 2, label: "Corpo Maciço", desc: "+15% Defesa Total", type: "defMult", value: 0.15 },
      { req: 4, label: "Titã Enclausurado", desc: "+150 HP Base permanentemente", type: "epic_refuge_demon", value: 1 }
    ]
  },
  "Fiend, A Fera de Chifres": {
    setName: "Investida Fiend",
    passives: [
      { req: 2, label: "Ódio Enjaulado", desc: "+10% Dano Crítico", type: "critDamage", value: 0.1 },
      { req: 4, label: "Cornos Brutais", desc: "-1 Turno de Cooldown em todos os Ataques Pesados", type: "epic_horned_fiend", value: 1 }
    ]
  },
  "Riful do Oeste": {
    setName: "Tentáculo Ocidental",
    passives: [
      { req: 2, label: "Aberração Gêmea", desc: "+10% HP Máximo", type: "hpMult", value: 0.1 },
      { req: 4, label: "Despertar Voraz", desc: "O dano sobe em +2% a cada turno que passa (Máximo 20%)", type: "epic_riful_west", value: 1 }
    ]
  },

  // --- BIOMA 6: TUNDRA GÉLIDA ---
  "Golem de Prata": {
    setName: "Prata Maciça",
    passives: [
      { req: 2, label: "Brilho Pólido", desc: "+15% Resistência Mágica", type: "magicResist", value: 0.15 },
      { req: 4, label: "Resiliência Pura", desc: "Reduz todo o Dano Físico e Mágico recebido em um valor fixo de -10 pontos", type: "epic_silver_golem", value: 1 }
    ]
  },
  "Renna,  Iluso": {
    setName: "Véu de Renna",
    passives: [
      { req: 2, label: "Floco de Neve", desc: "+10% Evasão Focada", type: "evasion", value: 0.1 },
      { req: 4, label: "Reflexo Quebrado", desc: "Se o inimigo errar (Miss), você tem 50% de chance de contra-atacar livremente", type: "epic_renna_illusion", value: 1 }
    ]
  },
  "Sábio de Cristal": {
    setName: "Cajado Cristalino",
    passives: [
      { req: 2, label: "Foco Congelante", desc: "+10% Resistência Mágica", type: "magicResist", value: 0.1 },
      { req: 4, label: "Zero Absoluto", desc: "Magias de Gelo dão +30% de Dano e +15% de chance de Congelar", type: "epic_crystal_sage", value: 1 }
    ]
  },
  "Lobo Cinzento Gigante": {
    setName: "Fauces do Lobo",
    passives: [
      { req: 2, label: "Instinto Predador", desc: "+5% Chance de Críticos", type: "critChance", value: 0.05 },
      { req: 4, label: "Reflexos Implacáveis", desc: "Dobram os atributos de Agilidade/Velocidade nos cálculos de Evasão", type: "epic_grey_wolf", value: 1 }
    ]
  },
  "Arauto de Lua": {
    setName: "Caminho Lunar",
    passives: [
      { req: 2, label: "Luz Estelar", desc: "+10% Poder de Cura", type: "healPower", value: 0.1 },
      { req: 4, label: "Graça Arcana", desc: "Habilidades Mágicas custam 50% menos Estamina", type: "epic_moon_herald", value: 1 }
    ]
  },

  // --- BIOMA 7: TEMPLO DEMONÍACO ---
  "Cultista das Sombras": {
    setName: "Ritual Sombrio",
    passives: [
      { req: 2, label: "Frenesi Profano", desc: "+10% Roubo de Vida", type: "lifeSteal", value: 0.1 },
      { req: 4, label: "Mente Fendida", desc: "Quanto menor sua Sanidade, maior o seu Ataque", type: "epic_shadow_cultist", value: 1 }
    ]
  },
  "Artorias, O Corrompido": {
    setName: "Caminhante do Abismo",
    passives: [
      { req: 2, label: "Trevas Corrosivas", desc: "+15% Dano Crítico", type: "critDamage", value: 0.15 },
      { req: 4, label: "Lenda Tombada", desc: "Ataques contra Chefes e Elites recebem +25% de dano", type: "epic_artorias", value: 1 }
    ]
  },
  "Femto, O Falcão Negro": {
    setName: "Eclipse Total",
    passives: [
      { req: 2, label: "Pluma Sombria", desc: "+10% Evasão Focada", type: "evasion", value: 0.1 },
      { req: 4, label: "Desejo Nefasto", desc: "Ignora 50% da Armadura do alvo permanentemente", type: "epic_femto", value: 1 }
    ]
  },
  "Grunbeld, O Dragão de Fogo": {
    setName: "Cristal de Fogo",
    passives: [
      { req: 2, label: "Armadura Dracônica", desc: "+20% Defesa Total", type: "defMult", value: 0.2 },
      { req: 4, label: "Fornalha Viva", desc: "Reflete 100% das magias de Fogo recebidas", type: "epic_grunbeld", value: 1 }
    ]
  },
  "ÓÓrfão de Kos": {
    setName: "Placenta Estelar",
    passives: [
      { req: 2, label: "Cordão Umbilical", desc: "+15% HP Máximo", type: "hpMult", value: 0.15 },
      { req: 4, label: "Choro Ancestral", desc: "Poções curam o dobro da sua capacidade natural", type: "epic_orphan", value: 1 }
    ]
  }
};

// ====================== BOSS SETS (CONJUNTOS ELITE) ======================
window.BOSS_SETS = {
  "Hidra Corrompida": {
     setName: "Escamas da Hidra",
     passives: [
       { req: 2, label: "Pele Escamosa", desc: "+20% de HP Máximo", type: "hpMult", value: 0.2 },
       { req: 4, label: "Coração da Hidra", desc: "Regenera 3% do HP ao fim do turno, mas sofre 2x de dano de Fogo", type: "epic_troll_heart", value: 1 }
     ]
  },
  "Illfang, o Rei Kobold": {
     setName: "Herança de Illfang",
     passives: [
       { req: 2, label: "Reflexos do Rei", desc: "+15% Evasão Focada", type: "evasion", value: 0.15 },
       { req: 4, label: "Carapaça Peçonhenta", desc: "Ao sofrer dano físico, inflige veneno severo no atacante", type: "epic_poison_shell", value: 1 }
     ]
  },
  "Lorde Necromante": {
     setName: "Veste da Morte Inevitável",
     passives: [
       { req: 2, label: "Força Profana", desc: "+20% Ataque Bruto", type: "atkMult", value: 0.2 },
       { req: 4, label: "Carrasco Impiedoso", desc: "Ignora 100% da Armadura de inimigos com < 30% HP", type: "epic_executioner", value: 1 }
     ]
  },
  "The Gleam Eyes": {
     setName: "Fúria do Demônio",
     passives: [
       { req: 2, label: "Gula Demoníaca", desc: "+10% Roubo de Vida", type: "lifeSteal", value: 0.10 },
       { req: 4, label: "Frenesi de Sangue", desc: "Críticos curam 5% do HP e dão +10% de Ataque", type: "epic_blood_frenzy", value: 1 }
     ]
  }
};

// ====================== DATABASE DOS PANTEÒO ======================
const PANTHEON_GODS = [
  {
    id: "god_war",
    name: "Zarok, A Lâmina Eternas",
    desc: "Aumenta permanentemente seus Dano Físico Total.",
    maxLevel: 10,
    effectLabel: "+2% Dano Base",
    effectType: "dmgMult",
    effectValue: 0.02,
    costBase: { ferro: 10, ouro: 400 },
  },
  {
    id: "god_shield",
    name: "Aegis, A Titã de Aço",
    desc: "Concede camadas eras à suas Armaduras Divina.",
    maxLevel: 10,
    effectLabel: "+3% Defesa Total",
    effectType: "defMult",
    effectValue: 0.03,
    costBase: { cobre: 10, escamas: 5, ouro: 350 },
  },
  {
    id: "god_vampire",
    name: "Lilith, A Sanguinária",
    desc: "Aperfeiçoa  magias de roubo de sangue nas batalhas.",
    maxLevel: 5,
    effectLabel: "+3% Roubo de Vida",
    effectType: "lifeSteal",
    effectValue: 0.03,
    costBase: { rubi: 4, essencia_menor: 3, ouro: 500 },
  },
  {
    id: "god_eye",
    name: "Oráculo das Sombras",
    desc: "Afia  suas visão mística para sempre atacar pontos vitais.",
    maxLevel: 10,
    effectLabel: "+1% Chance Crítica",
    effectType: "critChance",
    effectValue: 0.01,
    costBase: { prata: 8, quartzo: 4, ouro: 450 },
  },
  {
    id: "god_greed",
    name: "Mammon, O Avarento",
    desc: "Os monstros abatidos derramam quantidades vastas de moedas.",
    maxLevel: 10,
    effectLabel: "+5% Ganho de Ouro",
    effectType: "goldFind",
    effectValue: 0.05,
    costBase: { ouro_bruto: 6, diamante: 1, ouro: 1000 },
  },
  {
    id: "god_arcane",
    name: "A Tecelã dos Vazio",
    desc: "Expande permanentemente os limites de suas Mentes Arcanas.",
    maxLevel: 10,
    effectLabel: "+15 Mana Máma",
    effectType: "map",
    effectValue: 15,
    costBase: { pano_espectral: 6, essencia_maior: 2, ouro: 600 },
  },
];

// ====================== BOSS SETS (CONJUNTOS ELITE) ======================
window.BOSS_SETS = {
  "Hidra Corrompida": {
     setName: "Escamas da Hidra",
     passives: [
       { req: 2, label: "Pele Escamosa", desc: "+20% de HP Máximo", type: "hpMult", value: 0.2 },
       { req: 4, label: "Coração da Hidra", desc: "Regenera 3% do HP ao fim do turno, mas sofre 2x de dano de Fogo", type: "epic_troll_heart", value: 1 }
     ]
  },
  "Illfang, o Rei Kobold": {
     setName: "Herança de Illfang",
     passives: [
       { req: 2, label: "Reflexos do Rei", desc: "+15% Evasão Focada", type: "evasion", value: 0.15 },
       { req: 4, label: "Carapaça Peçonhenta", desc: "Ao sofrer dano físico, inflige veneno severo no atacante", type: "epic_poison_shell", value: 1 }
     ]
  },
  "Lorde Necromante": {
     setName: "Veste da Morte Inevitável",
     passives: [
       { req: 2, label: "Força Profana", desc: "+20% Ataque Bruto", type: "atkMult", value: 0.2 },
       { req: 4, label: "Carrasco Impiedoso", desc: "Ignora 100% da Armadura de inimigos com < 30% HP", type: "epic_executioner", value: 1 }
     ]
  },
  "The Gleam Eyes": {
     setName: "Fúria do Demônio",
     passives: [
       { req: 2, label: "Gula Demoníaca", desc: "+10% Roubo de Vida", type: "lifeSteal", value: 0.10 },
       { req: 4, label: "Frenesi de Sangue", desc: "Críticos curam 5% do HP e dão +10% de Ataque", type: "epic_blood_frenzy", value: 1 }
     ]
  }
};

// =========================================================================
//  GRIMÓRIO EXAUSTIVO DE 60 HABILIDADES (10 PO CLASSE) COM STATUS EFFECTS
// =========================================================================
// A Engine de Combate lê o objeto `effect` de cada habilidade para gerar ações reais (Burn, Poison, Freeze, Stun, Blind, etc)
const MASTER_SKILLS_DATA = {
  Guerreiro: [
    {
      id: "g1",
      name: "Impactos Perfurante",
      icon: "assets/images/skills/guerreiro/PNG/1.webp",
      cost: 10,
      ratio: 1.3,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "ignoreDef", value: 0.2 },
      desc: "Ignora 20% de defesa inimigas através de pura força bruta.",
      passives: "Rank 5: Pass  ignorar 50% de defesa total dos alvo.",
    },
    {
      id: "g2",
      name: "Escudada Brutal",
      icon: "assets/images/skills/guerreiro/PNG/2.webp",
      cost: 15,
      ratio: 0.8,
      stats: STAT_CON,
      type: TYPE_FISICO,
      effect: { type: "stun", chance: 0.3, duration: 1 },
      reqStat: { id: STAT_FORCA, value: 12 },
      desc: "Ataca utilizando o escudo pesados (30% de chance de Atordoar).",
      passives: "Rank 5: Chance de atordoar sobe para absurdos 60%.",
    },
    {
      id: "g3",
      name: "Postura Imbatível",
      icon: "assets/images/skills/guerreiro/PNG/3.webp",
      cost: 20,
      ratio: 0,
      stats: STAT_CON,
      type: TYPE_SUPORTE,
      effect: { type: "buff_def", value: 30, duration: 3 },
      reqStat: { id: STAT_CON, value: 15 },
      desc: "Uma postura fechada que aumenta  Defes estática em +30 por 3 turnos.",
      passives: "Rank 5: O bônus de defesa é duplicado para +60.",
    },
    {
      id: "g4",
      name: "Grito Provocador",
      icon: "assets/images/skills/guerreiro/PNG/4.webp",
      cost: 12,
      ratio: 0,
      stats: STAT_FORCA,
      type: TYPE_SUPORTE,
      effect: { type: "blind", chance: 0.5, duration: 2 },
      desc: "Uma berro que ensurdece e ofusca o inimigos (50% chance de Cegar).",
      passives: "Rank 5: O grito afeta o monstros com 100% de precisão.",
    },
    {
      id: "g5",
      name: "Fender Solo",
      icon: "assets/images/skills/guerreiro/PNG/5.webp",
      cost: 25,
      ratio: 1.8,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      aoe: true,
      effect: null,
      reqSkill: { id: "g1", rank: 3 },
      desc: "Uma pancada descendente que quebra o chão, causando dano em área a todos os inimigos.",
      passives: "Rank 5: A força dos impactos soma +50% de danos base.",
    },
    {
      id: "g6",
      name: "Lâmina Sangrenta",
      icon: "assets/images/skills/guerreiro/PNG/6.webp",
      cost: 15,
      ratio: 1.2,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "lifeSteal", value: 0.3 },
      reqSkill: { id: "g5", rank: 2 },
      desc: "Uma cortes cirúrgico que converte 30% dos danos causado em curas de HP.",
      passives: "Rank 5: A maestria sobe o Life Steal para 60% dos danos.",
    },
    {
      id: "g7",
      name: "Investida Incontrolável",
      icon: "assets/images/skills/guerreiro/PNG/7.webp",
      cost: 20,
      ratio: 1.5,
      stats: STAT_AGI,
      type: TYPE_FISICO,
      effect: { type: "stun", chance: 0.15, duration: 1 },
      reqStat: { id: STAT_AGI, value: 15 },
      desc: "Arrancada hiperveloz. Pequena chance de amassar e atordoar o alvo.",
      passives:
        "Rank 5: A precisão perfeita impede que vocêê role Falha Crítica neste ataques.",
    },
    {
      id: "g8",
      name: "Balanço dos Executor",
      icon: "assets/images/skills/guerreiro/PNG/8.webp",
      cost: 30,
      ratio: 2.2,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: null,
      synergy: { status: "stun", multiplier: 2.5, name: "Ecução Impiedosa" },
      reqSkill: { id: "g2", rank: 3 },
      desc: "Sinergia: Dano 2.5 se o alvo estiver Atordoado.",
      passives:
        "Rank 5: A chance natural de Acerto Críticos desta habilidade dobra.",
    },
    {
      id: "g9",
      name: "Rugido Curativo",
      icon: "assets/images/skills/guerreiro/PNG/9.webp",
      cost: 25,
      ratio: 0,
      stats: STAT_CON,
      type: TYPE_CURA,
      effect: { type: "heal", ratio: 1.5 },
      reqSkill: { id: "g4", rank: 2 },
      desc: "As células dos seus corpos se fecham à base de força de vontade (Cura).",
      passives:
        "Rank 5: O rugido remove imediatamente qualquer Status Effect negativo em vocêê.",
    },
    {
      id: "g10",
      name: "Ira dos Antepassados",
      icon: "assets/images/skills/guerreiro/PNG/10.webp",
      cost: 50,
      ratio: 3.5,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "ignoreDef", value: 1.0 },
      reqSkill: { id: "g6", rank: 4 },
      reqStat: { id: STAT_FORCA, value: 25 },
      desc: "Uma golpes lendário que ignora 100% de defesa inimigas causando danos supremo.",
      passives:
        "Rank 5: O danos massivos deste golpes escala em mais +100% adicional.",
    },
    {
      id: "g11",
      name: "Fúria dos Titã (ULTIMATE)",
      icon: "assets/images/skills/guerreiro/PNG/11.webp",
      cost: 0,
      costType: "focus",
      ratio: 5.0,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "buff_atk", value: 2.0, duration: 3 },
      reqStat: { id: STAT_FORCA, value: 30 },
      desc: "Consome 100 Fúria. Cura 50% HP perdidos e dobra o Dano por 3 turnos!",
      passives: "Rank 5: Dano dobrado passivos de Ultimate vir Dano Triplo.",
    },
  ],
  Arcanista: [
    {
      id: "a1",
      name: "Incinerar",
      icon: "assets/images/skills/arcanista/PNG/1.webp",
      cost: 15,
      ratio: 1.2,
      stats: STAT_INT,
      type: TYPE_FOGO,
      effect: { type: "burn", duration: 3, ratio: 0.2 },
      desc: "Envolve o inimigos em chamas (Queima em 20% dos danos base por 3 turnos).",
      passives: "Rank 5: A intensidade de queimadura sobe para 40%.",
    },
    {
      id: "a2",
      name: "Lança Glacial",
      icon: "assets/images/skills/arcanista/PNG/2.webp",
      cost: 15,
      ratio: 1.4,
      stats: STAT_INT,
      type: TYPE_GELO,
      effect: { type: "freeze", chance: 0.2, duration: 1 },
      synergy: { status: "burn", multiplier: 2.0, name: "Choque Térmico" },
      desc: "Estaca de gelo puro. Sinergia: Dano 2.0 se o alvo estiver Queimando.",
      passives: "Rank 5: A chance de congelamento letal sobre para 50%.",
    },
    {
      id: "a3",
      name: "Relâmpago Arcano",
      icon: "assets/images/skills/arcanista/PNG/3.webp",
      cost: 20,
      ratio: 1.6,
      stats: STAT_INT,
      type: TYPE_RAIO,
      effect: { type: "blind", chance: 0.3, duration: 1 },
      reqStat: { id: STAT_INT, value: 15 },
      desc: "Luz absurdamente intens que danifica e ofusca  visão (Cegar 30%).",
      passives:
        "Rank 5: Se o alvo estiver cego, este raio caus o dobro de danos.",
    },
    {
      id: "a4",
      name: "Escudo de Mana",
      icon: "assets/images/skills/arcanista/PNG/4.webp",
      cost: 25,
      ratio: 0,
      stats: STAT_INT,
      type: TYPE_SUPORTE,
      effect: { type: "buff_def", value: 40, duration: 4 },
      desc: "Projeção de uma barreira mágicas. +40 Defes por 4 turnos seguidos.",
      passives:
        "Rank 5: A barreira adquire espinhos místicos e reflete danos aos monstros.",
    },
    {
      id: "a5",
      name: "Meteoro",
      icon: "assets/images/skills/arcanista/PNG/5.webp",
      cost: 40,
      ratio: 2.5,
      stats: STAT_INT,
      type: TYPE_FOGO,
      aoe: true,
      effect: { type: "burn", duration: 2, ratio: 0.3 },
      reqSkill: { id: "a1", rank: 3 },
      desc: "Dano em área absurdos seguidos de crateras em chamas (Queimadura severa).",
      passives:
        "Rank 5: A precisão de conjuração sobe  chance crítica desta skills para 50%.",
    },
    {
      id: "a6",
      name: "Dreno Anímico",
      icon: "assets/images/skills/arcanista/PNG/6.webp",
      cost: 20,
      ratio: 1.0,
      stats: STAT_INT,
      type: TYPE_ARCANO,
      effect: { type: "lifeSteal", value: 0.5 },
      reqStat: { id: STAT_INT, value: 18 },
      desc: "Vocês suga  essênci espiritual convertendo 50% dos danos em HP.",
      passives: "Rank 5: O sifão pass  roubar Mana Arcanas n mesma proporção.",
    },
    {
      id: "a7",
      name: "Nevasca Erema",
      icon: "assets/images/skills/arcanista/PNG/7.webp",
      cost: 35,
      ratio: 1.8,
      stats: STAT_INT,
      type: TYPE_GELO,
      effect: { type: "freeze", chance: 0.4, duration: 1 },
      reqSkill: { id: "a2", rank: 3 },
      desc: "Alta chance (40%) de congelamento rápidos.",
      passives:
        "Rank 5: Inimigos sob o efeitos de congelamento perdem todas suas defesa base.",
    },
    {
      id: "a8",
      name: "Transmutar Sangue",
      icon: "assets/images/skills/arcanista/PNG/8.webp",
      cost: 0,
      ratio: 0,
      stats: STAT_SAB,
      type: TYPE_SUPORTE,
      effect: { type: "blood_to_mana", value: 30 },
      reqStat: { id: STAT_SAB, value: 15 },
      desc: "Magia de sangue. Vocês sacrifica 25 de Vida para gerar 40 de Mana instantes.",
      passives:
        "Rank 5: A maestria anula o custo de sacrifício de HP completamente.",
    },
    {
      id: "a9",
      name: "Chamas Eternas",
      icon: "assets/images/skills/arcanista/PNG/9.webp",
      cost: 30,
      ratio: 0,
      stats: STAT_INT,
      type: TYPE_SUPORTE,
      effect: { type: "burn", duration: 10, ratio: 0.5 },
      reqSkill: { id: "a5", rank: 2 },
      desc: "Aplica uma maldição de Fogo inextinguível que durará 10 turnos.",
      passives:
        "Rank 5: O danos de Fogo dess maldição é duplicado  cada novos turnos.",
    },
    {
      id: "a10",
      name: "Singularidade",
      icon: "assets/images/skills/arcanista/PNG/10.webp",
      cost: 60,
      ratio: 4.0,
      stats: STAT_INT,
      type: TYPE_ARCANO,
      effect: { type: "stun", chance: 1.0, duration: 1 },
      reqSkill: { id: "a3", rank: 4 },
      reqStat: { id: STAT_INT, value: 25 },
      desc: "Dano supremo. O vácuo espacial Atordoa o alvo automaticamente.",
      passives:
        "Rank 5: O danos final desta magias é multiplicado por absurdos 6.0.",
    },
    {
      id: "a11",
      name: "Cataclismo Elemental (ULTIMATE)",
      icon: "assets/images/skills/arcanista/PNG/11.webp",
      cost: 0,
      costType: "focus",
      ratio: 6.0,
      stats: STAT_INT,
      type: TYPE_ARCANO,
      effect: { type: "burn", duration: 3, ratio: 1.5 },
      reqStat: { id: STAT_INT, value: 30 },
      desc: "Consome 100 Foco. Desintegr o inimigos com energias primordial e inflige Queimadura Arcanas severa.",
      passives:
        "Rank 5: O fogo primordial derrete  Armaduras dos alvo permanentemente.",
    },
  ],
  Ranger: [
    {
      id: "r1",
      name: "Tiros Preciso",
      icon: "assets/images/skills/ranger/PNG/1.webp",
      cost: 10,
      ratio: 1.4,
      stats: STAT_AGI,
      type: TYPE_FISICO,
      effect: { type: "crit_bonus", value: 0.2 },
      desc: "Mirar nos olhos concede +20% de Chance de Críticos só neste golpes.",
      passives:
        "Rank 5: A chance de acerto letal (Críticos) é aumentada em +50%.",
    },
    {
      id: "r2",
      name: "Flecha Venenosa",
      icon: "assets/images/skills/ranger/PNG/2.webp",
      cost: 15,
      ratio: 1.0,
      stats: STAT_AGI,
      type: TYPE_VENENOSA,
      effect: { type: "poison", duration: 4, power: 15 },
      desc: "Toxina purulenta. Aplica 15 de danos fixo em Venenosa por 4 turnos.",
      passives:
        "Rank 5: A toxina entra n corrente e escala o danos com suas Agilidade total.",
    },
    {
      id: "r3",
      name: "Salto Evasivo",
      icon: "assets/images/skills/ranger/PNG/3.webp",
      cost: 20,
      ratio: 0,
      stats: STAT_AGI,
      type: TYPE_SUPORTE,
      effect: { type: "dodge", duration: 1 },
      reqStat: { id: STAT_AGI, value: 15 },
      desc: "Uma manobra acrobática. Garante Evasão de 100% nos próximo turnos dos monstros.",
      passives:
        "Rank 5: Permite retaliar atirando uma flechas rápida gratuitamente aço esquivar.",
    },
    {
      id: "r4",
      name: "Disparo Perfurante",
      icon: "assets/images/skills/ranger/PNG/4.webp",
      cost: 18,
      ratio: 1.5,
      stats: STAT_AGI,
      type: TYPE_FISICO,
      effect: { type: "ignoreDef", value: 0.4 },
      desc: "O projétil de aço densos ignora 40% de armadura dos chefe.",
      passives:
        "Rank 5: O disparo penetra profundamente, ignorando 80% de Defesa.",
    },
    {
      id: "r5",
      name: "Saraivada",
      icon: "assets/images/skills/ranger/PNG/5.webp",
      cost: 35,
      ratio: 2.2,
      stats: STAT_AGI,
      type: TYPE_FISICO,
      effect: null,
      synergy: { status: "poison", multiplier: 2.0, name: "Toxina Eosta" },
      reqSkill: { id: "r1", rank: 3 },
      desc: "Dano altíssimo proveniente de múltiplas flechas. Sinergia: Dano 2.0 se o alvo estiver Envenenado.",
      passives:
        "Rank 5: Cada uma das flechas espalhadas carrega chance de Envenenamento.",
    },
    {
      id: "r6",
      name: "Armadilha de Espinhos",
      icon: "assets/images/skills/ranger/PNG/6.webp",
      cost: 15,
      ratio: 0,
      stats: STAT_SAB,
      type: TYPE_SUPORTE,
      effect: { type: "stun", chance: 1.0, duration: 1 },
      reqStat: { id: STAT_SAB, value: 15 },
      desc: "Estratégia pura. Prende o inimigos garantindo Atordoamento imediato.",
      passives:
        "Rank 5: Além de priso, os dentes de metal causam Sangramento severo.",
    },
    {
      id: "r7",
      name: "Tiros Cegante",
      icon: "assets/images/skills/ranger/PNG/7.webp",
      cost: 14,
      ratio: 1.1,
      stats: STAT_AGI,
      type: TYPE_FISICO,
      effect: { type: "blind", chance: 0.8, duration: 2 },
      reqSkill: { id: "r4", rank: 3 },
      desc: "Flecha com pós estelar. Ofusca o oponente garantindo 80% de Cegueira.",
      passives: "Rank 5: A cegueira é inevitável (100% chance de aplicar).",
    },
    {
      id: "r8",
      name: "Foco dos Predador",
      icon: "assets/images/skills/ranger/PNG/8.webp",
      cost: 25,
      ratio: 0,
      stats: STAT_SAB,
      type: TYPE_SUPORTE,
      effect: { type: "buff_atk", value: 1.5, duration: 3 },
      reqStat: { id: STAT_SAB, value: 20 },
      desc: "Canaliza os instintos primitivos. +50% de Dano Físico Ativo por 3 rodadas.",
      passives:
        "Rank 5: A duração deste Buff se torna Infinita durante todos o combates.",
    },
    {
      id: "r9",
      name: "Flecha Congelante",
      icon: "assets/images/skills/ranger/PNG/9.webp",
      cost: 22,
      ratio: 1.4,
      stats: STAT_AGI,
      type: TYPE_GELO,
      effect: { type: "freeze", chance: 0.4, duration: 1 },
      reqSkill: { id: "r2", rank: 2 },
      desc: "Cristais de gelo n pontas (40% de chance de Congelar os membros dos inimigos).",
      passives:
        "Rank 5: Se o alvo já estiver congelado, o próximo hit será Críticos Garantido.",
    },
    {
      id: "r10",
      name: "Tiros de Misericórdia",
      icon: "assets/images/skills/ranger/PNG/10.webp",
      cost: 50,
      ratio: 3.5,
      stats: STAT_AGI,
      type: TYPE_FISICO,
      effect: { type: "execute", threshold: 0.2 },
      reqSkill: { id: "r5", rank: 4 },
      reqStat: { id: STAT_AGI, value: 25 },
      desc: "Executa instantaneamente qualquer adversário cujo HP esteja abaixo de 20%.",
      passives:
        "Rank 5: O limiar de sentença de morte sobe brutalmente para 35% de HP.",
    },
    {
      id: "r11",
      name: "Chuv de Prata (ULTIMATE)",
      icon: "assets/images/skills/ranger/PNG/11.webp",
      cost: 0,
      costType: "focus",
      ratio: 4.5,
      stats: STAT_AGI,
      type: TYPE_FISICO,
      effect: { type: "blind", chance: 1.0, duration: 3 },
      reqStat: { id: STAT_AGI, value: 30 },
      desc: "Consome 100 Foco. Milhares de flechas despencam dos céus, cegando o inimigos com 100% de chance.",
      passives:
        "Rank 5: Inimigos cegados tomam Dano Críticos garantido de todos os seus ataques.",
    },
  ],
  Barbaro: [
    {
      id: "b1",
      name: "Corte Sangrento",
      cost: 10,
      ratio: 1.3,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "burn", duration: 3, ratio: 0.15 },
      desc: "Rasga  carne, causando Hemorragia (Dano contínuo tratado como Burn).",
      passives:
        "Rank 5: O danos por sangramento nos inimigos curas o Bárbaro n mesma proporção.",
    },
    {
      id: "b2",
      name: "Ira Selvagem",
      cost: 15,
      ratio: 1.8,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "self_dmg", value: 15 },
      desc: "Bate imensamente mais fortes, massa custa 15 pontos dos seus próprio HP Vital.",
      passives: "Rank 5: O domínio de fúria remove o danos aplicado  si mesmo.",
    },
    {
      id: "b3",
      name: "Pele Escarificada",
      cost: 20,
      ratio: 0,
      stats: STAT_CON,
      type: TYPE_SUPORTE,
      effect: { type: "buff_def", value: 50, duration: 3 },
      reqStat: { id: STAT_CON, value: 15 },
      desc: "Transforma dor em armaduras. Garante +50 de Defes pura por 3 turnos.",
      passives:
        "Rank 5: Enquanto  pele durar, confere Imunidade completas  Status de Efeito.",
    },
    {
      id: "b4",
      name: "Grito Aterrorizante",
      cost: 18,
      ratio: 0,
      stats: STAT_FORCA,
      type: TYPE_SUPORTE,
      effect: { type: "blind", chance: 0.6, duration: 2 },
      desc: "Uma rugido de arrepiar os ossos. 60% de chance de Cegar o inimigos n hora.",
      passives:
        "Rank 5: O grito força as defesas inimigas, quebrando  armadura dele.",
    },
    {
      id: "b5",
      name: "Esmagar Ossos",
      cost: 30,
      ratio: 2.2,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "ignoreDef", value: 0.5 },
      synergy: { status: "burn", multiplier: 2.0, name: "Laceração Bruta" },
      reqSkill: { id: "b2", rank: 3 },
      desc: "Ignora 50% de mitigação física. Sinergia: Dano 2.0 se alvo Sangrando (Queimadura).",
      passives:
        "Rank 5: O golpes se torna perfeito e fura 100% de Defes estrutural.",
    },
    {
      id: "b6",
      name: "Fúria Cega",
      cost: 40,
      ratio: 2.8,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "blind_self", duration: 1 },
      reqStat: { id: STAT_FORCA, value: 18 },
      desc: "Ataques avassalador que gera Dano colossal, massa cega vocêê momentaneamente.",
      passives:
        "Rank 5: O guerreiro se adapta aço transe de sangue e nos perde  visão.",
    },
    {
      id: "b7",
      name: "Cabeçada Esmagadora",
      cost: 12,
      ratio: 1.0,
      stats: STAT_CON,
      type: TYPE_FISICO,
      effect: { type: "stun", chance: 0.5, duration: 1 },
      reqSkill: { id: "b4", rank: 2 },
      desc: "Us  própria face. Dano baixo, porém 50% de chance de concusso (Stun).",
      passives:
        "Rank 5: A técnica garante 100% de probabilidade de incapacitação neuronal.",
    },
    {
      id: "b8",
      name: "Fôlego Inesgotável",
      cost: 0,
      ratio: 0,
      stats: STAT_CON,
      type: TYPE_CURA,
      effect: { type: "heal", ratio: 2.0 },
      reqStat: { id: STAT_CON, value: 20 },
      desc: "Restaura  Vitalidade usando os pulmões e  força de vontade.",
      passives:
        "Rank 5: Adiciona uma Buff temporal de regeneração sem gastar turnos algum.",
    },
    {
      id: "b9",
      name: "Terremoto Bárbaro",
      cost: 35,
      ratio: 1.5,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "stun", chance: 0.2, duration: 1 },
      reqSkill: { id: "b5", rank: 3 },
      desc: "Cria tremores nos chão. Aplica danos alto com chance marginal de Atordoar.",
      passives:
        "Rank 5: A fissuras nos solo Atordoa adversários com  gravidade por 2 turnos.",
    },
    {
      id: "b10",
      name: "Golpes dos Apocalipse",
      cost: 60,
      ratio: 4.0,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "lifeSteal", value: 0.2 },
      reqSkill: { id: "b6", rank: 4 },
      reqStat: { id: STAT_FORCA, value: 25 },
      desc: "Rachar céus e terras. Dano indescritível e recupera 20% Life Steal bruto.",
      passives:
        "Rank 5: A sucção aumenta para absurdos 40% dos danos final causado.",
    },
    {
      id: "b11",
      name: "Grito das Valquírias (ULTIMATE)",
      cost: 0,
      costType: "focus",
      ratio: 0,
      stats: STAT_FORCA,
      type: TYPE_SUPORTE,
      effect: { type: "ma_fury_buff", duration: 4 },
      reqStat: { id: STAT_FORCA, value: 30 },
      desc: "Consome 100 Fúria. Entr num transe de fúria absoluta: nos gast estamina, danos +150% e fica imune  morte.",
      passives:
        "Rank 5: A fúria estende para 6 turnos de puro massacre ininterrupto.",
    },
  ],
  Paladino: [
    {
      id: "p1",
      name: "Golpes Divino",
      icon: "assets/images/skills/paladino/PNG/1.webp",
      cost: 12,
      ratio: 1.3,
      stats: STAT_SAB,
      type: TYPE_LUZ,
      effect: { type: "heal_self", ratio: 0.5 },
      desc: "Arma ungida pelas retidão. Aplica o ataques enquanto curas suas feridas.",
      passives:
        "Rank 5: A bênção amplia  curas para 100% dos impactos divinos.",
    },
    {
      id: "p2",
      name: "Luz Cegante",
      icon: "assets/images/skills/paladino/PNG/2.webp",
      cost: 15,
      ratio: 0.8,
      stats: STAT_SAB,
      type: TYPE_LUZ,
      effect: { type: "blind", chance: 0.8, duration: 2 },
      desc: "O clarão dos deuses ofusca os olhos de heresia (80% chance Cegar).",
      passives:
        "Rank 5: Inimigos cegados sofrem danos físicos passivos constantes.",
    },
    {
      id: "p3",
      name: "Bênção de Proteção",
      icon: "assets/images/skills/paladino/PNG/3.webp",
      cost: 20,
      ratio: 0,
      stats: STAT_CON,
      type: TYPE_SUPORTE,
      effect: { type: "buff_def", value: 40, duration: 4 },
      reqStat: { id: STAT_SAB, value: 15 },
      desc: "Uma halo sagrados blinda suas armaduras, garantindo +40 Defes Temporária.",
      passives:
        "Rank 5: O poder concentrados dobra para uma escudo de +80 Defesa Total.",
    },
    {
      id: "p4",
      name: "Julgamento Final",
      icon: "assets/images/skills/paladino/PNG/4.webp",
      cost: 25,
      ratio: 1.8,
      stats: STAT_SAB,
      type: TYPE_LUZ,
      effect: { type: "ignoreDef", value: 0.3 },
      desc: "Projétil místicos que julga as almas, atravessando defesas obscuras.",
      passives:
        "Rank 5: Garante uma Acerto Críticos obrigatório se o oponente fora Profano.",
    },
    {
      id: "p5",
      name: "Cura Maior",
      icon: "assets/images/skills/paladino/PNG/5.webp",
      cost: 30,
      ratio: 0,
      stats: STAT_SAB,
      type: TYPE_CURA,
      effect: { type: "heal", ratio: 3.0 },
      reqSkill: { id: "p2", rank: 3 },
      desc: "Canalização profundas que sutura todas as artérias severamente machucadas.",
      passives:
        "Rank 5: O milagre alcança proporções absurdas, escalando 5 em Sabedoria.",
    },
    {
      id: "p6",
      name: "Escudo Vingador",
      icon: "assets/images/skills/paladino/PNG/6.webp",
      cost: 18,
      ratio: 1.2,
      stats: STAT_CON,
      type: TYPE_FISICO,
      effect: { type: "stun", chance: 0.3, duration: 1 },
      reqStat: { id: STAT_CON, value: 18 },
      desc: "Arremess o pavês de metal, batendo nos rosto dos inimigos e causando Stun.",
      passives:
        "Rank 5: O impactos gera concussões altíssimas (70% de chance de Stun).",
    },
    {
      id: "p7",
      name: "Aura de Espinhos",
      icon: "assets/images/skills/paladino/PNG/7.webp",
      cost: 25,
      ratio: 0,
      stats: STAT_SAB,
      type: TYPE_SUPORTE,
      effect: { type: "reflectDmg", value: 0.5, duration: 3 },
      reqSkill: { id: "p4", rank: 2 },
      desc: "Cria pontas mágicas que devolvem 50% dos ataques de volta aço agressor.",
      passives:
        "Rank 5: O retalhamento punitivo pass  devolver o danos Físico integral (100%).",
    },
    {
      id: "p8",
      name: "Consagração",
      icon: "assets/images/skills/paladino/PNG/8.webp",
      cost: 35,
      ratio: 1.0,
      stats: STAT_SAB,
      type: TYPE_LUZ,
      effect: { type: "burn", duration: 4, ratio: 0.4 },
      reqStat: { id: STAT_SAB, value: 20 },
      desc: "O piso ferve de purificação sagrada, queimando as hostes de maldade.",
      passives:
        "Rank 5: O terreno permanece consagrado pelos dobro dos tempo nos combates.",
    },
    {
      id: "p9",
      name: "Martelo de Justiça",
      icon: "assets/images/skills/paladino/PNG/9.webp",
      cost: 40,
      ratio: 2.5,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "ignoreDef", value: 0.5 },
      synergy: { status: "stun", multiplier: 2.0, name: "Veredito Implacável" },
      reqSkill: { id: "p6", rank: 3 },
      desc: "Esmiuç couraas ignorando 50% de def. Sinergia: Dano 2.0 se o alvo Atordoado.",
      passives:
        "Rank 5: O peso massivos resulta em devastação física desmedida de danos puro.",
    },
    {
      id: "p10",
      name: "Ira dos Céus",
      icon: "assets/images/skills/paladino/PNG/10.webp",
      cost: 60,
      ratio: 3.5,
      stats: STAT_SAB,
      type: TYPE_LUZ,
      effect: { type: "stun", chance: 1.0, duration: 1 },
      reqSkill: { id: "p8", rank: 4 },
      reqStat: { id: STAT_SAB, value: 25 },
      desc: "Uma feixe estelar absoluto fulmina e atordoa (100%) os blasfemadores.",
      passives:
        "Rank 5: O danos divinos escala em 2 caso seja apontado diretamente para uma Boss.",
    },
    {
      id: "p11",
      name: "Julgamento Final (ULTIMATE)",
      icon: "assets/images/skills/paladino/PNG/11.webp",
      cost: 0,
      costType: "focus",
      ratio: 5.0,
      stats: STAT_SAB,
      type: TYPE_LUZ,
      effect: { type: "heal", ratio: 5.0 },
      reqStat: { id: STAT_SAB, value: 30 },
      desc: "Consome 100 Foco. Evoca os arcanjos, curando massivamente seu HP e desferindo Luz pura nos inimigos.",
      passives: "Rank 5: O raio do julgamento ignora todas as resistências do alvo.",
    },
  ],
  Necromante: [
    {
      id: "n1",
      name: "Foice Sombria",
      cost: 0,
      ratio: 1.2,
      stats: STAT_INT,
      type: TYPE_PROFANO,
      effect: null,
      desc: "Ataque básico cortante com energia ectoplasmática. Ao acertar, ceifa a energia vital e gera Almas para seus rituais.",
      passives: "Rank 5: Seus ataques básicos cortam a resistência inimiga reduzindo a defesa em 5%.",
    },
    {
      id: "n2",
      name: "Erguer os Mortos",
      cost: 20,
      ratio: 0,
      stats: STAT_INT,
      type: TYPE_SUPORTE,
      effect: { type: "summonMinion", value: 1 },
      desc: "Costura cadáveres e invoca 1 Lacaio aleatório (Guerreiro, Mago ou Guardião) com atributos únicos. Eles atacam e absorvem dano.",
      passives: "Rank 5: O Esqueleto invocado vem reforçado com Ossos de Aço (+35% de Escudo).",
    },
    {
      id: "n3",
      name: "Miasma Pútrido",
      cost: 18,
      ratio: 0.8,
      stats: STAT_INT,
      type: TYPE_VENENOSA,
      effect: { type: "poison", duration: 4, power: 18 },
      reqStat: { id: STAT_INT, value: 15 },
      desc: "Libera vapores de podridão que apodrecem os pulmões adversários por 4 turnos. Ignora defesa parcial.",
      passives: "Rank 5: Os esporos fixam nos canais dos corpos, dobrando a duração do miasma.",
    },
    {
      id: "n4",
      name: "Sacrifício Macabro",
      cost: 0,
      ratio: 0,
      stats: STAT_INT,
      type: TYPE_SUPORTE,
      effect: { type: "sacrificeMinion", value: 1 },
      desc: "Estilhaça 1 Esqueleto ativo para regenerar sua Vida (HP) e recuperar 30 de Mana instantaneamente.",
      passives: "Rank 5: A explosão óssea do sacrifício também causa dano residual no monstro.",
    },
    {
      id: "n5",
      name: "Armadura de Ossos",
      cost: 25,
      ratio: 0,
      stats: STAT_INT,
      type: TYPE_SUPORTE,
      effect: { type: "buff_def", value: 40, duration: 5 },
      reqSkill: { id: "n2", rank: 3 },
      desc: "Gasta 20 Almas para fundir os ossos do campo de batalha ao seu corpo (Aumenta o Escudo atual dos lacaios + Defesa Bônus).",
      passives: "Rank 5: As caveiras riem e refletem 15% de todo dano físico sofrido de volta ao alvo.",
    },
    {
      id: "n6",
      name: "Exército dos Mortos",
      cost: 0,
      costType: "ultimate",
      ratio: 4.5,
      stats: STAT_INT,
      type: TYPE_PROFANO,
      effect: { type: "stun", duration: 1 },
      reqStat: { id: STAT_INT, value: 30 },
      desc: "Consome 100 Almas! Convoca uma legião que inflige dano massivo, Atordoa o inimigo e deixa 3 Lacaios aleatórios vivos em campo.",
      passives: "Rank 5: A horda deixa o alvo quebrado permanentemente (-10 de Postura Máxima).",
    },
    {
      id: "n7",
      name: "Sifão Profano de Almas",
      cost: 30,
      ratio: 1.5,
      stats: STAT_INT,
      type: TYPE_PROFANO,
      effect: { type: "lifeSteal", value: 0.3 },
      synergy: {
        status: "poison",
        multiplier: 2.0,
        name: "Decomposição Acelerada",
      },
      reqSkill: { id: "n2", rank: 3 },
      desc: "Drena  chamas. Sinergia: Dano 2.0 se o alvo estiver Envenenado.",
      passives:
        "Rank 5: O ataques desregula  matéria sombrias multiplicando  escala dos Dano.",
    },
    {
      id: "n8",
      name: "Terror Obscuro Mudo",
      cost: 15,
      ratio: 0,
      stats: STAT_INT,
      type: TYPE_SUPORTE,
      effect: { type: "blind", chance: 0.9, duration: 2 },
      reqStat: { id: STAT_INT, value: 20 },
      desc: "Fobias profundas atacam  mente, cegando o sujeito quase garantido.",
      passives:
        "Rank 5: A loucura é perpétua e impossibilita  curas dos status nos combates.",
    },
    {
      id: "n9",
      name: "Pacto Sanguíneo das Sombras",
      cost: 0,
      ratio: 0,
      stats: STAT_INT,
      type: TYPE_SUPORTE,
      effect: { type: "blood_to_mana", value: 50 },
      reqSkill: { id: "n4", rank: 2 },
      desc: "Alquimia reversa. Queima o seus corpos físicos (-25 HP) por vastos +50 Mana.",
      passives:
        "Rank 5: A transmutação atinge o equilíbrio perfeito gerando generosos 100 de MP.",
    },
    {
      id: "n10",
      name: "Eército dos Condenados",
      cost: 70,
      ratio: 4.0,
      stats: STAT_INT,
      type: TYPE_PROFANO,
      effect: { type: "poison", duration: 5, power: 25 },
      reqSkill: { id: "n5", rank: 4 },
      reqStat: { id: STAT_INT, value: 25 },
      desc: "Ataques supremo dos vácuo, inundando com Venenosa Sombrio pesados.",
      passives:
        "Rank 5: O bafo de podridão corrompe órgãos cortando  vida máxima aço meio.",
    },
    {
      id: "n11",
      name: "Despertar dos Vazio (ULTIMATE)",
      cost: 0,
      costType: "focus",
      ratio: 4.5,
      stats: STAT_INT,
      type: TYPE_PROFANO,
      effect: { type: "lifeSteal", value: 1.0 },
      reqStat: { id: STAT_INT, value: 30 },
      desc: "Consome 100 Foco. Abissalmente drena  essênci total, convertendo 100% dos Dano em Cura.",
      passives:
        "Rank 5: Qualquer eedente de curas se converte em Escudo Sombrio permanente.",
    },
  ],
};
// =====================================================
// BIOMAS DE SANCTUARY
// =====================================================
const BIOMES = [
  {
    id: 0,
    minLevel: 1,
    maxLevel: 5,
    name: "Catacumbas Sombrias",
    description:
      "O ar é frios e cheira  mofo. Sombras parecem se mover pelas paredes.",
    color: "#4a525a",
    fieldEffect: {
      name: "Névoa Espessa",
      desc: "Reduz  chance de acerto crítico dos jogador em 10%.",
      apply: (calc) => {
        calc.passives.critChance = Math.max(0, calc.passives.critChance - 0.1);
      },
    },
    monsters: [
      // 10 Monstros Normais
      {
        name: "Rato Mutante",
        hp: 45,
        atk: 8,
        def: 5,
        specialDesc: "Mordida Infecciosa (Pequena chance de Venenosa)",
        tags: { poisonHit: true, weakness: [TYPE_FOGO] },
        drops: [
          { id: "couro", type: "materials", chance: 0.4 },
          { id: "cobre", type: "materials", chance: 0.15 },
        ],
      },
      {
        name: "Esqueleto de Guarda",
        hp: 65,
        atk: 12,
        def: 15,
        specialDesc: "Ossos Rígidos (Resistência a cortes)",
        tags: { physicalResist: 0.1 },
        drops: [
          { id: "ferro", type: "materials", chance: 0.35 },
          {
            id: "espada_enferrujada",
            type: "equip",
            name: "Lâmina Lascada",
            rarity: "Normal",
            slots: "armas",
            chance: 0.1,
          },
        ],
      },
      {
        name: "Zumbi Pútrido",
        hp: 80,
        atk: 10,
        def: 10,
        specialDesc: "Resistencia  Dor",
        tags: {
          physicalResist: 0.1,
          weakness: [TYPE_FOGO, TYPE_LUZ],
          resist: [TYPE_VENENOSA, TYPE_PROFANO],
        },
        drops: [{ id: "couro", type: "materials", chance: 0.5 }],
      },
      {
        name: "Roda de Esqueletos",
        hp: 55,
        atk: 15,
        def: 10,
        specialDesc: "Giro Mortal (Dano contínuo)",
        tags: { multipleHits: 2 },
        drops: [{ id: "ferro", type: "materials", chance: 0.3 }],
      },
      {
        name: "Morcego Vampiro",
        hp: 40,
        atk: 14,
        def: 5,
        specialDesc: SKILL_SEDE_DE_SANGUE,
        tags: { lifeSteal: 0.15, dodgeChance: 0.1 },
        drops: [{ id: "couro", type: "materials", chance: 0.2 }],
      },
      {
        name: "Carrasco Zumbi",
        hp: 95,
        atk: 18,
        def: 12,
        specialDesc: "Corte Pesado (Pode atordoar)",
        tags: { stunHit: 0.1 },
        drops: [{ id: "ferro", type: "materials", chance: 0.4 }],
      },
      {
        name: "Rato Tumular",
        hp: 50,
        atk: 9,
        def: 5,
        specialDesc: "Fedor Tóco",
        tags: { poisonHit: true, dodgeChance: 0.05 },
        drops: [{ id: "couro", type: "materials", chance: 0.45 }],
      },
      {
        name: "Esqueleto Mago",
        hp: 55,
        atk: 16,
        def: 8,
        specialDesc: "Dardo de Ossos",
        tags: { magicDmg: true },
        drops: [{ id: "essencia_menor", type: "materials", chance: 0.25 }],
      },
      {
        name: "Aranha das Criptas",
        hp: 60,
        atk: 11,
        def: 10,
        specialDesc: "Tei Pegajosa",
        tags: { poisonHit: true },
        drops: [{ id: "pano_espectral", type: "materials", chance: 0.2 }],
      },
      {
        name: "Lodo Carnívoro",
        hp: 110,
        atk: 7,
        def: 20,
        specialDesc: "Corpo Amorfo (Alta defesas)",
        tags: { physicalResist: 0.3 },
        drops: [{ id: "essencia_menor", type: "materials", chance: 0.3 }],
      },

      // 5 Monstros Elites
      {
        name: "Dulahn, O Algoz Decapitado",
        isElite: true,
        hp: 160,
        atk: 22,
        def: 25,
        specialDesc: "Golpes Vampírico",
        tags: { lifeSteal: 0.2, stunImmune: true },
        drops: [
          { id: "essencia_menor", type: "materials", chance: 0.6 },
          { id: "prata", type: "materials", chance: 0.4 },
          {
            id: "elmo_dulahn",
            type: "equip",
            name: "Capuz Ensanguentado de Dulahn",
            rarity: "Magico",
            slots: "elmo",
            chance: 0.15,
            passives: [
              { type: "lifeSteal", value: 0.05, label: "+5% Roubo de Vida" },
            ],
          },
        ],
      },
      {
        name: "Cavaleiro do Crisol Decaído",
        isElite: true,
        hp: 200,
        atk: 25,
        def: 45,
        specialDesc: "Armaduras Ancestral",
        tags: { physicalResist: 0.2, stunImmune: true },
        drops: [
          { id: "prata", type: "materials", chance: 0.5 },
          {
            id: "escudo_crisol",
            type: "equip",
            name: "Escudo dos Crisol",
            rarity: "Raro",
            slots: "escudo",
            chance: 0.15,
            passives: [
              { type: "defMult", value: 0.15, label: "+15% Defesa Total" },
            ],
          },
        ],
      },
      {
        name: "Morte Menor",
        isElite: true,
        hp: 140,
        atk: 35,
        def: 15,
        specialDesc: "Foice Fantasma",
        tags: { magicDmg: true, lifeSteal: 0.25 },
        drops: [
          { id: "essencia_maior", type: "materials", chance: 0.4 },
          {
            id: "foice_morte",
            type: "equip",
            name: "Foice de Morte Menor",
            rarity: "Raro",
            slots: "armas",
            chance: 0.15,
            baseDamage: 25,
            passives: [
              { type: "lifeSteal", value: 0.1, label: "+10% Roubo de Vida" },
            ],
          },
        ],
      },
      {
        name: "Paladino Corrompido",
        isElite: true,
        hp: 180,
        atk: 20,
        def: 35,
        specialDesc: "Aura dos Desespero",
        tags: { reflectPhysical: 0.1 },
        drops: [
          { id: "ouro_bruto", type: "materials", chance: 0.3 },
          {
            id: "peito_paladino",
            type: "equip",
            name: "Placa Sagrad Corrompida",
            rarity: "Magico",
            slots: "peito",
            chance: 0.2,
          },
        ],
      },
      {
        name: "Amálgama de Ossos",
        isElite: true,
        hp: 250,
        atk: 18,
        def: 20,
        specialDesc: "Corpo Gigantesco",
        tags: { physicalResist: 0.1, stunHit: 0.1 },
        drops: [
          { id: "essencia_maior", type: "materials", chance: 0.35 },
          {
            id: "anel_osso",
            type: "equip",
            name: "Anel de Vértebras",
            rarity: "Magico",
            slots: "acessorio",
            chance: 0.25,
          },
        ],
      },
    ],
    boss: {
      name: "Lorde Necromante",
      isBoss: true,
      hp: 300,
      atk: 28,
      def: 70,
      specialDesc: "Maldição Sombrias (Caus 5 de danos contínuo)",
      passiveDesc:
        "Barreira Profana (Extremamente Resistente  Magia, massa FRACO contra Luz!)",
      tags: {
        statusImmune: true,
        resist: [
          TYPE_FOGO,
          TYPE_GELO,
          TYPE_ARCANO,
          TYPE_VENENOSA,
          TYPE_PROFANO,
        ],
        weakness: [TYPE_LUZ],
      },

      // O 5 TIPOS DE EQUIPAMENTOS DIFERENTES DOS BOSS COM SUAS CHANCES
      lootTable: [
        // 1. Arma (Raro - 25% de chance)
        {
          type: "equip",
          name: "Cajado Corrompidos dos Lorde",
          rarity: "Raro",
          slots: "armas",
          chance: 0.25,
          baseDamage: 25,
          passives: [
            { type: "ignoreDef", value: 0.1, label: "Ignora 10% de Defesa" },
          ],
        },
        // 2. Peitoral (Lendários - 5% de chance)
        {
          type: "equip",
          name: "Manto de Morte Inevitável",
          rarity: "Lendario",
          slots: "peito",
          chance: 0.05,
          baseDefense: 40,
          passives: [
            {
              type: "magicResist",
              value: 0.25,
              label: "+25% Resistência Mágica",
            },
          ],
        },
        // 3. Acessório (Mágicos - 40% de chance)
        {
          type: "equip",
          name: "Anel de Ossos Esculpido",
          rarity: "Magico",
          slots: "acessorio",
          chance: 0.4,
          baseDefense: 5,
          passives: [{ type: "map", value: 30, label: "+30 Mana Máma" }],
        },
        // 4. Botas (Raro - 20% de chance)
        {
          type: "equip",
          name: "Passos Silenciosos de Tumba",
          rarity: "Raro",
          slots: "botas",
          chance: 0.2,
          baseDefense: 15,
          passives: [{ type: "dodge", value: 0.05, label: "+5% de Evasão" }],
        },
        // 5. Escudo/Offhand (Lendários - 10% de chance)
        {
          type: "equip",
          name: "Grimório das Almas Penadas",
          rarity: "Lendario",
          slots: "escudo",
          chance: 0.1,
          baseDefense: 20,
          passives: [
            { type: "reflectDmg", value: 0.15, label: "Reflete 15% dos Dano" },
          ],
        },
      ],

      phase2: {
        threshold: 0.5,
        name: "Lich Desperto do Abismo",
        atk: 45,
        def: 30,
        healOnTransform: 50,
        message:
          "A carne podres cai... Os ossos dos Necromante brilham com puro poder!",
      },
    },
  },

  {
    id: 1,
    minLevel: 6,
    maxLevel: 10,
    name: "Pântano de Peste",
    description:
      "águas pútridas borbulham miasmas tócos. A morte aguarda nas profundezas de lama.",
    color: "#064e3b",
    fieldEffect: {
      name: "Miasma Corrosivo",
      desc: "A defesa total dos jogador é reduzida em 15%.",
      apply: (calc) => {
        calc.passives.defMult = (calc.passives.defMult || 1) - 0.15;
      },
    },
    monsters: [
      // 10 Monstros Normais
      {
        name: "Sapo Demoníaco",
        hp: 120,
        atk: 22,
        def: 12,
        specialDesc: "Pele Escorregadia",
        tags: { dodgeChance: 0.15 },
        drops: [
          { id: "escamas", type: "materials", chance: 0.45 },
          { id: "couro", type: "materials", chance: 0.25 },
        ],
      },
      {
        name: "Cultista do Lodo",
        hp: 100,
        atk: 28,
        def: 8,
        specialDesc: "Magia Sombrias",
        tags: { armorPiercing: 0.15 },
        drops: [
          { id: "quartzo", type: "materials", chance: 0.3 },
          { id: "pano_espectral", type: "materials", chance: 0.2 },
        ],
      },
      {
        name: "Lodo Ácido",
        hp: 160,
        atk: 18,
        def: 25,
        specialDesc: "Corpo Amorfo",
        tags: { physicalResist: 0.25 },
        drops: [
          { id: "ouro_bruto", type: "materials", chance: 0.3 },
          { id: "essencia_menor", type: "materials", chance: 0.15 },
        ],
      },
      {
        name: "Corvo da Podridão",
        hp: 90,
        atk: 35,
        def: 10,
        specialDesc: "Bicad Feroz (Alto Dano)",
        tags: { critChance: 0.15 },
        drops: [{ id: "couro", type: "materials", chance: 0.2 }],
      },
      {
        name: "Sanguessuga Gigante",
        hp: 85,
        atk: 15,
        def: 15,
        specialDesc: "Parasit (Venenosa e Dreno)",
        tags: { poisonHit: true, lifeSteal: 0.1 },
        drops: [{ id: "essencia_menor", type: "materials", chance: 0.35 }],
      },
      {
        name: "Verme da Lama",
        hp: 130,
        atk: 20,
        def: 18,
        specialDesc: "Ataques Surpres (Perfur armaduras)",
        tags: { armorPiercing: 0.2 },
        drops: [{ id: "escamas", type: "materials", chance: 0.4 }],
      },
      {
        name: "Bruxa Menor do Pântano",
        hp: 95,
        atk: 25,
        def: 10,
        specialDesc: "Maldição Pobre (Reduz Defesa)",
        tags: { magicDmg: true },
        drops: [{ id: "pano_espectral", type: "materials", chance: 0.3 }],
      },
      {
        name: "Cão Infectado",
        hp: 105,
        atk: 24,
        def: 12,
        specialDesc: "Fúria Rábica",
        tags: { dodgeChance: 0.1 },
        drops: [{ id: "couro", type: "materials", chance: 0.4 }],
      },
      {
        name: "Troll de Podridão",
        hp: 180,
        atk: 18,
        def: 30,
        specialDesc: "Regeneração Troll",
        tags: { hpRegenTurn: 10 },
        drops: [{ id: "ouro_bruto", type: "materials", chance: 0.25 }],
      },
      {
        name: "Árvore Podre Andante",
        hp: 200,
        atk: 14,
        def: 35,
        specialDesc: "Casc Dura",
        tags: { physicalResist: 0.3 },
        drops: [{ id: "quartzo", type: "materials", chance: 0.35 }],
      },

      // 5 Monstros Elites
      {
        name: "Vex, A Bruxa do Pântano",
        isElite: true,
        hp: 250,
        atk: 35,
        def: 20,
        specialDesc: "He de Lentidão",
        tags: { reduceDodge: 0.1, magicDamage: true },
        drops: [
          { id: "essencia_maior", type: "materials", chance: 0.5 },
          { id: "esmeralda", type: "materials", chance: 0.35 },
          {
            id: "chapeu_bruxa",
            type: "equip",
            name: "Chapéu Pontudo de Ve",
            rarity: "Magico",
            slots: "elmo",
            chance: 0.15,
            passives: [
              { type: "magicDamage", value: 0.1, label: "+10% Dano Mágicos" },
            ],
          },
        ],
      },
      {
        name: "Macaco Guardião Sem Cabeça",
        isElite: true,
        hp: 350,
        atk: 45,
        def: 25,
        specialDesc: "Fúria Primordial",
        tags: { stunHit: 0.15, multipleHits: 2 },
        drops: [
          { id: "essencia_epica", type: "materials", chance: 0.2 },
          {
            id: "lamina_simio",
            type: "equip",
            name: "Lâmina Entortad dos Símio",
            rarity: "Lendario",
            slots: "armas",
            chance: 0.1,
            baseDamage: 45,
          },
        ],
      },
      {
        name: "O Omen Caído",
        isElite: true,
        hp: 300,
        atk: 38,
        def: 40,
        specialDesc: "Chifres Amaldiçoados",
        tags: { physicalResist: 0.15, armorPiercing: 0.15 },
        drops: [
          { id: "ouro_bruto", type: "materials", chance: 0.6 },
          {
            id: "capa_omen",
            type: "equip",
            name: "Manto Esfarrapado dos Omen",
            rarity: "Raro",
            slots: "peito",
            chance: 0.2,
            baseDefense: 35,
          },
        ],
      },
      {
        name: "Besta Sanguinária",
        isElite: true,
        hp: 280,
        atk: 50,
        def: 15,
        specialDesc: "Histeri Tóca",
        tags: { poisonHit: true, dodgeChance: 0.15 },
        drops: [
          { id: "essencia_maior", type: "materials", chance: 0.4 },
          {
            id: "garras_besta",
            type: "equip",
            name: "Garras Venenosas",
            rarity: "Magico",
            slots: "armas",
            chance: 0.25,
          },
        ],
      },
      {
        name: "Kelpie, o Cavalo do Afogamento",
        isElite: true,
        hp: 320,
        atk: 32,
        def: 30,
        specialDesc: "Pisoteio das águas",
        tags: { magicDamage: true, stunHit: 0.1 },
        drops: [
          { id: "esmeralda", type: "materials", chance: 0.45 },
          {
            id: "ferradura_kelpie",
            type: "equip",
            name: "Amuleto das Marés",
            rarity: "Raro",
            slots: "acessorio",
            chance: 0.2,
          },
        ],
      },
    ],
    boss: {
      name: "Hidra Corrompida",
      isBoss: true,
      hp: 600,
      atk: 45,
      def: 90,
      specialDesc: "Sangue ácido (Atacantes sofrem danos reflexo)",
      passiveDesc: "Regeneração Reptiliana (Cura-se 15 HP por turnos)",
      tags: { reflectDmg: 0.1, hpRegenTurn: 15, statusImmune: true },
      lootTable: [
        {
          type: "equip",
          name: "Pres Peçonhenta de Hidra",
          rarity: "Raro",
          slots: "armas",
          chance: 0.25,
          baseDamage: 40,
          passives: [
            {
              type: "poisonHit",
              value: true,
              label: "Ataques aplicam Venenosa",
            },
          ],
        },
        {
          type: "equip",
          name: "Couraç Escamos Desgastada",
          rarity: "Lendario",
          slots: "peito",
          chance: 0.05,
          baseDefense: 65,
          passives: [
            { type: "hpRegen", value: 10, label: "+10 Regeneração de HP" },
          ],
        },
        {
          type: "equip",
          name: "Olho Petrificado de Besta",
          rarity: "Magico",
          slots: "acessorio",
          chance: 0.4,
          baseDefense: 8,
          passives: [
            {
              type: "poisonResist",
              value: 0.5,
              label: "+50% Resistência  Venenosa",
            },
          ],
        },
        {
          type: "equip",
          name: "Pisa-Lamas dos Pântano",
          rarity: "Raro",
          slots: "botas",
          chance: 0.2,
          baseDefense: 22,
          passives: [{ type: "dodge", value: 0.08, label: "+8% de Evasão" }],
        },
        {
          type: "equip",
          name: "Glândula cid Pútrida",
          rarity: "Lendario",
          slots: "escudo",
          chance: 0.1,
          baseDefense: 30,
          passives: [
            { type: "reflectDmg", value: 0.2, label: "Reflete 20% dos Dano" },
          ],
        },
      ],
      phase2: {
        threshold: 0.4,
        name: "Hidra Pestilenta",
        atk: 65,
        def: 60,
        healOnTransform: 100,
        message:
          "A Hidra ruge ensurdecedoramente! As cabeças decepadas se multiplicam e o pântanos treme.",
      },
    },
  },
  {
    id: 2,
    minLevel: 11,
    maxLevel: 15,
    name: "Forja Profana dos Abismo",
    description:
      "Calor insuportável. Máquinas movidas  sangue e fogo ainda ecoam batidas de martelos.",
    color: "#7f1d1d",
    fieldEffect: {
      name: "Calor Escaldantes",
      desc: "Aumenta o danos recebidos pelos jogador em 10%.",
      apply: (calc) => {
        calc.passives.damageTakenMult =
          (calc.passives.damageTakenMult || 1) * 1.1;
      },
    },
    monsters: [
      // 10 Monstros Normais
      {
        name: "Diabrete Ferreiro",
        hp: 220,
        atk: 45,
        def: 20,
        specialDesc: "Martelada Feroz",
        tags: { critChance: 0.2, critDamage: 0.5 },
        drops: [
          { id: "ferro", type: "materials", chance: 0.5 },
          { id: "carvao", type: "materials", chance: 0.6 },
        ],
      },
      {
        name: "Golem de Magma",
        hp: 400,
        atk: 30,
        def: 50,
        specialDesc: "Corpo de Fogo",
        tags: { fireImmune: true, physicalResist: 0.2 },
        drops: [
          { id: "rubi", type: "materials", chance: 0.3 },
          { id: "ouro_bruto", type: "materials", chance: 0.4 },
        ],
      },
      {
        name: "Súcubo Torturadora",
        hp: 190,
        atk: 55,
        def: 15,
        specialDesc: "Chicote de Agonia",
        tags: { armorPiercing: 0.25 },
        drops: [
          { id: "chifre_demoniaco", type: "materials", chance: 0.35 },
          { id: "essencia_menor", type: "materials", chance: 0.4 },
        ],
      },
      {
        name: "Mineiro Enlouquecido",
        hp: 200,
        atk: 40,
        def: 25,
        specialDesc: "Picaret Pesada",
        tags: { armorPiercing: 0.2 },
        drops: [{ id: "cobre", type: "materials", chance: 0.5 }],
      },
      {
        name: "Demônio de Fornalha Menor",
        hp: 280,
        atk: 35,
        def: 35,
        specialDesc: "Aura de Calor",
        tags: { auraFire: 5 },
        drops: [{ id: "carvao", type: "materials", chance: 0.45 }],
      },
      {
        name: "Verme de Magma",
        hp: 250,
        atk: 38,
        def: 22,
        specialDesc: "Cuspe de Lava",
        tags: { magicDamage: true, fireImmune: true },
        drops: [{ id: "rubi", type: "materials", chance: 0.25 }],
      },
      {
        name: "Morcego de Fogo",
        hp: 150,
        atk: 28,
        def: 12,
        specialDesc: "Rasante Flamejante",
        tags: { dodgeChance: 0.2 },
        drops: [{ id: "couro", type: "materials", chance: 0.3 }],
      },
      {
        name: "Escravo de Cinzas",
        hp: 180,
        atk: 30,
        def: 18,
        specialDesc: "Eloso aço Morrer",
        tags: { deathElosion: 50 },
        drops: [{ id: "pano_espectral", type: "materials", chance: 0.35 }],
      },
      {
        name: "Lagarto Escamoso",
        hp: 230,
        atk: 32,
        def: 40,
        specialDesc: "Carapaç de Ferro",
        tags: { physicalResist: 0.3 },
        drops: [{ id: "escamas", type: "materials", chance: 0.55 }],
      },
      {
        name: "Elemental do Fogo",
        hp: 210,
        atk: 42,
        def: 10,
        specialDesc: "Fogo Vivo",
        tags: { fireImmune: true, magicDamage: true },
        drops: [{ id: "essencia_menor", type: "materials", chance: 0.4 }],
      },

      // 5 Monstros Elites
      {
        name: "Ignis, O Arauto das Chamas",
        isElite: true,
        hp: 500,
        atk: 65,
        def: 40,
        specialDesc: "Aura Incandescente",
        tags: { auraFire: 10, stunImmune: true },
        drops: [
          { id: "essencia_epica", type: "materials", chance: 0.3 },
          { id: "rubi", type: "materials", chance: 0.8 },
          {
            id: "ombreiras_ignis",
            type: "equip",
            name: "Protetores Escaldantes de Ignis",
            rarity: "Magico",
            slots: "peito",
            chance: 0.15,
            passives: [
              {
                type: "fireResist",
                value: 0.2,
                label: "+20% Resistência  Fogo",
              },
            ],
          },
        ],
      },
      {
        name: "Zodd, O Imortal",
        isElite: true,
        hp: 600,
        atk: 75,
        def: 45,
        specialDesc: "Fúria Sanguinária",
        tags: { berserker: true, lifeSteal: 0.15 },
        drops: [
          { id: "chifre_demoniaco", type: "materials", chance: 0.6 },
          {
            id: "espada_zodd",
            type: "equip",
            name: "Montante dos Apóstolo",
            rarity: "Lendario",
            slots: "armas",
            chance: 0.1,
            baseDamage: 60,
          },
        ],
      },
      {
        name: "Perseguidor Flutuante",
        isElite: true,
        hp: 450,
        atk: 80,
        def: 35,
        specialDesc: "Investida Implacável",
        tags: { stunImmune: true, armorPiercing: 0.25 },
        drops: [
          { id: "prata", type: "materials", chance: 0.5 },
          {
            id: "anel_perseguidor",
            type: "equip",
            name: "Anel dos Perseguidor",
            rarity: "Raro",
            slots: "acessorio",
            chance: 0.2,
            passives: [{ type: "dodge", value: 0.1, label: "+10% de Evasão" }],
          },
        ],
      },
      {
        name: "Dragão de Magma Terrestre",
        isElite: true,
        hp: 550,
        atk: 60,
        def: 55,
        specialDesc: "Escamas Intransponíveis",
        tags: { physicalResist: 0.4, fireImmune: true },
        drops: [
          { id: "rubi", type: "materials", chance: 0.7 },
          {
            id: "escudo_dragao",
            type: "equip",
            name: "Escudo Escamoso de Magma",
            rarity: "Magico",
            slots: "escudo",
            chance: 0.25,
            baseDefense: 50,
          },
        ],
      },
      {
        name: "Demônio Capra",
        isElite: true,
        hp: 480,
        atk: 85,
        def: 25,
        specialDesc: "Ataques Duplo com Facões",
        tags: { multipleHits: 2, critChance: 0.2 },
        drops: [
          { id: "essencia_maior", type: "materials", chance: 0.5 },
          {
            id: "capuz_capra",
            type: "equip",
            name: "Crânio dos Demônios Menor",
            rarity: "Raro",
            slots: "elmo",
            chance: 0.2,
            baseDefense: 35,
          },
        ],
      },
    ],
    boss: {
      name: "Senhor da Forja",
      isBoss: true,
      hp: 1200,
      atk: 75,
      def: 150,
      specialDesc: "Golpes Esmagadora (Pode atordoar o jogador)",
      passiveDesc:
        "Armaduras Implacável (Altíssima Defes Física e Imune  Críticos)",
      tags: { stunHit: 0.2, critImmune: true, statusImmune: true },
      lootTable: [
        {
          type: "equip",
          name: "Quebra-Mundos dos Forjador",
          rarity: "Lendario",
          slots: "armas",
          chance: 0.05,
          baseDamage: 85,
          passives: [
            { type: "critDamage", value: 0.5, label: "+50% Dano Críticos" },
          ],
        },
        {
          type: "equip",
          name: "Placa Berrante de Magma",
          rarity: "Raro",
          slots: "peito",
          chance: 0.25,
          baseDefense: 90,
          passives: [
            {
              type: "physicalResist",
              value: 0.15,
              label: "+15% Resistência Física",
            },
          ],
        },
        {
          type: "equip",
          name: "Selo das Cinzas Eternas",
          rarity: "Magico",
          slots: "acessorio",
          chance: 0.4,
          baseDefense: 15,
          passives: [{ type: "map", value: 100, label: "+100 HP Máximo" }],
        },
        {
          type: "equip",
          name: "Botas de Aço Derretido",
          rarity: "Raro",
          slots: "botas",
          chance: 0.2,
          baseDefense: 35,
          passives: [
            { type: "fireResist", value: 0.3, label: "+30% Resistência  Fogo" },
          ],
        },
        {
          type: "equip",
          name: "Égide dos Vulcão",
          rarity: "Lendario",
          slots: "escudo",
          chance: 0.1,
          baseDefense: 45,
          passives: [
            {
              type: "blockChance",
              value: 0.25,
              label: "+25% Chance de Bloqueio",
            },
          ],
        },
      ],
      phase2: {
        threshold: 0.3,
        name: "Abominação de Carne Derretida",
        atk: 110,
        def: 80,
        healOnTransform: 300,
        message:
          "A armadura dos Senhor da Forja derrete! Seus corpos entra em pura combustão mágicas!",
      },
    },
  },

  {
    id: 3,
    minLevel: 6,
    maxLevel: 10,
    name: "Cavernas de Magma",
    description: "O calor é quase insuportável. Rios de lava cortam o caminho.",
    color: "#7a2411",
    fieldEffect: {
      name: "Calor Escaldantes",
      desc: "O jogador queima, perdendo 2 de HP  cada turnos nos combates.",
      apply: (calc) => {
        calc.passives.burnDmg = 2;
      }, // Convertido para função de cálculo
    },
    monsters: [
      // 10 Monstros Normais
      {
        name: "Elementar de Fogo",
        hp: 90,
        atk: 18,
        drops: [{ id: "essencia_fogo", type: "materials", chance: 0.2 }],
      },
      {
        name: "Lagarto de Lava",
        hp: 110,
        atk: 15,
        drops: [{ id: "escama_fogo", type: "materials", chance: 0.25 }],
      },
      {
        name: "Diabrete Flamejante",
        hp: 75,
        atk: 22,
        drops: [{ id: "carvao", type: "materials", chance: 0.4 }],
      },
      {
        name: "Cão Infernal",
        hp: 130,
        atk: 25,
        def: 20,
        drops: [{ id: "garra_queimada", type: "materials", chance: 0.3 }],
      },
      {
        name: "Salamandra de Obsidiana",
        hp: 150,
        atk: 20,
        def: 60,
        drops: [{ id: "obsidiana", type: "materials", chance: 0.2 }],
      },
      {
        name: "Esqueleto Carbonizado",
        hp: 100,
        atk: 28,
        def: 10,
        drops: [{ id: "ferro_fundido", type: "materials", chance: 0.35 }],
      },
      {
        name: "Pássaro de Fogo",
        hp: 80,
        atk: 25,
        def: 5,
        specialDesc: "Renascimento Menor",
        tags: { dodgeChance: 0.15 },
        drops: [{ id: "essencia_fogo", type: "materials", chance: 0.3 }],
      },
      {
        name: "Verme de Rocha",
        hp: 170,
        atk: 20,
        def: 40,
        specialDesc: "Armaduras Natural",
        tags: { physicalResist: 0.3 },
        drops: [{ id: "ferro", type: "materials", chance: 0.5 }],
      },
      {
        name: "Cultista de Chamas",
        hp: 95,
        atk: 30,
        def: 10,
        specialDesc: "Bolas de Fogo",
        tags: { magicDamage: true },
        drops: [{ id: "carvao", type: "materials", chance: 0.3 }],
      },
      {
        name: "Gigante de Cinzas",
        hp: 200,
        atk: 35,
        def: 20,
        specialDesc: "Soco Pesado",
        tags: { stunHit: 0.15 },
        drops: [{ id: "obsidiana", type: "materials", chance: 0.4 }],
      },

      // 5 Monstros Elites
      {
        name: "Golem de Magma Ancião",
        isElite: true,
        hp: 260,
        atk: 29,
        def: 100,
        specialDesc: "Corpo de Magma",
        tags: { reflectDmg: 0.15, fireImmune: true },
        drops: [
          { id: "nucleo_magma", type: "materials", chance: 0.5 },
          {
            id: "peitoral_magma",
            type: "equip",
            name: "Placa de Magma",
            rarity: "Magico",
            slots: "peito",
            chance: 0.15,
          },
        ],
      },
      {
        name: "Guarda-fogo Ancestral",
        isElite: true,
        hp: 280,
        atk: 45,
        def: 30,
        specialDesc: "Lâmina gnea",
        tags: { auraFire: 5, armorPiercing: 0.1 },
        drops: [
          { id: "essencia_fogo", type: "materials", chance: 0.6 },
          {
            id: "espada_fogo",
            type: "equip",
            name: "Lâmina dos Guarda-fogo",
            rarity: "Raro",
            slots: "armas",
            chance: 0.2,
            passives: [
              { type: "fireDamage", value: 0.15, label: "+15% Dano de Fogo" },
            ],
          },
        ],
      },
      {
        name: "Cavaleiro Negro de Fumaça",
        isElite: true,
        hp: 350,
        atk: 55,
        def: 50,
        specialDesc: "Montante de Cinzas",
        tags: { physicalResist: 0.25, stunImmune: true },
        drops: [
          { id: "obsidiana", type: "materials", chance: 0.7 },
          {
            id: "armadura_fumaca",
            type: "equip",
            name: "Armaduras dos Fumegante",
            rarity: "Lendario",
            slots: "peito",
            chance: 0.1,
            baseDefense: 45,
          },
        ],
      },
      {
        name: "Wyvern Vermelho Menor",
        isElite: true,
        hp: 300,
        atk: 50,
        def: 25,
        specialDesc: "Sopro de Fogo Direto",
        tags: { fireImmune: true, dodgeChance: 0.15 },
        drops: [
          { id: "escama_fogo", type: "materials", chance: 0.5 },
          {
            id: "botas_wyvern",
            type: "equip",
            name: "Garras dos Wyvern",
            rarity: "Raro",
            slots: "botas",
            chance: 0.25,
          },
        ],
      },
      {
        name: "Centopei de Lava",
        isElite: true,
        hp: 220,
        atk: 40,
        def: 45,
        specialDesc: "Mil Pernas Ardentes",
        tags: { multipleHits: 3, fireImmune: true },
        drops: [
          { id: "ferro_fundido", type: "materials", chance: 0.4 },
          {
            id: "anel_lava",
            type: "equip",
            name: "Anel de Pernas de Fogo",
            rarity: "Magico",
            slots: "acessorio",
            chance: 0.2,
          },
        ],
      },
    ],
    boss: {
      name: "Dragão Filhote",
      isBoss: true,
      hp: 450,
      atk: 35,
      def: 90,
      specialDesc: "Sopro de Fogo (Caus Queimadura grave)",
      passiveDesc:
        "Escamas de Ignição (Imune  Fogo e reflete 10% dos danos físicos)",
      tags: { fireImmune: true, reflectPhysical: 0.1 },
      lootTable: [
        {
          type: "equip",
          name: "Garra dos Dragão",
          rarity: "Raro",
          slots: "armas",
          chance: 0.2,
        },
        {
          type: "equip",
          name: "Escamas de Ignição",
          rarity: "Lendario",
          slots: "peito",
          chance: 0.05,
        },
        {
          type: "equip",
          name: "Anel dos Incêndio",
          rarity: "Magico",
          slots: "acessorio",
          chance: 0.3,
        },
        {
          type: "equip",
          name: "Botas de Cinzas",
          rarity: "Raro",
          slots: "botas",
          chance: 0.2,
        },
        {
          type: "equip",
          name: "Escudo de Obsidiana",
          rarity: "Lendario",
          slots: "escudo",
          chance: 0.1,
        },
      ],
      phase2: {
        threshold: 0.4,
        name: "Dragão Filhote (Fúria Cega)",
        atk: 55,
        def: 40,
        healOnTransform: 0,
        message:
          "As escamas dos Dragão começam  rachar, jorrando lava! Ele entra em Fúria Cega!",
      },
    },
  },
  {
    id: 4,
    minLevel: 11,
    maxLevel: 15,
    name: "Floresta das Sombras",
    description:
      "olhos text observando  cada sombras e armadilhas prontas, cuidado aventureiro...",
    color: "#27ae60",
    fieldEffect: {
      name: "Névoa de Iluso",
      desc: "A visibilidade é baixo. A chance de esquiva dos monstros aumenta levemente.",
      apply: (calc) => {
        calc.passives.enemyDodge += 0.1;
      },
    },
    monsters: [
      // 10 Monstros Normais
      {
        name: "Lobo de Ruína",
        hp: 85,
        atk: 14,
        drops: [{ id: "couro_sombrio", type: "materials", chance: 0.3 }],
      },
      {
        name: "Sentinela Kobold",
        hp: 130,
        atk: 12,
        drops: [{ id: "ferro", type: "materials", chance: 0.2 }],
      },
      {
        name: "Pequena Nepenthes",
        hp: 90,
        atk: 18,
        drops: [{ id: "seiva_toca", type: "materials", chance: 0.4 }],
      },
      {
        name: "Fada dos Pesadelos",
        hp: 70,
        atk: 10,
        drops: [{ id: "po_fada", type: "materials", chance: 0.5 }],
      },
      {
        name: "Yom Voraz",
        hp: 150,
        atk: 25,
        def: 5,
        specialDesc: "Fome Insaciável",
        tags: { lifeSteal: 0.15, magicResist: 0.2 },
        drops: [{ id: "essencia_menor", type: "materials", chance: 0.35 }],
      },
      {
        name: "Leshen Ancião",
        hp: 200,
        atk: 15,
        def: 25,
        specialDesc: "Raízes dos Bosque",
        tags: { rootEffect: true },
        drops: [{ id: "madeira_ancestral", type: "materials", chance: 0.45 }],
      },
      {
        name: "Aranha Viúva Negra",
        hp: 110,
        atk: 22,
        def: 10,
        specialDesc: "Picad Tóca",
        tags: { poisonHit: true },
        drops: [{ id: "pano_espectral", type: "materials", chance: 0.3 }],
      },
      {
        name: "Ent Corrompido",
        hp: 250,
        atk: 18,
        def: 40,
        specialDesc: "Casc Espessa",
        tags: { physicalResist: 0.3 },
        drops: [{ id: "madeira_ancestral", type: "materials", chance: 0.5 }],
      },
      {
        name: "Cultista de Floresta",
        hp: 120,
        atk: 28,
        def: 12,
        specialDesc: "Miasma das Fadas",
        tags: { magicDamage: true },
        drops: [{ id: "essencia_menor", type: "materials", chance: 0.4 }],
      },
      {
        name: "Verme de Madeira",
        hp: 140,
        atk: 20,
        def: 30,
        specialDesc: "Mordida Perfurante",
        tags: { armorPiercing: 0.15 },
        drops: [{ id: "escamas", type: "materials", chance: 0.35 }],
      },

      // 5 Monstros Elites
      {
        name: "Madeira Viva",
        isElite: true,
        hp: 180,
        atk: 25,
        def: 35,
        specialDesc: "Raízes Entalhadoras",
        tags: { rootEffect: true, physicalResist: 0.2 },
        drops: [
          { id: "madeira_ancestral", type: "materials", chance: 0.5 },
          {
            id: "arco_floresta",
            type: "equip",
            name: "Arco dos Anciãos",
            rarity: "Magico",
            slots: "armas",
            chance: 0.15,
          },
        ],
      },
      {
        name: "Priscilla, A Desperta",
        isElite: true,
        hp: 320,
        atk: 45,
        def: 20,
        specialDesc: "Cortes Invisíveis",
        tags: { armorPiercing: 0.2, dodgeChance: 0.15 },
        drops: [
          { id: "essencia_maior", type: "materials", chance: 0.5 },
          {
            id: "montante_prata",
            type: "equip",
            name: "Montante Prateado Desperto",
            rarity: "Raro",
            slots: "armas",
            chance: 0.2,
            baseDamage: 40,
          },
        ],
      },
      {
        name: "O Demônio do Refúgio",
        isElite: true,
        hp: 450,
        atk: 55,
        def: 40,
        specialDesc: "Salto Esmagadora",
        tags: { stunHit: 0.2 },
        drops: [
          { id: "ouro_bruto", type: "materials", chance: 0.6 },
          {
            id: "clava_demonio",
            type: "equip",
            name: "Clav dos Demônios Gordo",
            rarity: "Raro",
            slots: "armas",
            chance: 0.15,
            baseDamage: 55,
          },
        ],
      },
      {
        name: "Fiend, A Fera de Chifres",
        isElite: true,
        hp: 380,
        atk: 40,
        def: 30,
        specialDesc: "Terceiro Olho Mágicos",
        tags: { magicDamage: true, lifeSteal: 0.1 },
        drops: [
          { id: "essencia_maior", type: "materials", chance: 0.55 },
          {
            id: "chifre_fiend",
            type: "equip",
            name: "Coroa de Galhos e Sangue",
            rarity: "Magico",
            slots: "elmo",
            chance: 0.25,
            baseDefense: 28,
          },
        ],
      },
      {
        name: "Riful do Oeste",
        isElite: true,
        hp: 350,
        atk: 60,
        def: 25,
        specialDesc: "Chicotes Abissais",
        tags: { multipleHits: 3, armorPiercing: 0.1 },
        drops: [
          { id: "essencia_epica", type: "materials", chance: 0.3 },
          {
            id: "veste_riful",
            type: "equip",
            name: "Manto dos Despertar",
            rarity: "Lendario",
            slots: "peito",
            chance: 0.1,
            baseDefense: 45,
          },
        ],
      },
    ],
    boss: {
      name: "Illfang, o Rei Kobold",
      isBoss: true,
      hp: 600,
      atk: 55,
      def: 200,
      specialDesc: "Troca de Arma (Ganha ataques extra quando ferido)",
      passiveDesc: "Imune  Gelo (tem altas resistencias  ataques congelantes)",
      tags: { iceImmune: true, statusImmune: true },
      lootTable: [
        {
          type: "equip",
          name: "Nodachi dos Rei Kobolds",
          rarity: "Raro",
          slots: "armas",
          chance: 0.25,
        },
        {
          type: "equip",
          name: "Armaduras de Couro Reforado",
          rarity: "Lendario",
          slots: "peito",
          chance: 0.05,
        },
        {
          type: "equip",
          name: "Amuleto de Tribo",
          rarity: "Magico",
          slots: "acessorio",
          chance: 0.4,
        },
        {
          type: "equip",
          name: "Botas dos Predador",
          rarity: "Raro",
          slots: "botas",
          chance: 0.2,
        },
        {
          type: "equip",
          name: "Escudo de Madeira Viva",
          rarity: "Lendario",
          slots: "escudo",
          chance: 0.1,
        },
      ],
      phase2: {
        threshold: 0.5,
        name: "Illfang, o Lorde Enfurecido",
        atk: 70,
        def: 150,
        healOnTransform: 0,
        message: "Illfang troca suas armas e seus olhos brilham em vermelho!",
      },
    },
  },
  {
    id: 5,
    minLevel: 16,
    maxLevel: 20,
    name: "Abismo de Cristal",
    description:
      "nos se deixe enganar pelas beleza, pois ate  mais bela flor pode ter espinhos",
    color: "#00d2ff",
    fieldEffect: {
      name: "Frio Congelante",
      desc: "O frios drena os músculos. Ações custam mais energias/estamina.",
      apply: (calc) => {
        calc.passives.staminaCost += 1;
      },
    },
    monsters: [
      // 10 Monstros Normais
      {
        name: "Elemental de Gelo",
        hp: 150,
        atk: 20,
        drops: [{ id: "fragmento_gelo", type: "materials", chance: 0.4 }],
      },
      {
        name: "Morcego de Cristal",
        hp: 70,
        atk: 28,
        drops: [{ id: "asa_cristal", type: "materials", chance: 0.3 }],
      },
      {
        name: "Cria de Seath",
        hp: 180,
        atk: 25,
        def: 20,
        specialDesc: "Cristalização (Ataques mágicos perfuram armaduras)",
        tags: { magicDamage: true, armorPiercing: 0.2 },
        drops: [{ id: "quartzo", type: "materials", chance: 0.45 }],
      },
      {
        name: "Feiticeiro Enlouquecido",
        hp: 110,
        atk: 35,
        def: 10,
        specialDesc: "Lança de Almas",
        tags: { magicDamage: true },
        drops: [{ id: "essencia_menor", type: "materials", chance: 0.3 }],
      },
      {
        name: "Borbolet de Cristal",
        hp: 80,
        atk: 15,
        def: 5,
        specialDesc: "Poeir Mágicas (Evita Críticos)",
        tags: { critImmune: true, dodgeChance: 0.25 },
        drops: [{ id: "po_fada", type: "materials", chance: 0.4 }],
      },
      {
        name: "Esqueleto Mágico",
        hp: 130,
        atk: 22,
        def: 15,
        specialDesc: "Bris Congelante",
        tags: { magicDamage: true },
        drops: [{ id: "ferro", type: "materials", chance: 0.35 }],
      },
      {
        name: "Lobo das Estrelas",
        hp: 140,
        atk: 30,
        def: 12,
        specialDesc: "Bote Astral",
        tags: { dodgeChance: 0.15 },
        drops: [{ id: "couro", type: "materials", chance: 0.4 }],
      },
      {
        name: "Marionete Quebrada",
        hp: 160,
        atk: 18,
        def: 25,
        specialDesc: "Ataques Errático",
        tags: { multipleHits: 2 },
        drops: [{ id: "ferro_fundido", type: "materials", chance: 0.5 }],
      },
      {
        name: "Ratos de Biblioteca",
        hp: 60,
        atk: 12,
        def: 5,
        specialDesc: "Conhecimento Proibido",
        tags: { poisonHit: true },
        drops: [{ id: "pergaminho_velho", type: "materials", chance: 0.3 }],
      },
      {
        name: "Espectro Arcano",
        hp: 100,
        atk: 32,
        def: 5,
        specialDesc: "Incorpóreo",
        tags: { physicalResist: 0.5, magicDamage: true },
        drops: [{ id: "pano_espectral", type: "materials", chance: 0.4 }],
      },

      // 5 Monstros Elites
      {
        name: "Golem de Prata",
        isElite: true,
        hp: 200,
        atk: 15,
        specialDesc: "Reflexo Cristalino (Bloqueio)",
        tags: { blockChance: 0.2 },
        drops: [
          { id: "prata_pura", type: "materials", chance: 0.6 },
          {
            id: "espada_cristal",
            type: "equip",
            name: "Lâmina de Prata Cristalina",
            rarity: "Magico",
            slots: "armas",
            chance: 0.15,
          },
        ],
      },
      {
        name: "Renna,  Iluso",
        isElite: true,
        hp: 280,
        atk: 45,
        def: 20,
        specialDesc: "Chuv de Cometas",
        tags: { magicDamage: true, multipleHits: 2 },
        drops: [
          { id: "essencia_maior", type: "materials", chance: 0.5 },
          {
            id: "chapeu_neve",
            type: "equip",
            name: "Chapéu de Bruxa de Neve",
            rarity: "Lendario",
            slots: "elmo",
            chance: 0.15,
            passives: [
              { type: "magicDamage", value: 0.2, label: "+20% Dano Mágicos" },
            ],
          },
        ],
      },
      {
        name: "Sábio de Cristal",
        isElite: true,
        hp: 320,
        atk: 55,
        def: 15,
        specialDesc: "Magia Perfurante",
        tags: { armorPiercing: 0.4, magicDamage: true },
        drops: [
          { id: "quartzo", type: "materials", chance: 0.6 },
          {
            id: "cajado_sabio",
            type: "equip",
            name: "Cajado dos Sábio",
            rarity: "Raro",
            slots: "armas",
            chance: 0.25,
            baseDamage: 40,
          },
        ],
      },
      {
        name: "Lobo Cinzento Gigante",
        isElite: true,
        hp: 450,
        atk: 60,
        def: 40,
        specialDesc: "Agilidade Bestial (Alta Esquiva)",
        tags: { dodgeChance: 0.25 },
        drops: [
          { id: "essencia_epica", type: "materials", chance: 0.25 },
          {
            id: "anel_lobo",
            type: "equip",
            name: "Anel dos Lobo Guardião",
            rarity: "Lendario",
            slots: "acessorio",
            chance: 0.1,
            passives: [{ type: "dodge", value: 0.15, label: "+15% Evasão" }],
          },
        ],
      },
      {
        name: "Arauto de Lua",
        isElite: true,
        hp: 380,
        atk: 50,
        def: 35,
        specialDesc: "Gravidade Zero (Imune  Atordoamento)",
        tags: { stunImmune: true, magicDamage: true },
        drops: [
          { id: "essencia_maior", type: "materials", chance: 0.4 },
          {
            id: "manto_lua",
            type: "equip",
            name: "Manto dos Arauto Minguante",
            rarity: "Raro",
            slots: "peito",
            chance: 0.2,
            baseDefense: 30,
          },
        ],
      },
    ],
    boss: {
      name: "X'rphan, o Dragão Branco",
      isBoss: true,
      hp: 900,
      atk: 50,
      def: 400,
      specialDesc: "Sopro Congelante",
      passiveDesc: "Pele de Diamante (Imune  ataques físicos fracos)",
      tags: { physicalImmuneLow: true },
      lootTable: [
        {
          type: "equip",
          name: "Cajado dos Dragão Branco",
          rarity: "Raro",
          slots: "armas",
          chance: 0.25,
        },
        {
          type: "equip",
          name: "Manto de Diamante",
          rarity: "Lendario",
          slots: "peito",
          chance: 0.05,
        },
        {
          type: "equip",
          name: "Anel dos Gelo Eterno",
          rarity: "Magico",
          slots: "acessorio",
          chance: 0.4,
        },
        {
          type: "equip",
          name: "Botas Glaciais",
          rarity: "Raro",
          slots: "botas",
          chance: 0.2,
        },
        {
          type: "equip",
          name: "Escudo Prismático",
          rarity: "Lendario",
          slots: "escudo",
          chance: 0.1,
        },
      ],
      phase2: {
        threshold: 0.3,
        name: "X'rphan, Aspecto do Gelo",
        atk: 80,
        def: 200,
        healOnTransform: 100,
        message: "O dragão ruge e o ambiente congela completamente!",
      },
    },
  },
  {
    id: 6,
    minLevel: 21,
    maxLevel: 25,
    name: "Corredores dos Eclipse",
    color: "#8e44ad",
    description:
      "Os corredores se estendem infinitamente sob  luz de uma sol negro.",
    fieldEffect: {
      name: "Miasma dos Medo",
      desc: "O terror domina  mente. A eficácia das curas é reduzida pelas metade.",
      apply: (calc) => {
        calc.passives.healMult = 0.5;
      },
    },
    monsters: [
      // 10 Monstros Normais
      {
        name: "Cavaleiro Caído",
        hp: 220,
        atk: 30,
        drops: [{ id: "ferro_negro", type: "materials", chance: 0.3 }],
      },
      {
        name: "Gárgula de Obsidiana",
        hp: 180,
        atk: 35,
        drops: [{ id: "pedra_sombria", type: "materials", chance: 0.4 }],
      },
      {
        name: "Apóstolo Menor",
        hp: 150,
        atk: 40,
        def: 20,
        specialDesc: "Corrupção (Reduz Defesa)",
        tags: { armorPiercing: 0.15 },
        drops: [{ id: "essencia_sombria", type: "materials", chance: 0.35 }],
      },
      {
        name: "Semente dos Mal",
        hp: 200,
        atk: 25,
        def: 30,
        specialDesc: "Broto Amaldiçoado",
        tags: { poisonHit: true },
        drops: [{ id: "madeira_ancestral", type: "materials", chance: 0.3 }],
      },
      {
        name: "Cria Cósmica",
        hp: 160,
        atk: 45,
        def: 10,
        specialDesc: "Mentes Incompreensível",
        tags: { magicDamage: true, dodgeChance: 0.2 },
        drops: [{ id: "essencia_maior", type: "materials", chance: 0.25 }],
      },
      {
        name: "Devorador de Mentes",
        hp: 140,
        atk: 50,
        def: 5,
        specialDesc: "Suga-Mentes",
        tags: { magicDamage: true },
        drops: [{ id: "pano_espectral", type: "materials", chance: 0.4 }],
      },
      {
        name: "Cavaleiro dos Sol Negro",
        hp: 250,
        atk: 35,
        def: 45,
        specialDesc: "Armaduras dos Eclipse",
        tags: { physicalResist: 0.25 },
        drops: [{ id: "ferro_negro", type: "materials", chance: 0.5 }],
      },
      {
        name: "Sombra Distorcida",
        hp: 120,
        atk: 38,
        def: 0,
        specialDesc: "Form Intangível",
        tags: { physicalResist: 0.6, magicDamage: true },
        drops: [{ id: "essencia_sombria", type: "materials", chance: 0.3 }],
      },
      {
        name: "Carniçal do Eclipse",
        hp: 190,
        atk: 28,
        def: 15,
        specialDesc: "Fome Cósmica",
        tags: { lifeSteal: 0.2 },
        drops: [{ id: "couro_sombrio", type: "materials", chance: 0.45 }],
      },
      {
        name: "Verme do Vazio",
        hp: 280,
        atk: 25,
        def: 35,
        specialDesc: "Rastejante dos Abismo",
        tags: { armorPiercing: 0.25 },
        drops: [{ id: "pedra_sombria", type: "materials", chance: 0.4 }],
      },

      // 5 Monstros Elites
      {
        name: "Cultista das Sombras",
        isElite: true,
        hp: 340,
        atk: 45,
        specialDesc: "Vínculo Sombrio (Drena vida dos jogador)",
        tags: { lifeDrain: 10, magicDamage: true },
        drops: [
          { id: "essencia_sombria", type: "materials", chance: 0.5 },
          {
            id: "capuz_eclipse",
            type: "equip",
            name: "Capuz dos Eclipse",
            rarity: "Magico",
            slots: "elmo",
            chance: 0.15,
          },
        ],
      },
      {
        name: "Artorias, O Corrompido",
        isElite: true,
        hp: 550,
        atk: 85,
        def: 60,
        specialDesc: "Lobo Errante (Ataques Aéreo)",
        tags: { stunHit: 0.25, physicalResist: 0.3 },
        drops: [
          { id: "essencia_epica", type: "materials", chance: 0.4 },
          {
            id: "espada_abismo",
            type: "equip",
            name: "Espadas Grande dos Abismo",
            rarity: "Lendario",
            slots: "armas",
            chance: 0.1,
            baseDamage: 80,
          },
        ],
      },
      {
        name: "Femto, O Falcão Negro",
        isElite: true,
        hp: 600,
        atk: 90,
        def: 40,
        specialDesc: "Distorção Espacial",
        tags: { dodgeChance: 0.35, magicDamage: true },
        drops: [
          { id: "essencia_epica", type: "materials", chance: 0.5 },
          {
            id: "armadura_femto",
            type: "equip",
            name: "Carapaç dos Falcão Negro",
            rarity: "Lendario",
            slots: "peito",
            chance: 0.1,
            baseDefense: 70,
          },
        ],
      },
      {
        name: "Grunbeld, O Dragão de Fogo",
        isElite: true,
        hp: 700,
        atk: 75,
        def: 80,
        specialDesc: "Canhão de Cristal",
        tags: { fireImmune: true, multipleHits: 2 },
        drops: [
          { id: "pedra_sombria", type: "materials", chance: 0.7 },
          {
            id: "escudo_grunbeld",
            type: "equip",
            name: "Escudo Escamas de Fogo",
            rarity: "Lendario",
            slots: "escudo",
            chance: 0.15,
            baseDefense: 65,
          },
        ],
      },
      {
        name: "ÓÓrfão de Kos",
        isElite: true,
        hp: 450,
        atk: 110,
        def: 20,
        specialDesc: "Grito Ensurdecedor (Gera Fúria)",
        tags: { berserker: true, stunImmune: true },
        drops: [
          { id: "essencia_maior", type: "materials", chance: 0.6 },
          {
            id: "arma_kos",
            type: "equip",
            name: "Placent Laminada",
            rarity: "Lendario",
            slots: "armas",
            chance: 0.15,
            baseDamage: 95,
          },
        ],
      },
    ],
    boss: {
      name: "The Gleam Eyes",
      isBoss: true,
      hp: 2000,
      atk: 200,
      def: 300,
      specialDesc: "Lâmina Gigante (Golpes em área)",
      passiveDesc:
        "Olhar dos Demônios (Aumenta o danos recebidos pelos jogador)",
      tags: { highDmg: true, defenseDebuff: true },
      lootTable: [
        {
          type: "equip",
          name: "Demon Blade",
          rarity: "Lendario",
          slots: "armas",
          chance: 0.1,
        },
        {
          type: "equip",
          name: "Armadura Demoníaca",
          rarity: "Lendario",
          slots: "peito",
          chance: 0.05,
        },
        {
          type: "equip",
          name: "Olho do Demônio",
          rarity: "Raro",
          slots: "acessorio",
          chance: 0.3,
        },
        {
          type: "equip",
          name: "Botas do Eclipse",
          rarity: "Raro",
          slots: "botas",
          chance: 0.2,
        },
        {
          type: "equip",
          name: "Escudo do Medo",
          rarity: "Magico",
          slots: "escudo",
          chance: 0.35,
        },
      ],
      phase2: {
        threshold: 0.2,
        name: "The Gleam Eyes (Eclipse Total)",
        atk: 150,
        def: 100,
        healOnTransform: 200,
        message:
          "O demônio entra em fúria total! Seus olhos brilham intensamente!",
      },
    },
  },
];

// ====================== BOSS SETS (CONJUNTOS ELITE) ======================
window.BOSS_SETS = {
  "Hidra Corrompida": {
     setName: "Escamas da Hidra",
     passives: [
       { req: 2, label: "Pele Escamosa", desc: "+20% de HP Máximo", type: "hpMult", value: 0.2 },
       { req: 4, label: "Coração da Hidra", desc: "Regenera 3% do HP ao fim do turno, mas sofre 2x de dano de Fogo", type: "epic_troll_heart", value: 1 }
     ]
  },
  "Illfang, o Rei Kobold": {
     setName: "Herança de Illfang",
     passives: [
       { req: 2, label: "Reflexos do Rei", desc: "+15% Evasão Focada", type: "evasion", value: 0.15 },
       { req: 4, label: "Carapaça Peçonhenta", desc: "Ao sofrer dano físico, inflige veneno severo no atacante", type: "epic_poison_shell", value: 1 }
     ]
  },
  "Lorde Necromante": {
     setName: "Veste da Morte Inevitável",
     passives: [
       { req: 2, label: "Força Profana", desc: "+20% Ataque Bruto", type: "atkMult", value: 0.2 },
       { req: 4, label: "Carrasco Impiedoso", desc: "Ignora 100% da Armadura de inimigos com < 30% HP", type: "epic_executioner", value: 1 }
     ]
  },
  "The Gleam Eyes": {
     setName: "Fúria do Demônio",
     passives: [
       { req: 2, label: "Gula Demoníaca", desc: "+10% Roubo de Vida", type: "lifeSteal", value: 0.10 },
       { req: 4, label: "Frenesi de Sangue", desc: "Críticos curam 5% do HP e dão +10% de Ataque", type: "epic_blood_frenzy", value: 1 }
     ]
  }
};

// =========================================================================
//  SISTEMA DE FUSÃO ACUMULATIVA DE HABILIDADES
// =========================================================================

window.MASTER_FUSION_DATA = {
  Guerreiro: [
    {
      id: "f_g12",
      name: "Impacto Escudeiro Brutal",
      cost: 25,
      ratio: 2.0,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "stun", chance: 0.5, duration: 2 },
      desc: "Um avanço perfurante seguido de uma escudada letal. Ignora defesa parcial e atordoa o inimigo.",
      passives: "Rank 5: Chance de atordoar sobe para 80%.",
    },
    {
      id: "f_g23",
      name: "Fortaleza Viva",
      cost: 30,
      ratio: 1.0,
      stats: STAT_CON,
      type: TYPE_FISICO,
      effect: { type: "buff_def", value: 50, duration: 3 },
      desc: "Assume uma postura impenetrável e contra-ataca. Grande aumento de defesa.",
      passives:
        "Rank 5: Ganha imunidade a atordoamentos enquanto a postura durar.",
    },
    {
      id: "f_g14",
      name: "Grito Rasga-Armadura",
      cost: 20,
      ratio: 1.2,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "ignoreDef", value: 0.4 },
      desc: "Um rugido que estilhaça a guarda inimiga junto com um golpe.",
      passives: "Rank 5: Passa a ignorar 70% da defesa.",
    },
    {
      id: "f_g45",
      name: "Fenda Sísmica Ofuscante",
      cost: 35,
      ratio: 2.2,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      aoe: true,
      effect: { type: "blind", chance: 0.6, duration: 2 },
      desc: "Fende o chão com tanta força que detritos ofuscam a visão de todos.",
      passives: "Rank 5: Causa +30% de dano se o alvo ficar cego.",
    },
    {
      id: "f_g15",
      name: "Descent Perfurante",
      cost: 40,
      ratio: 2.5,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "ignoreDef", value: 0.5 },
      desc: "Combina o salto do Fender Solo com a mira do Impacto Perfurante.",
      passives:
        "Rank 5: Dano crítico garantido se o alvo estiver com defesa reduzida.",
    },
  ],
  Arcanista: [
    {
      id: "f_a12",
      name: "Vórtice de Fogo e Gelo",
      cost: 35,
      ratio: 2.2,
      stats: STAT_INT,
      type: TYPE_ARCANO,
      effect: { type: "freeze", chance: 0.4, duration: 1 },
      desc: "Funde chamas extremas e gelo permafrost. Causa choque térmico imediato.",
      passives:
        "Rank 5: Se congelar, queima o alvo ao mesmo tempo (dano extra).",
    },
    {
      id: "f_a13",
      name: "Plasma Volátil",
      cost: 40,
      ratio: 2.5,
      stats: STAT_INT,
      type: TYPE_FOGO,
      effect: { type: "burn", duration: 4, ratio: 0.4 },
      desc: "Energiza o fogo com eletricidade. O fogo passa a ser energia pura.",
      passives:
        "Rank 5: Queimadura dobra de dano se o alvo estiver cego pelo raio.",
    },
    {
      id: "f_a24",
      name: "Barreira de Permafrost",
      cost: 30,
      ratio: 0,
      stats: STAT_INT,
      type: TYPE_SUPORTE,
      effect: { type: "buff_def", value: 40, duration: 3 },
      desc: "O Escudo de Mana congela. Além da defesa, quem bater sofrerá lentidão ou congelamento.",
      passives: "Rank 5: 30% de chance de congelar o atacante corpo-a-corpo.",
    },
    {
      id: "f_a34",
      name: "Escudo Tesla",
      cost: 35,
      ratio: 1.0,
      stats: STAT_INT,
      type: TYPE_RAIO,
      effect: { type: "blind", chance: 0.4, duration: 2 },
      desc: "O escudo irradia relâmpagos. Eletrocuta qualquer inimigo próximo.",
      passives: "Rank 5: Reflete 50% do dano recebido como dano de Raio.",
    },
    {
      id: "f_a14",
      name: "Aura de Imolação Arcana",
      cost: 45,
      ratio: 1.5,
      stats: STAT_INT,
      type: TYPE_FOGO,
      effect: { type: "burn", duration: 5, ratio: 0.3 },
      desc: "Você se torna o epicentro de uma tempestade de chamas protetora.",
      passives:
        "Rank 5: Ganha imunidade a danos de fogo e gelo enquanto a aura persistir.",
    },
  ],
  Ranger: [
    {
      id: "f_r12",
      name: "Flecha Envenenada Explosiva",
      cost: 30,
      ratio: 2.0,
      stats: STAT_AGI,
      type: TYPE_FISICO,
      aoe: true,
      effect: { type: "poison", duration: 3, ratio: 0.3 },
      desc: "Uma flecha que espalha toxinas em área no momento do impacto.",
      passives: "Rank 5: O veneno se espalha para os monstros adjacentes.",
    },
    {
      id: "f_r23",
      name: "Disparo Penetrante Venenoso",
      cost: 35,
      ratio: 2.4,
      stats: STAT_AGI,
      type: TYPE_FISICO,
      effect: { type: "ignoreDef", value: 0.4 },
      desc: "Flecha veloz que atravessa armaduras para injetar peçonha.",
      passives:
        "Rank 5: 100% de chance de acerto crítico contra alvos envenenados.",
    },
    {
      id: "f_r34",
      name: "Armadilha de Espinhos Mortais",
      cost: 25,
      ratio: 1.5,
      stats: STAT_AGI,
      type: TYPE_FISICO,
      effect: { type: "stun", chance: 0.6, duration: 2 },
      desc: "Uma arapuca que além de imobilizar, causa um intenso sangramento.",
      passives: "Rank 5: O atordoamento dura 1 turno a mais.",
    },
    {
      id: "f_r14",
      name: "Chuva de Armadilhas",
      cost: 40,
      ratio: 1.8,
      stats: STAT_AGI,
      type: TYPE_FISICO,
      effect: { type: "stun", chance: 0.4, duration: 1 },
      desc: "Dispara redes e espinhos pelo ar que prendem todo o campo.",
      passives:
        "Rank 5: Aumenta a velocidade (AGI) do herói em 20% ao conjurar.",
    },
    {
      id: "f_r25",
      name: "Tiro Fantasma",
      cost: 45,
      ratio: 3.0,
      stats: STAT_AGI,
      type: TYPE_FISICO,
      effect: { type: "blind", chance: 0.5, duration: 1 },
      desc: "O arqueiro desaparece momentaneamente e dispara do ponto cego do inimigo.",
      passives: "Rank 5: Invulnerável no turno de uso.",
    },
  ],
  Barbaro: [
    {
      id: "f_b12",
      name: "Golpe Hemorrágico Devastador",
      cost: 35,
      ratio: 2.5,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "bleed", duration: 4, ratio: 0.5 },
      desc: "Um corte tão profundo que a hemorragia é praticamente fatal.",
      passives: "Rank 5: O dano de sangramento ignora todas as resistências.",
    },
    {
      id: "f_b23",
      name: "Frenesi do Sanguinário",
      cost: 40,
      ratio: 1.5,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "buff_atk", value: 40, duration: 3 },
      desc: "Entra num estado de loucura, aumentando o ataque quanto mais sangra o inimigo.",
      passives: "Rank 5: Rouba 20% da vida de todo o dano causado sob frenesi.",
    },
    {
      id: "f_b34",
      name: "Grito de Guerra Ensurdecedor",
      cost: 25,
      ratio: 0,
      stats: STAT_FORCA,
      type: TYPE_SUPORTE,
      aoe: true,
      effect: { type: "stun", chance: 0.7, duration: 1 },
      desc: "Rugido gutural que paralisa todos de medo.",
      passives: "Rank 5: Diminui a defesa do inimigo atordoado em 30%.",
    },
    {
      id: "f_b14",
      name: "Terremoto Bárbaro",
      cost: 45,
      ratio: 2.8,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      effect: { type: "stun", chance: 0.5, duration: 1 },
      desc: "Esmaga o solo liberando toda a raiva acumulada.",
      passives:
        "Rank 5: O dano base dobra se o Herói estiver com menos de 30% de HP.",
    },
    {
      id: "f_b25",
      name: "Carnificina Giratória",
      cost: 50,
      ratio: 3.2,
      stats: STAT_FORCA,
      type: TYPE_FISICO,
      aoe: true,
      effect: { type: "bleed", duration: 3, ratio: 0.3 },
      desc: "Gira com as armas espalhando destruição e sangue para todos os lados.",
      passives:
        "Rank 5: Chance de acerto crítico aumentada em 50% durante a execução.",
    },
  ],
  Paladino: [
    {
      id: "f_p12",
      name: "Julgamento Divino",
      cost: 35,
      ratio: 2.2,
      stats: STAT_SAB,
      type: TYPE_LUZ,
      effect: { type: "stun", chance: 0.4, duration: 1 },
      desc: "A luz celestial não apenas queima os ímpios, mas também os pune com imobilização.",
      passives:
        "Rank 5: O atordoamento não pode ser resistido por mortos-vivos ou demônios.",
    },
    {
      id: "f_p23",
      name: "Escudo do Mártir",
      cost: 40,
      ratio: 1.0,
      stats: STAT_CON,
      type: TYPE_LUZ,
      effect: { type: "buff_def", value: 60, duration: 3 },
      desc: "Uma aura dourada intransponível. Cura ferimentos menores ao absorver golpes.",
      passives:
        "Rank 5: Absorve 100% de um ataque letal, deixando o Paladino com 1 HP (uma vez).",
    },
    {
      id: "f_p34",
      name: "Consagração Curativa",
      cost: 45,
      ratio: 0,
      stats: STAT_SAB,
      type: TYPE_SUPORTE,
      effect: { type: "regen", value: 50, duration: 4 },
      desc: "Santifica o chão, curando o herói e seus aliados massivamente.",
      passives:
        "Rank 5: Aumenta a defesa máxima de todos que pisam no solo consagrado.",
    },
    {
      id: "f_p14",
      name: "Lâmina da Redenção",
      cost: 35,
      ratio: 2.5,
      stats: STAT_FORCA,
      type: TYPE_LUZ,
      effect: { type: "ignoreDef", value: 0.3 },
      desc: "Um corte imbuído com poder sagrado e que rasga armaduras corruptas.",
      passives: "Rank 5: Concede um pequeno escudo (20% do dano) ao atacante.",
    },
    {
      id: "f_p25",
      name: "Fúria dos Céus",
      cost: 55,
      ratio: 3.5,
      stats: STAT_SAB,
      type: TYPE_LUZ,
      effect: { type: "blind", chance: 0.8, duration: 2 },
      desc: "Invoca um pilar de luz avassalador.",
      passives:
        "Rank 5: Reduz em 50% todo o dano sagrado recebido no próximo turno.",
    },
  ],
  Necromante: [
    {
      id: "f_n12",
      name: "Explosão de Ossos Pestilenta",
      cost: 35,
      ratio: 2.0,
      stats: STAT_INT,
      type: TYPE_PROFANO,
      effect: { type: "poison", duration: 4, ratio: 0.3 },
      desc: "Ossos infundidos com peste explodem liberando miasma no inimigo.",
      passives: "Rank 5: A duração do veneno sobe para 6 turnos.",
    },
    {
      id: "f_n23",
      name: "Foice de Drenar Almas",
      cost: 40,
      ratio: 2.5,
      stats: STAT_INT,
      type: TYPE_PROFANO,
      effect: { type: "regen", value: 40, duration: 1 },
      desc: "Cortar a essência inimiga não só machuca, como regenera a vida do lançador rapidamente.",
      passives: "Rank 5: Cura equivale a 50% do dano causado.",
    },
    {
      id: "f_n34",
      name: "Muralha de Cadáveres",
      cost: 45,
      ratio: 1.0,
      stats: STAT_INT,
      type: TYPE_SUPORTE,
      effect: { type: "buff_def", value: 50, duration: 4 },
      desc: "Levanta um muro profano para se esconder e absorver impacto.",
      passives:
        "Rank 5: Atacantes corpo-a-corpo sofrem dano de espinhos profanos.",
    },
    {
      id: "f_n14",
      name: "Tempestade de Almas",
      cost: 55,
      ratio: 3.0,
      stats: STAT_INT,
      type: TYPE_PROFANO,
      effect: { type: "blind", chance: 0.6, duration: 2 },
      desc: "Centenas de espíritos rasgam o alvo, deixando-o desorientado e ferido.",
      passives:
        "Rank 5: Reduz permanentemente 10% do ataque do inimigo afetado.",
    },
    {
      id: "f_n25",
      name: "Maldição Pura",
      cost: 30,
      ratio: 0,
      stats: STAT_INT,
      type: TYPE_SUPORTE,
      effect: { type: "ignoreDef", value: 1.0 }, // Remove armor
      desc: "Apodrece a armadura e proteção mágica do inimigo, reduzindo-a a zero momentaneamente.",
      passives:
        "Rank 5: A maldição também drena a regeneração natural do monstro.",
    },
  ],
};

window.MASTER_FUSION_RECIPES = {
  // Guerreiro
  "g1+g2": "f_g12",
  "g2+g3": "f_g23",
  "g1+g4": "f_g14",
  "g4+g5": "f_g45",
  "g1+g5": "f_g15",
  // Arcanista
  "a1+a2": "f_a12",
  "a1+a3": "f_a13",
  "a2+a4": "f_a24",
  "a3+a4": "f_a34",
  "a1+a4": "f_a14",
  // Ranger
  "r1+r2": "f_r12",
  "r2+r3": "f_r23",
  "r3+r4": "f_r34",
  "r1+r4": "f_r14",
  "r2+r5": "f_r25",
  // Bárbaro
  "b1+b2": "f_b12",
  "b2+b3": "f_b23",
  "b3+b4": "f_b34",
  "b1+b4": "f_b14",
  "b2+b5": "f_b25",
  // Paladino
  "p1+p2": "f_p12",
  "p2+p3": "f_p23",
  "p3+p4": "f_p34",
  "p1+p4": "f_p14",
  "p2+p5": "f_p25",
  // Necromante
  "n1+n2": "f_n12",
  "n2+n3": "f_n23",
  "n3+n4": "f_n34",
  "n1+n4": "f_n14",
  "n2+n5": "f_n25",
};

// ==========================================
// LOOT ICON ARRAYS (AUTO-GENERATED)
// ==========================================
window.LOOT_ICONS = {
  swords: [
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_axe1.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_axe2.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_axe3.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_bigclub1.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_bigclub2.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_bigclub3.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_Bow1.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_Bow2.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_Bow3.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_claw1.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_claw2.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_claw3.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_dagger1.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_dagger2.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_dagger3.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_halberd1.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_halberd2.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_halberd3.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/ICON_hammer1.webp.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_hammer2.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_hammer3.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_spear1.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_spear2.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_spear3.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_staff1.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_staff2.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_staff3.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_sword_long1.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_sword_long2.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_sword_long3.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_sword_long4.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_sword_short1.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_sword_short2.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_sword_short3.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_XBow1.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_XBow2.webp",
    "assets/images/items/weapons/swords/weaponIcons32x32_png_Transparent/icon_XBow3.webp",
  ],
  daggers: [
    "assets/images/items/weapons/daggers/daggers/PNG/daggers (1).webp",
    "assets/images/items/weapons/daggers/daggers/PNG/daggers (10).webp",
    "assets/images/items/weapons/daggers/daggers/PNG/daggers (2).webp",
    "assets/images/items/weapons/daggers/daggers/PNG/daggers (3).webp",
    "assets/images/items/weapons/daggers/daggers/PNG/daggers (4).webp",
    "assets/images/items/weapons/daggers/daggers/PNG/daggers (5).webp",
    "assets/images/items/weapons/daggers/daggers/PNG/daggers (6).webp",
    "assets/images/items/weapons/daggers/daggers/PNG/daggers (7).webp",
    "assets/images/items/weapons/daggers/daggers/PNG/daggers (8).webp",
    "assets/images/items/weapons/daggers/daggers/PNG/daggers (9).webp",
  ],
  staves: [
    "assets/images/items/weapons/staves/PNG/Staves_1/1.webp",
    "assets/images/items/weapons/staves/PNG/Staves_1/2.webp",
    "assets/images/items/weapons/staves/PNG/Staves_1/3.webp",
    "assets/images/items/weapons/staves/PNG/Staves_1/4.webp",
    "assets/images/items/weapons/staves/PNG/Staves_1/5.webp",
    "assets/images/items/weapons/staves/PNG/Staves_2/1.webp",
    "assets/images/items/weapons/staves/PNG/Staves_2/2.webp",
    "assets/images/items/weapons/staves/PNG/Staves_2/3.webp",
    "assets/images/items/weapons/staves/PNG/Staves_2/4.webp",
    "assets/images/items/weapons/staves/PNG/Staves_2/5.webp",
    "assets/images/items/weapons/staves/PNG/Staves_3/1.webp",
    "assets/images/items/weapons/staves/PNG/Staves_3/2.webp",
    "assets/images/items/weapons/staves/PNG/Staves_3/3.webp",
    "assets/images/items/weapons/staves/PNG/Staves_3/4.webp",
    "assets/images/items/weapons/staves/PNG/Staves_3/5.webp",
    "assets/images/items/weapons/staves/PNG/Staves_4/1.webp",
    "assets/images/items/weapons/staves/PNG/Staves_4/2.webp",
    "assets/images/items/weapons/staves/PNG/Staves_4/3.webp",
    "assets/images/items/weapons/staves/PNG/Staves_4/4.webp",
    "assets/images/items/weapons/staves/PNG/Staves_4/5.webp",
    "assets/images/items/weapons/staves/PNG/Staves_5/1.webp",
    "assets/images/items/weapons/staves/PNG/Staves_5/2.webp",
    "assets/images/items/weapons/staves/PNG/Staves_5/3.webp",
    "assets/images/items/weapons/staves/PNG/Staves_5/4.webp",
    "assets/images/items/weapons/staves/PNG/Staves_5/5.webp",
    "assets/images/items/weapons/staves/PNG/Staves_6/1.webp",
    "assets/images/items/weapons/staves/PNG/Staves_6/2.webp",
    "assets/images/items/weapons/staves/PNG/Staves_6/3.webp",
    "assets/images/items/weapons/staves/PNG/Staves_6/4.webp",
    "assets/images/items/weapons/staves/PNG/Staves_6/5.webp",
    "assets/images/items/weapons/staves/PNG/Staves_7/1.webp",
    "assets/images/items/weapons/staves/PNG/Staves_7/2.webp",
    "assets/images/items/weapons/staves/PNG/Staves_7/3.webp",
    "assets/images/items/weapons/staves/PNG/Staves_7/4.webp",
    "assets/images/items/weapons/staves/PNG/Staves_7/5.webp",
    "assets/images/items/weapons/staves/PNG/Staves_8/1.webp",
    "assets/images/items/weapons/staves/PNG/Staves_8/2.webp",
    "assets/images/items/weapons/staves/PNG/Staves_8/3.webp",
    "assets/images/items/weapons/staves/PNG/Staves_8/4.webp",
    "assets/images/items/weapons/staves/PNG/Staves_8/5.webp",
  ],
  shields: [
    "assets/images/items/shields/PNG/Shield_1/1.webp",
    "assets/images/items/shields/PNG/Shield_1/2.webp",
    "assets/images/items/shields/PNG/Shield_1/3.webp",
    "assets/images/items/shields/PNG/Shield_1/4.webp",
    "assets/images/items/shields/PNG/Shield_1/5.webp",
    "assets/images/items/shields/PNG/Shield_2/1.webp",
    "assets/images/items/shields/PNG/Shield_2/2.webp",
    "assets/images/items/shields/PNG/Shield_2/3.webp",
    "assets/images/items/shields/PNG/Shield_2/4.webp",
    "assets/images/items/shields/PNG/Shield_2/5.webp",
    "assets/images/items/shields/PNG/Shield_3/1.webp",
    "assets/images/items/shields/PNG/Shield_3/2.webp",
    "assets/images/items/shields/PNG/Shield_3/3.webp",
    "assets/images/items/shields/PNG/Shield_3/4.webp",
    "assets/images/items/shields/PNG/Shield_3/5.webp",
    "assets/images/items/shields/PNG/Shield_4/1.webp",
    "assets/images/items/shields/PNG/Shield_4/2.webp",
    "assets/images/items/shields/PNG/Shield_4/3.webp",
    "assets/images/items/shields/PNG/Shield_4/4.webp",
    "assets/images/items/shields/PNG/Shield_4/5.webp",
    "assets/images/items/shields/PNG/Shield_5/1.webp",
    "assets/images/items/shields/PNG/Shield_5/2.webp",
    "assets/images/items/shields/PNG/Shield_5/3.webp",
    "assets/images/items/shields/PNG/Shield_5/4.webp",
    "assets/images/items/shields/PNG/Shield_5/5.webp",
    "assets/images/items/shields/PNG/Shield_6/1.webp",
    "assets/images/items/shields/PNG/Shield_6/2.webp",
    "assets/images/items/shields/PNG/Shield_6/3.webp",
    "assets/images/items/shields/PNG/Shield_6/4.webp",
    "assets/images/items/shields/PNG/Shield_6/5.webp",
    "assets/images/items/shields/PNG/Shield_7/1.webp",
    "assets/images/items/shields/PNG/Shield_7/2.webp",
    "assets/images/items/shields/PNG/Shield_7/3.webp",
    "assets/images/items/shields/PNG/Shield_7/4.webp",
    "assets/images/items/shields/PNG/Shield_7/5.webp",
    "assets/images/items/shields/PNG/Shield_8/1.webp",
    "assets/images/items/shields/PNG/Shield_8/2.webp",
    "assets/images/items/shields/PNG/Shield_8/3.webp",
    "assets/images/items/shields/PNG/Shield_8/4.webp",
    "assets/images/items/shields/PNG/Shield_8/5.webp",
  ],
  potions: [
    "assets/images/items/consumables/potions/Free-Game-Icons-of-Fantasy-Potions-Pack-1/PNG/potions (1).webp",
    "assets/images/items/consumables/potions/Free-Game-Icons-of-Fantasy-Potions-Pack-1/PNG/potions (10).webp",
    "assets/images/items/consumables/potions/Free-Game-Icons-of-Fantasy-Potions-Pack-1/PNG/potions (2).webp",
    "assets/images/items/consumables/potions/Free-Game-Icons-of-Fantasy-Potions-Pack-1/PNG/potions (3).webp",
    "assets/images/items/consumables/potions/Free-Game-Icons-of-Fantasy-Potions-Pack-1/PNG/potions (4).webp",
    "assets/images/items/consumables/potions/Free-Game-Icons-of-Fantasy-Potions-Pack-1/PNG/potions (5).webp",
    "assets/images/items/consumables/potions/Free-Game-Icons-of-Fantasy-Potions-Pack-1/PNG/potions (6).webp",
    "assets/images/items/consumables/potions/Free-Game-Icons-of-Fantasy-Potions-Pack-1/PNG/potions (7).webp",
    "assets/images/items/consumables/potions/Free-Game-Icons-of-Fantasy-Potions-Pack-1/PNG/potions (8).webp",
    "assets/images/items/consumables/potions/Free-Game-Icons-of-Fantasy-Potions-Pack-1/PNG/potions (9).webp",
  ],
  books: [
    "assets/images/items/books/PNG/background/1.webp",
    "assets/images/items/books/PNG/background/10.webp",
    "assets/images/items/books/PNG/background/11.webp",
    "assets/images/items/books/PNG/background/12.webp",
    "assets/images/items/books/PNG/background/13.webp",
    "assets/images/items/books/PNG/background/14.webp",
    "assets/images/items/books/PNG/background/15.webp",
    "assets/images/items/books/PNG/background/16.webp",
    "assets/images/items/books/PNG/background/17.webp",
    "assets/images/items/books/PNG/background/18.webp",
    "assets/images/items/books/PNG/background/19.webp",
    "assets/images/items/books/PNG/background/2.webp",
    "assets/images/items/books/PNG/background/20.webp",
    "assets/images/items/books/PNG/background/21.webp",
    "assets/images/items/books/PNG/background/22.webp",
    "assets/images/items/books/PNG/background/23.webp",
    "assets/images/items/books/PNG/background/24.webp",
    "assets/images/items/books/PNG/background/25.webp",
    "assets/images/items/books/PNG/background/26.webp",
    "assets/images/items/books/PNG/background/27.webp",
    "assets/images/items/books/PNG/background/28.webp",
    "assets/images/items/books/PNG/background/29.webp",
    "assets/images/items/books/PNG/background/3.webp",
    "assets/images/items/books/PNG/background/30.webp",
    "assets/images/items/books/PNG/background/31.webp",
    "assets/images/items/books/PNG/background/32.webp",
    "assets/images/items/books/PNG/background/33.webp",
    "assets/images/items/books/PNG/background/34.webp",
    "assets/images/items/books/PNG/background/35.webp",
    "assets/images/items/books/PNG/background/36.webp",
    "assets/images/items/books/PNG/background/37.webp",
    "assets/images/items/books/PNG/background/38.webp",
    "assets/images/items/books/PNG/background/39.webp",
    "assets/images/items/books/PNG/background/4.webp",
    "assets/images/items/books/PNG/background/40.webp",
    "assets/images/items/books/PNG/background/41.webp",
    "assets/images/items/books/PNG/background/42.webp",
    "assets/images/items/books/PNG/background/43.webp",
    "assets/images/items/books/PNG/background/44.webp",
    "assets/images/items/books/PNG/background/45.webp",
    "assets/images/items/books/PNG/background/46.webp",
    "assets/images/items/books/PNG/background/47.webp",
    "assets/images/items/books/PNG/background/48.webp",
    "assets/images/items/books/PNG/background/49.webp",
    "assets/images/items/books/PNG/background/5.webp",
    "assets/images/items/books/PNG/background/50.webp",
    "assets/images/items/books/PNG/background/6.webp",
    "assets/images/items/books/PNG/background/7.webp",
    "assets/images/items/books/PNG/background/8.webp",
    "assets/images/items/books/PNG/background/9.webp",
    "assets/images/items/books/PNG/without background/1.webp",
    "assets/images/items/books/PNG/without background/10.webp",
    "assets/images/items/books/PNG/without background/11.webp",
    "assets/images/items/books/PNG/without background/12.webp",
    "assets/images/items/books/PNG/without background/13.webp",
    "assets/images/items/books/PNG/without background/14.webp",
    "assets/images/items/books/PNG/without background/15.webp",
    "assets/images/items/books/PNG/without background/16.webp",
    "assets/images/items/books/PNG/without background/17.webp",
    "assets/images/items/books/PNG/without background/18.webp",
    "assets/images/items/books/PNG/without background/19.webp",
    "assets/images/items/books/PNG/without background/2.webp",
    "assets/images/items/books/PNG/without background/20.webp",
    "assets/images/items/books/PNG/without background/21.webp",
    "assets/images/items/books/PNG/without background/22.webp",
    "assets/images/items/books/PNG/without background/23.webp",
    "assets/images/items/books/PNG/without background/24.webp",
    "assets/images/items/books/PNG/without background/25.webp",
    "assets/images/items/books/PNG/without background/26.webp",
    "assets/images/items/books/PNG/without background/27.webp",
    "assets/images/items/books/PNG/without background/28.webp",
    "assets/images/items/books/PNG/without background/29.webp",
    "assets/images/items/books/PNG/without background/3.webp",
    "assets/images/items/books/PNG/without background/30.webp",
    "assets/images/items/books/PNG/without background/31.webp",
    "assets/images/items/books/PNG/without background/32.webp",
    "assets/images/items/books/PNG/without background/33.webp",
    "assets/images/items/books/PNG/without background/34.webp",
    "assets/images/items/books/PNG/without background/35.webp",
    "assets/images/items/books/PNG/without background/36.webp",
    "assets/images/items/books/PNG/without background/37.webp",
    "assets/images/items/books/PNG/without background/38.webp",
    "assets/images/items/books/PNG/without background/39.webp",
    "assets/images/items/books/PNG/without background/4.webp",
    "assets/images/items/books/PNG/without background/40.webp",
    "assets/images/items/books/PNG/without background/41.webp",
    "assets/images/items/books/PNG/without background/42.webp",
    "assets/images/items/books/PNG/without background/43.webp",
    "assets/images/items/books/PNG/without background/44.webp",
    "assets/images/items/books/PNG/without background/45.webp",
    "assets/images/items/books/PNG/without background/46.webp",
    "assets/images/items/books/PNG/without background/47.webp",
    "assets/images/items/books/PNG/without background/48.webp",
    "assets/images/items/books/PNG/without background/49.webp",
    "assets/images/items/books/PNG/without background/5.webp",
    "assets/images/items/books/PNG/without background/50.webp",
    "assets/images/items/books/PNG/without background/6.webp",
    "assets/images/items/books/PNG/without background/7.webp",
    "assets/images/items/books/PNG/without background/8.webp",
    "assets/images/items/books/PNG/without background/9.webp",
  ],
  dragon: [
    "assets/images/items/dragon/PNG/background/1.webp",
    "assets/images/items/dragon/PNG/background/10.webp",
    "assets/images/items/dragon/PNG/background/11.webp",
    "assets/images/items/dragon/PNG/background/12.webp",
    "assets/images/items/dragon/PNG/background/13.webp",
    "assets/images/items/dragon/PNG/background/14.webp",
    "assets/images/items/dragon/PNG/background/15.webp",
    "assets/images/items/dragon/PNG/background/16.webp",
    "assets/images/items/dragon/PNG/background/17.webp",
    "assets/images/items/dragon/PNG/background/18.webp",
    "assets/images/items/dragon/PNG/background/19.webp",
    "assets/images/items/dragon/PNG/background/2.webp",
    "assets/images/items/dragon/PNG/background/20.webp",
    "assets/images/items/dragon/PNG/background/21.webp",
    "assets/images/items/dragon/PNG/background/22.webp",
    "assets/images/items/dragon/PNG/background/23.webp",
    "assets/images/items/dragon/PNG/background/24.webp",
    "assets/images/items/dragon/PNG/background/25.webp",
    "assets/images/items/dragon/PNG/background/26.webp",
    "assets/images/items/dragon/PNG/background/27.webp",
    "assets/images/items/dragon/PNG/background/28.webp",
    "assets/images/items/dragon/PNG/background/29.webp",
    "assets/images/items/dragon/PNG/background/3.webp",
    "assets/images/items/dragon/PNG/background/30.webp",
    "assets/images/items/dragon/PNG/background/31.webp",
    "assets/images/items/dragon/PNG/background/32.webp",
    "assets/images/items/dragon/PNG/background/33.webp",
    "assets/images/items/dragon/PNG/background/34.webp",
    "assets/images/items/dragon/PNG/background/35.webp",
    "assets/images/items/dragon/PNG/background/36.webp",
    "assets/images/items/dragon/PNG/background/37.webp",
    "assets/images/items/dragon/PNG/background/38.webp",
    "assets/images/items/dragon/PNG/background/39.webp",
    "assets/images/items/dragon/PNG/background/4.webp",
    "assets/images/items/dragon/PNG/background/40.webp",
    "assets/images/items/dragon/PNG/background/41.webp",
    "assets/images/items/dragon/PNG/background/42.webp",
    "assets/images/items/dragon/PNG/background/43.webp",
    "assets/images/items/dragon/PNG/background/44.webp",
    "assets/images/items/dragon/PNG/background/45.webp",
    "assets/images/items/dragon/PNG/background/46.webp",
    "assets/images/items/dragon/PNG/background/47.webp",
    "assets/images/items/dragon/PNG/background/48.webp",
    "assets/images/items/dragon/PNG/background/49.webp",
    "assets/images/items/dragon/PNG/background/5.webp",
    "assets/images/items/dragon/PNG/background/50.webp",
    "assets/images/items/dragon/PNG/background/6.webp",
    "assets/images/items/dragon/PNG/background/7.webp",
    "assets/images/items/dragon/PNG/background/8.webp",
    "assets/images/items/dragon/PNG/background/9.webp",
    "assets/images/items/dragon/PNG/without background/1.webp",
    "assets/images/items/dragon/PNG/without background/10.webp",
    "assets/images/items/dragon/PNG/without background/11.webp",
    "assets/images/items/dragon/PNG/without background/12.webp",
    "assets/images/items/dragon/PNG/without background/13.webp",
    "assets/images/items/dragon/PNG/without background/14.webp",
    "assets/images/items/dragon/PNG/without background/15.webp",
    "assets/images/items/dragon/PNG/without background/16.webp",
    "assets/images/items/dragon/PNG/without background/17.webp",
    "assets/images/items/dragon/PNG/without background/18.webp",
    "assets/images/items/dragon/PNG/without background/19.webp",
    "assets/images/items/dragon/PNG/without background/2.webp",
    "assets/images/items/dragon/PNG/without background/20.webp",
    "assets/images/items/dragon/PNG/without background/21.webp",
    "assets/images/items/dragon/PNG/without background/22.webp",
    "assets/images/items/dragon/PNG/without background/23.webp",
    "assets/images/items/dragon/PNG/without background/24.webp",
    "assets/images/items/dragon/PNG/without background/25.webp",
    "assets/images/items/dragon/PNG/without background/26.webp",
    "assets/images/items/dragon/PNG/without background/27.webp",
    "assets/images/items/dragon/PNG/without background/28.webp",
    "assets/images/items/dragon/PNG/without background/29.webp",
    "assets/images/items/dragon/PNG/without background/3.webp",
    "assets/images/items/dragon/PNG/without background/30.webp",
    "assets/images/items/dragon/PNG/without background/31.webp",
    "assets/images/items/dragon/PNG/without background/32.webp",
    "assets/images/items/dragon/PNG/without background/33.webp",
    "assets/images/items/dragon/PNG/without background/34.webp",
    "assets/images/items/dragon/PNG/without background/35.webp",
    "assets/images/items/dragon/PNG/without background/36.webp",
    "assets/images/items/dragon/PNG/without background/37.webp",
    "assets/images/items/dragon/PNG/without background/38.webp",
    "assets/images/items/dragon/PNG/without background/39.webp",
    "assets/images/items/dragon/PNG/without background/4.webp",
    "assets/images/items/dragon/PNG/without background/40.webp",
    "assets/images/items/dragon/PNG/without background/41.webp",
    "assets/images/items/dragon/PNG/without background/42.webp",
    "assets/images/items/dragon/PNG/without background/43.webp",
    "assets/images/items/dragon/PNG/without background/44.webp",
    "assets/images/items/dragon/PNG/without background/45.webp",
    "assets/images/items/dragon/PNG/without background/46.webp",
    "assets/images/items/dragon/PNG/without background/47.webp",
    "assets/images/items/dragon/PNG/without background/48.webp",
    "assets/images/items/dragon/PNG/without background/49.webp",
    "assets/images/items/dragon/PNG/without background/5.webp",
    "assets/images/items/dragon/PNG/without background/50.webp",
    "assets/images/items/dragon/PNG/without background/6.webp",
    "assets/images/items/dragon/PNG/without background/7.webp",
    "assets/images/items/dragon/PNG/without background/8.webp",
    "assets/images/items/dragon/PNG/without background/9.webp",
  ],
  armors: [
    "assets/images/items/equipments/PNG/Background/Icon1.webp",
    "assets/images/items/equipments/PNG/Background/Icon10.webp",
    "assets/images/items/equipments/PNG/Background/Icon11.webp",
    "assets/images/items/equipments/PNG/Background/Icon12.webp",
    "assets/images/items/equipments/PNG/Background/Icon13.webp",
    "assets/images/items/equipments/PNG/Background/Icon14.webp",
    "assets/images/items/equipments/PNG/Background/Icon15.webp",
    "assets/images/items/equipments/PNG/Background/Icon16.webp",
    "assets/images/items/equipments/PNG/Background/Icon17.webp",
    "assets/images/items/equipments/PNG/Background/Icon18.webp",
    "assets/images/items/equipments/PNG/Background/Icon19.webp",
    "assets/images/items/equipments/PNG/Background/Icon2.webp",
    "assets/images/items/equipments/PNG/Background/Icon20.webp",
    "assets/images/items/equipments/PNG/Background/Icon21.webp",
    "assets/images/items/equipments/PNG/Background/Icon22.webp",
    "assets/images/items/equipments/PNG/Background/Icon23.webp",
    "assets/images/items/equipments/PNG/Background/Icon24.webp",
    "assets/images/items/equipments/PNG/Background/Icon25.webp",
    "assets/images/items/equipments/PNG/Background/Icon26.webp",
    "assets/images/items/equipments/PNG/Background/Icon27.webp",
    "assets/images/items/equipments/PNG/Background/Icon28.webp",
    "assets/images/items/equipments/PNG/Background/Icon29.webp",
    "assets/images/items/equipments/PNG/Background/Icon3.webp",
    "assets/images/items/equipments/PNG/Background/Icon30.webp",
    "assets/images/items/equipments/PNG/Background/Icon31.webp",
    "assets/images/items/equipments/PNG/Background/Icon32.webp",
    "assets/images/items/equipments/PNG/Background/Icon33.webp",
    "assets/images/items/equipments/PNG/Background/Icon34.webp",
    "assets/images/items/equipments/PNG/Background/Icon35.webp",
    "assets/images/items/equipments/PNG/Background/Icon36.webp",
    "assets/images/items/equipments/PNG/Background/Icon37.webp",
    "assets/images/items/equipments/PNG/Background/Icon38.webp",
    "assets/images/items/equipments/PNG/Background/Icon39.webp",
    "assets/images/items/equipments/PNG/Background/Icon4.webp",
    "assets/images/items/equipments/PNG/Background/Icon40.webp",
    "assets/images/items/equipments/PNG/Background/Icon41.webp",
    "assets/images/items/equipments/PNG/Background/Icon42.webp",
    "assets/images/items/equipments/PNG/Background/Icon43.webp",
    "assets/images/items/equipments/PNG/Background/Icon44.webp",
    "assets/images/items/equipments/PNG/Background/Icon45.webp",
    "assets/images/items/equipments/PNG/Background/Icon46.webp",
    "assets/images/items/equipments/PNG/Background/Icon47.webp",
    "assets/images/items/equipments/PNG/Background/Icon48.webp",
    "assets/images/items/equipments/PNG/Background/Icon5.webp",
    "assets/images/items/equipments/PNG/Background/Icon6.webp",
    "assets/images/items/equipments/PNG/Background/Icon7.webp",
    "assets/images/items/equipments/PNG/Background/Icon8.webp",
    "assets/images/items/equipments/PNG/Background/Icon9.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon1.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon10.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon11.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon12.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon13.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon14.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon15.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon16.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon17.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon18.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon19.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon2.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon20.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon21.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon22.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon23.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon24.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon25.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon26.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon27.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon28.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon29.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon3.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon30.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon31.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon32.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon33.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon34.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon35.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon36.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon37.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon38.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon39.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon4.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon40.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon41.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon42.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon43.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon44.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon45.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon46.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon47.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon48.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon5.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon6.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon7.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon8.webp",
    "assets/images/items/equipments/PNG/Transperent/Icon9.webp",
  ],
};

window.assignLootIcon = function (item, heroClass = "Guerreiro") {
  if (!window.LOOT_ICONS) return item;
  const icons = window.LOOT_ICONS;

  let pool = [];
  if (item.type === "lore_fragment" || item.type === "book") {
    if (icons.books && icons.books.length) pool = icons.books;
  } else if (item.rarity === "Mitico" || item.rarity === "Deus") {
    if (icons.dragon && icons.dragon.length) pool = icons.dragon;
  } else if (item.type === "arma") {
    if (heroClass === "Arcanista" && icons.staves && icons.staves.length)
      pool = icons.staves;
    else if (heroClass === "Ranger" && icons.daggers && icons.daggers.length)
      pool = icons.daggers;
    else if (icons.swords && icons.swords.length) pool = icons.swords;
  } else if (item.type === "escudo") {
    if (icons.shields && icons.shields.length) pool = icons.shields;
  } else if (
    ["capacete", "armadura", "luvas", "botas"].includes(item.type) &&
    icons.armors &&
    icons.armors.length
  ) {
    pool = icons.armors;
  }

  if (pool.length > 0) {
    item.icon = pool[Math.floor(Math.random() * pool.length)];
  }
  return item;
};

// PATCH: Assinalar icones aleatórios/específicos para habilidades sem ícone
if (window.LOOT_ICONS) {
  if (
    MASTER_SKILLS_DATA["Guerreiro"] &&
    window.LOOT_ICONS.skills_swordsman &&
    window.LOOT_ICONS.skills_swordsman.length > 0
  ) {
    MASTER_SKILLS_DATA["Guerreiro"].forEach((skill, index) => {
      if (!skill.icon)
        skill.icon =
          window.LOOT_ICONS.skills_swordsman[
            index % window.LOOT_ICONS.skills_swordsman.length
          ];
    });
  }

  if (
    MASTER_SKILLS_DATA["Ranger"] &&
    window.LOOT_ICONS.skills_night_elf &&
    window.LOOT_ICONS.skills_night_elf.length > 0
  ) {
    MASTER_SKILLS_DATA["Ranger"].forEach((skill, index) => {
      if (!skill.icon)
        skill.icon =
          window.LOOT_ICONS.skills_night_elf[
            index % window.LOOT_ICONS.skills_night_elf.length
          ];
    });
  }
}

// =====================================================
// MONSTER BRAIN ENGINE 2.0 - MOVESETS
// =====================================================
window.MONSTER_MOVESETS = {
  // ================= BOSSES =================
  "Lorde Necromante": [
    { id: "necro_bolt", name: "Seta Sombria", weight: 30, dmgMultiplier: 1.2, type: "heavy_attack", cooldown: 1, log: "O Lorde Necromante conjura uma Seta Sombria fulminante!" },
    { id: "curse_of_weakness", name: "Maldição da Fraqueza", weight: 20, dmgMultiplier: 0, type: "debuff", cooldown: 4, effect: "poison", log: "O ar fica denso! O Lorde Necromante lança uma Maldição Enfraquecedora!" },
    { id: "summon_undead", name: "Ergam-se, Servos!", weight: 10, dmgMultiplier: 0.8, type: "heavy_attack", cooldown: 5, log: "O Lorde Necromante bate seu cajado no chão, erguendo esqueletos que atacam em fúria!" }
  ],
  "Hidra Corrompida": [
    { id: "multi_bite", name: "Mordida Múltipla", weight: 40, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 2, log: "As cabeças da Hidra dão um bote triplo devastador!" },
    { id: "toxic_breath", name: "Sopro Tóxico", weight: 30, dmgMultiplier: 0.5, type: "debuff", cooldown: 3, effect: "poison", log: "A Hidra vomita um miasma tóxico que dissolve sua armadura!" }
  ],
  "Senhor da Forja": [
    { id: "forge_hammer", name: "Martelo da Forja", weight: 40, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 2, log: "O Senhor da Forja desce um martelão com a força de um vulcão!" },
    { id: "molten_armor", name: "Armadura Derretida", weight: 20, dmgMultiplier: 0, type: "defend", cooldown: 4, log: "O Senhor da Forja se banha em magma, endurecendo suas defesas!" },
    { id: "anvil_drop", name: "Queda da Bigorna", weight: 15, dmgMultiplier: 1.8, type: "heavy_attack", cooldown: 5, effect: "stun", log: "O Senhor da Forja arremessa uma bigorna gigante do teto!" }
  ],
  "Dragão Filhote": [
    { id: "fire_breath", name: "Baforada de Fogo", weight: 50, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 2, log: "O Dragão Filhote cospe uma torrente de chamas incandecentes!" },
    { id: "tail_whip", name: "Chicotada de Cauda", weight: 30, dmgMultiplier: 1.1, type: "heavy_attack", cooldown: 1, log: "O Dragão gira violentamente, golpeando com a cauda!" }
  ],
  "Illfang, o Rei Kobold": [
    { id: "kobold_charge", name: "Investida Real", weight: 40, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 2, log: "Illfang avança como um tanque de guerra, destruindo tudo à frente!" },
    { id: "battle_cry", name: "Grito de Guerra", weight: 20, dmgMultiplier: 0, type: "defend", cooldown: 4, log: "Illfang urra, inspirando a si mesmo e fortalecendo seus músculos!" },
    { id: "nodachi_slash", name: "Corte da Nodachi", weight: 30, dmgMultiplier: 1.7, type: "heavy_attack", cooldown: 3, log: "Illfang saca sua gigantesca lâmina Nodachi e rasga o ar!" }
  ],
  "X'rphan, o Dragão Branco": [
    { id: "absolute_zero", name: "Zero Absoluto", weight: 30, dmgMultiplier: 1.8, type: "heavy_attack", cooldown: 4, effect: "stun", log: "X'rphan congela o próprio tecido da realidade ao seu redor!" },
    { id: "ice_shard", name: "Estilhaço de Gelo", weight: 40, dmgMultiplier: 1.3, type: "heavy_attack", cooldown: 1, log: "Uma estaca de gelo maciço é atirada contra seu peito!" },
    { id: "blizzard", name: "Nevasca Eterna", weight: 20, dmgMultiplier: 0.8, type: "debuff", cooldown: 3, effect: "poison", log: "Ventos cortantes congelam seu sangue, causando dano contínuo!" }
  ],
  "The Gleam Eyes": [
    { id: "demon_cleave", name: "Corte Demoníaco", weight: 40, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 2, log: "O Gleam Eyes levanta sua espada gigante e desce um Corte Demoníaco!" },
    { id: "frightening_roar", name: "Rugido Aterrorizante", weight: 30, dmgMultiplier: 0.5, type: "debuff", cooldown: 4, effect: "stun", log: "O Gleam Eyes solta um rugido gutural que estremece a sua alma e te paralisa!" },
    { id: "glare_of_doom", name: "Olhar da Perdição", weight: 20, dmgMultiplier: 2.0, type: "heavy_attack", cooldown: 5, log: "Os olhos da besta brilham, disparando um laser de pura energia destrutiva!" }
  ],

  // ================= ELITES =================
  "Dulahn, O Algoz Decapitado": [
    { id: "execution", name: "Execução Fria", weight: 50, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 3, log: "Dulahn ergue seu machado pesado para tentar separar sua cabeça!" }
  ],
  "Cavaleiro do Crisol Decaído": [
    { id: "crucible_smash", name: "Esmagamento do Crisol", weight: 40, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 2, log: "O Cavaleiro usa o peso de sua armadura sagrada num golpe destruidor!" }
  ],
  "Morte Menor": [
    { id: "soul_reap", name: "Ceifar Almas", weight: 35, dmgMultiplier: 1.3, type: "heavy_attack", cooldown: 3, effect: "poison", log: "A foice fantasmagórica rasga o ar, sugando um fragmento da sua vida!" }
  ],
  "Paladino Corrompido": [
    { id: "unholy_smite", name: "Punição Profana", weight: 40, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 2, log: "O Paladino canaliza luz corrompida em sua lâmina e ataca com fúria cega!" }
  ],
  "Amálgama de Ossos": [
    { id: "bone_storm", name: "Tempestade Óssea", weight: 30, dmgMultiplier: 1.3, type: "heavy_attack", cooldown: 3, log: "A aberração gira incontrolavelmente, disparando estilhaços de ossos!" }
  ],
  "Vex, A Bruxa do Pântano": [
    { id: "hex", name: "Bruxaria Hex", weight: 40, dmgMultiplier: 0.5, type: "debuff", cooldown: 3, effect: "poison", log: "Vex sussurra palavras malditas, enchendo suas veias com podridão!" }
  ],
  "Macaco Guardião Sem Cabeça": [
    { id: "terror_scream", name: "Grito de Terror", weight: 40, dmgMultiplier: 0.8, type: "debuff", cooldown: 4, effect: "stun", log: "Ele segura sua própria cabeça cortada, que grita ensurdecedoramente!" }
  ],
  "O Omen Caído": [
    { id: "omen_slam", name: "Golpe do Omen", weight: 50, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 3, log: "O Omen Caído salta e cai com todo seu peso profano sobre você!" }
  ],
  "Besta Sanguinária": [
    { id: "blood_bite", name: "Mordida Sanguinária", weight: 45, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 2, log: "A Besta rasga sua carne, deliciando-se com o jorro de sangue!" }
  ],
  "Kelpie, o Cavalo do Afogamento": [
    { id: "drown", name: "Afogamento Abissal", weight: 40, dmgMultiplier: 1.2, type: "heavy_attack", cooldown: 3, effect: "stun", log: "O Kelpie tenta te arrastar para as profundezas ilusórias de um lago negro!" }
  ],
  "Ignis, O Arauto das Chamas": [
    { id: "fireball", name: "Bola de Fogo Mayor", weight: 50, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 2, log: "Ignis conjura um sol em miniatura e o arremessa!" }
  ],
  "Zodd, O Imortal": [
    { id: "immortal_slash", name: "Talho Imortal", weight: 55, dmgMultiplier: 1.8, type: "heavy_attack", cooldown: 4, log: "Zodd golpeia com tamanha força que o ar se rasga ao redor de sua espada!" }
  ],
  "Perseguidor Flutuante": [
    { id: "curse_beam", name: "Raio Amaldiçoado", weight: 40, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 3, effect: "poison", log: "Um raio ocular penetra sua mente, corroendo a sanidade!" }
  ],
  "Dragão de Magma Terrestre": [
    { id: "magma_eruption", name: "Erupção de Magma", weight: 50, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 3, log: "O chão se rompe, e uma erupção de magma derrete sua defesa!" }
  ],
  "Demônio Capra": [
    { id: "machete_slam", name: "Golpe Duplo de Machete", weight: 60, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 2, log: "O Demônio Capra avança violentamente com ambas as lâminas gigantes!" }
  ],
  "Golem de Magma Ancião": [
    { id: "lava_crush", name: "Esmagamento de Lava", weight: 45, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 3, log: "Os punhos colossais do golem despencam como meteoros!" }
  ],
  "Guarda-fogo Ancestral": [
    { id: "fire_ward", name: "Guarda Piroclástica", weight: 35, dmgMultiplier: 0, type: "defend", cooldown: 4, log: "Ele ergue um escudo de chamas espessas, bloqueando ataques e ofuscando a visão!" }
  ],
  "Cavaleiro Negro de Fumaça": [
    { id: "smoke_thrust", name: "Estocada Fumejante", weight: 50, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 2, log: "Sua espada perfura a escuridão num movimento imperceptível e letal!" }
  ],
  "Wyvern Vermelho Menor": [
    { id: "wyvern_dive", name: "Mergulho Dracônico", weight: 45, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 3, log: "O Wyvern alça voo e despenca sobre você a uma velocidade absurda!" }
  ],
  "Centopeia de Lava": [
    { id: "lava_spit", name: "Cuspe Vulcânico", weight: 40, dmgMultiplier: 1.2, type: "debuff", cooldown: 3, effect: "poison", log: "Ácido derretido espirra no seu corpo, causando dores indescritíveis!" }
  ],
  "Madeira Viva": [
    { id: "root_strangle", name: "Estrangulamento de Raízes", weight: 40, dmgMultiplier: 1.3, type: "heavy_attack", cooldown: 3, effect: "stun", log: "Raízes grossas disparam do chão, prendendo e esmagando seus pés!" }
  ],
  "Priscilla, A Desperta": [
    { id: "scythe_sweep", name: "Ceifada Desperta", weight: 45, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 2, log: "Priscilla gira sua foice graciosamente num arco cortante e mortal!" }
  ],
  "O Demônio do Refúgio": [
    { id: "asylum_butt_slam", name: "Esmagamento de Asilo", weight: 55, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 4, log: "Ele pula graciosamente no ar... e cai com o traseiro gigante pra te amassar!" }
  ],
  "Fiend, A Fera de Chifres": [
    { id: "horn_gore", name: "Chifrada Brutal", weight: 50, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 3, log: "Fiend abaixa a cabeça e te empala com chifres que quebram pedras!" }
  ],
  "Riful do Oeste": [
    { id: "abyssal_tentacles", name: "Tentáculos Abissais", weight: 45, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 2, log: "Fitas cortantes feitas de carne emergem do chão num frenesi absurdo!" }
  ],
  "Golem de Prata": [
    { id: "silver_quake", name: "Terremoto Prateado", weight: 45, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 3, log: "Ele soca o solo, enviando uma onda de choque de prata líquida!" }
  ],
  "Renna, A Ilusão": [
    { id: "moon_beam", name: "Raio Lunar", weight: 50, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 3, log: "Renna conjura um laser gélido direto da luz das luas artificiais!" }
  ],
  "Sábio de Cristal": [
    { id: "crystal_hail", name: "Granizo de Cristal", weight: 45, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 2, log: "Uma chuva de cristais afiadíssimos despenca do teto em cima de você!" }
  ],
  "Lobo Cinzento Gigante": [
    { id: "sword_spin", name: "Giro de Lâmina", weight: 55, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 3, log: "O lobo morde uma espada colossal e gira como um tornado cortante!" }
  ],
  "Arauto da Lua": [
    { id: "eclipse_strike", name: "Golpe do Eclipse", weight: 50, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 3, log: "Tudo escurece. O Arauto ataca a partir das sombras perfeitas!" }
  ],
  "Cultista das Sombras": [
    { id: "shadow_binding", name: "Aprisionamento Sombrio", weight: 40, dmgMultiplier: 0.8, type: "debuff", cooldown: 4, effect: "stun", log: "Sombras ganham vida e amarram seus braços, bloqueando seus movimentos!" }
  ],
  "Artorias, O Corrompido": [
    { id: "abyssal_flip", name: "Mortal do Abismo", weight: 60, dmgMultiplier: 1.7, type: "heavy_attack", cooldown: 3, log: "Artorias dá um mortal insano, desabando a Espada do Abismo em sua clavícula!" }
  ],
  "Femto, O Falcão Negro": [
    { id: "telekinetic_crush", name: "Esmagamento Telecinético", weight: 65, dmgMultiplier: 1.8, type: "heavy_attack", cooldown: 4, effect: "stun", log: "Femto levanta a mão e o espaço ao seu redor colapsa, esmagando seus ossos!" }
  ],
  "Grunbeld, O Dragão de Fogo": [
    { id: "cannon_fire", name: "Tiro do Escudo-Canhão", weight: 50, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 3, log: "Ele aponta seu braço-escudo e dispara uma bala de canhão flamejante!" }
  ],
  "Órfão de Kos": [
    { id: "placenta_whip", name: "Chicotada Abominável", weight: 60, dmgMultiplier: 1.7, type: "heavy_attack", cooldown: 2, log: "O Órfão grita agonizantemente e gira sua arma carnuda num frenesi sangrento!" }
  ]
};

// =====================================================
// MONSTER BRAIN ENGINE 2.0 - MOVESETS
// =====================================================
window.MONSTER_MOVESETS = {
  // ================= BOSSES =================
  "Lorde Necromante": [
    { id: "necro_bolt", name: "Seta Sombria", weight: 30, dmgMultiplier: 1.2, type: "heavy_attack", cooldown: 1, log: "O Lorde Necromante conjura uma Seta Sombria fulminante!" },
    { id: "curse_of_weakness", name: "Maldição da Fraqueza", weight: 20, dmgMultiplier: 0, type: "debuff", cooldown: 4, effect: "poison", log: "O ar fica denso! O Lorde Necromante lança uma Maldição Enfraquecedora!" },
    { id: "summon_undead", name: "Ergam-se, Servos!", weight: 10, dmgMultiplier: 0.8, type: "heavy_attack", cooldown: 5, log: "O Lorde Necromante bate seu cajado no chão, erguendo esqueletos que atacam em fúria!" }
  ],
  "Hidra Corrompida": [
    { id: "multi_bite", name: "Mordida Múltipla", weight: 40, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 2, log: "As cabeças da Hidra dão um bote triplo devastador!" },
    { id: "toxic_breath", name: "Sopro Tóxico", weight: 30, dmgMultiplier: 0.5, type: "debuff", cooldown: 3, effect: "poison", log: "A Hidra vomita um miasma tóxico que dissolve sua armadura!" }
  ],
  "Senhor da Forja": [
    { id: "forge_hammer", name: "Martelo da Forja", weight: 40, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 2, log: "O Senhor da Forja desce um martelão com a força de um vulcão!" },
    { id: "molten_armor", name: "Armadura Derretida", weight: 20, dmgMultiplier: 0, type: "defend", cooldown: 4, log: "O Senhor da Forja se banha em magma, endurecendo suas defesas!" },
    { id: "anvil_drop", name: "Queda da Bigorna", weight: 15, dmgMultiplier: 1.8, type: "heavy_attack", cooldown: 5, effect: "stun", log: "O Senhor da Forja arremessa uma bigorna gigante do teto!" }
  ],
  "Dragão Filhote": [
    { id: "fire_breath", name: "Baforada de Fogo", weight: 50, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 2, log: "O Dragão Filhote cospe uma torrente de chamas incandecentes!" },
    { id: "tail_whip", name: "Chicotada de Cauda", weight: 30, dmgMultiplier: 1.1, type: "heavy_attack", cooldown: 1, log: "O Dragão gira violentamente, golpeando com a cauda!" }
  ],
  "Illfang, o Rei Kobold": [
    { id: "kobold_charge", name: "Investida Real", weight: 40, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 2, log: "Illfang avança como um tanque de guerra, destruindo tudo à frente!" },
    { id: "battle_cry", name: "Grito de Guerra", weight: 20, dmgMultiplier: 0, type: "defend", cooldown: 4, log: "Illfang urra, inspirando a si mesmo e fortalecendo seus músculos!" },
    { id: "nodachi_slash", name: "Corte da Nodachi", weight: 30, dmgMultiplier: 1.7, type: "heavy_attack", cooldown: 3, log: "Illfang saca sua gigantesca lâmina Nodachi e rasga o ar!" }
  ],
  "X'rphan, o Dragão Branco": [
    { id: "absolute_zero", name: "Zero Absoluto", weight: 30, dmgMultiplier: 1.8, type: "heavy_attack", cooldown: 4, effect: "stun", log: "X'rphan congela o próprio tecido da realidade ao seu redor!" },
    { id: "ice_shard", name: "Estilhaço de Gelo", weight: 40, dmgMultiplier: 1.3, type: "heavy_attack", cooldown: 1, log: "Uma estaca de gelo maciço é atirada contra seu peito!" },
    { id: "blizzard", name: "Nevasca Eterna", weight: 20, dmgMultiplier: 0.8, type: "debuff", cooldown: 3, effect: "poison", log: "Ventos cortantes congelam seu sangue, causando dano contínuo!" }
  ],
  "The Gleam Eyes": [
    { id: "demon_cleave", name: "Corte Demoníaco", weight: 40, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 2, log: "O Gleam Eyes levanta sua espada gigante e desce um Corte Demoníaco!" },
    { id: "frightening_roar", name: "Rugido Aterrorizante", weight: 30, dmgMultiplier: 0.5, type: "debuff", cooldown: 4, effect: "stun", log: "O Gleam Eyes solta um rugido gutural que estremece a sua alma e te paralisa!" },
    { id: "glare_of_doom", name: "Olhar da Perdição", weight: 20, dmgMultiplier: 2.0, type: "heavy_attack", cooldown: 5, log: "Os olhos da besta brilham, disparando um laser de pura energia destrutiva!" }
  ],

  // ================= ELITES =================
  "Dulahn, O Algoz Decapitado": [
    { id: "execution", name: "Execução Fria", weight: 50, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 3, log: "Dulahn ergue seu machado pesado para tentar separar sua cabeça!" }
  ],
  "Cavaleiro do Crisol Decaído": [
    { id: "crucible_smash", name: "Esmagamento do Crisol", weight: 40, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 2, log: "O Cavaleiro usa o peso de sua armadura sagrada num golpe destruidor!" }
  ],
  "Morte Menor": [
    { id: "soul_reap", name: "Ceifar Almas", weight: 35, dmgMultiplier: 1.3, type: "heavy_attack", cooldown: 3, effect: "poison", log: "A foice fantasmagórica rasga o ar, sugando um fragmento da sua vida!" }
  ],
  "Paladino Corrompido": [
    { id: "unholy_smite", name: "Punição Profana", weight: 40, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 2, log: "O Paladino canaliza luz corrompida em sua lâmina e ataca com fúria cega!" }
  ],
  "Amálgama de Ossos": [
    { id: "bone_storm", name: "Tempestade Óssea", weight: 30, dmgMultiplier: 1.3, type: "heavy_attack", cooldown: 3, log: "A aberração gira incontrolavelmente, disparando estilhaços de ossos!" }
  ],
  "Vex, A Bruxa do Pântano": [
    { id: "hex", name: "Bruxaria Hex", weight: 40, dmgMultiplier: 0.5, type: "debuff", cooldown: 3, effect: "poison", log: "Vex sussurra palavras malditas, enchendo suas veias com podridão!" }
  ],
  "Macaco Guardião Sem Cabeça": [
    { id: "terror_scream", name: "Grito de Terror", weight: 40, dmgMultiplier: 0.8, type: "debuff", cooldown: 4, effect: "stun", log: "Ele segura sua própria cabeça cortada, que grita ensurdecedoramente!" }
  ],
  "O Omen Caído": [
    { id: "omen_slam", name: "Golpe do Omen", weight: 50, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 3, log: "O Omen Caído salta e cai com todo seu peso profano sobre você!" }
  ],
  "Besta Sanguinária": [
    { id: "blood_bite", name: "Mordida Sanguinária", weight: 45, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 2, log: "A Besta rasga sua carne, deliciando-se com o jorro de sangue!" }
  ],
  "Kelpie, o Cavalo do Afogamento": [
    { id: "drown", name: "Afogamento Abissal", weight: 40, dmgMultiplier: 1.2, type: "heavy_attack", cooldown: 3, effect: "stun", log: "O Kelpie tenta te arrastar para as profundezas ilusórias de um lago negro!" }
  ],
  "Ignis, O Arauto das Chamas": [
    { id: "fireball", name: "Bola de Fogo Mayor", weight: 50, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 2, log: "Ignis conjura um sol em miniatura e o arremessa!" }
  ],
  "Zodd, O Imortal": [
    { id: "immortal_slash", name: "Talho Imortal", weight: 55, dmgMultiplier: 1.8, type: "heavy_attack", cooldown: 4, log: "Zodd golpeia com tamanha força que o ar se rasga ao redor de sua espada!" }
  ],
  "Perseguidor Flutuante": [
    { id: "curse_beam", name: "Raio Amaldiçoado", weight: 40, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 3, effect: "poison", log: "Um raio ocular penetra sua mente, corroendo a sanidade!" }
  ],
  "Dragão de Magma Terrestre": [
    { id: "magma_eruption", name: "Erupção de Magma", weight: 50, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 3, log: "O chão se rompe, e uma erupção de magma derrete sua defesa!" }
  ],
  "Demônio Capra": [
    { id: "machete_slam", name: "Golpe Duplo de Machete", weight: 60, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 2, log: "O Demônio Capra avança violentamente com ambas as lâminas gigantes!" }
  ],
  "Golem de Magma Ancião": [
    { id: "lava_crush", name: "Esmagamento de Lava", weight: 45, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 3, log: "Os punhos colossais do golem despencam como meteoros!" }
  ],
  "Guarda-fogo Ancestral": [
    { id: "fire_ward", name: "Guarda Piroclástica", weight: 35, dmgMultiplier: 0, type: "defend", cooldown: 4, log: "Ele ergue um escudo de chamas espessas, bloqueando ataques e ofuscando a visão!" }
  ],
  "Cavaleiro Negro de Fumaça": [
    { id: "smoke_thrust", name: "Estocada Fumejante", weight: 50, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 2, log: "Sua espada perfura a escuridão num movimento imperceptível e letal!" }
  ],
  "Wyvern Vermelho Menor": [
    { id: "wyvern_dive", name: "Mergulho Dracônico", weight: 45, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 3, log: "O Wyvern alça voo e despenca sobre você a uma velocidade absurda!" }
  ],
  "Centopeia de Lava": [
    { id: "lava_spit", name: "Cuspe Vulcânico", weight: 40, dmgMultiplier: 1.2, type: "debuff", cooldown: 3, effect: "poison", log: "Ácido derretido espirra no seu corpo, causando dores indescritíveis!" }
  ],
  "Madeira Viva": [
    { id: "root_strangle", name: "Estrangulamento de Raízes", weight: 40, dmgMultiplier: 1.3, type: "heavy_attack", cooldown: 3, effect: "stun", log: "Raízes grossas disparam do chão, prendendo e esmagando seus pés!" }
  ],
  "Priscilla, A Desperta": [
    { id: "scythe_sweep", name: "Ceifada Desperta", weight: 45, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 2, log: "Priscilla gira sua foice graciosamente num arco cortante e mortal!" }
  ],
  "O Demônio do Refúgio": [
    { id: "asylum_butt_slam", name: "Esmagamento de Asilo", weight: 55, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 4, log: "Ele pula graciosamente no ar... e cai com o traseiro gigante pra te amassar!" }
  ],
  "Fiend, A Fera de Chifres": [
    { id: "horn_gore", name: "Chifrada Brutal", weight: 50, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 3, log: "Fiend abaixa a cabeça e te empala com chifres que quebram pedras!" }
  ],
  "Riful do Oeste": [
    { id: "abyssal_tentacles", name: "Tentáculos Abissais", weight: 45, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 2, log: "Fitas cortantes feitas de carne emergem do chão num frenesi absurdo!" }
  ],
  "Golem de Prata": [
    { id: "silver_quake", name: "Terremoto Prateado", weight: 45, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 3, log: "Ele soca o solo, enviando uma onda de choque de prata líquida!" }
  ],
  "Renna, A Ilusão": [
    { id: "moon_beam", name: "Raio Lunar", weight: 50, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 3, log: "Renna conjura um laser gélido direto da luz das luas artificiais!" }
  ],
  "Sábio de Cristal": [
    { id: "crystal_hail", name: "Granizo de Cristal", weight: 45, dmgMultiplier: 1.4, type: "heavy_attack", cooldown: 2, log: "Uma chuva de cristais afiadíssimos despenca do teto em cima de você!" }
  ],
  "Lobo Cinzento Gigante": [
    { id: "sword_spin", name: "Giro de Lâmina", weight: 55, dmgMultiplier: 1.5, type: "heavy_attack", cooldown: 3, log: "O lobo morde uma espada colossal e gira como um tornado cortante!" }
  ],
  "Arauto da Lua": [
    { id: "eclipse_strike", name: "Golpe do Eclipse", weight: 50, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 3, log: "Tudo escurece. O Arauto ataca a partir das sombras perfeitas!" }
  ],
  "Cultista das Sombras": [
    { id: "shadow_binding", name: "Aprisionamento Sombrio", weight: 40, dmgMultiplier: 0.8, type: "debuff", cooldown: 4, effect: "stun", log: "Sombras ganham vida e amarram seus braços, bloqueando seus movimentos!" }
  ],
  "Artorias, O Corrompido": [
    { id: "abyssal_flip", name: "Mortal do Abismo", weight: 60, dmgMultiplier: 1.7, type: "heavy_attack", cooldown: 3, log: "Artorias dá um mortal insano, desabando a Espada do Abismo em sua clavícula!" }
  ],
  "Femto, O Falcão Negro": [
    { id: "telekinetic_crush", name: "Esmagamento Telecinético", weight: 65, dmgMultiplier: 1.8, type: "heavy_attack", cooldown: 4, effect: "stun", log: "Femto levanta a mão e o espaço ao seu redor colapsa, esmagando seus ossos!" }
  ],
  "Grunbeld, O Dragão de Fogo": [
    { id: "cannon_fire", name: "Tiro do Escudo-Canhão", weight: 50, dmgMultiplier: 1.6, type: "heavy_attack", cooldown: 3, log: "Ele aponta seu braço-escudo e dispara uma bala de canhão flamejante!" }
  ],
  "Órfão de Kos": [
    { id: "placenta_whip", name: "Chicotada Abominável", weight: 60, dmgMultiplier: 1.7, type: "heavy_attack", cooldown: 2, log: "O Órfão grita agonizantemente e gira sua arma carnuda num frenesi sangrento!" }
  ]
};
