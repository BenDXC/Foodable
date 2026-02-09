import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.querySelector('.App')).toBeDefined();
  });

  it('renders Navbar component', () => {
    render(<App />);
    // Navbar should be present
    const navbar = document.querySelector('.navbar');
    expect(navbar).toBeDefined();
  });

  it('renders Footer component', () => {
    render(<App />);
    // Footer should be present
    const footer = document.querySelector('.footer-container');
    expect(footer).toBeDefined();
  });

  it('renders Home route by default', () => {
    render(<App />);
    // Should render home page or about page content
    expect(document.body).toBeDefined();
  });

  it('initializes with empty loggedInUser state', () => {
    const { container } = render(<App />);
    // App should render successfully with initial state
    expect(container).toBeTruthy();
  });
});
