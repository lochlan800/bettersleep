import { useMemo } from 'react'
import { useCelebration } from '../../context/CelebrationContext'

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#eab308', '#ec4899', '#a855f7', '#f97316', '#14b8a6']

function ConfettiAnimation() {
  const pieces = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      width: 6 + Math.random() * 6,
      height: 8 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 2,
      rotation: Math.random() * 360,
      wobble: -20 + Math.random() * 40,
    })),
  [])

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute confetti-piece"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: `${p.width}px`,
            height: `${p.height}px`,
            backgroundColor: p.color,
            borderRadius: '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--wobble': `${p.wobble}px`,
            '--rotation': `${p.rotation}deg`,
          }}
        />
      ))}

      <style>{`
        .confetti-piece {
          animation: confettiFall var(--duration, 3s) ease-in forwards;
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translateY(25vh) translateX(var(--wobble)) rotate(calc(var(--rotation) * 0.5));
          }
          50% {
            transform: translateY(50vh) translateX(calc(var(--wobble) * -0.5)) rotate(var(--rotation));
          }
          75% {
            transform: translateY(75vh) translateX(var(--wobble)) rotate(calc(var(--rotation) * 1.5));
            opacity: 0.7;
          }
          100% {
            transform: translateY(110vh) translateX(calc(var(--wobble) * -1)) rotate(calc(var(--rotation) * 2));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default function ConfettiRain() {
  const { confettiActive, confettiKey } = useCelebration()

  if (!confettiActive) return null

  return <ConfettiAnimation key={confettiKey} />
}
