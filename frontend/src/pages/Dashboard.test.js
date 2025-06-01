import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import Dashboard from './Dashboard';

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }) => <div>{children}</div>,
  Droppable: ({ children }) => children({ innerRef: jest.fn(), droppableProps: {}, placeholder: null }),
  Draggable: ({ children }) => children({ innerRef: jest.fn(), draggableProps: {}, dragHandleProps: {} }, { isDragging: false }),
}));


describe('Dashboard Page', () => {
  const mockAuthContextValue = {
    user: { name: 'Test User' },
    logout: jest.fn(),
    isAuthenticated: true,
  };

  const mockTaskContextValue = {
    projects: [],
    tasks: [],
    fetchTasks: jest.fn(),
    updateTask: jest.fn(),
    activeFilters: { project: null, tags: [], status: 'all' },
    filteredTasks: jest.fn(() => []), // Returns a function that returns an array
    setFilter: jest.fn(),
    addProject: jest.fn(),
    // Make sure all destructured values in Dashboard are provided
    tags: [],
    loading: false,
    error: null,
    addTagFilter: jest.fn(),
    removeTagFilter: jest.fn(),
    deleteTask: jest.fn(),
    deleteProject: jest.fn(),
    addTag: jest.fn(),
    updateTag: jest.fn(),
    deleteTag: jest.fn(),
    addTask: jest.fn(), // Added this
  };

  const renderDashboard = () => {
    return render(
      <Router>
        <AuthContext.Provider value={mockAuthContextValue}>
          <TaskContext.Provider value={mockTaskContextValue}>
            <Dashboard />
          </TaskContext.Provider>
        </AuthContext.Provider>
      </Router>
    );
  };

  beforeEach(() => {
    // Reset mock for filteredTasks to ensure it's a fresh function for each test if needed
    mockTaskContextValue.filteredTasks = jest.fn(() => []);
    mockTaskContextValue.fetchTasks.mockClear();
  });

  it('should render Dashboard without crashing', () => {
    renderDashboard();
    // Check for some key elements
    expect(screen.getByText(/Task Manager/i)).toBeInTheDocument(); // Sidebar title or mobile header
    expect(screen.getByText(/Mis Tareas/i)).toBeInTheDocument(); // Main area title
    expect(screen.getByText(/Pendientes/i)).toBeInTheDocument(); // TaskColumn title
    expect(screen.getByText(/En Progreso/i)).toBeInTheDocument(); // TaskColumn title
  });

  it('should call fetchTasks on mount', () => {
    renderDashboard();
    expect(mockTaskContextValue.fetchTasks).toHaveBeenCalledTimes(1);
  });

  // Add more tests here for interactions if time permits
  // e.g., clicking "Nueva Tarea" opens modal
});
