import React, { useState, useEffect } from 'react'
import { relatorioService } from '../../services/relatorioService'
import { aeronaveService } from '../../services/aeronaveService'
import './GerarRelatorio.css'

interface RelatorioGerado {
  id: number
  conteudo: string
  dataGeracao: string
}

const GerarRelatorio: React.FC = () => {
  const [aeronaves, setAeronaves] = useState<string[]>([])
  const [cliente, setCliente] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')
  const [codigoAeronave, setCodigoAeronave] = useState('')
  const [relatorio, setRelatorio] = useState<RelatorioGerado | null>(null)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarAeronaves()
  }, [])

  const carregarAeronaves = async () => {
    const aeronavesList = await aeronaveService.getAll()
    setAeronaves(aeronavesList.map(a => a.codigo))
  }

  const handleGerar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setMensagem('')
    setRelatorio(null)

    if (!cliente || !dataEntrega || !codigoAeronave) {
      setErro('Preencha todos os campos!')
      return
    }

    const result = await relatorioService.gerar({
      cliente,
      dataEntrega,
      codigoAeronave
    })

    if (result.success && result.relatorio) {
      setMensagem(result.message)
      setRelatorio(result.relatorio)
      setTimeout(() => setMensagem(''), 3000)
    } else {
      setErro(result.message)
    }
  }

  const handleDownload = () => {
    if (!relatorio) return

    const txtContent = relatorioService.exportarTxt(relatorio)
    const blob = new Blob([txtContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `relatorio_entrega_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="relatorio-container">
      <div className="relatorio-header">
        <h1 className="relatorio-title">Gerar Relatório</h1>
      </div>

      {mensagem && <div className="success-message">{mensagem}</div>}
      {erro && <div className="error-message">{erro}</div>}

      <div className="relatorio-form-container">
        <h2>Relatório Final de Entrega</h2>
        <form onSubmit={handleGerar}>
          <div className="form-grid">
            <div className="form-group">
              <label>Aeronave</label>
              <select
                value={codigoAeronave}
                onChange={(e) => setCodigoAeronave(e.target.value)}
              >
                <option value="">Selecione a aeronave</option>
                {aeronaves.map(codigo => (
                  <option key={codigo} value={codigo}>{codigo}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Cliente</label>
              <input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>

            <div className="form-group">
              <label>Data de Entrega</label>
              <input
                type="date"
                value={dataEntrega}
                onChange={(e) => setDataEntrega(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-gerar">
              Gerar Relatório de Entrega
            </button>
          </div>
        </form>
      </div>

      {relatorio && (
        <div className="relatorio-view">
          <div className="relatorio-view-header">
            <h2>Relatório Final de Entrega</h2>
            <button onClick={handleDownload} className="btn-download">
              Download TXT
            </button>
          </div>

          <div className="relatorio-section">
            <pre className="relatorio-conteudo">{relatorio.conteudo}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default GerarRelatorio
