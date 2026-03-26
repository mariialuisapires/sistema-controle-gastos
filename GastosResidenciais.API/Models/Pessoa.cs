using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GastosResidenciais.API.Models
{
    public class Pessoa
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(200)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [Range(0, 150)]
        public int Idade { get; set; }

        [JsonIgnore]
        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }


}