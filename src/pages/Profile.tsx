import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../types';
import { getPosts } from '../services/api';
import { PostCard } from '../components/PostCard';
import './Profile.css';

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        setError(null);

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

  const handlePostDeleted = (postId: number) => {
    setUserPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container py-4 profile-container" style={{ maxWidth: '1200px' }}>

      <section className="card shadow-sm border-0 mb-4 p-4 rounded-4">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="profile-avatar-circle">
            {user.nickName.charAt(0).toUpperCase()}
          </div>

          <div className="flex-grow-1">
            <h2 className="h4 fw-bold mb-1 text-white">@{user.nickName}</h2>
            <p className="text-muted small mb-2">✉️ {user.email}</p>
            <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill px-3 py-1 small">
              Usuario Activo
            </span>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <Link to="/create-post" className="btn btn-unahur btn-sm px-3">
              + Nuevo Post
            </Link>
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm px-3">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="h5 fw-bold mb-3 text-white">
          Mis Publicaciones ({userPosts.length})
        </h3>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-2">Cargando tus publicaciones...</p>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && userPosts.length === 0 && (
          <div className="card text-center p-5 text-muted border-dashed rounded-4">
            <p className="mb-2">Todavía no creaste ninguna publicación.</p>
            <div>
              <Link to="/create-post" className="btn btn-unahur btn-sm">
                Creá tu primer post acá
              </Link>
            </div>
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
          {userPosts.map((post) => (
            <div className="col" key={post.id}>
              <PostCard post={post} onDeleted={handlePostDeleted} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
