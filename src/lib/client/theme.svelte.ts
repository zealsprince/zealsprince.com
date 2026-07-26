import type { Theme } from '$lib/palettes'
import { browser } from '$app/environment'

export const THEME_STORAGE_KEY = 'zealsprince-theme'

function initial(): Theme {
  if (!browser)
    return 'light'

  // The inline script in app.html has already resolved this and stamped the
  // class on <html>, so read it back rather than resolving it twice.
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

class ThemeState {
  current = $state<Theme>(initial())

  /** True once the user has picked explicitly, which pins the choice. */
  #pinned = browser && !!localStorage.getItem(THEME_STORAGE_KEY)

  set(theme: Theme) {
    this.current = theme
    this.#pinned = true

    if (!browser)
      return

    localStorage.setItem(THEME_STORAGE_KEY, theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
  }

  toggle() {
    this.set(this.current === 'dark' ? 'light' : 'dark')
  }

  /** Follow the OS until the user picks a side. */
  follow(theme: Theme) {
    if (this.#pinned)
      return

    this.current = theme
    if (browser) {
      document.documentElement.classList.toggle('dark', theme === 'dark')
      document.documentElement.classList.toggle('light', theme === 'light')
    }
  }
}

export const theme = new ThemeState()
