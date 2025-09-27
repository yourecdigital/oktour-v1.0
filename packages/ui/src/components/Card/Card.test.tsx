import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders with children', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies custom padding', () => {
    render(<Card $padding="30px">Card content</Card>);
    const card = screen.getByText('Card content').parentElement;
    expect(card).toHaveStyle('padding: 30px');
  });

  it('applies custom margin', () => {
    render(<Card $margin="20px">Card content</Card>);
    const card = screen.getByText('Card content').parentElement;
    expect(card).toHaveStyle('margin: 20px');
  });

  it('applies custom border radius', () => {
    render(<Card $borderRadius="15px">Card content</Card>);
    const card = screen.getByText('Card content').parentElement;
    expect(card).toHaveStyle('border-radius: 15px');
  });

  it('applies custom background color', () => {
    render(<Card $backgroundColor="#f0f0f0">Card content</Card>);
    const card = screen.getByText('Card content').parentElement;
    expect(card).toHaveStyle('background-color: #f0f0f0');
  });

  it('applies custom box shadow', () => {
    render(<Card $boxShadow="0 2px 4px rgba(0,0,0,0.1)">Card content</Card>);
    const card = screen.getByText('Card content').parentElement;
    expect(card).toHaveStyle('box-shadow: 0 2px 4px rgba(0,0,0,0.1)');
  });

  it('forwards additional props', () => {
    render(
      <Card data-testid="custom-card" className="custom-class">
        Card content
      </Card>
    );
    
    const card = screen.getByTestId('custom-card');
    expect(card).toHaveClass('custom-class');
  });

  it('has default styles', () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText('Card content').parentElement;
    
    expect(card).toHaveStyle('background-color: #ffffff');
    expect(card).toHaveStyle('border-radius: 8px');
    expect(card).toHaveStyle('padding: 20px');
  });
});

