import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import axios from 'axios';

vi.mock('axios', () => ({
  default: vi.fn(),
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    // Default mock to return rejected promise
    axios.mockRejectedValue({ response: { status: 500 } });
  });

  describe('when user is not logged in', () => {
    it('renders About component when no user is logged in', () => {
      renderWithRouter(<Home loggedInUser="" />);
      
      // Check for About page content
      expect(screen.getByText(/Check out the features of our Website!/i)).toBeInTheDocument();
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      sessionStorage.setItem('jwt', 'mock-token');
    });

    it('renders welcome page content', () => {
      renderWithRouter(<Home loggedInUser="test@example.com" />);
      
      expect(screen.getByText(/At Foodable our focus is to tackle world hunger/i)).toBeInTheDocument();
    });

    it('displays information about dietary requirements', () => {
      renderWithRouter(<Home loggedInUser="test@example.com" />);
      
      expect(screen.getByText(/healthy food packages that meet peoples different dietary equirements/i)).toBeInTheDocument();
    });

    it('displays information about waste reduction', () => {
      renderWithRouter(<Home loggedInUser="test@example.com" />);
      
      expect(screen.getByText(/Global Hunger is not the only thing we are after!/i)).toBeInTheDocument();
      expect(screen.getByText(/Waste is another issue/i)).toBeInTheDocument();
    });

    it('renders foodbank button', () => {
      renderWithRouter(<Home loggedInUser="test@example.com" />);
      
      expect(screen.getByText('Find Foodbanks here')).toBeInTheDocument();
    });

    it('renders image carousel', () => {
      const { container } = renderWithRouter(<Home loggedInUser="test@example.com" />);
      
      const slider = container.querySelector('#slider');
      expect(slider).toBeInTheDocument();
      
      const images = slider.querySelectorAll('img');
      expect(images.length).toBe(5);
    });

    it('fetches user data on mount when logged in', async () => {
      const mockUserData = {
        status: 200,
        data: {
          addresses: [{ street: '123 Main St' }],
        },
      };
      
      axios.mockResolvedValueOnce(mockUserData);
      
      renderWithRouter(<Home loggedInUser="test@example.com" />);
      
      await waitFor(() => {
        expect(axios).toHaveBeenCalledWith({
          method: 'get',
          url: '/user',
          params: { email: 'test@example.com' },
          headers: { Authorization: 'Bearer mock-token' },
        });
      });
    });

    it('handles user data fetch error', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      axios.mockRejectedValueOnce({ response: { status: 404 } });
      
      renderWithRouter(<Home loggedInUser="test@example.com" />);
      
      await waitFor(() => {
        expect(axios).toHaveBeenCalled();
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('carousel images', () => {
    it('renders all carousel images with correct alt text', () => {
      const { container } = renderWithRouter(<Home loggedInUser="test@example.com" />);
      
      const images = container.querySelectorAll('#slider img');
      expect(images[0]).toHaveAttribute('alt', 'Food_1');
      expect(images[1]).toHaveAttribute('alt', 'Food_2');
      expect(images[2]).toHaveAttribute('alt', 'Donating_Food');
      expect(images[3]).toHaveAttribute('alt', 'Donating_Food');
      expect(images[4]).toHaveAttribute('alt', 'Donating_Food');
    });
  });
});
