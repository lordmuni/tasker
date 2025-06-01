import React, { useState, useContext, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';
import axios from 'axios';

// Crear una instancia de axios con configuración personalizada
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api'
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

const TagModal = ({ tag, onClose }) => {
  const { addTag, updateTag, deleteTag } = useContext(TaskContext);
  const [name, setName] = useState('');
  const [color, setColor] = useState('blue-500');
  const [loading, setLoading] = useState(false);

  const colorOptions = [
    'red-500', 'blue-500', 'green-500', 'yellow-500',
    'purple-500', 'pink-500', 'indigo-500', 'gray-500'
  ];

  useEffect(() => {
    if (tag) {
      setName(tag.name || '');
      setColor(tag.color || 'blue-500');
    } else {
      resetForm();
    }
  }, [tag]);

  const resetForm = () => {
    setName('');
    setColor('blue-500');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagData = {
        name,
        color
      };

      console.log('Saving tag with data:', tagData);

      let response;

      if (tag) {
        // Actualización usando axios
        response = await api.put(`/tags/${tag._id}`, tagData);
      } else {
        // Creación usando axios
        response = await api.post('/tags', tagData);
      }

      console.log('Tag saved successfully:', response.data);

      // Recargar la página para mostrar los cambios
      window.location.reload();
    } catch (error) {
      console.error('Error saving tag:', error);
      alert('Error al guardar la etiqueta: ' + error.message);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleDeleteTag = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta etiqueta? Se eliminará de todas las tareas asociadas.')) {
      try {
        setLoading(true);
        
        // Eliminar etiqueta usando axios
        await api.delete(`/tags/${tag._id}`);
        
        console.log('Tag deleted successfully');
        
        // Recargar la página para mostrar los cambios
        window.location.reload();
      } catch (error) {
        console.error('Error deleting tag:', error);
        alert('Error al eliminar la etiqueta: ' + error.message);
      } finally {
        setLoading(false);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {tag ? 'Editar Etiqueta' : 'Nueva Etiqueta'}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="tagName" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                id="tagName"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="tag-color-picker">
                {colorOptions.map(colorOption => (
                  <div
                    key={colorOption}
                    className={`tag-color-option bg-${colorOption} ${color === colorOption ? 'selected' : ''}`}
                    onClick={() => setColor(colorOption)}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              {tag && (
                <button
                  type="button"
                  onClick={handleDeleteTag}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                >
                  Eliminar
                </button>
              )}
              <div className="flex space-x-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TagModal;
