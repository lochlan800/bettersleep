import { useState, useEffect } from 'react'

export default function SplashScreen({ onFinished }) {
  const [phase, setPhase] = useState('enter') // enter → hold → exit → done

  useEffect(() => {
    // Icon flies in
    const holdTimer = setTimeout(() => setPhase('hold'), 800)
    // Longer pause to enjoy the screen
    const exitTimer = setTimeout(() => setPhase('exit'), 4000)
    // Swoosh away
    const doneTimer = setTimeout(() => onFinished(), 4800)

    return () => {
      clearTimeout(holdTimer)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [onFinished])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-teal-700 transition-all duration-700 ease-in-out ${
        phase === 'exit' ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
    >
      {/* Running icon */}
      <div
        className={`transition-all duration-600 ease-out ${
          phase === 'enter'
            ? '-translate-x-[100vw] opacity-0'
            : 'translate-x-0 opacity-100'
        }`}
      >
        <span className="text-[96px] leading-none drop-shadow-lg" role="img" aria-label="runner">🏃</span>
      </div>

      {/* App name */}
      <div
        className={`mt-6 transition-all duration-500 delay-200 ${
          phase === 'enter'
            ? 'opacity-0 translate-y-4'
            : phase === 'exit'
              ? 'opacity-0 -translate-y-4'
              : 'opacity-100 translate-y-0'
        }`}
      >
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          MyRunningDiary
        </h1>
        <p className="text-center text-white/70 text-sm mt-2 font-medium">
          Train smarter. Recover better.
        </p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/60"
            style={{
              animation: 'splash-bounce 1s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes splash-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
