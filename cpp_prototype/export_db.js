const fs = require('fs');

const dbPath = '../PaginaInicial/src/database.js';
const outPath = './vendor/database.json';

console.log('Lendo database.js...');
const content = fs.readFileSync(dbPath, 'utf8');

// Regex para encontrar blocos de monstros.
// Exemplo: name: "Aranha das Criptas", hp: 60, atk: 11, def: 10, ...
const monsterRegex = /name:\s*"([^"]+)",\s*hp:\s*(\d+),\s*atk:\s*(\d+),\s*def:\s*(\d+)/g;

const monsters = {};
let match;
while ((match = monsterRegex.exec(content)) !== null) {
    const name = match[1];
    const hp = parseInt(match[2]);
    const atk = parseInt(match[3]);
    const def = parseInt(match[4]);
    
    monsters[name] = {
        name: name,
        hp: hp,
        atk: atk,
        def: def,
        speed: 15.0 // Valor padrao se nao encontrar agilidade
    };
}

// Tentativa de pegar agilidade (se existir em outra linha)
// O JS atual tem 'agi' ou algo similar?
// Para garantir, vamos fazer um regex mais solto se precisar, 
// mas isso ja deve pegar os principais atributos.

console.log(`Encontrados ${Object.keys(monsters).length} monstros.`);

fs.writeFileSync(outPath, JSON.stringify(monsters, null, 2));
console.log(`Salvo em ${outPath}`);
