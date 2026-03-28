import { useState, useEffect } from 'react'
import { transacoesService } from '../services/api'

interface TotalPessoa {
  id: string
  nome: string
  idade: number
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

interface TotaisResponse {
  pessoas: TotalPessoa[]
  totalGeral: {
    totalReceitas: number
    totalDespesas: number
    saldoLiquido: number
  }
}

function TotaisPage() {
  const [totais, setTotais] = useState<TotaisResponse | null>(null)

  useEffect(() => {
    transacoesService.totaisPorPessoa().then(setTotais)
  }, [])

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  if (!totais) return <p>Carregando...</p>

  return (
    <div>
      <h1>📊 Totais por Pessoa</h1>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Idade</th>
            <th>Total Receitas</th>
            <th>Total Despesas</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {totais.pessoas.map(p => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.idade}</td>
              <td style={{ color: 'green' }}>{formatarMoeda(p.totalReceitas)}</td>
              <td style={{ color: 'red' }}>{formatarMoeda(p.totalDespesas)}</td>
              <td style={{ color: p.saldo >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                {formatarMoeda(p.saldo)}
              </td>
            </tr>
          ))}
          <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
            <td colSpan={2}>TOTAL GERAL</td>
            <td style={{ color: 'green' }}>{formatarMoeda(totais.totalGeral.totalReceitas)}</td>
            <td style={{ color: 'red' }}>{formatarMoeda(totais.totalGeral.totalDespesas)}</td>
            <td style={{ color: totais.totalGeral.saldoLiquido >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
              {formatarMoeda(totais.totalGeral.saldoLiquido)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default TotaisPage