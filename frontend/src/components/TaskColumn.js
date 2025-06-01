import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskItem from './Task/TaskItem';

const TaskColumn = ({ title, tasks, status, openTaskModal }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
          {tasks.length}
        </span>
      </div>
      
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`dropzone min-h-[150px] ${snapshot.isDraggingOver ? 'dropzone-active' : ''}`}
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  index={index}
                  openTaskModal={openTaskModal}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <i className="fas fa-inbox text-2xl mb-2"></i>
                <p className="text-sm">No hay tareas</p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
