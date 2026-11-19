import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (nickName: string, password: string, allUsers: User[]) => boolean;
  logout: () => void;
  setSessionUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (nickName: string, password: string, allUsers: User[]): boolean => {

    if (password !== '123456') {
      throw new Error('Contraseña incorrecta (la contraseña fija es 123456)');
    }

    const foundUser = allUsers.find(
      (u) => u.nickName.toLowerCase() === nickName.trim().toLowerCase()
    );

    if (!foundUser) {
      throw new Error('El usuario "' + nickName + '" no existe. Registrate primero.');
    }

    setUser(foundUser);
    localStorage.setItem('user', JSON.stringify(foundUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const setSessionUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setSessionUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
