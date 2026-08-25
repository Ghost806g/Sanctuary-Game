# Plano de Implementação: Motor Narrativo Dinâmico (Offline / DB Local)

Este plano detalha como podemos evoluir a lore atual do jogo para um sistema local extremamente robusto, criativo e que não requer internet ou chaves de API, mantendo a performance impecável (zero delay).

## 1. Como Funciona a Arquitetura
Em vez de depender de uma IA externa para escrever o texto na hora, nós vamos criar uma **Máquina de Geração Procedural de Textos** (um sistema inspirado em RPGs de mesa e Dwarf Fortress).

Teremos um arquivo dedicado (ex: `src/data/loreGenerator.js`) que vai conter "fragmentos" ou "peças" de histórias. A magia acontece quando o motor junta essas peças baseando-se no bioma do monstro, seu status e nas ações do jogador (ex: número de abates).

**Exemplo Prático de Geração:**
O motor pega: `[Prefácio do Bioma]` + `[Efeito Visual Baseado no Tipo]` + `[Reação ao Jogador (abates)]` + `[Detalhe Macabro (anatomia)]`.

- *Geração 1 (Para 10 abates de Rato Mutante):* "Nas sombras umidade das catacumbas, criaturas rastejam. O Rato Mutante ataca com garras envenenadas. Você já massacrou alguns, e agora a colônia já reconhece o seu cheiro. Suas vísceras apodrecem rapidamente após a morte."
- *Geração 2 (Para 50 abates):* "As catacumbas tremem com a praga. O Rato Mutante é uma aberração rápida e letal. A carnificina que você causou (50 mortos) fez de você o predador alfa, forçando os sobreviventes a atacar com fúria desesperada. Notei que seus tendões são mais rígidos que aço."

## 2. Passo a Passo de Implementação

### Passo A: Criar o Repositório de Fragmentos
- Criar o arquivo `src/data/loreGenerator.js`.
- Escrever matrizes ricas (Arrays) de textos para Biomas, Categorias (Elite, Boss, Comum), e Comportamentos.
- *Isso exigirá um belo esforço criativo inicial (que eu, Antigravity, farei e redigirei com tom sombrio e épico).*

### Passo B: Função de Tecelagem (Weaving)
- Criar a função `generateDynamicLore(entity, playerStats)` que é 100% síncrona e roda instantaneamente.
- A função usará o `ID` do monstro para criar uma *seed* (semente) consistente. Isso garante que a lore gerada não mude a cada clique, a menos que o jogador atinja um novo "marco" (ex: passou de 10 abates para 20).

### Passo C: Atualizar `lore.js`
- Remover o bloco antigo estático de origens/anatomias.
- Importar o novo motor.
- Como é instantâneo, a visualização no livro será imediata ao virar as páginas (preservando as animações 3D recém consertadas).

## 3. Prós e Contras Desta Escolha
**✅ Prós:**
- **Zero Atraso e 100% Offline:** A página vira e a história já está lá, magicamente montada.
- **Segurança e Estabilidade:** Não há risco de falha de conexão com a API ou de a IA gerar textos fora do contexto ou longos demais, quebrando o layout do livro.
- **Evolução baseada no Jogador:** O texto muda dependendo das vitórias e derrotas do personagem, dando a sensação de que o livro está sendo escrito à mão pela sua jornada.

**❌ Contras:**
- **Variedade Limitada:** Embora tenha centenas de combinações procedurais, em algum momento os "padrões" de construção de frase podem ser notados por um jogador super atento.
- **Maior Tamanho de Arquivo:** Vai adicionar algumas dezenas de kilobytes de textos estáticos no projeto (embora seja irrelevante para PCs modernos).

---
**Status:** Isolado e pronto para aprovação. Se preferir a abordagem focada em velocidade e autonomia, me avise e iniciarei a construção do motor procedural!
