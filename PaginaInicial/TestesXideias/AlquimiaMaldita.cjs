// ======================================================================
// ===================== TESTES DE ALQUIMIA MALDITA ===================== 
// ======================================================================

// ==========================================================================================
// ==================== ARRISQUE CONFIANDO NA MEMORIA OU PAGA COM A VIDA ==================== 
// ==========================================================================================

// 1. O BANCO DE DADOS DE POÇÕES / A POÇÃO-PROVA / POÇÕES BUFFS

// ---------------------------------------------------------
// BANCO DE DADOS DE POÇÕES E EFEITOS
// ---------------------------------------------------------
const POCOES_DATABASE = {
    // --- POÇÕES DE VIDA ---
    "poção_cura_leves": {
        nome: "Poção de Cura Leve",
        desc: "Restaura uma pequena quantidade de vida.",
        icon: "⚗️",
        efeito: "cura_leve"
    },
    "poção_cura_média": {
        nome: "Poção de Cura Média",
        desc: "Restaura uma boa quantidade de vida.",
        icon: "⚗️",
        efeito: "cura_media"
    },
    "poção_cura_total": {
        nome: "Poção de Cura Total",
        desc: "Restaura toda a vida.",
        icon: "⚗️",
        efeito: "cura_total"
    },
    // --- POÇÕES DE VIGOR ---
    "poção_ vigor_leves": {
        nome: "Poção de Vigor Leve",
        desc: "Restaura um pouco de vigor.",
        icon: "🧪",
        efeito: "vigor_leves"
    },
    "poção_ vigor_média": {
        nome: "Poção de Vigor Média",
        desc: "Restaura vigor rapidamente.",
        icon: "🧪",
        efeito: "vigor_média"
    },
    "poção_ vigor_total": {
        nome: "Poção de Vigor Total",
        desc: "Restaura todo o vigor instantaneamente.",
        icon: "🧪",
        efeito: "vigor_total"
    },
    // --- POÇÕES DE MANA ---
    "poção_ mana_leves": {
        nome: "Poção de Mana Leve",
        desc: "Restaura um pouco de mana.",
        icon: "🔮",
        efeito: "mana_leves"
    },
    "poção_ mana_média": {
        nome: "Poção de Mana Média",
        desc: "Restaura mana rapidamente.",
        icon: "🔮",
        efeito: "mana_média"
    },
    "poção_ mana_total": {
        nome: "Poção de Mana Total",
        desc: "Restaura toda a mana.",
        icon: "🔮",
        efeito: "mana_total"
    },
    // --- POÇÕES BUFFS ---
    "poção_fortitude": {
        nome: "Poção da Fortitude",
        desc: "Aumenta a defesa temporariamente.",
        icon: "🛡️",
        efeito: "buff_fortitude"
    },
    "poção_agilidade": {
        nome: "Poção da Agilidade",
        desc: "Aumenta a agilidade temporariamente.",
        icon: "⚡",
        efeito: "buff_agilidade"
    },
    "poção_força": {
        nome: "Poção da Força",
        desc: "Aumenta a força temporariamente.",
        icon: "💪",
        efeito: "buff_forca"
    },
    "poção_inteligência": {
        nome: "Poção da Inteligência",
        desc: "Aumenta a inteligência temporariamente.",
        icon: "🧠",
        efeito: "buff_inteligencia"
    },
    "poção_fortitude_mágica": {
        nome: "Poção da Fortitude Mágica",
        desc: "Aumenta a defesa mágica temporariamente.",
        icon: "🛡️",
        efeito: "buff_fortitude_magica"
    },
    // --- POÇÕES TÓXICAS/PERIGOSAS ---
    "poção_veneno": {
        nome: "Poção de Veneno",
        desc: "Envenena o usuário",
        icon: "☢️",
        efeito: "veneno"
    },
    "poção_explossiva": {
        nome: "Poção Explosiva",
        desc: "Explode ao ser consumida",
        icon: "💥",
        efeito: "explosao"
    },
    "poção_cura_confusa": {
        nome: "Poção de Cura Confusa",
        desc: "Restaura vida, mas inverte controles temporariamente",
        icon: "🤪",
        efeito: "cura_confusao"
    }
};

// A POÇÃO-PROVA: É SEMPRE A POÇÃO DE CURA MÉDIA
const POCOES_CURA_MEDIA = {
    nome: "Poção de Cura Média",
    desc: "Restaura uma boa quantidade de vida.",
    icon: "⚗️",
    efeito: "cura_media"
};


// ---------------------------------------------------------
// BANCO DE DADOS DE INGREDIENTES
// ---------------------------------------------------------
const INGREDIENTES_DATABASE = {
    "erva_sangue": { nome: "Erva de Sangue", tipo: "erva", icon: "🌿" },
    "gosma_toxica": { nome: "Gosma Tóxica", tipo: "monstro", icon: "🤢" },
    "cristal_puro": { nome: "Cristal Puro", tipo: "mineral", icon: "💎" },
    "cogumelo_sombra": { nome: "Cogumelo das Sombras", tipo: "fungo", icon: "🍄" },
    "olho_corvo": { nome: "Olho de Corvo", tipo: "monstro", icon: "👁️" }
};

// ---------------------------------------------------------
// RECEITAS DE ALQUIMIA
// ---------------------------------------------------------
const RECEITAS = [
    {
        ingredientes: ["erva_sangue", "cristal_puro"],
        resultado: "poção_cura_média"
    },
    {
        ingredientes: ["erva_sangue", "erva_sangue"],
        resultado: "poção_cura_leves"
    },
    {
        ingredientes: ["gosma_toxica", "cogumelo_sombra"],
        resultado: "poção_veneno"
    },
    {
        ingredientes: ["gosma_toxica", "cristal_puro"],
        resultado: "poção_cura_confusa"
    }
];

// ==================== A MESA DE ALQUIMIA VIRTUAL ==================== 
// ARRASTE E SOLTE SEUS INGREDIENTES AQUI

let frascoAtual = {
  nome: "Frasco Vazio",
  ingredientes: [], // Guarda apenas as strings (IDs) dos ingredientes
  imagem: "frasco_vazio.png"
};

let mesaAlquimica = [];

//DRAG AND DROP (Para a UI do Front-End)
function iniciarDrag(event, tipo, id) {
  event.dataTransfer.setData("tipo", tipo);
  event.dataTransfer.setData("id", id);
}

function permitirDrop(event) {
  event.preventDefault();
}

function soltar(event, local) {
  event.preventDefault();
  
  const tipo = event.dataTransfer.getData("tipo");
  const id = event.dataTransfer.getData("id");
  
  let ingrediente = null;
  
  if (tipo === "ingrediente") ingrediente = INGREDIENTES_DATABASE[id];
  else if (tipo === "poção") ingrediente = POCOES_DATABASE[id];
  
  if (!ingrediente) return;
  
  if (local === "frasco") {
    if (frascoAtual.ingredientes.length < 3) {
      frascoAtual.ingredientes.push(id);
      console.log(`+ Você adicionou ${ingrediente.icon} ${ingrediente.nome} no frasco.`);
    }
  } else if (local === "mesa" && mesaAlquimica.length < 3) {
      mesaAlquimica.push(id);
      console.log(`+ Você colocou ${ingrediente.icon} ${ingrediente.nome} na mesa.`);
  }
}

// ==================== A FUNÇÃO DE POÇÃO-PROVA (MISTURA) ==================== 
function MisturarIngredientes(frasco) {
    if (frasco.ingredientes.length === 0) {
        console.log("⚗️ O frasco está vazio! Adicione ingredientes primeiro.");
        return null;
    }

    // Ordena para que a ordem dos ingredientes não importe
    const ingredientesMisturados = [...frasco.ingredientes].sort().join(",");
    
    console.log(`\n🔥 Aquecendo o caldeirão com: ${frasco.ingredientes.map(id => INGREDIENTES_DATABASE[id].icon).join(" + ")} ...`);

    let pocaoResultante = "poção_explossiva"; // Se der errado, BOOM! 💥

    for (let receita of RECEITAS) {
        const receitaOrdenada = [...receita.ingredientes].sort().join(",");
        if (ingredientesMisturados === receitaOrdenada) {
            pocaoResultante = receita.resultado;
            break;
        }
    }

    const pocao = POCOES_DATABASE[pocaoResultante];
    console.log(`✨ RESULTADO: Você criou ${pocao.icon} [${pocao.nome}] - "${pocao.desc}"`);
    
    // Limpa o frasco após misturar
    frasco.ingredientes = [];
    return pocao;
}

// ==================== A CORREÇÃO DE ERROS E A REUNIÃO ==================== 
// SIMULAÇÃO NO TERMINAL: TESTANDO A NOSSA ALQUIMIA

console.log("=== 📜 BEM-VINDO À BANCADA ALQUÍMICA 📜 ===");

// Teste 1: Receita Certa (Cura Média)
frascoAtual.ingredientes.push("erva_sangue", "cristal_puro");
MisturarIngredientes(frascoAtual);

// Teste 2: Receita Errada (Poção Explosiva!)
frascoAtual.ingredientes.push("erva_sangue", "gosma_toxica", "olho_corvo");
MisturarIngredientes(frascoAtual);

// Teste 3: Receita Perigosa (Cura, mas inverte controles)
frascoAtual.ingredientes.push("gosma_toxica", "cristal_puro");
MisturarIngredientes(frascoAtual);

// ---------------------------------------------------------
// EXPORTANDO PARA USO POSTERIOR
// ---------------------------------------------------------
module.exports = {
    POCOES_DATABASE,
    INGREDIENTES_DATABASE,
    RECEITAS,
    MisturarIngredientes
};
