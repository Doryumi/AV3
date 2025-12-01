import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)

    if (!usuario || !senha) {
      setErro('Preencha todos os campos!')
      setLoading(false)
      return
    }

    const success = await login(usuario, senha)
    
    if (success) {
      navigate('/')
    } else {
      setErro('Usuário ou senha inválidos!')
    }
    
    setLoading(false)
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-logo">Aerocode</h1>
          <p className="login-subtitle">Sistema de Gerenciamento de Aeronaves</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-label">Usuário</label>
            <input
              type="text"
              className="login-input"
              placeholder="Digite seu usuário"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">Senha</label>
            <input
              type="password"
              className="login-input"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
            />
          </div>

          {erro && <div className="error-message">{erro}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="info-usuarios">
          <h3>Usuários Padrão:</h3>
          <ul>
            <li><strong>admin / admin</strong> - Administrador</li>
            <li><strong>engenheiro / eng123</strong> - Engenheiro</li>
            <li><strong>operador / oper123</strong> - Operador</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login

