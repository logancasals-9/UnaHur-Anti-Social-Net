import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../types';
import { getPosts } from '../services/api';
import { PostCard } from '../components/PostCard';

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargamos los posts del usuario logueado usando su userId
  useEffect(() => {
    if (!user) return;

    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Requisito TP: GET /posts?userId=xxx
        const data = await getPosts(user.id);
        setUserPosts(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error al cargar tus publicaciones.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container profile-container">
      {/* Cabecera del Perfil */}
      <section className="profile-header-card">
        <div className="profile-avatar">
          {user.nickName.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>@{user.nickName}</h2>
          <p className="profile-email">✉️ {user.email}</p>
          <span className="profile-badge">Usuario Verificado</span>
        </div>
        <div className="profile-actions">
          <Link to="/create-post" className="btn btn-primary">
            + Nuevo Post
          </Link>
          <button onClick={handleLogout} className="btn btn-danger">
            Cerrar Sesión
          </button>
        </div>
      </section>

      {/* Listado de publicaciones propias */}
      <section className="user-posts-section">
        <h3>Mis Publicaciones ({userPosts.length})</h3>

        {loading && <div className="loading-spinner">Cargando tus posts...</div>}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && userPosts.length === 0 && (
          <div className="empty-profile-posts">
            <p>Todavía no publicaste nada.</p>
            <Link to="/create-post" className="btn btn-primary btn-sm">
              Creá tu primera publicación acá
            </Link>
          </div>
        )}

        <div className="posts-grid">
          {userPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}