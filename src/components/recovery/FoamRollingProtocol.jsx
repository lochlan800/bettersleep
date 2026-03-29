import foamRollingData from '../../data/foamRolling'
import Card from '../ui/Card'

export default function FoamRollingProtocol() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {foamRollingData.map(item => (
        <Card key={item.id} className="!p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-surface-900 dark:text-surface-50">{item.name}</h4>
            <span className="text-xs text-surface-500 bg-surface-100 dark:bg-surface-700 px-2 py-0.5 rounded-full">
              {item.sets} × {item.durationSeconds}s
            </span>
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">{item.technique}</p>
          {item.notes && <p className="text-xs text-surface-500 dark:text-surface-500 italic">{item.notes}</p>}
          <div className="mt-2">
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{item.targetArea}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
