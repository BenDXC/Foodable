import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cards from './Cards';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Cards Component', () => {
  it('renders the main heading', () => {
    renderWithRouter(<Cards />);
    expect(screen.getByText('Check out the features of our Website!')).toBeInTheDocument();
  });

  it('renders all four card items', () => {
    renderWithRouter(<Cards />);
    const cards = screen.getAllByRole('listitem');
    expect(cards).toHaveLength(4);
  });

  it('renders donation card with correct text', () => {
    renderWithRouter(<Cards />);
    expect(screen.getByText('Send food to a foodbank to help people in need')).toBeInTheDocument();
  });

  it('renders receiver card with correct text', () => {
    renderWithRouter(<Cards />);
    expect(screen.getByText('Check our website to see if there is food?')).toBeInTheDocument();
  });

  it('renders foodbank card with correct text', () => {
    renderWithRouter(<Cards />);
    expect(screen.getByText('Find Foodbanks near you')).toBeInTheDocument();
  });

  it('renders contact card with correct text', () => {
    renderWithRouter(<Cards />);
    expect(screen.getByText('Send us an email or Call Us')).toBeInTheDocument();
  });

  it('links donation card to /Login', () => {
    renderWithRouter(<Cards />);
    const links = screen.getAllByRole('link');
    const donationLink = links.find(link => link.getAttribute('href') === '/Login');
    expect(donationLink).toBeInTheDocument();
  });

  it('links receiver card to /Receiver', () => {
    renderWithRouter(<Cards />);
    const links = screen.getAllByRole('link');
    const receiverLink = links.find(link => link.getAttribute('href') === '/Receiver');
    expect(receiverLink).toBeInTheDocument();
  });

  it('links foodbank card to /Foodbank', () => {
    renderWithRouter(<Cards />);
    const links = screen.getAllByRole('link');
    const foodbankLink = links.find(link => link.getAttribute('href') === '/Foodbank');
    expect(foodbankLink).toBeInTheDocument();
  });

  it('links contact card to /Contact', () => {
    renderWithRouter(<Cards />);
    const links = screen.getAllByRole('link');
    const contactLink = links.find(link => link.getAttribute('href') === '/Contact');
    expect(contactLink).toBeInTheDocument();
  });
});
