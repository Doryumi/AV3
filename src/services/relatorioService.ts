import { Relatorio } from '../types'
import { apiService } from './apiService'

interface RelatorioAPI {
  id: number
  conteudo: string
  dataGeracao: string
}

interface RelatorioGenerateRequest {
  cliente: string
  dataEntrega: string
  codigoAeronave: string
}

export const relatorioService = {
  async getAll(): Promise<RelatorioAPI[]> {
    try {
      return await apiService.get<RelatorioAPI[]>('/relatorios')
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error)
      return []
    }
  },

  async gerar(params: RelatorioGenerateRequest): Promise<{ success: boolean; message: string; relatorio?: RelatorioAPI }> {
    try {
      const relatorio = await apiService.post<RelatorioAPI>('/relatorios/gerar', params)
      return { success: true, message: 'Relatório gerado com sucesso!', relatorio }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao gerar relatório' }
    }
  },

  exportarTxt(relatorio: RelatorioAPI): string {
    return relatorio.conteudo
  },

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    try {
      await apiService.delete(`/relatorios/${id}`)
      return { success: true, message: 'Relatório excluído com sucesso!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao excluir relatório' }
    }
  }
}
