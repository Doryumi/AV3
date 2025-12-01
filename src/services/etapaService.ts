import { Etapa } from '../types'
import { apiService } from './apiService'

interface EtapaAPI {
  id: number
  nome: string
  prazo: string
  status: string
  codigoAeronave: string
  funcionarios: string[]
}

export const etapaService = {
  async getAll(): Promise<Etapa[]> {
    try {
      const etapas = await apiService.get<EtapaAPI[]>('/etapas')
      return etapas.map(e => ({
        nome: e.nome,
        prazo: e.prazo,
        status: e.status,
        codigoAeronave: e.codigoAeronave,
        funcionarios: e.funcionarios || []
      }))
    } catch (error) {
      console.error('Erro ao buscar etapas:', error)
      return []
    }
  },

  async getByAeronave(codigoAeronave: string): Promise<Etapa[]> {
    const etapas = await this.getAll()
    return etapas.filter(e => e.codigoAeronave === codigoAeronave)
  },

  async create(etapa: Etapa): Promise<{ success: boolean; message: string }> {
    try {
      await apiService.post('/etapas', {
        nome: etapa.nome,
        prazo: etapa.prazo,
        codigoAeronave: etapa.codigoAeronave
      })
      return { success: true, message: 'Etapa cadastrada com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao cadastrar etapa' }
    }
  },

  async update(nome: string, codigoAeronave: string, etapa: Etapa): Promise<{ success: boolean; message: string }> {
    try {
      const etapas = await apiService.get<EtapaAPI[]>('/etapas')
      const etapaExistente = etapas.find(e => e.nome === nome && e.codigoAeronave === codigoAeronave)
      
      if (!etapaExistente) {
        return { success: false, message: 'Etapa não encontrada!' }
      }

      await apiService.put(`/etapas/${etapaExistente.id}`, {
        nome: etapa.nome,
        prazo: etapa.prazo,
        codigoAeronave: etapa.codigoAeronave
      })
      return { success: true, message: 'Etapa atualizada com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao atualizar etapa' }
    }
  },

  async iniciar(nome: string, codigoAeronave: string): Promise<{ success: boolean; message: string }> {
    try {
      const etapas = await apiService.get<EtapaAPI[]>('/etapas')
      const etapa = etapas.find(e => e.nome === nome && e.codigoAeronave === codigoAeronave)
      
      if (!etapa) {
        return { success: false, message: 'Etapa não encontrada!' }
      }

      await apiService.patch(`/etapas/${etapa.id}/iniciar`)
      return { success: true, message: 'Etapa iniciada com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao iniciar etapa' }
    }
  },

  async finalizar(nome: string, codigoAeronave: string): Promise<{ success: boolean; message: string }> {
    try {
      const etapas = await apiService.get<EtapaAPI[]>('/etapas')
      const etapa = etapas.find(e => e.nome === nome && e.codigoAeronave === codigoAeronave)
      
      if (!etapa) {
        return { success: false, message: 'Etapa não encontrada!' }
      }

      await apiService.patch(`/etapas/${etapa.id}/finalizar`)
      return { success: true, message: 'Etapa finalizada com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao finalizar etapa' }
    }
  },

  async associarFuncionario(nome: string, codigoAeronave: string, cpfFuncionario: string): Promise<{ success: boolean; message: string }> {
    try {
      const etapas = await apiService.get<EtapaAPI[]>('/etapas')
      const etapa = etapas.find(e => e.nome === nome && e.codigoAeronave === codigoAeronave)
      
      if (!etapa) {
        return { success: false, message: 'Etapa não encontrada!' }
      }

      await apiService.post(`/etapas/${etapa.id}/funcionarios`, { cpf: cpfFuncionario })
      return { success: true, message: 'Funcionário associado com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao associar funcionário' }
    }
  },

  async desassociarFuncionario(nome: string, codigoAeronave: string, cpfFuncionario: string): Promise<{ success: boolean; message: string }> {
    try {
      const etapas = await apiService.get<EtapaAPI[]>('/etapas')
      const etapa = etapas.find(e => e.nome === nome && e.codigoAeronave === codigoAeronave)
      
      if (!etapa) {
        return { success: false, message: 'Etapa não encontrada!' }
      }

      await apiService.delete(`/etapas/${etapa.id}/funcionarios/${cpfFuncionario}`)
      return { success: true, message: 'Funcionário desassociado com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao desassociar funcionário' }
    }
  },

  async delete(nome: string, codigoAeronave: string): Promise<{ success: boolean; message: string }> {
    try {
      const etapas = await apiService.get<EtapaAPI[]>('/etapas')
      const etapa = etapas.find(e => e.nome === nome && e.codigoAeronave === codigoAeronave)
      
      if (!etapa) {
        return { success: false, message: 'Etapa não encontrada!' }
      }

      await apiService.delete(`/etapas/${etapa.id}`)
      return { success: true, message: 'Etapa removida com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao excluir etapa' }
    }
  }
}
