import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

// 1. Definimos qué datos y funciones expone nuestro contexto a toda la app
interface AuthContextType {
  user: User | null; // El usuario logueado (o null si no hay nadie)
  login: (nickName: string, password: string, allUsers: User[]) => boolean;
  logout: () => void;
  setSessionUser: (user: User) => void; // Por si queremos loguearlo directo tras registrarse
}

// 2. Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Componente Provider que envuelve a toda nuestra aplicación
export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicializamos el estado leyendo primero de localStorage (si ya estaba logueado)
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

  // Función para iniciar sesión
  const login = (nickName: string, password: string, allUsers: User[]): boolean => {
    // Requisito del TP: contraseña fija "123456" validada localmente
    if (password !== '123456') {
      throw new Error('Contraseña incorrecta (la contraseña fija es 123456)');
    }

    // Buscamos si existe el usuario con ese nickName (ignorando mayúsculas/minúsculas)
    const foundUser = allUsers.find(
      (u) => u.nickName.toLowerCase() === nickName.trim().toLowerCase()
    );

    if (!foundUser) {
      throw new Error('El usuario "' + nickName + '" no existe. Registrate primero.');
    }

    // Si es válido, lo guardamos en el estado y en localStorage
    setUser(foundUser);
    localStorage.setItem('user', JSON.stringify(foundUser));
    return true;
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Función auxiliar para setear usuario directo (por ejemplo, después de registrarse)
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

// 4. Hook personalizado para consumir el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}