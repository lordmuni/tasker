import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, AuthContext } from './AuthContext';
import axios from 'axios'; // To mock API calls

// Mock axios
jest.mock('axios');

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const TestConsumer = () => {
  const { isAuthenticated, user, login, logout, loading, error } = useContext(AuthContext);
  return (
    <div>
      <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
      <div data-testid="user">{JSON.stringify(user)}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('initial state should be unauthenticated', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    expect(JSON.parse(screen.getByTestId('user').textContent)).toBeNull();
  });

  it('should login successfully and update context', async () => {
    const mockUserData = { id: '1', name: 'Test User', email: 'test@example.com' };
    const mockToken = 'fake-token';
    axios.post.mockResolvedValueOnce({ data: { token: mockToken, user: mockUserData } });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), {
      email: 'test@example.com',
      password: 'password',
    });
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUserData));
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    expect(JSON.parse(screen.getByTestId('user').textContent)).toEqual(mockUserData);
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('should handle login failure', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'Login failed' } } });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    expect(JSON.parse(screen.getByTestId('user').textContent)).toBeNull();
    expect(screen.getByTestId('error').textContent).toBe('Login failed');
  });

  it('should logout successfully and update context', async () => {
    // Setup initial logged-in state
    localStorageMock.setItem('token', 'fake-token');
    localStorageMock.setItem('user', JSON.stringify({ id: '1', name: 'Test User' }));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // Verify initial logged-in state from mock localStorage
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    expect(JSON.parse(screen.getByTestId('user').textContent)).toBeNull();
  });

  it('should load user from localStorage if token exists', () => {
    localStorageMock.setItem('token', 'test-token');
    const mockUser = { name: 'Stored User', email: 'stored@example.com' };
    localStorageMock.setItem('user', JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    expect(JSON.parse(screen.getByTestId('user').textContent)).toEqual(mockUser);
  });
});
