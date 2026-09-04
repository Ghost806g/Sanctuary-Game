window.AlquimiaEngine = (function() {
    // ---------------------------------------------------------
    // BANCO DE DADOS DE POÇÕES E EFEITOS
    // ---------------------------------------------------------
    const POCOES_DATABASE = {
        "poção_cura_leves": { nome: "Poção de Cura Leve", desc: "Restaura uma pequena quantidade de vida.", icon: "⚗️", efeito: "cura_leve" },
        "poção_cura_média": { nome: "Poção de Cura Média", desc: "Restaura uma boa quantidade de vida.", icon: "⚗️", efeito: "cura_media" },
        "poção_cura_total": { nome: "Poção de Cura Total", desc: "Restaura toda a vida.", icon: "⚗️", efeito: "cura_total" },
        "poção_vigor_média": { nome: "Poção de Vigor Média", desc: "Restaura vigor rapidamente.", icon: "🧪", efeito: "vigor_média" },
        "poção_fortitude": { nome: "Poção da Fortitude", desc: "Aumenta a defesa temporariamente.", icon: "🛡️", efeito: "buff_fortitude" },
        "poção_veneno": { nome: "Poção de Veneno", desc: "Envenena o usuário", icon: "☢️", efeito: "veneno" },
        "poção_explossiva": { nome: "Poção Explosiva", desc: "Explode ao ser consumida", icon: "💥", efeito: "explosao" },
        "poção_cura_confusa": { nome: "Poção de Cura Confusa", desc: "Restaura vida, mas inverte controles temporariamente", icon: "🤪", efeito: "cura_confusao" }
    };

    let INGREDIENTES_DATABASE = {};

    const RECEITAS = [
        { ingredientes: ["erva_sangue", "flor_lotus"], resultado: "poção_cura_média" },
        { ingredientes: ["erva_sangue", "erva_sangue"], resultado: "poção_cura_leves" },
        { ingredientes: ["gosma_toxica", "cogumelo_umbrifugo"], resultado: "poção_veneno" },
        { ingredientes: ["raiz_forte", "gosma_toxica"], resultado: "poção_cura_confusa" }
    ];

    let frascoAtual = { ingredientes: [] };

    function renderIngredientList() {
        const container = document.getElementById("alchemy-ingredients-list");
        if (!container) return;
        
        container.innerHTML = "";

        if (typeof ALL_MATERIALS !== 'undefined') {
            const alchemyIds = ["erva_sangue", "gosma_toxica", "flor_lotus", "raiz_forte", "cogumelo_umbrifugo"];
            ALL_MATERIALS.forEach(mat => {
                if (alchemyIds.includes(mat.id)) {
                    INGREDIENTES_DATABASE[mat.id] = mat;
                }
            });
        }

        const allIds = Object.keys(INGREDIENTES_DATABASE);

        for (const id of allIds) {
            const ing = INGREDIENTES_DATABASE[id];
            const el = document.createElement("div");
            el.className = "item-card";
            el.style.padding = "15px";
            el.style.cursor = "grab";
            el.style.border = `1px solid ${ing.color || 'rgba(251, 191, 36, 0.3)'}`;
            el.style.borderRadius = "8px";
            el.style.marginBottom = "10px";
            el.style.background = "linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,10,10,0.9))";
            el.style.display = "flex";
            el.style.alignItems = "center";
            el.style.gap = "15px";
            el.draggable = true;
            
            el.innerHTML = `<img src="${ing.icon}" style="width: 48px; height: 48px; object-fit: contain;"> <strong style="color: ${ing.color || '#d1d5db'}; font-size: 1.1rem; font-family: 'Cinzel', serif;">${ing.name}</strong>`;
            
            el.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("id", id);
                e.dataTransfer.setData("type", "ingrediente");
            });
            container.appendChild(el);
        }
    }

    function renderCauldron() {
        const slots = document.querySelectorAll(".cauldron-slot");
        for(let i=0; i<3; i++) {
            if (i < frascoAtual.ingredientes.length) {
                const ingId = frascoAtual.ingredientes[i];
                const ing = INGREDIENTES_DATABASE[ingId];
                slots[i].innerHTML = `<img src="${ing.icon}" style="width: 80%; height: 80%; object-fit: contain;">`;
                slots[i].style.fontSize = ""; // reset emoji size
            } else {
                slots[i].innerHTML = "";
            }
        }
    }

    function setupDragAndDrop() {
        const cauldronArea = document.getElementById("alchemy-cauldron-area");
        if (!cauldronArea) return;

        cauldronArea.addEventListener("dragover", (e) => {
            e.preventDefault();
            cauldronArea.classList.add("drag-hover");
        });

        cauldronArea.addEventListener("dragleave", (e) => {
            cauldronArea.classList.remove("drag-hover");
        });

        cauldronArea.addEventListener("drop", (e) => {
            e.preventDefault();
            cauldronArea.classList.remove("drag-hover");
            const id = e.dataTransfer.getData("id");
            if (id && INGREDIENTES_DATABASE[id]) {
                if (frascoAtual.ingredientes.length < 3) {
                    frascoAtual.ingredientes.push(id);
                    renderCauldron();
                    document.getElementById("alchemy-result-display").innerHTML = "Aguardando mistura...";
                } else {
                    document.getElementById("alchemy-result-display").innerHTML = "<span style='color: #ef4444;'>O caldeirão já está cheio! (Máx 3)</span>";
                }
            }
        });
    }

    function misturar() {
        const resultDisplay = document.getElementById("alchemy-result-display");
        
        if (frascoAtual.ingredientes.length === 0) {
            resultDisplay.innerHTML = "⚗️ O frasco está vazio! Adicione ingredientes primeiro.";
            return;
        }

        const ingredientesMisturados = [...frascoAtual.ingredientes].sort().join(",");
        let pocaoResultante = "poção_explossiva";

        for (let receita of RECEITAS) {
            const receitaOrdenada = [...receita.ingredientes].sort().join(",");
            if (ingredientesMisturados === receitaOrdenada) {
                pocaoResultante = receita.resultado;
                break;
            }
        }

        const pocao = POCOES_DATABASE[pocaoResultante];
        const isExplosive = pocaoResultante === "poção_explossiva";
        const color = isExplosive ? "#ef4444" : "#fbbf24";
        
        resultDisplay.innerHTML = `<div style="animation: textFloatUp 0.5s ease-out; background: rgba(0,0,0,0.6); padding: 20px; border-radius: 8px; border: 1px solid ${color};">
            <div style="font-size: 3rem; margin-bottom: 10px;">${pocao.icon}</div>
            <strong style="color: ${color}; font-size: 1.5rem; font-family: 'Cinzel', serif;">VOCÊ CRIOU:<br>${pocao.nome}</strong><br><br>
            <i style="color: #d1d5db;">"${pocao.desc}"</i>
        </div>`;
        
        // Limpar frasco
        frascoAtual.ingredientes = [];
        renderCauldron();
    }
    
    function limparFrasco() {
        frascoAtual.ingredientes = [];
        renderCauldron();
        document.getElementById("alchemy-result-display").innerHTML = "Caldeirão limpo. Pronto para nova receita.";
    }

    function init() {
        renderIngredientList();
        setupDragAndDrop();
    }

    // Initialize directly since scripts are loaded sequentially after DOM is ready
    setTimeout(init, 500);

    return {
        init,
        misturar,
        limparFrasco
    };
})();
