import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Registration from './Registration';
import * as apiService from '../../services/api.service';

vi.mock('../../services/api.service', () => ({
  AuthService: {
    register: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    constructor(public statusCode: number, message: string) {
      super(message);
    }
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Registration Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Registration />);
      
      expect(screen.getByText('Sign up')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders all form fields', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Registration />);
      
      expect(screen.getByLabelText('Username:')).toBeInTheDocument();
      expect(screen.getByLabelText('Email:')).toBeInTheDocument();
      expect(screen.getByLabelText('Password:')).toBeInTheDocument();
      expect(screen.getByLabelText('Re-type password:')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders terms of service checkbox', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Registration />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText(/I agree to the Terms of Use/i)).toBeInTheDocument();
      resolve();
    });
  });

  it('updates form fields on user input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Registration />);
    
    const usernameInput = screen.getByPlaceholderText('Enter your name');
    await user.type(usernameInput, 'testuser');
    
    expect(usernameInput).toHaveValue('testuser');
  });

  it('shows validation error for empty fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Registration />);
    
    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Please fill in all text fields/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Registration />);
    
    await user.type(screen.getByPlaceholderText('Enter your name'), 'testuser');
    await user.type(screen.getByPlaceholderText('Enter Email'), 'invalid-email');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Enter your Password again'), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid e-mail address/i)).toBeInTheDocument();
    });
  });

  it('shows error for password mismatch', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Registration />);
    
    await user.type(screen.getByPlaceholderText('Enter your name'), 'testuser');
    await user.type(screen.getByPlaceholderText('Enter Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Enter your Password again'), 'different');
    
    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
    const user = userEvent.setup();
    
    vi.mocked(apiService.AuthService.register).mockResolvedValueOnce({
      message: 'Registration success: testuser',
    });
    
    renderWithRouter(<Registration />);
    
    await user.type(screen.getByPlaceholderText('Enter your name'), 'testuser');
    await user.type(screen.getByPlaceholderText('Enter Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Enter your Password again'), 'password123');
    await user.click(screen.getByRole('checkbox'));
    
    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(apiService.AuthService.register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('has sign in link', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Registration />);
      
      expect(screen.getByText('Or if you have an account')).toBeInTheDocument();
      expect(screen.getByText('Sign in')).toBeInTheDocument();
      resolve();
    });
  });
});
