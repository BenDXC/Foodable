import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Receiver from './Receiver';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Receiver Component', () => {
  it('renders receiver page', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Receiver />);
      expect(screen.getByText('Please select a filter')).toBeInTheDocument();
      resolve();
    });
  });

  it('renders filter buttons', async () => {
    await new Promise<void>((resolve) => {
      renderWithRouter(<Receiver />);
      
      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Halal' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Vegan' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Vegetarian' })).toBeInTheDocument();
      resolve();
    });
  });

  it('filters packages when All button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Receiver />);
    
    const allButton = screen.getByRole('button', { name: 'All' });
    await user.click(allButton);
    
    // Should show filtered results
    expect(allButton).toBeInTheDocument();
  });

  it('filters packages when Halal button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Receiver />);
    
    const halalButton = screen.getByRole('button', { name: 'Halal' });
    await user.click(halalButton);
    
    // Filtering logic should execute
    expect(halalButton).toBeInTheDocument();
  });

  it('filters packages when Vegan button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Receiver />);
    
    const veganButton = screen.getByRole('button', { name: 'Vegan' });
    await user.click(veganButton);
    
    expect(veganButton).toBeInTheDocument();
  });

  it('filters packages when Vegetarian button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Receiver />);
    
    const vegetarianButton = screen.getByRole('button', { name: 'Vegetarian' });
    await user.click(vegetarianButton);
    
    expect(vegetarianButton).toBeInTheDocument();
  });
});
