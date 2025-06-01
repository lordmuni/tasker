import React, { useContext, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';

const TagList = () => {
  const { tags, addTagFilter, removeTagFilter, activeFilters } = useContext(TaskContext);
  const [hoveredTagId, setHoveredTagId] = useState(null);
  
  // Función para abrir el modal de edición de etiqueta
  const handleEditTag = (e, tagId) => {
    e.stopPropagation();
    // Buscar la etiqueta por su ID
    const tagToEdit = tags.find(tag => tag._id === tagId);
    if (tagToEdit) {
      // Abrir el modal de edición de etiqueta
      window.openTagModal(tagToEdit);
    }
  };

  const handleTagClick = (tagId) => {
    if (activeFilters.tags.includes(tagId)) {
      removeTagFilter(tagId);
    } else {
      addTagFilter(tagId);
    }
  };

  if (tags.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-2">
        No hay etiquetas. Crea una para categorizar tus tareas.
      </div>
    );
  }

  // Imprimir todas las etiquetas para depuración
  console.log('Tags in TagList:', tags);
  console.log('Active filters:', activeFilters);

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => {
        const isActive = activeFilters.tags.includes(tag._id);
        
        // Determinar el color de fondo basándonos en tag.color
        let bgColor = '#f3f4f6'; // Color predeterminado gris claro
        let textColor = '#1f2937'; // Color de texto predeterminado
        
        // Asignar colores basados en el nombre del color, siempre, no solo cuando está activo
        if (tag.color === 'red-500') bgColor = '#ef4444';
        else if (tag.color === 'blue-500') bgColor = '#3b82f6';
        else if (tag.color === 'green-500') bgColor = '#22c55e';
        else if (tag.color === 'yellow-500') bgColor = '#eab308';
        else if (tag.color === 'purple-500') bgColor = '#a855f7';
        else if (tag.color === 'pink-500') bgColor = '#ec4899';
        else if (tag.color === 'indigo-500') bgColor = '#6366f1';
        else if (tag.color === 'gray-500') bgColor = '#6b7280';
        else if (tag.color) bgColor = '#3b82f6'; // Si hay color pero no coincide con ninguno, usar azul
        
        // Ajustar el color del texto según el fondo para mejorar la legibilidad
        textColor = isActive ? 'white' : '#1f2937';
        
        // Para fondos oscuros, el texto debe ser siempre blanco
        if (['red-500', 'blue-500', 'green-500', 'purple-500', 'pink-500', 'indigo-500', 'gray-500'].includes(tag.color)) {
          textColor = 'white';
        }
        
        // Mostrar la información de depuración para cada etiqueta
        console.log(`Tag ${tag.name}, color: ${tag.color}, active: ${isActive}, bgColor: ${bgColor}`);
        
        return (
          <span 
            key={tag._id} 
            onClick={() => handleTagClick(tag._id)}
            onMouseEnter={() => setHoveredTagId(tag._id)}
            onMouseLeave={() => setHoveredTagId(null)}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs cursor-pointer relative"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              border: '1px solid transparent'
            }}
          >
            {tag.name}
            {isActive && (
              <i className="fas fa-check ml-1"></i>
            )}
            
            {/* Mostrar botón de edición al pasar el ratón por encima */}
            {hoveredTagId === tag._id && (
              <button 
                onClick={(e) => handleEditTag(e, tag._id)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200 text-xs text-gray-600 hover:text-blue-600"
              >
                <i className="fas fa-pen"></i>
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default TagList;
