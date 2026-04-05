import React, { createContext, useContext, useState, useCallback } from 'react'
import { vibrate } from '../utils/vibrate'

const CelebrationContext = createContext(null)

export function CelebrationProvider({ children }) {
  const [active, setActive] = useState(false)
  const [celebrationKey, setCelebrationKey] = useState(0)

  const triggerCelebration = useCallback(() => {
    vibrate('celebration')
    setActive(true)
    setCelebrationKey(k => k + 1)
    setTimeout(() => setActive(false), 2200)
  }, [])

  return (
    <CelebrationContext.Provider value={{ active, celebrationKey, triggerCelebration }}>
      {children}
    </CelebrationContext.Provider>
  )
}

export function useCelebration() {
  const ctx = useContext(CelebrationContext)
  if (!ctx) throw new Error('useCelebration must be used within CelebrationProvider')
  return ctx
}
