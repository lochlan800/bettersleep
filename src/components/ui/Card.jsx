export default function Card({ children, className = '', title, subtitle }) {
  return (
    <div className={`bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-5 ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">{title}</h3>
          {subtitle && <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
