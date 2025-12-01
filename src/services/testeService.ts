import { Teste } from '../types'
import { apiService } from './apiService'

interface TesteAPI extends Teste {
  id: number
  tipo: string
  funcionarioCpf: string
}

export const testeService = {
  async getAll(): Promise<Teste[]> {
    try {
      const testes = await apiService.get<TesteAPI[]>('/testes')
      return testes.map(t => ({
        tipo: t.tipo,
        descricao: t.descricao,
        resultado: t.resultado,
        data: t.data,
        funcionarioCpf: t.funcionarioCpf,
        codigoAeronave: t.codigoAeronave
      }))
    } catch (error) {
      console.error('Erro ao buscar testes:', error)
      return []
    }
  },

  async getByAeronave(codigoAeronave: string): Promise<Teste[]> {
    const testes = await this.getAll()
    return testes.filter(t => t.codigoAeronave === codigoAeronave)
  },

  async create(teste: Teste): Promise<{ success: boolean; message: string }> {
    try {
      const data = teste.data || new Date().toISOString().split('T')[0]
      
      await apiService.post('/testes', {
        tipo: teste.tipo,
        descricao: teste.descricao,
        resultado: teste.resultado,
        data,
        funcionarioCpf: teste.funcionarioCpf,
        codigoAeronave: teste.codigoAeronave
      })
      return { success: true, message: 'Teste registrado com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao registrar teste' }
    }
  },

  async delete(index: number): Promise<{ success: boolean; message: string }> {
    try {
      const testes = await apiService.get<TesteAPI[]>('/testes')
      
      if (index < 0 || index >= testes.length) {
        return { success: false, message: 'Teste não encontrado!' }
      }

      const teste = testes[index]
      await apiService.delete(`/testes/${teste.id}`)
      return { success: true, message: 'Teste removido com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao excluir teste' }
    }
  }
}
