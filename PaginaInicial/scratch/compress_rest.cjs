const fs=require('fs'); 
const path=require('path'); 
const sharp=require('sharp'); 
async function processBatch(files) { 
    for(const f of files) { 
        const out = f.substring(0, f.lastIndexOf('.')) + '.webp'; 
        try {
            await sharp(f).webp({quality:80,effort:4}).toFile(out); 
            fs.unlinkSync(f); 
            console.log('Converted:', f); 
        } catch(e) {
            console.error('Error converting', f, e);
        }
    } 
} 
function getP(dir, rec=true) { 
    let l=[]; 
    if(!fs.existsSync(dir)) return l;
    fs.readdirSync(dir).forEach(file => { 
        const f=path.join(dir, file); 
        if(fs.statSync(f).isDirectory() && rec) {
            l=l.concat(getP(f,rec)); 
        } else if(f.match(/\.(png|jpg|jpeg)$/i)) {
            l.push(f); 
        }
    }); 
    return l; 
} 
const files = [
    ...getP('d:/SANCTUARY_Tauri_Nova/PaginaInicial/public/bestiary', true), 
    ...getP('d:/SANCTUARY_Tauri_Nova/PaginaInicial/public/assets/tarot', true), 
    ...getP('d:/SANCTUARY_Tauri_Nova/PaginaInicial/public', false), 
    ...getP('d:/SANCTUARY_Tauri_Nova/PaginaInicial/public/assets', false)
]; 
processBatch(files).then(() => console.log('Done!'));
