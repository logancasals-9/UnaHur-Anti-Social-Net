import { useEffect, useState } from 'react';
import type { Post, Tag } from '../types';
import { getPosts, getTags } from '../services/api';
import { PostCard } from '../components/PostCard';
import './Home.css';

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [postsData, tagsData] = await Promise.all([
          getPosts(),
          getTags().catch(() => []),
        ]);

        setPosts(postsData);
        setTags(tagsData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error al conectar con el servidor.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = selectedTag
    ? posts.filter((p) => p.Tags?.some((t) => t.name === selectedTag))
    : posts;

  return (
    <div className="container py-4" style={{ maxWidth: '850px' }}>
      {/* Banner de bienvenida (Sobre Nosotros) */}
      <section className="hero-banner p-4 p-md-5 mb-4 text-center">
        <h1 className="hero-title mb-2">UnaHur Anti-Social Net</h1>
        <p className="lead mb-0 opacity-90">
          La red social para la people de la unahur. Compartí tus pensamientos, fotos y comentarios con la comunidad.
        </p>
      </section>

      {/* Barra de Filtro por Etiquetas (Bonus opcional) */}
      {tags.length > 0 && (
        <section className="tags-filter-bar p-3 mb-4 d-flex align-items-center gap-2 flex-wrap">
          <span className="fw-bold text-secondary small me-2">Filtrar por etiqueta:</span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`filter-tag-btn ${selectedTag === null ? 'active' : ''}`}
          >
            Todas
          </button>
          {tags.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTag(selectedTag === t.name ? null : t.name)}
              className={`filter-tag-btn ${selectedTag === t.name ? 'active' : ''}`}
            >
              #{t.name}
            </button>
          ))}
        </section>
      )}

      {/* Feed de Publicaciones */}
      <main>
        <h2 className="h4 fw-bold mb-3 text-dark">Feed de Publicaciones Recientes</h2>

        {/* Spinner nativo de Bootstrap */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-2">Cargando publicaciones...</p>
          </div>
        )}

        {/* Alerta nativa de Bootstrap */}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && filteredPosts.length === 0 && (
          <div className="card text-center p-5 text-muted border-dashed">
            {selectedTag
              ? `No hay publicaciones con la etiqueta #${selectedTag}.`
              : 'Aún no hay publicaciones en el feed. ¡Sé el primero en crear una!'}
          </div>
        )}

        <div>
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}