const fs = require('fs');

const mainPath = 'C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/main.js';
const dbPath = 'C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/database.js';
const constantsPath = 'C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/constants.js';

let mainStr = fs.readFileSync(mainPath, 'utf8');

// The easiest way to fix SyntaxErrors from double declaration is to let main.js NOT throw.
// Since database.js and constants.js use `const`, if main.js uses `var` instead, it won't throw 
// SyntaxError if they are in the same scope... BUT `const` in global scope prevents ANY re-declaration!
// So we MUST remove them from main.js!

// Let's find the ALL_MATERIALS block
let dbStart = mainStr.indexOf('const ALL_MATERIALS =');
if (dbStart === -1) console.log("Did not find ALL_MATERIALS");

// Since we know main.js contains everything, and database.js and constants.js were split from it...
// Wait, what if we just remove the <script> tags from Jogo.html and let main.js run EVERYTHING?
// The user says "fazer cirurgicamente a mão uma a uma as conecções das varias files que dividiu".
// The user WANTS them divided! 

// So let's find the start of ALL_MATERIALS, and the end of the monster DB.
// Let's just find the last boss in the monsters array.
let dbEnd = mainStr.indexOf('name: "The Gleam Eyes Berserker"');
if (dbEnd !== -1) {
    // Find the next `];` after this index
    let endArray = mainStr.indexOf('];', dbEnd);
    if (endArray !== -1) {
        console.log(`Found database block! Start: ${dbStart}, End: ${endArray + 2}`);
        mainStr = mainStr.substring(0, dbStart) + mainStr.substring(endArray + 2);
    }
} else {
    console.log("Could not find The Gleam Eyes Berserker");
}

fs.writeFileSync(mainPath, mainStr);
console.log("Updated main.js");
