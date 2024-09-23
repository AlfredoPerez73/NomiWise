import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import * as authContext from '../context/authContext';
import LoginPage from '../pages/login';

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock del contexto de autenticación
jest.mock('../context/authContext', () => ({
  useAuth: jest.fn(),
}));

describe('Pruebas de <LoginPage />', () => {
  let mockSigninu;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSigninu = jest.fn().mockResolvedValue({});
    authContext.useAuth.mockReturnValue({
      signinu: mockSigninu,
    });
  });

  const renderLoginPage = () => {
    return render(
      <Router>
        <LoginPage />
      </Router>
    );
  };

  test('Prueba de Integacion <<CAO>>', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  test('Prueba de Integacion <<CA1>>', () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText(/correo/i);
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    expect(emailInput.value).toBe('test@test.com');

    const passwordInput = screen.getByLabelText(/contraseña/i);
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    expect(passwordInput.value).toBe('123456');
  });

  test('Prueba de Integacion <<CA3>>', async () => {
    renderLoginPage();
    
    // Cambiar los campos del formulario
    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123456' } });

    // Simular el envío del formulario
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /inicia sesión/i }));
    });

    // Esperar y asegurarse que la función signinu se haya llamado con los valores correctos
    await waitFor(() => {
      expect(mockSigninu).toHaveBeenCalledWith({ correo: 'test@test.com', contraseña: '123456' });
    });
  });
});