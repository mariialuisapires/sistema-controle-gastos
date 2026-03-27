import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import PessoasPage from './pages/PessoasPage'


function App() {
  return (
    <BrowserRouter>
      <nav style={{ background: '#2c3e50', padding: '15px 20px', display: 'flex', gap: '20px' }}>
        <span style={{ color: 'white', fontWeight: 'bold', marginRight: 'auto' }}>
          💰 Gastos Residenciais
        </span>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Pessoas</Link>
        <Link to="/categorias" style={{ color: 'white', textDecoration: 'none' }}>Categorias</Link>
        <Link to="/transacoes" style={{ color: 'white', textDecoration: 'none' }}>Transações</Link>
        <Link to="/totais" style={{ color: 'white', textDecoration: 'none' }}>Totais</Link>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
        <Routes>
          <Route path="/" element={<PessoasPage />} />
          <Route path="/categorias" element={<h1>Categorias (em breve)</h1>} />
          <Route path="/transacoes" element={<h1>Transações (em breve)</h1>} />
          <Route path="/totais" element={<h1>Totais (em breve)</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App