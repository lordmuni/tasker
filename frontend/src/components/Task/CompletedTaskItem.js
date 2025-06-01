import React, { useContext, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';
import axios from 'axios';

const CompletedTaskItem = ({ task, openTaskModal }) => {
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
    
    // Usar updateTask del contexto (que usa axios)
    updateTask(task._id, updatedTask)
      .then(result => {
        if (result) {
          console.log('Task updated successfully:', result);
          // Actualizar la UI directamente
          window.location.reload();
        } else {
          throw new Error('Error al actualizar la tarea');
        }
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
    <div
      className="task-item mb-2 bg-white rounded-md border border-gray-200 shadow-sm p-3"
      onClick={() => openTaskModal(task)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="mr-3 mt-1">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleTaskCompletion}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div>
            <h3 className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                {task.description}
              </p>
            )}
            
            {/* Checklist progress */}
            {checklistTotal > 0 && (
              <div className="mt-2">
                <div className="flex items-center">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${checklistProgress}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-500">
                    {checklistCompleted}/{checklistTotal}
                  </span>
                </div>
              </div>
            )}
            
            {/* Task metadata */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {/* Project */}
              {task.project && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                  <i className="fas fa-folder text-blue-500 mr-1"></i>
                  {task.project.name || 'Proyecto'}
                </span>
              )}
              
              {/* Due date */}
              {formattedDate && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                  new Date(task.dueDate) < new Date() && !task.completed
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <i className={`fas fa-calendar-alt mr-1 ${
                    new Date(task.dueDate) < new Date() && !task.completed
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }`}></i>
                  {formattedDate}
                </span>
              )}
              
              {/* Tags */}
              {taskTags.map(tag => (
                <span 
                  key={tag._id} 
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-white"
                  style={{
                    backgroundColor: tag.color === 'red-500' ? '#ef4444' : 
                               tag.color === 'blue-500' ? '#3b82f6' : 
                               tag.color === 'green-500' ? '#22c55e' : 
                               tag.color === 'yellow-500' ? '#eab308' : 
                               tag.color === 'purple-500' ? '#a855f7' : 
                               tag.color === 'pink-500' ? '#ec4899' : 
                               tag.color === 'indigo-500' ? '#6366f1' : '#6b7280'
                  }}
                >
                  {tag.name}
                </span>
              ))}
              
              {/* More tags indicator */}
              {hasMoreTags && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                  +{task.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedTaskItem;
