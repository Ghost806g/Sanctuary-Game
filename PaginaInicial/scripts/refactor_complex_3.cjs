const fs = require('fs');

let content = fs.readFileSync('C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/main.js', 'utf8');

// Helper to replace a function
const replaceFunction = (content, funcName, newCode, isWindowFunc = false) => {
    const lines = content.split('\n');
    let prefix = isWindowFunc ? `window.${funcName} = function` : `function ${funcName}`;
    const start = lines.findIndex(l => l.includes(prefix));
    if (start === -1) {
        console.error("Function " + funcName + " not found");
        return content;
    }
    let end = start;
    let braces = 0;
    do {
        if(lines[end].includes('{')) braces += (lines[end].match(/\{/g)||[]).length;
        if(lines[end].includes('}')) braces -= (lines[end].match(/\}/g)||[]).length;
        end++;
    } while(braces > 0 && end < lines.length);

    lines.splice(start, end - start, newCode);
    return lines.join('\n');
};

const renderShadowsNew = `
function updateShadowsHeader(minion, btn, status, pwr) {
    let shadowPower = minion.gear.reduce((acc, g) => acc + (g.power || 0), 0);
    if (pwr) pwr.innerText = shadowPower;

    if (minion.active) {
        if (status) {
            status.innerText = "(Em Eedição - Retornando Recursos)";
            status.style.color = '#4ade80';
        }
        if (btn) {
            btn.innerText = "Chamar de Volta";
            btn.className = "btn";
            btn.style.background = "#b91c1c";
        }
    } else {
        if (status) {
            status.innerText = "(Aguardando Ordens nos Quartel)";
            status.style.color = '#94a3b8';
        }
        if (btn) {
            btn.innerText = "Mandar para Eedição";
            btn.className = "btn btn-secondary";
            btn.style.background = "";
        }
    }
}

function renderShadowsGearAndLoot(minion, gearMesh, lootMesh) {
    gearMesh.innerHTML = minion.gear.map((g, id) => {
        return \`<div onclick="unequipShadow(\${id})" class="item-icon rarity-\${g.rarity || 'Normal'}" style="width:64px;height:64px; border:1px solid #475569; border-radius:4px; display:flex; align-items:center; justify-content:center; cursor:pointer; text-align:center; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            <span style="font-size:0.6rem; color:#fff; text-shadow:0 0 2px #000;">\${(g.type || '').toUpperCase()}<br>Pwr:\${g.power || 0}</span>
        </div>\`;
    }).join('');

    if (minion.gear.length === 0) gearMesh.innerHTML = \`<span style="color:#64748b; font-size:0.9rem; text-align:center;">Nenhuma equipamentos vestido.</span>\`;

    if (minion.loot.length === 0) {
        if (lootMesh) lootMesh.innerHTML = \`<span style="color:#334155;">Nenhuma espólio.</span>\`;
    } else {
        if (lootMesh) lootMesh.innerHTML = minion.loot.map(items => \`<div class="item-icon rarity-\${items.rarity || 'Normal'}" style="width:40px;height:40px; border:1px solid #475569; border-radius:2px; font-size:0.5rem; text-align:center;">\${items.name.substring(0, 5)}</div>\`).join('');
    }
}

window.renderShadows = function () {
    const hero = getActiveHero();
    if (!hero) return;

    if (!hero.shadowMinions || !Array.isArray(hero.shadowMinions.gear)) {
        hero.shadowMinions = { active: false, level: 1, gear: [], loot: [], lastTick: Date.now() };
    }
    const minion = hero.shadowMinions;

    const gearMesh = document.getElementById('shadow-gear-mesh');
    const invMesh = document.getElementById('shadow-inventory-mesh');
    const lootMesh = document.getElementById('shadow-loot-mesh');
    const btn = document.getElementById('shadow-deploy-btn');
    const status = document.getElementById('shadow-status');
    const pwr = document.getElementById('shadow-power');
    if (!gearMesh || !invMesh) return;

    updateShadowsHeader(minion, btn, status, pwr);
    renderShadowsGearAndLoot(minion, gearMesh, lootMesh);

    const validInv = (hero.inventory || []).map((items, index) => ({ items, index })).filter(entry => entry.items && !(entry.items.type || '').includes('consumivel') && entry.items.type !== 'relics');

    if (validInv.length === 0) {
        invMesh.innerHTML = \`<div style="grid-column:1/-1; text-align:center; color:#94a3b8; padding:20px;">Inventário vazios. Nenhuma equipamentos sobrando.</div>\`;
    } else {
        invMesh.innerHTML = validInv.map(entry => {
            return \`<div class="inventory-item rarity-\${entry.items.rarity || 'Normal'}" onclick="equipShadow(\${entry.index})" style="text-align: center;">
                \${entry.items.name} <br><span style="color:#aaa; font-size:0.75rem;">Poder: \${entry.items.power || 0}</span>
            </div>\`;
        }).join('');
    }
}
`;

content = replaceFunction(content, 'renderShadows', renderShadowsNew, true);

// Refactor initializeEngine
const initializeEngineNew = `
function initializeGameEngineStorage() {
    try {
        const data = localStorage.getItem(DATABASE_KEY_V5);
        if (data) {
            let parsedData = JSON.parse(data);
            if (parsedData.appState) {
                appState = parsedData.appState;
                localStorage.setItem(DATABASE_KEY_V5, JSON.stringify(appState));
            } else {
                appState = parsedData;
            }
        }
    } catch (error_) { console.error(error_); }
    
    if (!appState.slots) appState.slots = [null, null, null];
}

function normalizeHeroData(hero) {
    if (typeof hero.xp !== 'undefined') { hero.exp = hero.xp; delete hero.xp; }
    if (!hero.loreChapters) hero.loreChapters = {};
    if (!hero.materials) {
        let m = {};
        ALL_MATERIALS.forEach(mat => m[mat.id] = 0);
        hero.materials = m;
    }
    if (!hero.materials.runes) hero.materials.runes = 0;
    if (!hero.pantheon) hero.pantheon = {};
    if (!hero.dungeonLevel) hero.dungeonLevel = 1;
    if (!hero.floorExploration) hero.floorExploration = 0;
    if (!hero.floorProgress) hero.floorProgress = 0;
    if (!hero.maxDungeonLevel) hero.maxDungeonLevel = hero.dungeonLevel;
    if (!hero.companions) hero.companions = [];
    if (!hero.campUpgrades) hero.campUpgrades = { tent: false, forges: false, statue: false };
    if (!hero.bestiary) hero.bestiary = {};
}

function initializeEngine() {
    initializeGameEngineStorage();

    appState.slots.forEach(hero => {
        if (hero) {
            normalizeHeroData(hero);
        }
    });

    if (!appState.slots[0]) document.getElementById('save-slots-deck').innerHTML = '<h3 style="color:#64748b; font-style:italic; grid-column:1/-1; text-align:center;">Registros Akashicos corrompidos. Inicie suas lendas.</h3>';
    
    renderSavesTab();
    
    window.gameEnginePulse = setInterval(() => {
        if (activeCombatInstance) {
            const h = getActiveHero();
            if (h && (h.currentHp <= 0)) {
                logCombatEntry("☠️ Seu heróis tombou...");
                activeCombatInstance = null;
                setTimeout(() => {
                    handleDeath();
                }, 2000);
            }
        }
    }, 1000);
}
`;

content = replaceFunction(content, 'initializeEngine', initializeEngineNew, false);

fs.writeFileSync('C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/main.js', content);
console.log("Refactored renderShadows and initializeEngine.");
