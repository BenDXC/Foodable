import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactUs from './Contact';
import emailjs from '@emailjs/browser';

// Mock emailjs
vi.mock('@emailjs/browser', () => ({
  default: {
    sendForm: vi.fn(),
  },
}));

describe('ContactUs Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders contact information sections', () => {
    render(<ContactUs />);
    
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders location map iframe', () => {
    const { container } = render(<ContactUs />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://my.atlistmaps.com/map/8d0c2d8e-7923-4e2a-9ba3-f6cb51fcc204?share=true');
  });

  it('displays "Get in touch" section with phone number', () => {
    render(<ContactUs />);
    
    expect(screen.getByText('Get in touch')).toBeInTheDocument();
    expect(screen.getByText('You can call us at')).toBeInTheDocument();
    expect(screen.getByText('+44 7911 123456')).toBeInTheDocument();
  });

  it('displays email address in contact information', () => {
    render(<ContactUs />);
    
    expect(screen.getByText(/foodable7@gmail.com/i)).toBeInTheDocument();
  });

  it('renders contact form with all fields', () => {
    render(<ContactUs />);
    
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What's your email?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your questions...')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<ContactUs />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('submits form with emailjs when all fields are filled', async () => {
    const user = userEvent.setup();
    emailjs.sendForm.mockResolvedValueOnce({ text: 'Success' });
    
    render(<ContactUs />);
    
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText("What's your email?");
    const messageInput = screen.getByPlaceholderText('Your questions...');
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a test message');
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(emailjs.sendForm).toHaveBeenCalledTimes(1);
    });
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    emailjs.sendForm.mockResolvedValueOnce({ text: 'Success' });
    
    render(<ContactUs />);
    
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText("What's your email?");
    const messageInput = screen.getByPlaceholderText('Your questions...');
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a test message');
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
    });
  });

  it('handles email submission error gracefully', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    emailjs.sendForm.mockRejectedValueOnce({ text: 'Error sending email' });
    
    render(<ContactUs />);
    
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText("What's your email?");
    const messageInput = screen.getByPlaceholderText('Your questions...');
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a test message');
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(emailjs.sendForm).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });

  it('renders "Send us a message" heading', () => {
    render(<ContactUs />);
    expect(screen.getByText('Send us a message')).toBeInTheDocument();
  });

  it('renders form description', () => {
    render(<ContactUs />);
    expect(screen.getByText('Any queries about the Foodable Website')).toBeInTheDocument();
  });

  it('displays location section title', () => {
    render(<ContactUs />);
    expect(screen.getByText('Our Location')).toBeInTheDocument();
  });
});
