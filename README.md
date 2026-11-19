# UnaHur Anti-Social Net 🌐

Trabajo Práctico N° 2 — **Construcción de Interfaces de Usuario (CIU)**  
**Universidad Nacional de Hurlingham (UNAHUR)**

---

## 📋 Descripción del Proyecto

**UnaHur Anti-Social Net** es una Single Page Application (SPA) moderna desarrollada con **React 19**, **TypeScript** y **Vite**, diseñada para interactuar con una API REST desarrollada en Node.js, Express y SQLite.

La aplicación permite a los usuarios:
- Explorar un **feed de publicaciones recientes** en una grilla totalmente responsiva adaptada a dispositivos móviles, tablets y escritorio.
- **Filtrar publicaciones dinámicamente** mediante etiquetas (tags) interactivas.
- Acceder al **detalle de cada publicación** (`/post/:id`), visualizando descripciones completas, carrusel/galería de imágenes asociadas y la lista de comentarios en tiempo real.
- **Agregar nuevos comentarios** en cualquier publicación a través de formularios controlados.
- **Crear nuevas publicaciones** (`/create-post`) asignando descripción, selección de múltiples etiquetas provistas por la API y carga dinámica de URLs de imágenes.
- **Autenticación simulada** (`/login` y `/register`) con validación de credenciales (contraseña requerida `123456`), gestión de sesión global mediante **React Context API** (`AuthContext`) y persistencia en **`localStorage`**.
- **Rutas protegidas** mediante un componente `ProtectedRoute` que restringe el acceso a las vistas de creación de posts y perfil de usuario únicamente a sesiones activas.
- **Perfil de usuario** (`/profile`), donde se listan las publicaciones del autor logueado con opción de eliminarlas.
- Interfaz cuidada con **Bootstrap 5**, utilidades flexbox/grid y estilos personalizados con temática oscura moderna (Dark Neon).

---

## 🔗 URL de la API Utilizada

- **Backend en ejecución local:** `http://localhost:3001`
- **Repositorio oficial de la API provista por la cátedra:**  
  👉 [https://github.com/lucasfigarola/backend-api](https://github.com/lucasfigarola/backend-api)

### Endpoints Principales Consumidos

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/users` | Lista completa de usuarios para validación de login |
| `POST` | `/users` | Registro de nuevos usuarios con validación de unicidad |
| `GET` | `/posts` | Listado general de publicaciones para el Feed |
| `GET` | `/posts/:id` | Detalle específico de una publicación |
| `GET` | `/posts?userId=:id` | Publicaciones creadas por un usuario en particular |
| `POST` | `/posts` | Creación de una nueva publicación (`description`, `userId`, `tags`) |
| `DELETE` | `/posts/:id` | Eliminación de una publicación propia |
| `GET` | `/tags` | Listado de etiquetas disponibles |
| `GET` | `/comments/post/:postId` | Comentarios asociados a una publicación |
| `POST` | `/comments` | Publicación de un nuevo comentario |
| `GET` | `/postimages/post/:postId` | Imágenes asociadas a una publicación |
| `POST` | `/postimages` | Vinculación de imágenes a una publicación creada |

---

## 🚀 Instrucciones para Correr en Local

### Requisitos Previos
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- Gestor de paquetes `npm` (incluido con Node.js)
- [Git](https://git-scm.com/)

---

### 1. Clonar el Repositorio

```bash
git clone https://github.com/logancasals-9/UnaHur-Anti-Social-Net.git
cd UnaHur-Anti-Social-Net
```

---

### 2. Iniciar el Backend (API)

En una terminal independiente, navegá a la carpeta de la API, instalá dependencias e inicializá el servidor:

```bash
cd backend-api

# Instalar dependencias
npm install

# (Opcional) Poblar base de datos inicial si es necesario
node seed.js

# Iniciar el servidor
npm start
```

> ℹ️ El servidor backend quedará escuchando en: **`http://localhost:3001`**  
> Asegurate de tener habilitado CORS hacia el puerto del cliente (`http://localhost:5173`).

---

### 3. Iniciar el Frontend (React)

En otra terminal independiente, navegá a la carpeta del frontend:

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo con Vite
npm run dev
```

> 🌐 Abrí tu navegador en: **`http://localhost:5173`**

---

## 🔑 Credenciales de Prueba

Para ingresar con los usuarios precargados en la base de datos de la cátedra:

- **Usuario:** `luna` &nbsp;|&nbsp; **Contraseña:** `123456`
- **Usuario:** `sol` &nbsp;|&nbsp; **Contraseña:** `123456`
- O podés registrar un usuario nuevo desde la pestaña **Registro** (`/register`).

---

## 🛠️ Tecnologías Utilizadas

- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Librería UI:** [React 19](https://react.dev/)
- **Empaquetador & Dev Server:** [Vite](https://vitejs.dev/)
- **Enrutamiento:** [React Router DOM v7](https://reactrouter.com/)
- **Estilos & Maquetación:** [Bootstrap 5](https://getbootstrap.com/) + CSS Modules personalizados
- **Persistencia & Estado:** Context API (`useContext`), hooks de estado (`useState`, `useEffect`) y `localStorage`
- **Consumo de API:** Nativo mediante `fetch` asíncrono con control de errores
