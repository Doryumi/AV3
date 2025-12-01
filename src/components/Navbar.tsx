import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout, hasPermission } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  const isAdmin = hasPermission([1])
  const isEngenheiro = hasPermission([2])
  const isOperador = hasPermission([3])

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            Aerocode
          </Link>
          
          <div className="navbar-menu">
            {(isAdmin || isOperador) && (
              <Link to="/aeronaves" className="navbar-link">
                Aeronaves
              </Link>
            )}
            {(isAdmin || isOperador) && (
              <Link to="/pecas" className="navbar-link">
                Peças
              </Link>
            )}
            {(isAdmin || isEngenheiro) && (
              <Link to="/etapas" className="navbar-link">
                Etapas
              </Link>
            )}
            {(isAdmin || isEngenheiro) && (
              <Link to="/funcionarios" className="navbar-link">
                Funcionários
              </Link>
            )}
            {(isAdmin || isEngenheiro) && (
              <Link to="/testes" className="navbar-link">
                Testes
              </Link>
            )}
            {(isAdmin || isEngenheiro) && (
              <Link to="/relatorios" className="navbar-link">
                Relatórios
              </Link>
            )}
          </div>

          <div className="navbar-user-section">
            <div className="navbar-user-info">
              <div className="navbar-user-name">{user.nome}</div>
              <div className="navbar-user-role">
                {user.nivelPermissao === 1 ? 'Administrador' : user.nivelPermissao === 2 ? 'Engenheiro' : 'Operador'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="navbar-logout-btn"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

