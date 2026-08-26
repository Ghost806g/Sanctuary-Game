/* eslint-disable sonarjs/cognitive-complexity */
import {
  initGemini,
  fetchFullMobLore,
  fetchDynamicDiaryEntry,
  fetchDynamicFusion,
} from "./services/aiService.js";
window.fetchDynamicDiaryEntry = fetchDynamicDiaryEntry;
window.fetchDynamicFusion = fetchDynamicFusion;
import {
  initThreeBook,
  buildThreeBook,
  openThreeBook,
  closeThreeBook,
  turnThreePage,
  updatePageTexture,
} from "./threeBook.js";

initGemini(import.meta.env.VITE_GEMINI_API_KEY);
setTimeout(() => initThreeBook(), 100);

// --- BANCO DE DADOS (Modelo Lógico Simples) ---
// Aqui você controla todo o conteúdo das 3 abas
const LORE_DB = {
  locations: [
    {
      id: "catacumbas",
      name: "Catacumbas Sombrias",
      biome: "Catacumbas Sombrias",
      level: "Nível 1 - 5",
      x: 20,
      y: 75,
      desc: "Labirintos de pedra úmida onde ecos de prisioneiros mortos nunca cessam. Ratos gigantes e guardas esqueléticos vigiam a entrada para as profundezas.",
      icon: "🪦",
      connects: ["pantano"],
    },
    {
      id: "pantano",
      name: "Pântano da Peste",
      biome: "Pântano da Peste",
      level: "Nível 6 - 10",
      x: 35,
      y: 55,
      desc: "Águas venenosas e árvores podres abrigam cultistas sombrios e bestas deformadas. A bruxa Vex governa os lodos corrosivos.",
      icon: "🌲",
      connects: ["catacumbas", "forja", "floresta"],
    },
    {
      id: "forja",
      name: "Forja Profana do Abismo",
      biome: "Forja Profana do Abismo",
      level: "Nível 11 - 15",
      x: 25,
      y: 30,
      desc: "O calor derrete armaduras e espadas. Demônios operam forjas alimentadas por magma e ossos para o Senhor da Forja.",
      icon: "🌋",
      connects: ["pantano", "magma"],
    },
    {
      id: "magma",
      name: "Cavernas de Magma",
      biome: "Cavernas de Magma",
      level: "Nível 16 - 20",
      x: 45,
      y: 15,
      desc: "O coração incandescente da montanha. Habitado por elementais e protegidos pelo jovem dragão que nunca dorme.",
      icon: "🐉",
      connects: ["forja", "cristal"],
    },
    {
      id: "floresta",
      name: "Floresta das Sombras",
      biome: "Floresta das Sombras",
      level: "Nível 21 - 25",
      x: 65,
      y: 65,
      desc: "Uma floresta negra onde a luz não penetra. Kobolds furtivos armam emboscadas sob o comando do brutal Rei Illfang.",
      icon: "🌑",
      connects: ["pantano", "eclipse"],
    },
    {
      id: "cristal",
      name: "Abismo de Cristal",
      biome: "Abismo de Cristal",
      level: "Nível 26 - 30",
      x: 75,
      y: 25,
      desc: "Galerias congeladas de brilho cegante. O frio extremo drena a força vital de quem se aproxima do lar do Dragão Branco.",
      icon: "💎",
      connects: ["magma", "eclipse"],
    },
    {
      id: "eclipse",
      name: "Corredores do Eclipse",
      biome: "Corredores do Eclipse",
      level: "Nível 31 - 35+",
      x: 80,
      y: 45,
      desc: "A antessala do mal supremo. Realidade se distorce enquanto cultistas e cavaleiros corrompidos guardam o portão demoníaco.",
      icon: "⚔️",
      connects: ["floresta", "cristal"],
    },
  ],
  bestiary: [
    {
      id: "rato_mutante",
      gameKey: "Rato Mutante",
      biome: "Catacumbas Sombrias",
      category: "monster",
      name: "Rato Mutante",
      abates: 0,
      lore: "Roedor corroído pelos ventos sombrios das profundezas, sua mordida é pequena, mas carregada de toxinas.",
      status: { hp: "45", atk: "8", def: "5" },
      passivas: ["Pequeno e Escorregadio"],
      anatomia: {
        req: 5,
        texto:
          "Dentição afiada e circulação acelerada fazem dele uma presa difícil de acertar.",
      },
      fraqueza: { req: 15, texto: "Muito fraco a golpes cortantes e sal." },
    },
    {
      id: "esqueleto_guarda",
      gameKey: "Esqueleto de Guarda",
      biome: "Catacumbas Sombrias",
      category: "monster",
      name: "Esqueleto de Guarda",
      abates: 0,
      lore: "Antigos soldados esqueléticos que ainda guardam corredores esquecidos com armaduras manchadas.",
      status: { hp: "65", atk: "12", def: "15" },
      passivas: ["ossos resistentes"],
      anatomia: {
        req: 10,
        texto:
          "Estrutura óssea reforçada e massa compacta conferem alta resistência física.",
      },
      fraqueza: {
        req: 25,
        texto: "Vulnerável a magia sagrada e ataques perfurantes.",
      },
    },
    {
      id: "zumbi_putrefo",
      gameKey: "Zumbi Putrefo",
      biome: "Catacumbas Sombrias",
      category: "monster",
      name: "Zumbi Putrefo",
      abates: 0,
      lore: "Corpo em decomposição, movido apenas pelo desejo de arrastar vítimas para as sombras.",
      status: { hp: "80", atk: "10", def: "10" },
      passivas: ["resistência mórbida"],
      anatomia: {
        req: 10,
        texto:
          "Carnes necrosadas e tendões rígidos escondem músculos endurecidos.",
      },
      fraqueza: {
        req: 30,
        texto: "Extremamente suscetível a fogo e lâminas afiadas.",
      },
    },
    {
      id: "dulahn_algoz",
      gameKey: "Dulahn, O Algoz Decapitado",
      biome: "Catacumbas Sombrias",
      category: "elite",
      name: "Dulahn, O Algoz Decapitado",
      abates: 0,
      lore: "Elite amaldiçoado que se regenera com cada gota de sangue derramada.",
      status: { hp: "160", atk: "22", def: "25" },
      passivas: ["roubo de vida", "atordoamento imune"],
      anatomia: {
        req: 25,
        texto:
          "A cabeça perdida parece guardar o núcleo de sua fúria. Seus músculos ainda contraem com precisão mortal.",
      },
      fraqueza: {
        req: 50,
        texto:
          "Ataques sagrados e dragões de gelo enfraquecem sua regeneração.",
      },
    },
    {
      id: "lorde_necromante_do_abismo",
      gameKey: "☠️ Lorde Necromante",
      biome: "Catacumbas Sombrias",
      category: "boss",
      name: "Lorde Necromante",
      abates: 0,
      lore: "Tudo o que resta desta abadia é um feérico feitiço de morte, alimentado pela carne dos condenados.",
      status: { hp: "300", atk: "28", def: "70" },
      passivas: ["maldição", "barreira profana"],
      anatomia: {
        req: 50,
        texto:
          "Os ossos do Necromante são incrustados em runas profanas que reforçam sua defesa.",
      },
      fraqueza: {
        req: 100,
        texto:
          "Fragmentos de fé e gelo são seus únicos verdadeiros antagonistas.",
      },
    },
    {
      id: "sapo_demoníaco",
      gameKey: "Sapo Demoníaco",
      biome: "Pântano da Peste",
      category: "monster",
      name: "Sapo Demoníaco",
      abates: 0,
      lore: "Criatura pestilenta que exala veneno antes de saltar até seus inimigos.",
      status: { hp: "120", atk: "22", def: "12" },
      passivas: ["pele tóxica"],
      anatomia: {
        req: 10,
        texto:
          "A pele é coberta por glândulas venenosas que inflamam com o contato.",
      },
      fraqueza: {
        req: 30,
        texto: "Fogo seco e cortes profundos rompem suas defesas.",
      },
    },
    {
      id: "cultista_lodo",
      gameKey: "Cultista do Lodo",
      biome: "Pântano da Peste",
      category: "monster",
      name: "Cultista do Lodo",
      abates: 0,
      lore: "Corrompidos pela lama, cultistas voam ao redor de runas tóxicas para amaldiçoar quem passa.",
      status: { hp: "100", atk: "28", def: "8" },
      passivas: ["magia sombria"],
      anatomia: {
        req: 15,
        texto:
          "A carne é fina, mas o metal encharcado de lama ainda corta profundamente.",
      },
      fraqueza: {
        req: 30,
        texto: "Vocês pode quebrar seu foco com ataques rápidos e precisos.",
      },
    },
    {
      id: "lodo_acido",
      gameKey: "Lodo Ácido",
      biome: "Pântano da Peste",
      category: "monster",
      name: "Lodo Ácido",
      abates: 0,
      lore: "Um monstro amorfo composto por substâncias corrosivas e vísceras retorcidas.",
      status: { hp: "160", atk: "18", def: "25" },
      passivas: ["corrosão"],
      anatomia: {
        req: 20,
        texto: "Sua membrana viscosa dissolve metal e carne lentamente.",
      },
      fraqueza: {
        req: 45,
        texto:
          "Fogo intenso e ataques contundentes fazem com que ele se desfaça.",
      },
    },
    {
      id: "vex_bruxa",
      gameKey: "Vex, A Bruxa do Pântano",
      biome: "Pântano da Peste",
      category: "elite",
      name: "Vex, A Bruxa do Pântano",
      abates: 0,
      lore: "Encantadora de pântanos que manipula miasmas e prende as almas dos desavisados.",
      status: { hp: "250", atk: "35", def: "20" },
      passivas: ["hex", "magia aguçada"],
      anatomia: {
        req: 40,
        texto: "Seus nervos fermentados convertem dor em energia arcana.",
      },
      fraqueza: { req: 70, texto: "Ataques físicos quebram seu foco sombrio." },
    },
    {
      id: "hidra_corrompida",
      gameKey: "☠️ Hidra Corrompida",
      biome: "Pântano da Peste",
      category: "boss",
      name: "Hidra Corrompida",
      abates: 0,
      lore: "Monstro de múltiplas cabeças cujo sangue ácido dissolveria a própria rocha.",
      status: { hp: "600", atk: "45", def: "90" },
      passivas: ["sangue ácido", "regeneração reptiliana"],
      anatomia: {
        req: 55,
        texto:
          "Cada cabeça pulsa como serpente independente, pronta para atacar em avanços sincronizados.",
      },
      fraqueza: {
        req: 100,
        texto: "Corte profundo e fogo burilam sua pele espessa.",
      },
    },
    {
      id: "diabrete_ferreiro",
      gameKey: "Diabrete Ferreiro",
      biome: "Forja Profana do Abismo",
      category: "monster",
      name: "Diabrete Ferreiro",
      abates: 0,
      lore: "Criatura infernal forjada entre martelos e chamas, seu golpe derruba os mais valentes.",
      status: { hp: "220", atk: "45", def: "20" },
      passivas: ["crítico feroz"],
      anatomia: {
        req: 35,
        texto:
          "Músculos endurecidos pelo calor o lançam em violentos golpes de martelo.",
      },
      fraqueza: { req: 60, texto: "Aço frio acalma seu ímpeto incandescente." },
    },
    {
      id: "golem_magma",
      gameKey: "Golem de Magma",
      biome: "Forja Profana do Abismo",
      category: "monster",
      name: "Golem de Magma",
      abates: 0,
      lore: "Corpo de rocha derretida e aço, imune a chamas comuns e resistente ao impacto.",
      status: { hp: "400", atk: "30", def: "50" },
      passivas: ["imunidade a fogo"],
      anatomia: {
        req: 45,
        texto:
          "Suas placas são feitas de lava solidificada; quebra-las libera explosões internas.",
      },
      fraqueza: {
        req: 75,
        texto: "Água gelada e gelo extraem seu calor vital.",
      },
    },
    {
      id: "sucubo_torturadora",
      gameKey: "Súcubo Torturadora",
      biome: "Forja Profana do Abismo",
      category: "monster",
      name: "Súcubo Torturadora",
      abates: 0,
      lore: "Seduz e dilacera com igual prazer, seus ataques desconsideram a proteção inimiga.",
      status: { hp: "190", atk: "55", def: "15" },
      passivas: ["perfuração de armadura"],
      anatomia: {
        req: 35,
        texto: "Suas garras cortantes se dobram em ângulos impossíveis.",
      },
      fraqueza: {
        req: 65,
        texto: "O contra-ataque rápido é a melhor defesa contra sua fúria.",
      },
    },
    {
      id: "ignis_arauto",
      gameKey: "Ignis, O Arauto das Chamas",
      biome: "Forja Profana do Abismo",
      category: "elite",
      name: "Ignis, O Arauto das Chamas",
      abates: 0,
      lore: "Força flamejante que incendeia o solo a cada passo, espalhando caos em ondas de calor.",
      status: { hp: "500", atk: "65", def: "40" },
      passivas: ["aura incandescente"],
      anatomia: {
        req: 60,
        texto: "Corpus ígneo onde chamas fervem sob escamas derretidas.",
      },
      fraqueza: {
        req: 90,
        texto: "Ataques frios quebram sua energia flamejante.",
      },
    },
    {
      id: "senhor_da_forja",
      gameKey: "☠️ Senhor da Forja",
      biome: "Forja Profana do Abismo",
      category: "boss",
      name: "Senhor da Forja",
      abates: 0,
      lore: "Soberano dos metais em chamas, sua presença distorce a própria gravidade do ferro.",
      status: { hp: "1200", atk: "75", def: "150" },
      passivas: ["armadura implacável", "golpe atordoante"],
      anatomia: {
        req: 80,
        texto:
          "Sua carapaça metálica é fundida a runas antigas. Somente ataques místicos penetram-na.",
      },
      fraqueza: {
        req: 120,
        texto: "Impactos fortes e magia sagrada são seus maiores adversários.",
      },
    },
    {
      id: "lagarto_lava",
      gameKey: "Lagarto de Lava",
      biome: "Cavernas de Magma",
      category: "monster",
      name: "Lagarto de Lava",
      abates: 0,
      lore: "Rasteja entre chamas e pedras incandescentes, espalhando brasas com cada movimento.",
      status: { hp: "110", atk: "15", def: "12" },
      passivas: ["calor latente"],
      anatomia: {
        req: 25,
        texto: "Escamas incandescentes se curvam para proteger órgãos vitais.",
      },
      fraqueza: { req: 45, texto: "Ataques frios tornam-no rígido e lento." },
    },
    {
      id: "cao_infernal",
      gameKey: "Cão Infernal",
      biome: "Cavernas de Magma",
      category: "monster",
      name: "Cão Infernal",
      abates: 0,
      lore: "Canino flamejante que persegue sem cessar, sua mordida incinera a carne.",
      status: { hp: "130", atk: "25", def: "20" },
      passivas: ["mordida ardente"],
      anatomia: {
        req: 35,
        texto: "Mandíbulas de magma puro com músculos de obsidiana.",
      },
      fraqueza: {
        req: 55,
        texto: "Ataques ágeis e frios o desaceleram rapidamente.",
      },
    },
    {
      id: "salamandra_obsidiana",
      gameKey: "Salamandra de Obsidiana",
      biome: "Cavernas de Magma",
      category: "monster",
      name: "Salamandra de Obsidiana",
      abates: 0,
      lore: "Criatura de cia, sua pele é dura como pedra negra e suas garras cortam como lâminas.",
      status: { hp: "150", atk: "20", def: "60" },
      passivas: ["escamas duras"],
      anatomia: {
        req: 40,
        texto:
          "Escamas cristalizadas protegem seus órgãos. Perfurá-las é doloroso.",
      },
      fraqueza: {
        req: 70,
        texto: "Ataques concentrados nas juntas provocam fissuras.",
      },
    },
    {
      id: "elementar_fogo",
      gameKey: "Elementar de Fogo",
      biome: "Cavernas de Magma",
      category: "monster",
      name: "Elementar de Fogo",
      abates: 0,
      lore: "Fagulhas vivas que se aglomeram em uma forma fluida e feroz.",
      status: { hp: "90", atk: "18", def: "8" },
      passivas: ["queimadura"],
      anatomia: {
        req: 20,
        texto: "Sua essência é pura chama, difícil de conter com armas comuns.",
      },
      fraqueza: { req: 40, texto: "Gelo e água dispersam sua forma instável." },
    },
    {
      id: "diabrete_flamejante",
      gameKey: "Diabrete Flamejante",
      biome: "Cavernas de Magma",
      category: "monster",
      name: "Diabrete Flamejante",
      abates: 0,
      lore: "Pequeno demônio flamejante que se move rápido e ataca com baforadas ardentes.",
      status: { hp: "75", atk: "22", def: "12" },
      passivas: ["explosão de sangue"],
      anatomia: {
        req: 25,
        texto:
          "Suas chamas internas crepitam, aumentando o calor de seus ataques.",
      },
      fraqueza: {
        req: 50,
        texto: "Extremamente vulnerável a água e golpes precisos.",
      },
    },
    {
      id: "esqueleto_carbonizado",
      gameKey: "Esqueleto Carbonizado",
      biome: "Cavernas de Magma",
      category: "monster",
      name: "Esqueleto Carbonizado",
      abates: 0,
      lore: "Restos de um guerreiro carbonizado que se levanta com chamas negras a percorrer seus ossos.",
      status: { hp: "100", atk: "28", def: "10" },
      passivas: ["chama negra"],
      anatomia: {
        req: 30,
        texto:
          "Seu esqueleto está coberto por carvão incandescente e teias de fogo.",
      },
      fraqueza: {
        req: 55,
        texto: "Água fria e gelo drenam rapidamente seu calor vital.",
      },
    },
    {
      id: "dragon_filhote",
      gameKey: "☠️ Dragão Filhote",
      biome: "Cavernas de Magma",
      category: "boss",
      name: "Dragão Filhote",
      abates: 0,
      lore: "Filhote ancestral que solta chamas vermelhas e encara qualquer intruso com fúria juvenil.",
      status: { hp: "450", atk: "35", def: "90" },
      passivas: ["sopro de fogo", "escamas incandescentes"],
      anatomia: {
        req: 60,
        texto:
          "Suas escamas negras cintilam com magma vivo; ataques então se refletem em chamas.",
      },
      fraqueza: {
        req: 100,
        texto:
          "Ataques de gelo profundo e empurrões bruscos abalam seu equilíbrio.",
      },
    },
    {
      id: "lobo_ruina",
      gameKey: "Lobo da Ruína",
      biome: "Floresta das Sombras",
      category: "monster",
      name: "Lobo da Ruína",
      abates: 0,
      lore: "Predador fantasmagórico que se mistura com a névoa preta do bosque.",
      status: { hp: "85", atk: "14", def: "8" },
      passivas: ["ataque furtivo"],
      anatomia: {
        req: 20,
        texto: "Músculos ágeis e olfato apurado tornam-no letal em emboscadas.",
      },
      fraqueza: {
        req: 40,
        texto: "Luzes fortes e ataques à distância desequilibram-no.",
      },
    },
    {
      id: "sentinela_kobold",
      gameKey: "Sentinela Kobold",
      biome: "Floresta das Sombras",
      category: "monster",
      name: "Sentinela Kobold",
      abates: 0,
      lore: "Guarda tribal armado com lanças envenenadas e armaduras leves.",
      status: { hp: "130", atk: "12", def: "10" },
      passivas: ["veneno pontiagudo"],
      anatomia: {
        req: 25,
        texto:
          "Pele escamosa e estrutura esguia permitem ataques rápidos do alto.",
      },
      fraqueza: {
        req: 45,
        texto: "Ataques pesados quebram sua formação defensiva.",
      },
    },
    {
      id: "pequena_nepenthes",
      gameKey: "Pequena Nepenthes",
      biome: "Floresta das Sombras",
      category: "monster",
      name: "Pequena Nepenthes",
      abates: 0,
      lore: "Planta carnívora animada que esmaga e suga a vida de suas presas.",
      status: { hp: "90", atk: "18", def: "12" },
      passivas: ["sucção de vida"],
      anatomia: {
        req: 25,
        texto: "Folhas pegajosas prendem o corpo e liberam toxinas.",
      },
      fraqueza: {
        req: 45,
        texto: "Fogo e cortes rápidos rompem suas pétalas resistentes.",
      },
    },
    {
      id: "madeira_viva",
      gameKey: "Madeira Viva",
      biome: "Floresta das Sombras",
      category: "elite",
      name: "Madeira Viva",
      abates: 0,
      lore: "Espírito arbóreo animado, punhando raízes afiadas contra invasores.",
      status: { hp: "100", atk: "15", def: "10" },
      passivas: ["enraizamento"],
      anatomia: {
        req: 30,
        texto:
          "Sua casca viva se contorce, prendendo qualquer intruso que se aproxime.",
      },
      fraqueza: {
        req: 60,
        texto: "Fogo e lâminas cortantes quebram suas fibras vegetais.",
      },
    },
    {
      id: "illfang_rei_kobold",
      gameKey: "☠️ Illfang, o Rei Kobold",
      biome: "Floresta das Sombras",
      category: "boss",
      name: "Illfang, o Rei Kobold",
      abates: 0,
      lore: "Líder guerreiro de seus kobolds, governa a floresta com estratégia e lâmina afiada.",
      status: { hp: "600", atk: "55", def: "200" },
      passivas: ["troca de arma", "imunidade a gelo"],
      anatomia: {
        req: 70,
        texto:
          "Seu corpo está acostumado a golpes, e seus reflexos são quase inumanos.",
      },
      fraqueza: {
        req: 110,
        texto: "Alvos rápidos e ataques de gelo são sua maior ameaça.",
      },
    },
    {
      id: "elemental_gelo",
      gameKey: "Elemental de Gelo",
      biome: "Abismo de Cristal",
      category: "monster",
      name: "Elemental de Gelo",
      abates: 0,
      lore: "Ser gelado que nasce nas cavernas de cristais, cortante e impiedoso.",
      status: { hp: "150", atk: "20", def: "10" },
      passivas: ["frio cortante"],
      anatomia: {
        req: 30,
        texto: "Seu corpo gelado reflete luz e impede aproximações abruptas.",
      },
      fraqueza: {
        req: 55,
        texto: "Impactos fortes e calor intenso o quebram.",
      },
    },
    {
      id: "morcego_cristal",
      gameKey: "Morcego de Cristal",
      biome: "Abismo de Cristal",
      category: "monster",
      name: "Morcego de Cristal",
      abates: 0,
      lore: "Voa nas galerias cristalinas cuspindo fragmentos cortantes.",
      status: { hp: "70", atk: "28", def: "8" },
      passivas: ["ataques cortantes"],
      anatomia: {
        req: 20,
        texto: "As asas são lâminas vivas feitas de vidro congelado.",
      },
      fraqueza: {
        req: 40,
        texto: "Fogo derrete seu casco e o deixa vulnerável.",
      },
    },
    {
      id: "golem_prata",
      gameKey: "Golem de Prata",
      biome: "Abismo de Cristal",
      category: "elite",
      name: "Golem de Prata",
      abates: 0,
      lore: "Constructo de prata pura com reflexos de escudo, difícil de penetrar.",
      status: { hp: "200", atk: "15", def: "80" },
      passivas: ["bloqueio cristalino"],
      anatomia: {
        req: 40,
        texto:
          "Suas juntas metálicas absorvem impactos que dariam fim a inimigos comuns.",
      },
      fraqueza: {
        req: 65,
        texto: "Ataques elétricos e magias de choque quebram seu núcleo.",
      },
    },
    {
      id: "xraphan_dragao_branco",
      gameKey: "☠️ X'rphan, o Dragão Branco",
      biome: "Abismo de Cristal",
      category: "boss",
      name: "X'rphan, o Dragão Branco",
      abates: 0,
      lore: "Dragão ancestral que guarda o cristal eterno com olhos gelados e espírito indomável.",
      status: { hp: "900", atk: "50", def: "400" },
      passivas: ["sopro congelante", "pele de diamante"],
      anatomia: {
        req: 90,
        texto: "Escamas de diamante formam uma couraça quase impenetrável.",
      },
      fraqueza: {
        req: 130,
        texto: "Ataques massivos e magia flamejante podem rachar sua carapaça.",
      },
    },
    {
      id: "cavaleiro_caido",
      gameKey: "Cavaleiro Caído",
      biome: "Corredores do Eclipse",
      category: "monster",
      name: "Cavaleiro Caído",
      abates: 0,
      lore: "Espírito guerreiro preso à armadura quebrada, ainda luta com honra maculada.",
      status: { hp: "220", atk: "30", def: "20" },
      passivas: ["juízo pesado"],
      anatomia: {
        req: 50,
        texto: "Sua armadura pesada absorve impactos, mas o torna lento.",
      },
      fraqueza: {
        req: 80,
        texto: "Ataques rápidos e magia cortante desgastam a couraça.",
      },
    },
    {
      id: "gargula_obsidiana",
      gameKey: "Gárgula de Obsidiana",
      biome: "Corredores do Eclipse",
      category: "monster",
      name: "Gárgula de Obsidiana",
      abates: 0,
      lore: "Estátua viva feita de pedra negra, capaz de lançar-se como uma flecha contra o alvo.",
      status: { hp: "180", atk: "35", def: "30" },
      passivas: ["queda mortal"],
      anatomia: {
        req: 45,
        texto: "Seu corpo pesado e pontiagudo é ideal para ataques surpresa.",
      },
      fraqueza: {
        req: 75,
        texto: "Tiros de precisão e choques elétricos quebram sua postura.",
      },
    },
    {
      id: "cultista_sombras",
      gameKey: "Cultista das Sombras",
      biome: "Corredores do Eclipse",
      category: "elite",
      name: "Cultista das Sombras",
      abates: 0,
      lore: "Mago sinistro que drena vida através de feitiços sombrios e furtivos.",
      status: { hp: "140", atk: "45", def: "12" },
      passivas: ["dreno vital"],
      anatomia: {
        req: 45,
        texto: "Seu corpo magro é sustentado por sangue roubado de cavernas.",
      },
      fraqueza: {
        req: 80,
        texto: "Silêncio e quebra de concentração detêm seu ritual.",
      },
    },
    {
      id: "eclipse_lord_1783707318854",
      gameKey: "☠️ The Gleam Eyes",
      biome: "Corredores do Eclipse",
      category: "boss",
      name: "The Gleam Eyes",
      abates: 0,
      lore: "Demoníaco e de visão letal, cada olhar é uma sentença para os fracos.",
      status: { hp: "2000", atk: "200", def: "300" },
      passivas: ["lâmina gigante", "olhar do demônio"],
      anatomia: {
        req: 120,
        texto:
          "Um corpo enorme coberto por olhos cintilantes e placas demoníacas.",
      },
      fraqueza: {
        req: 180,
        texto: "Sobrecarregar seus olhos com luz intensa deixa-o desorientado.",
      },
    },
    {
      id: "zumbi_pútrido",
      gameKey: "Zumbi Pútrido",
      biome: "Catacumbas  Sombrias",
      category: "comum",
      name: "Zumbi Pútrido",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 80, atk: 10, def: 10 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "roda_de_esqueletos",
      gameKey: "Roda de Esqueletos",
      biome: "Catacumbas  Sombrias",
      category: "comum",
      name: "Roda de Esqueletos",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 55, atk: 15, def: 10 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "morcego_vampiro",
      gameKey: "Morcego Vampiro",
      biome: "Catacumbas  Sombrias",
      category: "comum",
      name: "Morcego Vampiro",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 40, atk: 14, def: 5 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "carrasco_zumbi",
      gameKey: "Carrasco Zumbi",
      biome: "Catacumbas  Sombrias",
      category: "comum",
      name: "Carrasco Zumbi",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 95, atk: 18, def: 12 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "rato_tumular",
      gameKey: "Rato Tumular",
      biome: "Catacumbas  Sombrias",
      category: "comum",
      name: "Rato Tumular",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 50, atk: 9, def: 5 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "esqueleto_mago",
      gameKey: "Esqueleto Mago",
      biome: "Catacumbas  Sombrias",
      category: "comum",
      name: "Esqueleto Mago",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 55, atk: 16, def: 8 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "aranha_das_criptas",
      gameKey: "Aranha das Criptas",
      biome: "Catacumbas  Sombrias",
      category: "comum",
      name: "Aranha das Criptas",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 60, atk: 11, def: 10 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "lodo_carnívoro",
      gameKey: "Lodo Carnívoro",
      biome: "Catacumbas  Sombrias",
      category: "comum",
      name: "Lodo Carnívoro",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 110, atk: 7, def: 20 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "cavaleiro_do_crisol_decaído",
      gameKey: "Cavaleiro do Crisol Decaído",
      biome: "Catacumbas  Sombrias",
      category: "comum",
      name: "Cavaleiro do Crisol Decaído",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 200, atk: 25, def: 45 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "morte_menor",
      gameKey: "Morte Menor",
      biome: "Catacumbas  Sombrias",
      category: "comum",
      name: "Morte Menor",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 140, atk: 35, def: 15 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "paladino_corrompido",
      gameKey: "Paladino Corrompido",
      biome: "Catacumbas  Sombrias",
      category: "comum",
      name: "Paladino Corrompido",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 180, atk: 20, def: 35 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "amálgama_de_ossos",
      gameKey: "Amálgama de Ossos",
      biome: "Catacumbas  Sombrias",
      category: "comum",
      name: "Amálgama de Ossos",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 250, atk: 18, def: 20 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "lorde_necromante_do_abismo",
      gameKey: "Lorde Necromante",
      biome: "Catacumbas  Sombrias",
      category: "boss",
      name: "Lorde Necromante",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 300, atk: 28, def: 70 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "sapo_demoniaco",
      gameKey: "Sapo Demoníaco",
      biome: "Pântano de  Peste",
      category: "comum",
      name: "Sapo Demoníaco",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 85, atk: 22, def: 5 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "cultista_do_lodo",
      gameKey: "Cultista do Lodo",
      biome: "Pântano de  Peste",
      category: "comum",
      name: "Cultista do Lodo",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 75, atk: 30, def: 8 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "lodo_acido",
      gameKey: "Lodo Ácido",
      biome: "Pântano de  Peste",
      category: "comum",
      name: "Lodo Ácido",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 150, atk: 12, def: 40 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "corvo_da_podridao",
      gameKey: "Corvo da Podridão",
      biome: "Pântano de  Peste",
      category: "comum",
      name: "Corvo da Podridão",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 90, atk: 35, def: 10 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "sanguessuga_gigante",
      gameKey: "Sanguessuga Gigante",
      biome: "Pântano de  Peste",
      category: "comum",
      name: "Sanguessuga Gigante",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 85, atk: 15, def: 15 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "verme_da_lama",
      gameKey: "Verme da Lama",
      biome: "Pântano de  Peste",
      category: "comum",
      name: "Verme da Lama",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 130, atk: 20, def: 18 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "bruxa_menor",
      gameKey: "Bruxa Menor do Pântano",
      biome: "Pântano de  Peste",
      category: "comum",
      name: "Bruxa Menor do Pântano",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 95, atk: 25, def: 10 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "cao_infectado",
      gameKey: "Cão Infectado",
      biome: "Pântano de  Peste",
      category: "comum",
      name: "Cão Infectado",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 105, atk: 24, def: 12 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "troll_de_podridao",
      gameKey: "Troll de Podridão",
      biome: "Pântano de  Peste",
      category: "comum",
      name: "Troll de Podridão",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 180, atk: 18, def: 30 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "arvore_podre_andante",
      gameKey: "Árvore Podre Andante",
      biome: "Pântano de  Peste",
      category: "comum",
      name: "Árvore Podre Andante",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 200, atk: 14, def: 35 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "macaco_guardiao",
      gameKey: "Macaco Guardião Sem Cabeça",
      biome: "Pântano de  Peste",
      category: "elite",
      name: "Macaco Guardião Sem Cabeça",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 350, atk: 45, def: 25 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "o_omen_caido",
      gameKey: "O Omen Caído",
      biome: "Pântano de  Peste",
      category: "elite",
      name: "O Omen Caído",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 300, atk: 38, def: 40 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "besta_sanguinaria",
      gameKey: "Besta Sanguinária",
      biome: "Pântano de  Peste",
      category: "elite",
      name: "Besta Sanguinária",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 280, atk: 50, def: 15 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "kelpie,_o_cavalo_do_afogamento",
      gameKey: "Kelpie, o Cavalo do Afogamento",
      biome: "Pântano de  Peste",
      category: "elite",
      name: "Kelpie, o Cavalo do Afogamento",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 320, atk: 32, def: 30 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "hidra_corrompida",
      gameKey: "Hidra Corrompida",
      biome: "Pântano de  Peste",
      category: "boss",
      name: "Hidra Corrompida",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 600, atk: 45, def: 90 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "mineiro_enlouquecido",
      gameKey: "Mineiro Enlouquecido",
      biome: "Forja  Profana dos  Abismo",
      category: "comum",
      name: "Mineiro Enlouquecido",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 200, atk: 40, def: 25 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "demônio_de_fornalha_menor",
      gameKey: "Demônio de Fornalha Menor",
      biome: "Forja  Profana dos  Abismo",
      category: "comum",
      name: "Demônio de Fornalha Menor",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 280, atk: 35, def: 35 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "verme_de_magma",
      gameKey: "Verme de Magma",
      biome: "Forja  Profana dos  Abismo",
      category: "comum",
      name: "Verme de Magma",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 250, atk: 38, def: 22 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "morcego_de_fogo",
      gameKey: "Morcego de Fogo",
      biome: "Forja  Profana dos  Abismo",
      category: "comum",
      name: "Morcego de Fogo",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 150, atk: 28, def: 12 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "escravo_de_cinzas",
      gameKey: "Escravo de Cinzas",
      biome: "Forja  Profana dos  Abismo",
      category: "comum",
      name: "Escravo de Cinzas",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 180, atk: 30, def: 18 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "lagarto_escamoso",
      gameKey: "Lagarto Escamoso",
      biome: "Forja  Profana dos  Abismo",
      category: "comum",
      name: "Lagarto Escamoso",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 230, atk: 32, def: 40 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "elemental_do_fogo",
      gameKey: "Elemental do Fogo",
      biome: "Forja  Profana dos  Abismo",
      category: "comum",
      name: "Elemental do Fogo",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 210, atk: 42, def: 10 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "zodd,_o_imortal",
      gameKey: "Zodd, O Imortal",
      biome: "Forja  Profana dos  Abismo",
      category: "comum",
      name: "Zodd, O Imortal",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 600, atk: 75, def: 45 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "perseguidor_flutuante",
      gameKey: "Perseguidor Flutuante",
      biome: "Forja  Profana dos  Abismo",
      category: "comum",
      name: "Perseguidor Flutuante",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 450, atk: 80, def: 35 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "dragão_de_magma_terrestre",
      gameKey: "Dragão de Magma Terrestre",
      biome: "Forja  Profana dos  Abismo",
      category: "comum",
      name: "Dragão de Magma Terrestre",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 550, atk: 60, def: 55 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "demônio_capra",
      gameKey: "Demônio Capra",
      biome: "Forja  Profana dos  Abismo",
      category: "comum",
      name: "Demônio Capra",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 480, atk: 85, def: 25 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "senhor_da_forja",
      gameKey: "Senhor da Forja",
      biome: "Forja  Profana dos  Abismo",
      category: "boss",
      name: "Senhor da Forja",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 1200, atk: 75, def: 150 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "pássaro_de_fogo",
      gameKey: "Pássaro de Fogo",
      biome: "Cavernas de  Magma",
      category: "comum",
      name: "Pássaro de Fogo",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 80, atk: 25, def: 5 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "verme_de_rocha",
      gameKey: "Verme de Rocha",
      biome: "Cavernas de  Magma",
      category: "comum",
      name: "Verme de Rocha",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 170, atk: 20, def: 40 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "cultista_de_chamas",
      gameKey: "Cultista de Chamas",
      biome: "Cavernas de  Magma",
      category: "comum",
      name: "Cultista de Chamas",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 95, atk: 30, def: 10 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "gigante_de_cinzas",
      gameKey: "Gigante de Cinzas",
      biome: "Cavernas de  Magma",
      category: "comum",
      name: "Gigante de Cinzas",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 200, atk: 35, def: 20 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "golem_de_magma_ancião",
      gameKey: "Golem de Magma Ancião",
      biome: "Cavernas de  Magma",
      category: "comum",
      name: "Golem de Magma Ancião",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 260, atk: 29, def: 100 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "guarda-fogo_ancestral",
      gameKey: "Guarda-fogo Ancestral",
      biome: "Cavernas de  Magma",
      category: "comum",
      name: "Guarda-fogo Ancestral",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 280, atk: 45, def: 30 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "cavaleiro_negro_de_fumaça",
      gameKey: "Cavaleiro Negro de Fumaça",
      biome: "Cavernas de  Magma",
      category: "comum",
      name: "Cavaleiro Negro de Fumaça",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 350, atk: 55, def: 50 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "wyvern_vermelho_menor",
      gameKey: "Wyvern Vermelho Menor",
      biome: "Cavernas de  Magma",
      category: "comum",
      name: "Wyvern Vermelho Menor",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 300, atk: 50, def: 25 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "centopei_de_lava",
      gameKey: "Centopei de Lava",
      biome: "Cavernas de  Magma",
      category: "comum",
      name: "Centopei de Lava",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 220, atk: 40, def: 45 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "dragão_filhote",
      gameKey: "Dragão Filhote",
      biome: "Cavernas de  Magma",
      category: "boss",
      name: "Dragão Filhote",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 450, atk: 35, def: 90 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "lobo_de_ruína",
      gameKey: "Lobo de Ruína",
      biome: "Floresta das  Sombras",
      category: "comum",
      name: "Lobo de Ruína",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 85, atk: 14, def: 5 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "fada_dos_pesadelos",
      gameKey: "Fada dos Pesadelos",
      biome: "Floresta das  Sombras",
      category: "comum",
      name: "Fada dos Pesadelos",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 70, atk: 10, def: 5 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "yom_voraz",
      gameKey: "Yom Voraz",
      biome: "Floresta das  Sombras",
      category: "comum",
      name: "Yom Voraz",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 150, atk: 25, def: 5 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "leshen_ancião",
      gameKey: "Leshen Ancião",
      biome: "Floresta das  Sombras",
      category: "comum",
      name: "Leshen Ancião",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 200, atk: 15, def: 25 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "aranha_viúva_negra",
      gameKey: "Aranha Viúva Negra",
      biome: "Floresta das  Sombras",
      category: "comum",
      name: "Aranha Viúva Negra",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 110, atk: 22, def: 10 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "ent_corrompido",
      gameKey: "Ent Corrompido",
      biome: "Floresta das  Sombras",
      category: "comum",
      name: "Ent Corrompido",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 250, atk: 18, def: 40 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "cultista_de_floresta",
      gameKey: "Cultista de Floresta",
      biome: "Floresta das  Sombras",
      category: "comum",
      name: "Cultista de Floresta",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 120, atk: 28, def: 12 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "verme_de_madeira",
      gameKey: "Verme de Madeira",
      biome: "Floresta das  Sombras",
      category: "comum",
      name: "Verme de Madeira",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 140, atk: 20, def: 30 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "priscilla_a_desperta",
      gameKey: "Priscilla, A Desperta",
      biome: "Floresta das  Sombras",
      category: "comum",
      name: "Priscilla, A Desperta",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 320, atk: 45, def: 20 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "o_demônio_do_refúgio",
      gameKey: "O Demônio do Refúgio",
      biome: "Floresta das  Sombras",
      category: "comum",
      name: "O Demônio do Refúgio",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 450, atk: 55, def: 40 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "fiend,_a_fera_de_chifres",
      gameKey: "Fiend, A Fera de Chifres",
      biome: "Floresta das  Sombras",
      category: "comum",
      name: "Fiend, A Fera de Chifres",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 380, atk: 40, def: 30 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "riful_do_oeste",
      gameKey: "Riful do Oeste",
      biome: "Floresta das  Sombras",
      category: "comum",
      name: "Riful do Oeste",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 350, atk: 60, def: 25 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "illfang,_o_rei_kobold",
      gameKey: "Illfang, o Rei Kobold",
      biome: "Floresta das  Sombras",
      category: "boss",
      name: "Illfang, o Rei Kobold",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 600, atk: 55, def: 200 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "cria_de_seath",
      gameKey: "Cria de Seath",
      biome: "Abismo de  Cristal",
      category: "comum",
      name: "Cria de Seath",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 180, atk: 25, def: 20 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "feiticeiro_enlouquecido",
      gameKey: "Feiticeiro Enlouquecido",
      biome: "Abismo de  Cristal",
      category: "comum",
      name: "Feiticeiro Enlouquecido",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 110, atk: 35, def: 10 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "borbolet_de_cristal",
      gameKey: "Borbolet de Cristal",
      biome: "Abismo de  Cristal",
      category: "comum",
      name: "Borbolet de Cristal",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 80, atk: 15, def: 5 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "esqueleto_mágico",
      gameKey: "Esqueleto Mágico",
      biome: "Abismo de  Cristal",
      category: "comum",
      name: "Esqueleto Mágico",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 130, atk: 22, def: 15 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "lobo_das_estrelas",
      gameKey: "Lobo das Estrelas",
      biome: "Abismo de  Cristal",
      category: "comum",
      name: "Lobo das Estrelas",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 140, atk: 30, def: 12 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "marionete_quebrada",
      gameKey: "Marionete Quebrada",
      biome: "Abismo de  Cristal",
      category: "comum",
      name: "Marionete Quebrada",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 160, atk: 18, def: 25 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "ratos_de_biblioteca",
      gameKey: "Ratos de Biblioteca",
      biome: "Abismo de  Cristal",
      category: "comum",
      name: "Ratos de Biblioteca",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 60, atk: 12, def: 5 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "espectro_arcano",
      gameKey: "Espectro Arcano",
      biome: "Abismo de  Cristal",
      category: "comum",
      name: "Espectro Arcano",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 100, atk: 32, def: 5 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "renna,_iluso",
      gameKey: "Renna,  Iluso",
      biome: "Abismo de  Cristal",
      category: "comum",
      name: "Renna,  Iluso",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 280, atk: 45, def: 20 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "sábio_de_cristal",
      gameKey: "Sábio de Cristal",
      biome: "Abismo de  Cristal",
      category: "comum",
      name: "Sábio de Cristal",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 320, atk: 55, def: 15 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "lobo_cinzento_gigante",
      gameKey: "Lobo Cinzento Gigante",
      biome: "Abismo de  Cristal",
      category: "comum",
      name: "Lobo Cinzento Gigante",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 450, atk: 60, def: 40 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "arauto_de_lua",
      gameKey: "Arauto de Lua",
      biome: "Abismo de  Cristal",
      category: "comum",
      name: "Arauto de Lua",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 380, atk: 50, def: 35 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "x'rphan,_o_dragão_branco",
      gameKey: "X'rphan, o Dragão Branco",
      biome: "Abismo de  Cristal",
      category: "boss",
      name: "X'rphan, o Dragão Branco",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 900, atk: 50, def: 400 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "apóstolo_menor",
      gameKey: "Apóstolo Menor",
      biome: "Corredores dos  Eclipse",
      category: "comum",
      name: "Apóstolo Menor",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 150, atk: 40, def: 20 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "semente_dos_mal",
      gameKey: "Semente dos Mal",
      biome: "Corredores dos  Eclipse",
      category: "comum",
      name: "Semente dos Mal",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 200, atk: 25, def: 30 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "cria_cósmica",
      gameKey: "Cria Cósmica",
      biome: "Corredores dos  Eclipse",
      category: "comum",
      name: "Cria Cósmica",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 160, atk: 45, def: 10 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "devorador_de_mentes",
      gameKey: "Devorador de Mentes",
      biome: "Corredores dos  Eclipse",
      category: "comum",
      name: "Devorador de Mentes",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 140, atk: 50, def: 5 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "cavaleiro_dos_sol_negro",
      gameKey: "Cavaleiro dos Sol Negro",
      biome: "Corredores dos  Eclipse",
      category: "comum",
      name: "Cavaleiro dos Sol Negro",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 250, atk: 35, def: 45 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "sombra_distorcida",
      gameKey: "Sombra Distorcida",
      biome: "Corredores dos  Eclipse",
      category: "comum",
      name: "Sombra Distorcida",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 120, atk: 38, def: 5 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "carniçal_do_eclipse",
      gameKey: "Carniçal do Eclipse",
      biome: "Corredores dos  Eclipse",
      category: "comum",
      name: "Carniçal do Eclipse",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 190, atk: 28, def: 15 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "verme_do_vazio",
      gameKey: "Verme do Vazio",
      biome: "Corredores dos  Eclipse",
      category: "comum",
      name: "Verme do Vazio",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 280, atk: 25, def: 35 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "artorias_o_corrompido",
      gameKey: "Artorias, O Corrompido",
      biome: "Corredores dos  Eclipse",
      category: "comum",
      name: "Artorias, O Corrompido",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 550, atk: 85, def: 60 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "femto,_o_falcão_negro",
      gameKey: "Femto, O Falcão Negro",
      biome: "Corredores dos  Eclipse",
      category: "comum",
      name: "Femto, O Falcão Negro",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 600, atk: 90, def: 40 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "grunbeld,_o_dragão_de_fogo",
      gameKey: "Grunbeld, O Dragão de Fogo",
      biome: "Corredores dos  Eclipse",
      category: "comum",
      name: "Grunbeld, O Dragão de Fogo",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 700, atk: 75, def: 80 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "óórfão_de_kos",
      gameKey: "ÓÓrfão de Kos",
      biome: "Corredores dos  Eclipse",
      category: "comum",
      name: "ÓÓrfão de Kos",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 450, atk: 110, def: 20 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
    {
      id: "the_gleam_eyes",
      gameKey: "The Gleam Eyes",
      biome: "Corredores dos  Eclipse",
      category: "boss",
      name: "The Gleam Eyes",
      lore: "Uma criatura lendária descrita apenas em contos.",
      status: { hp: 2000, atk: 200, def: 300 },
      passivas: [],
      anatomia: { req: 10, texto: "Estudos anatômicos concluídos." },
      fraqueza: { req: 25, texto: "Fraqueza exposta." },
    },
  ],
  companions: [
    {
      id: "kael",
      name: "Kael, O Desertor",
      quote:
        "Eu vi os Portões serem destruídos. Não vou ver essa fogueira apagar também.",
      affinity: 45, // de 0 a 100
      passive: "+10% Chance Crítica Global",
    },
    {
      id: "elara",
      name: "Elara, Sussurro das Sombras",
      quote:
        "A escuridão não é inimiga. É apenas um lugar frio para se esconder.",
      affinity: 15,
      passive: "+15% Evasão, +5% Dano Venenoso",
    },
  ],
};

const GAME_SAVE_KEY = "SANCTUARY_APEX_V5";
let pendingFragmentToHighlight = null;
let pendingFragmentLabel = null;
let currentMemoryFilter = "all";
let memorySearchQuery = "";

function getQueryParameter(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function loadGameState() {
  try {
    const data = localStorage.getItem(GAME_SAVE_KEY);
    if (!data) return null;

    let appState = JSON.parse(data);

    // Auto-recover from the previous corruption bug where state was nested
    if (appState.appState) {
      appState = appState.appState;
      localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(appState));
    }

    if (!appState || !Array.isArray(appState.slots)) return null;

    let hero = null;
    if (typeof appState.activeSlotIndex === "number") {
      hero = appState.slots[appState.activeSlotIndex];
    }
    if (!hero) hero = appState.slots.find((slot) => slot) || null;
    return { appState, hero };
  } catch (error) {
    console.warn("Erro ao carregar save do Lore:", error);
    return null;
  }
}

function handlePendingFragmentFromUrl() {
  const fragmentId = getQueryParameter("fragment");
  if (!fragmentId) return;
  pendingFragmentToHighlight = fragmentId;
  const fragmentDef = getMemoryFragmentDefinition(fragmentId);
  pendingFragmentLabel = fragmentDef.name || fragmentId;
  const memTabButton = document.querySelector('.tab-btn[data-tab="memorias"]');
  openTab("memorias", memTabButton);
}

function loadGameBestiary() {
  let bestiary = {};
  let heroName = null;
  let heroClass = null;
  let hero = null;
  try {
    const state = loadGameState();
    if (state && state.hero) {
      hero = state.hero;
      heroName = hero.name || null;
      heroClass = hero.class || null;
      bestiary = hero.bestiary || {};
    }
  } catch (error) {
    console.warn("Não foi possível ler o save do jogo:", error);
  }
  return { heroName, heroClass, bestiary, hero };
}

function getSavedKillCount(savedKills, mob) {
  if (!savedKills) return null;
  if (savedKills[mob.gameKey] !== undefined) return savedKills[mob.gameKey];
  if (savedKills[mob.name] !== undefined) return savedKills[mob.name];
  if (savedKills[mob.id] !== undefined) return savedKills[mob.id];
  return null;
}


function getSaveInfoText(saveInfo) {
  if (!saveInfo.heroName) {
    return "Nenhum save do jogo encontrado ou nenhum personagem ativo.";
  }
  return `Save ativo: ${saveInfo.heroName} (${saveInfo.heroClass || "classe desconhecida"}) – bestiário sincronizado.`;
}

function refreshGameBestiary() {
  renderBestiary();
}

// --- EXPOSIÇÃO GLOBAL (Para uso nos HTMLs) ---

function closeMapPanel() {
  document.getElementById("map-side-panel").classList.remove("open");
  document
    .querySelectorAll(".map-landmark")
    .forEach((l) => l.classList.remove("active"));
  document
    .querySelectorAll(".map-route")
    .forEach((r) => r.classList.remove("active"));
}

// 1. Renderiza o Mapa
function renderMap() {
  const svgLayer = document.getElementById("map-routes");
  const landmarksLayer = document.getElementById("map-landmarks-layer");
  const panel = document.getElementById("map-side-panel");

  const state = loadGameState();
  const hero = state ? state.hero : null;
  const maxLvl =
    hero && hero.maxDungeonLevel
      ? hero.maxDungeonLevel
      : hero
        ? hero.dungeonLevel
        : 1;

  svgLayer.innerHTML = "";
  landmarksLayer.innerHTML = "";

  // Draw SVG Lines first
  LORE_DB.locations.forEach((loc) => {
    let minLevelLoc = parseInt(loc.level.match(/\d+/)[0]) || 1;
    if (maxLvl < minLevelLoc) return;

    if (loc.connects) {
      loc.connects.forEach((targetId) => {
        const target = LORE_DB.locations.find((l) => l.id === targetId);
        if (target) {
          let minLevelTarget = parseInt(target.level.match(/\d+/)[0]) || 1;
          if (maxLvl < minLevelTarget) return; // Só desenha linha se ambos descobertos

          // Check if line already exists to avoid drawing A->B and B->A twice
          const lineId1 = `line-${loc.id}-${target.id}`;
          const lineId2 = `line-${target.id}-${loc.id}`;

          if (
            !document.getElementById(lineId1) &&
            !document.getElementById(lineId2)
          ) {
            const line = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "line",
            );
            line.setAttribute("id", lineId1);
            line.setAttribute(
              "class",
              `map-route route-${loc.id} route-${target.id}`,
            );
            line.setAttribute("x1", `${loc.x}%`);
            line.setAttribute("y1", `${loc.y}%`);
            line.setAttribute("x2", `${target.x}%`);
            line.setAttribute("y2", `${target.y}%`);
            svgLayer.appendChild(line);
          }
        }
      });
    }
  });

  // Draw Nodes
  LORE_DB.locations.forEach((loc) => {
    let minLevelLoc = parseInt(loc.level.match(/\d+/)[0]) || 1;
    if (maxLvl < minLevelLoc) return; // Oculta pino se não descobriu

    const marker = document.createElement("div");
    marker.className = "map-landmark pulsing";
    marker.id = `marker-${loc.id}`;
    marker.style.left = `${loc.x}%`;
    marker.style.top = `${loc.y}%`;
    marker.innerHTML = `
                    <div class="landmark-icon">${loc.icon}</div>
                    <div class="landmark-name">${loc.name}</div>
                `;

    marker.addEventListener("click", (event) => {
      event.stopPropagation();

      // Cleanup active states
      document
        .querySelectorAll(".map-landmark")
        .forEach((l) => l.classList.remove("active"));
      document
        .querySelectorAll(".map-route")
        .forEach((r) => r.classList.remove("active"));

      // Set active states
      marker.classList.add("active");
      document
        .querySelectorAll(`.route-${loc.id}`)
        .forEach((r) => r.classList.add("active"));

      // Populate Panel
      document.getElementById("panel-title").innerText = loc.name;
      document.getElementById("panel-level").innerText =
        `Nível de Perigo: ${loc.level}`;
      document.getElementById("panel-desc").innerText = loc.desc;

      // Populate Monsters from Bestiary
      const monstersList = document.getElementById("panel-monsters");
      monstersList.innerHTML = "";
      const localMobs = LORE_DB.bestiary.filter((m) => m.biome === loc.biome);

      if (localMobs.length > 0) {
        localMobs.forEach((mob) => {
          let typeColor =
            mob.category === "boss"
              ? "#ef4444"
              : mob.category === "elite"
                ? "#f59e0b"
                : "#9ca3af";
          let typeName =
            mob.category === "boss"
              ? "Chefe"
              : mob.category === "elite"
                ? "Elite"
                : "Comum";
          monstersList.innerHTML += `
                                <div class="biome-monster-card">
                                    <div>
                                        <strong style="color: ${typeColor};">${mob.name}</strong><br>
                                        <span style="font-size: 0.75rem; color: #6b7280;">HP: ${mob.status.hp} | ATK: ${mob.status.atk}</span>
                                    </div>
                                    <span style="font-size:0.7rem; background:rgba(255,255,255,0.05); padding:3px 8px; border-radius:4px;">${typeName}</span>
                                </div>
                            `;
        });
      } else {
        monstersList.innerHTML =
          '<div style="font-size:0.85rem; color:#6b7280; font-style:italic;">Nenhum registro no bestiário.</div>';
      }

      panel.classList.add("open");
    });

    landmarksLayer.appendChild(marker);
  });
}

// 2. Renderiza o Bestiário como um Livro Real (Aba 2)
// ==========================================================
// MOTOR PROCEDURAL DE LORE & AUDIO
// ==========================================================
function playPaperSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseSource.start();
  } catch (e) {
    console.warn("Audio não suportado", e);
  }
}

function renderBestiary() {
  const container = document.getElementById("real-book-container");
  if (!container) return;

  // Desenha a Capa no container offscreen
  container.innerHTML = `
                <div class="real-book" id="real-book">
                    <div class="real-book-back-cover"></div>
                    <div class="real-book-cover" id="book-cover-element">
                        <div class="real-book-cover-front">
                            <div class="cover-title">Enciclopédia<br>de<br>Sanctuary</div>
                            <p style="color: #b8860b; font-family: 'Georgia', serif; font-style: italic; margin-top: 40px;">Clique para Abrir</p>
                        </div>
                        <div class="real-book-cover-back"></div>
                    </div>
                </div>
            `;

  const nav = document.getElementById("real-book-nav");
  if (nav) nav.style.display = "none";

  // Construir o livro 3D imediatamente com 0 páginas (apenas a capa)
  setTimeout(() => {
    buildThreeBook(0);
    // Garantir que a câmera tem o aspect ratio correto mesmo se a aba não estava ativa antes
    const canvas = document.getElementById("webgl-book-canvas");
    if (canvas) {
      // Atualiza proporções caso a aba Bestiário tenha acabado de abrir
      window.dispatchEvent(new Event("resize"));
    }
  }, 150);
}

// 3. Renderiza Memórias perdidas e capítulos completos
function renderMemories() {
  const saveInfo = loadGameBestiary();
  const hero = saveInfo.hero;
  const container = document.getElementById("memories-container");
  const header = document.getElementById("memories-header");
  container.innerHTML = "";

  if (!hero) {
    if (header) {
      header.innerHTML = `
                        <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 16px; color:#cbd5e1; font-size:0.95rem;">
                            Nenhum personagem carregado. Volte ao jogo e carregue um save para abrir o tomo de memórias.
                        </div>`;
    }
    container.innerHTML =
      '<div style="color:#9ca3af; font-style:italic;">Nenhum save carregado. Retorne ao jogo e carregue um personagem para visualizar suas memórias.</div>';
    return;
  }

  const allFragments = (hero.inventory || []).filter(
    (i) => i.type === "lore_fragment",
  );
  const chaptersCompleted = Object.values(hero.loreChapters || {}).filter(
    (ch) => ch.completed,
  ).length;
  const recoveredFragments = new Set([
    ...allFragments.map((i) => i.fragmentId),
    ...Object.values(hero.loreChapters || {}).reduce(
      (acc, ch) => acc.concat(ch.fragments || []),
      [],
    ),
  ]).size;

  if (header) {
    header.innerHTML = `
                    <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 16px; display:flex; flex-wrap: wrap; align-items:center; justify-content:space-between; gap:12px;">
                        <div style="color:#cbd5e1; font-size:0.95rem;">${getSaveInfoText(saveInfo)}</div>
                        <div style="display:flex; gap:14px; align-items:center; flex-wrap: wrap; color:#cbd5e1; font-size:0.9rem;">
                            <span>Fragmentos recuperados: <strong>${recoveredFragments}</strong></span>
                            <span>Fragmentos no inventário: <strong>${allFragments.length}</strong></span>
                            <span>Capítulos completos: <strong>${chaptersCompleted}</strong></span>
                        </div>
                        <button class="btn" style="width:auto; padding:10px 16px; min-width: 160px;" onclick="refreshMemories()">Atualizar Memórias</button>
                    </div>
                    <div style="margin-top: 14px; display:flex; flex-wrap: wrap; gap:10px; align-items:center; justify-content:space-between;">
                        <div style="display:flex; flex-wrap: wrap; gap:8px; align-items:center;">
                            <button class="btn btn-small ${currentMemoryFilter === "all" ? "active" : ""}" onclick="setMemoryFilter('all')">Todos</button>
                            <button class="btn btn-small ${currentMemoryFilter === "available" ? "active" : ""}" onclick="setMemoryFilter('available')">Disponíveis</button>
                            <button class="btn btn-small ${currentMemoryFilter === "read" ? "active" : ""}" onclick="setMemoryFilter('read')">Lidos</button>
                            <button class="btn btn-small ${currentMemoryFilter === "lost" ? "active" : ""}" onclick="setMemoryFilter('lost')">Perdidos</button>
                        </div>
                        <input id="memory-search-input" type="search" placeholder="Buscar fragmentos..." value="${memorySearchQuery}" oninput="updateMemorySearch(event)" style="padding:10px 14px; border-radius:999px; border:1px solid rgba(148,163,184,0.35); background: rgba(15,23,42,0.9); color:#e2e8f0; min-width:220px; width:240px;" />
                    </div>
                    ${pendingFragmentLabel ? `<div style="margin-top: 12px; padding: 12px 16px; border: 1px solid rgba(59,130,246,0.2); border-radius: 14px; background: rgba(59,130,246,0.08); color: #c7d2fe; font-size: 0.92rem;">Fragmento direcionado: <strong>${pendingFragmentLabel}</strong>. Role até ele para encaixar a página.</div>` : ""}
                `;
  }

  const chapters = {
    catacumbas: {
      name: "Catacumbas Sombrias",
      fragments: [
        "frag_catacumbas_1",
        "frag_catacumbas_2",
        "frag_catacumbas_3",
      ],
    },
    pantano: {
      name: "Pântano da Peste",
      fragments: ["frag_pantano_1", "frag_pantano_2", "frag_pantano_3"],
    },
    magma: {
      name: "Cavernas de Magma",
      fragments: ["frag_magma_1", "frag_magma_2", "frag_magma_3"],
    },
    cristal: {
      name: "Abismo de Cristal",
      fragments: ["frag_cristal_1", "frag_cristal_2", "frag_cristal_3"],
    },
  };

  const ownedFragments = hero
    ? hero.inventory.filter((i) => i.type === "lore_fragment")
    : [];
  const readChapters = hero && hero.loreChapters ? hero.loreChapters : {};

  const chapterKeys = Object.keys(chapters);
  if (!hero) {
    container.innerHTML =
      '<div style="color:#9ca3af; font-style:italic;">Nenhum save carregado. Retorne ao jogo e carregue um personagem para visualizar suas memórias.</div>';
    return;
  }
  chapterKeys.forEach((chKey) => {
    const chapter = chapters[chKey];
    const readList =
      (readChapters[chKey] && readChapters[chKey].fragments) || [];
    const isComplete = chapter.fragments.every((f) => readList.includes(f));
    const progress = `${readList.length}/${chapter.fragments.length}`;

    const filteredFragments = chapter.fragments.filter((fragmentId) => {
      const fragmentDef = getMemoryFragmentDefinition(fragmentId);
      const hasItem = ownedFragments.some(
        (item) => item.fragmentId === fragmentId,
      );
      const isRead = readList.includes(fragmentId);

      if (currentMemoryFilter === "available" && !hasItem) return false;
      if (currentMemoryFilter === "read" && !isRead) return false;
      if (currentMemoryFilter === "lost" && (hasItem || isRead)) return false;

      if (memorySearchQuery.trim()) {
        const searchText =
          `${fragmentDef.name} ${fragmentDef.desc} ${fragmentDef.story}`.toLowerCase();
        return searchText.includes(memorySearchQuery.trim().toLowerCase());
      }
      return true;
    });

    const fragmentCards = filteredFragments
      .map((fragmentId) => {
        const fragmentDef = getMemoryFragmentDefinition(fragmentId);
        const hasItem = ownedFragments.some(
          (item) => item.fragmentId === fragmentId,
        );
        const isRead = readList.includes(fragmentId);
        const statusClass = isRead ? "read" : hasItem ? "novel" : "lost";
        let descText = fragmentDef.desc;
        if (!isRead && !hasItem) {
          // Criptografia Rúnica (Embaralha as letras)
          const chars =
            "AÀÁÂÃBCÇDEÈÉÊFGHIÍJKLMNOÒÓÔÕPQRSTUÙÚÛVWXYZ1234567890!@#$%&*?";
          descText = descText
            .split("")
            .map((c) =>
              c === " " ? " " : chars[Math.floor(Math.random() * chars.length)],
            )
            .join("");
          descText = `<span style="font-family: monospace; color: #475569; letter-spacing: 1px;">${descText}</span>`;
        }
        const rot = Math.floor(Math.random() * 16) - 8;
        const tx = Math.floor(Math.random() * 20) - 10;
        const ty = Math.floor(Math.random() * 20) - 10;

        return `
                        <div class="memory-page ${statusClass}${fragmentId === pendingFragmentToHighlight ? " highlighted-memory" : ""}" style="--rot: ${rot}deg; --tx: ${tx}px; --ty: ${ty}px;">
                            <h4>${fragmentDef.name}</h4>
                            <p>${isRead ? fragmentDef.story || fragmentDef.desc : descText}</p>
                            ${hasItem && !isRead ? `<div style="margin-top: 25px; text-align: center;"><button class="btn btn-small" onclick="readMemoryFragment('${fragmentId}')" style="background: rgba(45, 28, 8, 0.9); border-color: #8b6b4a; box-shadow: 0 0 15px rgba(234, 179, 8, 0.4);">Selar Memória no Altar</button></div>` : ""}
                        </div>
                    `;
      })
      .join("");

    const emptyNotice =
      filteredFragments.length === 0
        ? `<div style="color:#9ca3af; font-style:italic; padding:12px 0;">Nenhum fragmento corresponde aos filtros atuais neste capítulo.</div>`
        : "";

    container.innerHTML += `
                    <div style="margin: 40px 0 20px;">
                        <h2 style="font-family: 'UnifrakturCook', cursive; color: rgba(250, 204, 21, 0.6); font-size: 2.2rem; margin: 0; letter-spacing: 2px; text-align: center; text-shadow: 0 0 20px rgba(250, 204, 21, 0.1); border: none;">${chapter.name}</h2>
                        <div style="text-align: center; color: rgba(255,255,255,0.4); margin-bottom: 30px; font-family: 'Georgia', serif; font-style: italic;">
                            Progresso: ${progress} &nbsp;&mdash;&nbsp; 
                            ${isComplete ? '<strong style="color:rgba(251, 191, 36, 0.8); text-shadow: 0 0 10px rgba(251,191,36,0.3);">Ritual Completo (+1 Ponto)</strong>' : "Reúna todos os fragmentos"}
                        </div>
                        <div class="page-grid">
                            ${fragmentCards}
                            ${emptyNotice}
                        </div>
                    </div>
                `;
  });
  animateMemoryPages();
}

function getMemoryFragmentDefinition(id) {
  const pool = [
    {
      id: "frag_catacumbas_1",
      name: "Página Rasgada: O Ritual",
      desc: "Um pedaço de pergaminho queimado descrevendo um ritual antigo nas catacumbas.",
      story:
        "Ao montar esta página, o sacrifício esquecido do culto ressurge — as sombras aprendem a cantar o nome do Senhor dos Ossos.",
    },
    {
      id: "frag_catacumbas_2",
      name: "Página Rasgada: A Vigília",
      desc: "Notas de vigília que descrevem monstros ancestrais à espreita nos corredores.",
      story:
        "As sentinelas de pedra não descansam. Esta passagem revela os passos que atraem a criatura para fora do túmulo.",
    },
    {
      id: "frag_catacumbas_3",
      name: "Página Rasgada: A Oração",
      desc: "Um canto roto que revela segredos do culto do Senhor dos Ossos.",
      story:
        "Quando a oração é recitada em voz baixa, o eco desperta as almas aprisionadas e faz com que as paredes sangrem história.",
    },
    {
      id: "frag_pantano_1",
      name: "Diário Ensanguentado: Vex",
      desc: "Notas de um caçador sobre a bruxa Vex e seus encantamentos de lama.",
      story:
        "Vex carrega o pântano em sua pele. Esta página descreve o ritual de sangue que sela um portal de veneno.",
    },
    {
      id: "frag_pantano_2",
      name: "Diário Ensanguentado: A Névoa",
      desc: "Entradas sobre o miasma do pântano e as feras escondidas na lama.",
      story:
        "O véu de névoa não é apenas um manto de invisibilidade — é uma memória viva que devora o tempo.",
    },
    {
      id: "frag_pantano_3",
      name: "Diário Ensanguentado: O Coração do Lodo",
      desc: "Passagens que descrevem a origem corrupta das criaturas da lama.",
      story:
        "Dentro do lodo pulsa um coração antigo. Ele conhece quem já se perdeu no brejo e dá sinais ao caçador atento.",
    },
    {
      id: "frag_magma_1",
      name: "Fragmento de Memória: Calor",
      desc: "Palavras manchadas de sangue que falam de uma forja ancestral e seus horrores.",
      story:
        "O calor desta página revela uma forja que molda mais do que armas — ela forja destinos e rituais de sangue.",
    },
    {
      id: "frag_magma_2",
      name: "Fragmento de Memória: O Ferreiro",
      desc: "Um registro sobre um senhor da forja que dominava chamas vivas.",
      story:
        "O ferreiro sussurra segredos às chamas. Sua criação não é uma lâmina, mas um juramento de destruição eterna.",
    },
    {
      id: "frag_magma_3",
      name: "Fragmento de Memória: A Lava",
      desc: "Um relato sobre florestas de fogo e monstros feitos de magma.",
      story:
        "A lava carrega memórias cristalizadas. Um fluxo incandescente revela como o Santuário foi consumido pelo fogo ancestral.",
    },
    {
      id: "frag_cristal_1",
      name: "Carta Congelada: O Dragão",
      desc: "Uma carta lacrada com gelo que menciona o Dragão Branco e seus juramentos.",
      story:
        "Ao desembrulhar esta carta, o juramento do Dragão Branco desperta e grava-se como gelo na sua mente.",
    },
    {
      id: "frag_cristal_2",
      name: "Carta Congelada: Os Cristais",
      desc: "Fragmentos de uma carta descrevendo cristais que roubam calor e memória.",
      story:
        "Os cristais sussurram antigas verdades. Esta página revela o preço de quem busca sua luz e perde seu passado.",
    },
    {
      id: "frag_cristal_3",
      name: "Carta Congelada: O Altar",
      desc: "Um registro de um altar ancestral onde a história do Santuário foi selada.",
      story:
        "No altar congelado, as memórias do Santuário ficam presas — esta página é a chave para libertá-las.",
    },
  ];
  return (
    pool.find((f) => f.id === id) || {
      id,
      name: "Fragmento desconhecido",
      desc: "Esta memória está corrompida.",
    }
  );
}

function animateMemoryPages() {
  document.querySelectorAll(".memory-page").forEach((page, index) => {
    setTimeout(() => page.classList.add("placed"), 70 * index);
  });
}

function setMemoryFilter(filter) {
  currentMemoryFilter = filter;
  renderMemories();
  showLoreActivation(
    `Filtro de Memórias aplicado: <strong>${filter === "all" ? "Todos" : filter === "available" ? "Disponíveis" : filter === "read" ? "Lidos" : "Perdidos"}</strong>`,
  );
}

function updateMemorySearch(event) {
  memorySearchQuery = event.target.value;
  renderMemories();
}

let typeWriterTimeout = null;
let currentAudioCtx = null;

function playScratch() {
  try {
    if (!currentAudioCtx)
      currentAudioCtx = new (
        window.AudioContext || window.webkitAudioContext
      )();
    if (currentAudioCtx.state === "suspended") currentAudioCtx.resume();
    const osc = currentAudioCtx.createOscillator();
    const gain = currentAudioCtx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(150, currentAudioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      40,
      currentAudioCtx.currentTime + 0.02,
    );
    gain.gain.setValueAtTime(0.04, currentAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      currentAudioCtx.currentTime + 0.02,
    );
    osc.connect(gain);
    gain.connect(currentAudioCtx.destination);
    osc.start();
    osc.stop(currentAudioCtx.currentTime + 0.02);
  } catch (e) {
    console.error(e);
  }
}

function showLoreStoryReveal(fragmentDef) {
  const overlay = document.getElementById("lore-story-overlay");
  if (!overlay) return;

  const fullText = fragmentDef.story || fragmentDef.desc;

  overlay.innerHTML = `
                <div class="lore-story-card bloody-parchment" onclick="event.stopPropagation()">
                    <div class="lore-story-title">Memória Despertada</div>
                    <h2>${fragmentDef.name}</h2>
                    <p id="typewriter-text"></p>
                    <button class="btn btn-secondary" onclick="closeLoreStoryOverlay()" style="margin-top: 15px;">Fechar Fragmento</button>
                </div>
            `;
  overlay.classList.add("visible");

  const textElement = document.getElementById("typewriter-text");
  let i = 0;
  if (typeWriterTimeout) clearTimeout(typeWriterTimeout);

  function typeWriter() {
    if (i < fullText.length) {
      textElement.innerHTML += fullText.charAt(i);
      if (fullText.charAt(i) !== " " && Math.random() < 0.6) playScratch();
      i++;
      typeWriterTimeout = setTimeout(typeWriter, 35);
    }
  }
  setTimeout(typeWriter, 400); // Aguarda a animação de popup terminar
}

function closeLoreStoryOverlay() {
  if (typeWriterTimeout) clearTimeout(typeWriterTimeout);
  const overlay = document.getElementById("lore-story-overlay");
  if (!overlay) return;
  overlay.classList.remove("visible");
}

function showLoreActivation(message) {
  const toast = document.getElementById("lore-activation-toast");
  if (!toast) return;
  toast.innerHTML = message;
  toast.classList.add("active");
  if (toast.dataset.timeoutId) {
    clearTimeout(Number(toast.dataset.timeoutId));
  }
  toast.dataset.timeoutId = setTimeout(
    () => toast.classList.remove("active"),
    4200,
  );
}

function refreshMemories() {
  renderBestiary();
  renderMemories();
  renderCompanions();
  renderRelics();
  showLoreActivation(
    "Memórias atualizadas e sincronizadas com o progresso do jogo.",
  );
}

function readMemoryFragment(fragmentId) {
  const state = loadGameState();
  if (!state || !state.hero || !state.appState) return;
  const { appState, hero } = state;

  if (!hero.loreChapters) hero.loreChapters = {};
  const fragmentDef = getMemoryFragmentDefinition(fragmentId);
  const fragmentItemIndex = hero.inventory.findIndex(
    (i) => i.type === "lore_fragment" && i.fragmentId === fragmentId,
  );
  if (fragmentItemIndex === -1)
    return alert("Esse fragmento não está no inventário ou já foi lido.");

  hero.inventory.splice(fragmentItemIndex, 1);
  const chapter = fragmentDef.id.split("_")[1];
  if (!hero.loreChapters[chapter])
    hero.loreChapters[chapter] = { fragments: [], completed: false };
  if (!hero.loreChapters[chapter].fragments.includes(fragmentId)) {
    hero.loreChapters[chapter].fragments.push(fragmentId);
  }

  const chapterDefs = {
    catacumbas: 3,
    pantano: 3,
    magma: 3,
    cristal: 3,
  };
  const chapterState = hero.loreChapters[chapter];
  if (
    !chapterState.completed &&
    chapterState.fragments.length >= chapterDefs[chapter]
  ) {
    chapterState.completed = true;
    hero.skillPoints = (hero.skillPoints || 0) + 1;
    alert(`Capítulo completo! +1 ponto de habilidade concedido.`);
  }

  localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(appState));
  pendingFragmentToHighlight = fragmentId;
  pendingFragmentLabel = fragmentDef.name;
  renderMemories();
  renderBestiary();

  const highlightNode = document.querySelector(
    ".memory-page.highlighted-memory",
  );
  if (highlightNode) {
    highlightNode.scrollIntoView({ behavior: "smooth", block: "center" });
    highlightNode.classList.add("pulse-highlight");
    setTimeout(() => highlightNode.classList.remove("pulse-highlight"), 3800);
  }
  showLoreActivation(
    `Página montada: <strong>${fragmentDef.name}</strong>. História ativada no tomo.`,
  );
  showLoreStoryReveal(fragmentDef);
}

// 3. Renderiza Companheiros com Sistema de Afinidade
function renderCompanions() {
  const container = document.getElementById("companions-container");
  container.innerHTML = "";
  if (!LORE_DB || !LORE_DB.companions) {
    container.innerHTML =
      '<div style="color:#9ca3af; font-style:italic;">Nenhum companheiro disponível para exibir.</div>';
    return;
  }
  LORE_DB.companions.forEach((comp) => {
    const card = document.createElement("div");
    card.className = "card comp-card";
    card.innerHTML = `
                    <h3>${comp.name}</h3>
                    <p style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 12px; font-style: italic;">"${comp.quote}"</p>
                    <div style="font-size: 0.8rem; margin-bottom: 10px;">Afinidade: <strong style="color: var(--mana-blue);">${comp.affinity}%</strong></div>
                    <div class="bar-container">
                        <div class="affinity-fill" style="width: ${comp.affinity}%;"></div>
                    </div>
                    
                    <div style="background: #1a1a24; padding: 8px; font-size: 0.85rem; border: 1px solid var(--border-dark);">
                        <strong>Sinergia:</strong> ${comp.passive}
                    </div>

                    <button class="btn" onclick="increaseAffinity('${comp.id}')">Conversar / Oferecer Item</button>
                `;
    container.appendChild(card);
  });
}

// Função de interação para aumentar afinidade
function increaseAffinity(compId) {
  const comp = LORE_DB.companions.find((c) => c.id === compId);
  if (comp && comp.affinity < 100) {
    comp.affinity += 10;
    if (comp.affinity > 100) comp.affinity = 100;
    // Alerta ou notificação no jogo
    console.log(`Afinidade com ${comp.name} aumentou!`);
    renderCompanions(); // Re-renderiza para atualizar a barra
  } else {
    alert(`${comp.name} já tem lealdade máxima a você.`);
  }
}

// 4. Renderiza Relíquias Falantes
function renderRelics() {
  const container = document.getElementById("relics-container");
  const header = document.getElementById("relics-header");
  if (!container) return;
  container.innerHTML = "";

  const state = loadGameState();
  const hero = state ? state.hero : null;

  if (!hero) {
    if (header) header.innerHTML = "";
    container.innerHTML =
      '<div style="color:#9ca3af; font-style:italic;">Nenhum personagem carregado. Retorne ao jogo.</div>';
    return;
  }

  if (header) {
    header.innerHTML = `
                    <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 16px; display:flex; flex-wrap: wrap; align-items:center; justify-content:space-between; gap:12px;">
                        <div style="color:#cbd5e1; font-size:0.95rem;">Relíquias do Santuário - Equipamento e Inventário</div>
                        <button class="btn" style="width:auto; padding:10px 16px; min-width: 160px;" onclick="refreshMemories()">Atualizar Sincronização</button>
                    </div>
                `;
  }

  // Pega itens do inventario e equipamento
  let allItems = hero.inventory || [];
  Object.values(hero.equipment || {}).forEach((eq) => {
    if (eq) allItems.push(eq);
  });

  // Filtra Lendários (e Épicos se quiser)
  let relics = allItems.filter(
    (i) =>
      i.rarity === "legendary" ||
      i.rarity === "epic" ||
      i.rarity === "mythic" ||
      i.rarity === "Lendário" ||
      i.rarity === "Épico" ||
      i.rarity === "Mítico" ||
      i.rarity === "Lendario" ||
      i.rarity === "Epico" ||
      i.rarity === "Mitico" ||
      i.rarity === "Unico",
  );

  // Remove duplicatas por nome
  const seen = new Set();
  relics = relics.filter((el) => {
    const duplicate = seen.has(el.name);
    seen.add(el.name);
    return !duplicate;
  });

  if (relics.length === 0) {
    container.innerHTML = `
                    <div class="card" style="text-align:center; color:#9ca3af;">
                        <h3>Nenhuma Relíquia Encontrada</h3>
                        <p>Você não possui itens Épicos ou Lendários. Continue sua jornada.</p>
                    </div>
                `;
    return;
  }

  relics.forEach((relic) => {
    const isLegendary =
      relic.rarity === "legendary" ||
      relic.rarity === "mythic" ||
      relic.rarity === "Lendário" ||
      relic.rarity === "Mítico" ||
      relic.rarity === "Lendario" ||
      relic.rarity === "Mitico" ||
      relic.rarity === "Unico";
    const color = isLegendary ? "#fbbf24" : "#a855f7";

    // Gera a lore dinamicamente
    const loreTitle = `A Lenda de ${relic.name}`;
    const baseLoreText = `Forjado nas profundezas antigas, a aura deste artefato vibra com a energia dos que o empunharam antes de você. Dizem as lendas que quem porta a ${relic.name} absorve tanto a glória quanto a maldição do criador original. Cada cicatriz no metal conta uma história de massacre.`;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-dark); padding-bottom: 8px; margin-bottom: 12px;">
                        <h3 style="margin: 0; border: none; padding: 0; color: ${color};">${relic.name}</h3>
                        <span style="font-size: 0.7rem; background:rgba(255,255,255,0.05); padding:3px 8px; border-radius:4px;">${relic.rarity.toUpperCase()}</span>
                    </div>
                    
                    <div style="background: rgba(0,0,0,0.5); padding: 12px; border-radius: 10px; border: 1px dashed ${color}33; margin-bottom: 16px;">
                        <div style="font-size: 0.8rem; color: #fff;">
                            <span style="color: #93c5fd;">Poder Básico: ${relic.atk || relic.def || relic.hp || "Especial"}</span>
                        </div>
                    </div>
                `;
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.style.cssText = `width:100%; border:1px solid ${color};`;
    btn.innerText = "Ler História do Artefato";
    btn.onclick = () =>
      showLoreStoryReveal({ name: loreTitle, story: baseLoreText });
    card.appendChild(btn);

    container.appendChild(card);
  });
}

// Sistema de Abas
function openTab(tabName, button) {
  document
    .querySelectorAll(".tab-content")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));

  document.getElementById(tabName).classList.add("active");
  if (button) button.classList.add("active");
}

// Inicialização
window.onload = () => {
  renderMap();
  renderBestiary();
  handlePendingFragmentFromUrl();
  renderMemories();
  renderCompanions();
  renderRelics();

  const state = loadGameState();
  const hero = state ? state.hero : null;
  if (hero && hero.loreChapters) {
    const completas = Object.values(hero.loreChapters).filter(
      (c) => c.completed,
    ).length;
    if (completas >= 4) {
      const eraSecreta = document.getElementById("era-secreta");
      if (eraSecreta) eraSecreta.style.display = "block"; // Or flex if flex is default

      if (hero.claimedUltimateLore && eraSecreta) {
        eraSecreta.innerHTML =
          '<div style="color: #fbbf24; font-size: 1.2rem; text-align:center; padding: 20px;">Você renasceu através do conhecimento. A Chama vive em você.</div>';
      }
    }
  }

  if (pendingFragmentToHighlight) {
    setTimeout(() => {
      const node = document.querySelector(".memory-page.highlighted-memory");
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "center" });
        node.classList.add("pulse-highlight");
        history.replaceState(null, "", window.location.pathname);
      }
    }, 120);
  }
};

window.claimUltimateLoreSecret = function () {
  const state = loadGameState();
  if (!state || !state.hero) return;
  const hero = state.hero;
  if (hero.claimedUltimateLore) {
    alert("Você já reivindicou a Dádiva dos Primeiros.");
    return;
  }

  hero.claimedUltimateLore = true;
  hero.gold = (hero.gold || 0) + 50000;
  hero.skillPoints = (hero.skillPoints || 0) + 5;

  localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(state.appState));

  showLoreStoryReveal({
    name: "A Dádiva dos Primeiros",
    story:
      "A luz irrompe da escuridão. O conhecimento transcendeu a mortalidade. Você absorveu a essência dos criadores originais do Santuário. Ouro chove em seus bolsos e sua mente expande além do limite humano. (50,000 de Ouro e +5 Pontos de Habilidade ganhos!)",
  });

  const eraSecreta = document.getElementById("era-secreta");
  if (eraSecreta)
    eraSecreta.innerHTML =
      '<div style="color: #fbbf24; font-size: 1.2rem; text-align:center; padding: 20px;">Você renasceu através do conhecimento. A Chama vive em você.</div>';
};

window.addEventListener("storage", (event) => {
  if (event.key === GAME_SAVE_KEY) {
    renderBestiary();
    renderMemories();
    renderDiaryFeed();
  }
});

// ==========================================================
//  DIÁRIO DO AVENTUREIRO (MOTOR AUTO-NARRATIVO)
// ==========================================================
function renderDiaryFeed() {
  const feed = document.getElementById("diary-feed");
  if (!feed) return;

  const state = loadGameState();
  const hero = state ? state.hero : null;
  if (!hero) {
    feed.innerHTML =
      '<div style="color:#9ca3af; font-style:italic; text-align:center;">Nenhum personagem carregado. O diário está vazio.</div>';
    return;
  }

  // Migração do diário antigo (se existir)
  const oldDiary = localStorage.getItem("sanctuary_diary");
  if (oldDiary && oldDiary.trim().length > 0) {
    if (!hero.diaryEntries) hero.diaryEntries = [];
    hero.diaryEntries.unshift({
      id: "legacy_" + Date.now(),
      text: oldDiary,
      type: "manual",
      date: "Relato do Passado",
    });
    localStorage.removeItem("sanctuary_diary");
    localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(state.appState));
  }

  const entries = hero.diaryEntries || [];
  if (entries.length === 0) {
    feed.innerHTML =
      '<div style="color:#9ca3af; font-style:italic; text-align:center; padding: 40px 0;">As páginas estão em branco. Suas ações e anotações preencherão este tomo.</div>';
    return;
  }

  feed.innerHTML = "";
  // Render from newest to oldest
  const reversedEntries = [...entries].reverse();
  reversedEntries.forEach((entry) => {
    const isAuto = entry.type === "auto";
    // Small random rotation between -1deg and 1.5deg for handwriting realism
    const randomRot = (Math.random() * 2.5 - 1).toFixed(2);
    const aiBadge = isAuto
      ? '<span class="diary-entry-ai-tag">Memória induzida pelas trevas...</span>'
      : "";

    feed.innerHTML += `
                    <div class="diary-entry-item" style="transform: rotate(${randomRot}deg);">
                        <div class="diary-entry-date">🩸 [${entry.date}]</div>
                        ${aiBadge}
                        <p>${entry.text}</p>
                    </div>
                `;
  });
}

window.addManualDiaryEntry = function () {
  const input = document.getElementById("adventure-diary-input");
  const text = input ? input.value.trim() : "";
  if (!text) return;

  const state = loadGameState();
  if (!state || !state.hero) {
    alert("Nenhum personagem ativo carregado!");
    return;
  }

  const hero = state.hero;
  if (!hero.diaryEntries) hero.diaryEntries = [];

  const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  const dateObj = new Date();
  const dateString = `${dateObj.getDate().toString().padStart(2, "0")}/${(dateObj.getMonth() + 1).toString().padStart(2, "0")} - ${dateObj.getHours().toString().padStart(2, "0")}:${dateObj.getMinutes().toString().padStart(2, "0")}`;

  hero.diaryEntries.push({ id, text, type: "manual", date: dateString });
  localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(state.appState));

  input.value = "";
  renderDiaryFeed();
};

// ==========================================================
//  FOG OF WAR DINÂMICO
// ==========================================================
const mapViewport = document.getElementById("map-container");
const fogOfWar = document.querySelector(".fog-of-war");
if (mapViewport && fogOfWar) {
  mapViewport.addEventListener("mousemove", (e) => {
    const rect = mapViewport.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    fogOfWar.style.background = `radial-gradient(circle at ${x}% ${y}%, transparent 12%, rgba(8,8,12,0.98) 55%)`;
  });
  mapViewport.addEventListener("mouseleave", () => {
    fogOfWar.style.background = `radial-gradient(circle at 50% 50%, transparent 18%, rgba(8,8,12,0.95) 70%)`;
  });
}

// ==========================================================
// SISTEMA DE ENCICLOPÉDIA DE MONSTROS (LIVRO 3D)
// ==========================================================
let currentBookPage = 0;
let totalBookPages = 0;

window.openRealBook = async function () {
  const bookContainer = document.getElementById("offscreen-book-render");
  if (bookContainer) bookContainer.classList.add("open");

  const nav = document.getElementById("real-book-nav");
  if (nav) nav.style.display = "flex";

  if (typeof playScratch === "function") playScratch();

  // Constrói e abre o WebGL
  buildBookInterior();
  await buildThreeBook(totalBookPages);
  openThreeBook();
  if (typeof updatePageTexture === "function") {
    updatePageTexture(0, "book-page-0");
  }
};

window.closeRealBook = function () {
  const bookContainer = document.getElementById("offscreen-book-render");
  if (bookContainer) bookContainer.classList.remove("open");

  const nav = document.getElementById("real-book-nav");
  if (nav) nav.style.display = "none";

  currentBookPage = 0;
  closeThreeBook();

  if (typeof loadedMobs !== "undefined") loadedMobs.clear();

  if (typeof playScratch === "function") playScratch();
};

function buildBookInterior() {
  const book = document.getElementById("real-book");
  const nav = document.getElementById("real-book-nav");
  if (!book) return;

  const saveInfo = loadGameBestiary();
  const savedKills = saveInfo.bestiary || {};

  let html = "";
  let pageIndex = 0;

  // PÁGINA 0: Prefácio e Índice
  html += `
        <div class="page" id="book-page-0" style="--right-z: 100; --left-z: 1; --page-z: 20px;">
            <div class="page-front">
                <h2 class="enc-title">Prefácio</h2>
                <p class="enc-text" style="font-style: italic;">"Muitos pereceram tentando documentar os horrores deste Santuário. O que você tem em mãos não é um livro de contos, mas um testamento de sobrevivência."</p>
                <div style="margin-top: 40px; text-align: center; opacity: 0.5;">
                    <img src="assets/images/skull_icon.webp" onerror="this.style.display='none'" style="width: 80px; filter: grayscale(1) invert(1);" />
                </div>
                <div style="position:absolute; bottom:20px; right:30px; font-family:'Georgia', serif; font-size:1rem; color:#8a7a63; opacity:0.8;">I</div>
            </div>
            <div class="page-back">
                <h2 class="enc-title">Índice Geral</h2>
                <ul class="enc-list index-list">
    `;

  const mobs = LORE_DB.bestiary || [];
  mobs.forEach((mob, idx) => {
    const targetPage = 1 + idx * 3;
    const displayPageNum = targetPage * 2 - 1;
    html += `<li onclick="jumpToBookPage(${targetPage})" style="color: #c9bfa7; font-family: 'UnifrakturCook', cursive; font-size: 1.5rem; border-bottom: 1px dashed rgba(158, 27, 27, 0.3); padding: 5px 0; cursor: pointer; list-style-type: none;">${mob.name} <span style="float:right; font-family:'Georgia', serif; font-size:0.9rem; color:#8a7a63;">Pág ${displayPageNum}</span></li>`;
  });
  html += `
                </ul>
                <div style="position:absolute; bottom:20px; left:30px; font-family:'Georgia', serif; font-size:1rem; color:#8a7a63; opacity:0.8;">II</div>
            </div>
        </div>
    `;
  pageIndex++;

  // Páginas dos Monstros
  mobs.forEach((mob, idx) => {
    const kills =
      getSavedKillCount(savedKills, mob) !== null
        ? getSavedKillCount(savedKills, mob)
        : mob.abates;
    const hasAnat = kills >= mob.anatomia.req;
    const hasFraq = kills >= mob.fraqueza.req;

    const imgHtml = `
            <div class="enc-img" style="display: none; position: relative; border-bottom: 2px solid rgba(59, 23, 11, 0.4); border-top: 2px solid rgba(59, 23, 11, 0.4); margin-bottom: 15px;">
                <img src="bestiary/${mob.id}.webp" onload="this.parentElement.style.display='block'" onerror="this.parentElement.style.display='none'" style="width:100%; height:100%; object-fit:cover;" />
            </div>
        `;

    // Página 1 Física
    let zDepth = (100 - pageIndex) * 0.2;
    let rightZ1 = 100 - pageIndex;
    let leftZ1 = pageIndex + 1;
    html += `
            <div class="page" id="book-page-${pageIndex}" style="--right-z: ${rightZ1}; --left-z: ${leftZ1}; --page-z: ${zDepth}px;">
                <div class="page-front">
                    <h2 class="enc-title">${mob.name}</h2>
                    ${imgHtml}
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span style="font-family: 'Georgia', serif; font-size: 0.85rem; color: #591616; border: 1px solid #591616; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; font-weight: bold;">Espécie: ${mob.category}</span>
                    </div>
                    <h3 class="enc-subtitle" style="margin-top: 0;">Lendas Obscuras</h3>
                    <p class="enc-text drop-cap" id="dyn-lore-idx${idx}-myth"><span style="opacity:0.5; font-style:italic;">Decifrando textos antigos...</span></p>
                    <div style="position:absolute; bottom:20px; right:30px; font-family:'Georgia', serif; font-size:1rem; color:#8a7a63; opacity:0.8;">${pageIndex * 2 - 1}</div>
                </div>
                <div class="page-back">
                    <h3 class="enc-subtitle">Origens e Manifestação</h3>
                    <p class="enc-text drop-cap" id="dyn-lore-idx${idx}-origin"><span style="opacity:0.5; font-style:italic;">Decifrando textos antigos...</span></p>
                    <h3 class="enc-subtitle" style="margin-top:20px;">Boatos Populares</h3>
                    <p class="enc-text" id="dyn-lore-idx${idx}-lore"><span style="opacity:0.5; font-style:italic;">Decifrando textos antigos...</span></p>
                    <div style="position:absolute; bottom:20px; left:30px; font-family:'Georgia', serif; font-size:1rem; color:#8a7a63; opacity:0.8;">${pageIndex * 2}</div>
                </div>
            </div>
        `;
    pageIndex++;

    // Página 2 Física
    let zDepth2 = (100 - pageIndex) * 0.2;
    let rightZ2 = 100 - pageIndex;
    let leftZ2 = pageIndex + 1;
    html += `
            <div class="page" id="book-page-${pageIndex}" style="--right-z: ${rightZ2}; --left-z: ${leftZ2}; --page-z: ${zDepth2}px;">
                <div class="page-front">
                    <h3 class="enc-subtitle">Ecologia e Hábitos</h3>
                    <p class="enc-text drop-cap" id="dyn-lore-idx${idx}-ecology"><span style="opacity:0.5; font-style:italic;">Decifrando textos antigos...</span></p>
                    <div style="margin-top: 30px; border-top: 1px solid rgba(0,0,0,0.2); padding-top: 15px;">
                        <p class="enc-text"><strong>Bioma Nativo:</strong> ${mob.biome}</p>
                        <p class="enc-text"><strong>Abates Confirmados:</strong> ${kills}</p>
                    </div>
                    <div style="position:absolute; bottom:20px; right:30px; font-family:'Georgia', serif; font-size:1rem; color:#8a7a63; opacity:0.8;">${pageIndex * 2 - 1}</div>
                </div>
                <div class="page-back">
                    <h3 class="enc-subtitle">Registros de Combate</h3>
                    <ul class="enc-list" style="margin-bottom: 20px;">
                        <li><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align: middle;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> <b>Vitalidade Estimada:</b> ${mob.status.hp}</li>
                        <li><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align: middle;"><path d="M19.7 4.3c-.4-.4-1-.4-1.4 0L14 8.6c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l4.3-4.3c.4-.4.4-1 0-1.4zM4.3 19.7c.4.4 1 .4 1.4 0l4.3-4.3c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L4.3 18.3c-.4.4-.4 1 0 1.4zM19.7 19.7c.4-.4 1-.4 1.4 0l-4.3-4.3c-.4-.4-.4-1 0-1.4-.4-.4-1-.4-1.4 0l4.3 4.3c.4.4.4 1 0 1.4zM4.3 4.3c-.4-.4-1-.4-1.4 0l4.3 4.3c.4.4.4 1 0 1.4.4.4 1 .4 1.4 0L4.3 5.7c-.4-.4-.4-1 0-1.4zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg> <b>Força de Ataque:</b> ${mob.status.atk}</li>
                        <li><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align: middle;"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 8.89-7 10-3.87-1.11-7-5.33-7-10v-4.7l7-3.12z"/></svg> <b>Resistência Base:</b> ${mob.status.def}</li>
                    </ul>
                    <p class="enc-text">Anomalias táticas observadas:</p>
                    <ul class="enc-list" style="font-size:0.85rem; padding-bottom: 10px; border-bottom: 1px solid rgba(0,0,0,0.2);">
                        ${(mob.passivas || []).length > 0 ? mob.passivas.map((p) => `<li><b>${p.toUpperCase()}</b></li>`).join("") : "<li>Sem comportamentos anômalos registrados.</li>"}
                    </ul>
                    <div style="position:absolute; bottom:20px; left:30px; font-family:'Georgia', serif; font-size:1rem; color:#8a7a63; opacity:0.8;">${pageIndex * 2}</div>
                </div>
            </div>
        `;
    pageIndex++;

    // Página 3 Física
    let zDepth3 = (100 - pageIndex) * 0.2;
    let rightZ3 = 100 - pageIndex;
    let leftZ3 = pageIndex + 1;
    html += `
            <div class="page" id="book-page-${pageIndex}" style="--right-z: ${rightZ3}; --left-z: ${leftZ3}; --page-z: ${zDepth3}px;">
                <div class="page-front">
                    <h3 class="enc-subtitle">Estudo Anatômico</h3>
                    <div class="enc-text ${hasAnat ? "drop-cap" : "locked-data"}" id="dyn-lore-idx${idx}-anatomy">${hasAnat ? '<span style="opacity:0.5; font-style:italic;">Decifrando textos antigos...</span>' : `<i>Requer ${mob.anatomia.req} abates para descobrir.</i>`}</div>
                    
                    <h3 class="enc-subtitle" style="margin-top: 25px;">Análise de Fraqueza</h3>
                    <div class="enc-text ${hasFraq ? "drop-cap" : "locked-data"}" id="dyn-lore-idx${idx}-weakness">${hasFraq ? '<span style="opacity:0.5; font-style:italic;">Decifrando textos antigos...</span>' : `<i>Requer ${mob.fraqueza.req} abates para descobrir.</i>`}</div>
                </div>
                <div class="page-back">
                    <h2 class="enc-title" style="margin-top:80px; border:none;">Fim do Registro</h2>
                    <p class="enc-text" style="text-align:center; opacity:0.6;">- Escrito pelo Erudito Esquecido -</p>
                    <div style="position:absolute; bottom:20px; left:30px; font-family:'Georgia', serif; font-size:1rem; color:#8a7a63; opacity:0.8;">${pageIndex * 2}</div>
                </div>
            </div>
        `;
    pageIndex++;
  });

  const cover = book.innerHTML;
  book.innerHTML = cover + html;

  currentBookPage = 0;
  totalBookPages = pageIndex;

  if (nav) nav.style.display = "flex";
  checkAndLoadDynamicLore(0);
}

let loadedMobs = new Set();
async function checkAndLoadDynamicLore(pageIndex) {
  if (pageIndex === 0) return;

  const mobIndex = Math.floor((pageIndex - 1) / 3);
  const mobs = LORE_DB.bestiary || [];

  if (mobIndex >= 0 && mobIndex < mobs.length) {
    const mob = mobs[mobIndex];
    // Ensure duplicated mobs get unique caching per index so we don't break UI lookup
    if (loadedMobs.has(mobIndex)) return;

    loadedMobs.add(mobIndex); // Mark as requested

    const saveInfo = loadGameBestiary();
    const savedKills = saveInfo.bestiary || {};
    const kills =
      getSavedKillCount(savedKills, mob) !== null
        ? getSavedKillCount(savedKills, mob)
        : mob.abates;

    const hasAnat = kills >= mob.anatomia.req;
    const hasFraq = kills >= mob.fraqueza.req;

    const loreData = await fetchFullMobLore(mob, kills);

    // Helper para colocar a primeira letra num span pro html2canvas reconhecer
    const wrapDropCap = (text) => {
      if (!text) return "";
      const trimmed = text.trim();
      if (!trimmed) return "";
      const first = trimmed.charAt(0);
      const rest = trimmed.slice(1);
      let result = `<span class="drop-cap-letter">${first}</span>${rest}`;
      return result.replace(/\n\n/g, "</p><p class='enc-text'>");
    };

    // Update UI robustly with optional chaining to prevent crashes
    const loreEl = document.getElementById(`dyn-lore-idx${mobIndex}-lore`);
    if (loreEl) loreEl.innerHTML = wrapDropCap(loreData.lore);

    const mythEl = document.getElementById(`dyn-lore-idx${mobIndex}-myth`);
    if (mythEl) mythEl.innerHTML = wrapDropCap(loreData.myth);

    const originEl = document.getElementById(`dyn-lore-idx${mobIndex}-origin`);
    if (originEl) originEl.innerHTML = wrapDropCap(loreData.origin);

    const ecologyEl = document.getElementById(
      `dyn-lore-idx${mobIndex}-ecology`,
    );
    if (ecologyEl) ecologyEl.innerHTML = wrapDropCap(loreData.ecology);

    const survivorEl = document.getElementById(
      `dyn-lore-idx${mobIndex}-survivor`,
    );
    if (survivorEl)
      survivorEl.innerHTML = `<div class="enc-quote">${loreData.survivor}</div>`;

    const anatEl = document.getElementById(`dyn-lore-idx${mobIndex}-anatomy`);
    if (anatEl && hasAnat) anatEl.innerHTML = wrapDropCap(loreData.anatomy);

    const weakEl = document.getElementById(`dyn-lore-idx${mobIndex}-weakness`);
    if (weakEl && hasFraq) weakEl.innerHTML = wrapDropCap(loreData.weakness);

    // Atualizar as texturas no WebGL para que o texto gerado apareça no livro 3D
    const p1 = 1 + mobIndex * 3;
    const p2 = 2 + mobIndex * 3;
    const p3 = 3 + mobIndex * 3;
    if (typeof updatePageTexture === "function") {
      updatePageTexture(p1, `book-page-${p1}`);
      setTimeout(() => updatePageTexture(p2, `book-page-${p2}`), 250);
      setTimeout(() => updatePageTexture(p3, `book-page-${p3}`), 500);
    }
  }
}

let isTurningPage = false;
function turnRealPage(direction) {
  if (isTurningPage && !isJumpingPage) return;

  if (direction === 1 && currentBookPage <= totalBookPages) {
    if (!isJumpingPage) isTurningPage = true;
    playPaperSound();
    const targetPageId = currentBookPage;

    const page = document.getElementById(`book-page-${targetPageId}`);
    if (page) page.classList.add("turned");

    turnThreePage(targetPageId, direction);

    currentBookPage++;
    if (!isJumpingPage) {
      setTimeout(() => {
        checkAndLoadDynamicLore(currentBookPage);
        isTurningPage = false;
      }, 800);
    }
  } else if (direction === -1 && currentBookPage > 0) {
    if (!isJumpingPage) isTurningPage = true;
    playPaperSound();
    const targetPageId = currentBookPage - 1;

    const page = document.getElementById(`book-page-${targetPageId}`);
    if (page) page.classList.remove("turned");

    turnThreePage(targetPageId, direction);

    currentBookPage--;
    if (!isJumpingPage) {
      setTimeout(() => {
        checkAndLoadDynamicLore(currentBookPage);
        isTurningPage = false;
      }, 800);
    }
  }
}

window.handleBookClick = function (pageIndex, isBack, uv) {
  const side = isBack ? ".page-back" : ".page-front";
  const pageEl = document.querySelector(`#book-page-${pageIndex} ${side}`);
  if (!pageEl) return;

  // UV maps to 680x800 texture (Y is inverted in WebGL)
  const clickX = uv.x * 680;
  const clickY = (1 - uv.y) * 800;

  // Helper to get absolute offset relative to the page side container
  function getOffset(elem, parent) {
    let top = 0,
      left = 0;
    while (elem && elem !== parent && elem !== document.body) {
      top += elem.offsetTop;
      left += elem.offsetLeft;
      elem = elem.offsetParent;
    }
    return { top, left };
  }

  // Find all clickable elements
  const clickables = pageEl.querySelectorAll("li[onclick], button, .clickable");

  for (let el of clickables) {
    const offset = getOffset(el, pageEl);
    const top = offset.top;
    const bottom = top + el.offsetHeight;
    const left = offset.left;
    const right = left + el.offsetWidth;

    // Add 10px padding tolerance for easier clicking
    if (
      clickY >= top - 10 &&
      clickY <= bottom + 10 &&
      clickX >= left - 10 &&
      clickX <= right + 10
    ) {
      el.click();
      break; // Stop after first click
    }
  }
};

let isJumpingPage = false;
function jumpToBookPage(target) {
  if (target === currentBookPage || isJumpingPage) return;

  isJumpingPage = true;
  const diff = Math.abs(target - currentBookPage);
  const direction = target > currentBookPage ? 1 : -1;
  let delay = 0;

  // override turn lock specifically for programmatic multi-jump
  for (let i = 0; i < diff; i++) {
    setTimeout(() => {
      turnRealPage(direction);
    }, delay);
    delay += 120; // Slightly faster jumps for better feel
  }

  setTimeout(() => {
    isJumpingPage = false;
    isTurningPage = false;
    checkAndLoadDynamicLore(currentBookPage);
  }, delay + 800);
}
// --- MASTERPIECE TIMELINE FEATURES ---
function setupConstellationFeatures() {
  const map = document.querySelector(".constellation-map");
  const minorConstellations = document.getElementById("minor-constellations");
  const clusters = document.querySelectorAll(".constellation-cluster");

  if (!map) return;

  // 1. Parallax
  map.addEventListener("mousemove", (e) => {
    const rect = map.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Move minor constellations slightly with the mouse
    if (minorConstellations) {
      minorConstellations.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    }

    // Move main clusters opposite to the mouse for depth
    clusters.forEach((cluster) => {
      cluster.style.transform = `translate(${x * -35}px, ${y * -35}px)`;
    });
  });

  map.addEventListener("mouseleave", () => {
    if (minorConstellations)
      minorConstellations.style.transform = `translate(0px, 0px)`;
    clusters.forEach((cluster) => {
      cluster.style.transform = `translate(0px, 0px)`;
    });
  });

  // 2. Click-to-Focus
  clusters.forEach((cluster) => {
    cluster.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent clicking map from clearing it immediately

      // Clear others
      clusters.forEach((c) => c.classList.remove("active-focus"));

      cluster.classList.add("active-focus");
      map.classList.add("overlay-active");
    });
  });

  // Dismiss focus
  map.addEventListener("click", () => {
    clusters.forEach((c) => c.classList.remove("active-focus"));
    map.classList.remove("overlay-active");
  });
}

document.addEventListener("DOMContentLoaded", setupConstellationFeatures);
setTimeout(setupConstellationFeatures, 500); // Fallback for dynamic load

// --- VITE ES6 MODULE GLOBAL BINDINGS ---
if (typeof closeLoreStoryOverlay === "function")
  window.closeLoreStoryOverlay = closeLoreStoryOverlay;
if (typeof addManualDiaryEntry === "function")
  window.addManualDiaryEntry = addManualDiaryEntry;
if (typeof claimUltimateLoreSecret === "function")
  window.claimUltimateLoreSecret = claimUltimateLoreSecret;
if (typeof closeMapPanel === "function") window.closeMapPanel = closeMapPanel;
if (typeof openTab === "function") window.openTab = openTab;

// Substitui o openTab do global.js temporariamente para despachar resize
const originalOpenTab = window.openTab;
window.openTab = function (tabName, elmnt) {
  if (typeof originalOpenTab === "function") {
    originalOpenTab(tabName, elmnt);
  } else {
    // Fallback básico
    const tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    const tablinks = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    if (elmnt) elmnt.classList.add("active");
  }

  if (tabName === "bestiario") {
    setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
  }
};

// --- VITE ES6 MODULE GLOBAL BINDINGS ---
if (typeof claimUltimateLoreSecret === "function")
  window.claimUltimateLoreSecret = claimUltimateLoreSecret;
if (typeof openTab === "function") window.openTab = openTab;
if (typeof closeLoreStoryOverlay === "function")
  window.closeLoreStoryOverlay = closeLoreStoryOverlay;

// --- DEEP DYNAMIC BINDINGS ---
if (typeof animateMemoryPages === "function")
  window.animateMemoryPages = animateMemoryPages;
if (typeof getMemoryFragmentDefinition === "function")
  window.getMemoryFragmentDefinition = getMemoryFragmentDefinition;
if (typeof handlePendingFragmentFromUrl === "function")
  window.handlePendingFragmentFromUrl = handlePendingFragmentFromUrl;
if (typeof renderMap === "function") window.renderMap = renderMap;
if (typeof setMemoryFilter === "function")
  window.setMemoryFilter = setMemoryFilter;
if (typeof increaseAffinity === "function")
  window.increaseAffinity = increaseAffinity;
if (typeof closeMapPanel === "function") window.closeMapPanel = closeMapPanel;
if (typeof readMemoryFragment === "function")
  window.readMemoryFragment = readMemoryFragment;
if (typeof refreshMemories === "function")
  window.refreshMemories = refreshMemories;
if (typeof renderCompanions === "function")
  window.renderCompanions = renderCompanions;
if (typeof updateMemorySearch === "function")
  window.updateMemorySearch = updateMemorySearch;
if (typeof closeLoreStoryOverlay === "function")
  window.closeLoreStoryOverlay = closeLoreStoryOverlay;
if (typeof typeWriter === "function") window.typeWriter = typeWriter;
if (typeof renderRelics === "function") window.renderRelics = renderRelics;
if (typeof renderBestiary === "function")
  window.renderBestiary = renderBestiary;
if (typeof getSavedKillCount === "function")
  window.getSavedKillCount = getSavedKillCount;
if (typeof getSaveInfoText === "function")
  window.getSaveInfoText = getSaveInfoText;
if (typeof getQueryParameter === "function")
  window.getQueryParameter = getQueryParameter;
if (typeof renderDiaryFeed === "function")
  window.renderDiaryFeed = renderDiaryFeed;
if (typeof renderMemories === "function")
  window.renderMemories = renderMemories;
if (typeof showLoreActivation === "function")
  window.showLoreActivation = showLoreActivation;
if (typeof playScratch === "function") window.playScratch = playScratch;
if (typeof showLoreStoryReveal === "function")
  window.showLoreStoryReveal = showLoreStoryReveal;
if (typeof openTab === "function") window.openTab = openTab;
if (typeof loadGameState === "function") window.loadGameState = loadGameState;
if (typeof loadGameBestiary === "function")
  window.loadGameBestiary = loadGameBestiary;
if (typeof refreshGameBestiary === "function")
  window.refreshGameBestiary = refreshGameBestiary;

if (typeof openRealBook === "function") window.openRealBook = openRealBook;
if (typeof closeRealBook === "function") window.closeRealBook = closeRealBook;
if (typeof turnRealPage === "function") window.turnRealPage = turnRealPage;
if (typeof jumpToBookPage === "function")
  window.jumpToBookPage = jumpToBookPage;
if (typeof handleBookClick === "function")
  window.handleBookClick = handleBookClick;

// ===================== ALT+ENTER FULLSCREEN TOGGLE =====================
let isFs = true;
window.addEventListener("keydown", async (e) => {
  if (e.altKey && e.key === "Enter") {
    e.preventDefault();
    isFs = !isFs;
    try {
      const { invoke } = window.__TAURI__.core;
      await invoke("set_fullscreen", { state: isFs });
    } catch (err) {
      console.warn("Erro ao mudar tela cheia:", err);
    }
  }
})