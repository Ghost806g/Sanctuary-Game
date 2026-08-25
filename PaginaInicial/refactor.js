const fs = require('fs');
const src = fs.readFileSync('src/main_v3.js', 'utf8');
const lines = src.split('\n');

const funcsToMove = [
  'initCombatInstance',
  'startCombatTicker',
  'resumeCombatTicker',
  'stopCombatTicker',
  'processCombatRound',
  'castCombatSkill',
  'internalHeroActionExecution',
  '_calcHeroFinalDmg',
  'resolveEnemyAttack',
  'executeMonsterAI',
  'processEpicPassives',
  'getBestiaryCombatBonus',
  'getComboMultiplier',
  'handleHeroDeath',
  'finalizeCombatWin',
  '_generateLoreFragments',
  '_generateBossRelics',
  'drinkPotionFromCombat',
  'retreatFromFight',
  'closeDeath',
  'addExperience',
  'useConsumable',
  'generateProceduralLoot'
];

const findFunc = (name) => { 
  let start = -1; let end = -1; let braceCount = 0; 
  for(let i=0; i<lines.length; i++) { 
    if (start === -1 && (lines[i].includes('function ' + name) || lines[i].includes('window.' + name + ' = function'))) { 
      start = i; 
      braceCount = (lines[i].match(/\{/g) || []).length - (lines[i].match(/\}/g) || []).length; 
    } else if (start !== -1) { 
      braceCount += (lines[i].match(/\{/g) || []).length - (lines[i].match(/\}/g) || []).length; 
      if (braceCount === 0) { end = i; break; } 
    } 
  } 
  return {start, end}; 
};

let extractedCode = '// ==========================================\n// COMBAT ENGINE EXTRACTED FROM MAIN_V3\n// ==========================================\n\n';
let toRemoveLines = new Set();

for (const fn of funcsToMove) {
    const {start, end} = findFunc(fn);
    if (start !== -1 && end !== -1) {
        console.log('Found ' + fn + ' from ' + start + ' to ' + end);
        extractedCode += lines.slice(start, end + 1).join('\n') + '\n\n';
        for (let i = start; i <= end; i++) {
            toRemoveLines.add(i);
        }
    } else {
        console.log('Function ' + fn + ' not found or failed to parse.');
    }
}

const remainingLines = lines.filter((_, idx) => !toRemoveLines.has(idx));
fs.writeFileSync('src/main_v3.js', remainingLines.join('\n'), 'utf8');

const engineSrc = fs.readFileSync('src/engine/CombatEngine.js', 'utf8');
fs.writeFileSync('src/engine/CombatEngine.js', extractedCode + '\n' + engineSrc, 'utf8');
console.log('Refactor script completed successfully.');
