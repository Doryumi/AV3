import { Peca } from '../types'
import { apiService } from './apiService'

interface PecaAPI {
  id: number
  nome: string
  tipo: string
  fornecedor: string
  status: string
  codigoAeronave: string
}

export const pecaService = {
  async getAll(): Promise<Peca[]> {
    try {
      const pecas = await apiService.get<PecaAPI[]>('/pecas')
      return pecas.map(p => ({
        nome: p.nome,
        tipo: p.tipo,
        fornecedor: p.fornecedor,
        status: p.status,
        codigoAeronave: p.codigoAeronave
      }))
    } catch (error) {
      console.error('Erro ao buscar peças:', error)
      return []
    }
  },

  async getByAeronave(codigoAeronave: string): Promise<Peca[]> {
    const pecas = await this.getAll()
    return pecas.filter(p => p.codigoAeronave === codigoAeronave)
  },

  async create(peca: Peca): Promise<{ success: boolean; message: string }> {
    try {
      await apiService.post('/pecas', {
        nome: peca.nome,
        tipo: peca.tipo,
        fornecedor: peca.fornecedor,
        codigoAeronave: peca.codigoAeronave
      })
      return { success: true, message: 'Peça cadastrada com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao cadastrar peça' }
    }
  },

  async update(nome: string, codigoAeronave: string, peca: Peca): Promise<{ success: boolean; message: string }> {
    try {
      const pecas = await apiService.get<PecaAPI[]>('/pecas')
      const pecaExistente = pecas.find(p => p.nome === nome && p.codigoAeronave === codigoAeronave)
      
      if (!pecaExistente) {
        return { success: false, message: 'Peça não encontrada!' }
      }

      await apiService.put(`/pecas/${pecaExistente.id}`, {
        nome: peca.nome,
        tipo: peca.tipo,
        fornecedor: peca.fornecedor,
        codigoAeronave: peca.codigoAeronave
      })
      return { success: true, message: 'Peça atualizada com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao atualizar peça' }
    }
  },

  async avancarStatus(nome: string, codigoAeronave: string): Promise<{ success: boolean; message: string }> {
    try {
      const pecas = await apiService.get<PecaAPI[]>('/pecas')
      const peca = pecas.find(p => p.nome === nome && p.codigoAeronave === codigoAeronave)
      
      if (!peca) {
        return { success: false, message: 'Peça não encontrada!' }
      }

      if (peca.status === 'Instalada') {
        return { success: false, message: 'Peça já está no status final!' }
      }

      await apiService.patch(`/pecas/${peca.id}/avancar-status`)
      return { success: true, message: 'Status avançado com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao avançar status' }
    }
  },

  async delete(nome: string, codigoAeronave: string): Promise<{ success: boolean; message: string }> {
    try {
      const pecas = await apiService.get<PecaAPI[]>('/pecas')
      const peca = pecas.find(p => p.nome === nome && p.codigoAeronave === codigoAeronave)
      
      if (!peca) {
        return { success: false, message: 'Peça não encontrada!' }
      }

      await apiService.delete(`/pecas/${peca.id}`)
      return { success: true, message: 'Peça removida com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao excluir peça' }
    }
  }
}
