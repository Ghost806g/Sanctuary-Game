const fs = require('fs');

const lines = fs.readFileSync('C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/main.js', 'utf8').split('\n');

const finalizeReplacement = `
// --- COMBAT WIN HELPERS ---
function handleEliteStairsUnlock(hero) {
    if (activeCombatInstance.affixes && activeCombatInstance.affixes.length > 0) {
        const btnDescend = document.getElementById('btn-descend-floor');
        const bars = document.getElementById('boss-progress-fill');
        if (btnDescend && bars && bars.style.width === '100%') {
            btnDescend.style.display = 'block';
            btnDescend.disabled = false;
            btnDescend.style.boxShadow = '0 0 15px #22c55e';
            btnDescend.innerText = 'Descer Escadarias (Liberado!)';
            hero.floorCleared = true;
            appendTerminalLog("   O selo de escadarias foi quebrado. Vocês já pode descer para o próximo andar.", 'system');
        }
    }
}

function processLoreFragments(hero) {
    const loreFragmentsOwned = hero.inventory.filter(i => i.type === 'lore_fragment').length;
    const loreFragmentsRead = hero.loreChapters ? Object.values(hero.loreChapters).flatMap(ch => ch.fragments || []).length : 0;
    const loreDiscoveryBonus = Math.min(0.12, (loreFragmentsOwned + loreFragmentsRead) * 0.01);
    const biome = getCurrentBiome();
    const candidates = MEMORY_FRAGMENT_POOL.filter(f => f.biome === biome.name);

    if (candidates.length < 3) return;

    let droppedFragment = null;
    if (activeCombatInstance.isBoss) {
        droppedFragment = candidates[2];
    } else {
        const fragmentBaseChance = Math.min(0.35, (activeCombatInstance.isElite ? 0.15 : 0.05) + loreDiscoveryBonus);
        if (loreDiscoveryBonus > 0 && Math.random() < 0.1) appendTerminalLog(\`   A ressonância de suas memórias aumenta  chance de descobrir fragmentos de lore!\`, 'status');
        if (Math.random() < fragmentBaseChance) droppedFragment = (Math.random() < 0.5 ? candidates[0] : candidates[1]);
    }

    if (droppedFragment) {
        const alreadyOwned = hero.inventory.some(i => i.type === 'lore_fragment' && i.fragmentId === droppedFragment.id);
        const alreadyRead = hero.loreChapters?.[droppedFragment.chapters]?.fragments?.includes(droppedFragment.id);
        if (!alreadyOwned && !alreadyRead) {
            hero.inventory.push({
                id: \`frag_\${droppedFragment.id}_\${Date.now()}\`,
                fragmentId: droppedFragment.id,
                chapters: droppedFragment.chapters,
                type: 'lore_fragment',
                names: droppedFragment.name,
                desc: droppedFragment.desc,
                rarity: 'Lendario'
            });
            appendTerminalLog(activeCombatInstance.isBoss ? \`  O Chefão deixou cair  peça vital de História: \${droppedFragment.name}.\` : \`  Fragmentos de Memórias encontrado nos cadáver: \${droppedFragment.name}.\`, 'reward');
            triggerToast(\`Fragmento de Lore encontrado! Abra o Lore para montar suas memórias.\`);
        }
    }
}

function processBossWin(hero, W, goldW) {
    if (window.writeAutoDiary) window.writeAutoDiary(\`As chamas de \${activeCombatInstance.baseName} foram eintas por minhas lâminas. O andar \${hero.dungeonLevel} agora chora  perda dos seus mestre.\`);
    hero.materials['essencia_maior'] = (hero.materials['essencia_maior'] || 0) + 2;
    hero.materials['essencia_epica'] = (hero.materials['essencia_epica'] || 0) + 1;
    hero.materials['lagrima_divina'] = (hero.materials['lagrima_divina'] || 0) + 1;
    appendTerminalLog(\` LORDE ANIQUILADO! O baú expele \${goldW} Ouro e \${W} XP. Espólios divinos resgatados!\`, 'reward');

    const bossLoot1 = generateProceduralLoot(hero.dungeonLevel, 'Lendario');
    bossLoot1.name = \`Despojo dos \${activeCombatInstance.baseName}\`;
    hero.inventory.push(bossLoot1);

    if (Math.random() < 0.10) {
        const bossLoot2 = generateProceduralLoot(hero.dungeonLevel, 'Mitico');
        hero.inventory.push(bossLoot2);
        appendTerminalLog(\`GOTA MÍTICA! O Boss dropou o items divinos: \${bossLoot2.name}!\`, 'reward');
    }

    const relicMap = {
        'Lorde Necromante': { id: 'relic_1', name: 'Ossos Profano', desc: '+20 M HP, +5 Def', attr: { hp: 20, def: 5 } },
        'Hidra Corrompida': { id: 'relic_2', name: 'Glândula Venenosa', desc: '+15 Atk', attr: { atk: 15 } },
        'Senhor de Forja': { id: 'relic_3', name: 'Coração Derretido', desc: '+30 Def, +20 M HP', attr: { def: 30, hp: 20 } },
        'Dragão Filhote': { id: 'relic_4', name: 'Bras Eternas', desc: '+25 Atk', attr: { atk: 25 } },
        'Illfang, o Rei Kobolds': { id: 'relic_5', name: 'Lâmina dos Rei', desc: '+35 Atk, -10 Def', attr: { atk: 35, def: -10 } },
        "X'rphan, o Dragão Branco": { id: 'relic_6', name: 'Cristal Absoluto', desc: '+50 M Mana, +20 Def', attr: { mp: 50, def: 20 } },
        'The Gleam Eyes': { id: 'relic_7', name: 'Olho dos Eclipse', desc: '+60 Atk, -30 Def', attr: { atk: 60, def: -30 } }
    };

    const relicData = relicMap[activeCombatInstance.baseName];
    if (relicData && !hero.inventory.find(i => i.id === relicData.id)) {
        hero.inventory.push({
            id: relicData.id,
            name: \`   \${relicData.name}\`,
            type: 'relics',
            rarity: 'Lendario',
            desc: \`Relíquias de Chefes: \${relicData.desc}. Efeito passivos quando n mochila.\`,
            relicBonus: relicData.attr
        });
        appendTerminalLog(\`SVocê obteve  Relíquias nicas: \${relicData.name}! Fornecerá poderes passivos n mochila.\`, 'reward');
        if (window.writeAutoDiary) window.writeAutoDiary(\`O destinos sorriu para  carnificina. Encontrei \${relicData.name}, uma artefato que vibra com o poder de antigos deuses.\`);
    }
}

function processMobLoot(hero, W, goldW) {
    let dropMsg = '';
    if (activeCombatInstance.drops && activeCombatInstance.drops.length > 0) {
        activeCombatInstance.drops.forEach(d => {
            if (Math.random() < d.chance) {
                if (d.type === 'materials') {
                    hero.materials[d.id] = (hero.materials[d.id] || 0) + 1;
                    const matDef = ALL_MATERIALS.find(m => m.id === d.id);
                    if (matDef) dropMsg += \`1 <span style="color:\${matDef.color}">\${matDef.name}</span> | \`;
                } else if (d.type === 'equip') {
                    const newEquip = {
                        id: d.id + '_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                        names: d.name,
                        type: d.slots === 'armas' ? 'armas' : (d.slots === 'elmo' ? 'capacete' : (d.slots === 'peito' ? 'armaduras' : d.slots)),
                        rarity: d.rarity || 'Normal',
                        desc: d.desc || "Dropa específico dos inimigos.",
                        durability: 200, maxDurability: 200
                    };
                    if (newEquip.type === 'armas') newEquip.damage = d.baseDamage || Math.floor((hero.dungeonLevel * 5) + 15);
                    else newEquip.defense = d.baseDefense || Math.floor((hero.dungeonLevel * 4) + 10);
                    if (d.passives && d.passives.length > 0) newEquip.intrinsic = d.passives[0];
                    
                    hero.inventory.push(newEquip);
                    dropMsg += \` <span class="rarity-\${newEquip.rarity}">\${newEquip.name}</span> | \`;
                    if (window.triggerLootPopup) triggerLootPopup(newEquip);
                }
            }
        });
    }

    if (dropMsg === '') {
        const poolMats = ALL_MATERIALS.slice(0, 14);
        const randMat = poolMats[Math.floor(Math.random() * poolMats.length)];
        hero.materials[randMat.id] = (hero.materials[randMat.id] || 0) + 1;
        dropMsg += \`1 <span style="color:\${randMat.color}">\${randMat.name}</span> | \`;
    }

    if (Math.random() < (activeCombatInstance.isElite ? 0.40 : 0.08)) {
        const mobDrop = generateProceduralLoot(hero.dungeonLevel);
        hero.inventory.push(mobDrop);
        dropMsg += \` <span class="rarity-\${mobDrop.rarity}">\${mobDrop.name}</span> | \`;
        if (window.triggerLootPopup) triggerLootPopup(mobDrop);
    }

    if (dropMsg.endsWith(' | ')) dropMsg = dropMsg.slice(0, -3);
    appendTerminalLog(\` O sangue lavou as rochas: +\${goldW} Ouro. Eeriência: +\${W} XP.<br>Espólios: \${dropMsg}\`, 'reward');
}

function processQuestsWin(hero) {
    hero.quests.forEach(q => {
        if (q.status === 'ativo' && q.type === 'Kill') {
            q.progress++;
            if (q.progress >= q.target) {
                q.progress = q.target; triggerToast(\`Mural de Caçadas concluídos: Extermínio! (\${q.title})\`);
            }
        }
    });
}

function finalizeCombatWin() {
    if (window.currentEnemyNode) {
        window.currentEnemyNode.active = false;
        window.currentEnemyNode = null;
    }
    const card = document.getElementById('enemy-viewport-card');
    if (card) card.classList.add('hidden');

    const hero = getActiveHero();
    handleEliteStairsUnlock(hero);

    const goldW = activeCombatInstance.isBoss ? 800 : 85;
    let W = activeCombatInstance.isBoss ? 1200 : 120;

    if (hero.isFightingGuardian) {
        hero.floorCleared = true;
        hero.isFightingGuardian = false;
        appendTerminalLog("   O caminho adiante está livre! Vocês pode descer as escadarias.", 'status');
    }

    if (hero.gameTime?.isNight) W = Math.floor(W * 1.1);

    if (activeCombatInstance?.baseName) {
        hero.bestiary[activeCombatInstance.baseName] = (hero.bestiary[activeCombatInstance.baseName] || 0) + 1;
    }

    runStats.monstersKilled = (runStats.monstersKilled || 0) + 1;
    runStats.goldEarned = (runStats.goldEarned || 0) + goldW;
    clearDamageVignette();

    processLoreFragments(hero);
    hero.gold += goldW;

    if (activeCombatInstance.isBoss) {
        processBossWin(hero, W, goldW);
        if (addExperience(W)) triggerToast("LEVEL UP DAS ESPADA ");
        hero.inBossRestArea = true; 
        window.activeCombatInstance = null;
        commitStorage(); renderAllEngines();
        return;
    }

    hero.floorProgress = (hero.floorProgress || 0) + 1;
    appendTerminalLog(\`Progresso dos andar: \${hero.floorProgress}/5 monstros derrotados.\`, 'status');

    processMobLoot(hero, W, goldW);
    processQuestsWin(hero);

    if (addExperience(W)) triggerToast("TRANSCEND\`NCIA LEVEL UP ");

    window.activeCombatInstance = null;
    commitStorage(); renderAllEngines();
}
`;

const internalHeroReplacement = `
// --- COMBAT HELPERS (Refactored) ---
function handleHeroBuffDuration() {
    if (heroCombatState.atkBuffDuration && heroCombatState.atkBuffDuration > 0) {
        heroCombatState.atkBuffDuration--;
        if (heroCombatState.atkBuffDuration === 0) {
            heroCombatState.atkBuffMult = 1;
            heroCombatState.infiniteStamin = 0;
            heroCombatState.immortal = 0;
            appendTerminalLog(\`O poder de suas habilidade eirou. Vocês voltou aço normal.\`, 'status');
        }
    }
}

function processSkillEffects(hero, skillObj, calc, rank) {
    let rawDmg = skillObj.ratio * (hero.attributes[skillObj.stats] * 2.0);
    if (rank >= 5) rawDmg *= 1.35;
    let isHealSkill = false;

    if (skillObj.effect) {
        const type = skillObj.effect.type;
        const val = skillObj.effect.value;
        if (type === 'buff_def') heroCombatState.defBuff += val;
        if (type === 'dodge') heroCombatState.dodge = 1;
        if (type === 'blood_to_mana') {
            hero.currentHp = Math.max(1, hero.currentHp - 25);
            hero.currentMana = Math.min(calc.maxMp, hero.currentMana + val);
            isHealSkill = true;
        }
        if (type === 'heal' || type === 'heal_self') {
            let hV = (hero.attributes[skillObj.stats] * skillObj.effect.ratio) * (rank >= 5 ? 2 : 1);
            hero.currentHp = Math.min(calc.maxHp, hero.currentHp + hV);
            generateFloatingText(Math.floor(hV), true);
            appendTerminalLog(\`SA sagrada arte de curas [\${skillObj.name}] transmutou feridas suturando o seus HP em \${Math.floor(hV)} pontos!\`, 'reward');
            isHealSkill = true;
        }
        if (type === 'buff_atk') {
            heroCombatState.atkBuffMult = val;
            heroCombatState.atkBuffDuration = skillObj.effect.duration;
            appendTerminalLog(\` Bônus de Dano! Seus golpes estão multiplicados por \${val}!\`, 'reward');
        }
        if (type === 'ma_fury_buff') {
            heroCombatState.atkBuffMult = 2.5;
            heroCombatState.atkBuffDuration = skillObj.effect.duration;
            heroCombatState.infiniteStamin = skillObj.effect.duration;
            heroCombatState.immortal = skillObj.effect.duration;
            appendTerminalLog(\`MODO FRIA: Imortalidade, Estamina Infinita e Dano 2.5 ativados!\`, 'reward');
        }
        if (type === 'execute') {
            if ((activeCombatInstance.hp / activeCombatInstance.maxHp) <= skillObj.effect.threshold) {
                rawDmg = activeCombatInstance.maxHp * 10;
                appendTerminalLog("ܠFADALIDADE DOS EXECUTOR: Abates rápidos! O monstros sofreu sangria irreversível.", 'reward');
            }
        }
    }
    return { rawDmg, isHealSkill };
}

function calcElementalWeaknessAndResists(finalDmg, skillObj, enemy) {
    if (!skillObj || finalDmg <= 0 || !enemy.tags) return finalDmg;
    let elem = skillObj.type;
    
    if (enemy.tags.magicImmune && ['Fogo', 'Gelo', 'Arcano', 'Luz', 'Venenosa', 'Profano'].includes(elem)) {
        appendTerminalLog(":O escudo arcano dos monstros absorveu o ataques completamente! Imune!", "status");
        return 0;
    }
    const imMap = { 'Fogo':'fireImmune', 'Gelo':'iceImmune', 'Venenosa':'poisonImmune', 'Raio':'lightningImmune' };
    if (imMap[elem] && enemy.tags[imMap[elem]]) {
        appendTerminalLog(\`:O inimigos possui imunidade natural  \${elem}. Seus ataques foi anulado!\`, "status");
        return 0;
    }
    if (enemy.tags.weakness && enemy.tags.weakness.includes(elem)) {
        appendTerminalLog(\` FRAQUEZA ELEMENTAL EXPLORADA! Dano de \${elem} amplificado!\`, 'reward');
        return Math.floor(finalDmg * 1.5);
    }
    if (enemy.tags.resist && enemy.tags.resist.includes(elem)) {
        appendTerminalLog(\` RESISTÊNCIA ELEMENTAL! O danos de \${elem} foi altamente mitigado!\`, 'status');
        return Math.floor(finalDmg * 0.5);
    }
    return finalDmg;
}

function processArmorAndPenetration(finalDmg, calc, enemy, skillObj) {
    if (finalDmg <= 0) return 0;
    let enemyDef = enemy.def || 0;
    let armorPen = calc.passives.ignoreDef || 0;
    let bestiaryBonus = getBestiaryCombatBonus(enemy);

    if (bestiaryBonus.dmgMult > 0) {
        finalDmg = Math.floor(finalDmg * (1 + bestiaryBonus.dmgMult));
        armorPen += bestiaryBonus.ignoreDef;
        appendTerminalLog(\`Seu conhecimento dos bestiário inflige +\${Math.round(bestiaryBonus.dmgMult * 100)}% de DANO REAL e penetra  armadura dos \${enemy.name}!\`, 'reward');
    }

    if (skillObj?.effect?.type === 'ignoreDef') armorPen += skillObj.effect.value;

    let effectiveDef = Math.floor(enemyDef * Math.max(0, (1 - armorPen)));
    if (enemy.affixes?.includes('armored') && !skillObj?.type) {
        appendTerminalLog(\`:O casco [Blindado] ignorou grande parte de suas força bruta!\`, 'status');
        finalDmg = Math.floor(finalDmg * 0.6);
    }
    return Math.floor(Math.max(1, finalDmg - (effectiveDef * 0.6)));
}

function applyComboAndVampirism(finalDmg, hero, enemy, calc, skillObj) {
    if (finalDmg <= 0) return;
    
    comboCounter++;
    if (comboCounter > (runStats.maxCombo || 0)) runStats.maxCombo = comboCounter;
    let comboMult = getComboMultiplier();
    if (comboMult > 1) finalDmg = Math.floor(finalDmg * comboMult);
    updateComboUI();
    
    runStats.damageDealt = (runStats.damageDealt || 0) + finalDmg;
    hero.currentFocus = Math.min(hero.maxFocus || 100, (hero.currentFocus || 0) + 15);
    enemy.hp -= finalDmg;
    enemy.currentHp = enemy.hp;
    generateFloatingText(finalDmg, false);

    if (comboCounter >= 5) appendTerminalLog(\` COMBO \${comboCounter}! Multiplicador: \${comboMult.toFixed(1)}   Dano amplificado: \${finalDmg}!\`, 'reward');
    else if (enemy.def > 0) appendTerminalLog(\` Impacto! Armaduras inimigas absorveu parte dos golpes. Dano Físico Real: \${finalDmg}.\`, 'normal');
    else appendTerminalLog(\` Impacto Perfeito! Vocês causou \${finalDmg} DE DANO FRONTAL.\`, 'normal');

    checkBossPhaseTransition(enemy);
    if (skillObj?.effect) applyStatusToEnemy(skillObj.effect, finalDmg);

    let lSteal = (calc.passives.lifeSteal > 0 ? calc.passives.lifeSteal : 0);
    if (skillObj?.effect?.type === 'lifeSteal') lSteal += skillObj.effect.value;
    
    let lStealValue = finalDmg * lSteal;
    if (lStealValue > 0) {
        hero.currentHp = Math.min(calc.maxHp, hero.currentHp + lStealValue);
        appendTerminalLog(\`: Vampirismo! O sifão injetou \${Math.floor(lStealValue)} de sangue vital em vocêê.\`, 'status');
        generateFloatingText(Math.floor(lStealValue), true);
    }
}

function processEnemyAttack(enemy, hero, calc) {
    if (heroCombatState.dodge > 0) {
        appendTerminalLog(" EVASÒO ATIVADA. Vocês desviou dos ataques inimigos!", 'reward');
        heroCombatState.dodge--;
        return;
    }
    
    let damageTaken = Math.floor(Math.max(1, enemy.atk - ((calc.defense + (heroCombatState.defBuff || 0)) * 0.6)));
    
    if (heroCombatState.immortal > 0) {
        appendTerminalLog(\`:IMORTAL! A Fúria das Valquírias text impede de sofrer qualquer danos!\`, 'reward');
        damageTaken = 0;
    } else {
        hero.currentHp -= damageTaken;
        runStats.damageTaken = (runStats.damageTaken || 0) + damageTaken;
        hero.currentFocus = Math.min(hero.maxFocus || 100, (hero.currentFocus || 0) + 20);
    }

    if (enemy.affixes?.includes('vampiric') && damageTaken > 0) {
        let heal = Math.floor(damageTaken * 0.3);
        enemy.currentHp = Math.min(enemy.maxHp, enemy.currentHp + heal);
        enemy.hp = enemy.currentHp;
        appendTerminalLog(\` O inimigos [Vampírico] sugou suas vitalidade, curando-se em \${heal} HP!\`, 'status');
    }

    triggerDamageVignette(hero.currentHp, calc.maxHp);
    appendTerminalLog(\`O \${enemy.name} atacou brutalmente! Suas armadura absorveu impactos, sofrendo \${damageTaken} de DANO REAL!\`, 'combat');
    triggerScreenShake();
}

function executeEquipmentDegradation(hero) {
    Object.keys(hero.equipment).forEach(slot => {
        const items = hero.equipment[slot];
        if (items?.durability !== undefined && Math.random() < 0.35) {
            items.durability = Math.max(0, items.durability - 1);
            if (items.durability <= 0) {
                hero.equipment[slot] = null;
                appendTerminalLog(\`Seu items [\${items.name}] estilhaou-se nos combates e quebrou!\`, 'combat');
            }
        }
    });
}

function internalHeroActionExecution(skillObj) {
    const hero = getActiveHero();
    const calc = computeLiveStats();
    let enemy = activeCombatInstance;

    handleHeroBuffDuration();

    let d20 = Math.floor(Math.random() * 20) + 1;
    document.getElementById('dice-d20-visual').innerText = d20;
    if (d20 > (runStats.bestRoll || 0)) runStats.bestRoll = d20;

    if (d20 === 1) {
        appendTerminalLog(" ROLAGEM D20 MÁQUINA = 1: FALHA CRÍTICA ABSOLUTA. A lâminas escorregou suada.", 'combat');
        triggerScreenShake();
        comboCounter = 0;
        updateComboUI();
    } else {
        let rawDmg = calc.attack < 5 ? 5 + Math.floor(hero.level * 1.2) : calc.attack;
        let isHealSkill = false;

        if (skillObj) {
            let res = processSkillEffects(hero, skillObj, calc, hero.skills[skillObj.id] || 1);
            rawDmg = res.rawDmg;
            isHealSkill = res.isHealSkill;
            if (!isHealSkill) appendTerminalLog(\` O Herói conjurou: \${skillObj.name}...\`);
        }

        if (!isHealSkill) {
            let finalDmg = rawDmg;
            if (skillObj && heroCombatState.atkBuffMult > 1) finalDmg = Math.floor(finalDmg * heroCombatState.atkBuffMult);
            
            finalDmg = calcElementalWeaknessAndResists(finalDmg, skillObj, enemy);
            
            if (skillObj?.synergy && enemy.statuses?.find(s => s.type === skillObj.synergy.status) && finalDmg > 0) {
                finalDmg = Math.floor(finalDmg * skillObj.synergy.multiplier);
                appendTerminalLog(\`COMBO: \${skillObj.synergy.name}! Dano \${skillObj.synergy.multiplier} devido à condição [\${skillObj.synergy.status.toUpperCase()}] dos monstros!\`, 'reward');
                triggerScreenShake();
            }

            let isExhausted = hero.stamina <= 0 && !(heroCombatState.infiniteStamin > 0);
            if (isExhausted) appendTerminalLog("EXAUSTÒO EXTREMA: Seus músculos falham. Dano reduzido e sem chance de crítico!", 'status');
            
            if (!isExhausted && (Math.random() < calc.passives.critChance || d20 === 20) && finalDmg > 0) {
                finalDmg *= calc.passives.critDamage;
                if (d20 === 20) finalDmg *= 1.5;
                appendTerminalLog(" ACERTO CRÍTICOS LETAL!", 'reward');
                triggerScreenShake();
            }
            if (isExhausted && finalDmg > 0) finalDmg = Math.floor(finalDmg * 0.5);

            if (enemy.affixes?.includes('agile') && !skillObj?.type && Math.random() < 0.15) {
                appendTerminalLog(\` O inimigos [gil] desviou dos seus ataques com facilidade!\`, 'status');
                finalDmg = 0;
            }

            finalDmg = processArmorAndPenetration(finalDmg, calc, enemy, skillObj);
            applyComboAndVampirism(finalDmg, hero, enemy, calc, skillObj);
        }
    }

    if (enemy.hp <= 0) return finalizeCombatWin();

    let enemyStatRet = processStatusArray(enemy.statuses, enemy.name);
    if (enemyStatRet.dmg > 0) {
        enemy.hp -= enemyStatRet.dmg;
        enemy.currentHp = enemy.hp;
        generateFloatingText(enemyStatRet.dmg, false);
        checkBossPhaseTransition(enemy);
        if (enemy.hp <= 0) return finalizeCombatWin();
    }

    if (!enemyStatRet.skip) processEnemyAttack(enemy, hero, calc);

    let biome = getCurrentBiome();
    if (biome.fieldEffect.onTurnEnd) {
        biome.fieldEffect.onTurnEnd(hero);
        appendTerminalLog(\` O ambiente das \${biome.name} castiga seus corpos!\`, 'combat');
    }

    executeEquipmentDegradation(hero);

    if (hero.currentHp <= 0) handleHeroDeath();
    else { commitStorage(); renderAllEngines(); }
}
`;

const bestiaryReplacement = `
// --- BESTIARY SPREAD HELPERS ---
function getBestiaryImageHtml(monsterObj, kills) {
    const AVAILABLE_BESTIARY_IMAGES = [
        "rei_esqueleto_ancestral_senhor_dos_ossos.png",
        "o_acougueiro_carniceiro_abissal.png",
        "belial_avatar_mentiroso.png",
        "diablo_o_absoluto_mal_supremo.png",
        "lorde_necromante_do_abismo.png",
        "rei_de_cristal_estilhacado.png",
        "senhor_do_eclipse_eterno.png",
        "artorias_o_corrompido.png",
        "priscilla_a_desperta.png"
    ];
    const imgFilename = monsterObj.name.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') + '.png';
    const hasImage = AVAILABLE_BESTIARY_IMAGES.includes(imgFilename);
    if (hasImage && kills > 0) {
        return \`<div style="text-align:center; margin: 20px 0;"><img src="/bestiary/\${imgFilename}" style="max-width: 90%; max-height: 280px; border-radius: 8px; box-shadow: 0 0 15px rgba(0,0,0,0.8); border: 2px solid #3b0707; object-fit: cover;"></div>\`;
    }
    return \`<div style="text-align:center; margin: 30px 0; font-size: 5rem; opacity: 0.15; filter: grayscale(100%);">\${monsterObj.isBoss ? '  ' : monsterObj.isElite ? 'ܠ' : ''}</div>\`;
}

function getBestiaryAffinitiesHtml(monsterObj) {
    let affinities = [];
    if (monsterObj.tags) {
        if (monsterObj.tags.magicImmune) affinities.push("<span style='color:#c084fc'>Magia (Imune)</span>");
        if (monsterObj.tags.fireImmune) affinities.push("<span style='color:#ef4444'>Fogo (Imune)</span>");
        if (monsterObj.tags.iceImmune) affinities.push("<span style='color:#3b82f6'>Gelo (Imune)</span>");
        if (monsterObj.tags.poisonImmune) affinities.push("<span style='color:#10b981'>Venenosa (Imune)</span>");
        if (monsterObj.tags.lightningImmune) affinities.push("<span style='color:#fbbf24'>Raio (Imune)</span>");
        if (monsterObj.tags.weakness) monsterObj.tags.weakness.forEach(w => affinities.push(\`<span style='color:#fca5a5'>\${w} (Fraco)</span>\`));
        if (monsterObj.tags.resist) monsterObj.tags.resist.forEach(r => affinities.push(\`<span style='color:#6ee7b7'>\${r} (Resiste)</span>\`));
    }
    return affinities.length > 0 ? affinities.join(' | ') : 'Nenhuma';
}

function getBestiaryMilestonesHtml(kills) {
    return \`
        <h3 style="color:#fbbf24; font-family:'Cinzel', serif; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom:5px;">Marcos de Caç (Vantagens)</h3>
        <div class="book-milestones">
            <div class="book-milestone-item"><span style="color:\${kills >= 10 ? 'var(--stamina-green)' : '#64748b'}">\${kills >= 10 ? 'S ATIVO: Anatomia e HP Base revelados.' : ' Bloqueado (Requer 10 abates)'}</span></div>
            <div class="book-milestone-item"><span style="color:\${kills >= 50 ? 'var(--stamina-green)' : '#64748b'}">\${kills >= 50 ? 'S ATIVO: Ignora 10% de Defes física dos alvo.' : ' Bloqueado (Requer 50 abates)'}</span></div>
            <div class="book-milestone-item"><span style="color:\${kills >= 100 ? 'var(--gold-glowing)' : '#64748b'}">\${kills >= 100 ? 'S ATIVO: +20% de Ouro e Chance de Drops.' : ' Bloqueado (Requer 100 abates)'}</span></div>
        </div>
    \`;
}

function getBestiaryDropsHtml(monsterObj, kills) {
    if (kills < 10 || !monsterObj.drops) return '';
    return \`
        <h3 style="color:#34d399; font-family:'Cinzel', serif; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom:5px;">Despojos Observados</h3>
        <div style="font-size: 0.85rem; color:#cbd5e1; display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
            \${monsterObj.drops.map(d => \`<div>- \${d.name || d.id} <span style="color:#6ee7b7">(\${(d.chance * 100).toFixed(0)}%)</span></div>\`).join('')}
        </div>
    \`;
}

function renderBestiarySpreadPage0(monsterObj, biomeName, kills, artHtml) {
    let dndInfo = '';
    if (kills > 0) {
        let affinityTe = getBestiaryAffinitiesHtml(monsterObj);
        dndInfo = \`
        <div style="font-size: 0.8rem; color: #a1a1aa; margin-top: 10px; margin-bottom: 15px; text-align: left; background: rgba(0,0,0,0.6); padding: 10px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="margin-bottom: 3px;"><b style="color:#d4d4d8;">Habitat Nativo:</b> \${biomeName}</div>
            <div style="margin-bottom: 3px;"><b style="color:#d4d4d8;">Classificação:</b> \${monsterObj.isBoss ? 'Ameaç Apocalíptic (Colossal)' : monsterObj.isElite ? 'Aberração Rar (Grande)' : 'Besta Nativ (Médio)'}</div>
            <div style="margin-bottom: 3px;"><b style="color:#d4d4d8;">Diet Observada:</b> \${monsterObj.tags?.lifeSteal || monsterObj.tags?.lifeDrain ? 'Força Vital (Vampírico)' : 'Carnívoro / Necrófago'}</div>
            <div style="margin-bottom: 3px;"><b style="color:#d4d4d8;">Nível de Intelecto:</b> \${monsterObj.tags?.magicDamage ? 'Alto (Conjurador/Sentiente)' : 'Bestial / Primitivo'}</div>
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed rgba(255,255,255,0.1);"><b style="color:#d4d4d8;">Afinidades Elementais:</b><br>\${affinityTe}</div>
        </div>\`;
    }

    return {
        leftPageContent: \`
            <h2 class="book-monsters-title">\${kills > 0 ? monsterObj.name : '???'}</h2>
            <div class="book-monsters-subtitle">\${monsterObj.isBoss ? 'Chefes Verdadeiro' : monsterObj.isElite ? 'Aberraes de Elite' : 'Monstros Comuns'} - \${biomeName}</div>
            \${artHtml}
            \${dndInfo}
            <div class="book-stats-grid">
                <div class="book-stats-box"><span style="color:#9ca3af; font-size:0.75rem;">HP Estimado</span><br><span style="color:#ef4444; font-size:1.2rem; font-weight:bold;">\${kills > 0 ? (monsterObj.hp || 'Escalável') : '???'}</span></div>
                <div class="book-stats-box"><span style="color:#9ca3af; font-size:0.75rem;">Ataques Base</span><br><span style="color:#f59e0b; font-size:1.2rem; font-weight:bold;">\${kills > 0 ? (monsterObj.atk || 'Escalável') : '???'}</span></div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #f87171; font-weight: bold; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">Cadáveres Dissecados: \${kills}</div>
            <div style="text-align:center; margin-top: 10px; font-size: 0.8rem; color: #555;">[Pág. 1]</div>\`,
        rightPageContent: \`
            <h3 style="color:#ef4444; font-family:'Cinzel', serif; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom:5px;">Estudo Anatômico</h3>
            <div class="book-lore-text">
                \${kills > 0 ? generateMonsterLore(monsterObj, biomeName) : 'O tomo permanece em branco. Abat e disseque pelos menos 1 espécime desta raç para transcrever seus segredos e morfologia.'}
            </div>
            <div style="text-align:center; margin-top: auto; font-size: 0.8rem; color: #555;">[Pág. 2]</div>\`
    };
}

function renderBestiarySpreadPage1(monsterObj, kills, isSpecial) {
    let marcosHtml = getBestiaryMilestonesHtml(kills);

    if (isSpecial) {
        return {
            leftPageContent: \`\${marcosHtml}<div style="text-align:center; margin-top: auto; font-size: 0.8rem; color: #555;">[Pág. 3]</div>\`,
            rightPageContent: \`
                <h3 style="color:#8b5cf6; font-family:'Cinzel', serif; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom:5px;">Padrões de Combate e Fraquezas</h3>
                <div class="book-lore-text" style="border-left-color: #5b21b6;">\${kills >= 10 ? generateCombatTacticsLore(monsterObj) : 'A imprevisibilidade dos alvo requer mais estudos práticos.'}</div>
                <div style="text-align:center; margin-top: auto; font-size: 0.8rem; color: #555;">[Pág. 4]</div>\`
        };
    } else {
        let despojosHtml = getBestiaryDropsHtml(monsterObj, kills);
        return {
            leftPageContent: \`\${marcosHtml}\${despojosHtml}<div style="text-align:center; margin-top: auto; font-size: 0.8rem; color: #555;">[Pág. 3]</div>\`,
            rightPageContent: \`<div style="display: flex; align-items: center; justify-content: center; height: 100%; opacity: 0.1;"><h1 style="font-family:'Cinzel', serif; transform: rotate(-10deg);">Fim dos Registro</h1></div>\`
        };
    }
}

function renderBestiarySpreadPage2(monsterObj, kills) {
    let despojosHtml = getBestiaryDropsHtml(monsterObj, kills);
    let lootTableHtml = '';
    if (kills >= 10 && monsterObj.lootTable) {
        lootTableHtml = \`
            <h3 style="color:#fcd34d; font-family:'Cinzel', serif; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom:5px;">Tabel de Espólios Míticos</h3>
            <div style="font-size: 0.85rem; color:#cbd5e1; display: flex; flex-direction: column; gap: 5px;">
                \${monsterObj.lootTable.map(d => \`<div>- [\${d.rarity}] \${d.name} <span style="color:#6ee7b7">(\${(d.chance * 100).toFixed(0)}%)</span></div>\`).join('')}
            </div>\`;
    }
    return {
        leftPageContent: \`\${despojosHtml}\${lootTableHtml}<div style="text-align:center; margin-top: auto; font-size: 0.8rem; color: #555;">[Pág. 5]</div>\`,
        rightPageContent: \`<div style="display: flex; align-items: center; justify-content: center; height: 100%; opacity: 0.1;"><h1 style="font-family:'Cinzel', serif; transform: rotate(-10deg);">Fim dos Registro</h1></div>\`
    };
}

window.renderBestiarySpread = function (monsterName, biomeName, spreadIndex) {
    const hero = getActiveHero();
    const mesh = document.getElementById('bestiary-mesh');
    if (!mesh || !hero) return;

    let monsterObj = null;
    let biomeObj = BIOMES.find(b => b.name === biomeName);
    if (biomeObj) {
        monsterObj = biomeObj.monsters.find(m => m.name === monsterName);
        if (!monsterObj && biomeObj.boss?.name === monsterName) {
            monsterObj = { ...biomeObj.boss, isBoss: true };
        }
    }
    if (!monsterObj) return;

    const kills = getBestiaryKillCount(monsterObj.name);
    const isSpecial = monsterObj.isBoss || monsterObj.isElite;
    const maxSpreads = isSpecial ? 2 : 1;
    let artHtml = getBestiaryImageHtml(monsterObj, kills);

    let content = { leftPageContent: '', rightPageContent: '' };
    if (spreadIndex === 0) content = renderBestiarySpreadPage0(monsterObj, biomeName, kills, artHtml);
    else if (spreadIndex === 1) content = renderBestiarySpreadPage1(monsterObj, kills, isSpecial);
    else if (spreadIndex === 2 && isSpecial) content = renderBestiarySpreadPage2(monsterObj, kills);

    let navHtml = \`<div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 15px;">\`;
    navHtml += \`<button class="btn-book-back" onclick="renderBestiaryTab()">Voltar aço Índice</button><div>\`;
    if (spreadIndex > 0) navHtml += \`<button class="btn-book-back" onclick="renderBestiarySpread('\${monsterName.replace(/'/g, "\\\\'")}', '\${biomeName}', \${spreadIndex - 1})">Pág. Anterior</button> \`;
    if (spreadIndex < maxSpreads) navHtml += \`<button class="btn-book-back" onclick="renderBestiarySpread('\${monsterName.replace(/'/g, "\\\\'")}', '\${biomeName}', \${spreadIndex + 1})">Próm Pág.  </button>\`;
    navHtml += \`</div></div>\`;

    mesh.innerHTML = \`
    \${navHtml}
    <div class="book-container">
        <div class="book-page book-page-left" style="display:flex; flex-direction:column;">\${content.leftPageContent}</div>
        <div class="book-spine"></div>
        <div class="book-page book-page-right" style="display:flex; flex-direction:column;">\${content.rightPageContent}</div>
    </div>\`;
};
`;

let newLines = [...lines];
// Do in reverse order!
// 1. finalizeCombatWin: 3641 to 3882
newLines.splice(3641, 3882 - 3641 + 1, finalizeReplacement);

// 2. internalHeroActionExecution: 3057 to 3344
newLines.splice(3057, 3344 - 3057 + 1, internalHeroReplacement);

// 3. renderBestiarySpread: 2701 to 2919
newLines.splice(2701, 2919 - 2701 + 1, bestiaryReplacement);

fs.writeFileSync('C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/main.js', newLines.join('\n'));
console.log('DONE REFACTORING!');
