import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserSidebar from './UserSidebar';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('UserSidebar Component', () => {
  it('renders username', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<UserSidebar username="Test User" />);
      expect(screen.getByText('Test User')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders profile image', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<UserSidebar username="Test User" />);
      const img = screen.getByAltText("Test User's profile");
      expect(img).toBeInTheDocument();
      resolve();
    });
  });

  it('uses default profile image when not provided', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<UserSidebar username="Test User" />);
      const img = screen.getByAltText("Test User's profile");
      expect(img).toHaveAttribute('src', 'Img/foodable1mini.jpg');
      resolve();
    });
  });

  it('uses custom profile image when provided', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<UserSidebar username="Test User" profileImage="custom.jpg" />);
      const img = screen.getByAltText("Test User's profile");
      expect(img).toHaveAttribute('src', 'custom.jpg');
      resolve();
    });
  });

  it('renders all navigation links', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<UserSidebar username="Test User" />);
      
      expect(screen.getByText('Donate')).toBeInTheDocument();
      expect(screen.getByText('Rewards')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
      resolve();
    });
  });

  it('navigation links have correct hrefs', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<UserSidebar username="Test User" />);
      
      const donateLink = screen.getByText('Donate').closest('a');
      const rewardsLink = screen.getByText('Rewards').closest('a');
      const profileLink = screen.getByText('Profile').closest('a');
      
      expect(donateLink).toHaveAttribute('href', '/Donator');
      expect(rewardsLink).toHaveAttribute('href', '/Reward');
      expect(profileLink).toHaveAttribute('href', '/Profile');
      resolve();
    });
  });
});
