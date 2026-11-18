// 1. Representa un usuario de la red social (GET /users)
export interface User {
  id: number;
  nickName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

// 2. Representa una etiqueta (GET /tags)
export interface Tag {
  id: number;
  name: string;
}

// 3. Representa una imagen asociada a un post (GET /postimages/post/:postId)
export interface PostImage {
  id: number;
  url: string;
  PostId: number;
}

// 4. Representa un comentario visible (GET /comments/post/:postId)
export interface Comment {
  id: number;
  content: string;
  PostId: number;
  UserId: number;
  createdAt?: string;
  User?: User; // El backend incluye los datos del autor del comentario
}

// 5. Representa una publicación (GET /posts y GET /posts/:id)
export interface Post {
  id: number;
  description: string;
  UserId: number;
  createdAt?: string;
  User?: User; // Autor del post
  Tags?: Tag[]; // Arreglo de etiquetas asociadas al post
}