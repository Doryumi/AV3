import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Home.css'

const Home: React.FC = () => {
  const { user, hasPermission } = useAuth()

  if (!user) return null

  const isAdmin = hasPermission([1])
  const isEngenheiro = hasPermission([2])
  const isOperador = hasPermission([3])

  return (
    <div className="home-container">
      <h1 className="home-title">Bem-vindo ao Aerocode</h1>
      <p className="home-subtitle">Olá, {user.nome}!</p>

      <div className="home-grid">
        {(isAdmin || isOperador) && (
          <Link to="/aeronaves" className="home-card">
            <h2 className="home-card-title">Aeronaves</h2>
            <p className="home-card-description">Gerenciar modelos de aeronaves</p>
          </Link>
        )}

        {(isAdmin || isOperador) && (
          <Link to="/pecas" className="home-card">
            <h2 className="home-card-title">Peças</h2>
            <p className="home-card-description">Controlar peças e componentes</p>
          </Link>
        )}

        {(isAdmin || isEngenheiro) && (
          <Link to="/etapas" className="home-card">
            <h2 className="home-card-title">Etapas</h2>
            <p className="home-card-description">Acompanhar etapas de produção</p>
          </Link>
        )}

        {(isAdmin || isEngenheiro) && (
          <Link to="/funcionarios" className="home-card">
            <h2 className="home-card-title">Funcionários</h2>
            <p className="home-card-description">Gerenciar equipe de trabalho</p>
          </Link>
        )}

        {(isAdmin || isEngenheiro) && (
          <Link to="/testes" className="home-card">
            <h2 className="home-card-title">Testes</h2>
            <p className="home-card-description">Registrar testes de qualidade</p>
          </Link>
        )}

        {(isAdmin || isEngenheiro) && (
          <Link to="/relatorios" className="home-card">
            <h2 className="home-card-title">Relatórios</h2>
            <p className="home-card-description">Gerar relatórios de produção</p>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Home

