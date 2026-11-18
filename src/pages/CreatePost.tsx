import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Tag } from '../types';
import { getTags, createPost, createPostImage } from '../services/api';
import './CreatePost.css';

export function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  const [loadingTags, setLoadingTags] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTags()
      .then((tags) => setAvailableTags(tags))
      .catch(() => setError('No se pudieron cargar las etiquetas disponibles.'))
      .finally(() => setLoadingTags(false));
  }, []);

  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const handleAddImageField = () => {
    setImageUrls((prev) => [...prev, '']);
  };

  const handleRemoveImageField = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Debés estar autenticado para publicar.');
      return;
    }

    if (!description.trim()) {
      setError('La descripción de la publicación es obligatoria.');
      return;
    }

    try {
      setSubmitting(true);

      // Requisito TP: POST /posts con description, userId y tagIds
      const newPost = await createPost(description.trim(), user.id, selectedTagIds);

      // Requisito TP: Por cada URL de imagen, POST /postimages con url y postId
      const validUrls = imageUrls.map((u) => u.trim()).filter((u) => u.length > 0);
      for (const url of validUrls) {
        await createPostImage(url, newPost.id);
      }

      // Requisito TP: Redirigir al perfil al finalizar
      navigate('/profile');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error al crear la publicación.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '680px' }}>
      <div className="create-post-card p-4 p-md-5">
        <h2 className="h3 fw-bold mb-1 text-white">Crear Nueva Publicación</h2>
        <p className="text-muted small mb-4">Compartí algo reflexivo con la comunidad de UnaHur</p>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Descripción obligatoria */}
          <div className="mb-4">
            <label htmlFor="postDescription" className="form-label fw-semibold small">
              ¿Qué estás pensando? <span className="text-danger">*</span>
            </label>
            <textarea
              id="postDescription"
              className="form-control"
              rows={4}
              placeholder="Escribí acá tu publicación..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              autoFocus
            />
          </div>

          {/* Etiquetas obtenidas de la API */}
          <div className="mb-4">
            <label className="form-label fw-semibold small d-block">Etiquetas:</label>
            {loadingTags ? (
              <p className="text-muted small">Cargando etiquetas...</p>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isChecked = selectedTagIds.includes(tag.id);
                  return (
                    <label
                      key={tag.id}
                      className={`tag-checkbox-pill ${isChecked ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTagToggle(tag.id)}
                        disabled={submitting}
                      />
                      #{tag.name}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* URLs de imágenes opcionales */}
          <div className="mb-4">
            <label className="form-label fw-semibold small d-block">
              URLs de imágenes (opcional):
            </label>
            <div className="d-flex flex-column gap-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="image-input-group">
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://ejemplo.com/foto.jpg"
                    value={url}
                    onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                    disabled={submitting}
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageField(idx)}
                      className="btn btn-outline-danger btn-sm"
                      title="Eliminar campo"
                    >
                      ✖
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddImageField}
              className="btn btn-outline-secondary btn-sm mt-2"
              disabled={submitting}
            >
              ➕ Agregar otra imagen
            </button>
          </div>

          {/* Botones de acción */}
          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
            <Link to="/" className="btn btn-outline-secondary btn-sm px-3" tabIndex={submitting ? -1 : 0}>
              Cancelar
            </Link>
            <button type="submit" className="btn btn-unahur btn-sm px-4" disabled={submitting}>
              {submitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}