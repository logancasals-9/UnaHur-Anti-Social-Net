import type { User, Post, Comment, Tag, PostImage } from '../types';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error('Error al obtener los usuarios: ' + response.status);
  }
  return await response.json();
}

export async function createUser(nickName: string, email: string): Promise<User> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickName, email }),
  });

  if (!response.ok) {

    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'No se pudo crear el usuario');
  }

  return await response.json();
}

export async function getPosts(userId?: number): Promise<Post[]> {
  const url = userId ? `${API_URL}/posts?userId=${userId}` : `${API_URL}/posts`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error al obtener las publicaciones: ' + response.status);
  }
  return await response.json();
}

export async function getPostById(id: number | string): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${id}`);
  if (!response.ok) {
    throw new Error('Publicación no encontrada (' + response.status + ')');
  }
  return await response.json();
}

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

export async function deletePost(id: number, userId: number): Promise<void> {
  const response = await fetch(`${API_URL}/posts/${id}?userId=${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Error al borrar la publicacion');
  }
}

export async function getTags(): Promise<Tag[]> {
  const response = await fetch(`${API_URL}/tags`);
  if (!response.ok) {
    throw new Error('Error al obtener las etiquetas: ' + response.status);
  }
  return await response.json();
}

export async function getCommentsByPostId(postId: number | string): Promise<Comment[]> {
  const response = await fetch(`${API_URL}/comments/post/${postId}`);
  if (!response.ok) {
    throw new Error('Error al obtener los comentarios: ' + response.status);
  }
  return await response.json();
}

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

export async function getImagesByPostId(postId: number | string): Promise<PostImage[]> {
  const response = await fetch(`${API_URL}/postimages/post/${postId}`);
  if (!response.ok) {
    throw new Error('Error al obtener las imágenes del post: ' + response.status);
  }
  return await response.json();
}

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
