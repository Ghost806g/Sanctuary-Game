// teste pra implementar um mouse personalizado

/* 
  COMO USAR UM CURSOR PERSONALIZADO:
  A forma mais fácil é pelo CSS. Você pode colocar isso no seu jogo_v2.css:
  
  body {
    cursor: url('/assets/images/ui/cursors/gloves.svg') 0 0, auto !important;
  }
  
  Onde "0 0" é a ponta (coordenada X e Y) do cursor.

  Se quiser testar via Javascript (que é útil se você quiser que o cursor 
  mude só quando passar por cima de um inimigo, por exemplo), o código é:
*/

// Aplica o cursor no corpo do site inteiro
document.body.style.cursor = "url('/assets/images/ui/cursors/gloves.svg') 0 0, auto";

// NOTA IMPORTANTE: Arquivos SVG gigantes ou sem tamanho definido (width/height)
// às vezes não carregam como cursor. Se ele não aparecer, o ideal é abrir o 
// SVG e garantir que ele tenha um tamanho como 32x32, ou converter para .png!
