import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createUser } from '../services/api';
import './Auth.css';

export function Register() {
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { setSessionUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!nickName.trim() || !email.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      setLoading(true);
      const newUser = await createUser(nickName.trim(), email.trim());

      setSuccessMsg('¡Usuario registrado con éxito! Iniciando sesión...');
      setTimeout(() => {
        setSessionUser(newUser);
        navigate('/');
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('No se pudo registrar el usuario.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-wrapper py-5">
      <div className="auth-card p-4 p-md-5">
        <h2 className="text-center mb-1 text-white">Crear Cuenta</h2>
        <p className="auth-subtitle text-center mb-4">Unite a la comunidad de UnaHur</p>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {successMsg && <div className="alert alert-success py-2 small">{successMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="regNickName" className="form-label fw-semibold small">
              Nombre de usuario (nickName)
            </label>
            <input
              id="regNickName"
              type="text"
              className="form-control"
              placeholder="Ej: juan_perez"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label htmlFor="regEmail" className="form-label fw-semibold small">
              Correo electrónico
            </label>
            <input
              id="regEmail"
              type="email"
              className="form-control"
              placeholder="juan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <p className="text-muted small mb-3">
            Nota: Recordá que para iniciar sesión la contraseña siempre será <strong>123456</strong>.
          </p>

          <button type="submit" className="btn btn-unahur w-100 py-2 mt-1" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="text-center text-muted small mt-4 mb-0">
          ¿Ya tenés cuenta? <Link to="/login" className="fw-semibold">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}
