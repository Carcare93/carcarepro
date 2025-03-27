
import { renderHook } from '@testing-library/react';
import { useIsMobile } from './use-mobile';

// Mock the matchMedia function
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('useIsMobile hook', () => {
  beforeEach(() => {
    // Reset matchMedia mock before each test
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it('should return false for non-mobile screens', () => {
    // Set window.innerWidth to a desktop size
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    
    const { result } = renderHook(() => useIsMobile());
    
    // Initially undefined as the hook depends on a useEffect
    expect(result.current).toBe(false);
  });

  it('should return true for mobile screens', () => {
    // Set window.innerWidth to a mobile size
    Object.defineProperty(window, 'innerWidth', { value: 480, writable: true });
    
    // Mock matchMedia to return true for the mobile media query
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    
    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(true);
  });
});
