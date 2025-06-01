# Tasker - Aplicación de Gestión de Tareas

Una aplicación completa de gestión de tareas con arquitectura moderna y contenedores Docker.

## Arquitectura

La aplicación se compone de tres partes principales:

- **Frontend**: Una interfaz de usuario desarrollada con React.js y estilizada con Tailwind CSS. Es dinámica y responsive, facilitando la interacción del usuario.
- **Backend**: Un servidor API construido con Node.js y Express que gestiona todas las operaciones CRUD (crear, leer, actualizar, eliminar) y se comunica con la base de datos.
- **Base de Datos**: MongoDB se utiliza para almacenar y recuperar datos de las tareas, lo cual permite una gestión eficiente y escalable de los datos.

El sistema utiliza Docker y Docker Compose para la orquestación, facilitando el despliegue y la configuración de los diferentes servicios.

## Funcionalidades

- Autenticación de usuarios (registro, inicio de sesión, cierre de sesión)
- Gestión de proyectos
- Organización de tareas con etiquetas personalizables
- Tareas con checklists, fechas límite e imágenes
- Interfaz drag & drop para mover tareas entre estados
- Filtrado y búsqueda de tareas

## Requisitos

- Docker y Docker Compose
- Node.js (para desarrollo)

## Ejecución

Para iniciar la aplicación:

```bash
docker-compose up
```

El frontend estará disponible en http://localhost:3000 y el backend en http://localhost:5000.

## Desarrollo

Para desarrollo local sin Docker:

1. Iniciar el backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. Iniciar el frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```
