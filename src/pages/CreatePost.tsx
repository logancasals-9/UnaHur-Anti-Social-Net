import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Tag } from '../types';
import { getTags, createPost, createPostImage } from '../services/api';

export function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estados del formulario
  const [description, setDescription] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']); // Arranca con un input

  // Estados de feedback visual
  const [loadingTags, setLoadingTags] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. CARGAMOS LAS ETIQUETAS DESDE LA API (GET /tags)
  useEffect(() => {
    getTags()
      .then((tags) => setAvailableTags(tags))
      .catch(() => setError('No se pudieron cargar las etiquetas disponibles.'))
      .finally(() => setLoadingTags(false));
  }, []);

  // Manejador para marcar/desmarcar etiquetas (checkboxes)
  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  // Manejador para cambiar el texto de una URL de imagen
  const handleImageUrlChange = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  // Agregar otro campo de imagen
  const handleAddImageField = () => {
    setImageUrls((prev) => [...prev, '']);
  };

  // Quitar un campo de imagen
  const handleRemoveImageField = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // 2. ENVÍO DEL FORMULARIO (POST /posts y luego POST /postimages)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Debés estar autenticado para publicar.');
      return;
    }

    // Requisito TP: Descripción obligatoria
    if (!description.trim()) {
      setError('La descripción de la publicación es obligatoria.');
      return;
    }

    try {
      setSubmitting(true);

      // Paso A: Crear el Post (POST /posts con description, userId, tagIds)
      const newPost = await createPost(description.trim(), user.id, selectedTagIds);

      // Paso B: Por cada URL de imagen válida, hacer POST /postimages con url y postId
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
    <div className="container create-post-container">
      <div className="create-post-card">
        <h2>Crear Nueva Publicación</h2>
        <p className="subtitle">Compartí algo con la comunidad de UnaHur</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="post-form">
          {/* Campo 1: Descripción obligatoria */}
          <div className="form-group">
            <label htmlFor="postDescription">
              ¿Qué estás pensando? <span className="required">*</span>
            </label>
            <textarea
              id="postDescription"
              rows={4}
              placeholder="Escribí acá tu publicación..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              autoFocus
            />
          </div>

          {/* Campo 2: Selección de etiquetas obtenidas de la API */}
          <div className="form-group">
            <label>Etiquetas:</label>
            {loadingTags ? (
              <p className="loading-text">Cargando etiquetas...</p>
            ) : (
              <div className="tags-checkbox-group">
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

          {/* Campo 3: URLs de imágenes opcionales */}
          <div className="form-group">
            <label>URLs de imágenes (opcional):</label>
            <p className="help-text">Podés agregar imágenes pegando enlaces directos.</p>
            {imageUrls.map((url, idx) => (
              <div key={idx} className="image-url-row">
                <input
                  type="url"
                  placeholder="https://ejemplo.com/foto.jpg"
                  value={url}
                  onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                  disabled={submitting}
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImageField(idx)}
                    className="btn-remove-url"
                    title="Eliminar campo"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImageField}
              className="btn btn-secondary btn-sm btn-add-image"
              disabled={submitting}
            >
              ➕ Agregar otra imagen
            </button>
          </div>

          {/* Botones de acción */}
          <div className="form-actions">
            <Link to="/" className="btn btn-secondary" tabIndex={submitting ? -1 : 0}>
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}