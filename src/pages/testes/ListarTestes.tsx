import React, { useState, useEffect } from 'react'
import { testeService } from '../../services/testeService'
import { aeronaveService } from '../../services/aeronaveService'
import { Teste } from '../../types'
import './ListarTestes.css'

const ListarTestes: React.FC = () => {
  const [testes, setTestes] = useState<Teste[]>([])
  const [aeronaves, setAeronaves] = useState<string[]>([])
  const [filtroAeronave, setFiltroAeronave] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  
  const [formData, setFormData] = useState<Teste>({
    tipo: 'Elétrico',
    descricao: '',
    resultado: 'Aprovado',
    codigoAeronave: '',
    data: new Date().toISOString().split('T')[0],
    funcionarioCpf: JSON.parse(sessionStorage.getItem('aerocode_user') || '{}').cpf || ''
  })

  useEffect(() => {
    carregarTestes()
    carregarAeronaves()
  }, [])

  const carregarTestes = async () => {
    const data = await testeService.getAll()
    setTestes(data)
  }

  const carregarAeronaves = async () => {
    const aeronavesList = await aeronaveService.getAll()
    setAeronaves(aeronavesList.map(a => a.codigo))
  }

  const limparFormulario = () => {
    setFormData({
      tipo: 'Elétrico',
      descricao: '',
      resultado: 'Aprovado',
      codigoAeronave: '',
      data: new Date().toISOString().split('T')[0],
      funcionarioCpf: JSON.parse(sessionStorage.getItem('aerocode_user') || '{}').cpf || ''
    })
    setShowForm(false)
    setErro('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setMensagem('')

    if (!formData.codigoAeronave) {
      setErro('Selecione uma aeronave!')
      return
    }

    if (!aeronaves.includes(formData.codigoAeronave)) {
      setErro('Aeronave não encontrada!')
      return
    }

    const result = await testeService.create(formData)

    if (result.success) {
      setMensagem(result.message)
      await carregarTestes()
      limparFormulario()
      setTimeout(() => setMensagem(''), 3000)
    } else {
      setErro(result.message)
    }
  }

  const handleExcluir = async (index: number) => {
    if (window.confirm('Tem certeza que deseja excluir este teste?')) {
      const result = await testeService.delete(index)
      if (result.success) {
        setMensagem(result.message)
        await carregarTestes()
        setTimeout(() => setMensagem(''), 3000)
      } else {
        setErro(result.message)
      }
    }
  }

  const testesFiltrados = filtroAeronave 
    ? testes.filter(t => t.codigoAeronave === filtroAeronave)
    : testes

  return (
    <div className="testes-container">
      <div className="testes-header">
        <h1 className="testes-title">Testes</h1>
        {!showForm && (
          <button 
            className="testes-btn-cadastrar"
            onClick={() => setShowForm(true)}
          >
            Registrar Teste
          </button>
        )}
      </div>

      {mensagem && <div className="success-message">{mensagem}</div>}
      {erro && <div className="error-message">{erro}</div>}

      {showForm && (
        <div className="testes-form-container">
          <h2>Registrar Teste</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Aeronave</label>
                <select
                  value={formData.codigoAeronave}
                  onChange={(e) => setFormData({...formData, codigoAeronave: e.target.value})}
                >
                  <option value="">Selecione uma aeronave</option>
                  {aeronaves.map(codigo => (
                    <option key={codigo} value={codigo}>{codigo}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Teste</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                >
                  <option value="Elétrico">Elétrico</option>
                  <option value="Hidráulico">Hidráulico</option>
                  <option value="Aerodinâmico">Aerodinâmico</option>
                </select>
              </div>

              <div className="form-group">
                <label>Resultado</label>
                <select
                  value={formData.resultado}
                  onChange={(e) => setFormData({...formData, resultado: e.target.value})}
                >
                  <option value="Aprovado">Aprovado</option>
                  <option value="Reprovado">Reprovado</option>
                </select>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <input
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descrição adicional do teste"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={limparFormulario} className="btn-cancelar">
                Cancelar
              </button>
              <button type="submit" className="btn-salvar">
                Registrar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="testes-filtro">
        <label>Filtrar por aeronave:</label>
        <select value={filtroAeronave} onChange={(e) => setFiltroAeronave(e.target.value)}>
          <option value="">Todas</option>
          {aeronaves.map(codigo => (
            <option key={codigo} value={codigo}>{codigo}</option>
          ))}
        </select>
      </div>

      <div className="testes-table-container">
        {testesFiltrados.length === 0 ? (
          <p className="empty-message">Nenhum teste registrado.</p>
        ) : (
          <table className="testes-table">
            <thead>
              <tr>
                <th>Aeronave</th>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Resultado</th>
                <th>Data</th>
                <th>Funcionário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {testesFiltrados.map((t, idx) => (
                <tr key={idx}>
                  <td>{t.codigoAeronave}</td>
                  <td>
                    <span className="testes-badge testes-badge-tipo">
                      {t.tipo}
                    </span>
                  </td>
                  <td>{t.descricao}</td>
                  <td>
                    <span className={`testes-badge ${t.resultado === 'Aprovado' ? 'testes-badge-aprovado' : 'testes-badge-reprovado'}`}>
                      {t.resultado}
                    </span>
                  </td>
                  <td>{new Date(t.data).toLocaleDateString('pt-BR')}</td>
                  <td className="testes-observacoes">{t.funcionarioCpf}</td>
                  <td className="testes-actions">
                    <button 
                      className="testes-btn-excluir"
                      onClick={() => handleExcluir(testes.indexOf(t))}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ListarTestes
