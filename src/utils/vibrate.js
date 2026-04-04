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
  if (typeof navigator === 'undefined' || !navigator.vibrate) return

  switch (pattern) {
    case 'tap':
      navigator.vibrate(30)
      break
    case 'success':
      navigator.vibrate([30, 50, 60])
      break
    case 'error':
      navigator.vibrate(200)
      break
    default:
      navigator.vibrate(30)
  }
}
