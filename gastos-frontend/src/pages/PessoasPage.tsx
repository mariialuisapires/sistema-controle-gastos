import { useState, useEffect } from 'react'
import { type Pessoa, pessoasService } from '../services/api'


function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [editando, setEditando] = useState<Pessoa | null>(null)
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState(0)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    carregarPessoas()
  }, [])

  async function carregarPessoas() {
    const data = await pessoasService.listar()
    setPessoas(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    try {
      if (editando) {
        await pessoasService.atualizar(editando.id, { ...editando, nome, idade })
        setEditando(null)
      } else {
        await pessoasService.criar({ nome, idade })
      }
      setNome('')
      setIdade(0)
      await carregarPessoas()
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || 'Erro ao salvar.')
    }
  }

  function handleEditar(pessoa: Pessoa) {
    setEditando(pessoa)
    setNome(pessoa.nome)
    setIdade(pessoa.idade)
  }

  async function handleDeletar(id: string) {
    if (!window.confirm('Deletar esta pessoa e todas as suas transações?')) return
    await pessoasService.deletar(id)
    await carregarPessoas()
  }

  return (
    <div>
      <h1>👤 Pessoas</h1>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <h2>{editando ? `Editando: ${editando.nome}` : 'Nova Pessoa'}</h2>
        <div>
          <label>Nome: </label>
          <input value={nome} onChange={e => setNome(e.target.value)} maxLength={200} required />
        </div>
        <div>
          <label>Idade: </label>
          <input type="number" value={idade} onChange={e => setIdade(Number(e.target.value))} min={0} required />
        </div>
        <button type="submit">{editando ? 'Salvar' : 'Cadastrar'}</button>
        {editando && <button type="button" onClick={() => setEditando(null)}>Cancelar</button>}
      </form>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Idade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map(pessoa => (
            <tr key={pessoa.id}>
              <td>{pessoa.nome}</td>
              <td>{pessoa.idade}</td>
              <td>
                <button onClick={() => handleEditar(pessoa)}>Editar</button>
                <button onClick={() => handleDeletar(pessoa.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PessoasPage