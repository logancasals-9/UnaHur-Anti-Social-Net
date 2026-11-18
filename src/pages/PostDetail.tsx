import { useEffect, useState, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Post, Comment, PostImage } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  getPostById,
  getCommentsByPostId,
  getImagesByPostId,
  createComment,
} from '../services/api';
import './PostDetail.css';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [images, setImages] = useState<PostImage[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadPostData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [postData, commentsData, imagesData] = await Promise.all([
          getPostById(id),
          getCommentsByPostId(id),
          getImagesByPostId(id),
        ]);

        setPost(postData);
        setComments(commentsData);
        setImages(imagesData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error al cargar la publicación.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadPostData();
  }, [id]);

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCommentError(null);

    if (!user) {
      setCommentError('Debés iniciar sesión para dejar un comentario.');
      return;
    }

    if (!newComment.trim()) {
      setCommentError('El comentario no puede estar vacío.');
      return;
    }

    try {
      setSubmittingComment(true);
      const created = await createComment(newComment.trim(), user.id, Number(id));

      const commentWithUser: Comment = {
        ...created,
        User: user,
      };

      setComments((prev) => [...prev, commentWithUser]);
      setNewComment('');
    } catch (err) {
      if (err instanceof Error) {
        setCommentError(err.message);
      } else {
        setCommentError('No se pudo enviar el comentario.');
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-2">Cargando publicación...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-5" style={{ maxWidth: '800px' }}>
        <div className="alert alert-danger">{error || 'Publicación no encontrada.'}</div>
        <Link to="/" className="btn btn-outline-secondary">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4 post-detail-container" style={{ maxWidth: '800px' }}>
      <Link to="/" className="btn btn-link text-decoration-none text-secondary p-0 mb-3 d-inline-block">
        ← Volver al feed
      </Link>

      {/* Tarjeta de la publicación */}
      <article className="card shadow-sm border-0 mb-4 p-4 rounded-4">
        <header className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-bold fs-5 text-white">
            @{post.User?.nickName || 'Anónimo'}
          </span>
          {post.createdAt && (
            <time className="text-muted small">
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          )}
        </header>

        {/* Descripción completa */}
        <p className="fs-5 text-white mb-4" style={{ whiteSpace: 'pre-line' }}>
          {post.description}
        </p>

        {/* Imágenes */}
        {images.length > 0 && (
          <div className="post-images-grid mb-4">
            {images.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt="Imagen de la publicación"
                className="post-detail-img"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                }}
              />
            ))}
          </div>
        )}

        {/* Etiquetas */}
        {post.Tags && post.Tags.length > 0 && (
          <div className="d-flex flex-wrap gap-2">
            {post.Tags.map((tag) => (
              <span key={tag.id} className="detail-tag-badge">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Sección de Comentarios */}
      <section className="card shadow-sm border-0 p-4 rounded-4">
        <h3 className="h5 fw-bold mb-3 text-white">Comentarios ({comments.length})</h3>

        {/* Formulario para comentar */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-4">
            {commentError && <div className="alert alert-danger py-2 small">{commentError}</div>}
            <div className="mb-2">
              <textarea
                className="form-control"
                placeholder="Escribí un comentario reflexivo..."
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={submittingComment}
              />
            </div>
            <button
              type="submit"
              className="btn btn-unahur btn-sm px-3"
              disabled={submittingComment}
            >
              {submittingComment ? 'Publicando...' : 'Comentar'}
            </button>
          </form>
        ) : (
          <div className="alert alert-info py-2 small mb-4">
            <Link to="/login" className="fw-bold">Iniciá sesión</Link> para dejar un comentario.
          </div>
        )}

        {/* Lista de comentarios */}
        <div className="d-flex flex-direction-column flex-column gap-2">
          {comments.length === 0 ? (
            <p className="text-muted small fst-italic mb-0">No hay comentarios en esta publicación aún.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="comment-bubble p-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="comment-author">@{c.User?.nickName || 'Usuario'}</span>
                  {c.createdAt && (
                    <span className="comment-date">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="comment-content mb-0">{c.content}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}