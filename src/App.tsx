import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Importamos todas nuestras páginas
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PostDetail } from './pages/PostDetail';
import { Profile } from './pages/Profile';
import { CreatePost } from './pages/CreatePost';

export function App() {
  return (
    // 1. Envolvemos todo con AuthProvider para que toda la app sepa quién está logueado
    <AuthProvider>
      {/* 2. BrowserRouter habilita la navegación SPA */}
      <BrowserRouter>
        <div className="app-layout">
          {/* 3. La Navbar se muestra fija en todas las pantallas */}
          <Navbar />

          <main className="main-content">
            {/* 4. Switch de rutas de la aplicación */}
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rutas Protegidas (solo para usuarios autenticados) */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-post"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />

              {/* Ruta comodín: si escribe cualquier URL desconocida, redirige al Inicio */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="app-footer">
            <p>
              UnaHur Anti-Social Net • Construcción de Interfaces de Usuario • {new Date().getFullYear()}
            </p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;