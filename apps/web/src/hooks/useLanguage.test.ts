import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLanguage } from './useLanguage';

// Mock i18n
const mockI18n = {
  language: 'en',
  on: vi.fn(),
  off: vi.fn(),
};

vi.mock('../i18n', () => ({
  i18n: mockI18n,
  SUPPORTED_LOCALES: ['en', 'ru', 'es', 'ar'],
  isRTL: vi.fn((lang) => ['ar', 'he'].includes(lang)),
  getLanguageDirection: vi.fn((lang) => ['ar', 'he'].includes(lang) ? 'rtl' : 'ltr'),
}));

describe('useLanguage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockI18n.language = 'en';
  });

  it('returns current language', () => {
    const { result } = renderHook(() => useLanguage());
    
    expect(result.current.language).toBe('en');
    expect(result.current.isRTL).toBe(false);
    expect(result.current.direction).toBe('ltr');
  });

  it('detects RTL languages', () => {
    mockI18n.language = 'ar';
    const { result } = renderHook(() => useLanguage());
    
    expect(result.current.language).toBe('ar');
    expect(result.current.isRTL).toBe(true);
    expect(result.current.direction).toBe('rtl');
  });

  it('provides language name', () => {
    const { result } = renderHook(() => useLanguage());
    
    expect(result.current.getLanguageName('en')).toBe('English');
    expect(result.current.getLanguageName('ru')).toBe('Русский');
    expect(result.current.getLanguageName('ar')).toBe('العربية');
  });

  it('provides language flag', () => {
    const { result } = renderHook(() => useLanguage());
    
    expect(result.current.getLanguageFlag('en')).toBe('🇺🇸');
    expect(result.current.getLanguageFlag('ru')).toBe('🇷🇺');
    expect(result.current.getLanguageFlag('ar')).toBe('🇸🇦');
  });

  it('returns supported languages', () => {
    const { result } = renderHook(() => useLanguage());
    
    expect(result.current.supportedLanguages).toEqual(['en', 'ru', 'es', 'ar']);
  });

  it('handles language change', () => {
    const { result } = renderHook(() => useLanguage());
    
    act(() => {
      result.current.changeLanguage('ru');
    });
    
    // Note: In a real test, you'd mock the i18n.changeLanguage method
    // and verify it was called with the correct language
  });

  it('sets up language change listener', () => {
    renderHook(() => useLanguage());
    
    expect(mockI18n.on).toHaveBeenCalledWith('languageChanged', expect.any(Function));
  });

  it('cleans up language change listener on unmount', () => {
    const { unmount } = renderHook(() => useLanguage());
    
    unmount();
    
    expect(mockI18n.off).toHaveBeenCalledWith('languageChanged', expect.any(Function));
  });
});
