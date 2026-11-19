import { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLinkCustom} ${isActive ? styles.navLinkActive : ''}`;

  return (
    <header className={styles.navbarCustom}>
      <div className={`container d-flex align-items-center justify-content-between ${styles.navInner}`}>

        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <span className={styles.logoBadge}>UnaHur</span>
          <span className={styles.logoTitle}>Anti-Social Net</span>
        </Link>

        <button
          type="button"
          className={`${styles.burger} d-md-none`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav
          id="main-nav"
          aria-label="Navegación principal"
          className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          <NavLink to="/" end className={linkClass}>
            Inicio
          </NavLink>

          {user ? (
            <>
              <NavLink to="/create-post" className={linkClass}>
                + Crear Post
              </NavLink>

              <NavLink to="/profile" className={linkClass}>
                <span className="d-inline-flex align-items-center gap-2">
                  <span className={styles.avatar} aria-hidden="true">
                    {user.nickName.charAt(0).toUpperCase()}
                  </span>
                  @{user.nickName}
                </span>
              </NavLink>

              <button type="button" onClick={handleLogout} className={styles.btnLogout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Iniciar Sesión
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Registrarse
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
