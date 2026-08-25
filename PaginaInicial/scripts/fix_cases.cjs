const fs = require('fs');

const mainPath = 'c:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/main.js';
let lines = fs.readFileSync(mainPath, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("case 'levelup':") && !lines[i].includes("{")) {
        lines[i] = "            case 'levelup': {";
    }
    if (lines[i].includes("case 'achieve':") && !lines[i].includes("{")) {
        lines[i] = "            case 'achieve': {";
    }
    if (lines[i].includes("break;") && (lines[i-1] && lines[i-1].includes("osc3.stop") || lines[i-1].includes("a4.start"))) {
        // Wait, it's safer to just look for break after the block. 
        // A better way is to replace case 'levelup': with case 'levelup': {
        // and find the very next break; and replace with break; }
    }
}

let inLevelUp = false;
let inAchieve = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("case 'levelup': {")) inLevelUp = true;
    if (lines[i].includes("case 'achieve': {")) inAchieve = true;
    
    if (inLevelUp && lines[i].includes("break;")) {
        lines[i] = lines[i].replace("break;", "} break;");
        inLevelUp = false;
    }
    if (inAchieve && lines[i].includes("break;")) {
        lines[i] = lines[i].replace("break;", "} break;");
        inAchieve = false;
    }
}

fs.writeFileSync(mainPath, lines.join('\n'));
console.log("Fixed cases");
