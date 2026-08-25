# Plano de Implementação: Motor de Histórias Dinâmico via API (Google Gemini)

Este plano detalha como podemos transformar o livro de Bestiário e a aba de Relíquias usando Inteligência Artificial real para gerar histórias dinâmicas, infinitas e reativas.

## 1. Como Funciona a Arquitetura
Como o jogo roda localmente via Vite, podemos usar a biblioteca oficial do Google para interagir com o Gemini diretamente pelo frontend, protegendo a chave em um arquivo de variáveis de ambiente (`.env`).

Quando o jogador abrir a página de um monstro ou analisar uma relíquia, o jogo enviará um "Prompt" (comando) secreto para a IA contendo o contexto atual do jogador.

**Exemplo de Prompt enviado por trás dos panos:**
> "Escreva um conto de Dark Fantasy macabro em 2 parágrafos sobre um 'Rato Mutante' encontrado nas 'Catacumbas Sombrias'. O jogador já abateu 15 dessas criaturas. Mencione que os dentes do monstro transmitem uma toxina e que o ambiente fede a morte."

**Resposta da IA:** Será gerada uma história sombria única na hora, incorporando os abates do jogador.

## 2. Passo a Passo de Implementação

### Passo A: Configuração e Segurança
- Instalar a SDK do Google: `npm install @google/generative-ai`
- Criar um arquivo `.env` na raiz do projeto (`PaginaInicial/.env`) e adicionar a chave: `VITE_GEMINI_API_KEY=sua_chave_aqui` (O arquivo `.env` não vai para o GitHub, mantendo a segurança).

### Passo B: Criar o Serviço de IA
- Criar o arquivo `src/services/aiService.js`.
- Configurar o `GoogleGenerativeAI` usando a chave do `.env`.
- Criar uma função `generateLoreForEntity(entity, playerStats)` que formata o prompt e chama o modelo `gemini-1.5-flash` (que é absurdamente rápido e ótimo para textos).

### Passo C: Atualização Visual (Loading)
- Como a IA leva de 1 a 2 segundos para responder, vamos atualizar `src/lore.js` e `css/lore.css`.
- Ao virar a página do livro, aparecerá uma animação rúnica ou uma mensagem como *"Decifrando textos antigos..."* enquanto a requisição é feita.
- O texto aparece como se estivesse sendo escrito magicamente na página (`efeito máquina de escrever` ou *fade-in*).

### Passo D: Caching (Otimização)
- Para não gastar requisições à toa e ser instantâneo na segunda vez, salvaremos a história gerada pela IA no Save do jogador (dentro do objeto do monstro/relíquia).
- Se o jogador abater mais 50 monstros, a gente "apaga" a história antiga do cache e pede para a IA gerar uma nova, refletindo a nova experiência do jogador.

## 3. Prós e Contras Desta Escolha
**✅ Prós:**
- **Fator "UAU":** É magia pura. O jogador vai se sentir em um mundo absurdamente profundo, onde cada runa e rato tem uma lenda única.
- **Reatividade:** A história reage se o jogador for nível 100 ou se ele acabou de morrer.
- **Escala Infinita:** Podemos ter 1.000 monstros e não precisaremos escrever a lore de nenhum deles manualmente.

**❌ Contras:**
- Requer conexão com a internet para gerar a primeira vez.
- Pode demorar 2 segundinhos para aparecer o texto (vamos esconder isso com uma animação linda).

---
**Status:** Isolado e pronto para aprovação. Se escolher este, me avise e executarei os passos acima!
