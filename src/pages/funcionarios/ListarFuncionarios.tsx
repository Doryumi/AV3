import React, { useState, useEffect } from 'react'
import { funcionarioService } from '../../services/funcionarioService'
import { Funcionario } from '../../types'
import './ListarFuncionarios.css'

const ListarFuncionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  
  const [formData, setFormData] = useState<Funcionario>({
    cpf: '',
    nome: '',
    usuario: '',
    senha: '',
    nivelPermissao: 3
  })

  useEffect(() => {
    carregarFuncionarios()
  }, [])

  const carregarFuncionarios = async () => {
    const data = await funcionarioService.getAll()
    setFuncionarios(data)
  }

  const limparFormulario = () => {
    setFormData({
      cpf: '',
      nome: '',
      usuario: '',
      senha: '',
      nivelPermissao: 3
    })
    setShowForm(false)
    setEditando(null)
    setErro('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setMensagem('')

    if (!formData.cpf || !formData.nome || !formData.usuario || !formData.senha) {
      setErro('Preencha todos os campos obrigatórios!')
      return
    }

    const result = editando 
      ? await funcionarioService.update(editando, formData)
      : await funcionarioService.create(formData)

    if (result.success) {
      setMensagem(result.message)
      await carregarFuncionarios()
      limparFormulario()
      setTimeout(() => setMensagem(''), 3000)
    } else {
      setErro(result.message)
    }
  }

  const handleEditar = (funcionario: Funcionario) => {
    setFormData(funcionario)
    setEditando(funcionario.cpf)
    setShowForm(true)
  }

  const handleExcluir = async (cpf: string) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      const result = await funcionarioService.delete(cpf)
      if (result.success) {
        setMensagem(result.message)
        await carregarFuncionarios()
        setTimeout(() => setMensagem(''), 3000)
      } else {
        setErro(result.message)
      }
    }
  }

  return (
    <div className="funcionarios-container">
      <div className="funcionarios-header">
        <h1 className="funcionarios-title">Funcionários</h1>
        {!showForm && (
          <button 
            className="funcionarios-btn-cadastrar"
            onClick={() => setShowForm(true)}
          >
            Cadastrar Funcionário
          </button>
        )}
      </div>

      {mensagem && <div className="success-message">{mensagem}</div>}
      {erro && <div className="error-message">{erro}</div>}

      {showForm && (
        <div className="funcionarios-form-container">
          <h2>{editando ? 'Editar Funcionário' : 'Cadastrar Funcionário'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>CPF *</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Nome completo"
                />
              </div>

              <div className="form-group">
                <label>Usuário *</label>
                <input
                  type="text"
                  value={formData.usuario}
                  onChange={(e) => setFormData({...formData, usuario: e.target.value})}
                  placeholder="Nome de usuário"
                />
              </div>

              <div className="form-group">
                <label>Senha *</label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  placeholder="Senha"
                />
              </div>

              <div className="form-group">
                <label>Nível de Permissão</label>
                <select
                  value={formData.nivelPermissao}
                  onChange={(e) => setFormData({...formData, nivelPermissao: Number(e.target.value)})}
                >
                  <option value={1}>Administrador</option>
                  <option value={2}>Engenheiro</option>
                  <option value={3}>Operador</option>
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
        <div className="funcionarios-table-container">
          {funcionarios.length === 0 ? (
          <p className="empty-message">Nenhum funcionário cadastrado.</p>
        ) : (
          <table className="funcionarios-table">
            <thead>
              <tr>
                <th>CPF</th>
                <th>Nome</th>
                <th>Usuário</th>
                <th>Nível</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((f) => (
                <tr key={f.cpf}>
                  <td>{f.cpf}</td>
                  <td>{f.nome}</td>
                  <td>{f.usuario}</td>
                  <td>
                    <span className={`funcionario-badge funcionario-badge-nivel-${f.nivelPermissao}`}>
                      {f.nivelPermissao === 1 ? 'Administrador' : f.nivelPermissao === 2 ? 'Engenheiro' : 'Operador'}
                    </span>
                  </td>
                  <td className="funcionarios-actions">
                    <button 
                      className="funcionarios-btn-editar"
                      onClick={() => handleEditar(f)}
                    >
                      Editar
                    </button>
                    <button 
                      className="funcionarios-btn-excluir"
                      onClick={() => handleExcluir(f.cpf)}
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

export default ListarFuncionarios
