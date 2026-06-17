import axios from 'axios'

// Configuração base da API
const api = axios.create({
  baseURL: (() => {
    const host = import.meta.env.VITE_API_BASE_URL
    if (!host) return 'http://localhost:5299/api'
    const base = host.startsWith('http') ? host : `https://${host}`
    return `${base}/api`
  })(),
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Serviço de Autenticação
export const authService = {
  async registrar(dados) {
    const response = await api.post('/Auth/registro', dados)
    return response.data
  },

  async login(email, senha) {
    const response = await api.post('/Auth/login', { email, senha })
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }
}

// Serviço de Desafios
export const desafiosService = {
  async listarDesafios() {
    const response = await api.get('/Desafios')
    return response.data
  },

  async obterDesafio(id) {
    const response = await api.get(`/Desafios/${id}`)
    return response.data
  }
}

// Serviço de Progresso
export const progressoService = {
  async submeterDesafio(desafioId, codigoSolucao) {
    const response = await api.post('/Progresso/submeter', {
      desafioId,
      codigoSolucao
    })
    return response.data
  },

  async obterDashboard() {
    const response = await api.get('/Progresso/dashboard')
    return response.data
  }
}
// Serviço de Turmas
export const turmaService = {
  // Professor: criar turma
  async criarTurma(nome) {
    const response = await api.post('/Turma/criar', { nome })
    return response.data
  },

  // Professor: listar minhas turmas
  async minhasTurmas() {
    const response = await api.get('/Turma/minhas-turmas')
    return response.data
  },

  // Professor: ver alunos da turma
  async obterAlunosDaTurma(turmaId) {
    const response = await api.get(`/Turma/${turmaId}/alunos`)
    return response.data
  },

  // Aluno: entrar na turma
  async entrarNaTurma(codigo) {
    const response = await api.post('/Turma/entrar', { codigo })
    return response.data
  },

  // Aluno: minhas turmas
  async minhasTurmasAluno() {
    const response = await api.get('/Turma/minhas-turmas-aluno')
    return response.data
  }
}
// Serviço de Relatórios
export const relatorioService = {
  async obterEstatisticasTurma(turmaId) {
    const response = await api.get(`/Relatorio/turma/${turmaId}`)
    return response.data
  },

  async obterProgressoAluno(alunoId) {
    const response = await api.get(`/Relatorio/aluno/${alunoId}`)
    return response.data
  },

  async obterRanking(turmaId) {
    const response = await api.get(`/Relatorio/ranking/${turmaId}`)
    return response.data
  }
}

// Serviço de Ranking
export const rankingService = {
  async obterRankingTurma(turmaId) {
    const response = await api.get(`/Ranking/turma/${turmaId}`)
    return response.data
  },

  async obterRankingGeral() {
    const response = await api.get('/Ranking/geral')
    return response.data
  },

  async obterMinhaPosicao(turmaId) {
    const response = await api.get(`/Ranking/minha-posicao/${turmaId}`)
    return response.data
  }
}

export default api