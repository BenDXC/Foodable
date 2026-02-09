import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';

// Mock axios
vi.mock('axios', () => ({
  default: vi.fn(),
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    // Default mock to return rejected promise
    axios.mockRejectedValue({ response: { status: 500 } });
  });

  describe('when user is not logged in', () => {
    it('renders navbar with default navigation items', () => {
      renderWithRouter(<Navbar loggedInUser="" />);
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Donator')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('displays Login and Signup links in mobile menu', () => {
      renderWithRouter(<Navbar loggedInUser="" />);
      
      const loginLinks = screen.getAllByText('Login');
      const signupLinks = screen.getAllByText('Signup');
      
      expect(loginLinks.length).toBeGreaterThan(0);
      expect(signupLinks.length).toBeGreaterThan(0);
    });

    it('renders logo image', () => {
      renderWithRouter(<Navbar loggedInUser="" />);
      
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('src', './Img/foodablemain.jpg');
    });

    it('toggles mobile menu when menu icon is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRouter(<Navbar loggedInUser="" />);
      
      const menuIcon = container.querySelector('.menu-icon');
      await user.click(menuIcon);
      
      const navMenu = container.querySelector('.nav-menu');
      expect(navMenu).toHaveClass('nav-menu active');
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      sessionStorage.setItem('jwt', 'mock-token');
    });

    it('fetches user data on mount', async () => {
      const mockUserData = {
        status: 200,
        data: {
          addresses: [{ street: '123 Main St', city: 'Test City' }],
        },
      };
      
      axios.mockResolvedValueOnce(mockUserData);

      renderWithRouter(<Navbar loggedInUser="test@example.com" />);

      await waitFor(() => {
        expect(axios).toHaveBeenCalledWith({
          method: 'get',
          url: '/user',
          params: { email: 'test@example.com' },
          headers: { Authorization: 'Bearer mock-token' },
        });
      });
    });

    it('renders Receiver link instead of Donator when logged in', () => {
      renderWithRouter(<Navbar loggedInUser="test@example.com" />);
      
      expect(screen.getByText('Receiver')).toBeInTheDocument();
      expect(screen.queryByText('Donator')).not.toBeInTheDocument();
    });

    it('handles user data fetch error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      axios.mockRejectedValueOnce({ response: { status: 401 } });

      renderWithRouter(<Navbar loggedInUser="test@example.com" />);

      await waitFor(() => {
        expect(axios).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('navigation links', () => {
    it('home link navigates to /', () => {
      renderWithRouter(<Navbar loggedInUser="" />);
      
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('about link navigates to /About', () => {
      renderWithRouter(<Navbar loggedInUser="" />);
      
      const aboutLink = screen.getByText('About').closest('a');
      expect(aboutLink).toHaveAttribute('href', '/About');
    });

    it('contact link navigates to /Contact', () => {
      renderWithRouter(<Navbar loggedInUser="" />);
      
      const contactLink = screen.getByText('Contact').closest('a');
      expect(contactLink).toHaveAttribute('href', '/Contact');
    });
  });
});
