const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\igorx\\.gemini\\antigravity-ide\\brain\\308d4ddd-8c51-4f98-a7ca-477e60479d91';
const destDir = 'c:\\Users\\igorx\\OneDrive\\Documentos\\SANCTUARY.jogo\\PaginaInicial\\public\\bestiary';

const filesToCopy = [
    { src: 'roda_esqueletos_1784669615794.png', dest: 'roda_esqueletos.png' },
    { src: 'morcego_vampiro_1784669624025.png', dest: 'morcego_vampiro.png' },
    { src: 'carrasco_zumbi_1784669633611.png', dest: 'carrasco_zumbi.png' },
    { src: 'esqueleto_mago_1784669642536.png', dest: 'esqueleto_mago.png' },
    { src: 'aranha_criptas_1784669665445.png', dest: 'aranha_criptas.png' },
    { src: 'lodo_carnivoro_1784669674502.png', dest: 'lodo_carnivoro.png' },
    { src: 'cavaleiro_crisol_1784669683030.png', dest: 'cavaleiro_crisol.png' }
];

filesToCopy.forEach(file => {
    const srcPath = path.join(srcDir, file.src);
    const destPath = path.join(destDir, file.dest);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log('Copied ' + file.dest);
    } else {
        console.log('Not found: ' + srcPath);
    }
});
