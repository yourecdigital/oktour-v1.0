import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary variant styles', () => {
    render(<Button $variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background-color: #007bff');
  });

  it('applies secondary variant styles', () => {
    render(<Button $variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background-color: #6c757d');
  });

  it('applies danger variant styles', () => {
    render(<Button $variant="danger">Danger Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background-color: #dc3545');
  });

  it('applies size styles', () => {
    render(<Button $size="large">Large Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('font-size: 18px');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading Button</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Loading Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies full width when specified', () => {
    render(<Button $fullWidth>Full Width Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('width: 100%');
  });

  it('forwards additional props', () => {
    render(<Button data-testid="custom-button" aria-label="Custom button">Button</Button>);
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom button');
  });
});

