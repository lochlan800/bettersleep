import { useEffect } from 'react'
import { useCelebration } from '../../context/CelebrationContext'
import { vibrate } from '../../utils/vibrate'

export default function CelebrationOverlay() {
  const { active } = useCelebration()

  useEffect(() => {
    if (active) {
      vibrate('celebration')
      return () => { try { window.navigator.vibrate(0) } catch {} }
    }
  }, [active])

  if (!active) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
      {/* Backdrop flash */}
      <div className="absolute inset-0 celebration-flash" />

      {/* Swirling star */}
      <span className="celebration-swirl absolute text-6xl">⭐</span>

      {/* Explosion particles */}
      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          className="celebration-particle absolute text-2xl"
          style={{
            '--angle': `${i * 45}deg`,
            animationDelay: '0.5s',
          }}
        >
          ✨
        </span>
      ))}

      {/* Thumbs up */}
      <span className="celebration-thumbsup absolute text-7xl">👍</span>

      <style>{`
        .celebration-flash {
          background: rgba(20, 184, 166, 0.15);
          animation: celebFlash 0.6s ease-out forwards;
        }

        @keyframes celebFlash {
          0% { opacity: 0; }
          20% { opacity: 1; }
          100% { opacity: 0; }
        }

        .celebration-swirl {
          animation: celebSwirl 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes celebSwirl {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.3) rotate(360deg);
            opacity: 1;
          }
          70% {
            transform: scale(1.5) rotate(540deg);
            opacity: 1;
          }
          100% {
            transform: scale(3) rotate(720deg);
            opacity: 0;
          }
        }

        .celebration-particle {
          animation: celebParticle 0.7s ease-out forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }

        @keyframes celebParticle {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform:
              translate(
                calc(cos(var(--angle)) * 120px),
                calc(sin(var(--angle)) * 120px)
              )
              scale(0.3);
            opacity: 0;
          }
        }

        .celebration-thumbsup {
          animation: celebThumbsUp 1.0s ease-out forwards;
          animation-delay: 1.1s;
          opacity: 0;
        }

        @keyframes celebThumbsUp {
          0% {
            transform: scale(0) rotate(-20deg);
            opacity: 0;
          }
          40% {
            transform: scale(1.4) rotate(10deg);
            opacity: 1;
          }
          60% {
            transform: scale(1.2) rotate(-5deg);
            opacity: 1;
          }
          75% {
            transform: scale(1.3) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(0.8) rotate(0deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
