import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useLanguage } from './useLanguage';

// Mock i18next
const mockI18n = {
  changeLanguage: vi.fn(),
  language: 'en',
};

vi.mock('i18next', () => ({
  default: mockI18n,
}));

// Mock getLanguageDirection
vi.mock('../utils/language', () => ({
  getLanguageDirection: vi.fn((lang) => lang === 'ar' ? 'rtl' : 'ltr'),
}));

describe('useLanguage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns current language and direction', () => {
    const { result } = renderHook(() => useLanguage());
    
    expect(result.current.language).toBe('en');
    expect(result.current.direction).toBe('ltr');
  });

  it('changes language when setLanguage is called', () => {
    const { result } = renderHook(() => useLanguage());
    
    act(() => {
      result.current.setLanguage('ar');
    });
    
    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('ar');
  });

  it('updates direction when language changes', () => {
    const { result } = renderHook(() => useLanguage());
    
    act(() => {
      result.current.setLanguage('ar');
    });
    
    expect(result.current.direction).toBe('rtl');
  });

  it('handles language change errors', () => {
    mockI18n.changeLanguage.mockRejectedValue(new Error('Language change failed'));
    
    const { result } = renderHook(() => useLanguage());
    
    act(() => {
      result.current.setLanguage('invalid');
    });
    
    // Should not throw
    expect(result.current.language).toBe('en');
  });
});
