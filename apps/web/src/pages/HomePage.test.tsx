import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from './HomePage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  it('renders homepage content', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('Welcome to Tour Travel')).toBeInTheDocument();
    expect(screen.getByText('Discover amazing destinations')).toBeInTheDocument();
  });

  it('renders hero section', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByRole('link', { name: /tours/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('displays language selector', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
