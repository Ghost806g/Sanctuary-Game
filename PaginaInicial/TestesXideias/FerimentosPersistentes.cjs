// =========================================================================
// Ferimentos Persistentes
// =========================================================================

// =========================================================================
// 1. DADOS: OS TRAUMAS
// =========================================================================

// 1.1 Banco de dados de Ferimentos
const TRAUMAS_DATABASE = {
  "cortante": {
    name: "Ferimento Cortante",
    desc: "Corte profundo",
    icon: "⚔️",
    color: "#c00",
    categories: ["corpo_inferior", "corpo_superior"],
    stats: { atk: -5, def: -5 }
  },
  "fisico": {
    name: "Trauma Físico",
    desc: "Impacto forte ou contusão",
    icon: "🔨",
    color: "#a80",
    categories: ["corpo_inferior", "corpo_superior"],
    stats: { atk: -8, def: 0 }
  },
  "arquebus": {
    name: "Estilhaços de Arquebus",
    desc: "Dano de projétil",
    icon: "💥",
    color: "#f80",
    categories: ["corpo_inferior", "corpo_superior", "cabeca"],
    stats: { atk: 0, def: -10 }
  },
  "estrangular": {
    name: "Esmagamento",
    desc: "Asfixia ou esmagamento",
    icon: "⛓️",
    color: "#666",
    categories: ["corpo_inferior", "corpo_superior"],
    stats: { atk: 0, def: -8 }
  },
  "fogo": {
    name: "Queimadura",
    desc: "Tecido queimado",
    icon: "🔥",
    color: "#c30",
    categories: ["corpo_inferior", "corpo_superior", "cabeca"],
    stats: { atk: -10, def: 0 }
  },
  "gelo": {
    name: "Congelamento",
    desc: "Criogenia celular",
    icon: "❄️",
    color: "#39f",
    categories: ["corpo_inferior", "corpo_superior"],
    stats: { atk: 0, def: -5 }
  },
  "veneno": {
    name: "Intoxicação Grave",
    desc: "Corpo contaminado",
    icon: "☠️",
    color: "#4c0",
    categories: ["corpo_inferior", "corpo_superior", "cabeca"],
    stats: { atk: -5, def: 0 }
  },
  "magia": {
    name: "Necrose Mágica",
    desc: "Dano espectral",
    icon: "🔮",
    color: "#a0f",
    categories: ["corpo_inferior", "corpo_superior", "cabeca"],
    stats: { atk: -12, def: -5 }
  },
  "rasgar": {
    name: "Rasgado",
    desc: "Tecidos rompidos",
    icon: "✂️",
    color: "#c00",
    categories: ["corpo_inferior", "corpo_superior"],
    stats: { atk: -8, def: 0 }
  },
  "estilhaçar": {
    name: "Estilhaçamento",
    desc: "Ossos fraturados",
    icon: "🔨",
    color: "#a80",
    categories: ["corpo_inferior", "corpo_superior", "cabeca"],
    stats: { atk: 0, def: -12 }
  },
  "deglutir": {
    name: "Engolido por gosma",
    desc: "Paralisia digestiva",
    icon: "🤢",
    color: "#8b0",
    categories: ["corpo_inferior", "corpo_superior", "cabeca"],
    stats: { atk: 0, def: -15 }
  },
  "frio_intenso": {
    name: "Frio Extremo",
    desc: "Pele congelada e rígida",
    icon: "❄️",
    color: "#39f",
    categories: ["corpo_inferior", "corpo_superior"],
    stats: { atk: 0, def: -5 }
  },
  "energia": {
    name: "Choque de Energia",
    desc: "Dano energético puro",
    icon: "⚡",
    color: "#ff0",
    categories: ["corpo_inferior", "corpo_superior"],
    stats: { atk: -10, def: 0 }
  },
  "som": {
    name: "Onda Sônica",
    desc: "Tímpanos rompidos",
    icon: "🔊",
    color: "#ff6",
    categories: ["corpo_inferior", "corpo_superior", "cabeca"],
    stats: { atk: -10, def: 0 }
  },
  "nevoeiro": {
    name: "Névoa Tóxica",
    desc: "Pulmões enfraquecidos",
    icon: "🌫️",
    color: "#699",
    categories: ["corpo_inferior", "corpo_superior", "cabeca"],
    stats: { atk: 0, def: -5 }
  }
};

// 1.2 Banco de dados de Biomas
const BIOMAS_DATABASE = {
  "catacumbas_sombrias": {
    name: "Catacumbas Sombrias",
    color: "#4a525a",
    img: "catacumbas",
    traumas_disponiveis: ["cortante", "fisico", "estrangular", "magia", "som", "veneno"],
    efeitoAmbiental: (monstro) => {
      if (monstro.tipo === "Morto-vivo") monstro.resistances.push("magia");
      else monstro.weaknesses.push("nevoeiro");
    }
  },
  "pantano_peste": {
    name: "Pântano de Peste",
    color: "#064e3b",
    img: "pantano",
    traumas_disponiveis: ["veneno", "fogo", "magia", "nevoeiro", "deglutir"],
    efeitoAmbiental: (monstro) => {
      if (monstro.tipo === "Gosma") monstro.weaknesses.push("fogo");
      else if (monstro.tipo === "Fera") monstro.resistances.push("veneno");
      else monstro.weaknesses.push("nevoeiro");
    }
  },
  "forja_profana": {
    name: "Forja Profana dos Abismos",
    color: "#7f1d1d",
    img: "forja",
    traumas_disponiveis: ["fogo", "fisico", "estilhaçar", "energia", "cortante"],
    efeitoAmbiental: (monstro) => {
      monstro.resistances.push("fogo");
    }
  },
  "cavernas_magma": {
    name: "Cavernas de Magma",
    color: "#7a2411",
    img: "magma",
    traumas_disponiveis: ["fogo", "fisico", "energia", "estrangular"],
    efeitoAmbiental: (monstro) => {
      monstro.resistances.push("fogo");
    }
  },
  "floresta_sombras": {
    name: "Floresta das Sombras",
    color: "#27ae60",
    img: "floresta",
    traumas_disponiveis: ["cortante", "veneno", "estrangular", "rasgar", "nevoeiro"],
    efeitoAmbiental: (monstro) => {
      monstro.resistances.push("terra");
    }
  },
  "abismo_cristal": {
    name: "Abismo de Cristal",
    color: "#00d2ff",
    img: "cristal",
    traumas_disponiveis: ["gelo", "magia", "cortante", "frio_intenso", "estilhaçar"],
    efeitoAmbiental: (monstro) => {
      monstro.resistances.push("gelo");
    }
  }
};

// =========================================================================
// 2. SISTEMA DE APLICAÇÃO E TESTE
// =========================================================================

function GerarFerimento(personagem, idBioma) {
    const bioma = BIOMAS_DATABASE[idBioma];
    if (!bioma) return;

    // Sorteia um trauma disponível neste bioma
    const traumas = bioma.traumas_disponiveis;
    const traumaSorteadoId = traumas[Math.floor(Math.random() * traumas.length)];
    const trauma = TRAUMAS_DATABASE[traumaSorteadoId];

    console.log(`\n🩸 [CRÍTICO NO BIOMA: ${bioma.name.toUpperCase()}]`);
    console.log(`${personagem.nome} sofreu: ${trauma.icon} ${trauma.name} - "${trauma.desc}"`);
    
    // Aplica penalidades
    if (trauma.stats.atk < 0) {
        personagem.atk += trauma.stats.atk;
        console.log(`🔻 ATK reduzido em ${Math.abs(trauma.stats.atk)}! (ATK Atual: ${personagem.atk})`);
    }
    if (trauma.stats.def < 0) {
        personagem.def += trauma.stats.def;
        console.log(`🔻 DEF reduzida em ${Math.abs(trauma.stats.def)}! (DEF Atual: ${personagem.def})`);
    }

    if (!personagem.traumas) personagem.traumas = [];
    personagem.traumas.push(trauma.name);
}

// ---------------------------------------------------------
// SIMULAÇÃO DE COMBATE (Comentado para não rodar sozinho ao importar)
// ---------------------------------------------------------
/*
let jogador = {
    nome: "Lyra, A Silenciosa",
    atk: 100,
    def: 100,
    traumas: []
};

console.log("=== STATUS INICIAL DO JOGADOR ===");
console.log(`ATK: ${jogador.atk} | DEF: ${jogador.def}`);

// Simulando que ela tomou golpes críticos em biomas diferentes!
GerarFerimento(jogador, "catacumbas_sombrias");
GerarFerimento(jogador, "pantano_peste");
GerarFerimento(jogador, "abismo_cristal");
GerarFerimento(jogador, "forja_profana");

console.log("\n=== STATUS FINAL APÓS A EXPEDIÇÃO ===");
console.log(jogador);
*/

// =========================================================================
// 3. EXPORTAÇÃO DOS MÓDULOS
// =========================================================================
module.exports = {
    TRAUMAS_DATABASE,
    BIOMAS_DATABASE,
    GerarFerimento
};