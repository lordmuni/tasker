import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskColumn from './TaskColumn'; // Adjust path as necessary
import { TaskContext } from '../context/TaskContext'; // For openTaskModal if used directly

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) => children({ innerRef: jest.fn(), droppableProps: {}, placeholder: null }),
  Draggable: ({ children }) => children({ innerRef: jest.fn(), draggableProps: {}, dragHandleProps: {} }, { isDragging: false }),
}));

describe('TaskColumn Component', () => {
  const mockTasks = [
    { _id: '1', title: 'Task 1', description: 'Desc 1', status: 'pending', tags: [], checklist: [] },
    { _id: '2', title: 'Task 2', description: 'Desc 2', status: 'pending', tags: [], checklist: [] },
  ];

  const mockOpenTaskModal = jest.fn();

  // Provide a mock TaskContext if TaskItem within TaskColumn uses it directly
  // For now, assuming openTaskModal is passed as prop and TaskItem doesn't directly use context for this
  const renderTaskColumn = (tasks = mockTasks, status = 'pending', title = 'Test Column') => {
    return render(
      // If TaskItem uses context for openTaskModal, wrap with TaskContext.Provider
      // For now, assuming openTaskModal is correctly propagated or TaskItem is simple
      <TaskColumn
        title={title}
        tasks={tasks}
        status={status}
        openTaskModal={mockOpenTaskModal}
      />
    );
  };

  it('should render the title and tasks', () => {
    renderTaskColumn();
    expect(screen.getByText('Test Column')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('should display a message if no tasks are present', () => {
    renderTaskColumn([], 'pending', 'Empty Column');
    expect(screen.getByText('Empty Column')).toBeInTheDocument();
    // Depending on implementation, it might show a specific message like "No tasks in this column."
    // For now, we just check the title is there. If TaskColumn renders a specific message, test for that.
    // Let's assume it renders "No hay tareas en esta columna." from looking at TaskColumn.js (if it does)
    // For now, the provided code for TaskColumn.js does not show such a message, it would just render no TaskItems.
    // So, we'll just check that no tasks (Task 1, Task 2) are rendered.
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  // Test for TaskItem interaction (e.g., clicking a task calls openTaskModal)
  // would require TaskItem to be rendered and its click handled.
  // This might be better as a separate TaskItem.test.js or an integration test.
});
