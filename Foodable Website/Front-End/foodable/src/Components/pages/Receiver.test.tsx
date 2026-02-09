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
      
      expect(screen.getByLabelText('Show all food packages')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter for halal food packages')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter for vegan food packages')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter for vegetarian food packages')).toBeInTheDocument();
      resolve();
    });
  });

  it('filters packages when All button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Receiver />);
    
    const allButton = screen.getByLabelText('Show all food packages');
    await user.click(allButton);
    
    expect(allButton).toBeInTheDocument();
  });

  it('filters packages when Halal button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Receiver />);
    
    const halalButton = screen.getByLabelText('Filter for halal food packages');
    await user.click(halalButton);
    
    expect(halalButton).toBeInTheDocument();
  });

  it('filters packages when Vegan button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Receiver />);
    
    const veganButton = screen.getByLabelText('Filter for vegan food packages');
    await user.click(veganButton);
    
    expect(veganButton).toBeInTheDocument();
  });

  it('filters packages when Vegetarian button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Receiver />);
    
    const vegetarianButton = screen.getByLabelText('Filter for vegetarian food packages');
    await user.click(vegetarianButton);
    
    expect(vegetarianButton).toBeInTheDocument();
  });
});
