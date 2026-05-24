import { useRef, useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageTransition({ children }) {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [phase, setPhase] = useState('idle')
  const prevKey = useRef(location.key)
  const timeoutRef = useRef(null)

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    if (location.key !== prevKey.current) {
      prevKey.current = location.key
      cleanup()
      setPhase('flip-out')
      timeoutRef.current = setTimeout(() => {
        setDisplayChildren(children)
        setPhase('flip-in')
        window.scrollTo(0, 0)
        timeoutRef.current = setTimeout(() => {
          setPhase('idle')
        }, 300)
      }, 300)
    } else {
      setDisplayChildren(children)
    }
    return cleanup
  }, [location.key, children, cleanup])

  let className = 'page-transition'
  if (phase === 'flip-out') className += ' page-flip-out'
  if (phase === 'flip-in') className += ' page-flip-in'

  return (
    <div className="page-transition-wrapper">
      <div className={className}>
        {displayChildren}
      </div>
    </div>
  )
}
