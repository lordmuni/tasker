import React, { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import ProjectList from './Project/ProjectList';
import TagList from './Tag/TagList';

const Sidebar = ({ user, logout, showSidebar, toggleSidebar, openTagModal }) => {
  const { setFilter, activeFilters, addProject } = useContext(TaskContext);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    // Call addProject from context
    if (newProjectName.trim()) {
      addProject({ name: newProjectName.trim() });
      setNewProjectName('');
      setShowNewProjectForm(false);
    }
  };

  return (
    <div className={`sidebar bg-white w-64 border-r border-gray-200 flex flex-col fixed h-full md:relative z-40 md:translate-x-0 ${!showSidebar ? 'sidebar-mobile-hidden' : ''}`}>
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Task Manager</h1>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {user?.name?.[0] || 'U'}
          </div>
          <span className="font-medium">{user?.name || 'Usuario'}</span>
        </div>
        <button onClick={logout} className="mt-2 text-sm text-blue-600 hover:text-blue-800">
          Cerrar Sesión
        </button>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Filtros</h2>
        </div>
        <div className="space-y-2">
          <button 
            onClick={() => setFilter('status', 'all')}
            className={`block w-full text-left px-2 py-1 rounded-md ${activeFilters.status === 'all' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
          >
            Todas las tareas
          </button>
          <button 
            onClick={() => setFilter('status', 'pending')}
            className={`block w-full text-left px-2 py-1 rounded-md ${activeFilters.status === 'pending' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
          >
            Pendientes
          </button>
          <button 
            onClick={() => setFilter('status', 'completed')}
            className={`block w-full text-left px-2 py-1 rounded-md ${activeFilters.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
          >
            Completadas
          </button>
        </div>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Proyectos</h2>
          <button 
            onClick={() => setShowNewProjectForm(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
        
        {showNewProjectForm && (
          <form onSubmit={handleProjectSubmit} className="mb-2">
            <div className="flex">
              <input 
                type="text" 
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Nombre del proyecto" 
                className="flex-1 border-gray-300 rounded-l-md text-sm focus:ring-blue-500 focus:border-blue-500" 
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-2 rounded-r-md hover:bg-blue-700"
              >
                <i className="fas fa-check"></i>
              </button>
            </div>
          </form>
        )}
        
        <ProjectList 
          onSelectProject={(id) => setFilter('project', id)}
          activeProjectId={activeFilters.project}
        />
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Etiquetas</h2>
          <button 
            onClick={() => openTagModal()}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
        
        <TagList />
      </div>
      
      <div className="mt-auto p-4 text-center text-xs text-gray-500">
        <p>Task Manager v1.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
