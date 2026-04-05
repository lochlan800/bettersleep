import { useEffect } from 'react'
import { useCelebration } from '../../context/CelebrationContext'
import { vibrate } from '../../utils/vibrate'

function CelebrationAnimation() {
  useEffect(() => {
    vibrate('celebration')
    return () => { try { window.navigator.vibrate(0) } catch {} }
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-end justify-end p-6 pb-24">
      {/* Swirling star */}
      <span className="celebration-swirl absolute text-3xl">⭐</span>

      {/* Explosion particles */}
      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          className="celebration-particle absolute text-base"
          style={{
            '--angle': `${i * 45}deg`,
            animationDelay: '0.5s',
          }}
        >
          ✨
        </span>
      ))}

      {/* Thumbs up */}
      <span className="celebration-thumbsup absolute text-4xl">👍</span>

      <style>{`
        .celebration-swirl {
          animation: celebSwirl 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes celebSwirl {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(360deg);
            opacity: 1;
          }
          70% {
            transform: scale(1.2) rotate(540deg);
            opacity: 1;
          }
          100% {
            transform: scale(1.5) rotate(720deg);
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
                calc(cos(var(--angle)) * 60px),
                calc(sin(var(--angle)) * 60px)
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
            transform: scale(1.0) rotate(10deg);
            opacity: 1;
          }
          60% {
            transform: scale(0.85) rotate(-5deg);
            opacity: 1;
          }
          75% {
            transform: scale(0.95) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(0.6) rotate(0deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default function CelebrationOverlay() {
  const { active, celebrationKey } = useCelebration()

  if (!active) return null

  return <CelebrationAnimation key={celebrationKey} />
}
