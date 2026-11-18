import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.navbarCustom}>
      {/* Usamos el container y flexbox nativos de Bootstrap */}
      <div className="container d-flex align-items-center justify-content-between py-2 flex-wrap gap-2">
        {/* Logo */}
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <span className={styles.logoBadge}>UnaHur</span>
          <span className={styles.logoTitle}>Anti-Social Net</span>
        </Link>

        {/* Enlaces de navegación */}
        <nav className="d-flex align-items-center gap-2 flex-wrap">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navLinkCustom} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            Inicio
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/create-post"
                className={({ isActive }) =>
                  `${styles.navLinkCustom} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                + Crear Post
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${styles.navLinkCustom} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                👤 @{user.nickName}
              </NavLink>
              <button onClick={handleLogout} className={styles.btnLogout} title="Cerrar sesión">
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${styles.navLinkCustom} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                Iniciar Sesión
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `${styles.navLinkCustom} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                Registrarse
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}