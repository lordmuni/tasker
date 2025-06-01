import React, { useState, useContext, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';

const TaskModal = ({ task, onClose }) => {
  const { projects, tags, addTask, updateTask, deleteTask } = useContext(TaskContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [checklist, setChecklist] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [showTagSelection, setShowTagSelection] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setProjectId(task.project || '');
      setSelectedTags(task.tags || []);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setStatus(task.status || 'pending');
      setChecklist(task.checklist || []);
      setImagePreview(task.image || null);
    } else {
      resetForm();
    }
  }, [task]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setProjectId('');
    setSelectedTags([]);
    setDueDate('');
    setStatus('pending');
    setChecklist([]);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aseguramos que enviamos todos los datos en un formato que el backend pueda procesar
      const taskData = {
        title,
        description,
        project: projectId || undefined,
        tags: selectedTags,
        dueDate: dueDate || undefined,
        status,
        // Aseguramos que checklist sea siempre un array
        checklist: Array.isArray(checklist) ? checklist : [],
        // Solo incluimos la imagen si existe
        ...(imagePreview ? { image: imagePreview } : {})
      };

      console.log('Saving task with data:', taskData);

      let result;
      if (task) {
        // Utilizar la función updateTask del contexto (que usa axios)
        result = await updateTask(task._id, taskData);
      } else {
        // Utilizar la función addTask del contexto (que usa axios)
        result = await addTask(taskData);
      }

      if (!result) {
        throw new Error('Error al procesar la tarea');
      }

      console.log('Task saved successfully:', result);
      
      // Recargar la página para mostrar los cambios
      window.location.reload();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error al guardar la tarea: ' + error.message);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {
        setLoading(true);
        
        // Utilizar la función deleteTask del contexto (que usa axios)
        const success = await deleteTask(task._id);
        
        if (!success) {
          throw new Error('Error al eliminar la tarea');
        }
        
        console.log('Task deleted successfully');
        
        // Recargar la página para mostrar los cambios
        window.location.reload();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error al eliminar la tarea: ' + error.message);
      } finally {
        setLoading(false);
        onClose();
      }
    }
  };

  const toggleChecklistItem = (index) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;
    setChecklist(updatedChecklist);
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim() !== '') {
      setChecklist([
        ...checklist,
        { text: newChecklistItem, completed: false }
      ]);
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (index) => {
    const updatedChecklist = [...checklist];
    updatedChecklist.splice(index, 1);
    setChecklist(updatedChecklist);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const toggleTag = (tagId) => {
    console.log('Toggling tag:', tagId);
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
    console.log('Selected tags after toggle:', selectedTags);
  };
  
  // Función para obtener el estilo de color para una etiqueta (ahora devuelve un objeto de estilo)
  const getTagColorStyle = (color) => {
    // Usar un switch para mapear correctamente los colores a valores hexadecimales
    const safeColor = color || 'blue-500';
    
    let backgroundColor;
    switch(safeColor) {
      case 'red-500':
        backgroundColor = '#ef4444';
        break;
      case 'blue-500':
        backgroundColor = '#3b82f6';
        break;
      case 'green-500':
        backgroundColor = '#22c55e';
        break;
      case 'yellow-500':
        backgroundColor = '#eab308';
        break;
      case 'purple-500':
        backgroundColor = '#a855f7';
        break;
      case 'pink-500':
        backgroundColor = '#ec4899';
        break;
      case 'indigo-500':
        backgroundColor = '#6366f1';
        break;
      case 'gray-500':
      default:
        backgroundColor = '#6b7280';
        break;
    }
    
    return { backgroundColor, color: 'white' };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {task ? 'Editar Tarea' : 'Nueva Tarea'}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  type="text"
                  id="taskTitle"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              
              <div>
                <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  id="taskDescription"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="taskProject" className="block text-sm font-medium text-gray-700">
                  Proyecto
                </label>
                <select
                  id="taskProject"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                >
                  <option value="">Sin proyecto</option>
                  {projects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Etiquetas
                </label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedTags.length > 0 ? (
                    <>
                      {selectedTags.map(tagId => {
                        const tag = tags.find(t => t._id === tagId);
                        return tag ? (
                          <span
                            key={tag._id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                            style={{
                              backgroundColor: tag.color === 'red-500' ? '#ef4444' : 
                                           tag.color === 'blue-500' ? '#3b82f6' : 
                                           tag.color === 'green-500' ? '#22c55e' : 
                                           tag.color === 'yellow-500' ? '#eab308' : 
                                           tag.color === 'purple-500' ? '#a855f7' : 
                                           tag.color === 'pink-500' ? '#ec4899' : 
                                           tag.color === 'indigo-500' ? '#6366f1' : '#6b7280',
                              color: 'white'
                            }}
                          >
                            {tag.name}
                            <button
                              type="button"
                              onClick={() => toggleTag(tag._id)}
                              className="ml-2 text-white hover:text-gray-200"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </span>
                        ) : null;
                      })}
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm">Sin etiquetas</span>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => setShowTagSelection(!showTagSelection)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <i className="fas fa-tag mr-1"></i>
                    {showTagSelection ? 'Ocultar' : 'Añadir'}
                  </button>
                </div>
                
                {showTagSelection && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md">
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <button
                          key={tag._id}
                          type="button"
                          onClick={() => toggleTag(tag._id)}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                          style={(() => {
                            // Obtener el color de fondo basado en tag.color
                            let bgColor;
                            if (tag.color === 'red-500') bgColor = '#ef4444';
                            else if (tag.color === 'blue-500') bgColor = '#3b82f6';
                            else if (tag.color === 'green-500') bgColor = '#22c55e';
                            else if (tag.color === 'yellow-500') bgColor = '#eab308';
                            else if (tag.color === 'purple-500') bgColor = '#a855f7';
                            else if (tag.color === 'pink-500') bgColor = '#ec4899';
                            else if (tag.color === 'indigo-500') bgColor = '#6366f1';
                            else if (tag.color === 'gray-500') bgColor = '#6b7280';
                            else bgColor = '#3b82f6'; // Valor predeterminado
                            
                            // Si está seleccionado, usar el color completo y texto blanco
                            if (selectedTags.includes(tag._id)) {
                              return {
                                backgroundColor: bgColor,
                                color: 'white'
                              };
                            } 
                            // Si no está seleccionado, usar una versión más clara del color con borde
                            else {
                              // Para colores oscuros, usar un enfoque de transparencia
                              return {
                                backgroundColor: bgColor + '33', // Añadir 33 de transparencia (20%)
                                color: '#374151',
                                border: `1px solid ${bgColor}`
                              };
                            }
                          })()
                          }
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-700">
                  Fecha límite
                </label>
                <input
                  type="date"
                  id="taskDueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              
              <div>
                <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  id="taskStatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in-progress">En progreso</option>
                  <option value="completed">Completada</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Checklist
                </label>
                
                <div className="space-y-2">
                  {checklist.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(index)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className={`flex-1 ${item.completed ? 'line-through text-gray-400' : ''}`}>
                        {item.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeChecklistItem(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 flex">
                  <input
                    type="text"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    placeholder="Añadir nuevo elemento"
                    className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                  />
                  <button
                    type="button"
                    onClick={addChecklistItem}
                    className="bg-blue-600 text-white px-3 rounded-r-md hover:bg-blue-700"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen
                </label>
                
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="image-preview rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-3"></i>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG o GIF (Máx. 10MB)</p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between space-x-2 pt-4">
                {task && (
                  <button
                    type="button"
                    onClick={handleDeleteTask}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
