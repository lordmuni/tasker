import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

// Crear una instancia de axios con configuración personalizada
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    search: '',
    project: null,
    tags: [],
    status: 'all'
  });

  // Fetch tasks when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchProjects();
      fetchTags();
    } else {
      setTasks([]);
      setProjects([]);
      setTags([]);
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Error al cargar los proyectos', err);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get('/tags');
      setTags(response.data);
    } catch (err) {
      console.error('Error al cargar las etiquetas', err);
    }
  };

  const addTask = async (taskData) => {
    try {
      console.log('Intentando crear tarea con datos:', taskData);
      console.log('Token actual:', localStorage.getItem('token'));
      
      setLoading(true);
      const response = await api.post('/tasks', taskData);
      console.log('Respuesta del servidor:', response);
      
      setTasks([...tasks, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error al crear la tarea:', err);
      
      // Información más detallada sobre el error
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Datos del error:', err.response.data);
        console.error('Estado HTTP:', err.response.status);
        console.error('Cabeceras:', err.response.headers);
        setError(`Error al crear la tarea: ${err.response.data.message || 'Error en el servidor'}`);
      } else if (err.request) {
        // La petición fue hecha pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor');
        setError('No se pudo conectar con el servidor');
      } else {
        // Algo sucedió al configurar la petición
        console.error('Error de configuración:', err.message);
        setError(`Error de configuración: ${err.message}`);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      console.log('Intentando actualizar tarea con ID:', id);
      console.log('Datos de la tarea:', taskData);
      console.log('Token actual:', localStorage.getItem('token'));
      
      setLoading(true);
      const response = await api.put(`/tasks/${id}`, taskData);
      console.log('Respuesta del servidor:', response);
      
      setTasks(tasks.map(task => task._id === id ? response.data : task));
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error al actualizar la tarea:', err);
      
      // Información más detallada sobre el error
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Datos del error:', err.response.data);
        console.error('Estado HTTP:', err.response.status);
        console.error('Cabeceras:', err.response.headers);
        setError(`Error al actualizar la tarea: ${err.response.data.message || 'Error en el servidor'}`);
      } else if (err.request) {
        // La petición fue hecha pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor');
        setError('No se pudo conectar con el servidor');
      } else {
        // Algo sucedió al configurar la petición
        console.error('Error de configuración:', err.message);
        setError(`Error de configuración: ${err.message}`);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      setError(null);
      return true;
    } catch (err) {
      setError('Error al eliminar la tarea');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData) => {
    try {
      console.log('Intentando crear proyecto con datos:', projectData);
      console.log('Token actual:', localStorage.getItem('token'));
      
      const response = await api.post('/projects', projectData);
      console.log('Respuesta del servidor:', response);
      
      setProjects([...projects, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error al crear el proyecto:', err);
      
      // Información más detallada sobre el error
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Datos del error:', err.response.data);
        console.error('Estado HTTP:', err.response.status);
        console.error('Cabeceras:', err.response.headers);
        alert(`Error al crear el proyecto: ${err.response.data.message || 'Error en el servidor'}`);
      } else if (err.request) {
        // La petición fue hecha pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor');
        alert('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        // Algo sucedió al configurar la petición
        console.error('Error de configuración:', err.message);
        alert(`Error al configurar la petición: ${err.message}`);
      }
      
      return null;
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(project => project._id !== id));
      // Also filter out tasks associated with this project
      setTasks(tasks.filter(task => task.project !== id));
      return true;
    } catch (err) {
      console.error('Error al eliminar el proyecto', err);
      return false;
    }
  };

  const addTag = async (tagData) => {
    try {
      const response = await api.post('/tags', tagData);
      setTags([...tags, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error al crear la etiqueta', err);
      return null;
    }
  };

  const updateTag = async (id, tagData) => {
    try {
      const response = await api.put(`/tags/${id}`, tagData);
      setTags(tags.map(tag => tag._id === id ? response.data : tag));
      return response.data;
    } catch (err) {
      console.error('Error al actualizar la etiqueta', err);
      return null;
    }
  };

  const deleteTag = async (id) => {
    try {
      await api.delete(`/tags/${id}`);
      setTags(tags.filter(tag => tag._id !== id));
      // Also update tasks that have this tag
      setTasks(tasks.map(task => {
        if (task.tags.includes(id)) {
          return {
            ...task,
            tags: task.tags.filter(tagId => tagId !== id)
          };
        }
        return task;
      }));
      return true;
    } catch (err) {
      console.error('Error al eliminar la etiqueta', err);
      return false;
    }
  };

  const setFilter = (filterType, value) => {
    setActiveFilters({
      ...activeFilters,
      [filterType]: value
    });
  };

  const addTagFilter = (tagId) => {
    if (!activeFilters.tags.includes(tagId)) {
      setActiveFilters({
        ...activeFilters,
        tags: [...activeFilters.tags, tagId]
      });
    }
  };

  const removeTagFilter = (tagId) => {
    setActiveFilters({
      ...activeFilters,
      tags: activeFilters.tags.filter(id => id !== tagId)
    });
  };

  const filteredTasks = () => {
    return tasks.filter(task => {
      // Search filter
      if (activeFilters.search && !task.title.toLowerCase().includes(activeFilters.search.toLowerCase())) {
        return false;
      }
      
      // Project filter
      if (activeFilters.project && task.project !== activeFilters.project) {
        return false;
      }
      
      // Tags filter
      if (activeFilters.tags.length > 0 && !activeFilters.tags.some(tagId => task.tags.includes(tagId))) {
        return false;
      }
      
      // Status filter
      if (activeFilters.status === 'pending' && task.completed) {
        return false;
      }
      if (activeFilters.status === 'completed' && !task.completed) {
        return false;
      }
      
      return true;
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        tags,
        loading,
        error,
        activeFilters,
        setFilter,
        addTagFilter,
        removeTagFilter,
        filteredTasks,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        addProject,
        deleteProject,
        addTag,
        updateTag,
        deleteTag
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
