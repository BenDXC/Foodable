import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RewardItem from './RewardItem';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('RewardItem Component', () => {
  const mockProps = {
    path: '/reward-path',
    label: 'Reward Label',
    src: 'reward-image.jpg',
    text: 'Test reward text',
  };

  it('renders reward item with correct text', () => {
    renderWithRouter(<RewardItem {...mockProps} />);
    expect(screen.getByText('Test reward text')).toBeInTheDocument();
  });

  it('renders reward with correct label', () => {
    renderWithRouter(<RewardItem {...mockProps} />);
    const figure = screen.getByRole('img').parentElement;
    expect(figure).toHaveAttribute('data-category', 'Reward Label');
  });

  it('renders image with correct src', () => {
    renderWithRouter(<RewardItem {...mockProps} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'reward-image.jpg');
  });

  it('renders image with alt text', () => {
    renderWithRouter(<RewardItem {...mockProps} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Features');
  });

  it('links to correct path', () => {
    renderWithRouter(<RewardItem {...mockProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/reward-path');
  });

  it('applies correct CSS classes', () => {
    renderWithRouter(<RewardItem {...mockProps} />);
    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveClass('rewards__item');
  });

  it('applies rewards-specific CSS class to link', () => {
    renderWithRouter(<RewardItem {...mockProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('rewards__item__link');
  });

  it('applies rewards-specific CSS class to figure', () => {
    renderWithRouter(<RewardItem {...mockProps} />);
    const figure = screen.getByRole('img').parentElement;
    expect(figure).toHaveClass('rewards__item__pic-wrap');
  });

  it('applies rewards-specific CSS class to info div', () => {
    const { container } = renderWithRouter(<RewardItem {...mockProps} />);
    const infoDiv = container.querySelector('.rewards__item__info');
    expect(infoDiv).toBeInTheDocument();
  });
});
