import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CardItem from './CardItem';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CardItem Component', () => {
  const mockProps = {
    path: '/test-path',
    label: 'Test Label',
    src: 'test-image.jpg',
    text: 'Test card text',
  };

  it('renders card item with correct text', () => {
    renderWithRouter(<CardItem {...mockProps} />);
    expect(screen.getByText('Test card text')).toBeInTheDocument();
  });

  it('renders card with correct label', () => {
    renderWithRouter(<CardItem {...mockProps} />);
    const figure = screen.getByRole('img').parentElement;
    expect(figure).toHaveAttribute('data-category', 'Test Label');
  });

  it('renders image with correct src', () => {
    renderWithRouter(<CardItem {...mockProps} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });

  it('renders image with alt text', () => {
    renderWithRouter(<CardItem {...mockProps} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt');
    expect(image.getAttribute('alt')).toContain('Test Label');
  });

  it('links to correct path', () => {
    renderWithRouter(<CardItem {...mockProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test-path');
  });

  it('applies correct CSS classes', () => {
    renderWithRouter(<CardItem {...mockProps} />);
    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveClass('cards__item');
  });
});
