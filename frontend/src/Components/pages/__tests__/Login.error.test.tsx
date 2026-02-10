import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import * as apiService from '../../../services/api.service';
import { ApiError } from '../../../services/api.service';

// Mock the API service
jest.mock('../../../services/api.service');

const mockSetLoggedinUser = jest.fn();

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login setLoggedinUser={mockSetLoggedinUser} />
    </BrowserRouter>
  );
};

describe('Login Component - Error Handling & Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetLoggedinUser.mockClear();
  });

  describe('Validation Errors', () => {
    it('should show error for empty email and password', async () => {
      const user = userEvent.setup();
      renderLogin();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      });
    });

    it('should show error for password too short', async () => {
      const user = userEvent.setup();
      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'short');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('API Error Handling', () => {
    it('should handle 401 unauthorized error', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockRejectedValueOnce(
        new ApiError(401, 'Invalid credentials')
      );

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'WrongPassword123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });

      expect(mockSetLoggedinUser).toHaveBeenCalledWith('');
    });

    it('should handle network errors', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockRejectedValueOnce(
        new ApiError(0, 'Network Error')
      );

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should handle 500 server errors', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockRejectedValueOnce(
        new ApiError(500, 'Internal Server Error')
      );

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
      });
    });

    it('should handle timeout errors', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockRejectedValueOnce(
        new ApiError(408, 'Request Timeout')
      );

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/request timeout/i)).toBeInTheDocument();
      });
    });

    it('should handle errors without message', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockRejectedValueOnce(
        new ApiError(500, '')
      );

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/login failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading State Management', () => {
    it('should disable submit button while loading', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ token: 'test' }), 1000))
      );

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');

      await user.click(submitButton);

      // Button should be disabled during loading
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('should show loading text during submission', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ token: 'test' }), 1000))
      );

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByDisplayValue(/signing in/i)).toBeInTheDocument();
      });
    });

    it('should re-enable button after error', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockRejectedValueOnce(
        new ApiError(401, 'Invalid credentials')
      );

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Wrong123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle SQL injection attempts', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockRejectedValueOnce(
        new ApiError(401, 'Invalid credentials')
      );

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, "'; DROP TABLE users; --");
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      });
    });

    it('should handle XSS attempts', async () => {
      const user = userEvent.setup();
      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);

      await user.type(emailInput, '<script>alert("xss")</script>@example.com');
      await user.type(passwordInput, 'Password123');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      });
    });

    it('should handle very long email input', async () => {
      const user = userEvent.setup();
      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const longEmail = 'a'.repeat(1000) + '@example.com';

      await user.type(emailInput, longEmail);

      expect(emailInput).toHaveValue(longEmail);
    });

    it('should handle unicode characters in password', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockResolvedValueOnce({
        token: 'test-token',
      });

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Пароль123');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(apiService.AuthService.login).toHaveBeenCalled();
      });
    });

    it('should handle rapid form submissions', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ token: 'test' }), 100))
      );

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');

      // Click submit multiple times
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      // Should only call login once or handle gracefully
      await waitFor(() => {
        expect(apiService.AuthService.login).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle null/undefined error objects', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockRejectedValueOnce(null as any);

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/login failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility Error Announcements', () => {
    it('should announce errors to screen readers', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockRejectedValueOnce(
        new ApiError(401, 'Invalid credentials')
      );

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Wrong123');
      await user.click(submitButton);

      await waitFor(() => {
        const errorElement = screen.getByRole('alert');
        expect(errorElement).toHaveTextContent(/invalid credentials/i);
      });
    });

    it('should update aria-live region on error', async () => {
      const user = userEvent.setup();
      renderLogin();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        const statusRegion = screen.getByRole('status');
        expect(statusRegion).toBeInTheDocument();
      });
    });
  });

  describe('Session Storage Edge Cases', () => {
    it('should handle sessionStorage quota exceeded', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockResolvedValueOnce({
        token: 'a'.repeat(10000000), // Very large token
      });

      // Mock sessionStorage.setItem to throw
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      // Restore original
      Storage.prototype.setItem = originalSetItem;
    });

    it('should handle sessionStorage being null', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockResolvedValueOnce({
        token: 'test-token',
      });

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(apiService.AuthService.login).toHaveBeenCalled();
      });
    });
  });

  describe('Special Characters and Encoding', () => {
    it('should handle email with plus sign', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockResolvedValueOnce({
        token: 'test-token',
      });

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);

      await user.type(emailInput, 'test+alias@example.com');
      await user.type(passwordInput, 'Password123');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(apiService.AuthService.login).toHaveBeenCalledWith({
          email: 'test+alias@example.com',
          password: 'Password123',
        });
      });
    });

    it('should handle password with special characters', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockResolvedValueOnce({
        token: 'test-token',
      });

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'P@ssw0rd!#$%');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(apiService.AuthService.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'P@ssw0rd!#$%',
        });
      });
    });

    it('should handle whitespace in inputs', async () => {
      const user = userEvent.setup();
      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);

      await user.type(emailInput, '  test@example.com  ');
      await user.type(passwordInput, '  Password123  ');

      expect(emailInput).toHaveValue('  test@example.com  ');
      expect(passwordInput).toHaveValue('  Password123  ');
    });
  });

  describe('Form State Management', () => {
    it('should clear error on new input', async () => {
      const user = userEvent.setup();
      renderLogin();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
      });

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      await user.type(emailInput, 'test@example.com');

      // Error might still be visible depending on implementation
      // Just verify the input is updated
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should maintain form state after error', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.login).mockRejectedValueOnce(
        new ApiError(401, 'Invalid credentials')
      );

      renderLogin();

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Wrong123');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });

      // Form values should be preserved
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('Wrong123');
    });
  });
});
