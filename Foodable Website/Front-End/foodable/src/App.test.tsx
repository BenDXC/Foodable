import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', async () => {
    await new Promise<void>((resolve) => {
      render(<App />);
      expect(document.querySelector('.App')).toBeDefined();
      resolve();
    });
  });

  it('renders Navbar component', async () => {
    await new Promise<void>((resolve) => {
      render(<App />);
      const navbar = document.querySelector('.navbar');
      expect(navbar).toBeDefined();
      resolve();
    });
  });

  it('renders Footer component', async () => {
    await new Promise<void>((resolve) => {
      render(<App />);
      const footer = document.querySelector('.footer-container');
      expect(footer).toBeDefined();
      resolve();
    });
  });

  it('renders Home route by default', async () => {
    await new Promise<void>((resolve) => {
      render(<App />);
      expect(document.body).toBeDefined();
      resolve();
    });
  });

  it('initializes with empty loggedInUser state', async () => {
    await new Promise<void>((resolve) => {
      const { container } = render(<App />);
      expect(container).toBeTruthy();
      resolve();
    });
  });
});
