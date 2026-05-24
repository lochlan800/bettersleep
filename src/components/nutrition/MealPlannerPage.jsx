import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { Search, Plus, X, Apple, Beef, Wheat, Droplets, Flame } from 'lucide-react'
import Card from '../ui/Card'

const FOOD_DATABASE = [
  { name: 'Banana', groups: ['Fruit'], nutrients: { carbs: 27, protein: 1, fat: 0, fibre: 3, iron: 0.3, calcium: 5, vitC: 10 } },
  { name: 'Apple', groups: ['Fruit'], nutrients: { carbs: 25, protein: 0, fat: 0, fibre: 4, iron: 0.2, calcium: 6, vitC: 8 } },
  { name: 'Blueberries', groups: ['Fruit'], nutrients: { carbs: 14, protein: 1, fat: 0, fibre: 2, iron: 0.3, calcium: 6, vitC: 10 } },
  { name: 'Strawberries', groups: ['Fruit'], nutrients: { carbs: 8, protein: 1, fat: 0, fibre: 2, iron: 0.4, calcium: 16, vitC: 59 } },
  { name: 'Orange', groups: ['Fruit'], nutrients: { carbs: 12, protein: 1, fat: 0, fibre: 2, iron: 0.1, calcium: 40, vitC: 70 } },
  { name: 'Grapes', groups: ['Fruit'], nutrients: { carbs: 18, protein: 1, fat: 0, fibre: 1, iron: 0.4, calcium: 10, vitC: 4 } },
  { name: 'Mango', groups: ['Fruit'], nutrients: { carbs: 25, protein: 1, fat: 0, fibre: 3, iron: 0.2, calcium: 11, vitC: 36 } },
  { name: 'Pineapple', groups: ['Fruit'], nutrients: { carbs: 13, protein: 0, fat: 0, fibre: 1, iron: 0.3, calcium: 13, vitC: 48 } },
  { name: 'Spinach', groups: ['Vegetables'], nutrients: { carbs: 4, protein: 3, fat: 0, fibre: 2, iron: 2.7, calcium: 99, vitC: 28 } },
  { name: 'Broccoli', groups: ['Vegetables'], nutrients: { carbs: 7, protein: 3, fat: 0, fibre: 3, iron: 0.7, calcium: 47, vitC: 89 } },
  { name: 'Carrots', groups: ['Vegetables'], nutrients: { carbs: 10, protein: 1, fat: 0, fibre: 3, iron: 0.3, calcium: 33, vitC: 6 } },
  { name: 'Sweet potato', groups: ['Vegetables'], nutrients: { carbs: 20, protein: 2, fat: 0, fibre: 3, iron: 0.6, calcium: 30, vitC: 2 } },
  { name: 'Peppers', groups: ['Vegetables'], nutrients: { carbs: 6, protein: 1, fat: 0, fibre: 2, iron: 0.4, calcium: 7, vitC: 128 } },
  { name: 'Tomatoes', groups: ['Vegetables'], nutrients: { carbs: 4, protein: 1, fat: 0, fibre: 1, iron: 0.3, calcium: 10, vitC: 14 } },
  { name: 'Cucumber', groups: ['Vegetables'], nutrients: { carbs: 4, protein: 1, fat: 0, fibre: 1, iron: 0.3, calcium: 16, vitC: 3 } },
  { name: 'Peas', groups: ['Vegetables', 'Protein'], nutrients: { carbs: 14, protein: 5, fat: 0, fibre: 5, iron: 1.5, calcium: 25, vitC: 40 } },
  { name: 'Chicken breast', groups: ['Protein'], nutrients: { carbs: 0, protein: 31, fat: 4, fibre: 0, iron: 1.0, calcium: 15, vitC: 0 } },
  { name: 'Eggs', groups: ['Protein', 'Dairy'], nutrients: { carbs: 1, protein: 13, fat: 11, fibre: 0, iron: 1.8, calcium: 56, vitC: 0 } },
  { name: 'Salmon', groups: ['Protein'], nutrients: { carbs: 0, protein: 25, fat: 13, fibre: 0, iron: 0.8, calcium: 12, vitC: 0 } },
  { name: 'Tuna', groups: ['Protein'], nutrients: { carbs: 0, protein: 26, fat: 1, fibre: 0, iron: 1.0, calcium: 10, vitC: 0 } },
  { name: 'Beef mince', groups: ['Protein'], nutrients: { carbs: 0, protein: 26, fat: 15, fibre: 0, iron: 2.6, calcium: 18, vitC: 0 } },
  { name: 'Turkey', groups: ['Protein'], nutrients: { carbs: 0, protein: 29, fat: 2, fibre: 0, iron: 1.4, calcium: 11, vitC: 0 } },
  { name: 'Beans', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 22, protein: 8, fat: 1, fibre: 7, iron: 2.1, calcium: 40, vitC: 2 } },
  { name: 'Lentils', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 20, protein: 9, fat: 0, fibre: 8, iron: 3.3, calcium: 19, vitC: 2 } },
  { name: 'Tofu', groups: ['Protein'], nutrients: { carbs: 2, protein: 8, fat: 5, fibre: 1, iron: 5.4, calcium: 350, vitC: 0 } },
  { name: 'Rice', groups: ['Grains'], nutrients: { carbs: 45, protein: 4, fat: 0, fibre: 1, iron: 0.4, calcium: 10, vitC: 0 } },
  { name: 'Pasta', groups: ['Grains'], nutrients: { carbs: 43, protein: 8, fat: 1, fibre: 2, iron: 1.3, calcium: 7, vitC: 0 } },
  { name: 'Bread (wholemeal)', groups: ['Grains'], nutrients: { carbs: 20, protein: 4, fat: 1, fibre: 3, iron: 1.0, calcium: 20, vitC: 0 } },
  { name: 'Oats', groups: ['Grains'], nutrients: { carbs: 27, protein: 5, fat: 3, fibre: 4, iron: 1.7, calcium: 20, vitC: 0 } },
  { name: 'Cereal', groups: ['Grains'], nutrients: { carbs: 35, protein: 3, fat: 1, fibre: 3, iron: 4.0, calcium: 15, vitC: 0 } },
  { name: 'Wrap/tortilla', groups: ['Grains'], nutrients: { carbs: 30, protein: 4, fat: 3, fibre: 2, iron: 1.2, calcium: 40, vitC: 0 } },
  { name: 'Milk', groups: ['Dairy'], nutrients: { carbs: 12, protein: 8, fat: 8, fibre: 0, iron: 0.1, calcium: 300, vitC: 2 } },
  { name: 'Yoghurt', groups: ['Dairy'], nutrients: { carbs: 12, protein: 10, fat: 4, fibre: 0, iron: 0.1, calcium: 200, vitC: 1 } },
  { name: 'Cheese', groups: ['Dairy'], nutrients: { carbs: 1, protein: 7, fat: 9, fibre: 0, iron: 0.2, calcium: 200, vitC: 0 } },
  { name: 'Butter', groups: ['Dairy'], nutrients: { carbs: 0, protein: 0, fat: 12, fibre: 0, iron: 0, calcium: 3, vitC: 0 } },
  { name: 'Peanut butter', groups: ['Protein'], nutrients: { carbs: 6, protein: 8, fat: 16, fibre: 2, iron: 0.6, calcium: 14, vitC: 0 } },
  { name: 'Almonds', groups: ['Protein'], nutrients: { carbs: 6, protein: 6, fat: 14, fibre: 4, iron: 1.0, calcium: 70, vitC: 0 } },
  { name: 'Walnuts', groups: ['Protein'], nutrients: { carbs: 3, protein: 4, fat: 18, fibre: 2, iron: 0.8, calcium: 28, vitC: 0 } },
  { name: 'Cashews', groups: ['Protein'], nutrients: { carbs: 9, protein: 5, fat: 13, fibre: 1, iron: 1.9, calcium: 12, vitC: 0 } },
  { name: 'Pistachios', groups: ['Protein'], nutrients: { carbs: 8, protein: 6, fat: 13, fibre: 3, iron: 1.1, calcium: 30, vitC: 1 } },
  { name: 'Hazelnuts', groups: ['Protein'], nutrients: { carbs: 5, protein: 4, fat: 17, fibre: 3, iron: 1.3, calcium: 32, vitC: 2 } },
  { name: 'Brazil nuts', groups: ['Protein'], nutrients: { carbs: 3, protein: 4, fat: 19, fibre: 2, iron: 0.7, calcium: 45, vitC: 0 } },
  { name: 'Pecans', groups: ['Protein'], nutrients: { carbs: 4, protein: 3, fat: 20, fibre: 3, iron: 0.7, calcium: 20, vitC: 0 } },
  { name: 'Macadamia nuts', groups: ['Protein'], nutrients: { carbs: 4, protein: 2, fat: 21, fibre: 2, iron: 1.1, calcium: 24, vitC: 0 } },
  { name: 'Pine nuts', groups: ['Protein'], nutrients: { carbs: 4, protein: 4, fat: 19, fibre: 1, iron: 1.6, calcium: 5, vitC: 0 } },
  { name: 'Pumpkin seeds', groups: ['Protein'], nutrients: { carbs: 4, protein: 8, fat: 14, fibre: 2, iron: 2.5, calcium: 14, vitC: 1 } },
  { name: 'Sunflower seeds', groups: ['Protein'], nutrients: { carbs: 6, protein: 6, fat: 14, fibre: 2, iron: 1.5, calcium: 22, vitC: 0 } },
  { name: 'Chia seeds', groups: ['Protein'], nutrients: { carbs: 12, protein: 5, fat: 9, fibre: 10, iron: 2.2, calcium: 179, vitC: 0 } },
  { name: 'Flaxseeds', groups: ['Protein'], nutrients: { carbs: 8, protein: 5, fat: 12, fibre: 8, iron: 1.6, calcium: 72, vitC: 0 } },
  { name: 'Sesame seeds', groups: ['Protein'], nutrients: { carbs: 7, protein: 5, fat: 14, fibre: 3, iron: 4.1, calcium: 277, vitC: 0 } },
  { name: 'Hemp seeds', groups: ['Protein'], nutrients: { carbs: 2, protein: 10, fat: 14, fibre: 1, iron: 2.4, calcium: 21, vitC: 0 } },
  { name: 'Poppy seeds', groups: ['Protein'], nutrients: { carbs: 8, protein: 5, fat: 13, fibre: 5, iron: 2.7, calcium: 400, vitC: 0 } },
  { name: 'Mixed nuts', groups: ['Protein'], nutrients: { carbs: 6, protein: 5, fat: 16, fibre: 3, iron: 1.0, calcium: 40, vitC: 0 } },
  { name: 'Coconut (desiccated)', groups: ['Protein'], nutrients: { carbs: 6, protein: 2, fat: 18, fibre: 5, iron: 1.0, calcium: 8, vitC: 0 } },
  { name: 'Honey', groups: ['Grains'], nutrients: { carbs: 17, protein: 0, fat: 0, fibre: 0, iron: 0.1, calcium: 1, vitC: 0 } },
  { name: 'Avocado', groups: ['Fruit', 'Vegetables'], nutrients: { carbs: 9, protein: 2, fat: 15, fibre: 7, iron: 0.6, calcium: 12, vitC: 10 } },
  { name: 'Potato', groups: ['Vegetables', 'Grains'], nutrients: { carbs: 17, protein: 2, fat: 0, fibre: 2, iron: 0.8, calcium: 12, vitC: 20 } },
  { name: 'Fish fingers', groups: ['Protein', 'Grains'], nutrients: { carbs: 15, protein: 12, fat: 8, fibre: 1, iron: 0.5, calcium: 20, vitC: 0 } },
  { name: 'Chips/fries', groups: ['Grains'], nutrients: { carbs: 30, protein: 3, fat: 15, fibre: 3, iron: 0.6, calcium: 10, vitC: 5 } },
  { name: 'Pizza', groups: ['Grains', 'Dairy', 'Protein'], nutrients: { carbs: 33, protein: 12, fat: 10, fibre: 2, iron: 1.5, calcium: 150, vitC: 2 } },
  { name: 'Soup', groups: ['Vegetables'], nutrients: { carbs: 10, protein: 3, fat: 2, fibre: 2, iron: 0.5, calcium: 20, vitC: 5 } },
  { name: 'Smoothie', groups: ['Fruit', 'Dairy'], nutrients: { carbs: 30, protein: 5, fat: 3, fibre: 3, iron: 0.5, calcium: 100, vitC: 30 } },
  { name: 'Protein shake', groups: ['Protein', 'Dairy'], nutrients: { carbs: 5, protein: 25, fat: 2, fibre: 1, iron: 2.0, calcium: 150, vitC: 0 } },
  { name: 'Granola bar', groups: ['Grains'], nutrients: { carbs: 25, protein: 3, fat: 6, fibre: 2, iron: 1.0, calcium: 20, vitC: 0 } },
  { name: 'Chocolate', groups: [], nutrients: { carbs: 25, protein: 2, fat: 14, fibre: 2, iron: 1.2, calcium: 30, vitC: 0 } },
  { name: 'Crisps', groups: [], nutrients: { carbs: 15, protein: 2, fat: 10, fibre: 1, iron: 0.3, calcium: 5, vitC: 3 } },
  { name: 'Biscuits', groups: ['Grains'], nutrients: { carbs: 20, protein: 2, fat: 8, fibre: 1, iron: 0.5, calcium: 10, vitC: 0 } },
]

const FOOD_GROUPS = [
  { name: 'Fruit', color: '#f59e0b', icon: '🍎', target: 2 },
  { name: 'Vegetables', color: '#10b981', icon: '🥦', target: 3 },
  { name: 'Protein', color: '#ef4444', icon: '🥩', target: 2 },
  { name: 'Grains', color: '#8b5cf6', icon: '🌾', target: 3 },
  { name: 'Dairy', color: '#3b82f6', icon: '🥛', target: 2 },
]

const NUTRIENT_TARGETS = {
  protein: { target: 60, unit: 'g', label: 'Protein' },
  carbs: { target: 250, unit: 'g', label: 'Carbs' },
  fat: { target: 70, unit: 'g', label: 'Fat' },
  fibre: { target: 30, unit: 'g', label: 'Fibre' },
  iron: { target: 18, unit: 'mg', label: 'Iron' },
  calcium: { target: 1000, unit: 'mg', label: 'Calcium' },
  vitC: { target: 80, unit: 'mg', label: 'Vitamin C' },
}

function getSuggestions(todayFoods) {
  const groupCounts = {}
  FOOD_GROUPS.forEach(g => { groupCounts[g.name] = 0 })
  todayFoods.forEach(f => {
    f.groups.forEach(g => { groupCounts[g] = (groupCounts[g] || 0) + 1 })
  })

  const totals = { carbs: 0, protein: 0, fat: 0, fibre: 0, iron: 0, calcium: 0, vitC: 0 }
  todayFoods.forEach(f => {
    Object.keys(totals).forEach(k => { totals[k] += f.nutrients[k] || 0 })
  })

  const missingGroups = FOOD_GROUPS.filter(g => groupCounts[g.name] < g.target)
  const lowNutrients = Object.entries(NUTRIENT_TARGETS)
    .filter(([key, { target }]) => totals[key] < target * 0.5)
    .map(([key, info]) => ({ key, ...info, current: totals[key] }))

  const eatenNames = new Set(todayFoods.map(f => f.name))
  const suggestions = []

  missingGroups.forEach(group => {
    const options = FOOD_DATABASE.filter(f =>
      f.groups.includes(group.name) && !eatenNames.has(f.name)
    )
    if (options.length > 0) {
      const pick = options[Math.floor(Math.random() * Math.min(3, options.length))]
      if (!suggestions.find(s => s.name === pick.name)) {
        suggestions.push({ ...pick, reason: `Add more ${group.name.toLowerCase()}` })
      }
    }
  })

  lowNutrients.forEach(({ key, label }) => {
    const options = FOOD_DATABASE.filter(f =>
      f.nutrients[key] > 2 && !eatenNames.has(f.name) && !suggestions.find(s => s.name === f.name)
    ).sort((a, b) => b.nutrients[key] - a.nutrients[key])
    if (options.length > 0) {
      suggestions.push({ ...options[0], reason: `Boost your ${label.toLowerCase()}` })
    }
  })

  return { missingGroups, lowNutrients, suggestions: suggestions.slice(0, 6), groupCounts, totals }
}

export default function MealPlannerPage() {
  const { addFoodEntry, removeFoodEntry, getTodayFoodLog } = useApp()
  const [search, setSearch] = useState('')
  const [showResults, setShowResults] = useState(false)

  const todayFoods = getTodayFoodLog()

  const { missingGroups, lowNutrients, suggestions, groupCounts, totals } = useMemo(
    () => getSuggestions(todayFoods.map(e => FOOD_DATABASE.find(f => f.name === e.name) || { name: e.name, groups: e.groups || [], nutrients: e.nutrients || {} })),
    [todayFoods]
  )

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(q)).slice(0, 8)
  }, [search])

  const handleAdd = (food) => {
    addFoodEntry({ name: food.name, groups: food.groups, nutrients: food.nutrients })
    setSearch('')
    setShowResults(false)
  }

  const handleCustomAdd = () => {
    if (!search.trim()) return
    addFoodEntry({ name: search.trim(), groups: [], nutrients: { carbs: 0, protein: 0, fat: 0, fibre: 0, iron: 0, calcium: 0, vitC: 0 } })
    setSearch('')
    setShowResults(false)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Food Log</h2>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Log what you eat, get suggestions for what's missing</p>
      </div>

      {/* Search input */}
      <Card>
        <div className="relative">
          <div className="flex items-center gap-2 border border-surface-300 dark:border-surface-600 rounded-lg px-3 py-2 bg-white dark:bg-surface-700">
            <Search size={18} className="text-surface-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowResults(true) }}
              onFocus={() => setShowResults(true)}
              placeholder="What did you eat? (e.g. banana, chicken...)"
              className="flex-1 bg-transparent outline-none text-sm text-surface-900 dark:text-surface-50 placeholder:text-surface-400"
            />
            {search && (
              <button onClick={() => { setSearch(''); setShowResults(false) }}>
                <X size={16} className="text-surface-400" />
              </button>
            )}
          </div>

          {showResults && search.trim() && (
            <div className="absolute z-20 mt-1 w-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map(food => (
                <button
                  key={food.name}
                  onClick={() => handleAdd(food)}
                  className="w-full px-3 py-2.5 text-left hover:bg-surface-50 dark:hover:bg-surface-700 flex items-center justify-between border-b border-surface-100 dark:border-surface-700 last:border-0"
                >
                  <div>
                    <span className="text-sm font-medium text-surface-900 dark:text-surface-50">{food.name}</span>
                    <div className="flex gap-1 mt-0.5">
                      {food.groups.map(g => (
                        <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-100 dark:bg-surface-600 text-surface-500 dark:text-surface-400">{g}</span>
                      ))}
                    </div>
                  </div>
                  <Plus size={16} className="text-primary-500" />
                </button>
              ))}
              {searchResults.length === 0 && (
                <button
                  onClick={handleCustomAdd}
                  className="w-full px-3 py-2.5 text-left hover:bg-surface-50 dark:hover:bg-surface-700 flex items-center gap-2"
                >
                  <Plus size={16} className="text-primary-500" />
                  <span className="text-sm text-surface-700 dark:text-surface-300">Add "{search}" as custom food</span>
                </button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Today's food */}
      {todayFoods.length > 0 && (
        <Card>
          <h3 className="text-sm font-bold text-surface-800 dark:text-surface-200 mb-3">Today's food</h3>
          <div className="flex flex-wrap gap-2">
            {todayFoods.map(entry => (
              <div key={entry.id} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-100 dark:bg-surface-700 rounded-full">
                <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{entry.name}</span>
                <button onClick={() => removeFoodEntry(entry.id)} className="text-surface-400 hover:text-red-500">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Food groups progress */}
      <Card>
        <h3 className="text-sm font-bold text-surface-800 dark:text-surface-200 mb-3">Food Groups</h3>
        <div className="space-y-2.5">
          {FOOD_GROUPS.map(group => {
            const count = groupCounts[group.name] || 0
            const pct = Math.min(100, (count / group.target) * 100)
            return (
              <div key={group.name} className="flex items-center gap-3">
                <span className="text-lg w-7">{group.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-0.5">
                    <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{group.name}</span>
                    <span className="text-xs text-surface-500">{count}/{group.target}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? '#10b981' : group.color }}
                    />
                  </div>
                </div>
                {pct >= 100 && <span className="text-emerald-500 text-xs font-bold">Done</span>}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Nutrient breakdown */}
      <Card>
        <h3 className="text-sm font-bold text-surface-800 dark:text-surface-200 mb-3">Nutrients</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(NUTRIENT_TARGETS).map(([key, { target, unit, label }]) => {
            const current = Math.round(totals[key] || 0)
            const pct = Math.min(100, (current / target) * 100)
            const low = pct < 50
            return (
              <div key={key} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-surface-600 dark:text-surface-400">{label}</span>
                    <span className={`text-[10px] font-medium ${low ? 'text-red-500' : 'text-emerald-500'}`}>{current}{unit}</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: low ? '#ef4444' : '#10b981' }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Suggestions */}
      {(missingGroups.length > 0 || lowNutrients.length > 0) && (
        <Card>
          <h3 className="text-sm font-bold text-surface-800 dark:text-surface-200 mb-1">Suggestions</h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 mb-3">Based on what you're missing today</p>
          <div className="space-y-2.5">
            {suggestions.map(s => (
              <button
                key={s.name}
                onClick={() => handleAdd(s)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-surface-50 dark:bg-surface-700/50 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <div className="text-left">
                  <span className="text-sm font-medium text-surface-800 dark:text-surface-200">{s.name}</span>
                  <p className="text-[11px] text-surface-500 dark:text-surface-400">{s.reason}</p>
                </div>
                <Plus size={16} className="text-primary-500 shrink-0" />
              </button>
            ))}
          </div>
        </Card>
      )}

      {missingGroups.length === 0 && lowNutrients.length === 0 && todayFoods.length > 0 && (
        <div className="text-center py-4">
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Great job! You've hit all your food groups and nutrients today.</p>
        </div>
      )}

      {todayFoods.length === 0 && (
        <div className="text-center py-8">
          <p className="text-surface-400 text-sm">Start logging what you eat to get personalised suggestions</p>
        </div>
      )}
    </div>
  )
}
