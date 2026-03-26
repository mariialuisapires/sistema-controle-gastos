import axios from 'axios'


export enum TipoTransacao {
  Despesa = 0,
  Receita = 1
}

export enum FinalidadeCategoria {
  Despesa = 0,
  Receita = 1,
  Ambas = 2
}

export interface Pessoa {
  id: string
  nome: string
  idade: number
}

export interface Categoria {
  id: string
  descricao: string
  finalidade: FinalidadeCategoria
}

export interface Transacao {
  id: string
  descricao: string
  valor: number
  tipo: TipoTransacao
  categoriaId: string
  categoria?: Categoria
  pessoaId: string
  pessoa?: Pessoa
}


const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})


export const pessoasService = {
  listar: () => api.get<Pessoa[]>('/pessoas').then(r => r.data),
  criar: (pessoa: { nome: string; idade: number }) => api.post<Pessoa>('/pessoas', pessoa).then(r => r.data),
  atualizar: (id: string, pessoa: Pessoa) => api.put(`/pessoas/${id}`, pessoa),
  deletar: (id: string) => api.delete(`/pessoas/${id}`)
}

export const categoriasService = {
  listar: () => api.get<Categoria[]>('/categorias').then(r => r.data),
  criar: (categoria: { descricao: string; finalidade: FinalidadeCategoria }) => api.post<Categoria>('/categorias', categoria).then(r => r.data)
}

export const transacoesService = {
  listar: () => api.get<Transacao[]>('/transacoes').then(r => r.data),
  criar: (transacao: { descricao: string; valor: number; tipo: TipoTransacao; categoriaId: string; pessoaId: string }) =>
    api.post<Transacao>('/transacoes', transacao).then(r => r.data),
  totaisPorPessoa: () => api.get('/transacoes/totais').then(r => r.data)
}