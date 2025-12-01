import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import ListarAeronaves from './pages/aeronaves/ListarAeronaves'
import ListarPecas from './pages/pecas/ListarPecas'
import ListarEtapas from './pages/etapas/ListarEtapas'
import ListarFuncionarios from './pages/funcionarios/ListarFuncionarios'
import ListarTestes from './pages/testes/ListarTestes'
import GerarRelatorio from './pages/relatorios/GerarRelatorio'
import './App.css'

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/login" />
}

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <PrivateRoute>
          <Navbar />
          <Home />
        </PrivateRoute>
      } />
      
      <Route path="/aeronaves" element={
        <PrivateRoute>
          <Navbar />
          <ListarAeronaves />
        </PrivateRoute>
      } />

      <Route path="/pecas" element={
        <PrivateRoute>
          <Navbar />
          <ListarPecas />
        </PrivateRoute>
      } />

      <Route path="/etapas" element={
        <PrivateRoute>
          <Navbar />
          <ListarEtapas />
        </PrivateRoute>
      } />

      <Route path="/funcionarios" element={
        <PrivateRoute>
          <Navbar />
          <ListarFuncionarios />
        </PrivateRoute>
      } />

      <Route path="/testes" element={
        <PrivateRoute>
          <Navbar />
          <ListarTestes />
        </PrivateRoute>
      } />

      <Route path="/relatorios" element={
        <PrivateRoute>
          <Navbar />
          <GerarRelatorio />
        </PrivateRoute>
      } />
    </Routes>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="app">
        <AppRoutes />
      </div>
    </AuthProvider>
  )
}

export default App

