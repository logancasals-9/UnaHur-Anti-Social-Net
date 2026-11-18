import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../services/api';
import './Auth.css';

export function Login() {
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nickName.trim() || !password.trim()) {
      setError('Por favor completá todos los campos.');
      return;
    }

    try {
      setLoading(true);
      const users = await getUsers();
      login(nickName, password, users);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-wrapper py-5">
      <div className="auth-card p-4 p-md-5">
        <h2 className="text-center mb-1 text-white">Iniciar Sesión</h2>
        <p className="auth-subtitle text-center mb-4">Ingresá a UnaHur Anti-Social Net</p>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nickName" className="form-label fw-semibold small">
              Nombre de usuario (nickName)
            </label>
            <input
              id="nickName"
              type="text"
              className="form-control"
              placeholder="Ej: luna, sol"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold small">
              Contraseña (fija: 123456)
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Ingresá 123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-unahur w-100 py-2 mt-2" disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-muted small mt-4 mb-0">
          ¿No tenés cuenta? <Link to="/register" className="fw-semibold">Registrate acá</Link>
        </p>
      </div>
    </div>
  );
}