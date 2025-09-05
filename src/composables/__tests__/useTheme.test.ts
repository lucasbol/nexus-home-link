import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTheme } from '../useTheme'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock matchMedia
const mockMatchMedia = vi.fn()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia
})

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should initialize with system theme when no saved theme', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })

    const { savedTheme, currentTheme } = useTheme()

    expect(savedTheme.value).toBe('system')
    expect(currentTheme.value).toBe('light')
  })

  it('should use saved theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark')
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })

    const { savedTheme, currentTheme } = useTheme()

    expect(savedTheme.value).toBe('dark')
    expect(currentTheme.value).toBe('dark')
  })

  it('should save theme to localStorage when set', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })

    const { setTheme } = useTheme()
    setTheme('dark')

    expect(localStorageMock.setItem).toHaveBeenCalledWith('homelab-theme', 'dark')
  })
})
