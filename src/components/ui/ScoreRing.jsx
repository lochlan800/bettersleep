export default function ScoreRing({ score, size = 120, strokeWidth = 8, label = 'Score', color: colorOverride }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getColor = (s) => {
    if (s >= 80) return '#14b8a6'
    if (s >= 60) return '#eab308'
    if (s >= 40) return '#f97316'
    return '#ef4444'
  }

  const color = colorOverride || getColor(score)

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-200 dark:text-surface-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className={`font-bold text-surface-900 dark:text-surface-50 ${size <= 60 ? 'text-xs' : 'text-2xl'}`}>{Math.round(score)}</span>
        {label && <span className={`text-surface-500 dark:text-surface-400 ${size <= 60 ? 'text-[8px]' : 'text-xs'}`}>{label}</span>}
      </div>
    </div>
  )
}
