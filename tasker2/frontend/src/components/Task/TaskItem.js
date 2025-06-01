import React, { useContext, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { TaskContext } from '../../context/TaskContext';
import axios from 'axios';

const TaskItem = ({ task, index, openTaskModal }) => {
  const { tags, updateTask } = useContext(TaskContext);
  
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Handle task completion toggle - implementación directa con axios
  const handleTaskCompletion = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isUpdating) return; // Prevenir múltiples clics
    
    setIsUpdating(true);
    console.log('Toggling task completion:', task._id, 'Current status:', task.completed);
    
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    // Crear una copia del objeto task con los campos necesarios
    const newCompleted = !task.completed;
    const updatedTask = {
      title: task.title,
      description: task.description,
      // Si se marca como completada, cambiar el status a 'completed'
      // Si se desmarca, mantener el status original o ponerlo en 'pending'
      status: newCompleted ? 'completed' : (task.status === 'completed' ? 'pending' : task.status),
      project: task.project,
      tags: task.tags,
      dueDate: task.dueDate,
      completed: newCompleted
    };
    
    // Usar la URL de la API configurada en el entorno o una URL por defecto
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    
    // Hacer la petición directamente con fetch (más básico y confiable)
    fetch(`${apiUrl}/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(updatedTask)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Task updated successfully:', data);
      // Actualizar la UI directamente
      window.location.reload();
    })
    .catch(error => {
      console.error('Error updating task:', error);
      alert('Error al actualizar la tarea. Por favor, intenta de nuevo.');
    })
    .finally(() => {
      setIsUpdating(false);
    });
  };
  
  // Calculate checklist progress
  const checklistTotal = task.checklist?.length || 0;
  const checklistCompleted = task.checklist?.filter(item => item.completed).length || 0;
  const checklistProgress = checklistTotal > 0 ? (checklistCompleted / checklistTotal) * 100 : 0;
  
  // Format date if exists
  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }) 
    : null;
  
  // Get task tags
  const taskTags = tags.filter(tag => task.tags.includes(tag._id)).slice(0, 3);
  const hasMoreTags = task.tags.length > 3;
  
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-item mb-2 bg-white rounded-md border border-gray-200 shadow-sm p-3 ${snapshot.isDragging ? 'task-dragging' : ''}`}
          onClick={() => openTaskModal(task)}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <input
                  type="checkbox"
                  checked={task.completed || task.status === 'completed'}
                  onChange={handleTaskCompletion}
                  onClick={(e) => e.stopPropagation()}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                {/* Div para mostrar visualmente si está marcado o no */}
                <div className="checkbox-visual absolute" style={{ display: (task.completed || task.status === 'completed') ? 'block' : 'none' }}>
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'} mb-1`}>
                  {task.title}
                </h4>
                
                {task.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                )}
              </div>
            </div>
            <div className="task-actions flex space-x-1">
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  openTaskModal(task);
                }}
              >
                <i className="fas fa-pen"></i>
              </button>
            </div>
          </div>
          
          {(checklistTotal > 0 || task.tags.length > 0 || task.dueDate) && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              {checklistTotal > 0 && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Checklist</span>
                    <span>{checklistCompleted}/{checklistTotal}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-1 w-full">
                    <div 
                      className="checklist-progress bg-blue-500 rounded-full" 
                      style={{ width: `${checklistProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap justify-between items-center">
                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {taskTags.map(tag => {
                      // Mapear color a la clase de tailwind correspondiente
                      let colorClass = '';
                      switch(tag.color) {
                        case 'red-500':
                          colorClass = 'bg-red-500';
                          break;
                        case 'blue-500':
                          colorClass = 'bg-blue-500';
                          break;
                        case 'green-500':
                          colorClass = 'bg-green-500';
                          break;
                        case 'yellow-500':
                          colorClass = 'bg-yellow-500';
                          break;
                        case 'purple-500':
                          colorClass = 'bg-purple-500';
                          break;
                        case 'pink-500':
                          colorClass = 'bg-pink-500';
                          break;
                        case 'indigo-500':
                          colorClass = 'bg-indigo-500';
                          break;
                        case 'gray-500':
                        default:
                          colorClass = 'bg-gray-500';
                          break;
                      }
                      
                      return (
                        <span 
                          key={tag._id} 
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${colorClass} text-white`}
                        >
                          {tag.name}
                        </span>
                      );
                    })}
                    {hasMoreTags && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-200 text-gray-800">
                        +{task.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {formattedDate && (
                  <div className="text-xs text-gray-500 flex items-center">
                    <i className="far fa-calendar-alt mr-1"></i>
                    {formattedDate}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
