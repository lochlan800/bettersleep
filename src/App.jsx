import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppShell from './components/layout/AppShell'
import DashboardPage from './components/dashboard/DashboardPage'
import TrainingPage from './components/training/TrainingPage'
import SleepPage from './components/sleep/SleepPage'
import NutritionPage from './components/nutrition/NutritionPage'
import RecoveryPage from './components/recovery/RecoveryPage'
import GuidePage from './components/guide/GuidePage'
import MindfulnessPage from './components/mindfulness/MindfulnessPage'
import MealPlannerPage from './components/nutrition/MealPlannerPage'
import CompetitionsPage from './components/competitions/CompetitionsPage'

export default function App() {
  return (
    <AppProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/sleep" element={<SleepPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/meals" element={<MealPlannerPage />} />
          <Route path="/recovery" element={<RecoveryPage />} />
          <Route path="/mindfulness" element={<MindfulnessPage />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/guide" element={<GuidePage />} />
        </Routes>
      </AppShell>
    </AppProvider>
  )
}
