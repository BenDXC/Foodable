import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import About from './About';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('About Component', () => {
  it('renders main content about tackling world hunger', () => {
    renderWithRouter(<About />);
    expect(
      screen.getByText(/At Foodable our focus is to tackle world hunger with healthy food packages/i)
    ).toBeInTheDocument();
  });

  it('displays information about dietary requirements', () => {
    renderWithRouter(<About />);
    expect(
      screen.getByText(/Foodable allows for people to use a single platform/i)
    ).toBeInTheDocument();
  });

  it('mentions waste reduction goals', () => {
    renderWithRouter(<About />);
    expect(screen.getByText(/Global Hunger is not the only thing we are after!/i)).toBeInTheDocument();
    expect(screen.getByText(/Waste is another issue/i)).toBeInTheDocument();
  });

  it('renders foodbank button', () => {
    renderWithRouter(<About />);
    expect(screen.getByText('Find Foodbanks here')).toBeInTheDocument();
  });

  it('renders Cards component', () => {
    renderWithRouter(<About />);
    expect(screen.getByText('Check out the features of our Website!')).toBeInTheDocument();
  });

  it('displays all feature cards', () => {
    renderWithRouter(<About />);
    
    // Check for card texts
    expect(screen.getByText(/Send food to a foodbank to help people in need/i)).toBeInTheDocument();
    expect(screen.getByText(/Check our website to see if there is food\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Find Foodbanks near you/i)).toBeInTheDocument();
    expect(screen.getByText(/Send us an email or Call Us/i)).toBeInTheDocument();
  });
});
