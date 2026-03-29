export default function ProgressBar({ value, max, label, showValue = true, className = '' }) {
  const percent = Math.min((value / max) * 100, 100)

  const getColor = () => {
    if (percent >= 80) return 'bg-primary-500'
    if (percent >= 50) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{label}</span>}
          {showValue && <span className="text-sm text-surface-500 dark:text-surface-400">{value} / {max}</span>}
        </div>
      )}
      <div className="w-full h-2.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getColor()}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
