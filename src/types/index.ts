export interface User {
  id: number;
  nickName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface PostImage {
  id: number;
  url: string;
  PostId: number;
}

export interface Comment {
  id: number;
  content: string;
  PostId: number;
  UserId: number;
  createdAt?: string;
  User?: User;
}

export interface Post {
  id: number;
  description: string;
  UserId: number;
  createdAt?: string;
  User?: User;
  Tags?: Tag[];
}
