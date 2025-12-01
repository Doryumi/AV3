import { Funcionario } from '../types'
import { apiService } from './apiService'

export const funcionarioService = {
  async getAll(): Promise<Funcionario[]> {
    try {
      const funcionarios = await apiService.get<Funcionario[]>('/funcionarios')
      return funcionarios
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error)
      return []
    }
  },

  async getByCpf(cpf: string): Promise<Funcionario | null> {
    try {
      return await apiService.get<Funcionario>(`/funcionarios/${cpf}`)
    } catch (error) {
      console.error('Erro ao buscar funcionário:', error)
      return null
    }
  },

  async create(funcionario: Funcionario): Promise<{ success: boolean; message: string }> {
    try {
      await apiService.post('/funcionarios', funcionario)
      return { success: true, message: 'Funcionário cadastrado com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao cadastrar funcionário' }
    }
  },

  async update(cpf: string, funcionario: Partial<Funcionario>): Promise<{ success: boolean; message: string }> {
    try {
      await apiService.put(`/funcionarios/${cpf}`, funcionario)
      return { success: true, message: 'Funcionário atualizado com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao atualizar funcionário' }
    }
  },

  async delete(cpf: string): Promise<{ success: boolean; message: string }> {
    try {
      await apiService.delete(`/funcionarios/${cpf}`)
      return { success: true, message: 'Funcionário excluído com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao excluir funcionário' }
    }
  },

  async authenticate(usuario: string, senha: string): Promise<Funcionario | null> {
    try {
      const funcionario = await apiService.post<Funcionario>('/funcionarios/auth', { usuario, senha })
      return funcionario
    } catch (error) {
      console.error('Erro ao autenticar:', error)
      return null
    }
  }
}
