const ERROR_NO_CONNECTION = "ERROR_NO_CONNECTION";
const MODEL_GEMINI = "MODEL_GEMINI";

import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

// Initialize when imported
export function initGemini(apiKey) {
  if (apiKey) {
    try {
      genAI = new GoogleGenerativeAI(apiKey);
      console.log("Gemini AI Initialized successfully.");
    } catch (e) {
      console.error("Failed to initialize Gemini:", e);
    }
  }
}

// In-memory cache to avoid repeated requests during a session
const loreCache = {};

export async function fetchFullMobLore(mob, kills) {
  if (!genAI) {
    return {
      lore: "Conexão mágica rompida. O oráculo (API Key) não foi configurado no .env",
      origin: ERROR_NO_CONNECTION,
      ecology: ERROR_NO_CONNECTION,
      anatomy: ERROR_NO_CONNECTION,
      weakness: ERROR_NO_CONNECTION,
    };
  }

  // Cache key based on kills range (changes every 10 kills to show progression)
  const cacheKey = `${mob.id}_${Math.floor(kills / 10)}`;
  if (loreCache[cacheKey]) {
    return loreCache[cacheKey];
  }

  const model = genAI.getGenerativeModel({ model: MODEL_GEMINI });

  const prompt = `Você é um 'Erudito Amaldiçoado', escrevendo um compêndio brutal e impiedoso de Dark Fantasy estilo Berserk, Bloodborne e H.P. Lovecraft. 
O monstro é '${mob.name}' (Bioma: ${mob.biome}, HP: ${mob.status?.hp}, Atk: ${mob.status?.atk}).
O jogador já abateu ${kills} dessas criaturas. A narrativa deve ser extremamente sombria, visceral e pesada.

Gere exatamente um JSON válido com a seguinte estrutura. PARA CADA CAMPO, ESCREVA TEXTOS LONGOS (2 A 4 PARÁGRAFOS DENSOS):
{
  "lore": "Lendas urbanas macabras e boatos aterrorizantes sobre as atrocidades que a criatura cometeu nas vilas. (Longo, detalhado, focado no terror psicológico dos camponeses).",
  "origin": "A origem real, sombria e repulsiva da criatura. Como a magia negra, corrupção ou biologia distorcida a criou. (Mantenha diferente da lore, foque no grotesco).",
  "ecology": "Hábitos de caça sádicos, como ela persegue e destrói suas vítimas no ecossistema.",
  "anatomy": "Análise anatômica visceral. Descreva texturas de carne apodrecida, ossos expostos, cheiros de sangue coagulado e anomalias físicas.",
  "weakness": "A fraqueza biológica ou mágica profunda da criatura. Detalhe como um caçador pode quebrar seus ossos ou explorar falhas vitais.",
  "survivor": "Um relato em primeira pessoa de um caçador que perdeu a sanidade após sobreviver ao monstro. (Intenso, desesperado, com falas de loucura).",
  "myth": "Um mito ou rito proibido cultuado por hereges envolvendo o abate ou sacrifício para esta criatura."
}

Retorne APENAS o JSON, sem marcações markdown como \`\`\`json.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Extract JSON using regex in case the model adds conversational text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    const parsed = JSON.parse(text);
    loreCache[cacheKey] = parsed;
    return parsed;
  } catch (error) {
    console.error("Gemini API Error or Parse Error:", error);

    // Fallback offline caso a API Key do usuário falhe ou expire
    const isBoss = mob.category === "boss";

    const origins = {
      "Catacumbas Sombrias":
        "Nasceu das sombras podres das criptas esquecidas. O ar gélido e o cheiro de morte moldaram sua essência, forçando uma evolução bizarra para sobreviver à ausência de luz. Seus pulmões se encheram de poeira óssea, enquanto seus olhos apodreceram, substituídos por um sexto sentido macabro guiado pelo pulsar de corações vivos. \n\nCriada pela conjunção profana de cadáveres abandonados pela Igreja e rituais necromânticos fracassados, ela vaga arrastando correntes enferrujadas que se fundiram à sua própria carne derretida. As paredes das catacumbas gemem com a sua simples passagem, como se a própria estrutura rejeitasse sua existência aberrante.",
      "Pântano da Peste":
        "Uma aberração criada pelo lodo tóxico e águas venenosas. Cada célula de seu corpo carrega a praga ancestral que dizimou os primeiros habitantes do brejo. Quando caminha, poças de bile negra se formam, derretendo raízes e afogando pequenos animais em segundos.\n\nNasceu não do ventre de uma fera, mas do tumor pulsante que cresce nas árvores centenárias. É o vômito da natureza, moldado em garras afiadas e dentes que nunca param de sangrar. Uma criatura amaldiçoada pela própria existência, que sente apenas o desespero de matar para aliviar a sua queimação interna contínua.",
      "Forja Profana do Abismo":
        "Forjado literalmente nas chamas do inferno. O metal derretido e o fogo negro se fundiram à sua carne, criando uma máquina de matar movida a ódio puro. Parafusos incandescentes perfuram suas juntas e fumaça de enxofre escapa de seus poros abertos.\n\nSua origem remonta aos artesãos corrompidos de Yharnam, que tentaram criar uma armadura viva usando o sangue coagulado de prisioneiros hereges. O experimento tomou consciência. A criatura agora busca o ferro de espadas para mastigar, fundindo-o ao seu próprio corpo colossal para aumentar sua carapaça demoníaca.",
      "Cavernas de Magma":
        "Eclodiu das profundezas escaldantes da montanha. Seu sangue é magma líquido e sua respiração queima o oxigênio ao redor, criando um vácuo sufocante antes mesmo que o ataque atinja o alvo.\n\nDizem que no centro do magma repousa um núcleo corrompido, a alma aprisionada de uma divindade morta. Ela alimenta a criatura com raiva incandescente. Cada passo que dá incinera a terra, e suas garras derretem armaduras de placas inteiras como se fossem manteiga, torrando guerreiros dentro de seus próprios trajes.",
      "Floresta das Sombras":
        "A natureza corrompida deu vida a este pesadelo. Entre raízes apodrecidas e neblina densa, aprendeu a ser o caçador perfeito na escuridão. Seus membros alongados imitam os galhos mortos, permitindo que empale vítimas desavisadas de cima.\n\nSurgiu a partir do sangue negro derramado durante o grande abate das bruxas do Leste. As árvores absorveram o sangue, e de seus troncos rasgados, essa abominação brotou. Ela chora como uma criança no escuro para atrair viajantes perdidos, antes de arrancar-lhes a pele.",
      "Abismo de Cristal":
        "Uma anomalia cristalina. O frio absoluto do abismo congelou seu coração, substituindo-o por um núcleo de pura energia mágica e impiedosa. Sua superfície reflete os pesadelos mais sombrios daqueles que ousam olhar.\n\nA lenda diz que antigas feiticeiras tentaram aprisionar a essência do Abismo dentro de joias perfeitas. O abismo estilhaçou a joia, incorporou as lâminas afiadas de cristal em carne profana e formou este predador frio e silencioso, que perfura os pulmões dos guerreiros antes mesmo que eles percebam o perigo.",
      "Corredores do Eclipse":
        "Uma criatura gerada pelo rasgo entre dimensões. Não pertence a este mundo, alimentando-se do vazio e da escuridão eterna. Suas bordas parecem desfocadas, pois sua própria existência rasga o tecido da realidade onde pisa.\n\nCriada no exato momento em que o sol negro sangrou sobre os céus de Lordran, ela é um amálgama de almas que não encontraram descanso. Possui braços e pernas retorcidos em ângulos anômalos, movendo-se com espasmos erráticos, sempre com fome do calor que falta no vazio de onde foi extirpada.",
    };

    const ecologys = {
      boss: "Sua presença afeta a própria realidade ao redor. Criaturas menores fogem ou enlouquecem, enquanto o clima se distorce para refletir sua fúria impiedosa e sede de sangue. O simples respirar desta calamidade apodrece a grama num raio de um quilômetro.\n\nEle não caça para se alimentar, mas sim por pura crueldade artística. Empala cadáveres mutilados como troféus e os utiliza como sinais de alerta. Qualquer guerreiro que tente entrar no covil sentirá a pressão no peito, um presságio claro da morte iminente e sem honra.",
      elite:
        "Caça solitário ou lidera bandos de bestas menores. É um predador alfa implacável, cujo território é sempre demarcado por restos mortais carbonizados ou dilacerados. Não deixa rastros, mas seus asseclas fazem a sujeira por ele.\n\nCostuma torturar as vítimas antes de desferir o golpe final, arrancando membros não vitais apenas para ouvir o eco dos gritos na escuridão. Especialistas alertam que atacar esse predador é aceitar uma morte dolorosamente lenta.",
      comum:
        "Age puramente por instinto e fome canibal. Costuma emboscar desavisados nas áreas mais obscuras de seu habitat, aproveitando-se do número ou do relevo para despedaçar a presa.\n\nÉ atraído pelo cheiro de suor e sangue coagulado de caçadores já exaustos. Frequentemente usa os restos de companheiros mortos para atrair o bando inteiro, atacando como uma horda ensandecida.",
      monster:
        "Age puramente por instinto e fome canibal. Costuma emboscar desavisados nas áreas mais obscuras de seu habitat, aproveitando-se do número ou do relevo para despedaçar a presa.\n\nÉ atraído pelo cheiro de suor e sangue coagulado de caçadores já exaustos. Frequentemente usa os restos de companheiros mortos para atrair o bando inteiro, atacando como uma horda ensandecida.",
    };

    const loreText = `${mob.lore ? mob.lore + " " : ""}${isBoss ? "Uma calamidade viva que assombra as ruínas abandonadas do Santuário, sua silhueta deformada foi vista por peregrinos momentos antes do massacre absoluto. " : ""}Os aldeões sussurram histórias terríveis nas tavernas infestadas de moscas, afirmando que a mera visão desta criatura basta para congelar o sangue e levar guerreiros veteranos à loucura instantânea.\n\nMuitos registros nos grimórios da Inquisição relatam vilarejos inteiros que amanheceram dizimados, com marcas de garras rasgando até mesmo o aço temperado. As lendas contam que a criatura se alimenta do desespero silencioso das vítimas.`;
    const originText =
      origins[mob.biome] ||
      "Documentos antigos sugerem origens terríveis encobertas por lendas obscuras que a Igreja apagou. Nascido da corrupção, sua carne profana não tem lugar sob a luz do sol.\n\nMuitos tentaram purificar sua origem usando o Fogo Sagrado, apenas para descobrir que as cinzas dessa aberração conseguem tomar forma novamente na escuridão.";
    const ecologyText = ecologys[mob.category] || ecologys["monster"];

    return {
      lore: loreText,
      origin: originText,
      ecology: ecologyText,
      anatomy:
        "Sua estrutura interna desafia a biologia convencional e ofende os olhos. Músculos hipertrofiados de um vermelho-escuro adoentado são fundidos diretamente a cartilagens espinhosas, cravadas com cristais de magia sombria e fragmentos de ossos de suas presas anteriores.\n\nVasos sanguíneos escuros e putrefatos pulsam visivelmente sob a pele coriácea, que exala um odor doentio de carne velha e cobre azedo. Os fluidos de seu corpo são tão ácidos que derretem lâminas comuns de aço carbono em poucas horas de combate.",
      weakness:
        "Estudos de caçadores veteranos, muitos deles loucos e confinados em sanatórios, sugerem que impactos brutais e concentrados em suas articulações inferiores quebram sua postura de forma definitiva.\n\nA magia da luz perfura sua pele de obsidiana causando necrose profunda nos tecidos abissais. Explorar essas fraturas expostas com lâminas serrilhadas e untadas de óleo sagrado é a única garantia de que a criatura não se regenerará do pó.",
      survivor: `"Minha lâmina não cortava... o fogo da tocha não queimava sua pele podre... Meus companheiros choravam enquanto eram consumidos aos poucos, pedaço por pedaço. Eu vi os olhos vermelhos e vazios na escuridão... E quando ela me olhou... eu soube que Deus não estava mais lá. Eu soube que estávamos no inferno." - Fragmento rasgado do diário de Kaelen, o Último Patrulheiro (Atualmente no Asilo dos Malditos)`,
      myth: "Os Hereges do Lodo sussurram à beira da fogueira que se você derramar sangue em uma encruzilhada maldita e entoar o nome profano da besta sete vezes... ela rastejará para buscar sua alma. Eles dizem que quem a invoca ganha 3 dias de força absurda antes de ter o tórax violentamente implodido.",
    };
  }
}

export async function fetchDynamicDiaryEntry(context) {
  if (!genAI) {
    return (
      context.baseText ||
      "As sombras ofuscam meus pensamentos. Não consigo escrever..."
    );
  }

  const model = genAI.getGenerativeModel({ model: MODEL_GEMINI });

  let eventDesc = "";
  if (context.eventType === "boss_kill") {
    eventDesc = `Eu acabei de matar o Lorde/Chefe chamado '${context.enemyName}'. Estou no andar ${context.dungeonLevel} das profundezas. Meu HP restante é ${context.hpPercent}% (se for baixo, estou exausto e quase morto; se for alto, matei com facilidade e imponência).`;
  } else if (context.eventType === "level_up") {
    eventDesc = `Eu acabei de evoluir para o nível ${context.level}. Sinto o poder fluindo nas minhas veias, mas também sinto que estou perdendo parte da minha humanidade e sanidade para o Abismo.`;
  } else if (context.eventType === "relic_found") {
    eventDesc = `Eu encontrei um artefato ancestral e lendário chamado '${context.relicName}'. Ele exala uma aura corrompida e antiga.`;
  }

  const prompt = `Você é o 'Aventureiro', escrevendo no seu diário em primeira pessoa. O cenário é Dark Fantasy, no estilo de Dark Souls, Bloodborne e H.P. Lovecraft.
Contexto do que acabou de acontecer: ${eventDesc}

Escreva APENAS UM PARÁGRAFO (3 a 5 frases) denso, visceral, macabro e poético sobre este acontecimento. NÃO use formatações como Markdown, asteriscos, aspas ou títulos. Fale diretamente como se estivesse desabafando e escrevendo no pergaminho sujo de sangue.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    // Remove possible quotes or markdown if the model hallucinates them despite instructions
    text = text
      .replace(/`/g, "")
      .replace(/\*/g, "")
      .replace(/^"|"$/g, "")
      .trim();
    return text;
  } catch (error) {
    console.error("Gemini Diary Error:", error);
    return (
      context.baseText ||
      "A escuridão engoliu as palavras que eu tentava escrever..."
    );
  }
}

export async function fetchDynamicFusion(skill1, skill2, className) {
  if (!genAI) {
    return null;
  }

  const model = genAI.getGenerativeModel({ model: MODEL_GEMINI });

  const prompt = `Você é um mestre criador de habilidades em um RPG Dark Fantasy extremamente sombrio (estilo Bloodborne, Elden Ring, Berserk).
Sua tarefa é criar uma habilidade fundida resultante da combinação de duas habilidades base do(a) ${className}.

Habilidade Base 1: '${skill1.name}' - ${skill1.desc}
Habilidade Base 2: '${skill2.name}' - ${skill2.desc}

Crie a habilidade resultante. Ela deve unir a essência mecânica e temática de ambas, mas ser absurdamente mais macabra e poderosa.
Gere um JSON VÁLIDO com os seguintes campos:
- "name": O nome épico e sombrio da nova habilidade.
- "desc": A descrição narrativa do que a habilidade faz visualmente no campo de batalha (máximo 2 frases).
- "passives": O efeito passivo ao atingir o Rank 5 (ex: "Rank 5: Inimigos mortos explodem em sangue...").
- "effect": Um objeto contendo o efeito de status da habilidade. O campo "type" DEVE ser UM DOS SEGUINTES: "stun", "blind", "poison", "burn", "freeze", "bleed", "buff_def", "buff_atk", "ignoreDef", "regen", "lifesteal". Se for de dano over time ou buff, forneça também "duration" (ex: 2 ou 3) e "ratio" ou "value" (ex: 0.3 ou 40). Se for chance (ex: stun), forneça "chance" (ex: 0.5) e "duration". Exemplo de effect: {"type": "poison", "duration": 3, "ratio": 0.4}

RETORNE APENAS O JSON, NADA MAIS. SEM MARCAÇÕES MARKDOWN COMO \`\`\`json.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Remove markdown e pega só o json
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Fusion Error:", error);
    return null;
  }
}
