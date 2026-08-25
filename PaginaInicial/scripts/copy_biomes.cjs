const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\igorx\\.gemini\\antigravity-ide\\brain\\308d4ddd-8c51-4f98-a7ca-477e60479d91';
const destDir = 'c:\\Users\\igorx\\OneDrive\\Documentos\\SANCTUARY.jogo\\PaginaInicial\\public\\assets\\images\\biomes';

const filesToCopy = [
    { prefix: 'bg_catacumbas', dest: 'bg_catacumbas.png' },
    { prefix: 'bg_pantano', dest: 'bg_pantano.png' },
    { prefix: 'bg_forja', dest: 'bg_forja.png' },
    { prefix: 'bg_magma', dest: 'bg_magma.png' },
    { prefix: 'bg_floresta', dest: 'bg_floresta.png' },
    { prefix: 'bg_cristal', dest: 'bg_cristal.png' }
];

const files = fs.readdirSync(srcDir);

filesToCopy.forEach(f => {
    // Find the latest file that starts with the prefix
    const match = files.filter(file => file.startsWith(f.prefix)).sort().pop();
    if (match) {
        fs.copyFileSync(path.join(srcDir, match), path.join(destDir, f.dest));
        console.log('Copied ' + f.dest);
    } else {
        console.log('Not found: ' + f.prefix);
    }
});
