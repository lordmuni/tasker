import React, { useState, useContext, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import Sidebar from '../components/Sidebar';
import TaskColumn from '../components/TaskColumn';
import TaskModal from '../components/TaskModal';
import TagModal from '../components/TagModal';
import CompletedTasksAccordion from '../components/CompletedTasksAccordion';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { projects, tasks, fetchTasks, updateTask, activeFilters, filteredTasks } = useContext(TaskContext);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentTag, setCurrentTag] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const task = tasks.find(t => t._id === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId;
    
    await updateTask(task._id, { ...task, status: newStatus });
  };

  const openTaskModal = (task = null) => {
    setCurrentTask(task);
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setCurrentTask(null);
    setShowTaskModal(false);
  };

  const openTagModal = (tag = null) => {
    setCurrentTag(tag);
    setShowTagModal(true);
  };

  const closeTagModal = () => {
    setCurrentTag(null);
    setShowTagModal(false);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Obtener tareas filtradas (por proyecto, etiquetas, etc.)
  const filteredTasksList = filteredTasks();
  
  // Group filtered tasks by status
  const pendingTasks = filteredTasksList.filter(task => task.status === 'pending');
  const inProgressTasks = filteredTasksList.filter(task => task.status === 'in-progress');
  const completedTasks = filteredTasksList.filter(task => task.status === 'completed');

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        user={user}
        logout={logout}
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        openTagModal={openTagModal}
        projects={projects}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="text-xl font-bold text-blue-600">Task Manager</h1>
          <button onClick={() => openTaskModal()} className="p-2 bg-blue-600 rounded-full text-white">
            <i className="fas fa-plus"></i>
          </button>
        </div>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeFilters.project ? 
                `Tareas: ${projects.find(p => p._id === activeFilters.project)?.name || 'Proyecto'}` : 
                'Mis Tareas'}
            </h1>
            <button
              onClick={() => openTaskModal()}
              className="hidden md:flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i className="fas fa-plus mr-2"></i>
              Nueva Tarea
            </button>
          </div>

          {/* Tareas activas (Pendientes y En Progreso) con DragDropContext */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <TaskColumn 
                title="Pendientes" 
                tasks={pendingTasks}
                status="pending"
                openTaskModal={openTaskModal}
              />
              <TaskColumn 
                title="En Progreso" 
                tasks={inProgressTasks}
                status="in-progress"
                openTaskModal={openTaskModal}
              />
            </div>
          </DragDropContext>
            
          {/* Área principal para dejar espacio para el componente fijado abajo */}
          <div className="pb-20">  {/* Padding bottom para evitar que el contenido quede detrás del componente fijo */}
          </div>
          
          {/* Tareas completadas en formato desplegable, fijado en la parte inferior */}
          <div className={`fixed bottom-0 left-0 right-0 z-10 px-4 pb-4 ${showSidebar ? 'md:ml-64' : ''} transition-all duration-300 bg-gray-50`}>
            <CompletedTasksAccordion 
              tasks={completedTasks} 
              openTaskModal={openTaskModal} 
            />
          </div>
        </main>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal 
          task={currentTask} 
          onClose={closeTaskModal}
        />
      )}

      {/* Tag Modal */}
      {showTagModal && (
        <TagModal 
          tag={currentTag} 
          onClose={closeTagModal}
        />
      )}

      {/* Floating Add Button (Mobile) */}
      <button 
        onClick={() => openTaskModal()} 
        className="fixed bottom-6 right-6 md:hidden bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 z-30"
      >
        <i className="fas fa-plus text-xl"></i>
      </button>
    </div>
  );
};

export default Dashboard;
