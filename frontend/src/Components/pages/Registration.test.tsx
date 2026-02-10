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

  it('renders registration form', () => {
    renderWithRouter(<Registration />);
    
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter your username')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter your email address')).toBeInTheDocument();
  });

  it('renders all form fields', async () => {
    await new Promise<void>((resolve) => {
      const { container } = renderWithRouter(<Registration />);
      
      expect(container.querySelector('#username-input')).toBeInTheDocument();
      expect(container.querySelector('#email-reg-input')).toBeInTheDocument();
      expect(container.querySelector('#password-reg-input')).toBeInTheDocument();
      expect(container.querySelector('#confirm-password-input')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders terms of service checkbox', () => {
    renderWithRouter(<Registration />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(screen.getByText(/I agree to the Terms of Use/i)).toBeInTheDocument();
  });

  it('updates form fields on user input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Registration />);
    
    const usernameInput = screen.getByLabelText('Enter your username');
    await user.type(usernameInput, 'testuser');
    
    expect(usernameInput).toHaveValue('testuser');
  });

  it('shows validation error for empty fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Registration />);
    
    const submitButton = screen.getByDisplayValue(/register/i);
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Please fill in all text fields/i);
    });
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Registration />);
    
    await user.type(screen.getByLabelText('Enter your username'), 'testuser');
    await user.type(screen.getByLabelText('Enter your email address'), 'invalid-email');
    await user.type(screen.getByLabelText(/Create a password/), 'password123');
    await user.type(screen.getByLabelText('Confirm your password'), 'password123');
    
    const submitButton = screen.getByDisplayValue(/register/i);
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Invalid e-mail address/i);
    });
  });

  it('shows error for password mismatch', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Registration />);
    
    await user.type(screen.getByLabelText('Enter your username'), 'testuser');
    await user.type(screen.getByLabelText('Enter your email address'), 'test@example.com');
    await user.type(screen.getByLabelText(/Create a password/), 'password123');
    await user.type(screen.getByLabelText('Confirm your password'), 'different');
    
    const submitButton = screen.getByDisplayValue(/register/i);
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Passwords do not match/i);
    });
  });

  it('handles successful registration', async () => {
    const user = userEvent.setup();
    
    vi.mocked(apiService.AuthService.register).mockResolvedValueOnce({
      message: 'Registration success: testuser',
    });
    
    renderWithRouter(<Registration />);
    
    await user.type(screen.getByLabelText('Enter your username'), 'testuser');
    await user.type(screen.getByLabelText('Enter your email address'), 'test@example.com');
    await user.type(screen.getByLabelText(/Create a password/), 'password123');
    await user.type(screen.getByLabelText('Confirm your password'), 'password123');
    await user.click(screen.getByRole('checkbox'));
    
    const submitButton = screen.getByDisplayValue(/register/i);
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
