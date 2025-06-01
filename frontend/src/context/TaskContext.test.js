import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { TaskProvider, TaskContext } from './TaskContext';
import { AuthContext } from './AuthContext'; // TaskProvider depends on AuthContext
import axios from 'axios';

jest.mock('axios');

// Mock AuthContext
const mockAuthContextValue = {
  isAuthenticated: true, // Assume user is authenticated for most task operations
  user: { id: 'test-user-id', name: 'Test User' },
  // Add other properties if TaskContext uses them
};

const MockAuthContext = ({ children }) => (
  <AuthContext.Provider value={mockAuthContextValue}>
    {children}
  </AuthContext.Provider>
);

const TestTaskConsumer = () => {
  const { tasks, addTask, filteredTasks, setFilter, error, loading } = useContext(TaskContext);
  return (
    <div>
      <div data-testid="tasks-count">{tasks.length}</div>
      <div data-testid="filtered-tasks-count">{filteredTasks().length}</div>
      <div data-testid="error">{error}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <button onClick={() => addTask({ title: 'New Task' })}>Add Task</button>
      <button onClick={() => setFilter('status', 'pending')}>Filter Pending</button>
      <button onClick={() => setFilter('status', 'completed')}>Filter Completed</button>
      <button onClick={() => setFilter('status', 'all')}>Filter All</button>
    </div>
  );
};

describe('TaskContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset tasks in the context if TaskProvider doesn't fully reset on its own for each test
    // This might require more complex setup if tasks persist across renders in tests
  });

  it('should add a task successfully', async () => {
    const mockTaskData = { _id: '1', title: 'New Task', status: 'pending', user: 'test-user-id' };
    axios.post.mockResolvedValueOnce({ data: mockTaskData });
    axios.get.mockResolvedValue({ data: [] }); // For initial fetchTasks

    render(
      <MockAuthContext>
        <TaskProvider>
          <TestTaskConsumer />
        </TaskProvider>
      </MockAuthContext>
    );

    await act(async () => {
      // Wait for initial fetch if any (useEffect in TaskProvider)
    });

    expect(screen.getByTestId('tasks-count').textContent).toBe('0');

    await act(async () => {
      screen.getByText('Add Task').click();
    });

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/tasks'), { title: 'New Task' });
    expect(screen.getByTestId('tasks-count').textContent).toBe('1');
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('should handle addTask failure', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'Failed to add task' } } });
    axios.get.mockResolvedValue({ data: [] }); // For initial fetchTasks

    render(
      <MockAuthContext>
        <TaskProvider>
          <TestTaskConsumer />
        </TaskProvider>
      </MockAuthContext>
    );

    await act(async () => {
      // Wait for initial fetch if any
    });

    expect(screen.getByTestId('tasks-count').textContent).toBe('0');

    await act(async () => {
      screen.getByText('Add Task').click();
    });

    expect(screen.getByTestId('tasks-count').textContent).toBe('0');
    expect(screen.getByTestId('error').textContent).toBe('Failed to add task');
  });

  describe('filteredTasks logic', () => {
    const initialTasks = [
      { _id: '1', title: 'Task 1', status: 'pending', user: 'test-user-id' },
      { _id: '2', title: 'Task 2', status: 'in-progress', user: 'test-user-id' },
      { _id: '3', title: 'Task 3', status: 'completed', user: 'test-user-id' },
      { _id: '4', title: 'Task 4', status: 'pending', user: 'test-user-id' },
    ];

    beforeEach(() => {
      // Mock fetchTasks to return initialTasks
      axios.get.mockResolvedValue({ data: initialTasks });
    });

    // Helper to render with initial tasks already loaded
    const renderWithInitialTasks = async () => {
      render(
        <MockAuthContext>
          <TaskProvider>
            <TestTaskConsumer />
          </TaskProvider>
        </MockAuthContext>
      );
      // Wait for tasks to be loaded by useEffect in TaskProvider
      await act(async () => {
        // Add a small delay or check for an element that indicates loading is complete
        // For now, assume tasks are loaded after a short period
        await new Promise(resolve => setTimeout(resolve, 0));
      });
    };


    it('should return all tasks when filter is "all"', async () => {
      await renderWithInitialTasks();
      await act(async () => {
        screen.getByText('Filter All').click();
      });
      expect(screen.getByTestId('filtered-tasks-count').textContent).toBe(initialTasks.length.toString());
    });

    it('should filter by status "pending"', async () => {
      await renderWithInitialTasks();
      await act(async () => {
        screen.getByText('Filter Pending').click();
      });
      const pendingCount = initialTasks.filter(t => t.status === 'pending').length;
      expect(screen.getByTestId('filtered-tasks-count').textContent).toBe(pendingCount.toString());
    });

    it('should filter by status "completed"', async () => {
      await renderWithInitialTasks();
      await act(async () => {
        screen.getByText('Filter Completed').click();
      });
      const completedCount = initialTasks.filter(t => t.status === 'completed').length;
      expect(screen.getByTestId('filtered-tasks-count').textContent).toBe(completedCount.toString());
    });
  });
});
