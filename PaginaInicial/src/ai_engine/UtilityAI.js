// ==========================================
// UTILITY AI - CORE ENGINE (O Cérebro)
// ==========================================

window.executeUtilityAI = function(enemy, hero, calc, baseDmg) {
    // 1. Monta o Contexto atual (Tudo que o monstro "vê")
    const context = {
        enemy: enemy,
        hero: hero,
        calc: calc,
        baseDmg: baseDmg
    };

    // 2. Define o "Kit" de habilidades que esse monstro possui
    let availableActionIds = window.AIBossKits.genericCommon; // Padrão
    if (enemy.isBoss) {
        availableActionIds = window.AIBossKits.genericBoss;
    } else if (enemy.isElite) {
        availableActionIds = window.AIBossKits.genericElite;
    }
    
    // Se o monstro não tem cooldowns ainda, inicializa
    if (!enemy.cooldowns) enemy.cooldowns = {};

    let bestAction = null;
    let highestScore = -1;

    // 3. O Monstro "pensa" sobre cada ação disponível
    for (let i = 0; i < availableActionIds.length; i++) {
        const actionId = availableActionIds[i];
        const actionDef = window.AIActions[actionId];
        
        if (actionDef) {
            // Roda os avaliadores (A nota de 0 a 1)
            let score = actionDef.scoreFunction(context);
            
            // Adiciona um pequeno fator de aleatoriedade (fuzziness) 
            // para que monstros não sejam 100% previsíveis em notas parecidas.
            score += (Math.random() * 0.1); 

            console.log(`[AI Thinking] Ação: ${actionDef.name} | Score: ${score.toFixed(2)}`);

            if (score > highestScore) {
                highestScore = score;
                bestAction = actionDef;
            }
        }
    }

    // 4. Executa a melhor ação encontrada
    if (bestAction) {
        console.log(`[AI Decision] Escolheu: ${bestAction.name}`);
        const actionResult = bestAction.execute(context);
        
        // Se a ação tiver um efeito customizado (cura, buff, invocar), executa agora
        if (actionResult.customEffect && typeof actionResult.customEffect === "function") {
            actionResult.customEffect();
        }

        return {
            dmg: actionResult.dmg,
            skillName: actionResult.skillName,
            skillType: actionResult.skillType,
            isAttack: actionResult.isAttack
        };
    } else {
        // Fallback (Se algo der errado, ele ataca normalmente)
        return {
            dmg: baseDmg,
            skillName: "Ataque Básico (Fallback)",
            skillType: "Físico",
            isAttack: true
        };
    }
};
