import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Logout from './Logout';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Logout Component', () => {
  const mockSetLoggedinUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('renders logout message', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Logout setLoggedinUser={mockSetLoggedinUser} />);
      expect(screen.getByText(/Logged out successfully/i)).toBeInTheDocument();
      resolve();
    });
  });

  it('displays redirecting message', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Logout setLoggedinUser={mockSetLoggedinUser} />);
      expect(screen.getByText(/Redirecting to home page/i)).toBeInTheDocument();
      resolve();
    });
  });

  it('clears user session on mount', async () => {
    sessionStorage.setItem('jwt', 'test-token');
    
    renderWithRouter(<Logout setLoggedinUser={mockSetLoggedinUser} />);
    
    await waitFor(() => {
      expect(mockSetLoggedinUser).toHaveBeenCalledWith('');
      expect(sessionStorage.getItem('jwt')).toBeNull();
    });
  });

  it('calls navigate after timeout', async () => {
    vi.useFakeTimers();
    
    renderWithRouter(<Logout setLoggedinUser={mockSetLoggedinUser} />);
    
    // Fast-forward timers
    await vi.advanceTimersByTimeAsync(2000);
    
    // Should have called navigate
    expect(mockNavigate).toHaveBeenCalled();
    
    vi.useRealTimers();
  });
});
