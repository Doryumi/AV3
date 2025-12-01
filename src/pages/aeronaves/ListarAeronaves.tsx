import React, { useState, useEffect } from 'react'
import { aeronaveService } from '../../services/aeronaveService'
import { Aeronave } from '../../types'
import './ListarAeronaves.css'

const ListarAeronaves: React.FC = () => {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  
  const [formData, setFormData] = useState<Aeronave>({
    codigo: '',
    modelo: '',
    tipo: 'Comercial',
    capacidade: 0,
    alcance: 0
  })

  useEffect(() => {
    carregarAeronaves()
  }, [])

  const carregarAeronaves = async () => {
    const data = await aeronaveService.getAll()
    setAeronaves(data)
  }

  const limparFormulario = () => {
    setFormData({
      codigo: '',
      modelo: '',
      tipo: 'Comercial',
      capacidade: 0,
      alcance: 0
    })
    setShowForm(false)
    setEditando(null)
    setErro('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setMensagem('')

    if (!formData.codigo || !formData.modelo || formData.capacidade <= 0 || formData.alcance <= 0) {
      setErro('Preencha todos os campos corretamente!')
      return
    }

    const result = editando 
      ? await aeronaveService.update(editando, formData)
      : await aeronaveService.create(formData)

    if (result.success) {
      setMensagem(result.message)
      await carregarAeronaves()
      limparFormulario()
      setTimeout(() => setMensagem(''), 3000)
    } else {
      setErro(result.message)
    }
  }

  const handleEditar = (aeronave: Aeronave) => {
    setFormData(aeronave)
    setEditando(aeronave.codigo)
    setShowForm(true)
  }

  const handleExcluir = async (codigo: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta aeronave?')) {
      const result = await aeronaveService.delete(codigo)
      if (result.success) {
        setMensagem(result.message)
        await carregarAeronaves()
        setTimeout(() => setMensagem(''), 3000)
      } else {
        setErro(result.message)
      }
    }
  }

  return (
    <div className="aeronaves-container">
      <div className="aeronaves-header">
        <h1 className="aeronaves-title">Aeronaves</h1>
        {!showForm && (
          <button 
            className="aeronaves-btn-cadastrar"
            onClick={() => setShowForm(true)}
          >
            Cadastrar Aeronave
          </button>
        )}
      </div>

      {mensagem && <div className="success-message">{mensagem}</div>}
      {erro && <div className="error-message">{erro}</div>}

      {showForm && (
        <div className="aeronaves-form-container">
          <h2>{editando ? 'Editar Aeronave' : 'Cadastrar Aeronave'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Código</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                  placeholder="Ex: A001"
                />
              </div>

              <div className="form-group">
                <label>Modelo</label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                  placeholder="Ex: Boeing 737"
                />
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                >
                  <option value="Comercial">Comercial</option>
                  <option value="Militar">Militar</option>
                </select>
              </div>

              <div className="form-group">
                <label>Capacidade</label>
                <input
                  type="number"
                  value={formData.capacidade}
                  onChange={(e) => setFormData({...formData, capacidade: Number(e.target.value)})}
                  placeholder="Ex: 180"
                />
              </div>

              <div className="form-group">
                <label>Alcance (km)</label>
                <input
                  type="number"
                  value={formData.alcance}
                  onChange={(e) => setFormData({...formData, alcance: Number(e.target.value)})}
                  placeholder="Ex: 5000"
                />
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
        <div className="aeronaves-table-container">
          {aeronaves.length === 0 ? (
          <p className="empty-message">Nenhuma aeronave cadastrada.</p>
        ) : (
          <table className="aeronaves-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Modelo</th>
                <th>Tipo</th>
                <th>Capacidade</th>
                <th>Alcance (km)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {aeronaves.map((a) => (
                <tr key={a.codigo}>
                  <td>{a.codigo}</td>
                  <td>{a.modelo}</td>
                  <td>
                    <span className={`aeronaves-badge ${a.tipo === 'Comercial' ? 'aeronaves-badge-comercial' : 'aeronaves-badge-militar'}`}>
                      {a.tipo}
                    </span>
                  </td>
                  <td>{a.capacidade}</td>
                  <td>{a.alcance}</td>
                  <td className="aeronaves-actions">
                    <button 
                      className="aeronaves-btn-editar"
                      onClick={() => handleEditar(a)}
                    >
                      Editar
                    </button>
                    <button 
                      className="aeronaves-btn-excluir"
                      onClick={() => handleExcluir(a.codigo)}
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

export default ListarAeronaves

