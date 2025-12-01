import React, { useState, useEffect } from 'react'
import { etapaService } from '../../services/etapaService'
import { funcionarioService } from '../../services/funcionarioService'
import { aeronaveService } from '../../services/aeronaveService'
import { Etapa } from '../../types'
import './ListarEtapas.css'

const ListarEtapas: React.FC = () => {
  const [etapas, setEtapas] = useState<Etapa[]>([])
  const [aeronaves, setAeronaves] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<{nome: string, codigoAeronave: string} | null>(null)
  const [showAssociar, setShowAssociar] = useState<{nome: string, codigoAeronave: string} | null>(null)
  const [cpfFuncionario, setCpfFuncionario] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  
  const [formData, setFormData] = useState<Etapa>({
    nome: '',
    prazo: '',
    status: 'Pendente',
    codigoAeronave: '',
    funcionarios: []
  })

  useEffect(() => {
    carregarEtapas()
    carregarAeronaves()
  }, [])

  const carregarEtapas = async () => {
    const data = await etapaService.getAll()
    setEtapas(data)
  }

  const carregarAeronaves = async () => {
    const aeronavesList = await aeronaveService.getAll()
    setAeronaves(aeronavesList.map(a => a.codigo))
  }

  const limparFormulario = () => {
    setFormData({
      nome: '',
      prazo: '',
      status: 'Pendente',
      codigoAeronave: '',
      funcionarios: []
    })
    setShowForm(false)
    setEditando(null)
    setErro('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setMensagem('')

    if (!formData.nome || !formData.prazo || !formData.codigoAeronave) {
      setErro('Preencha todos os campos!')
      return
    }

    if (!aeronaves.includes(formData.codigoAeronave)) {
      setErro('Aeronave não encontrada!')
      return
    }

    const result = editando 
      ? await etapaService.update(editando.nome, editando.codigoAeronave, formData)
      : await etapaService.create(formData)

    if (result.success) {
      setMensagem(result.message)
      await carregarEtapas()
      limparFormulario()
      setTimeout(() => setMensagem(''), 3000)
    } else {
      setErro(result.message)
    }
  }

  const handleEditar = (etapa: Etapa) => {
    setFormData(etapa)
    setEditando({ nome: etapa.nome, codigoAeronave: etapa.codigoAeronave })
    setShowForm(true)
  }

  const handleIniciar = async (etapa: Etapa) => {
    const result = await etapaService.iniciar(etapa.nome, etapa.codigoAeronave)
    if (result.success) {
      setMensagem(result.message)
      await carregarEtapas()
      setTimeout(() => setMensagem(''), 3000)
    } else {
      setErro(result.message)
    }
  }

  const handleFinalizar = async (etapa: Etapa) => {
    const result = await etapaService.finalizar(etapa.nome, etapa.codigoAeronave)
    if (result.success) {
      setMensagem(result.message)
      await carregarEtapas()
      setTimeout(() => setMensagem(''), 3000)
    } else {
      setErro(result.message)
    }
  }

  const handleAssociarFuncionario = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showAssociar) return
    
    setErro('')
    setMensagem('')

    if (!cpfFuncionario) {
      setErro('Digite o CPF do funcionário!')
      return
    }

    const funcionario = await funcionarioService.getByCpf(cpfFuncionario)
    if (!funcionario) {
      setErro('Funcionário não encontrado!')
      return
    }

    const result = await etapaService.associarFuncionario(showAssociar.nome, showAssociar.codigoAeronave, cpfFuncionario)
    if (result.success) {
      setMensagem(result.message)
      await carregarEtapas()
      setCpfFuncionario('')
      setShowAssociar(null)
      setTimeout(() => setMensagem(''), 3000)
    } else {
      setErro(result.message)
    }
  }

  const handleDesassociar = async (etapa: Etapa, cpf: string) => {
    if (window.confirm('Desassociar este funcionário?')) {
      const result = await etapaService.desassociarFuncionario(etapa.nome, etapa.codigoAeronave, cpf)
      if (result.success) {
        setMensagem(result.message)
        await carregarEtapas()
        setTimeout(() => setMensagem(''), 3000)
      } else {
        setErro(result.message)
      }
    }
  }

  const handleExcluir = async (etapa: Etapa) => {
    if (window.confirm('Tem certeza que deseja excluir esta etapa?')) {
      const result = await etapaService.delete(etapa.nome, etapa.codigoAeronave)
      if (result.success) {
        setMensagem(result.message)
        await carregarEtapas()
        setTimeout(() => setMensagem(''), 3000)
      } else {
        setErro(result.message)
      }
    }
  }

  const getFuncionarioNome = (cpf: string): string => {
    return cpf 
  }

  return (
    <div className="etapas-container">
      <div className="etapas-header">
        <h1 className="etapas-title">Etapas de Produção</h1>
        {!showForm && !showAssociar && (
          <button 
            className="etapas-btn-cadastrar"
            onClick={() => setShowForm(true)}
          >
            Cadastrar Etapa
          </button>
        )}
      </div>

      {mensagem && <div className="success-message">{mensagem}</div>}
      {erro && <div className="error-message">{erro}</div>}

      {showForm && (
        <div className="etapas-form-container">
          <h2>{editando ? 'Editar Etapa' : 'Cadastrar Etapa'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Montagem da Fuselagem"
                />
              </div>

              <div className="form-group">
                <label>Prazo</label>
                <input
                  type="date"
                  value={formData.prazo}
                  onChange={(e) => setFormData({...formData, prazo: e.target.value})}
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

      {showAssociar && (
        <div className="etapas-form-container">
          <h2>Associar Funcionário</h2>
          <p>Etapa: <strong>{showAssociar.nome}</strong></p>
          <form onSubmit={handleAssociarFuncionario}>
            <div className="form-group">
              <label>CPF do Funcionário</label>
              <input
                type="text"
                value={cpfFuncionario}
                onChange={(e) => setCpfFuncionario(e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => {setShowAssociar(null); setCpfFuncionario('')}} className="btn-cancelar">
                Cancelar
              </button>
              <button type="submit" className="btn-salvar">
                Associar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="etapas-list">
        {etapas.length === 0 ? (
          <p className="empty-message">Nenhuma etapa cadastrada.</p>
        ) : (
          etapas.map((e, idx) => (
            <div key={idx} className="etapa-card">
              <div className="etapa-header">
                <h3>{e.nome}</h3>
                <span className={`etapa-badge etapa-badge-status-${e.status}`}>
                  {e.status}
                </span>
              </div>
              
              <div className="etapa-info">
                <p><strong>Aeronave:</strong> {e.codigoAeronave}</p>
                <p><strong>Prazo:</strong> {new Date(e.prazo).toLocaleDateString('pt-BR')}</p>
                
                <div className="etapa-funcionarios">
                  <strong>Funcionários:</strong>
                  {e.funcionarios.length === 0 ? (
                    <span className="etapa-sem-funcionarios"> Nenhum</span>
                  ) : (
                    <ul>
                      {e.funcionarios.map((cpf, i) => (
                        <li key={i}>
                          {getFuncionarioNome(cpf)} ({cpf})
                          <button 
                            onClick={() => handleDesassociar(e, cpf)}
                            className="btn-desassociar"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="etapa-actions">
                <button onClick={() => handleEditar(e)} className="etapa-btn-editar">
                  Editar
                </button>
                <button 
                  onClick={() => setShowAssociar({nome: e.nome, codigoAeronave: e.codigoAeronave})} 
                  className="etapa-btn-associar"
                >
                  Associar Funcionário
                </button>
                {e.status === 'Pendente' && (
                  <button onClick={() => handleIniciar(e)} className="etapa-btn-iniciar">
                    Iniciar
                  </button>
                )}
                {e.status === 'Em Andamento' && (
                  <button onClick={() => handleFinalizar(e)} className="etapa-btn-finalizar">
                    Finalizar
                  </button>
                )}
                <button onClick={() => handleExcluir(e)} className="etapa-btn-excluir">
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ListarEtapas
