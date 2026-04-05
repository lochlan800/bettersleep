import React, { createContext, useContext, useState, useCallback } from 'react'

const CelebrationContext = createContext(null)

export function CelebrationProvider({ children }) {
  const [active, setActive] = useState(false)
  const [celebrationKey, setCelebrationKey] = useState(0)
  const [confettiActive, setConfettiActive] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)

  const triggerCelebration = useCallback(() => {
    setActive(true)
    setCelebrationKey(k => k + 1)
    setTimeout(() => setActive(false), 2200)
  }, [])

  const triggerConfetti = useCallback(() => {
    setConfettiActive(true)
    setConfettiKey(k => k + 1)
    setTimeout(() => setConfettiActive(false), 3500)
  }, [])

  return (
    <CelebrationContext.Provider value={{
      active, celebrationKey, triggerCelebration,
      confettiActive, confettiKey, triggerConfetti,
    }}>
      {children}
    </CelebrationContext.Provider>
  )
}

export function useCelebration() {
  const ctx = useContext(CelebrationContext)
  if (!ctx) throw new Error('useCelebration must be used within CelebrationProvider')
  return ctx
}
