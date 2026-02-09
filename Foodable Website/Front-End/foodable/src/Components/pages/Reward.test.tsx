import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Reward from './Reward';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Reward Component', () => {
  const mockSetLoggedinUser = vi.fn();

  it('renders reward page with sidebar', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Reward setLoggedinUser={mockSetLoggedinUser} />);
      expect(screen.getByText('User')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders rewards page title', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Reward setLoggedinUser={mockSetLoggedinUser} />);
      expect(screen.getByText('Foodable Rewards')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders rewards description', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Reward setLoggedinUser={mockSetLoggedinUser} />);
      expect(screen.getByText(/At foodable we are all about encouraging/i)).toBeInTheDocument();
      resolve();
    });
  });

  it('displays user points', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Reward setLoggedinUser={mockSetLoggedinUser} />);
      expect(screen.getByText(/Your Points:/i)).toBeInTheDocument();
      resolve();
    });
  });

  it('renders rewards available section', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Reward setLoggedinUser={mockSetLoggedinUser} />);
      expect(screen.getByText('Rewards available to claim')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders multiple reward items', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Reward setLoggedinUser={mockSetLoggedinUser} />);
      
      expect(screen.getByText(/Sainsbury's 10% off voucher/i)).toBeInTheDocument();
      expect(screen.getByText(/Tesco 10% off voucher/i)).toBeInTheDocument();
      expect(screen.getByText(/Aldi 25% off voucher/i)).toBeInTheDocument();
      resolve();
    });
  });

  it('renders sidebar navigation', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Reward setLoggedinUser={mockSetLoggedinUser} />);
      
      expect(screen.getByText('Donate')).toBeInTheDocument();
      expect(screen.getByText('Rewards')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders reward images', async () => {
    await new Promise<void>((resolve) => {
      const { container } = renderWithRouter(<Reward setLoggedinUser={mockSetLoggedinUser} />);
      
      const images = container.querySelectorAll('.rewards__item__img');
      expect(images.length).toBeGreaterThan(0);
      resolve();
    });
  });
});
