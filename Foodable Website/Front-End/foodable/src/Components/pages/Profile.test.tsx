import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Profile from './Profile';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Profile Component', () => {
  const mockSetLoggedinUser = vi.fn();

  it('renders profile page with sidebar', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Profile setLoggedinUser={mockSetLoggedinUser} />);
      expect(screen.getByText('User')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders edit profile form', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Profile setLoggedinUser={mockSetLoggedinUser} />);
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders personal info section', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Profile setLoggedinUser={mockSetLoggedinUser} />);
      expect(screen.getByText('Personal info')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders all profile form fields', async () => {
    await new Promise<void>((resolve) => {
      const { container } = renderWithRouter(<Profile setLoggedinUser={mockSetLoggedinUser} />);
      
      expect(container.querySelector('input[name="firstName"]')).toBeInTheDocument();
      expect(container.querySelector('input[name="lastName"]')).toBeInTheDocument();
      expect(container.querySelector('input[name="postcode"]')).toBeInTheDocument();
      expect(container.querySelector('input[name="email"]')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders profile picture upload', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Profile setLoggedinUser={mockSetLoggedinUser} />);
      
      expect(screen.getByText('Change profile picture')).toBeInTheDocument();
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      resolve();
    });
  });

  it('renders confirm changes button', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Profile setLoggedinUser={mockSetLoggedinUser} />);
      
      const confirmButton = screen.getByText('Confirm changes');
      expect(confirmButton).toBeInTheDocument();
      resolve();
    });
  });

  it('allows updating form fields', async () => {
    const user = userEvent.setup();
    const { container } = renderWithRouter(<Profile setLoggedinUser={mockSetLoggedinUser} />);
    
    const firstNameInput = container.querySelector('input[name="firstName"]') as HTMLInputElement;
    if (firstNameInput) {
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Jane');
      expect(firstNameInput).toHaveValue('Jane');
    }
  });

  it('renders sidebar navigation', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Profile setLoggedinUser={mockSetLoggedinUser} />);
      
      expect(screen.getByText('Donate')).toBeInTheDocument();
      expect(screen.getByText('Rewards')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
      resolve();
    });
  });
});
