const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // Available via next/transformers

const targetDir = 'd:/SANCTUARY_Tauri_Nova/PaginaInicial/public/assets/images';

// Recursively get all PNG files
function getPngFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getPngFiles(filePath, fileList);
        } else if (filePath.toLowerCase().endsWith('.png') || filePath.toLowerCase().endsWith('.jpg') || filePath.toLowerCase().endsWith('.jpeg')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const allImages = getPngFiles(targetDir);
console.log(`Found ${allImages.length} images to compress. Starting batch conversion...`);

async function processBatch(files) {
    let count = 0;
    const errors = [];
    let savedBytes = 0;

    // Process sequentially or small chunks to prevent memory blowup on 1.4GB of files
    for (const file of files) {
        try {
            const originalStats = fs.statSync(file);
            const originalSize = originalStats.size;

            const isPng = file.toLowerCase().endsWith('.png');
            let outPath = file;
            
            // We'll output to webp and delete the original if it was png/jpg
            if (isPng || file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')) {
                 outPath = file.substring(0, file.lastIndexOf('.')) + '.webp';
                 
                 await sharp(file)
                    .webp({ quality: 80, effort: 4 })
                    .toFile(outPath);
                    
                 const newStats = fs.statSync(outPath);
                 savedBytes += (originalSize - newStats.size);
                 
                 // Delete original if successful and path is different
                 if (outPath !== file) {
                    fs.unlinkSync(file);
                 }
            }
            
            count++;
            if (count % 200 === 0) {
                console.log(`Processed ${count} / ${files.length} ... (Saved ${(savedBytes/1024/1024).toFixed(2)} MB so far)`);
            }
        } catch (e) {
            errors.push({ file, error: e.message });
        }
    }
    
    console.log(`\nCompression completed!`);
    console.log(`Successfully converted: ${count - errors.length}`);
    console.log(`Total space saved: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);
    if (errors.length > 0) {
        console.log(`Encountered ${errors.length} errors. First few:`, errors.slice(0, 3));
    }
}

processBatch(allImages);
