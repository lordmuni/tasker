import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Needed for <Navigate> or <Link>
import { AuthContext } from '../context/AuthContext';
import Login from './Login';

describe('Login Page', () => {
  const mockLogin = jest.fn();
  const mockAuthContextValue = {
    login: mockLogin,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  const renderLogin = () => {
    return render(
      <Router> {/* Router is needed if Login component uses Navigate or Link */}
        <AuthContext.Provider value={mockAuthContextValue}>
          <Login />
        </AuthContext.Provider>
      </Router>
    );
  };

  beforeEach(() => {
    mockLogin.mockClear();
  });

  it('should render login form correctly', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
  });

  it('should allow typing in email and password fields', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Contraseña');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should call login function from AuthContext on form submit', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const loginButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should display error message if login context has error', () => {
    const errorMockAuthContextValue = {
      ...mockAuthContextValue,
      error: 'Invalid credentials',
    };
    render(
      <Router>
        <AuthContext.Provider value={errorMockAuthContextValue}>
          <Login />
        </AuthContext.Provider>
      </Router>
    );
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
