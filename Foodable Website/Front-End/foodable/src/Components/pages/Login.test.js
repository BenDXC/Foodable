import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import axios from 'axios';

vi.mock('axios', () => ({
  default: vi.fn(),
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Login Component', () => {
  const mockSetLoggedinUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('renders login form with all fields', () => {
    renderWithRouter(<Login setLoggedinUser={mockSetLoggedinUser} />);
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('displays sign up message and button', () => {
    renderWithRouter(<Login setLoggedinUser={mockSetLoggedinUser} />);
    
    expect(screen.getByText("Don't have an account? Sign Up!")).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('updates email input value on change', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login setLoggedinUser={mockSetLoggedinUser} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your Email');
    await user.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('updates password input value on change', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login setLoggedinUser={mockSetLoggedinUser} />);
    
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    await user.type(passwordInput, 'password123');
    
    expect(passwordInput).toHaveValue('password123');
  });

  describe('Form Validation', () => {
    it('shows error when email is empty', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login setLoggedinUser={mockSetLoggedinUser} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      expect(screen.getByText(/Please fill in all text fields/i)).toBeInTheDocument();
    });

    it('shows error when password is empty', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login setLoggedinUser={mockSetLoggedinUser} />);
      
      const emailInput = screen.getByPlaceholderText('Enter your Email');
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      expect(screen.getByText(/Please fill in all text fields/i)).toBeInTheDocument();
    });

    it('shows error for invalid email format', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login setLoggedinUser={mockSetLoggedinUser} />);
      
      const emailInput = screen.getByPlaceholderText('Enter your Email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      
      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      expect(screen.getByText(/Invalid e-mail address/i)).toBeInTheDocument();
    });

    it('shows error when password is too short', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login setLoggedinUser={mockSetLoggedinUser} />);
      
      const emailInput = screen.getByPlaceholderText('Enter your Email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'short');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      expect(screen.getByText(/Password is too short/i)).toBeInTheDocument();
    });
  });

  describe('Login Submission', () => {
    it('submits form with valid credentials and handles success', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        status: 200,
        headers: {
          authorization: 'Bearer mock-jwt-token',
        },
      };
      
      axios.mockResolvedValueOnce(mockResponse);
      
      renderWithRouter(<Login setLoggedinUser={mockSetLoggedinUser} />);
      
      const emailInput = screen.getByPlaceholderText('Enter your Email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(axios).toHaveBeenCalledWith({
          method: 'post',
          url: 'http://localhost:8080/signin',
          data: {
            email: 'test@example.com',
            password: 'password123',
          },
        });
      });
      
      expect(mockSetLoggedinUser).toHaveBeenCalledWith('test@example.com');
      expect(sessionStorage.getItem('jwt')).toBe('mock-jwt-token');
      expect(screen.getByText('Login success')).toBeInTheDocument();
    });

    it('handles login failure', async () => {
      const user = userEvent.setup();
      axios.mockRejectedValueOnce({
        response: { status: 401, data: { message: 'Invalid credentials' } },
      });
      
      renderWithRouter(<Login setLoggedinUser={mockSetLoggedinUser} />);
      
      const emailInput = screen.getByPlaceholderText('Enter your Email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Login failure')).toBeInTheDocument();
      });
      
      expect(mockSetLoggedinUser).toHaveBeenCalledWith('');
    });

    it('handles empty JWT token by still setting user', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        status: 200,
        headers: {
          authorization: 'Bearer ',
        },
      };
      
      axios.mockResolvedValueOnce(mockResponse);
      
      renderWithRouter(<Login setLoggedinUser={mockSetLoggedinUser} />);
      
      const emailInput = screen.getByPlaceholderText('Enter your Email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        // Empty string is still set as the jwt token
        expect(mockSetLoggedinUser).toHaveBeenCalledWith('test@example.com');
      });
    });
  });
});
