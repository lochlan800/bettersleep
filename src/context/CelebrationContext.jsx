import React, { createContext, useContext, useState, useCallback } from 'react'

const CelebrationContext = createContext(null)

export function CelebrationProvider({ children }) {
  const [active, setActive] = useState(false)

  const triggerCelebration = useCallback(() => {
    setActive(true)
    setTimeout(() => setActive(false), 2200)
  }, [])

  return (
    <CelebrationContext.Provider value={{ active, triggerCelebration }}>
      {children}
    </CelebrationContext.Provider>
  )
}

export function useCelebration() {
  const ctx = useContext(CelebrationContext)
  if (!ctx) throw new Error('useCelebration must be used within CelebrationProvider')
  return ctx
}
