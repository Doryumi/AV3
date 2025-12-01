import React, { createContext, useContext, useState, useEffect } from 'react';
import { Funcionario } from '../types';
import { funcionarioService } from '../services/funcionarioService';

interface AuthContextType {
  user: Funcionario | null;
  login: (cpf: string, senha: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredLevel: number[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Funcionario | null>(null);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('aerocode_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (cpf: string, senha: string): Promise<boolean> => {
    const funcionario = await funcionarioService.authenticate(cpf, senha);
    
    if (funcionario) {
      setUser(funcionario);
      sessionStorage.setItem('aerocode_user', JSON.stringify(funcionario));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('aerocode_user');
  };

  const hasPermission = (requiredLevels: number[]): boolean => {
    if (!user) return false;
    return requiredLevels.includes(user.nivelPermissao);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
