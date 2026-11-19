import type { User, Post, Comment, Tag, PostImage } from '../types';
// comunicacion con el backend

// Dirección de la API. Sale del archivo .env; si no está, usa localhost:3001.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// USUARIOS 

// Trae todos los usuarios. Lo usa Login.tsx para buscar el nickName que escribiste.
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    // response.ok es false si la API respondió 400, 404, 500, etc.
    throw new Error('Error al obtener los usuarios: ' + response.status);
  }
  return await response.json();
}

// Crea un usuario nuevo. Lo usa Register.tsx.
export async function createUser(nickName: string, email: string): Promise<User> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // avisamos que mandamos JSON
    body: JSON.stringify({ nickName, email }),       // los datos van en el body
  });

  if (!response.ok) {

    // Intentamos usar el mensaje que manda la API; si no hay, usamos uno genérico.
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'No se pudo crear el usuario');
  }

  return await response.json();
}

// PUBLICACIONES 

// Trae los posts. Sin userId trae todos (Home); con userId solo los de ese usuario (Profile).
export async function getPosts(userId?: number): Promise<Post[]> {
  const url = userId ? `${API_URL}/posts?userId=${userId}` : `${API_URL}/posts`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error al obtener las publicaciones: ' + response.status);
  }
  return await response.json();
}

// Trae un post puntual por su id. Lo usa PostDetail.tsx.
export async function getPostById(id: number | string): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${id}`);
  if (!response.ok) {
    throw new Error('Publicación no encontrada (' + response.status + ')');
  }
  return await response.json();
}

// Crea un post. Lo usa CreatePost.tsx. tagIds son las etiquetas que tildaste.
export async function createPost(
  description: string,
  userId: number,
  tagIds: number[]
): Promise<Post> {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, userId, tagIds }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Error al crear la publicación');
  }

  return await response.json();
}

// Borra un post. Mandamos el userId para que la API verifique que sos el dueño.
// No devuelve nada (Promise<void>), solo avisa si falló.
export async function deletePost(id: number, userId: number): Promise<void> {
  const response = await fetch(`${API_URL}/posts/${id}?userId=${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Error al borrar la publicacion');
  }
}

// ETIQUETAS 

// Trae todas las etiquetas. Home las usa para los filtros, CreatePost para los checkboxes.
export async function getTags(): Promise<Tag[]> {
  const response = await fetch(`${API_URL}/tags`);
  if (!response.ok) {
    throw new Error('Error al obtener las etiquetas: ' + response.status);
  }
  return await response.json();
}

// COMENTARIOS 

// Trae los comentarios de un post. PostDetail los muestra, PostCard solo los cuenta.
export async function getCommentsByPostId(postId: number | string): Promise<Comment[]> {
  const response = await fetch(`${API_URL}/comments/post/${postId}`);
  if (!response.ok) {
    throw new Error('Error al obtener los comentarios: ' + response.status);
  }
  return await response.json();
}

// Crea un comentario. Lo usa PostDetail.tsx al enviar el formulario.
export async function createComment(
  content: string,
  userId: number,
  postId: number
): Promise<Comment> {
  const response = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, userId, postId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Error al publicar el comentario');
  }

  return await response.json();
}

// IMÁGENES 

// Trae las imágenes de un post. PostCard muestra la primera, PostDetail todas.
export async function getImagesByPostId(postId: number | string): Promise<PostImage[]> {
  const response = await fetch(`${API_URL}/postimages/post/${postId}`);
  if (!response.ok) {
    throw new Error('Error al obtener las imágenes del post: ' + response.status);
  }
  return await response.json();
}

// Asocia una imagen (por URL) a un post ya creado. CreatePost la llama una vez por imagen.
export async function createPostImage(url: string, postId: number): Promise<PostImage> {
  const response = await fetch(`${API_URL}/postimages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, postId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Error al asociar imagen al post');
  }

  return await response.json();
}
