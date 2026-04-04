// Global audio context (reuse instead of creating new one each time)
let audioContext = null

function getAudioContext() {
  try {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) return null
      audioContext = new AudioContextClass()
    }

    // Resume if suspended (required on some browsers after user interaction)
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    return audioContext
  } catch (e) {
    console.warn('Audio context error:', e)
    return null
  }
}

/**
 * Play sound effects using Web Audio API
 * Generates sounds procedurally — no external files needed
 */
export function playSound(type = 'twinkle') {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    if (type === 'explosion') {
      playExplosion(ctx)
    } else if (type === 'twinkle') {
      playTwinkle(ctx)
    }
  } catch (e) {
    console.warn('Play sound error:', e)
  }
}

/**
 * Generate a satisfying "explosion" sound for successful actions
 * Deep bass burst with slight pitch decay
 */
function playExplosion(ctx) {
  const now = ctx.currentTime

  // Bass burst
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.frequency.setValueAtTime(150, now)
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.2)

  gain.gain.setValueAtTime(0.5, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

  osc.start(now)
  osc.stop(now + 0.3)
}

/**
 * Generate a light "twinkle" sound for taps and toggles
 * Two rising pitch notes
 */
function playTwinkle(ctx) {
  const now = ctx.currentTime

  // First note
  const osc1 = ctx.createOscillator()
  const gain1 = ctx.createGain()

  osc1.connect(gain1)
  gain1.connect(ctx.destination)

  osc1.frequency.setValueAtTime(800, now)
  osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.1)

  gain1.gain.setValueAtTime(0.3, now)
  gain1.gain.exponentialRampToValueAtTime(0, now + 0.1)

  osc1.start(now)
  osc1.stop(now + 0.1)

  // Second note (slightly higher)
  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()

  osc2.connect(gain2)
  gain2.connect(ctx.destination)

  osc2.frequency.setValueAtTime(1000, now + 0.05)
  osc2.frequency.exponentialRampToValueAtTime(1400, now + 0.15)

  gain2.gain.setValueAtTime(0.3, now + 0.05)
  gain2.gain.exponentialRampToValueAtTime(0, now + 0.15)

  osc2.start(now + 0.05)
  osc2.stop(now + 0.15)
}
