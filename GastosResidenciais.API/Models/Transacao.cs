using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GastosResidenciais.API.Models
{
    public enum TipoTransacao
    {
        Despesa = 0,
        Receita = 1
    }

    public class Transacao
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(400)]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Valor { get; set; }

        [Required]
        public TipoTransacao Tipo { get; set; }

        // Chave estrangeira
        [Required]
        public Guid CategoriaId { get; set; }

        // Propriedade de navegação
        public Categoria? Categoria { get; set; }

        [Required]
        public Guid PessoaId { get; set; }

        public Pessoa? Pessoa { get; set; }
    }
}