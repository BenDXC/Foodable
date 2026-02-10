import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Footer Component', () => {
  it('renders footer container', () => {
    const { container } = renderWithRouter(<Footer />);
    expect(container.querySelector('.footer-container')).toBeInTheDocument();
  });

  describe('About Us section', () => {
    it('renders About Us heading', () => {
      renderWithRouter(<Footer />);
      const headings = screen.getAllByText('About Us');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('renders About Us links', () => {
      renderWithRouter(<Footer />);
      expect(screen.getByText('How it works')).toBeInTheDocument();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    });

    it('About Us links navigate to /About', () => {
      renderWithRouter(<Footer />);
      const aboutLinks = screen.getAllByText('About Us');
      const link = aboutLinks.find(el => el.tagName === 'A');
      expect(link).toHaveAttribute('href', '/About');
    });
  });

  describe('Contact Us section', () => {
    it('renders Contact Us heading', () => {
      renderWithRouter(<Footer />);
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    it('renders contact links', () => {
      renderWithRouter(<Footer />);
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
      expect(screen.getByText('Send A Message')).toBeInTheDocument();
      expect(screen.getByText('Offline Maps')).toBeInTheDocument();
    });

    it('contact links navigate to /Contact', () => {
      renderWithRouter(<Footer />);
      const contactLink = screen.getByText('Contact').closest('a');
      expect(contactLink).toHaveAttribute('href', '/Contact');
    });
  });

  describe('Online Services section', () => {
    it('renders Online Services heading', () => {
      renderWithRouter(<Footer />);
      expect(screen.getByText('Online Services')).toBeInTheDocument();
    });

    it('renders donation links', () => {
      renderWithRouter(<Footer />);
      expect(screen.getByText('Donate Food')).toBeInTheDocument();
      expect(screen.getByText('What you can donate')).toBeInTheDocument();
      expect(screen.getByText('Receive Food')).toBeInTheDocument();
    });

    it('donation link navigates to /Donator', () => {
      renderWithRouter(<Footer />);
      const donateLink = screen.getByText('Donate Food').closest('a');
      expect(donateLink).toHaveAttribute('href', '/Donator');
    });

    it('receiver link navigates to /Receiver', () => {
      renderWithRouter(<Footer />);
      const receiveLink = screen.getByText('Receive Food').closest('a');
      expect(receiveLink).toHaveAttribute('href', '/Receiver');
    });
  });

  describe('Donator Rewards section', () => {
    it('renders Donator Rewards heading', () => {
      renderWithRouter(<Footer />);
      expect(screen.getByText('Donator Rewards')).toBeInTheDocument();
    });

    it('renders rewards links', () => {
      renderWithRouter(<Footer />);
      expect(screen.getByText('Find Rewards')).toBeInTheDocument();
      expect(screen.getByText('Get Rewards')).toBeInTheDocument();
      expect(screen.getByText('Claim Rewards')).toBeInTheDocument();
    });

    it('rewards links navigate to /Reward', () => {
      renderWithRouter(<Footer />);
      const rewardLink = screen.getByText('Find Rewards').closest('a');
      expect(rewardLink).toHaveAttribute('href', '/Reward');
    });
  });

  describe('Social Media section', () => {
    it('renders logo image', () => {
      const { container } = renderWithRouter(<Footer />);
      const logo = container.querySelector('.social-logo img');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'Img/foodablemain.jpg');
    });

    it('renders copyright text with current year', () => {
      renderWithRouter(<Footer />);
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(/All Rights Reserved/i)).toBeInTheDocument();
    });

    it('renders social media icons', () => {
      const { container } = renderWithRouter(<Footer />);
      const socialIcons = container.querySelectorAll('.social-icon-link');
      expect(socialIcons.length).toBe(3);
    });

    it('renders Facebook icon with aria-label', () => {
      const { container } = renderWithRouter(<Footer />);
      const facebookIcon = container.querySelector('[aria-label="Visit our Facebook page"]');
      expect(facebookIcon).toBeInTheDocument();
    });

    it('renders Instagram icon with aria-label', () => {
      const { container } = renderWithRouter(<Footer />);
      const instagramIcon = container.querySelector('[aria-label="Visit our Instagram page"]');
      expect(instagramIcon).toBeInTheDocument();
    });

    it('renders Youtube icon with aria-label', () => {
      const { container } = renderWithRouter(<Footer />);
      const youtubeIcon = container.querySelector('[aria-label="Visit our YouTube channel"]');
      expect(youtubeIcon).toBeInTheDocument();
    });
  });
});
