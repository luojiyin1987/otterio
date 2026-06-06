/*
 * Theme management — light / dark.
 *
 * Source of truth: localStorage["otterio.theme"] ∈ {"light","dark"}.
 * If unset, we follow `prefers-color-scheme`. The initial theme is applied
 * synchronously by an inline script in index.html so the page never paints
 * with the wrong colors.
 */

const STORAGE_KEY = "otterio.theme"

export const getStoredTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch (e) {
    return null
  }
}

export const getSystemTheme = () => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark"
  }
  return "light"
}

export const getCurrentTheme = () => {
  if (typeof document === "undefined") return "light"
  return document.documentElement.getAttribute("data-theme") || "light"
}

export const applyTheme = theme => {
  if (typeof document === "undefined") return
  const root = document.documentElement
  // Suppress transitions during the swap to avoid a cross-fade flicker.
  root.classList.add("no-theme-transition")
  root.setAttribute("data-theme", theme)
  // Force a reflow, then drop the suppression class on the next frame.
  // eslint-disable-next-line no-unused-expressions
  root.offsetHeight
  window.requestAnimationFrame(() => {
    root.classList.remove("no-theme-transition")
  })
}

export const setTheme = theme => {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch (e) {
    // ignore — quota / private mode
  }
  applyTheme(theme)
}

export const toggleTheme = () => {
  const next = getCurrentTheme() === "dark" ? "light" : "dark"
  setTheme(next)
  return next
}
