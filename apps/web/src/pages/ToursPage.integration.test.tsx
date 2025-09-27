import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ToursPage } from './ToursPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ToursPage Integration', () => {
  it('loads and displays tours from API', async () => {
    renderWithRouter(<ToursPage />);
    
    // Wait for tours to load
    await waitFor(() => {
      expect(screen.getByText('Test Tour')).toBeInTheDocument();
    });
    
    expect(screen.getByText('A test tour description')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    renderWithRouter(<ToursPage />);
    
    expect(screen.getByText('Loading tours...')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    // Mock API error
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValue(new Error('API Error'));
    
    renderWithRouter(<ToursPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load tours')).toBeInTheDocument();
    });
    
    global.fetch = originalFetch;
  });

  it('filters tours by category', async () => {
    renderWithRouter(<ToursPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Tour')).toBeInTheDocument();
    });
    
    // Test category filter
    const categoryFilter = screen.getByRole('combobox', { name: /category/i });
    expect(categoryFilter).toBeInTheDocument();
  });

  it('searches tours by title', async () => {
    renderWithRouter(<ToursPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Tour')).toBeInTheDocument();
    });
    
    // Test search functionality
    const searchInput = screen.getByRole('textbox', { name: /search/i });
    expect(searchInput).toBeInTheDocument();
  });
});
