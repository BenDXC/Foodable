import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Donator from './Donator';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Donator Component', () => {
  const mockSetLoggedinUser = vi.fn();

  it('renders donator page with sidebar', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Donator setLoggedinUser={mockSetLoggedinUser} />);
      expect(screen.getByText('User')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders create donation form', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Donator setLoggedinUser={mockSetLoggedinUser} />);
      expect(screen.getByText('Create Donation')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders all form fields', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Donator setLoggedinUser={mockSetLoggedinUser} />);
      
      expect(screen.getByText('Item name')).toBeInTheDocument();
      expect(screen.getByText('Item quantity')).toBeInTheDocument();
      expect(screen.getByText('Select dietary preference')).toBeInTheDocument();
      expect(screen.getByText('Expiry date')).toBeInTheDocument();
      expect(screen.getByText('Upload image')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders dietary preference options', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Donator setLoggedinUser={mockSetLoggedinUser} />);
      
      expect(screen.getByLabelText('Halal')).toBeInTheDocument();
      expect(screen.getByLabelText('Non-Halal')).toBeInTheDocument();
      expect(screen.getByLabelText('Vegan')).toBeInTheDocument();
      expect(screen.getByLabelText('Vegetarian')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders sidebar navigation links', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Donator setLoggedinUser={mockSetLoggedinUser} />);
      
      expect(screen.getByText('Donate')).toBeInTheDocument();
      expect(screen.getByText('Rewards')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders submit button', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Donator setLoggedinUser={mockSetLoggedinUser} />);
      
      const submitButton = screen.getByText('Add item');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton.tagName).toBe('BUTTON');
      resolve();
    });
  });

  it('allows filling item name input', async () => {
    const user = userEvent.setup();
    const { container } = renderWithRouter(<Donator setLoggedinUser={mockSetLoggedinUser} />);
    
    const itemNameInput = container.querySelector('input[name="itemName"]') as HTMLInputElement;
    if (itemNameInput) {
      await user.type(itemNameInput, 'Bread');
      expect(itemNameInput.value).toContain('Bread');
    }
  });

  it('renders item added to package section', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Donator setLoggedinUser={mockSetLoggedinUser} />);
      
      expect(screen.getByText('Item added to package')).toBeInTheDocument();
      expect(screen.getByText('Create package')).toBeInTheDocument();
      resolve();
    });
  });
});
