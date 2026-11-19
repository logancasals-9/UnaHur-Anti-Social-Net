import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

// Qué cosas comparte el Context con el resto de la app.
interface AuthContextType {
  user: User | null;
  login: (nickName: string, password: string, allUsers: User[]) => boolean;
  logout: () => void;
  setSessionUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Envuelve toda la app (está en App.tsx) para que cualquier componente pueda leer la sesión.
export function AuthProvider({ children }: { children: ReactNode }) {

  // El usuario logueado. Arranca leyendo localStorage, así no se pierde la sesión al refrescar.
  // Esta función corre una sola vez, al montar.
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        return JSON.parse(saved); // localStorage guarda texto, hay que volverlo objeto
      } catch {
        return null; // si el texto está roto, arrancamos sin sesión
      }
    }
    return null;
  });

  // Login simulado: la API del TP no maneja contraseñas, así que validamos acá.
  const login = (nickName: string, password: string, allUsers: User[]): boolean => {

    // La contraseña es fija para todos los usuarios.
    if (password !== '123456') {
      throw new Error('Contraseña incorrecta (la contraseña fija es 123456)');
    }

    // Buscamos el nickName en la lista que nos pasa Login.tsx (sin importar mayúsculas).
    const foundUser = allUsers.find(
      (u) => u.nickName.toLowerCase() === nickName.trim().toLowerCase()
    );

    if (!foundUser) {
      throw new Error('El usuario "' + nickName + '" no existe. Registrate primero.');
    }

    setUser(foundUser);                                      // lo que ven los componentes
    localStorage.setItem('user', JSON.stringify(foundUser));  // copia para sobrevivir al refresh
    return true;
  };

  // Cierra sesión: borra el estado y la copia guardada.
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); 
  };

  // Loguea directo sin pedir contraseña. Lo usa Register.tsx después de crear la cuenta.
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

// Atajo para usar el Context desde cualquier componente: const { user } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Pasa si el componente está fuera del <AuthProvider>.
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
