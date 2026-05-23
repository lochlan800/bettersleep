import { useApp } from '../../context/AppContext'
import IceHeatRecommendation from './IceHeatRecommendation'
import RestDayPlanner from './RestDayPlanner'
import StretchingRoutine from './StretchingRoutine'
import FoamRollingProtocol from './FoamRollingProtocol'
import Card from '../ui/Card'

export default function RecoveryPage() {
  const { settings } = useApp()
  const simple = settings.simpleMode

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Active Recovery</h2>

      {!simple && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <IceHeatRecommendation />
          <RestDayPlanner />
        </div>
      )}

      <Card title="Stretching Routine" subtitle={simple ? undefined : "Targeted for your recent training"}>
        <StretchingRoutine />
      </Card>

      {!simple && (
        <Card title="Foam Rolling" subtitle="Release muscle tension">
          <FoamRollingProtocol />
        </Card>
      )}
    </div>
  )
}
