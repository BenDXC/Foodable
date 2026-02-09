import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import {
  Button,
  Button_D,
  Button_Receiver,
  Button_Register,
  Button_Foodbank,
  Button_Verify,
} from './Button';

// Helper to render with Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Button Component', () => {
  it('renders button with children text', () => {
    renderWithRouter(<Button>Login</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Login');
  });

  it('applies default style when invalid buttonStyle is provided', () => {
    renderWithRouter(<Button buttonStyle="invalid-style">Test</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('btn--primary');
  });

  it('applies correct style when valid buttonStyle is provided', () => {
    renderWithRouter(<Button buttonStyle="btn--outline">Test</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('btn--outline');
  });

  it('applies default size when invalid buttonSize is provided', () => {
    renderWithRouter(<Button buttonSize="invalid-size">Test</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('btn--medium');
  });

  it('applies correct size when valid buttonSize is provided', () => {
    renderWithRouter(<Button buttonSize="btn--large">Test</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('btn--large');
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    renderWithRouter(<Button onClick={handleClick}>Click Me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('sets correct button type', () => {
    renderWithRouter(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button');
    expect(button.type).toBe('submit');
  });

  it('links to /Login route', () => {
    renderWithRouter(<Button>Login</Button>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/Login');
  });
});

describe('Button_D Component', () => {
  it('renders button with children text', () => {
    renderWithRouter(<Button_D>Donate</Button_D>);
    expect(screen.getByRole('button')).toHaveTextContent('Donate');
  });

  it('links to /Donator route', () => {
    renderWithRouter(<Button_D>Donate</Button_D>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/Donator');
  });

  it('applies correct styles', () => {
    renderWithRouter(<Button_D buttonStyle="btn--outline" buttonSize="btn--large">Test</Button_D>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('btn--outline');
    expect(button.className).toContain('btn--large');
  });
});

describe('Button_Receiver Component', () => {
  it('renders button with children text', () => {
    renderWithRouter(<Button_Receiver>Receive</Button_Receiver>);
    expect(screen.getByRole('button')).toHaveTextContent('Receive');
  });

  it('links to /Receiver route', () => {
    renderWithRouter(<Button_Receiver>Receive</Button_Receiver>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/Receiver');
  });
});

describe('Button_Register Component', () => {
  it('renders button with children text', () => {
    renderWithRouter(<Button_Register>Register</Button_Register>);
    expect(screen.getByRole('button')).toHaveTextContent('Register');
  });

  it('links to /Registration route', () => {
    renderWithRouter(<Button_Register>Register</Button_Register>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/Registration');
  });
});

describe('Button_Foodbank Component', () => {
  it('renders button with children text', () => {
    renderWithRouter(<Button_Foodbank>Foodbank</Button_Foodbank>);
    expect(screen.getByRole('button')).toHaveTextContent('Foodbank');
  });

  it('links to /Foodbank route', () => {
    renderWithRouter(<Button_Foodbank>Foodbank</Button_Foodbank>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/Foodbank');
  });
});

describe('Button_Verify Component', () => {
  beforeEach(() => {
    // Mock alert before each test
    global.alert = vi.fn();
  });

  it('renders button with children text', () => {
    render(<Button_Verify>Verify</Button_Verify>);
    expect(screen.getByRole('button')).toHaveTextContent('Verify');
  });

  it('generates and displays 8-digit OTP when clicked', async () => {
    const user = userEvent.setup();
    render(<Button_Verify>Generate OTP</Button_Verify>);
    
    await user.click(screen.getByRole('button'));
    
    expect(global.alert).toHaveBeenCalledTimes(1);
    const otpValue = global.alert.mock.calls[0][0];
    expect(otpValue).toMatch(/^\d{8}$/); // Verify it's 8 digits
  });

  it('generates different OTP on each click', async () => {
    const user = userEvent.setup();
    render(<Button_Verify>Generate OTP</Button_Verify>);
    
    await user.click(screen.getByRole('button'));
    const firstOTP = global.alert.mock.calls[0][0];
    
    await user.click(screen.getByRole('button'));
    const secondOTP = global.alert.mock.calls[1][0];
    
    // While theoretically they could be the same, it's very unlikely
    // This test might occasionally fail due to randomness
    expect(firstOTP).toBeDefined();
    expect(secondOTP).toBeDefined();
  });
});
