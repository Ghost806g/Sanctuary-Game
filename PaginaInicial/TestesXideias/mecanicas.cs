using System;
using System.Collections.Generic;

namespace Jogo.Sistemas
{
    public enum CategoriaCorpo
    {
        Cabeca,
        CorpoSuperior,
        CorpoInferior,
    }

    public class Trauma
    {
        public string Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public string Icone { get; set; }
        public List<CategoriaCorpo> Categorias { get; set; }

        public int PenalidadeAtk { get; set; }
        public int PenalidadeDef { get; set; }
    }

    public class Bioma
    {
        public string Id { get; set; }
        public string Nome { get; set; }
        public List<string> TraumasDisponiveis { get; set; }
    }

    public class Personagem
    {
        public string Nome { get; set; }
        public int Atk { get; set; }
        public int Def { get; set; }
        public List<Trauma> Traumas { get; set; } = new List<Trauma>();

        public void AplicarTrauma(Trauma trauma)
        {
            this.Traumas.Add(trauma);
            // Como as penalidades já vêm negativas (-5, -10), usamos +=
            this.Atk += trauma.PenalidadeAtk;
            this.Def += trauma.PenalidadeDef;

            Console.WriteLine($"\n🩸 [CRÍTICO] {Nome} sofreu: {trauma.Icone} {trauma.Nome} - \"{trauma.Descricao}\"");
            
            if (trauma.PenalidadeAtk < 0) 
                Console.WriteLine($"🔻 ATK reduzido em {Math.Abs(trauma.PenalidadeAtk)}! (Novo ATK: {Atk})");
            
            if (trauma.PenalidadeDef < 0) 
                Console.WriteLine($"🔻 DEF reduzida em {Math.Abs(trauma.PenalidadeDef)}! (Nova DEF: {Def})");
        }
    }

    // Gerenciador do Jogo contendo os Bancos de Dados
    public class GerenciadorDeTraumas
    {
        public Dictionary<string, Trauma> TraumasDatabase { get; private set; }
        public Dictionary<string, Bioma> BiomasDatabase { get; private set; }
        private Random _random = new Random();

        public GerenciadorDeTraumas()
        {
            InicializarBancosDeDados();
        }

        public void GerarFerimento(Personagem personagem, string idBioma)
        {
            if (!BiomasDatabase.ContainsKey(idBioma)) return;

            var bioma = BiomasDatabase[idBioma];
            var traumasNoBioma = bioma.TraumasDisponiveis;
            
            // Sorteia um trauma disponível neste bioma
            string traumaSorteadoId = traumasNoBioma[_random.Next(traumasNoBioma.Count)];
            var trauma = TraumasDatabase[traumaSorteadoId];

            Console.WriteLine($"\n🌍 --- BIOMA: {bioma.Nome.ToUpper()} ---");
            personagem.AplicarTrauma(trauma);
        }

        private void InicializarBancosDeDados()
        {
            // Criando alguns Traumas do seu arquivo original
            TraumasDatabase = new Dictionary<string, Trauma>
            {
                { "cortante", new Trauma { Id = "cortante", Nome = "Ferimento Cortante", Descricao = "Corte profundo", Icone = "⚔️", Categorias = new List<CategoriaCorpo> { CategoriaCorpo.CorpoInferior, CategoriaCorpo.CorpoSuperior }, PenalidadeAtk = -5, PenalidadeDef = -5 } },
                { "fisico", new Trauma { Id = "fisico", Nome = "Trauma Físico", Descricao = "Impacto forte ou contusão", Icone = "🔨", Categorias = new List<CategoriaCorpo> { CategoriaCorpo.CorpoInferior, CategoriaCorpo.CorpoSuperior }, PenalidadeAtk = -8, PenalidadeDef = 0 } },
                { "veneno", new Trauma { Id = "veneno", Nome = "Intoxicação Grave", Descricao = "Corpo contaminado", Icone = "☠️", Categorias = new List<CategoriaCorpo> { CategoriaCorpo.CorpoInferior, CategoriaCorpo.CorpoSuperior, CategoriaCorpo.Cabeca }, PenalidadeAtk = -5, PenalidadeDef = 0 } },
                { "magia", new Trauma { Id = "magia", Nome = "Necrose Mágica", Descricao = "Dano espectral", Icone = "🔮", Categorias = new List<CategoriaCorpo> { CategoriaCorpo.CorpoInferior, CategoriaCorpo.CorpoSuperior, CategoriaCorpo.Cabeca }, PenalidadeAtk = -12, PenalidadeDef = -5 } }
            };

            // Criando os Biomas
            BiomasDatabase = new Dictionary<string, Bioma>
            {
                { "catacumbas_sombrias", new Bioma { Id = "catacumbas_sombrias", Nome = "Catacumbas Sombrias", TraumasDisponiveis = new List<string> { "cortante", "fisico", "magia", "veneno" } } },
                { "pantano_peste", new Bioma { Id = "pantano_peste", Nome = "Pântano de Peste", TraumasDisponiveis = new List<string> { "veneno", "magia" } } }
            };
        }
    }

    // Classe principal para testar o código
    public class Program
    {
        public static void Main()
        {
            // 1. Inicializa o Gerenciador (Carrega Traumas e Biomas)
            var gerenciador = new GerenciadorDeTraumas();

            // 2. Cria o Jogador
            var jogador = new Personagem
            {
                Nome = "Lyra, A Silenciosa",
                Atk = 100,
                Def = 100
            };

            Console.WriteLine("=== STATUS INICIAL DO JOGADOR ===");
            Console.WriteLine($"ATK: {jogador.Atk} | DEF: {jogador.Def}");

            // 3. Simula sofrer danos em biomas diferentes
            gerenciador.GerarFerimento(jogador, "catacumbas_sombrias");
            gerenciador.GerarFerimento(jogador, "pantano_peste");

            Console.WriteLine("\n=== STATUS FINAL APÓS A EXPEDIÇÃO ===");
            Console.WriteLine($"ATK Final: {jogador.Atk} | DEF Final: {jogador.Def}");
            Console.WriteLine("\nTraumas sofridos:");
            foreach (var t in jogador.Traumas)
            {
                Console.WriteLine($"- {t.Icone} {t.Nome}");
            }
        }
    }
}