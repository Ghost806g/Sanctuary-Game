const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceDir = `C:\\Users\\igorx\\.gemini\\antigravity-ide\\brain\\db2db4f4-d813-4d85-b03a-1d50b04a8549`;
const destDirs = [
    `d:\\SANCTUARY_Tauri_Nova\\PaginaInicial\\public\\bestiary`,
    `d:\\SANCTUARY_Tauri_Nova\\PaginaInicial\\dist\\bestiary`
];

async function run() {
    const files = fs.readdirSync(sourceDir);
    const pngs = files.filter(f => f.endsWith('.png'));

    for (const file of pngs) {
        const match = file.match(/^(.+?)_\d+\.png$/);
        const baseName = match ? match[1] : file.replace('.png', '');
        const webpName = `${baseName}.webp`;

        const sourcePath = path.join(sourceDir, file);
        
        for (const destDir of destDirs) {
            if (fs.existsSync(destDir)) {
                const destPath = path.join(destDir, webpName);
                try {
                    await sharp(sourcePath).webp({ quality: 90 }).toFile(destPath);
                    console.log(`Convertido e movido: ${destPath}`);
                } catch(e) {
                    console.error(`Erro ao converter ${file}:`, e);
                }
            }
        }
    }
}

run().catch(console.error);
