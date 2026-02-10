import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Registration from '../Registration';
import * as apiService from '../../../services/api.service';
import { ApiError } from '../../../services/api.service';

jest.mock('../../../services/api.service');

const renderRegistration = () => {
  return render(
    <BrowserRouter>
      <Registration />
    </BrowserRouter>
  );
};

describe('Registration Component - Error Handling & Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validation Errors', () => {
    it('should show error for empty required fields', async () => {
      const user = userEvent.setup();
      renderRegistration();

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
      });
    });

    it('should show error for username too long', async () => {
      const user = userEvent.setup();
      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      const longUsername = 'a'.repeat(100);

      await user.type(usernameInput, longUsername);

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/username is too long/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email', async () => {
      const user = userEvent.setup();
      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmInput = screen.getByPlaceholderText(/enter your password again/i);

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmInput, 'Password123');

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      });
    });

    it('should show error for password too short', async () => {
      const user = userEvent.setup();
      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmInput = screen.getByPlaceholderText(/enter your password again/i);

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'short');
      await user.type(confirmInput, 'short');

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error for password mismatch', async () => {
      const user = userEvent.setup();
      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmInput = screen.getByPlaceholderText(/enter your password again/i);

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmInput, 'DifferentPass123');

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should show error if TOS not accepted', async () => {
      const user = userEvent.setup();
      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmInput = screen.getByPlaceholderText(/enter your password again/i);

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmInput, 'Password123');
      // Don't check TOS checkbox

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/must accept terms/i)).toBeInTheDocument();
      });
    });
  });

  describe('API Error Handling', () => {
    const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmInput = screen.getByPlaceholderText(/enter your password again/i);
      const tosCheckbox = screen.getByRole('checkbox');

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmInput, 'Password123');
      await user.click(tosCheckbox);
    };

    it('should handle 409 conflict when user exists', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.register).mockRejectedValueOnce(
        new ApiError(409, 'User already exists')
      );

      renderRegistration();
      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
      });
    });

    it('should handle 422 validation errors from server', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.register).mockRejectedValueOnce(
        new ApiError(422, 'Validation failed')
      );

      renderRegistration();
      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/validation failed/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.register).mockRejectedValueOnce(
        new ApiError(0, 'Network Error')
      );

      renderRegistration();
      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should handle server errors (500)', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.register).mockRejectedValueOnce(
        new ApiError(500, 'Internal Server Error')
      );

      renderRegistration();
      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
      });
    });

    it('should handle rate limiting (429)', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.register).mockRejectedValueOnce(
        new ApiError(429, 'Too many registration attempts')
      );

      renderRegistration();
      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/too many registration attempts/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Reset on Success', () => {
    it('should clear form after successful registration', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.register).mockResolvedValueOnce({
        message: 'Registration success: testuser',
      });

      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmInput = screen.getByPlaceholderText(/enter your password again/i);
      const tosCheckbox = screen.getByRole('checkbox');

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmInput, 'Password123');
      await user.click(tosCheckbox);

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/registration success/i)).toBeInTheDocument();
      });

      // Form should be cleared
      expect(usernameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
      expect(confirmInput).toHaveValue('');
      expect(tosCheckbox).not.toBeChecked();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid consecutive submissions', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.register).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ message: 'Success' }), 100))
      );

      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmInput = screen.getByPlaceholderText(/enter your password again/i);
      const tosCheckbox = screen.getByRole('checkbox');

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmInput, 'Password123');
      await user.click(tosCheckbox);

      const submitButton = screen.getByRole('button', { name: /submit registration/i });

      // Click multiple times
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      // Should only call once due to loading state
      await waitFor(() => {
        expect(apiService.AuthService.register).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle unicode characters in username', async () => {
      const user = userEvent.setup();
      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      await user.type(usernameInput, 'тестユーザー');

      expect(usernameInput).toHaveValue('тестユーザー');
    });

    it('should handle emoji in inputs', async () => {
      const user = userEvent.setup();
      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      await user.type(usernameInput, 'user😀test');

      expect(usernameInput).toHaveValue('user😀test');
    });

    it('should handle copy-paste of passwords', async () => {
      const user = userEvent.setup();
      renderRegistration();

      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      
      // Simulate paste
      await user.click(passwordInput);
      await user.paste('Password123');

      expect(passwordInput).toHaveValue('Password123');
    });
  });

  describe('Loading State', () => {
    it('should disable submit button while registering', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.register).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ message: 'Success' }), 1000))
      );

      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmInput = screen.getByPlaceholderText(/enter your password again/i);
      const tosCheckbox = screen.getByRole('checkbox');

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmInput, 'Password123');
      await user.click(tosCheckbox);

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('should show registering text during submission', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.register).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ message: 'Success' }), 1000))
      );

      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmInput = screen.getByPlaceholderText(/enter your password again/i);
      const tosCheckbox = screen.getByRole('checkbox');

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmInput, 'Password123');
      await user.click(tosCheckbox);

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByDisplayValue(/registering/i)).toBeInTheDocument();
      });
    });
  });

  describe('Security Edge Cases', () => {
    it('should handle SQL injection attempts in username', async () => {
      const user = userEvent.setup();
      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      await user.type(usernameInput, "'; DROP TABLE users; --");

      expect(usernameInput).toHaveValue("'; DROP TABLE users; --");
    });

    it('should handle XSS attempts in email', async () => {
      const user = userEvent.setup();
      renderRegistration();

      const emailInput = screen.getByPlaceholderText(/enter email/i);
      await user.type(emailInput, '<script>alert("xss")</script>@test.com');

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      });
    });

    it('should handle null byte injection', async () => {
      const user = userEvent.setup();
      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      await user.type(usernameInput, 'test\u0000user');

      expect(usernameInput).toHaveValue('test\u0000user');
    });
  });

  describe('Concurrent Operations', () => {
    it('should prevent double submission', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      vi.mocked(apiService.AuthService.register).mockReturnValue(promise as any);

      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmInput = screen.getByPlaceholderText(/enter your password again/i);
      const tosCheckbox = screen.getByRole('checkbox');

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmInput, 'Password123');
      await user.click(tosCheckbox);

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      
      // Try to click multiple times
      await user.click(submitButton);
      
      // Button should be disabled
      expect(submitButton).toBeDisabled();

      // Resolve the promise
      resolvePromise!({ message: 'Success' });

      await waitFor(() => {
        expect(apiService.AuthService.register).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Input Sanitization', () => {
    it('should handle leading/trailing whitespace in username', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.register).mockResolvedValueOnce({
        message: 'Success',
      });

      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmInput = screen.getByPlaceholderText(/enter your password again/i);
      const tosCheckbox = screen.getByRole('checkbox');

      await user.type(usernameInput, '  testuser  ');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmInput, 'Password123');
      await user.click(tosCheckbox);

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(apiService.AuthService.register).toHaveBeenCalled();
      });
    });

    it('should handle HTML entities in inputs', async () => {
      const user = userEvent.setup();
      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      await user.type(usernameInput, '&lt;test&gt;');

      expect(usernameInput).toHaveValue('&lt;test&gt;');
    });
  });

  describe('Accessibility Error Announcements', () => {
    it('should announce errors to screen readers', async () => {
      const user = userEvent.setup();
      renderRegistration();

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent(/all fields are required/i);
      });
    });

    it('should have proper aria-busy state during submission', async () => {
      const user = userEvent.setup();
      vi.mocked(apiService.AuthService.register).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ message: 'Success' }), 100))
      );

      renderRegistration();

      const usernameInput = screen.getByPlaceholderText(/enter your name/i);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmInput = screen.getByPlaceholderText(/enter your password again/i);
      const tosCheckbox = screen.getByRole('checkbox');

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmInput, 'Password123');
      await user.click(tosCheckbox);

      const submitButton = screen.getByRole('button', { name: /submit registration/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toHaveAttribute('aria-busy', 'true');
      });
    });
  });
});
