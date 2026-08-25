const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('ERROR:', err.toString()));
    await page.goto('file:///C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/Jogo.html');
    await browser.close();
})();
