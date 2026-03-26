using GastosResidenciais.API.Data;
using GastosResidenciais.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacoesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes()
        {
            var transacoes = await _context.Transacoes
                .Include(t => t.Categoria)
                .Include(t => t.Pessoa)
                .ToListAsync();

            return Ok(transacoes);
        }

        [HttpPost]
        public async Task<ActionResult<Transacao>> PostTransacao(Transacao transacao)
        {
            // Busca a pessoa para validar as regras
            var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
            if (pessoa == null)
                return NotFound(new { mensagem = "Pessoa não encontrada." });

            // Busca a categoria para validar as regras
            var categoria = await _context.Categorias.FindAsync(transacao.CategoriaId);
            if (categoria == null)
                return NotFound(new { mensagem = "Categoria não encontrada." });

            // REGRA 1: menor de 18 só pode ter Despesa
            if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
                return BadRequest(new { mensagem = $"{pessoa.Nome} é menor de idade e só pode ter transações do tipo Despesa." });

            // REGRA 2: categoria deve ser compatível com o tipo da transação
            bool categoriaIncompativel =
                (transacao.Tipo == TipoTransacao.Despesa && categoria.Finalidade == FinalidadeCategoria.Receita) ||
                (transacao.Tipo == TipoTransacao.Receita && categoria.Finalidade == FinalidadeCategoria.Despesa);

            if (categoriaIncompativel)
                return BadRequest(new { mensagem = $"A categoria '{categoria.Descricao}' não pode ser usada em uma transação do tipo '{transacao.Tipo}'." });

            // Tudo válido, salva a transação
            transacao.Id = Guid.NewGuid();
            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransacoes), new { id = transacao.Id }, transacao);
        }

        [HttpGet("totais")]
        public async Task<IActionResult> GetTotaisPorPessoa()
        {
            var pessoas = await _context.Pessoas.ToListAsync();
            var todasTransacoes = await _context.Transacoes.ToListAsync();

            var totaisPorPessoa = pessoas.Select(pessoa =>
            {
                var transacoesDaPessoa = todasTransacoes.Where(t => t.PessoaId == pessoa.Id);

                var totalReceitas = transacoesDaPessoa
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor);

                var totalDespesas = transacoesDaPessoa
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor);

                return new
                {
                    pessoa.Id,
                    pessoa.Nome,
                    pessoa.Idade,
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas,
                    Saldo = totalReceitas - totalDespesas
                };
            }).ToList();

            var totalGeral = new
            {
                TotalReceitas = totaisPorPessoa.Sum(p => p.TotalReceitas),
                TotalDespesas = totaisPorPessoa.Sum(p => p.TotalDespesas),
                SaldoLiquido = totaisPorPessoa.Sum(p => p.Saldo)
            };

            return Ok(new
            {
                Pessoas = totaisPorPessoa,
                TotalGeral = totalGeral
            });
        }


    }
}