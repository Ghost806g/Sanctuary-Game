// ==========================================
// UTILITY AI - EVALUATORS (Considerações)
// ==========================================
// Evaluators retornam um valor entre 0.0 e 1.0
// 0.0 = Nenhuma vontade de fazer isso
// 1.0 = Desejo absoluto de fazer isso

window.AIEvaluators = {
    // Avalia a necessidade de se curar baseada no próprio HP. Quanto menor o HP, maior o retorno.
    needHealing: function(context) {
        const hpPercent = context.enemy.currentHp / context.enemy.maxHp;
        // Se HP > 80%, quase 0. Se HP < 20%, quase 1.0
        if (hpPercent >= 0.8) return 0.0;
        return 1.0 - hpPercent; 
    },

    // Avalia a oportunidade de matar o herói. Se o dano da skill pode matar, retorna 1.0
    killOpportunity: function(context, skillDmgMultiplier) {
        const estimatedDmg = context.baseDmg * skillDmgMultiplier;
        if (context.hero.currentHp <= estimatedDmg) {
            return 1.0; // Instakill opportunity!
        }
        return 0.1; // Se não mata, não é prioridade por esse avaliador
    },

    // Avalia se a habilidade está em Cooldown
    isCooldownReady: function(context, skillId) {
        if (context.enemy.cooldowns && context.enemy.cooldowns[skillId] > 0) {
            return 0.0; // Em cooldown, impossível usar
        }
        return 1.0; // Pronto para usar
    },

    // Avalia a vulnerabilidade do herói (ex: se ele tá sem estamina)
    heroVulnerable: function(context) {
        // Na engine atual, heroCombatState e hero ficam no global, mas passamos pelo contexto
        if (typeof heroCombatState !== "undefined" && heroCombatState.staggerBroken) {
            return 1.0;
        }
        if (context.hero.stamina <= 0) {
            return 0.8;
        }
        return 0.1;
    },

    // Agressividade base (sempre retorna um valor fixo para manter o monstro atacando se não tiver nada melhor)
    baseAggression: function(context) {
        return 0.4;
    }
};
