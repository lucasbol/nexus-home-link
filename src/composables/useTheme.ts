import { ref, computed } from 'vue'

type Theme = 'light' | 'dark' | 'system'

const THEME_KEY = 'homelab-theme'

export function useTheme() {
  const savedTheme = ref<Theme>((localStorage.getItem(THEME_KEY) as Theme) || 'system')
  const systemTheme = ref<Theme>('light')

  const currentTheme = computed(() => {
    if (savedTheme.value === 'system') {
      return systemTheme.value
    }
    return savedTheme.value
  })

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement

    if (theme === 'dark' || (theme === 'system' && systemTheme.value === 'dark')) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const setTheme = (theme: Theme) => {
    savedTheme.value = theme
    localStorage.setItem(THEME_KEY, theme)
    applyTheme(theme)
  }

  // Watch for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const updateSystemTheme = () => {
    systemTheme.value = mediaQuery.matches ? 'dark' : 'light'
    if (savedTheme.value === 'system') {
      applyTheme('system')
    }
  }

  // Initialize
  updateSystemTheme()
  mediaQuery.addEventListener('change', updateSystemTheme)
  applyTheme(savedTheme.value)

  return {
    currentTheme,
    savedTheme,
    setTheme,
    applyTheme
  }
}
