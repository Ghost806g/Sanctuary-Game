const fs = require('fs');

let content = fs.readFileSync('C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/main.js', 'utf8');

// Refactor createFreshHero
const freshHeroNew = `
function initializeBaseAttributes(cls) {
    let baseAttrs = { forca: 10, constituicao: 10, agilidade: 10, inteligencia: 10, sabedoria: 10 };
    if (cls === 'Guerreiro') { baseAttrs.forca = 15; baseAttrs.constituicao = 13; }
    else if (cls === 'Arcanista') { baseAttrs.inteligencia = 16; baseAttrs.sabedoria = 12; }
    else if (cls === 'Ranger') { baseAttrs.agilidade = 16; baseAttrs.sabedoria = 12; }
    else if (cls === 'Barbaro') { baseAttrs.forca = 17; baseAttrs.constituicao = 12; }
    else if (cls === 'Paladino') { baseAttrs.constituicao = 14; baseAttrs.sabedoria = 14; }
    else if (cls === 'Necromante') { baseAttrs.inteligencia = 15; baseAttrs.sabedoria = 13; }
    return baseAttrs;
}

function initializeHeroSkills(cls) {
    let skillTree = {};
    if (MASTER_SKILLS_DATA[cls]) {
        MASTER_SKILLS_DATA[cls].forEach(s => skillTree[s.id] = 0);
        if (MASTER_SKILLS_DATA[cls][0]) skillTree[MASTER_SKILLS_DATA[cls][0].id] = 1;
    }
    return skillTree;
}

function applyTempHeroBackground(newHero) {
    try {
        const tempHero = localStorage.getItem('Sanctuary_NewHeroTemp');
        if (tempHero) {
            const data = JSON.parse(tempHero);
            if (data.name === newHero.names) {
                if (data.origin === 'Survivor') newHero.attributes.constituicao += 2;
                if (data.origin === 'Betrayed') newHero.attributes.forca += 2;
                if (data.origin === 'Pactbound') newHero.attributes.inteligencia += 2;
                
                if (data.bonus === 'Power') { newHero.attributes.forca += 1; newHero.attributes.inteligencia += 1; }
                if (data.bonus === 'Redemption') newHero.attributes.sabedoria += 2;
                if (data.bonus === 'Oblivion') newHero.gold += 50;
                
                localStorage.removeItem('Sanctuary_NewHeroTemp');
            }
        }
    } catch (error_) { console.error(error_); /* ignorado propositalmente */ }
}

function createFreshHero(names, cls) {
    if (cls === 'Bárbaro' || cls.includes('rbaro') || cls === 'Barbaro') cls = 'Barbaro';
    let baseAttrs = initializeBaseAttributes(cls);

    let mat = {};
    ALL_MATERIALS.forEach(m => mat[m.id] = 0);
    mat.ferro = 6; mat.couro = 4; // Start Setup

    let skillTree = initializeHeroSkills(cls);

    let newHero = {
        names: names, class: cls, level: 1, exp: 0, maxXp: 120, gold: 200, stamina: 100,
        statPoints: 5, skillPoints: 2, dungeonLevel: 1, currentHp: 150, currentMana: 100,
        currentFocus: 0, maocus: 100,
        attributes: baseAttrs, materials: mat, inBossRestArea: false,
        pantheon: {},
        bestiary: {},
        loreChapters: {},
        floorExploration: 0,
        floorProgress: 0,
        maxDungeonLevel: 1,
        lastBonfireLevel: 1,
        equipment: {
            armas: null, capacete: null, armaduras: null, luvas: null,
            botas: null, escudo: null, anel1: null, anel2: null,
            colar1: null, colar2: null
        },
        inventory: [
            { id: 'init_w', name: 'Lâmina Enferrujada', type: 'armas', dmg: 8, power: 8, defense: 0, durability: 45, maxDurability: 100, rarity: 'Normal', desc: 'Uma lâminas velha e cheia de ferrugem. Ainda serve para cortar carne fraca.', intrinsic: null },
            { id: 'init_p1', name: 'Elixir de Vida', type: 'consumivel_hp', power: 150, rarity: 'Normal', desc: 'Restaura vastos HP.' },
            { id: 'init_p2', name: 'Elixir de Mana', type: 'consumivel_mp', power: 100, rarity: 'Magico', desc: 'Recupera suas Mentes Arcanas.' }
        ],
        companions: [
            { id: "c_init", name: "Lyra,  Silenciosa", desc: "Aumenta Chance Crítica.", affinity: 10, equipped: false, passiveId: 'cp_crit' }
        ],
        quests: [],
        skills: skillTree,
        campUpgrades: { tent: false, forges: false, statue: false },
        boughtSkillPoints: 0,
        hasSecretMap: false
    };

    applyTempHeroBackground(newHero);
    return newHero;
}
`;

// Refactor computeLiveStats
const computeLiveStatsNew = `
function getPantheonStats(hero, passives) {
    let pantheonStats = { pantheonDmgMult: 0, pantheonDefMult: 0, pantheonMaxMp: 0, pantheonGoldFind: 0 };
    if (hero.pantheon) {
        if (hero.pantheon.god_war) pantheonStats.pantheonDmgMult = hero.pantheon.god_war * 0.02;
        if (hero.pantheon.god_shield) pantheonStats.pantheonDefMult = hero.pantheon.god_shield * 0.03;
        if (hero.pantheon.god_vampire) passives.lifeSteal += hero.pantheon.god_vampire * 0.03;
        if (hero.pantheon.god_eye) passives.critChance += hero.pantheon.god_eye * 0.01;
        if (hero.pantheon.god_greed) pantheonStats.pantheonGoldFind = hero.pantheon.god_greed * 0.05;
        if (hero.pantheon.god_arcane) pantheonStats.pantheonMaxMp = hero.pantheon.god_arcane * 15;
    }
    return pantheonStats;
}

function applyGearStats(hero, passives) {
    let gearStats = { gearAtk: 0, gearDef: 0 };
    Object.values(hero.equipment).forEach(items => {
        if (!items) return;
        const itemAtk = (items.damage || items.power || 0);
        const itemDef = (items.defense || items.power || 0);

        if (['armas', 'anel1', 'anel2', 'colar1', 'colar2'].some(k => hero.equipment[k] === items)) {
            gearStats.gearAtk += itemAtk;
        } else {
            gearStats.gearDef += itemDef;
        }

        if (items.intrinsic) {
            const p = items.intrinsic;
            if (passives[p.type] !== undefined) passives[p.type] += p.value;
        }

        if (items.sockets) {
            items.sockets.forEach(rune => {
                if (rune && rune.effect) {
                    if (rune.effect.critChance) passives.critChance += rune.effect.critChance;
                    if (rune.effect.lifeSteal) passives.lifeSteal += rune.effect.lifeSteal;
                    if (rune.effect.defMult) gearStats.gearDef = Math.floor(gearStats.gearDef * (1 + rune.effect.defMult));
                    if (rune?.effect?.defMult) passives.defMult += rune.effect.defMult;
                    if (rune?.effect?.damageReduction) passives.damageReduction += rune.effect.damageReduction;
                }
            });
        }
    });
    return gearStats;
}

function applyCompanionStats(hero, passives, gearStats) {
    const comp = hero.companions.find(c => c.equipped);
    if (comp) {
        const cp = COMPANION_PASSIVES.find(p => p.id === comp.passiveId);
        if (cp && cp.buff) {
            if (cp.buff.critChance) passives.critChance += cp.buff.critChance;
            if (cp.buff.dmgMult) gearStats.gearAtk = Math.floor(gearStats.gearAtk * (1 + cp.buff.dmgMult));
            if (cp.buff.defMult) {
                gearStats.gearDef = Math.floor(gearStats.gearDef * (1 + cp.buff.defMult));
                passives.defMult += cp.buff.defMult;
            }
        }
    }
}

function getRelicStats(hero) {
    let relicStats = { relicHp: 0, relicMp: 0, relicAtk: 0, relicDef: 0 };
    hero.inventory.forEach(items => {
        if (items.type === 'relics' && items.relicBonus) {
            if (items.relicBonus.hp) relicStats.relicHp += items.relicBonus.hp;
            if (items.relicBonus.mp) relicStats.relicMp += items.relicBonus.mp;
            if (items.relicBonus.atk) relicStats.relicAtk += items.relicBonus.atk;
            if (items.relicBonus.def) relicStats.relicDef += items.relicBonus.def;
        }
    });
    return relicStats;
}

function computeLiveStats() {
    const hero = getActiveHero();
    if (!hero) return null;

    let passives = {
        critChance: 0.05, critDamage: 1.5, lifeSteal: 0, ignoreDef: 0, reflectDmg: 0,
        damageReduction: 0, magicResist: 0, defMult: 0, bestiaryDmg: 0, dodge: 0
    };

    if (hero.campUpgrades && hero.campUpgrades.statue) passives.dodge += 0.05;

    let gearStats = applyGearStats(hero, passives);
    applyCompanionStats(hero, passives, gearStats);

    let rawAttackScaling = 0;
    const cls = hero.class;
    if (['Guerreiro', 'Bárbaro'].includes(cls)) rawAttackScaling = hero.attributes.forca * 1.5;
    else if (['Arcanista', 'Necromante'].includes(cls)) rawAttackScaling = hero.attributes.inteligencia * 1.5;
    else if (['Ranger'].includes(cls)) rawAttackScaling = hero.attributes.agilidade * 1.5;
    else rawAttackScaling = hero.attributes.sabedoria * 1.5;

    let pantheonStats = getPantheonStats(hero, passives);
    let relicStats = getRelicStats(hero);

    return {
        maxHp: Math.floor(hero.attributes.constituicao * 15 + 50 + relicStats.relicHp),
        maxMp: Math.floor(hero.attributes.inteligencia * 10 + 20 + pantheonStats.pantheonMaxMp + relicStats.relicMp),
        maxStamina: Math.floor(100 + hero.attributes.constituicao * 3),
        attack: Math.floor((rawAttackScaling + gearStats.gearAtk + relicStats.relicAtk) * (1 + pantheonStats.pantheonDmgMult)),
        defense: Math.floor((hero.attributes.constituicao * 0.5 + gearStats.gearDef + relicStats.relicDef) * (1 + pantheonStats.pantheonDefMult)),
        passives: passives
    };
}
`;


const renderFichaTabNew = `
function renderPassivesSummary(passives) {
    let pSum = '<strong>Mecâúnicas Passivas Ativas n Ficha Mística:</strong><br>';
    if (passives.critChance > 0.05) pSum += '⬢ Chance Letal de Críticos: +' + Math.round((passives.critChance - 0.05) * 100) + '%<br>';
    if (passives.critDamage > 1.5) pSum += '⬢ Potência de Críticos: +' + Math.round((passives.critDamage - 1.5) * 100) + '%<br>';
    if (passives.lifeSteal > 0) pSum += '⬢ Roubo de Vida: ' + Math.round(passives.lifeSteal * 100) + '%<br>';
    if (passives.ignoreDef > 0) pSum += '⬢ Penetração de Armaduras: ' + Math.round(passives.ignoreDef * 100) + '%<br>';
    if (passives.reflectDmg > 0) pSum += '⬢ Refleão de Dano: ' + Math.round(passives.reflectDmg * 100) + '%<br>';
    if (passives.defMult > 0) pSum += '⬢ Carapaç Mística: +' + Math.round(passives.defMult * 100) + '% Defesa<br>';
    if (passives.damageReduction > 0) pSum += '⬢ Redução de Dano: -' + Math.round(passives.damageReduction * 100) + '%<br>';
    if (passives.magicResist > 0) pSum += '⬢ Resistência Mágicas: -' + Math.round(passives.magicResist * 100) + '%<br>';
    if (passives.dodge > 0) pSum += '⬢ Evasão Passivas: ' + Math.round(passives.dodge * 100) + '%<br>';

    if (pSum === '<strong>Mecâúnicas Passivas Ativas n Ficha Mística:</strong><br>') {
        pSum += "Nenhuma alteração passivas conectada aço seus corpos materials ainda.";
    }
    document.getElementById('sheet-passives-summary').innerHTML = pSum;
}

function renderAttributesBox(hero) {
    const ptBadge = document.getElementById('sheet-stat-points');
    if (hero.statPoints > 0) {
        ptBadge.innerText = hero.statPoints + ' Pontos Livres';
        ptBadge.style.display = 'inline-block';
    } else ptBadge.style.display = 'none';

    const attrBox = document.getElementById('attributes-allocation-engine');
    attrBox.innerHTML = '';
    const ATTR_TOOLTIPS = {
        forca: 'FO   +1.5 Dano Físico/pt. Escala: Guerreiro, Bárbaro, Paladino(Martelo).',
        constituicao: 'CON   +15 HP Má/pt, +0.5 Defesa/pt, +3 Estamina Má/pt.',
        agilidade: 'AGI   +1.5 Dano/pt (Ranger). Afeta evaso e velocidade.',
        inteligencia: 'INT   +10 Mana Má/pt, +1.5 Dano Mágicos/pt (Arcanista, Necromante).',
        sabedoria: 'SAB   +1.5 Dano/pt (Paladino). Escala curas e suportes.'
    };

    Object.keys(hero.attributes).forEach(attr => {
        const tooltip = ATTR_TOOLTIPS[attr] || '';
        attrBox.innerHTML += \`
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.4); padding:12px; border-radius:4px; border:1px solid #2a0b0d;" title="\${tooltip}">
                <span style="text-transform:uppercase; font-size:0.9rem; font-weight:bold; color:var(--gold-dim); letter-spacing:1px;">\${attr} <span class="attr-tooltip-icon"> </span></span>
                <div style="display:flex; align-items:center; gap:15px;">
                    <strong style="font-size:1.4rem; color:#fff; text-shadow:0 0 5px #000;">\${hero.attributes[attr]}</strong>
                    \${hero.statPoints > 0 ? \`<button class="btn btn-success" style="padding:4px 12px; width:auto; border-radius:12px;" onclick="allocateAttributePoint('\${attr}')">+1</button>\` : ''}
                </div>
            </div>
        \`;
    });
}

function renderPaperdoll(hero) {
    const paperdoll = document.getElementById('paperdoll-slots-mesh');
    paperdoll.innerHTML = '';
    paperdoll.style.gridTemplateColumns = 'repeat(auto-fit, minmax(140px, 1fr))';
    paperdoll.style.gap = '12px';

    const slots = [
        { keys: 'capacete', label: 'Capacete', icon: ': ' },
        { keys: 'armaduras', label: 'Armaduras', icon: ':' },
        { keys: 'luvas', label: 'Luvas', icon: '' },
        { keys: 'armas', label: 'Arma Principal', icon: ' ' },
        { keys: 'escudo', label: 'Escudo', icon: ':' },
        { keys: 'botas', label: 'Botas', icon: '' },
        { keys: 'anel1', label: 'Anel Esquerdo', icon: ' ' },
        { keys: 'anel2', label: 'Anel Direito', icon: ' ' },
        { keys: 'colar1', label: 'Colar', icon: ' ' },
        { keys: 'colar2', label: 'Colar', icon: ' ' }
    ];

    slots.forEach(slot => {
        const items = hero.equipment[slot.keys];
        let content = '';

        if (items) {
            let stats = [];
            if (items.damage) stats.push(\`Dano: <strong>\${items.damage}</strong>\`);
            if (items.defense) stats.push(\`Defesa: <strong>\${items.defense}</strong>\`);
            if (items.durability) stats.push(\`Durab.: \${items.durability}\`);

            content = \`
                <strong style="color:var(--gold-glowing); font-size:1.05rem;">\${items.name}</strong>
                <div style="font-size:0.8rem; color:#a5f3fc; margin:4px 0;">\${stats.join(' ⬢ ')}</div>
                \${items.intrinsic ? \`<div style="font-size:0.75rem; color:#a7f3d0; margin-top:6px;">S\${items.intrinsic.label}</div>\` : ''}
            \`;
        } else {
            content = \`<span style="color:#555; font-size:0.9rem;">\${slot.label} Vazio</span>\`;
        }

        paperdoll.innerHTML += \`
            <div class="eq-slot \${items ? 'active-equip' : ''}" 
                 onclick="unequipItem('\${slot.keys}')"
                 onmouseenter="\${items ? \`showItemTooltip(hero.equipment['\${slot.keys}'], event)\` : ''}"
                 onmouseleave="hideItemTooltip()">
                <div style="font-size:2.2rem; margin-bottom:6px;">\${slot.icon}</div>
                <span class="eq-slot-label">\${slot.label}</span>
                <div style="margin-top:8px; line-height:1.35;">\${content}</div>
            </div>
        \`;
    });
}

function renderInventoryList(hero) {
    const invDeck = document.getElementById('inventory-deck-mesh');
    let filter = window.currentInventoryFilter || 'Tudo';

    const filterSelect = document.getElementById('inventory-filter-select');
    if (filterSelect && filterSelect.value !== filter) filterSelect.value = filter;

    let contentHTML = '';
    hero.inventory.forEach((items, index) => {
        if (!items) return;
        let iType = items.type || '';
        let isEquip = ['armas', 'capacete', 'armaduras', 'luvas', 'botas', 'escudo', 'anel', 'colar', 'acessorio'].includes(iType);
        let isPot = iType.includes('consumivel');
        let isSpecial = iType === 'lore_fragment' || iType === 'relics';

        if (filter === 'Equipamentos' && !isEquip) return;
        if (filter === 'Consumíveis' && !isPot) return;
        if (filter === 'Especiais' && !isSpecial) return;

        let statsHTML = '';
        if (items.damage) statsHTML += \` Dano: <strong>\${items.damage}</strong><br>\`;
        if (items.defense) statsHTML += \`:Defesa: <strong>\${items.defense}</strong><br>\`;
        if (items.power) statsHTML += \`Poder: <strong>+\${items.power}</strong><br>\`;
        if (items.durability) statsHTML += \` Durab: <strong>\${items.durability}</strong><br>\`;

        let eraPassives = '';
        if (items.bonusPassives && items.bonusPassives.length > 0) {
            eraPassives = items.bonusPassives.map(p => \`<div style="font-size:0.75rem; color:#a7f3d0; margin-top:2px;">S\${p.label}</div>\`).join('');
        }

        contentHTML += \`
            <div class="item-card rare-\${items.rarity}" 
                 onmouseenter="showItemTooltip(hero.inventory[\${index}], event)" 
                 onmouseleave="hideItemTooltip()"
                 style="display: flex; flex-direction: column;">
                <div style="flex-grow: 1;">
                    <div class="item-title-row">
                        <strong class="item-name">\${items.name}</strong>
                        <span class="item-rarity-tag">\${items.rarity}</span>
                    </div>
                    <div class="item-stats-row">\${statsHTML}</div>
                    \${items.intrinsic ? \`<div class="item-passive-box">S\${items.intrinsic.label}</div>\${eraPassives}\` : ''}
                    <div class="item-desc-text">"\${items.desc || 'Uma artefato ancestral dos Santuário.'}"</div>
                </div>
                <div style="display:flex; gap:8px; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05);">
                    \${items.type === 'lore_fragment' ? \`
                        <button class="btn btn-secondary btn-small" style="flex:1;" onclick="openLoreWithFragment('\${items.fragmentId}')">Ler Fragmentos</button>
                    \` : items.type === 'relics' ? \`
                        <span style="flex:1; text-align:center; color:#fbbf24; font-size:0.8rem; font-style:italic;">Efeito Ativo n Mochila</span>
                    \` : !isPot ? \`
                        <button class="btn btn-small" style="flex:1;" onclick="equipItemFromInventory(\${index})">Equipar</button>
                        <button class="btn btn-success btn-small" style="flex:1; background:rgba(220,38,38,0.2); border-color:#dc2626; color:#fca5a5;" onclick="disassembleItem(\${index})">Desmontar</button>
                    \` : \`<button class="btn btn-success btn-small" style="flex:1;" onclick="useConsumable(\${index})">Consumir</button>\`}
                </div>
            </div>
        \`;
    });

    if (contentHTML === '') {
        contentHTML = '<div style="color:#64748b; font-style:italic; padding:20px; grid-column: 1 / -1; text-align:center;">Nenhuma items encontrado nesta categoria.</div>';
    }

    invDeck.innerHTML = contentHTML;
}

function renderFichaTab(calc) {
    const hero = getActiveHero();
    document.getElementById('char-sheet-title').innerText = \`\${hero.name}   \${hero.class}\`;
    document.getElementById('sheet-stat-attack').innerText = calc.attack;
    document.getElementById('sheet-stat-defense').innerText = calc.defense;
    document.getElementById('sheet-txt-xp').innerText = \`/\`;
    document.getElementById('sheet-fill-xp').style.width = \`\${(hero.xp / hero.maxXp) * 100}%\`;

    renderPassivesSummary(calc.passives);
    renderAttributesBox(hero);
    renderPaperdoll(hero);

    if (!window.setInventoryFilter) {
        window.setInventoryFilter = function (f) {
            window.currentInventoryFilter = f;
            renderAllEngines();
        };
    }

    renderInventoryList(hero);
}
`;

const replaceFunction = (content, funcName, newCode) => {
    const lines = content.split('\n');
    const start = lines.findIndex(l => l.includes("function " + funcName));
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

content = replaceFunction(content, 'createFreshHero', freshHeroNew);
content = replaceFunction(content, 'computeLiveStats', computeLiveStatsNew);
content = replaceFunction(content, 'renderFichaTab', renderFichaTabNew);

fs.writeFileSync('C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/main.js', content);
console.log("Refatored createFreshHero, computeLiveStats and renderFichaTab");
