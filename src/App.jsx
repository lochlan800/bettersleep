import { useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { CelebrationProvider } from './context/CelebrationContext'
import AppShell from './components/layout/AppShell'
import SplashScreen from './components/layout/SplashScreen'
import CelebrationOverlay from './components/ui/CelebrationOverlay'
import ConfettiRain from './components/ui/ConfettiRain'
import DashboardPage from './components/dashboard/DashboardPage'
import TrainingPage from './components/training/TrainingPage'
import SleepPage from './components/sleep/SleepPage'
import NutritionPage from './components/nutrition/NutritionPage'
import RecoveryPage from './components/recovery/RecoveryPage'
import GuidePage from './components/guide/GuidePage'
import MindfulnessPage from './components/mindfulness/MindfulnessPage'
import MealPlannerPage from './components/nutrition/MealPlannerPage'
import CompetitionsPage from './components/competitions/CompetitionsPage'
import GoalsPage from './components/goals/GoalsPage'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const handleSplashDone = useCallback(() => setShowSplash(false), [])

  return (
    <AppProvider>
      <CelebrationProvider>
      {showSplash && <SplashScreen onFinished={handleSplashDone} />}
      <CelebrationOverlay />
      <ConfettiRain />
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
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/guide" element={<GuidePage />} />
        </Routes>
      </AppShell>
      </CelebrationProvider>
    </AppProvider>
  )
}
