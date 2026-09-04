// caixa de entrada para frases sombeteiras, provocadoras, satisfeitas, e impiedosas
// do senhor da masmorra (no caso eu, o criador "O verdadeiro Nephalem")

    const VOICES_OF_NEPHALEM = {
    hero_death: [
        "Achei que você duraria mais... Que decepção.",
        "Seus ossos vão decorar a entrada do meu labirinto.",
        "Tanta arrogância, tão pouca habilidade."
    ],
    boss_kill: [
        "Como você...? sorte de principiante, esse era so aquecimento... O próximo não será tão piedoso.",
        "Você matou meu bicho de estimação... Vai pagar caro por isso.",
        "Interessante... Talvez você não seja um inseto completo, mas ainda esta bem longe."
    ],
    miss_attack: [
        "Até um cego acertaria esse golpe, Nephalem falso.",
        "Você está balançando uma arma ou espantando moscas? Isso esta desafiando meu dominio? não me faça rir"
    ],
    coward_flee: [
        "Fuja, ratinho! As sombras sempre alcançam os covardes, elas amam o medo, é o petisco favorito delas...",
        "Que patético. Nem ouse olhar para trás..."
    ],
    low_hp_heal: [
        "Bebendo poções como um mendigo sedento... Adorável.",
        "Adiar o inevitável só torna a sua queda mais doce...",
        "Você deve ser o favorito do mercador, não é? Rios de ouro ele ganha de você..."
    ],
    player_skill_used: [
        "Olha só o que temos aqui...brincando de ser heroi? Aprendeu com o Kirito?",
        "Tão cheio de si, me lembra ate um certo meio demonio de jaqueta vermelha...",
        "Espera...de onde criou essa habilidade? não vai dizer que roubou isso de um lorde premisso?"
    ]
};
function eventsVoice(event, entityName){
    // Pega as frases relacionadas ao evento
    const phrases = VOICES_OF_NEPHALEM[event];
    
    if (!phrases || phrases.length === 0) return;
    // Escolhe uma frase aleatória
    const randomQuote = phrases[Math.floor(Math.random() * phrases.length)];
    
    // Como mostrar no jogo? Algumas ideias:
    // 1. Mandar pro terminal com uma cor e ícone especial:
    // appendTerminalLog(`👁️ A Voz do Criador: "${randomQuote}"`, "nephalem-voice");
    
    // 2. Ou colocar um Toast assustador:
    // triggerToast(`💀 "${randomQuote}"`);
    
    // 3. (Opcional) Fazer a tela tremer quando você fala:
    // triggerScreenShake();
  }