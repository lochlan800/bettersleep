/**
 * Trigger a short vibration if the browser supports it.
 * Silently does nothing on unsupported devices (e.g. iOS Safari).
 *
 * Patterns:
 *   'tap'     – quick single buzz (like pressing a button)
 *   'success' – double buzz (like completing something)
 *   'error'   – long buzz (something went wrong)
 */
export function vibrate(pattern = 'tap') {
  try {
    if (!window?.navigator?.vibrate) return

    switch (pattern) {
      case 'tap':
        window.navigator.vibrate(150)
        break
      case 'success':
        window.navigator.vibrate([150, 100, 200])
        break
      case 'error':
        window.navigator.vibrate(500)
        break
      default:
        window.navigator.vibrate(150)
    }
  } catch {
    // Silently fail if vibration not available
  }
}
