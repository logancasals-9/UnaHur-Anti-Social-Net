import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Post, PostImage } from '../types';
import { getCommentsByPostId, getImagesByPostId } from '../services/api';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [commentCount, setCommentCount] = useState<number>(0);
  const [images, setImages] = useState<PostImage[]>([]);

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
    <article className={`${styles.cardCustom} p-3 mb-3`}>
      {/* Cabecera del post */}
      <header className="d-flex justify-content-between align-items-center mb-2">
        <span className={styles.author}>
          @{post.User?.nickName || 'Anónimo'}
        </span>
        {post.createdAt && (
          <time className={styles.date}>
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
        )}
      </header>

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
      <footer className={`${styles.footer} d-flex justify-content-between align-items-center pt-2`}>
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