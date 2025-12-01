import React, { useState, useEffect } from 'react'
import { pecaService } from '../../services/pecaService'
import { aeronaveService } from '../../services/aeronaveService'
import { Peca } from '../../types'
import './ListarPecas.css'

const ListarPecas: React.FC = () => {
  const [pecas, setPecas] = useState<Peca[]>([])
  const [aeronaves, setAeronaves] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<{nome: string, codigoAeronave: string} | null>(null)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  
  const [formData, setFormData] = useState<Peca>({
    nome: '',
    tipo: 'Nacional',
    fornecedor: '',
    status: 'Em Produção',
    codigoAeronave: ''
  })

  useEffect(() => {
    carregarPecas()
    carregarAeronaves()
  }, [])

  const carregarPecas = async () => {
    const data = await pecaService.getAll()
    setPecas(data)
  }

  const carregarAeronaves = async () => {
    const aeronavesList = await aeronaveService.getAll()
    setAeronaves(aeronavesList.map(a => a.codigo))
  }

  const limparFormulario = () => {
    setFormData({
      nome: '',
      tipo: 'Nacional',
      fornecedor: '',
      status: 'Em Produção',
      codigoAeronave: ''
    })
    setShowForm(false)
    setEditando(null)
    setErro('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setMensagem('')

    if (!formData.nome || !formData.fornecedor || !formData.codigoAeronave) {
      setErro('Preencha todos os campos!')
      return
    }

    if (!aeronaves.includes(formData.codigoAeronave)) {
      setErro('Aeronave não encontrada!')
      return
    }

    const result = editando 
      ? await pecaService.update(editando.nome, editando.codigoAeronave, formData)
      : await pecaService.create(formData)

    if (result.success) {
      setMensagem(result.message)
      await carregarPecas()
      limparFormulario()
      setTimeout(() => setMensagem(''), 3000)
    } else {
      setErro(result.message)
    }
  }

  const handleEditar = (peca: Peca) => {
    setFormData(peca)
    setEditando({ nome: peca.nome, codigoAeronave: peca.codigoAeronave })
    setShowForm(true)
  }

  const handleAvancarStatus = async (peca: Peca) => {
    const result = await pecaService.avancarStatus(peca.nome, peca.codigoAeronave)
    if (result.success) {
      setMensagem(result.message)
      await carregarPecas()
      setTimeout(() => setMensagem(''), 3000)
    } else {
      setErro(result.message)
    }
  }

  const handleExcluir = async (peca: Peca) => {
    if (window.confirm('Tem certeza que deseja excluir esta peça?')) {
      const result = await pecaService.delete(peca.nome, peca.codigoAeronave)
      if (result.success) {
        setMensagem(result.message)
        await carregarPecas()
        setTimeout(() => setMensagem(''), 3000)
      } else {
        setErro(result.message)
      }
    }
  }

  return (
    <div className="pecas-container">
      <div className="pecas-header">
        <h1 className="pecas-title">Peças</h1>
        {!showForm && (
          <button 
            className="pecas-btn-cadastrar"
            onClick={() => setShowForm(true)}
          >
            Cadastrar Peça
          </button>
        )}
      </div>

      {mensagem && <div className="success-message">{mensagem}</div>}
      {erro && <div className="error-message">{erro}</div>}

      {showForm && (
        <div className="pecas-form-container">
          <h2>{editando ? 'Editar Peça' : 'Cadastrar Peça'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Turbina"
                />
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                >
                  <option value="Nacional">Nacional</option>
                  <option value="Importada">Importada</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fornecedor</label>
                <input
                  type="text"
                  value={formData.fornecedor}
                  onChange={(e) => setFormData({...formData, fornecedor: e.target.value})}
                  placeholder="Ex: Fornecedor XYZ"
                />
              </div>

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
            </div>

            <div className="form-actions">
              <button type="button" onClick={limparFormulario} className="btn-cancelar">
                Cancelar
              </button>
              <button type="submit" className="btn-salvar">
                {editando ? 'Atualizar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="pecas-table-container">
          {pecas.length === 0 ? (
          <p className="empty-message">Nenhuma peça cadastrada.</p>
        ) : (
          <table className="pecas-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Fornecedor</th>
                <th>Status</th>
                <th>Aeronave</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pecas.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.nome}</td>
                  <td>
                    <span className={`pecas-badge ${p.tipo === 'Nacional' ? 'pecas-badge-nacional' : 'pecas-badge-importada'}`}>
                      {p.tipo}
                    </span>
                  </td>
                  <td>{p.fornecedor}</td>
                  <td>
                    <span className={`pecas-badge pecas-badge-status-${p.status}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>{p.codigoAeronave}</td>
                  <td className="pecas-actions">
                    <button 
                      className="pecas-btn-editar"
                      onClick={() => handleEditar(p)}
                    >
                      Editar
                    </button>
                    {p.status !== 'Pronta' && (
                      <button 
                        className="pecas-btn-avancar"
                        onClick={() => handleAvancarStatus(p)}
                      >
                        Avançar
                      </button>
                    )}
                    <button 
                      className="pecas-btn-excluir"
                      onClick={() => handleExcluir(p)}
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
      )}
    </div>
  )
}

export default ListarPecas

