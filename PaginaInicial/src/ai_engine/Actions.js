// ==========================================
// UTILITY AI - ACTIONS (Ações Disponíveis)
// ==========================================

window.AIActions = {
    // -------------------
    // AÇÕES GENÉRICAS
    // -------------------
    basicAttack: {
        id: "basicAttack",
        name: "Ataque Básico",
        scoreFunction: function(context) {
            // Um ataque básico sempre tem uma nota base, influenciada por oportunidade de abate
            let score = window.AIEvaluators.baseAggression(context);
            score += window.AIEvaluators.killOpportunity(context, 1.0) * 0.5;
            return score;
        },
        execute: function(context) {
            return {
                dmg: context.baseDmg,
                skillName: "Atacar",
                skillType: "Físico",
                isAttack: true
            };
        }
    },

    heavyAttack: {
        id: "heavyAttack",
        name: "Golpe Pesado",
        scoreFunction: function(context) {
            // Requer cooldown. Se estiver em cooldown, score = 0
            let isReady = window.AIEvaluators.isCooldownReady(context, "heavyAttack");
            if (isReady === 0) return 0;

            // Fica com vontade de usar se o herói estiver vulnerável
            let score = 0.5 + (window.AIEvaluators.heroVulnerable(context) * 0.5);
            return score * isReady;
        },
        execute: function(context) {
            context.enemy.cooldowns["heavyAttack"] = 3; // 3 turnos de cooldown
            return {
                dmg: Math.floor(context.baseDmg * 1.5), // 150% dano
                skillName: "Golpe Pesado",
                skillType: "Físico",
                isAttack: true
            };
        }
    },

    healSelf: {
        id: "healSelf",
        name: "Regeneração Sombria",
        scoreFunction: function(context) {
            let isReady = window.AIEvaluators.isCooldownReady(context, "healSelf");
            if (isReady === 0) return 0;

            // Escala diretamente com a falta de HP.
            let needHeal = window.AIEvaluators.needHealing(context);
            
            // Se a necessidade de cura for maior que 0.5 (menos de 50% HP), a nota dispara
            let score = needHeal > 0.5 ? needHeal * 1.5 : needHeal * 0.2;
            return Math.min(1.0, score) * isReady;
        },
        execute: function(context) {
            context.enemy.cooldowns["healSelf"] = 4;
            let healAmount = Math.floor(context.enemy.maxHp * 0.15); // Cura 15%
            
            return {
                dmg: 0,
                skillName: "Regeneração Sombria",
                skillType: "Cura",
                isAttack: false,
                customEffect: function() {
                    context.enemy.currentHp = Math.min(context.enemy.maxHp, context.enemy.currentHp + healAmount);
                    if (typeof generateFloatingText !== "undefined") generateFloatingText(healAmount, "heal", "enemy");
                    appendTerminalLog(`🟢 O inimigo se curou em ${healAmount} HP!`, "status");
                }
            };
        }
    },

    defend: {
        id: "defend",
        name: "Postura Defensiva",
        scoreFunction: function(context) {
            let isReady = window.AIEvaluators.isCooldownReady(context, "defend");
            if (isReady === 0) return 0;

            // Se o inimigo tá quase morrendo, mas a cura tá no cooldown, ele defende
            let needSurvival = window.AIEvaluators.needHealing(context);
            return (needSurvival * 0.8) * isReady;
        },
        execute: function(context) {
            context.enemy.cooldowns["defend"] = 3;
            return {
                dmg: 0,
                skillName: "Postura Defensiva",
                skillType: "Defesa",
                isAttack: false,
                customEffect: function() {
                    context.enemy.aiDefendTurn = true; // Flag lida no CombatEngine
                    appendTerminalLog(`🛡️ O inimigo levantou suas defesas! O próximo ataque sofrerá redução.`, "status");
                }
            };
        }
    }
};

// ==========================================
// KITS DE AÇÕES (Quais ações cada tipo de monstro tem)
// ==========================================
window.AIBossKits = {
    genericBoss: ["basicAttack", "heavyAttack", "healSelf", "defend"],
    genericElite: ["basicAttack", "heavyAttack", "defend"],
    genericCommon: ["basicAttack", "defend"]
};
