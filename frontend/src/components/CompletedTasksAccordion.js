import React, { useState } from 'react';
import CompletedTaskItem from './Task/CompletedTaskItem';

const CompletedTasksAccordion = ({ tasks, openTaskModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Cabecera desplegable tipo píldora */}
      <button
        onClick={toggleAccordion}
        className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <div className="flex items-center">
          <div 
            className={`w-3 h-3 rounded-full mr-3 ${tasks.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}
          ></div>
          <h3 className="text-lg font-medium text-gray-900">
            Tareas Completadas ({tasks.length})
          </h3>
        </div>
        <div className="text-gray-500">
          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
        </div>
      </button>

      {/* Contenido desplegable */}
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          {tasks.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <i className="fas fa-check-circle text-4xl mb-2"></i>
              <p>No hay tareas completadas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map(task => (
                <CompletedTaskItem
                  key={task._id}
                  task={task}
                  openTaskModal={openTaskModal}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompletedTasksAccordion;
