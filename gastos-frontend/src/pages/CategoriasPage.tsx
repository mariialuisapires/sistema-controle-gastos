import { useState, useEffect } from 'react'
import { type Categoria, FinalidadeCategoria, categoriasService } from '../services/api'

function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [descricao, setDescricao] = useState('')
  const [finalidade, setFinalidade] = useState<FinalidadeCategoria>(FinalidadeCategoria.Despesa)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  useEffect(() => {
    carregarCategorias()
  }, [])

  async function carregarCategorias() {
    const data = await categoriasService.listar()
    setCategorias(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setSucesso(null)
    try {
      await categoriasService.criar({ descricao, finalidade })
      setSucesso('Categoria criada com sucesso!')
      setDescricao('')
      setFinalidade(0)
      await carregarCategorias()
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || 'Erro ao criar categoria.')
    }
  }

  function nomeFinalidade(f: number) {
    if (f === FinalidadeCategoria.Despesa) return 'Despesa'
    if (f === FinalidadeCategoria.Receita) return 'Receita'
    return 'Ambas'
  }

  return (
    <div>
      <h1>🏷️ Categorias</h1>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <h2>Nova Categoria</h2>
        <div>
          <label>Descrição: </label>
          <input value={descricao} onChange={e => setDescricao(e.target.value)} maxLength={400} required />
        </div>
        <div>
          <label>Finalidade: </label>
          <select value={finalidade} onChange={e => setFinalidade(Number(e.target.value) as FinalidadeCategoria)}
>
            <option value={0}>Despesa</option>
            <option value={1}>Receita</option>
            <option value={2}>Ambas</option>
          </select>
        </div>
        <button type="submit">Cadastrar</button>
      </form>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Finalidade</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id}>
              <td>{cat.descricao}</td>
              <td>{nomeFinalidade(cat.finalidade)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CategoriasPage