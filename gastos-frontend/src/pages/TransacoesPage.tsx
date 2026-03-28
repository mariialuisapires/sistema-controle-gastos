import { useState, useEffect } from 'react'
import { type Transacao, type Pessoa, type Categoria, TipoTransacao, FinalidadeCategoria, transacoesService, pessoasService, categoriasService } from '../services/api'

function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState(0)
  const [tipo, setTipo] = useState<TipoTransacao>(TipoTransacao.Despesa)
  const [categoriaId, setCategoriaId] = useState('')
  const [pessoaId, setPessoaId] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      transacoesService.listar(),
      pessoasService.listar(),
      categoriasService.listar()
    ]).then(([trans, pess, cats]) => {
      setTransacoes(trans)
      setPessoas(pess)
      setCategorias(cats)
    })
  }, [])

  // Filtra categorias conforme o tipo selecionado
  const categoriasFiltradas = categorias.filter(cat => {
    if (tipo === TipoTransacao.Despesa)
      return cat.finalidade === FinalidadeCategoria.Despesa || cat.finalidade === FinalidadeCategoria.Ambas
    return cat.finalidade === FinalidadeCategoria.Receita || cat.finalidade === FinalidadeCategoria.Ambas
  })

  const pessoaSelecionada = pessoas.find(p => p.id === pessoaId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    try {
      await transacoesService.criar({ descricao, valor, tipo, categoriaId, pessoaId })
      setDescricao('')
      setValor(0)
      setCategoriaId('')
      const data = await transacoesService.listar()
      setTransacoes(data)
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || 'Erro ao criar transação.')
    }
  }

  function handleTipoChange(novoTipo: TipoTransacao) {
    setTipo(novoTipo)
    setCategoriaId('') // reseta categoria ao mudar o tipo
  }

  return (
    <div>
      <h1>💳 Transações</h1>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {pessoaSelecionada && pessoaSelecionada.idade < 18 && (
        <p style={{ color: 'orange' }}>
          ⚠️ {pessoaSelecionada.nome} é menor de idade — apenas Despesas são permitidas.
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <h2>Nova Transação</h2>
        <div>
          <label>Pessoa: </label>
          <select value={pessoaId} onChange={e => setPessoaId(e.target.value)} required>
            <option value="">Selecione...</option>
            {pessoas.map(p => (
              <option key={p.id} value={p.id}>{p.nome} ({p.idade} anos)</option>
            ))}
          </select>
        </div>
        <div>
          <label>Tipo: </label>
          <select value={tipo} onChange={e => handleTipoChange(Number(e.target.value) as TipoTransacao)} required>
            <option value={TipoTransacao.Despesa}>Despesa</option>
            {(!pessoaSelecionada || pessoaSelecionada.idade >= 18) && (
              <option value={TipoTransacao.Receita}>Receita</option>
            )}
          </select>
        </div>
        <div>
          <label>Categoria: </label>
          <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required>
            <option value="">Selecione...</option>
            {categoriasFiltradas.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.descricao}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Descrição: </label>
          <input value={descricao} onChange={e => setDescricao(e.target.value)} maxLength={400} required />
        </div>
        <div>
          <label>Valor: </label>
          <input type="number" value={valor} onChange={e => setValor(Number(e.target.value))} min={0.01} step={0.01} required />
        </div>
        <button type="submit">Registrar</button>
      </form>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Pessoa</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map(t => (
            <tr key={t.id}>
              <td>{t.pessoa?.nome}</td>
              <td>{t.descricao}</td>
              <td>{t.categoria?.descricao}</td>
              <td>{t.tipo === TipoTransacao.Receita ? '↑ Receita' : '↓ Despesa'}</td>
              <td>R$ {t.valor.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransacoesPage