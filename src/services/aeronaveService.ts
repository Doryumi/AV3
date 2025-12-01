import { Aeronave } from '../types'
import { apiService } from './apiService'

export const aeronaveService = {
  async getAll(): Promise<Aeronave[]> {
    try {
      return await apiService.get<Aeronave[]>('/aeronaves')
    } catch (error) {
      console.error('Erro ao buscar aeronaves:', error)
      return []
    }
  },

  async getByCodigo(codigo: string): Promise<Aeronave | null> {
    try {
      return await apiService.get<Aeronave>(`/aeronaves/${codigo}`)
    } catch (error) {
      console.error('Erro ao buscar aeronave:', error)
      return null
    }
  },

  async create(aeronave: Aeronave): Promise<{ success: boolean; message: string }> {
    try {
      await apiService.post('/aeronaves', aeronave)
      return { success: true, message: 'Aeronave cadastrada com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao cadastrar aeronave' }
    }
  },

  async update(codigo: string, aeronave: Aeronave): Promise<{ success: boolean; message: string }> {
    try {
      await apiService.put(`/aeronaves/${codigo}`, aeronave)
      return { success: true, message: 'Aeronave atualizada com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao atualizar aeronave' }
    }
  },

  async delete(codigo: string): Promise<{ success: boolean; message: string }> {
    try {
      await apiService.delete(`/aeronaves/${codigo}`)
      return { success: true, message: 'Aeronave excluída com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao excluir aeronave' }
    }
  }
}
