import React, { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';

const ProjectList = ({ onSelectProject, activeProjectId }) => {
  const { projects, deleteProject } = useContext(TaskContext);

  const handleProjectClick = (projectId) => {
    if (activeProjectId === projectId) {
      // If clicking on the active project, deselect it
      onSelectProject(null);
    } else {
      onSelectProject(projectId);
    }
  };

  const handleDeleteProject = (e, projectId) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto? También se eliminarán todas las tareas asociadas.')) {
      deleteProject(projectId);
      if (activeProjectId === projectId) {
        onSelectProject(null);
      }
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-2">
        No hay proyectos. Crea uno para organizar tus tareas.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {projects.map(project => (
        <div
          key={project._id}
          onClick={() => handleProjectClick(project._id)}
          className={`flex justify-between items-center px-2 py-1 rounded-md cursor-pointer ${
            activeProjectId === project._id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center">
            <i className="fas fa-folder mr-2 text-blue-500"></i>
            <span>{project.name}</span>
          </div>
          <button
            onClick={(e) => handleDeleteProject(e, project._id)}
            className="text-gray-400 hover:text-red-500"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
