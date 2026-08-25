import re
import sys

with open('PaginaInicial/src/lore.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import { initGemini, fetchFullMobLore } from './services/aiService.js';\ninitGemini(import.meta.env.VITE_GEMINI_API_KEY);",
    "import { initGemini, fetchFullMobLore } from './services/aiService.js';\nimport { initThreeBook, buildThreeBook, openThreeBook, closeThreeBook, turnThreePage, updatePageTexture } from './threeBook.js';\n\ninitGemini(import.meta.env.VITE_GEMINI_API_KEY);\nsetTimeout(() => initThreeBook(), 100);"
)

# 2. checkAndLoadDynamicLore
content = content.replace(
    'element.innerHTML = `<span style="opacity:0.5; font-style:italic;">"${fullLore.ecologia}"</span>`;',
    'element.innerHTML = `<span style="opacity:0.5; font-style:italic;">"${fullLore.ecologia}"</span>`;\n                updatePageTexture(pageIndex, `book-page-${pageIndex}`);'
)
content = content.replace(
    'element.innerHTML = `<span style="opacity:0.5; font-style:italic;">"${fullLore.anatomia}"</span>`;',
    'element.innerHTML = `<span style="opacity:0.5; font-style:italic;">"${fullLore.anatomia}"</span>`;\n                updatePageTexture(pageIndex, `book-page-${pageIndex}`);'
)
content = content.replace(
    'element.innerHTML = `<span style="opacity:0.5; font-style:italic;">"${fullLore.fraqueza}"</span>`;',
    'element.innerHTML = `<span style="opacity:0.5; font-style:italic;">"${fullLore.fraqueza}"</span>`;\n                updatePageTexture(pageIndex, `book-page-${pageIndex}`);'
)

# 3. openRealBook
open_book_old = """function openRealBook() {
    const book = document.getElementById('real-book');
    if (!book) return;
    
    // Anima a capa abrindo
    book.classList.add('open');
    if (typeof playScratch === 'function') playScratch();
    
    setTimeout(() => {
        buildBookInterior();
    }, 800); // Espera a capa virar um pouco
}"""
open_book_new = """function openRealBook() {
    const bookContainer = document.getElementById('offscreen-book-render');
    if (bookContainer) bookContainer.classList.add('open');
    
    const nav = document.getElementById('real-book-nav');
    if (nav) nav.style.display = 'flex';

    if (typeof playScratch === 'function') playScratch();
    
    // Constrói e abre o WebGL
    buildBookInterior();
    openThreeBook();
}"""
content = content.replace(open_book_old, open_book_new)

# 4. closeRealBook
close_book_old = """function closeRealBook() {
    const book = document.getElementById('real-book');
    const nav = document.getElementById('real-book-nav');
    if (book) {
        // Remove as páginas internas deixando só a capa
        const pages = book.querySelectorAll('.page');
        pages.forEach(p => p.remove());
        
        book.classList.remove('open');
    }
    if (nav) nav.style.display = 'none';
    if (typeof playScratch === 'function') playScratch();
}"""
close_book_new = """function closeRealBook() {
    const bookContainer = document.getElementById('offscreen-book-render');
    if (bookContainer) bookContainer.classList.remove('open');
    
    const nav = document.getElementById('real-book-nav');
    if (nav) nav.style.display = 'none';
    
    currentBookPage = 0;
    closeThreeBook();
    
    if (typeof playScratch === 'function') playScratch();
}"""
content = content.replace(close_book_old, close_book_new)

# 5. buildBookInterior
build_end_old = """    html += '</div>';
    
    document.getElementById('real-book-container').innerHTML = html;
    
    totalBookPages = pageIndex - 1; // Ajuste pois o loop termina com ++
}"""
build_end_new = """    html += '</div>';
    
    document.getElementById('real-book-container').innerHTML = html;
    
    totalBookPages = pageIndex - 1; // Ajuste pois o loop termina com ++

    setTimeout(() => {
        buildThreeBook(totalBookPages);
    }, 200);
}"""
content = content.replace(build_end_old, build_end_new)

# 6. turnRealPage
turn_page_old = """function turnRealPage(direction) {
    if (isTurningPage && !isJumpingPage) return;

    if (direction === 1 && currentBookPage < totalBookPages) {
        if (!isJumpingPage) isTurningPage = true;
        playPaperSound();
        const targetPageId = currentBookPage;
        const page = document.getElementById(`book-page-${targetPageId}`);
        if (page) {
            page.classList.add('turned');
        }
        currentBookPage++;
        checkAndLoadDynamicLore(currentBookPage);
        if (!isJumpingPage) setTimeout(() => isTurningPage = false, 800);
    } else if (direction === -1 && currentBookPage > 0) {
        if (!isJumpingPage) isTurningPage = true;
        playPaperSound();
        const targetPageId = currentBookPage - 1;
        const page = document.getElementById(`book-page-${targetPageId}`);
        if (page) {
            page.classList.remove('turned');
        }
        currentBookPage--;
        checkAndLoadDynamicLore(currentBookPage);
        if (!isJumpingPage) setTimeout(() => isTurningPage = false, 800);
    }
}"""
turn_page_new = """function turnRealPage(direction) {
    if (isTurningPage && !isJumpingPage) return;

    if (direction === 1 && currentBookPage <= totalBookPages) {
        if (!isJumpingPage) isTurningPage = true;
        playPaperSound();
        const targetPageId = currentBookPage;
        
        const page = document.getElementById(`book-page-${targetPageId}`);
        if (page) page.classList.add('turned');

        turnThreePage(targetPageId, direction);

        currentBookPage++;
        checkAndLoadDynamicLore(currentBookPage);
        if (!isJumpingPage) setTimeout(() => isTurningPage = false, 800);
    } else if (direction === -1 && currentBookPage > 0) {
        if (!isJumpingPage) isTurningPage = true;
        playPaperSound();
        const targetPageId = currentBookPage - 1;
        
        const page = document.getElementById(`book-page-${targetPageId}`);
        if (page) page.classList.remove('turned');

        turnThreePage(targetPageId, direction);

        currentBookPage--;
        checkAndLoadDynamicLore(currentBookPage);
        if (!isJumpingPage) setTimeout(() => isTurningPage = false, 800);
    }
}"""
content = content.replace(turn_page_old, turn_page_new)

with open('PaginaInicial/src/lore.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("lore.js patched successfully.")
