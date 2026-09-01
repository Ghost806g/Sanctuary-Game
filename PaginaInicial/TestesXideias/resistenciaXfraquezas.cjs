// =========================================================================
// SISTEMA DE FRAQUEZAS, RESISTÊNCIAS E INTERAÇÃO COM BIOMAS
// =========================================================================

// 1. BIOLOGIAS (A Base do Monstro)
const biologiaMortoVivo = {
    nome: "Morto-Vivo", 
    baseWeaknesses: ["luz", "fogo"],
    baseResistances: ["trevas", "veneno"]
};

const biologiaFera = {
    nome: "Fera",
    baseWeaknesses: ["fogo", "veneno"],
    baseResistances: ["terra"]
};

const biologiaEctoplasma = {
    nome: "Ectoplasma",
    baseWeaknesses: ["luz", "ar", "arcano"],
    baseResistances: ["físico", "trevas", "veneno"]
};

const biologiaGosma = {
    nome: "Gosma / Lodo",
    baseWeaknesses: ["gelo", "fogo"],
    baseResistances: ["físico", "veneno", "água"]
};

const biologiaHumanoide = {
    nome: "Humanoide / Cultista",
    baseWeaknesses: ["trevas"],
    baseResistances: ["luz"]
};

const biologiaMonstruosidade = {
    nome: "Monstruosidade",
    baseWeaknesses: ["luz", "arcano"],
    baseResistances: ["terra", "físico"]
};

const biologiaPlanta = {
    nome: "Planta",
    baseWeaknesses: ["fogo", "gelo", "veneno"],
    baseResistances: ["terra", "água", "luz"]
};


// =========================================================================
// 2. BIOMAS (Modificadores Ambientais)
const biomaCatacumbas = {
    nome: "Catacumbas Sombrias",
    efeitoAmbiental: function(monstro) {
        // Nas catacumbas escuras, a luz pune muito mais
        if (!monstro.weaknesses.includes("luz")) {
            monstro.weaknesses.push("luz");
        }
        // Seres da tumba costumam ser imunes às trevas do lugar
        if (!monstro.resistances.includes("trevas")) {
            monstro.resistances.push("trevas");
        }
        
        // Feras nas catacumbas ficam pálidas e frágeis contra gelo
        if (monstro.biologia === "Fera") {
            monstro.weaknesses.push("gelo");
        }
    }
};

const biomaPantano = {
    nome: "Pântano de Peste",
    efeitoAmbiental: function(monstro) {
        // Tudo no pântano é úmido, ganhando resistência a Fogo
        if (!monstro.resistances.includes("fogo")) {
            monstro.resistances.push("fogo");
        }
        
        // O pântano já é venenoso, então quem vive lá se adapta
        if (!monstro.resistances.includes("veneno")) {
            monstro.resistances.push("veneno");
        }
        
        // Porém, a umidade e a lama os tornam ótimos condutores de eletricidade (Ar/Raio) e Gelo
        monstro.weaknesses.push("ar", "gelo");

        // Plantas no pântano sombrio absorvem a podridão
        if (monstro.biologia === "Planta") {
            monstro.resistances.push("trevas");
            // Remove a fraqueza a veneno que as plantas normalmente têm
            monstro.weaknesses = monstro.weaknesses.filter(w => w !== "veneno");
        }
    }
};

const biomaForja = {
    nome: "Forja Infernal",
    efeitoAmbiental: function(monstro) {
        // Tudo na forja é resistente ao calor
        if (!monstro.resistances.includes("fogo")) {
            monstro.resistances.push("fogo");
        }
        // A terra está rachada e seca, fraca contra água
        if (!monstro.weaknesses.includes("água")) {
            monstro.weaknesses.push("água");
        }
        // O calor extremo pode rachar o gelo
        if (!monstro.weaknesses.includes("gelo")) {
            monstro.weaknesses.push("gelo");
        }
    }
};

const biomaCavernaMagma = {
    nome: "Cavernas de Magma",
    efeitoAmbiental: function(monstro) {
        // Bioma de puro fogo
        if (!monstro.resistances.includes("fogo")) monstro.resistances.push("fogo");
        if (!monstro.weaknesses.includes("água")) monstro.weaknesses.push("água");
        if (!monstro.weaknesses.includes("gelo")) monstro.weaknesses.push("gelo");
    }
};

const biomaFloresta = {
    nome: "Floresta das Sombras",
    efeitoAmbiental: function(monstro) {
        // A floresta dá vida e resistência natural a veneno e terra
        if (!monstro.resistances.includes("terra")) monstro.resistances.push("terra");
        
        // Feras ganham vantagem furtiva
        if (monstro.biologia === "Fera" && !monstro.resistances.includes("veneno")) monstro.resistances.push("veneno");
        
        // Tudo é muito denso e suscetível a incêndios
        if (!monstro.weaknesses.includes("fogo")) monstro.weaknesses.push("fogo");
    }
};

const biomaAbismoCristal = {
    nome: "Abismo de Cristal",
    efeitoAmbiental: function(monstro) {
        // O gelo eterno fortalece as resistências a água e gelo
        if (!monstro.resistances.includes("gelo")) monstro.resistances.push("gelo");
        if (!monstro.resistances.includes("água")) monstro.resistances.push("água");
        
        // Porém torna a pele quebradiça contra dano físico e fogo
        if (!monstro.weaknesses.includes("fogo")) monstro.weaknesses.push("fogo");
        if (!monstro.weaknesses.includes("físico") && monstro.biologia !== "Gosma / Lodo") {
            monstro.weaknesses.push("físico"); // Estilhaça mais fácil, a menos que seja gosma!
        }
    }
};


// =========================================================================
// 3. O GERADOR E VALIDADOR
function CriarMonstro(id, name, biologiaObj, biomaObj = null) {
    let monstro = {
        id: id,
        name: name,
        biologia: biologiaObj.nome,
        // Faz uma cópia das fraquezas e resistências base da biologia
        weaknesses: [...biologiaObj.baseWeaknesses],
        resistances: [...biologiaObj.baseResistances]
    };

    // Aplica as regras do Bioma se houver um
    if (biomaObj) {
        monstro.bioma = biomaObj.nome;
        biomaObj.efeitoAmbiental(monstro);
    }

    // Validação de Conflitos (Se o Bioma anulou algo da biologia)
    // Exemplo: Biologia diz "Fraco a Fogo", mas Bioma dá "Resistência a Fogo"
    const conflitos = monstro.weaknesses.filter(fraq => monstro.resistances.includes(fraq));
    
    if (conflitos.length > 0) {
        // RESOLUÇÃO DE CONFLITO: Eles se anulam! (Neutralidade)
        // Remove dos dois arrays
        conflitos.forEach(conflito => {
            monstro.weaknesses = monstro.weaknesses.filter(w => w !== conflito);
            monstro.resistances = monstro.resistances.filter(r => r !== conflito);
        });
        console.log(`⚠️ Conflito resolvido para [${monstro.name}]: O(s) elemento(s) '${conflitos.join(", ")}' se anularam e tornaram-se Dano Neutro.`);
    }

    // Filtra duplicatas apenas por segurança
    monstro.weaknesses = [...new Set(monstro.weaknesses)];
    monstro.resistances = [...new Set(monstro.resistances)];

    return monstro;
}

// =========================================================================
// 4. TESTANDO A LISTA DE MONSTROS DO JOGO

console.log("=== MONSTROS DAS CATACUMBAS SOMBRIAS ===");
const ratoMutante = CriarMonstro("rato_mutante", "Rato Mutante", biologiaFera, biomaCatacumbas);
console.log(ratoMutante);

const esqueletoGuarda = CriarMonstro("esqueleto_guarda", "Esqueleto de Guarda", biologiaMortoVivo, biomaCatacumbas);
console.log(esqueletoGuarda);

const lodoCarnivoro = CriarMonstro("lodo_carnivoro", "Lodo Carnívoro", biologiaGosma, biomaCatacumbas);
console.log(lodoCarnivoro);


console.log("\n=== MONSTROS DO PÂNTANO DE PESTE ===");
// O Pântano anula a fraqueza a Fogo da "Fera", transformando Fogo em Dano Neutro!
const caoInfectado = CriarMonstro("cao_infectado", "Cão Infectado", biologiaFera, biomaPantano);
console.log(caoInfectado);

// A Bruxa herda as resistências do Pântano e mantém as humanas
const vexBruxa = CriarMonstro("vex_bruxa", "Vex, A Bruxa do Pântano", biologiaHumanoide, biomaPantano);
console.log(vexBruxa);

// A Árvore é do tipo Planta. Plantas são fracas a veneno, mas como está no pântano, o bioma anula e fortalece!
const arvorePodre = CriarMonstro("arvore_podre", "Árvore Podre Andante", biologiaPlanta, biomaPantano);
console.log(arvorePodre);

console.log("\n=== TESTANDO OUTRAS BIOLOGIAS (ELITES) ===");

// Morte Menor: Uma ceifadora fantasma nas Catacumbas
// Ectoplasma tem fraqueza a Luz. O bioma Catacumbas ADICIONA fraqueza a Luz.
// A função CriarMonstro automaticamente remove fraquezas duplicadas usando Set()
const morteMenor = CriarMonstro("morte_menor", "Morte Menor", biologiaEctoplasma, biomaCatacumbas);
console.log(morteMenor);

// Besta Sanguinária: Uma Monstruosidade brutal do Pântano
// Monstruosidades normais resistem a Físico e Terra. O Pântano dá resistência a Fogo e Veneno, e fraqueza a Gelo e Ar.
const bestaSanguinaria = CriarMonstro("besta_sanguinaria", "Besta Sanguinária", biologiaMonstruosidade, biomaPantano);
console.log(bestaSanguinaria);

console.log("\n=== MONSTROS DA FORJA PROFANA ===");
// Diabrete Ferreiro: Um demônio humanoide da forja
const diabreteFerreiro = CriarMonstro("diabrete_ferreiro", "Diabrete Ferreiro", biologiaHumanoide, biomaForja);
console.log(diabreteFerreiro);

console.log("\n=== MONSTROS DAS CAVERNAS DE MAGMA ===");
// Lagarto de Lava: Uma fera adaptada ao calor
// O calor das cavernas anula a fraqueza base da Fera a fogo, mas traz fraqueza a água e gelo.
const lagartoLava = CriarMonstro("lagarto_lava", "Lagarto de Lava", biologiaFera, biomaCavernaMagma);
console.log(lagartoLava);

console.log("\n=== MONSTROS DA FLORESTA DAS SOMBRAS ===");
// Lobo de Ruína: Uma Fera da floresta
// Ganha vantagem furtiva (resistência a veneno), mas como é floresta densa, ganha fraqueza a fogo.
const loboRuina = CriarMonstro("lobo_ruina", "Lobo de Ruína", biologiaFera, biomaFloresta);
console.log(loboRuina);

// Ent Corrompido: Uma criatura Planta corrompida
const entCorrompido = CriarMonstro("ent_corrompido", "Ent Corrompido", biologiaPlanta, biomaFloresta);
console.log(entCorrompido);

console.log("\n=== MONSTROS DO ABISMO DE CRISTAL ===");
// Elemental de Gelo: Uma forma de vida Ectoplasmática (energia) do gelo.
// Ganha fraqueza a Físico e Fogo por causa do gelo quebradiço.
const elementalGelo = CriarMonstro("elemental_gelo", "Elemental de Gelo", biologiaEctoplasma, biomaAbismoCristal);
console.log(elementalGelo);

// Cria de Seath: Uma Gosma mágica. Pela biologia, Gosmas NÃO estilhaçam, então o bioma não aplica fraqueza a físico nela!
const criaSeath = CriarMonstro("cria_seath", "Cria de Seath", biologiaGosma, biomaAbismoCristal);
console.log(criaSeath);
