const COLOR_BLUE_RGB = "59, 130, 246";
const CLASS_PHASE_ACTIVE = "phase-active";
const CLASS_RUNE_LIT = "rune-lit";
const CLASS_PHASE_EXIT = "phase-exit";
const STATE_SELECTED_PROF = "selectedProfession";
const ID_CONTAINER_PROF = "ritual-cards-container-prof";

// =====================================================
// SISTEMA CINEMATOGRÁFICO DE ENTRADA
// =====================================================
function runCinematicIntro() {
  const overlay = document.getElementById("cinematic-overlay");
  const title = document.getElementById("main-title");
  const subtitle = document.getElementById("subtitle-text");
  const cards = document.querySelectorAll(".menu-card");

  // Fase 1: Blackout por 600ms, depois fade overlay
  setTimeout(() => {
    overlay.classList.add("fade-out");
  }, 600);

  // Fase 2: Título aparece com animação épica
  setTimeout(() => {
    title.classList.add("anim-title");
    spawnEmbers(title);
  }, 900);

  // Fase 3: Subtítulo com typewriter
  setTimeout(() => {
    subtitle.classList.add("anim-subtitle");
  }, 2200);

  // Fase 4: Cards aparecem em cascata
  cards.forEach((card, i) => {
    setTimeout(
      () => {
        card.classList.add("anim-card");
      },
      3200 + i * 200,
    );
  });

  // Fase 5: Remover overlay do DOM
  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 2000);
}

// Spawna partículas de brasas ao redor do título
function spawnEmbers(anchor) {
  const rect = anchor.getBoundingClientRect();
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const ember = document.createElement("div");
      ember.className = "ember";
      ember.style.left = rect.left + Math.random() * rect.width + "px";
      ember.style.top = rect.bottom - 10 + Math.random() * 20 + "px";
      ember.style.animationDelay = Math.random() * 0.5 + "s";
      ember.style.animationDuration = 1.5 + Math.random() * 1.5 + "s";
      document.body.appendChild(ember);
      setTimeout(() => ember.remove(), 3500);
    }, i * 120);
  }
}

// =====================================================
// GERENCIADOR DE SAVES E CARREGAMENTO
// =====================================================
window.showSavesModal = async function () {
  document.getElementById("saves-modal").style.display = "flex";
  const container = document.getElementById("saves-list-container");
  container.innerHTML =
    "<p style='color:#fff;'>Buscando Registros Akáshicos...</p>";

  try {
    let heroes = [];
    if (window.dbService) {
      heroes = await window.dbService.getHeroes();
    }

    container.innerHTML = "";
    if (heroes.length === 0) {
      container.innerHTML =
        "<p style='color:#fca5a5;'>Nenhum Nephalem despertou ainda. Realize o Ritual.</p>";
      return;
    }

    heroes.forEach((h) => {
      const div = document.createElement("div");
      div.style.background = "#1a0505";
      div.style.border = "1px solid #7f1d1d";
      div.style.padding = "15px";
      div.style.borderRadius = "8px";
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.alignItems = "center";
      div.style.cursor = "pointer";
      div.onmouseenter = () => (div.style.background = "#2a0505");
      div.onmouseleave = () => (div.style.background = "#1a0505");

      div.innerHTML = `
            <div>
                <h3 style="color:#fbbf24; margin-bottom:5px;">${h.name}</h3>
                <p style="color:#aaa; font-size:0.9rem;">${h.class} - Nv. ${h.level}</p>
            </div>
            <button class="btn btn-secondary" onclick="loadMySQLHero(${h.id})">Despertar</button>
        `;
      container.appendChild(div);
    });
  } catch (e) {
    console.error(e);
    container.innerHTML =
      "<p style='color:#ef4444;'>Erro ao conectar com o BD: " +
      String(e) +
      "</p>";
  }
};

window.hideSavesModal = function () {
  document.getElementById("saves-modal").style.display = "none";
};

window.loadMySQLHero = function (id) {
  sessionStorage.setItem("SANCTUARY_LOAD_HERO_ID", id);
  window.location.href = "Jogo.html?v=" + Date.now();
};

function loadLastSaveInfo() {
  // Lógica antiga local removida para dar foco no MySQL.
  const display = document.getElementById("last-save-display");
  if (display) {
    display.innerHTML = `Conectado aos Registros Akáshicos (MySQL)`;
  }
}

// =====================================================
// PARTÍCULAS
// =====================================================
tsParticles.load("tsparticles", {
  fpsLimit: 60,
  particles: {
    color: { value: ["#777777", "#999999", "#bbbbbb"] },
    move: { enable: true, speed: 0.8, direction: "none", random: true },
    number: { value: 280, density: { enable: true, area: 800 } },
    opacity: { value: { min: 0.15, max: 0.45 }, random: true },
    shape: { type: "circle" },
    size: { value: { min: 1.2, max: 4.5 } },
  },
  detectRetina: true,
});

// Modal Créditos
function showCredits() {
  document.getElementById("credits-modal").style.display = "flex";
}
function hideCredits() {
  document.getElementById("credits-modal").style.display = "none";
}

// Sistema de Música de Fundo Padrão
const music = document.getElementById("bg-music");
const toggleBtn = document.getElementById("music-toggle");
let isPlaying = true;

music.volume = 0.22;

function fadeInMusic() {
  music.volume = 0;
  music.play().catch(() => {});
  let vol = 0;
  const fade = setInterval(() => {
    vol += 0.009;
    music.volume = Math.min(vol, 0.22);
    if (vol >= 0.22) {
      clearInterval(fade);
    }
  }, 220);
}

// Inicia tudo ao carregar
window.addEventListener("load", () => {
  fadeInMusic();
  runCinematicIntro();
  loadLastSaveInfo();
});

function toggleMusic() {
  // Se o áudio alternativo do easter egg estiver tocando, cancela o comportamento padrão de toggle
  const dualityAudio = document.getElementById("duality-music");
  if (dualityAudio && !dualityAudio.paused) {
    dualityAudio.pause();
    toggleBtn.textContent = "▶ Tocar";
    isPlaying = false;
    return;
  }

  if (isPlaying) {
    music.pause();
    toggleBtn.textContent = "▶ Tocar";
  } else {
    music.play();
    toggleBtn.textContent = "⏸️ Música";
  }
  isPlaying = !isPlaying;
}

function playClick() {
  const click = new Audio(
    "https://freesound.org/data/previews/342/342749_3248244-lq.mp3",
  );
  click.volume = 0.4;
  click.play().catch(() => {});
}

// =====================================================
// SECTION: EASTER EGGS SISTEMA O CULTO DE SANCTUARY
// =====================================================

// Easter Egg 1: Clicar 5 vezes ativa o Modo Pesadelo Metal + Toca Duality
let titleClicks = 0;
function triggerTitleEgg() {
  titleClicks++;
  playClick();
  if (titleClicks === 5) {
    document.getElementById("main-title").style.color = "#ff0000";
    const sub = document.querySelector(".subtitle");
    sub.textContent = "I PUSH MY FINGERS INTO MY EYES... BEHOLD THE ABYSS!";
    sub.style.color = "#ef4444";
    document.body.style.boxShadow = "inset 0 0 150px #7f1d1d";

    // 🎧 LÓGICA DE ÁUDIO CONFIGURADA AQUI:
    const dualityAudio = document.getElementById("duality-music");
    if (dualityAudio) {
      music.pause(); // Pausa o som ambiente de fundo antigo
      isPlaying = false;
      toggleBtn.textContent = "⏸️ Duality"; // Altera o indicador visual de som
      dualityAudio.volume = 0.35; // Define uma altura equilibrada para as caixas
      dualityAudio
        .play()
        .catch((e) =>
          console.log("Aguardando interação ou arquivo ausente:", e),
        );
    }

    alert(
      "🎸 [MODO OCULTO ATIVADO] As paredes das catacumbas ecoam guitarras distorcidas. O abismo agora ferve em vermelho!",
    );
  }
}

// Easter Egg 2: Contador de coxinhas
let coxinhasCount = 0;
function eatCoxinha(e) {
  e.stopPropagation();
  coxinhasCount++;
  playClick();
  const txt = document.getElementById("coxinha-egg");

  if (coxinhasCount < 5) {
    txt.innerHTML = `Orçamento do jogo: ${coxinhasCount + 1} Coxinhas e um refrigerante de 2L`;
  } else if (coxinhasCount === 5) {
    txt.innerHTML =
      "🏆 [ITEM LENDÁRIO DESBLOQUEADO] Coxinha Ancestral Divina adicionada ao inventário conceitual!";
    txt.style.color = "#fbbf24";
    alert(
      "🍗 Você comeu tantas coxinhas que o estômago do Nephalem transcendia as leis da física! +50% de Resistência à Fome no Próximo Patch.",
    );
  }
}

// Easter Egg 3: Teclado ("abismo")
let inputBuffer = "";
let isFs = true; // default configurado no tauri.conf.json
window.addEventListener("keydown", async (e) => {
  if (e.altKey && e.key === "Enter") {
    e.preventDefault();
    isFs = !isFs;
    try {
      const { invoke } = window.__TAURI__.core;
      await invoke("set_fullscreen", { state: isFs });
    } catch (err) {
      alert("Erro ao mudar tela cheia: " + err);
    }
  }

  inputBuffer += e.key.toLowerCase();
  if (inputBuffer.length > 10) {
    inputBuffer = inputBuffer.substring(inputBuffer.length - 6);
  }

  if (inputBuffer.includes("abismo")) {
    inputBuffer = "";
    playClick();
    alert("👁️ O Abismo ouviu seu chamado... Algo se moveu na escuridão.");
    console.log(
      "%c[SECRET] Cuidado com o que você evoca no console do desenvolvedor!",
      "color: red; font-size: 16px; font-weight: bold;",
    );
  }
});
// ==========================================================
//  PARALLAX NO MENU
// ==========================================================
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  const bg = document.querySelector(".bg-overlay");
  if (bg) {
    bg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
  }
});

// =========================================================================
//  RITUAL DE DESPERTAR NEPHALEM — SISTEMA COMPLETO
// =========================================================================

// Banco de dados das classes com lore, ícones e stats
const CLASS_DATABASE = {
  Guerreiro: {
    icon: "⚔️",
    flavor: '"O aço é minha oração. Cada golpe, um verso de ferro."',
    stat: "Força",
    color: "#ef4444",
    colorRgb: "239, 68, 68",
    lore: "Forjado nas fogueiras implacáveis das guerras do velho mundo, o Guerreiro sobreviveu quando impérios ruíram. Eles não dependem de truques arcanos ou milagres divinos; seu domínio absoluto sobre as armas marciais transforma seus corpos em verdadeiras máquinas de moer carne. Cada cicatriz em sua pele espessa conta a história de uma monstruosidade abatida.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Escalação de Dano Físico. Golpes pesados destroem armaduras inimigas com brutalidade.<br><span style='color: #ef4444;'>✦ Maldição:</span> Baixa resistência a magias da mente; facilmente corrompidos por ilusões.",
    image: "tarot_class_warrior",
  },
  Arcanista: {
    icon: "🔮",
    flavor: '"O véu da realidade é fino... eu o rasgo com minhas mãos."',
    stat: "Inteligência",
    color: "#a855f7",
    colorRgb: "168, 85, 247",
    lore: "Eruditos profanos que manipularam as energias caóticas da Ruína. O Arcanista não estuda a magia em livros, ele a rasga da própria estrutura da realidade, sacrificando parte de sua sanidade a cada feitiço. O ar ao seu redor cheira a ozônio e cinzas, evidenciando seu controle sobre os elementos mais destrutivos do Santuário.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Dano em Área e Controle Elemental. Capaz de incinerar exércitos em segundos.<br><span style='color: #ef4444;'>✦ Maldição:</span> Vitalidade pífia. Um feitiço interrompido pode causar colapso mágico no próprio conjurador.",
    image: "tarot_class_arcanist",
  },
  Ranger: {
    icon: "🏹",
    flavor: '"A flecha já partiu antes do pensamento."',
    stat: "Agilidade",
    color: "#22c55e",
    colorRgb: "34, 197, 94",
    lore: "Os últimos fantasmas das matas mortas. Caçadores implacáveis que aprenderam a fundir sua essência com a própria floresta apodrecida. O Ranger rastreia suas presas através das sombras e neblinas do Santuário, abatendo horrores indescritíveis antes mesmo que notem sua presença. Eles são o vento que precede a morte.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Dano Crítico e Evasão. Movimentação letal inigualável e precisão cirúrgica.<br><span style='color: #ef4444;'>✦ Maldição:</span> Ineficazes em combate corpo a corpo prolongado contra criaturas colossais.",
    image: "tarot_class_ranger",
  },
  Barbaro: {
    icon: "🪓",
    flavor: '"Não preciso de armadura. Minha fúria é meu escudo."',
    stat: "Constituição",
    color: "#f97316",
    colorRgb: "249, 115, 22",
    lore: "Nascidos nas estepes congeladas e marcados por rituais de sangue tribais, os Bárbaros não sentem dor — eles a canalizam. Onde outros veem o fim do mundo, eles enxergam apenas uma arena gloriosa. Suas veias pulsam com uma fúria primordial, e cada ferimento sofrido apenas alimenta um transe berserker incontrolável.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Absorção de Dano Absurda. Quanto mais ferido, mais letal se torna.<br><span style='color: #ef4444;'>✦ Maldição:</span> Incapaz de utilizar armaduras pesadas e evasão nula; absorve cada golpe fisicamente.",
    image: "tarot_class_barbarian",
  },
  Paladino: {
    icon: "🛡️",
    flavor: '"A luz não perdoa. Ela julga."',
    stat: "Sabedoria",
    color: "#fbbf24",
    colorRgb: "251, 191, 36",
    lore: "Os últimos pilares de uma fé esquecida, banhados na luz dourada de deuses mortos. O Paladino marchou através do inferno e se recusou a queimar. Envoltos em aço santificado, eles são juízes implacáveis contra hereges, bestas da noite e a própria morte. A luz divina não apenas cura aliados, ela calcina a alma dos ímpios.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Defesa Divina e Cura. Dano bônus massivo contra entidades mortas-vivas e demônios.<br><span style='color: #ef4444;'>✦ Maldição:</span> Lentidão e dependência de mana sagrada, que não se regenera de formas convencionais.",
    image: "tarot_class_paladin",
  },
  Necromante: {
    icon: "💀",
    flavor: '"A morte não é o fim. É apenas o começo da obediência."',
    stat: "Inteligência",
    color: "#8b5cf6",
    colorRgb: "139, 92, 246",
    lore: "Aqueles que estudaram o abismo e foram acolhidos por ele. O Necromante rejeita o ciclo natural da vida, vendo cadáveres não como tragédias, mas como marionetes em potencial. Eles arrancam a alma do frio, distorcem a carne podre e governam legiões de ossos, provando que o fim do mundo é apenas o paraíso dos coveiros.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Drenagem de Vida e Invocação. Absorve os atributos de inimigos abatidos e levanta servos.<br><span style='color: #ef4444;'>✦ Maldição:</span> Odioso para com deuses e clérigos. Sofre dano verdadeiro (não mitigável) contra qualquer magia de luz.",
    image: "tarot_class_necromancer",
  },
};

// Banco de dados de Raças com lore, ícones e cores
const RACE_DATABASE = {
  Humano: {
    icon: "👤",
    flavor: '"A adaptabilidade é a nossa maior arma contra as trevas."',
    stat: "Equilíbrio",
    color: "#60a5fa",
    colorRgb: COLOR_BLUE_RGB,
    lore: "Forjados no fogo da ambição e moldados pela brevidade da vida, os Humanos do Santuário não possuem a magia inata dos elfos ou a resistência da pedra dos anões. Em vez disso, sua verdadeira força reside em uma adaptabilidade sombria e uma resiliência inquebrável diante do apocalipse. Eles sobrevivem onde os antigos deuses pereceram.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Crescimento equilibrado em todos os atributos, permitindo flexibilidade total na build.<br><span style='color: #ef4444;'>✦ Maldição:</span> Ausência de especialização inata; dependência extrema de equipamentos para alcançar poderes absolutos.",
    image: "tarot_race_human",
  },
  "Elfo Sombrio": {
    icon: "🧝‍♂️",
    flavor: '"A escuridão não nos cega. Ela nos acolhe."',
    stat: "Agilidade",
    color: "#c084fc",
    colorRgb: "192, 132, 252",
    lore: "Outrora seres de luz e florestas verdejantes, a Ruína corrompeu o sangue dos Elfos, transformando-os em espectros da noite. Seus corpos esguios e pálidos exalam uma aura gélida. Eles sacrificaram sua conexão sagrada com a natureza para abraçar o abismo, encontrando conforto nas sombras onde as bestas não ousam pisar.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Reflexos sobrenaturais e afinidade abissal. Evasão base altíssima.<br><span style='color: #ef4444;'>✦ Maldição:</span> Fragilidade física severa. Ossos ocos e pele fina os tornam vulneráveis a ataques de esmagamento.",
    image: "tarot_race_elf",
  },
  "Anão da Forja": {
    icon: "🧔",
    flavor: '"O magma nas veias não esfria tão fácil."',
    stat: "Resistência",
    color: "#fb923c",
    colorRgb: "251, 146, 60",
    lore: "Enclausurados no núcleo do mundo enquanto a superfície queimava, os Anões da Forja fundiram seus próprios corpos com o metal e a lava de seus reinos subterrâneos para sobreviver. Eles são montanhas de músculos compactos, teimosos como o aço temperado. Onde um humano quebraria, o anão apenas ri.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Escamas minerais na pele garantem defesa física massiva natural e resistência ao fogo.<br><span style='color: #ef4444;'>✦ Maldição:</span> Lentos e pesados. Mobilidade severamente reduzida e alto custo de stamina em combate ágil.",
    image: "tarot_race_dwarf",
  },
  "Orc Decaído": {
    icon: "👹",
    flavor: '"A dor é passageira. A fúria é eterna."',
    stat: "Vitalidade",
    color: "#4ade80",
    colorRgb: "74, 222, 128",
    lore: "Vítimas das primeiras ondas da Ruína, os Orcs foram retorcidos em bestas pálidas e deformadas, movidas puramente pelo instinto de destruição e uma força vital colossal. Eles aprenderam a transformar seu sofrimento e suas horríveis mutações em armas de guerra. Se você arrancar o braço de um orc, ele usará o coto ensanguentado para quebrar seu pescoço.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Vitalidade indomável (HP gigantesco) e regeneração brutal no calor da batalha.<br><span style='color: #ef4444;'>✦ Maldição:</span> Intelecto corrompido. Incapacidade crônica de conjurar magias arcanas complexas.",
    image: "tarot_race_orc",
  },
};

// Banco de dados de Profissões com lore, ícones e cores (30 Profissões divididas por Classe)
const PROFESSION_DATABASE = {
  Guerreiro: {
    "Ferreiro de Guerra": {
      icon: "🔨",
      flavor: '"O aço quente obedece apenas àqueles dispostos a queimar."',
      stat: "Durabilidade",
      color: "#a3a3a3",
      colorRgb: "163, 163, 163",
      lore: "Você não apenas empunha a arma, você a constrói e a entende. O Ferreiro de Guerra moldou placas brutas no calor da batalha, usando a própria bigorna como escudo quando necessário.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Bônus passivo massivo em Constituição e Força Física.<br><span style='color: #ef4444;'>✦ Maldição:</span> Mãos pesadas e lentas reduzem a velocidade de ataque com armas finas.",
      image: "tarot_prof_blacksmith",
    },
    "Mercenário de Fossa": {
      icon: "💰",
      flavor: '"Onde há sangue, há ouro."',
      stat: "Letalidade",
      color: "#fbbf24",
      colorRgb: "251, 191, 36",
      lore: "Honra é um luxo que os mortos não pagam. Você passou a vida cortando gargantas em becos e arenas clandestinas. Conhece todos os truques sujos para sobreviver.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Chance absurda de causar ferimentos letais (Crítico) e Evasão aprimorada.<br><span style='color: #ef4444;'>✦ Maldição:</span> Desprezado pela fé; magias de cura têm efeito drasticamente reduzido.",
      image: "tarot_prof_mercenario.jpg",
    },
    "Mestre de Armas": {
      icon: "⚔️",
      flavor: '"A espada não é um objeto, é o prolongamento do espírito."',
      stat: "Técnica",
      color: "#3b82f6",
      colorRgb: "59, 130, 246",
      lore: "Soldados treinam até fazer certo. Você treinou até ser impossível de errar. Sua vida foi dedicada ao estudo anatômico das raças do Santuário para achar as brechas.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Escala o Dano Físico perfeitamente; nunca erra ataques críticos.<br><span style='color: #ef4444;'>✦ Maldição:</span> Arrogância marcial; recusa o uso de qualquer engenhoca ou poção suja.",
      image: "tarot_prof_mestre_armas.jpg",
    },
    "Vanguarda Sangrenta": {
      icon: "🛡️",
      flavor: '"Alguém deve segurar a linha. Nós seguramos."',
      stat: "Resiliência",
      color: "#b91c1c",
      colorRgb: "185, 28, 28",
      lore: "Eram a primeira linha de defesa dos velhos impérios. Acostumados a serem pisoteados por bestas e a continuar de pé. Suas armaduras são fundidas à própria carne.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Constituição inabalável; imunidade a empurrões e atordoamentos.<br><span style='color: #ef4444;'>✦ Maldição:</span> Sem capacidade de evasão. É alvo primário de qualquer monstro no campo.",
      image: "tarot_prof_vanguarda_sangrenta.jpg",
    },
    "Cavaleiro Caído": {
      icon: "🐎",
      flavor: '"Meu juramento foi quebrado, mas minha lâmina não."',
      stat: "Estratégia",
      color: "#4f46e5",
      colorRgb: "79, 70, 229",
      lore: "Você pertencia à realeza antes que ela se transformasse em pó. O treinamento tático e a disciplina se mantêm, tornando-o um combatente não só forte, mas extremamente inteligente.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Une Força com Inteligência, permitindo defesas calculadas e leitura do inimigo.<br><span style='color: #ef4444;'>✦ Maldição:</span> Assombrado pelo passado; vulnerável a feitiços de ilusão e controle mental.",
      image: "tarot_prof_cavaleiro_caido.jpg",
    },
  },
  Arcanista: {
    "Erudito do Vazio": {
      icon: "📜",
      flavor: '"As palavras têm peso o suficiente para esmagar mundos."',
      stat: "Sabedoria",
      color: "#60a5fa",
      colorRgb: COLOR_BLUE_RGB,
      lore: "Anos consumidos lendo grimórios cujas páginas estalam em energia. O Erudito não usa força, usa as leis do universo a seu favor. Você decifrou o idioma dos deuses mortos.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Bônus permanente de XP e um limite de Mana virtualmente inesgotável.<br><span style='color: #ef4444;'>✦ Maldição:</span> Atrofia muscular extrema. Menor HP base de todos os heróis.",
      image: "tarot_prof_erudito_vazio.jpg",
    },
    "Alquimista Louco": {
      icon: "🧪",
      flavor:
        '"Explosões são apenas feitiços que deram maravilhosamente errado."',
      stat: "Volatilidade",
      color: "#34d399",
      colorRgb: "52, 211, 153",
      lore: "Quando a magia tradicional falhou, você apelou para reagentes, pólvora e sangue fervente. Suas vestes têm marcas de queimaduras ácidas e seus dedos não param de tremer.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Magias causam dano tóxico residual e dobram a eficácia de poções.<br><span style='color: #ef4444;'>✦ Maldição:</span> Conjurador instável; há sempre uma chance (pequena) da magia explodir na própria cara.",
      image: "tarot_prof_alquimista.jpg",
    },
    "Tecelão do Caos": {
      icon: "🌪️",
      flavor: '"A ordem é uma mentira imposta pelos fracos."',
      stat: "Poder Bruto",
      color: "#f43f5e",
      colorRgb: "244, 63, 94",
      lore: "Eles rejeitam fórmulas e feitiços decorados. Um Tecelão canaliza o puro terror da Ruína diretamente. Eles puxam fios da realidade e deixam que o acaso decida quem sobrevive.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Dano de Magia pode escalar aleatoriamente a números absurdos.<br><span style='color: #ef4444;'>✦ Maldição:</span> Resistências Elementais nulas; o corpo é frágil contra a própria energia que invoca.",
      image: "tarot_prof_tecelao_caos.jpg",
    },
    "Arquivista da Ruína": {
      icon: "👁️",
      flavor: '"Eu vi o começo, e agora narrarei o fim."',
      stat: "Previsão",
      color: "#c084fc",
      colorRgb: "192, 132, 252",
      lore: "Não basta destruir, é preciso arquivar. Você tem gravado os comportamentos das criaturas das trevas em um tomo maldito feito de pele humana.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Conhecimento inato das fraquezas (Aumento colossal no Dano Crítico Mágico).<br><span style='color: #ef4444;'>✦ Maldição:</span> Lentidão de movimento; tempo de conjuração atrasado pois deve consultar o grimório.",
      image: "tarot_prof_arquivista_ruina.jpg",
    },
    "Invocador de Cinzas": {
      icon: "🔥",
      flavor: '"Se está morto, por que não fazê-lo queimar uma última vez?"',
      stat: "Elementar",
      color: "#ea580c",
      colorRgb: "234, 88, 12",
      lore: "Magos que se especializaram em transmutar a cinza dos mortos em elementais furiosos. Eles carregam urnas antigas em vez de grimórios, soprando brasas nos campos de batalha.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Resistência massiva ao fogo e bônus gigante em Constituição para um mago.<br><span style='color: #ef4444;'>✦ Maldição:</span> Habilidades de gelo, água ou cura são bloqueadas permanentemente.",
      image: "tarot_prof_invocador_cinzas.jpg",
    },
  },
  Ranger: {
    "Caçador de Cabeças": {
      icon: "🎯",
      flavor: '"Não corro. Não pisco. Eu acerto."',
      stat: "Letalidade",
      color: "#dc2626",
      colorRgb: "220, 38, 38",
      lore: "Sniper solitário da floresta podre. Focado unicamente no abate certeiro e limpo, mirando onde a carne não protege o osso.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Ignora grande parte da Defesa Física inimiga e soma Força aos disparos.<br><span style='color: #ef4444;'>✦ Maldição:</span> Inútil em combates a curta distância; penalidade caso sofra emboscada.",
      image: "tarot_prof_cacador_cabecas.jpg",
    },
    "Batedor das Sombras": {
      icon: "🦇",
      flavor: '"Apenas tente acertar o que você não pode ver."',
      stat: "Evasão",
      color: "#64748b",
      colorRgb: "100, 116, 139",
      lore: "Viver furtivamente se tornou uma segunda pele. Você é o batedor que mapeava as masmorras antes que os exércitos ousassem entrar.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> A maior Evasão do jogo. Bônus em Agilidade fora da curva.<br><span style='color: #ef4444;'>✦ Maldição:</span> Incapaz de utilizar escudos ou armaduras pesadas. Se for pego, morre.",
      image: "tarot_prof_batedor_sombras.jpg",
    },
    "Mestre das Feras": {
      icon: "🐺",
      flavor: '"As feras não são monstros, são vítimas como nós."',
      stat: "Sobrevivência",
      color: "#84cc16",
      colorRgb: "132, 204, 22",
      lore: "Aqueles que abandonaram a humanidade para viver no instinto animal. Eles rastreiam com o olfato e imitam o comportamento primitivo.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Alta Constituição natural; pode sangrar adversários facilmente.<br><span style='color: #ef4444;'>✦ Maldição:</span> Inteligência baixa. Dificuldade extrema de decifrar magias ou mecanismos.",
      image: "tarot_prof_mestre_feras.jpg",
    },
    "Franco-Atirador Arcano": {
      icon: "✨",
      flavor: '"Minha flecha é luz sólida, furando a escuridão."',
      stat: "Precisão",
      color: "#06b6d4",
      colorRgb: "6, 182, 212",
      lore: "Um arqueiro que aprendeu as artes rudimentares do Vazio, encantando as próprias munições para nunca precisar carregar uma aljava física.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Dano Híbrido. Flechas escalam tanto com Agilidade quanto com Inteligência.<br><span style='color: #ef4444;'>✦ Maldição:</span> Uso de ataques drena Mana, deixando vulnerável sem regeneração arcana.",
      image: "tarot_prof_franco_atirador.jpg",
    },
    "Sobrevivente do Ermo": {
      icon: "🏕️",
      flavor: '"Qualquer folha pode ser veneno, qualquer galho, uma estaca."',
      stat: "Pragmatismo",
      color: "#d97706",
      colorRgb: "217, 119, 6",
      lore: "Sem armas mágicas, sem arco de ouro. Apenas barbante, veneno extraído de carcaças e engenhosidade. Eles preparam o terreno para matar os inimigos de fome e sangramento.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Aplica veneno e condições de dano prolongado com muito mais eficiência.<br><span style='color: #ef4444;'>✦ Maldição:</span> Dano base direto extremamente baixo; precisa cozinhar o inimigo lentamente.",
      image: "tarot_prof_sobrevivente.jpg",
    },
  },
  Barbaro: {
    "Executor Bestial": {
      icon: "🪓",
      flavor: '"Corta. Quebra. Sangra. Repete."',
      stat: "Brutalidade",
      color: "#991b1b",
      colorRgb: "153, 27, 27",
      lore: "A selvageria em sua forma mais destilada. Executores que empunham os maiores machados já forjados, focados em separar membros do torso.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Dano massivo absoluto; Força e Constituição muito acima do normal.<br><span style='color: #ef4444;'>✦ Maldição:</span> Lento. Você sempre ataca por último, recebendo o golpe primeiro.",
      image: "tarot_prof_executor_bestial.jpg",
    },
    "Devorador de Carniças": {
      icon: "🥩",
      flavor: '"Você é o que você come."',
      stat: "Mutação",
      color: "#86efac",
      colorRgb: "134, 239, 172",
      lore: "Quando não havia comida, você sobreviveu devorando a carne crua dos monstros e da Ruína. Seu corpo se adaptou para extrair vida da própria podridão.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Cura absurda. Cada monstro morto fornece regeneração passiva massiva.<br><span style='color: #ef4444;'>✦ Maldição:</span> Mente degradada. Inteligência reduzida a quase zero e fraco contra magia sagrada.",
      image: "tarot_prof_devorador_carnicas.jpg",
    },
    "Gladiador Esquecido": {
      icon: "🏟️",
      flavor: '"O espetáculo só termina quando alguém para de respirar."',
      stat: "Adrenalina",
      color: "#eab308",
      colorRgb: "234, 179, 8",
      lore: "Lutadores das antigas covas. Eles aprenderam que esquivar no último segundo e contra-atacar era o único jeito de agradar o público sangrento.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Combina a Força Bruta bárbara com Agilidade de evasão.<br><span style='color: #ef4444;'>✦ Maldição:</span> Usa equipamentos improvisados; armaduras quebram mais rápido.",
      image: "tarot_prof_gladiador_esquecido.jpg",
    },
    "Xamã de Sangue": {
      icon: "🩸",
      flavor: '"Meu sangue é a oferenda. Minha ira é o milagre."',
      stat: "Sacrifício",
      color: "#be123c",
      colorRgb: "190, 18, 60",
      lore: "Bárbaros que compreenderam a natureza mística da dor. Eles usam o próprio sofrimento para conjurar maldições físicas nos adversários, pintando as armas com sangue.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> O dano aumenta drasticamente quanto menos HP ele tem.<br><span style='color: #ef4444;'>✦ Maldição:</span> Cura de poções tem 50% de eficácia, forçando-o a beirar a morte sempre.",
      image: "tarot_prof_xama_sangue.jpg",
    },
    "Quebrador de Crânios": {
      icon: "🔨",
      flavor:
        '"Não importa o quão forte seja a magia, a cabeça ainda é frágil."',
      stat: "Concussão",
      color: "#52525b",
      colorRgb: "82, 82, 91",
      lore: "Uma tribo especializada no uso exclusivo de martelos contundentes gigantes, visando destruir a caixa craniana e esmigalhar couraças.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Altíssima chance de Atordoamento (Stun).<br><span style='color: #ef4444;'>✦ Maldição:</span> Precisão terrível. Ataques escorregam muito facilmente de alvos ágeis.",
      image: "tarot_prof_quebrador_cranios.jpg",
    },
  },
  Paladino: {
    "Inquisidor do Sol": {
      icon: "☀️",
      flavor: '"Ajoelhe-se e queime. É para o seu próprio bem."',
      stat: "Julgamento",
      color: "#fcd34d",
      colorRgb: "252, 211, 77",
      lore: "A ala extremista do panteão morto. Inquisidores não usam a luz para confortar, usam-na como um maçarico que purga a heresia. São sádicos disfarçados de santos.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Poderoso bônus de Força misturado com Sabedoria; luz ofuscante cega inimigos.<br><span style='color: #ef4444;'>✦ Maldição:</span> Não possui habilidades de suporte ou cura; focado totalmente na agressão.",
      image: "tarot_prof_inquisidor_sol.jpg",
    },
    "Clérigo de Batalha": {
      icon: "✝️",
      flavor: '"Enquanto eu viver, nenhum de nós cairá."',
      stat: "Devoção",
      color: "#f3f4f6",
      colorRgb: "243, 244, 246",
      lore: "A espinha dorsal das antigas cruzadas. Curandeiros formidáveis que balançam maças pesadas, segurando as linhas de frente com curas constantes.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Cura absurda, maximizando qualquer efeito de regeneração e ganho de constituição.<br><span style='color: #ef4444;'>✦ Maldição:</span> Danos muito baixos. Necessita estender os combates para vencer pelo cansaço.",
      image: "tarot_prof_clerigo_batalha.jpg",
    },
    "Guardião do Juramento": {
      icon: "🛡️",
      flavor: '"Eu sou a última muralha antes do fim."',
      stat: "Baluarte",
      color: "#60a5fa",
      colorRgb: COLOR_BLUE_RGB,
      lore: "A defesa levada ao paroxismo religioso. Eles fazem votos de silêncio e transformam seus corpos em fortalezas absolutas, quase impenetráveis.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> A maior mitigação de danos do jogo. Escala Defesa com Sabedoria.<br><span style='color: #ef4444;'>✦ Maldição:</span> Incapacidade quase total de causar golpes Críticos.",
      image: "tarot_prof_guardiao_juramento.jpg",
    },
    "Templário de Prata": {
      icon: "🗡️",
      flavor: '"A luz viaja rápido. Minha lâmina também."',
      stat: "Zelo",
      color: "#9ca3af",
      colorRgb: "156, 163, 175",
      lore: "Eles largaram os grandes escudos para adotar uma postura ofensiva relâmpago, espalhando a prata derretida pelas lâminas velozes para exterminar horrores rapidamente.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Único paladino que foca em Agilidade. Letal contra mortos-vivos.<br><span style='color: #ef4444;'>✦ Maldição:</span> Constituição pífia comparada a outros paladinos; papel de vidro.",
      image: "tarot_prof_templario_prata.jpg",
    },
    "Exorcista Cego": {
      icon: "🦯",
      flavor: '"Meus olhos falharam, mas a fé enxerga tudo."',
      stat: "Pureza",
      color: "#a78bfa",
      colorRgb: "167, 139, 250",
      lore: "Ao olharem diretamente para o coração da Ruína, perderam a visão. Em troca, receberam o dom de repelir magias nefastas pelo puro som e fé.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Imunidade formidável contra todos os debuffs mágicos e Sabedoria descomunal.<br><span style='color: #ef4444;'>✦ Maldição:</span> Cegueira inata. Erra frequentemente ataques físicos básicos.",
      image: "tarot_prof_exorcista_cego.jpg",
    },
  },
  Necromante: {
    "Mestre de Ossos": {
      icon: "🦴",
      flavor: '"O osso não apodrece, ele aguarda pacientemente."',
      stat: "Estrutura",
      color: "#f8fafc",
      colorRgb: "248, 250, 252",
      lore: "Escultores da morte macabra. Eles extraem o cálcio das vítimas para moldar lanças gigantes e escudos ósseos. Veem a morte através do pragmatismo físico.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Ganho gigantesco de Força e Inteligência juntos. Pode ignorar defesas inimigas.<br><span style='color: #ef4444;'>✦ Maldição:</span> Muito vulnerável a dano de Fogo e ataques contundentes.",
      image: "tarot_prof_mestre_ossos.jpg",
    },
    "Sacerdote da Morte": {
      icon: "🖤",
      flavor: '"A vida é uma doença. Deixe-me curá-lo."',
      stat: "Podridão",
      color: "#4ade80",
      colorRgb: "74, 222, 128",
      lore: "Sacerdotes profanos que substituíram a aura de luz por um miasma pútrido. Eles não invocam esqueletos, eles injetam a própria entropia nos inimigos.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Magias quebram armadura inimiga e transferem HP com eficácia dupla (Sabedoria Alta).<br><span style='color: #ef4444;'>✦ Maldição:</span> Movimentação baixíssima. Não possui habilidades ofensivas diretas.",
      image: "tarot_class_necromancer",
    },
    "Colhedor de Almas": {
      icon: "💀",
      flavor: '"O fio da minha foice é a divisão entre o ser e o nada."',
      stat: "Ceifa",
      color: "#1e293b",
      colorRgb: "30, 41, 59",
      lore: "A personificação da dona Morte nas linhas de frente. Guerreiros mágicos empunhando foices sombrias que decepam a cabeça e a alma com um único golpe rodopiante.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Alta chance de Execução (Morte Instantânea) quando o inimigo estiver enfraquecido.<br><span style='color: #ef4444;'>✦ Maldição:</span> Se não matar no golpe final, recebe grande parte do dano como rebote em si mesmo.",
      image: "tarot_class_necromancer",
    },
    "Coveiro Maldito": {
      icon: "🪦",
      flavor: '"A terra é o único lar permanente de todos nós."',
      stat: "Corrosão",
      color: "#b45309",
      colorRgb: "180, 83, 9",
      lore: "Eles eram coveiros normais antes do apocalipse. Acostumaram-se com a lama, a terra de cemitérios e a podridão constante, desenvolvendo poderes venenosos sem querer.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Mestre em Veneno e doenças (Dano Contínuo). Alta Constituição.<br><span style='color: #ef4444;'>✦ Maldição:</span> Os venenos demoram a fazer efeito. Baixa chance de dano Crítico.",
      image: "tarot_class_necromancer",
    },
    "Ocultista Sombrio": {
      icon: "🌌",
      flavor: '"O vazio não é silencioso. Ele grita o tempo todo."',
      stat: "Abismo",
      color: "#7e22ce",
      colorRgb: "126, 34, 206",
      lore: "Eles mergulharam profundamente nos mistérios do Vácuo, onde nem mesmo a morte governa. A sanidade se foi, sobrando apenas um canal direto para entidades inomináveis.<br><br><span style='color: #4ade80;'>✦ Vantagem Mestra:</span> Dano puramente Profano altíssimo que fura a maioria das proteções.<br><span style='color: #ef4444;'>✦ Maldição:</span> Custo de feitiços drena sanidade (Sorte mínima, propenso a desastres).",
      image: "tarot_class_necromancer",
    },
  },
};

// Estado do ritual
const ritualState = {
  active: false,
  phase: 0,
  selectedRace: null,
  selectedClass: null,
  selectedProfession: null,
  heroName: "",
  embersInterval: null,
};

// ===================== INÍCIO DO RITUAL =====================

function startRitual(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Verifica se há slots vazios antes de permitir o ritual
  const rawData = localStorage.getItem("SANCTUARY_V5");
  if (rawData) {
    try {
      let st = JSON.parse(rawData);
      if (st.appState) st = st.appState;
      if (Array.isArray(st.slots) && st.slots.length >= 3) {
        let hasEmpty = st.slots.some(
          (s) => !s || typeof s !== "object" || !s.name,
        );
        if (!hasEmpty) {
          alert(
            "Seus Registros Akáshicos estão lotados!\n\nVá em Continuar Jornada e exclua uma alma (botão de lixeira vermelha na tela de Saves) antes de criar uma nova.",
          );
          return;
        }
      }
    } catch (err) {
      /* ignore */
    }
  }

  if (ritualState.active) {
    return;
  }
  ritualState.active = true;
  ritualState.phase = 0;
  ritualState.selectedClass = null;
  ritualState.heroName = "";

  const overlay = document.getElementById("ritual-overlay");
  overlay.style.display = "flex";

  // Força reflow antes de aplicar a classe de animação
  void overlay.offsetWidth;

  requestAnimationFrame(() => {
    overlay.classList.add("ritual-active");
  });

  // Iniciar partículas de brasa
  spawnRitualEmbers();

  // Iniciar Fase 1 — Invocação
  setTimeout(() => {
    runInvocationPhase();
  }, 800);
}

// ===================== PARTÍCULAS DE BRASA DO RITUAL =====================

function spawnRitualEmbers() {
  const layer = document.getElementById("ritual-embers");
  if (!layer) {
    return;
  }
  layer.innerHTML = "";

  // Criar 25 partículas com posições e timings aleatórios
  for (let i = 0; i < 25; i++) {
    const ember = document.createElement("div");
    ember.className = "ritual-ember";
    ember.style.left = Math.random() * 100 + "%";
    ember.style.bottom = "-10px";
    ember.style.setProperty("--ember-duration", 3 + Math.random() * 4 + "s");
    ember.style.setProperty("--ember-delay", Math.random() * 5 + "s");
    ember.style.width = 2 + Math.random() * 3 + "px";
    ember.style.height = ember.style.width;
    layer.appendChild(ember);
  }
}

// ===================== FASE 1 — INVOCAÇÃO =====================

function runInvocationPhase() {
  const phase1 = document.getElementById("ritual-phase-1");
  phase1.classList.add(CLASS_PHASE_ACTIVE);

  const narrativeEl = document.getElementById("ritual-narrative-text");
  const sigil = document.getElementById("ritual-sigil");

  // Sequência de runas se iluminando
  const runes = document.querySelectorAll(".rune");
  runes.forEach((r) => {
    r.classList.remove(CLASS_RUNE_LIT, "rune-ignited");
  });

  let runeIdx = 0;
  const runeTimer = setInterval(() => {
    if (runeIdx < runes.length) {
      runes[runeIdx].classList.add(CLASS_RUNE_LIT);
      runeIdx++;
    } else {
      clearInterval(runeTimer);
    }
  }, 350);

  // Texto narrativo com typewriter
  const narrativeTexts = [
    "O véu entre os mundos se rasga...",
    "Uma alma busca despertar no Santuário...",
    "Escolha sua essência, Nephalem.",
  ];

  typewriterSequence(narrativeEl, narrativeTexts, () => {
    // Após narração, sigil brilha
    sigil.classList.add("sigil-awaken");

    // Transição para fase 2
    setTimeout(() => {
      goToPhase(2);
    }, 1200);
  });
}

// ===================== TYPEWRITER ENGINE =====================

function typewriterSequence(element, texts, onComplete) {
  element.classList.add("visible");
  let textIdx = 0;

  function typeNext() {
    if (textIdx >= texts.length) {
      // Remove cursor após completar
      setTimeout(() => {
        const cursor = element.querySelector(".typewriter-cursor");
        if (cursor) {
          cursor.remove();
        }
        if (onComplete) {
          onComplete();
        }
      }, 600);
      return;
    }

    const text = texts[textIdx];
    element.innerHTML = "";
    const span = document.createElement("span");
    element.appendChild(span);
    const cursor = document.createElement("span");
    cursor.className = "typewriter-cursor";
    element.appendChild(cursor);

    let charIdx = 0;
    const typeTimer = setInterval(() => {
      if (charIdx < text.length) {
        span.textContent += text[charIdx];
        charIdx++;
      } else {
        clearInterval(typeTimer);
        textIdx++;
        // Pausa entre frases
        setTimeout(typeNext, 1200);
      }
    }, 45);
  }

  typeNext();
}

// ===================== SISTEMA DE FASES =====================

function goToPhase(targetPhase) {
  // === VALIDAÇÃO PRA EVITAR QUE O JOGADOR PULE AS ETAPAS SEM ESCOLHER ===
  if (
    targetPhase === 3 &&
    ritualState.phase === 2 &&
    !ritualState.selectedRace
  ) {
    alert("Você precisa escolher uma Raça antes de avançar!");
    return;
  }
  if (
    targetPhase === 4 &&
    ritualState.phase === 3 &&
    !ritualState.selectedClass
  ) {
    alert("Você precisa escolher uma Classe antes de avançar!");
    return;
  }
  if (
    targetPhase === 5 &&
    ritualState.phase === 4 &&
    !ritualState.selectedProfession
  ) {
    alert("Você precisa escolher uma Profissão antes de avançar!");
    return;
  }
  if (targetPhase === 6 && ritualState.phase === 5) {
    const input = document.getElementById("hero-name-input");
    if (!input.value || input.value.trim().length === 0) {
      alert("Sua alma precisa de um nome antes de ser cristalizada!");
      return;
    }
  }
  // Esconder fase atual
  const allPhases = document.querySelectorAll(".ritual-phase");
  allPhases.forEach((p) => {
    if (p.classList.contains(CLASS_PHASE_ACTIVE)) {
      p.classList.remove(CLASS_PHASE_ACTIVE);
      p.classList.add(CLASS_PHASE_EXIT);
      setTimeout(() => p.classList.remove(CLASS_PHASE_EXIT), 1000);
    }
  });

  ritualState.phase = targetPhase;

  // Mostrar nova fase após transição
  setTimeout(() => {
    const target = document.getElementById(`ritual-phase-${targetPhase}`);
    if (target) {
      target.classList.add(CLASS_PHASE_ACTIVE);
    }

    // Ações específicas por fase
    if (targetPhase === 2) {
      ritualState.selectedRace = null;
      generateCards(
        RACE_DATABASE,
        "ritual-cards-container-race",
        "selectedRace",
        3,
      );
    } else if (targetPhase === 3) {
      ritualState.selectedClass = null;
      generateCards(
        CLASS_DATABASE,
        "ritual-cards-container-class",
        "selectedClass",
        4,
      );
    } else if (targetPhase === 4) {
      ritualState.selectedProfession = null;
      let cls = ritualState.selectedClass;
      if (cls === "Bárbaro") cls = "Barbaro";
      const classProfessions = PROFESSION_DATABASE[cls] || {};
      generateCards(
        classProfessions,
        ID_CONTAINER_PROF,
        STATE_SELECTED_PROF,
        5,
      );
    } else if (targetPhase === 5) {
      setupBloodPact();
    } else if (targetPhase === 6) {
      setupCrystallization();
    }
  }, 600);
}

// ===================== GERAÇÃO DE CARTAS (RAÇA, CLASSE, PROFISSÃO) =====================

function generateCards(database, containerId, selectionKey, nextPhase) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const suffixMap = {
    selectedRace: "race",
    selectedClass: "class",
    selectedProfession: "prof",
  };
  const suffix = suffixMap[selectionKey];
  const detailBox = document.getElementById(`ritual-detail-${suffix}`);
  if (detailBox) detailBox.style.display = "none";

  const keys = Object.keys(database);

  keys.forEach((key, idx) => {
    const data = database[key];

    const cardWrapper = document.createElement("div");
    cardWrapper.className = "ritual-card-wrapper";
    cardWrapper.style.perspective = "1000px";

    const card = document.createElement("div");
    card.className = "ritual-card card-enter";
    card.style.setProperty("--card-delay", idx * 0.12 + "s");
    card.dataset.id = key;

    // 3D Tilt Logic
    card.addEventListener("mousemove", (e) => {
      if (card.classList.contains("flipped") && ritualState[selectionKey]) {
        return;
      }
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener("mouseleave", () => {
      if (
        card.classList.contains("flipped") &&
        ritualState[selectionKey] === key
      ) {
        card.style.transform = "rotateY(180deg) scale(1.1)";
      } else if (card.classList.contains("flipped")) {
        card.style.transform = "rotateY(180deg)";
      } else {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
      }
    });

    card.onclick = () =>
      selectCard(card, key, selectionKey, nextPhase, containerId, database);

    // Face frontal
    const front = document.createElement("div");
    front.className = "card-face card-front";

    if (data.image) {
      let imgFile = data.image;
      if (!imgFile.includes('.')) imgFile += '.webp';
      front.style.backgroundImage = `url('./assets/tarot/${imgFile}')`;
      front.style.backgroundSize = "cover";
      front.style.backgroundPosition = "center";
      front.style.boxShadow =
        "inset 0 0 60px rgba(0,0,0,0.9), inset 0 0 20px rgba(0,0,0,0.7)";

      // Um leve overlay escuro para manter o clima sombrio
      const overlay = document.createElement("div");
      overlay.style.position = "absolute";
      overlay.style.inset = "0";
      overlay.style.backgroundColor = "rgba(0,0,0,0.15)";
      overlay.style.borderRadius = "inherit";
      front.appendChild(overlay);
    } else {
      const pattern = document.createElement("div");
      pattern.className = "card-front-pattern";
      const symbol = document.createElement("div");
      symbol.className = "card-front-symbol";
      symbol.textContent = "✦";
      pattern.appendChild(symbol);
      front.appendChild(pattern);
    }

    // Face traseira
    const back = document.createElement("div");
    back.className = "card-face card-back";
    back.style.setProperty("--class-color", data.color);
    back.style.setProperty("--class-color-rgb", data.colorRgb);

    const glow = document.createElement("div");
    glow.className = "card-back-glow";
    back.appendChild(glow);

    const icon = document.createElement("div");
    icon.className = "card-icon";
    icon.textContent = data.icon;
    back.appendChild(icon);

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = key === "Barbaro" ? "Bárbaro" : key;
    back.appendChild(title);

    const flavor = document.createElement("div");
    flavor.className = "card-flavor";
    flavor.textContent = data.flavor;
    back.appendChild(flavor);

    const stats = document.createElement("div");
    stats.className = "card-stats";

    if (data.baseAttributes) {
      for (const stat in data.baseAttributes) {
        const sDiv = document.createElement("div");
        sDiv.className = "card-stat-row";
        sDiv.innerHTML = `<span class="stat-name">${stat.toUpperCase()}</span> <span class="stat-val">${data.baseAttributes[stat]}</span>`;
        stats.appendChild(sDiv);
      }
    } else if (data.stat) {
      const sDiv = document.createElement("div");
      sDiv.className = "card-stat-row";
      sDiv.innerHTML = `<span class="stat-name">Traço</span> <span class="stat-val" style="color:${data.color}">${data.stat}</span>`;
      stats.appendChild(sDiv);
    }

    back.appendChild(stats);
    card.appendChild(front);
    card.appendChild(back);

    cardWrapper.appendChild(card);
    container.appendChild(cardWrapper);
  });
}

function selectCard(card, key, selectionKey, nextPhase, containerId, database) {
  playClick();
  if (ritualState[selectionKey]) return;

  card.classList.add("flipped");
  card.classList.add("card-chosen");
  ritualState[selectionKey] = key;

  const container = document.getElementById(containerId);
  const allWrappers = container.querySelectorAll(".ritual-card-wrapper");

  allWrappers.forEach((wrapper) => {
    const c = wrapper.querySelector(".ritual-card");
    c.classList.remove("card-enter"); // Remove a animação que forçava opacity 1
    if (c !== card) {
      wrapper.style.display = "none";
    } else {
      wrapper.style.zIndex = "100";
    }
  });

  const suffixMap = {
    selectedRace: "race",
    selectedClass: "class",
    selectedProfession: "prof",
  };
  const suffix = suffixMap[selectionKey];
  const data = database[key];

  const detailBox = document.getElementById(`ritual-detail-${suffix}`);
  if (detailBox && data) {
    const titleEl = document.getElementById(`ritual-detail-title-${suffix}`);
    if (titleEl) {
      titleEl.textContent = key;
      titleEl.style.color = data.color;
    }
    const descEl = document.getElementById(`ritual-detail-desc-${suffix}`);
    if (descEl) {
      descEl.innerHTML = `"${data.flavor}"<br><br>${data.lore}`;
    }

    setTimeout(() => {
      detailBox.style.display = "block";
      detailBox.style.animation = "cardAppear 0.8s ease forwards";
    }, 600);

    // Lógica para cancelar seleção ao clicar fora
    const cancelSelection = (e) => {
      // IMPORTANTE: Se o jogador já mudou de fase, esse listener é obsoleto e não deve anular a escolha
      const expectedPhase = parseInt(nextPhase) - 1;
      if (ritualState.phase !== expectedPhase) {
        document.removeEventListener("mousedown", cancelSelection);
        return;
      }

      // Ignora cliques dentro da caixa de detalhes ou no próprio cartão
      if (detailBox.contains(e.target) || card.contains(e.target)) return;

      playClick(); // Efeito sonoro
      ritualState[selectionKey] = null;
      card.classList.remove("flipped", "card-chosen");

      allWrappers.forEach((wrapper) => {
        wrapper.style.display = "";
        wrapper.style.zIndex = "";
      });

      detailBox.style.display = "none";
      detailBox.style.animation = "";

      document.removeEventListener("mousedown", cancelSelection);
    };

    setTimeout(() => {
      document.addEventListener("mousedown", cancelSelection);
    }, 100);
  }
}


// ===================== FASE 5 — PACTO DE SANGUE =====================

function setupBloodPact() {
  const raceData = RACE_DATABASE[ritualState.selectedRace];
  const classData = CLASS_DATABASE[ritualState.selectedClass];

  let cls = ritualState.selectedClass;
  if (cls === "Bárbaro") cls = "Barbaro";
  const profData = PROFESSION_DATABASE[cls]?.[ritualState.selectedProfession];

  if (!raceData || !classData || !profData) {
    return;
  }

  document.getElementById("pact-race-icon").textContent = raceData.icon;
  document.getElementById("pact-race-name").textContent =
    ritualState.selectedRace;
  document.getElementById("pact-race-name").style.color = raceData.color;

  document.getElementById("pact-class-icon").textContent = classData.icon;
  document.getElementById("pact-class-name").textContent =
    ritualState.selectedClass === "Barbaro"
      ? "Bárbaro"
      : ritualState.selectedClass;
  document.getElementById("pact-class-name").style.color = classData.color;

  document.getElementById("pact-prof-icon").textContent = profData.icon;
  document.getElementById("pact-prof-name").textContent =
    ritualState.selectedProfession;
  document.getElementById("pact-prof-name").style.color = profData.color;

  const nameInput = document.getElementById("hero-name-input");
  nameInput.value = ritualState.heroName || "";
  setTimeout(() => nameInput.focus(), 500);

  nameInput.oninput = () => {
    const val = nameInput.value;
    ritualState.heroName = val;
    const echo = document.getElementById("name-rune-echo");

    if (val.length > 0) {
      const runeMap = "ᚨᛒᚦᛗᚹᛞᛃᛟᚢᛊᛏᛚᛝᛖᚱᛉᛈᚺᚻᛜ";
      let runeText = "";
      for (let i = 0; i < val.length; i++) {
        runeText += runeMap[i % runeMap.length];
      }
      echo.textContent = runeText;
      echo.classList.add("has-text");

      const runes = document.querySelectorAll(".rune");
      runes.forEach((r, idx) => {
        if (idx < val.length) {
          r.classList.add("rune-ignited");
        } else {
          r.classList.remove("rune-ignited");
        }
      });
    } else {
      echo.textContent = "";
      echo.classList.remove("has-text");
      document
        .querySelectorAll(".rune")
        .forEach((r) => r.classList.remove("rune-ignited"));
    }
  };

  nameInput.onkeydown = (e) => {
    if (e.key === "Enter" && nameInput.value.trim().length > 0) {
      goToPhase(6);
    }
  };
}

// ===================== FASE 6 — CRISTALIZAÇÃO =====================

function setupCrystallization() {
  const classData = CLASS_DATABASE[ritualState.selectedClass];
  if (!classData) {
    return;
  }

  const heroName = ritualState.heroName.trim() || "Alma Sem Nome";
  ritualState.heroName = heroName;

  document.getElementById("crystal-icon").textContent = classData.icon;
  document.getElementById("crystal-name").textContent = heroName;

  const crystalClass = document.getElementById("crystal-class-full");
  const displayClass =
    ritualState.selectedClass === "Barbaro"
      ? "Bárbaro"
      : ritualState.selectedClass;
  crystalClass.textContent = `${ritualState.selectedRace} | ${displayClass} | ${ritualState.selectedProfession}`;
  crystalClass.style.color = classData.color;
  crystalClass.style.setProperty("--class-color", classData.color);

  document.getElementById("crystal-lore").innerHTML = classData.lore;

  document.getElementById("ritual-final-msg").classList.remove("visible");
  document.getElementById("btn-seal-pact").style.display = "";
  document.querySelector("#ritual-phase-6 > div:last-of-type").style.display =
    "";
}

// ===================== SELAR O PACTO (CONFIRMAÇÃO FINAL) =====================

function sealThePact() {
  playClick();
  const heroName = ritualState.heroName;

  document.getElementById("btn-seal-pact").style.display = "none";
  const btnContainer = document.querySelector(
    "#ritual-phase-6 > div:last-of-type",
  );
  if (btnContainer) {
    btnContainer.style.display = "none";
  }

  const flash = document.getElementById("ritual-flash");
  flash.classList.add("flash-active");
  setTimeout(() => flash.classList.remove("flash-active"), 2200);

  document.querySelectorAll(".rune").forEach((r) => {
    r.classList.add("rune-ignited");
  });

  saveRitualResult(
    heroName,
    ritualState.selectedClass,
    ritualState.selectedRace,
    ritualState.selectedProfession,
  );

  setTimeout(() => {
    const displayClass =
      ritualState.selectedClass === "Barbaro"
        ? "Bárbaro"
        : ritualState.selectedClass;
    document.getElementById("final-awaken-text").textContent =
      `${heroName}, ${displayClass} da raça ${ritualState.selectedRace} — seu despertar está completo.`;
    document.getElementById("ritual-final-msg").classList.add("visible");
  }, 1500);

  setTimeout(() => {
    window.location.href = "Jogo.html?v=" + Date.now();
  }, 5000);
}

// ===================== SALVAR RESULTADO =====================

async function saveRitualResult(name, className, raceName, professionName) {
  try {
    const ritualData = {
      name: name,
      class: className,
      race: raceName,
      profession: professionName,
    };

    // Deixa o main.js criar o herói novo e dar o POST
    localStorage.setItem(
      "SANCTUARY_RITUAL_PENDING",
      JSON.stringify(ritualData),
    );
    console.log(
      `%c[RITUAL] Alma cristalizada (Aguardando POST no Jogo.html): ${name} (${raceName}, ${className}, ${professionName})`,
      "color: #fbbf24; font-size: 14px;",
    );
  } catch (e) {
    console.error("Erro ao salvar ritual:", e);
  }
}

// ===================== CANCELAR / FECHAR RITUAL =====================

function cancelRitual() {
  playClick();
  closeRitual();
}

function closeRitual() {
  const overlay = document.getElementById("ritual-overlay");
  overlay.classList.add("ritual-closing");

  setTimeout(() => {
    overlay.classList.remove("ritual-active", "ritual-closing");
    overlay.style.display = "none";

    document.querySelectorAll(".ritual-phase").forEach((p) => {
      p.classList.remove(CLASS_PHASE_ACTIVE, CLASS_PHASE_EXIT);
    });

    document.querySelectorAll(".rune").forEach((r) => {
      r.classList.remove(CLASS_RUNE_LIT, "rune-ignited");
    });

    const sigil = document.getElementById("ritual-sigil");
    if (sigil) {
      sigil.classList.remove("sigil-awaken");
    }

    const narrative = document.getElementById("ritual-narrative-text");
    if (narrative) {
      narrative.innerHTML = "";
      narrative.classList.remove("visible");
    }

    const cRace = document.getElementById("ritual-cards-container-race");
    if (cRace) {
      cRace.innerHTML = "";
    }
    const cClass = document.getElementById("ritual-cards-container-class");
    if (cClass) {
      cClass.innerHTML = "";
    }
    const cProf = document.getElementById(ID_CONTAINER_PROF);
    if (cProf) {
      cProf.innerHTML = "";
    }

    ritualState.active = false;
    ritualState.phase = 0;
    ritualState.selectedRace = null;
    ritualState.selectedClass = null;
    ritualState.selectedProfession = null;
    ritualState.heroName = "";

    const embersLayer = document.getElementById("ritual-embers");
    if (embersLayer) {
      embersLayer.innerHTML = "";
    }
  }, 1200);
}

// =========================================================================
//  VITE ES6 MODULE GLOBAL BINDINGS
// =========================================================================
window.showCredits = showCredits;
window.hideCredits = hideCredits;
window.eatCoxinha = eatCoxinha;
window.playClick = playClick;
window.toggleMusic = toggleMusic;
window.triggerTitleEgg = triggerTitleEgg;
window.loadLastSaveInfo = loadLastSaveInfo;
window.fadeInMusic = fadeInMusic;
window.runCinematicIntro = runCinematicIntro;
window.spawnEmbers = spawnEmbers;

// Ritual bindings
window.startRitual = startRitual;
window.cancelRitual = cancelRitual;
window.goToPhase = goToPhase;
window.sealThePact = sealThePact;
