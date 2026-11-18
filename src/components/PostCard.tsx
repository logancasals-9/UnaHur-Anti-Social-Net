import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Post, PostImage } from '../types';
import { getCommentsByPostId, getImagesByPostId, deletePost } from '../services/api';
import { useAuth } from '../context/AuthContext';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  // Callback opcional: la pagina padre lo usa para sacar el post de su lista
  onDeleted?: (postId: number) => void;
}

export function PostCard({ post, onDeleted }: PostCardProps) {
  const { user } = useAuth();
  const [commentCount, setCommentCount] = useState<number>(0);
  const [images, setImages] = useState<PostImage[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Solo el autor del post ve el boton de borrar
  const isOwner = user != null && user.id === post.UserId;

  const handleDelete = async () => {
    if (!user) return;
    try {
      setDeleting(true);
      setDeleteError(null);
      await deletePost(post.id, user.id);
      onDeleted?.(post.id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'No se pudo borrar la publicacion');
      setDeleting(false);
      setConfirming(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getCommentsByPostId(post.id).catch(() => []),
      getImagesByPostId(post.id).catch(() => []),
    ]).then(([comments, imgs]) => {
      if (isMounted) {
        setCommentCount(comments.length);
        setImages(imgs);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [post.id]);

  return (
    <article className={`${styles.cardCustom} p-3 h-100 d-flex flex-column`}>
      {/* Cabecera del post */}
      <header className="d-flex justify-content-between align-items-center mb-2">
        <span className={styles.author}>
          @{post.User?.nickName || 'Anónimo'}
        </span>
        <div className="d-flex align-items-center gap-2">
          {post.createdAt && (
            <time className={styles.date}>
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          )}

          {/* Borrar: solo visible para el autor */}
          {isOwner && !confirming && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => setConfirming(true)}
              disabled={deleting}
            >
              Eliminar publicación
            </button>
          )}

          {isOwner && confirming && (
            <div className="d-flex align-items-center gap-1">
              <span className="small text-danger">¿Borrar?</span>
              <button
                type="button"
                className="btn btn-danger btn-sm py-0 px-2"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Borrando...' : 'Sí'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm py-0 px-2"
                onClick={() => setConfirming(false)}
                disabled={deleting}
              >
                No
              </button>
            </div>
          )}
        </div>
      </header>

      {deleteError && (
        <div className="alert alert-danger py-1 px-2 small mb-2">{deleteError}</div>
      )}

      {/* Contenido / Descripción */}
      <p className={`${styles.description} mb-3`}>{post.description}</p>

      {/* Imagen si la hay */}
      {images.length > 0 && (
        <div className={`${styles.imageContainer} mb-3`}>
          <img
            src={images[0].url}
            alt="Vista previa del post"
            className={styles.previewImg}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://via.placeholder.com/400x250?text=Imagen';
            }}
          />
          {images.length > 1 && (
            <span className={styles.moreImagesBadge}>+{images.length - 1} más</span>
          )}
        </div>
      )}

      {/* Etiquetas / Tags */}
      {post.Tags && post.Tags.length > 0 && (
        <div className="d-flex flex-wrap gap-1 mb-3">
          {post.Tags.map((tag) => (
            <span key={tag.id} className={styles.tagBadge}>
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Pie de tarjeta con Bootstrap flex */}
      <footer className={`${styles.footer} d-flex justify-content-between align-items-center pt-2 mt-auto`}>
        <span>
          💬 {commentCount} {commentCount === 1 ? 'comentario' : 'comentarios'}
        </span>

        {/* Botón Ver más con clase de Bootstrap btn-sm */}
        <Link to={`/post/${post.id}`} className="btn btn-outline-secondary btn-sm">
          Ver más →
        </Link>
      </footer>
    </article>
  );
}