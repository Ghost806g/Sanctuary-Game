const fs = require('fs');
let main = fs.readFileSync('C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/main.js', 'utf8');

const startIdx = main.indexOf('const ALL_MATERIALS =');
const endStr = 'message: "O demônio entra em fúria total! Seus olhos brilham intensamente!" }\n        }\n    }\n];';
const endIdx = main.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
    main = main.substring(0, startIdx) + main.substring(endIdx + endStr.length);
    fs.writeFileSync('C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/main.js', main);
    console.log('Successfully stripped database.js from main.js');
} else {
    console.log('Failed to find boundaries:', startIdx, endIdx);
}
