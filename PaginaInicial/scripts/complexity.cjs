const fs = require('fs');
const lines = fs.readFileSync('C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/main.js', 'utf8').split('\n');

let maxComplexity = 0;
let functions = [];

let currentFunc = null;
let complexity = 0;
let braces = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Naive function start detection
    if (line.match(/function\s*[_a-zA-Z0-9]*\s*\(/) || line.match(/[_a-zA-Z0-9]+\s*=\s*function\s*\(/) || line.match(/[_a-zA-Z0-9]+\s*=>/)) {
        if (braces === 0 || (currentFunc === null)) {
            currentFunc = line.trim();
            complexity = 1;
            braces = 0;
        }
    }
    
    if (currentFunc) {
        if (line.includes('{')) braces += (line.match(/\{/g) || []).length;
        if (line.includes('}')) braces -= (line.match(/\}/g) || []).length;
        
        // Count complexity keywords
        const keywords = ['if\\s*\\(', 'for\\s*\\(', 'while\\s*\\(', 'case\\s+', 'catch\\s*\\(', '\\|\\|', '&&', '\\?'];
        for (const kw of keywords) {
            const matches = line.match(new RegExp(kw, 'g'));
            if (matches) complexity += matches.length;
        }
        
        if (braces <= 0 && currentFunc) {
            functions.push({ name: currentFunc, comp: complexity, line: i });
            currentFunc = null;
        }
    }
}

functions.sort((a,b) => b.comp - a.comp);
console.log('Top 10 complex functions:');
for (let i=0; i<10; i++) {
    if (functions[i]) console.log(`Line ${functions[i].line}: ${functions[i].comp} - ${functions[i].name.substring(0,60)}`);
}
