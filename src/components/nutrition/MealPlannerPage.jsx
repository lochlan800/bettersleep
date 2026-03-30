import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../../context/AppContext'
import { ChevronDown, RotateCw } from 'lucide-react'

// Meal data
const breakfasts = [
  {
    id: 'bf1',
    name: 'Spinach, Banana & Berry Iron Bowl',
    ingredients: ['80g rolled oats (3.4mg iron)', '1 sliced banana', 'Handful of fresh blueberries', 'Handful of fresh strawberries, sliced', 'Large handful of fresh spinach, wilted (1.6mg iron)', '1 tbsp pumpkin seeds (2.5mg iron)', 'Drizzle of raw honey', 'Splash of whole milk or oat milk'],
    fruitVeg: ['Banana', 'Blueberries', 'Strawberries', 'Spinach'],
    prep: 'Cook oats with milk, wilt spinach into the oats, top with banana, blueberries, strawberries, pumpkin seeds, and honey.',
    macros: { carbs: 64, protein: 16, fat: 14, fibre: 12, iron: 7.5 },
    shopping: { fruit: ['1 banana', '80g blueberries', '80g strawberries'], veg: ['60g spinach'], grains: ['80g rolled oats'], dairy: ['200ml whole milk'], pantry: ['15g pumpkin seeds', '10g raw honey'] }
  },
  {
    id: 'bf2',
    name: 'Avocado, Tomato & Spinach Toast with Seeds',
    ingredients: ['2 slices wholemeal bread (1.8mg iron)', '1/2 ripe avocado, mashed', '2 fresh tomatoes, sliced', 'Large handful of fresh spinach (1.6mg iron)', 'Squeeze of lemon juice', '1 tbsp pumpkin seeds (2.5mg iron)', '1 tbsp hemp seeds (2.0mg iron)'],
    fruitVeg: ['Avocado', 'Tomatoes', 'Spinach'],
    prep: 'Toast bread, layer spinach, spread avocado, add tomatoes, and sprinkle seeds. Lemon juice helps absorb the iron.',
    macros: { carbs: 56, protein: 16, fat: 22, fibre: 14, iron: 7.9 },
    shopping: { fruit: ['1 avocado', '2 tomatoes'], veg: ['60g spinach'], grains: ['2 slices wholemeal bread'], pantry: ['15g pumpkin seeds', '15g hemp seeds', '1 lemon'] }
  },
  {
    id: 'bf3',
    name: 'Berry, Mango & Apricot Overnight Oats',
    ingredients: ['80g rolled oats (3.4mg iron)', '150ml natural yoghurt', 'Handful of fresh raspberries', '1/2 fresh mango, diced', '4 dried apricots, chopped (1.5mg iron)', '1 tbsp chia seeds (1.2mg iron)', '1 tbsp blackstrap molasses (3.6mg iron)'],
    fruitVeg: ['Raspberries', 'Mango'],
    prep: 'Mix oats, yoghurt, chia seeds, and molasses the night before. Top with raspberries, mango, and chopped apricots in the morning.',
    macros: { carbs: 66, protein: 16, fat: 12, fibre: 13, iron: 9.7 },
    shopping: { fruit: ['80g raspberries', '1 mango'], grains: ['80g rolled oats'], dairy: ['150ml natural yoghurt'], pantry: ['30g dried apricots', '10g chia seeds', '15ml blackstrap molasses'] }
  },
  {
    id: 'bf4',
    name: 'Spinach, Tomato & Pepper Egg Scramble on Toast',
    ingredients: ['2 free-range eggs, scrambled (1.2mg iron)', 'Large handful of fresh spinach (1.6mg iron)', '1 fresh tomato, chopped', '1/2 red pepper, diced', '2 slices wholemeal bread (1.8mg iron)', '1 tbsp pumpkin seeds (2.5mg iron)', 'Drizzle of olive oil'],
    fruitVeg: ['Spinach', 'Tomatoes', 'Red Pepper'],
    prep: 'Fry pepper in olive oil, add spinach and tomato, scramble in the eggs. Serve on wholemeal toast with pumpkin seeds.',
    macros: { carbs: 50, protein: 24, fat: 18, fibre: 10, iron: 7.1 },
    shopping: { veg: ['60g spinach', '1 tomato', '1 red pepper'], grains: ['2 slices wholemeal bread'], dairy: ['2 free-range eggs'], pantry: ['15g pumpkin seeds', '10ml olive oil'] }
  },
  {
    id: 'bf5',
    name: 'Apple, Banana & Apricot Porridge',
    ingredients: ['80g rolled oats (3.4mg iron)', '1 apple, grated', '1 sliced banana', '4 dried apricots, chopped (1.5mg iron)', '1 tbsp blackstrap molasses (3.6mg iron)', '1 tbsp pumpkin seeds (2.5mg iron)', '200ml whole milk or water'],
    fruitVeg: ['Apple', 'Banana'],
    prep: 'Cook oats with milk, stir in grated apple and molasses. Top with sliced banana, chopped apricots, and pumpkin seeds.',
    macros: { carbs: 72, protein: 14, fat: 10, fibre: 12, iron: 11.0 },
    shopping: { fruit: ['1 apple', '1 banana'], grains: ['80g rolled oats'], dairy: ['200ml whole milk'], pantry: ['30g dried apricots', '15ml blackstrap molasses', '15g pumpkin seeds'] }
  },
  {
    id: 'bf6',
    name: 'Tropical Spinach Smoothie Bowl',
    ingredients: ['1 frozen banana', '1/2 fresh mango', 'Handful of fresh pineapple chunks', '1 fresh kiwi, sliced (topping)', 'Large handful of fresh spinach (1.6mg iron)', '100ml coconut milk', '2 tbsp hemp seeds (4.0mg iron)'],
    fruitVeg: ['Banana', 'Mango', 'Pineapple', 'Kiwi', 'Spinach'],
    prep: 'Blend banana, mango, pineapple, spinach, and coconut milk until thick. Pour into bowl, top with sliced kiwi and hemp seeds.',
    macros: { carbs: 68, protein: 12, fat: 14, fibre: 11, iron: 5.6 },
    shopping: { fruit: ['1 banana', '1 mango', '100g pineapple', '1 kiwi'], veg: ['60g spinach'], dairy: ['100ml coconut milk'], pantry: ['20g hemp seeds'] }
  },
  {
    id: 'bf7',
    name: 'Buckwheat Pancakes with Berries & Seeds',
    ingredients: ['100g buckwheat flour (2.4mg iron)', '1 free-range egg', '150ml oat milk', 'Handful of fresh blueberries', 'Handful of fresh raspberries', '1 tbsp almond butter (1.0mg iron)', 'Drizzle of raw honey'],
    fruitVeg: ['Blueberries', 'Raspberries'],
    prep: 'Mix buckwheat, egg, and oat milk. Cook pancakes and top with berries, almond butter drizzle, and honey.',
    macros: { carbs: 70, protein: 14, fat: 12, fibre: 10, iron: 3.4 },
    shopping: { fruit: ['80g blueberries', '80g raspberries'], grains: ['100g buckwheat flour'], dairy: ['1 free-range egg', '150ml oat milk'], pantry: ['20g almond butter', '10g raw honey'] }
  },
]

const morningSnacks = [
  {
    id: 'ms1',
    name: 'Apple, Celery & Pumpkin Seed Butter',
    ingredients: ['1 fresh apple, sliced', '2 celery sticks, cut into batons', '1 tbsp pumpkin seed butter (1.5mg iron)', 'Squeeze of lemon juice'],
    fruitVeg: ['Apple', 'Celery'],
    prep: 'Slice apple, cut celery into batons, and serve with pumpkin seed butter on the side for dipping.',
    macros: { carbs: 28, protein: 8, fat: 10, fibre: 6, iron: 1.5 },
    shopping: { fruit: ['1 apple'], veg: ['2 celery sticks'], pantry: ['20g pumpkin seed butter', '1 lemon'] }
  },
  {
    id: 'ms2',
    name: 'Hummus with Carrots, Peppers & Cucumber',
    ingredients: ['100g hummus (no preservatives, 1.2mg iron)', '2 carrots, cut into batons', '1/2 red pepper, sliced', '10cm cucumber, sliced', 'Squeeze of lemon juice'],
    fruitVeg: ['Carrots', 'Red Pepper', 'Cucumber'],
    prep: 'Cut vegetables into batons and slices. Serve with hummus for dipping.',
    macros: { carbs: 24, protein: 6, fat: 8, fibre: 8, iron: 1.2 },
    shopping: { veg: ['2 carrots', '1 red pepper', '20cm cucumber'], pantry: ['100g hummus', '1 lemon'] }
  },
  {
    id: 'ms3',
    name: 'Energy Bites: Dates, Almonds & Dark Chocolate',
    ingredients: ['8 dried dates, pitted (1.2mg iron)', '40g raw almonds (2.0mg iron)', '1 tbsp raw cocoa powder', '2 tbsp natural almond butter (2.0mg iron)', 'Drizzle of coconut oil'],
    fruitVeg: [],
    prep: 'Blend dates, almonds, and almond butter. Mix in cocoa powder and shape into balls.',
    macros: { carbs: 36, protein: 10, fat: 14, fibre: 8, iron: 5.2 },
    shopping: { pantry: ['8 dried dates', '40g raw almonds', '10g raw cocoa powder', '20g natural almond butter', '10ml coconut oil'] }
  },
  {
    id: 'ms4',
    name: 'Yoghurt Pot with Granola & Mixed Berries',
    ingredients: ['150ml natural yoghurt', '40g homemade granola (oats, honey, nuts, seeds, 1.5mg iron)', 'Handful of mixed fresh berries (blueberries, raspberries, strawberries)'],
    fruitVeg: ['Blueberries', 'Raspberries', 'Strawberries'],
    prep: 'Layer yoghurt with granola and fresh berries. Eat fresh and enjoy.',
    macros: { carbs: 42, protein: 12, fat: 8, fibre: 6, iron: 1.5 },
    shopping: { fruit: ['50g mixed berries'], dairy: ['150ml natural yoghurt'], pantry: ['40g granola'] }
  },
  {
    id: 'ms5',
    name: 'Banana with Almond Butter & Dark Chocolate Chips',
    ingredients: ['1 fresh banana', '1 tbsp natural almond butter (2.0mg iron)', '1 tbsp dark chocolate chips (minimal sugar)'],
    fruitVeg: ['Banana'],
    prep: 'Slice banana and spread with almond butter. Top with dark chocolate chips.',
    macros: { carbs: 36, protein: 8, fat: 12, fibre: 4, iron: 2.0 },
    shopping: { fruit: ['1 banana'], pantry: ['20g natural almond butter', '10g dark chocolate chips'] }
  },
  {
    id: 'ms6',
    name: 'Rice Cakes with Avocado, Tomato & Lemon',
    ingredients: ['2 rice cakes (wholegrain, no additives)', '1/2 ripe avocado, mashed', '1 fresh tomato, sliced', 'Squeeze of fresh lemon juice', 'Pinch of sea salt'],
    fruitVeg: ['Avocado', 'Tomato'],
    prep: 'Top rice cakes with mashed avocado, sliced tomato, lemon juice, and a pinch of salt.',
    macros: { carbs: 30, protein: 6, fat: 10, fibre: 6, iron: 0.8 },
    shopping: { fruit: ['1 avocado', '1 tomato'], grains: ['2 rice cakes'], pantry: ['1 lemon', '1 pinch sea salt'] }
  },
  {
    id: 'ms7',
    name: 'Trail Mix: Nuts, Seeds & Dried Fruit',
    ingredients: ['20g raw almonds (1.0mg iron)', '20g raw cashews (1.2mg iron)', '15g pumpkin seeds (1.9mg iron)', '15g sunflower seeds (1.2mg iron)', '20g dried apricots (0.9mg iron)', '20g dried cranberries'],
    fruitVeg: [],
    prep: 'Mix all nuts, seeds, and dried fruit together in a container. Enjoy a small handful as a snack.',
    macros: { carbs: 42, protein: 10, fat: 16, fibre: 6, iron: 6.2 },
    shopping: { pantry: ['20g raw almonds', '20g raw cashews', '15g pumpkin seeds', '15g sunflower seeds', '20g dried apricots', '20g dried cranberries'] }
  },
]

const afternoonSnacks = [
  {
    id: 'as1',
    name: 'Mango, Kiwi & Pumpkin Seed Yoghurt Pot',
    ingredients: ['150ml natural yoghurt', '1/2 fresh mango, diced', '1 fresh kiwi, sliced', '1 tbsp pumpkin seeds (1.9mg iron)', 'Drizzle of raw honey'],
    fruitVeg: ['Mango', 'Kiwi'],
    prep: 'Layer yoghurt with diced mango, sliced kiwi, and pumpkin seeds. Drizzle with honey.',
    macros: { carbs: 38, protein: 10, fat: 8, fibre: 6, iron: 1.9 },
    shopping: { fruit: ['1 mango', '1 kiwi'], dairy: ['150ml natural yoghurt'], pantry: ['10g pumpkin seeds', '5g raw honey'] }
  },
  {
    id: 'as2',
    name: 'Spinach & Beetroot Smoothie',
    ingredients: ['150ml natural yoghurt', '1 fresh beetroot, grated (1.0mg iron)', 'Large handful of fresh spinach (1.6mg iron)', '1 banana', '150ml almond milk'],
    fruitVeg: ['Beetroot', 'Spinach', 'Banana'],
    prep: 'Blend yoghurt, grated beetroot, spinach, banana, and almond milk until smooth.',
    macros: { carbs: 42, protein: 12, fat: 6, fibre: 7, iron: 2.6 },
    shopping: { fruit: ['1 banana'], veg: ['1 beetroot', '60g spinach'], dairy: ['150ml natural yoghurt', '150ml almond milk'] }
  },
  {
    id: 'as3',
    name: 'Dark Chocolate & Hazelnut Energy Bars',
    ingredients: ['100g 85% dark chocolate (minimal sugar, 2.4mg iron)', '50g raw hazelnuts (3.6mg iron)', '2 tbsp natural almond butter (2.0mg iron)', '1 tbsp raw honey', 'Pinch of sea salt'],
    fruitVeg: [],
    prep: 'Melt chocolate, mix with crushed hazelnuts, almond butter, and honey. Press into a parchment-lined tin and chill.',
    macros: { carbs: 32, protein: 8, fat: 20, fibre: 5, iron: 8.0 },
    shopping: { pantry: ['100g 85% dark chocolate', '50g raw hazelnuts', '20g natural almond butter', '10g raw honey', 'sea salt'] }
  },
  {
    id: 'as4',
    name: 'Apple Slices with Raw Almond Butter & Cinnamon',
    ingredients: ['2 fresh apples, sliced', '2 tbsp natural almond butter (4.0mg iron)', 'Sprinkle of ground cinnamon', 'Pinch of sea salt'],
    fruitVeg: ['Apples'],
    prep: 'Slice apples and serve with almond butter on the side for dipping. Dust with cinnamon.',
    macros: { carbs: 42, protein: 10, fat: 14, fibre: 8, iron: 4.0 },
    shopping: { fruit: ['2 apples'], pantry: ['20g natural almond butter', 'ground cinnamon', 'sea salt'] }
  },
  {
    id: 'as5',
    name: 'Blueberry & Spinach Chia Seed Pudding',
    ingredients: ['100ml unsweetened almond milk', '2 tbsp chia seeds (2.4mg iron)', 'Handful of fresh spinach (0.8mg iron)', '1/2 cup fresh blueberries', 'Drizzle of raw honey'],
    fruitVeg: ['Spinach', 'Blueberries'],
    prep: 'Mix chia seeds with almond milk and let sit for 5 minutes. Blend with spinach, top with blueberries.',
    macros: { carbs: 28, protein: 6, fat: 10, fibre: 8, iron: 3.2 },
    shopping: { fruit: ['100g blueberries'], veg: ['30g spinach'], pantry: ['20g chia seeds', '100ml unsweetened almond milk', '5g raw honey'] }
  },
  {
    id: 'as6',
    name: 'Rice Cakes with Tuna, Tomato & Lemon',
    ingredients: ['2 rice cakes (wholegrain)', '100g canned tuna in spring water (drained, 1.2mg iron)', '1 fresh tomato, sliced', 'Squeeze of fresh lemon juice', 'Pinch of sea salt and pepper'],
    fruitVeg: ['Tomato'],
    prep: 'Top rice cakes with drained tuna and sliced tomato. Squeeze lemon juice and season.',
    macros: { carbs: 24, protein: 22, fat: 4, fibre: 4, iron: 1.2 },
    shopping: { fruit: ['1 tomato'], grains: ['2 rice cakes'], pantry: ['100g canned tuna', '1 lemon', 'sea salt', 'black pepper'] }
  },
  {
    id: 'as7',
    name: 'Pear with Walnuts & Dark Chocolate Chips',
    ingredients: ['1 fresh pear', '20g raw walnuts (1.6mg iron)', '1 tbsp dark chocolate chips (minimal sugar)', 'Squeeze of lemon juice'],
    fruitVeg: ['Pear'],
    prep: 'Slice pear and serve with walnuts and dark chocolate chips on the side.',
    macros: { carbs: 36, protein: 6, fat: 12, fibre: 7, iron: 1.6 },
    shopping: { fruit: ['1 pear', '1 lemon'], pantry: ['20g raw walnuts', '10g dark chocolate chips'] }
  },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function shuffle(arr) {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function pickForWeek(arr) {
  const shuffled = shuffle(arr)
  return shuffled.slice(0, 7)
}

function pickExcluding(arr, exclude) {
  const available = arr.filter(item => !exclude.find(ex => ex.id === item.id))
  if (available.length === 0) return arr[Math.floor(Math.random() * arr.length)]
  return available[Math.floor(Math.random() * available.length)]
}

function generateWeek() {
  return DAYS.map((day, i) => ({
    day,
    breakfast: pickForWeek(breakfasts)[i] || breakfasts[0],
    morningSnack: pickForWeek(morningSnacks)[i] || morningSnacks[0],
    afternoonSnack: pickForWeek(afternoonSnacks)[i] || afternoonSnacks[0],
  }))
}

export default function MealPlannerPage() {
  const { mealPlans, updateMealPlan } = useApp()
  const [weekPlan, setWeekPlan] = useState(mealPlans || generateWeek())
  const [activeDay, setActiveDay] = useState(0)
  const [shoppingOpen, setShoppingOpen] = useState(false)
  const [shoppingChecked, setShoppingChecked] = useState({})

  useEffect(() => {
    if (!mealPlans || mealPlans.length === 0) {
      const newWeek = generateWeek()
      setWeekPlan(newWeek)
      updateMealPlan(newWeek)
    } else {
      setWeekPlan(mealPlans)
    }
  }, [])

  const handleGenerate = () => {
    const newWeek = generateWeek()
    setWeekPlan(newWeek)
    updateMealPlan(newWeek)
    setActiveDay(0)
  }

  const handleShuffleDay = (dayIndex) => {
    const newPlan = [...weekPlan]
    const usedBf = weekPlan.filter((_, i) => i !== dayIndex).map(d => d.breakfast)
    const usedMs = weekPlan.filter((_, i) => i !== dayIndex).map(d => d.morningSnack)
    const usedAs = weekPlan.filter((_, i) => i !== dayIndex).map(d => d.afternoonSnack)

    newPlan[dayIndex] = {
      ...newPlan[dayIndex],
      breakfast: pickExcluding(breakfasts, usedBf),
      morningSnack: pickExcluding(morningSnacks, usedMs),
      afternoonSnack: pickExcluding(afternoonSnacks, usedAs),
    }
    setWeekPlan(newPlan)
    updateMealPlan(newPlan)
  }

  const plan = weekPlan[activeDay]
  if (!plan) return null

  const allFV = [...new Set([...plan.breakfast.fruitVeg, ...plan.morningSnack.fruitVeg, ...plan.afternoonSnack.fruitVeg])]
  const meals = [plan.breakfast, plan.morningSnack, plan.afternoonSnack]
  const totals = meals.reduce((acc, m) => ({
    carbs: acc.carbs + m.macros.carbs,
    protein: acc.protein + m.macros.protein,
    fat: acc.fat + m.macros.fat,
    fibre: acc.fibre + m.macros.fibre,
    iron: acc.iron + m.macros.iron,
  }), { carbs: 0, protein: 0, fat: 0, fibre: 0, iron: 0 })

  const total = totals.carbs + totals.protein + totals.fat + totals.fibre
  const carbPct = Math.round((totals.carbs / total) * 100)
  const proteinPct = Math.round((totals.protein / total) * 100)
  const fatPct = Math.round((totals.fat / total) * 100)
  const fibrePct = Math.round((totals.fibre / total) * 100)
  const ironPct = Math.min(100, Math.round((totals.iron / 18) * 100))

  return (
    <div className="pb-20 lg:pb-4">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-2">Meal Planner</h1>
          <p className="text-surface-600 dark:text-surface-400">Runner-optimized meals with iron-rich whole foods</p>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg mb-6 transition-all"
        >
          Generate New Weekly Plan
        </button>

        {/* Day tabs */}
        <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
          {DAYS.map((day, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                i === activeDay
                  ? 'bg-primary-500 text-white'
                  : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600'
              }`}
            >
              {SHORT_DAYS[i]}
            </button>
          ))}
        </div>

        {/* Shuffle button */}
        <button
          onClick={() => handleShuffleDay(activeDay)}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
        >
          <RotateCw size={18} />
          Shuffle {plan.day}'s meals
        </button>

        {/* Meals */}
        {[
          { icon: '☀️', title: 'Breakfast', meal: plan.breakfast },
          { icon: '🍎', title: 'Morning Snack', meal: plan.morningSnack },
          { icon: '🍪', title: 'Afternoon Snack', meal: plan.afternoonSnack },
        ].map(({ icon, title, meal }) => (
          <div key={meal.id} className="mb-6 p-4 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700">
            <div className="flex gap-3 mb-3">
              <span className="text-2xl">{icon}</span>
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50">{title}</h2>
            </div>
            <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-3">{meal.name}</h3>
            {meal.fruitVeg.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {meal.fruitVeg.map(fv => (
                  <span key={fv} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                    {fv} - 1 of 7-a-day
                  </span>
                ))}
              </div>
            )}
            <div className="mb-3">
              <h4 className="font-medium text-surface-700 dark:text-surface-300 mb-2">Ingredients:</h4>
              <ul className="list-disc list-inside text-sm text-surface-600 dark:text-surface-400 space-y-1">
                {meal.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400 italic">{meal.prep}</p>
          </div>
        ))}

        {/* 7-a-day tracker */}
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900">
          <h2 className="font-bold text-green-700 dark:text-green-400 mb-3">{plan.day}'s 7-a-Day</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            {allFV.map(fv => (
              <span key={fv} className="text-sm bg-white dark:bg-surface-800 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">
                {fv}
              </span>
            ))}
          </div>
          <p className="text-sm text-green-700 dark:text-green-400">
            <strong>{allFV.length}</strong> of your 7-a-day from breakfast & snacks! {allFV.length >= 7 ? '✓ All 7 reached!' : `Add ${7 - allFV.length} more with lunch & dinner.`}
          </p>
        </div>

        {/* Nutrition summary */}
        <div className="mb-6 p-4 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700">
          <h2 className="font-bold text-surface-900 dark:text-surface-50 mb-4">Nutrition Balance</h2>
          <div className="space-y-3 mb-4">
            {[
              { label: 'Carbs (energy)', pct: carbPct, color: 'bg-yellow-500' },
              { label: 'Protein', pct: proteinPct, color: 'bg-red-500' },
              { label: 'Healthy Fats', pct: fatPct, color: 'bg-orange-500' },
              { label: 'Fibre', pct: fibrePct, color: 'bg-green-500' },
            ].map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full h-2 bg-surface-300 dark:bg-surface-700 rounded-full overflow-hidden">
                  <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
            <h3 className="font-semibold text-surface-900 dark:text-surface-50 mb-2">Iron Intake</h3>
            <div className="h-3 bg-surface-300 dark:bg-surface-700 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-amber-600" style={{ width: `${ironPct}%` }} />
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              <strong>{totals.iron.toFixed(1)}mg</strong> / 18mg daily
            </p>
            <p className="text-xs text-surface-500 dark:text-surface-500 mt-2">
              From breakfast & snacks alone. Runners need 18mg/day. Vitamin C in fruit boosts iron absorption.
            </p>
          </div>
        </div>

        {/* Shopping list */}
        <div className="mb-6 p-4 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700">
          <button
            onClick={() => setShoppingOpen(!shoppingOpen)}
            className="w-full flex items-center justify-between font-bold text-surface-900 dark:text-surface-50 mb-3 py-2"
          >
            <span>Weekly Shopping List</span>
            <ChevronDown size={20} className={`transition-transform ${shoppingOpen ? 'rotate-180' : ''}`} />
          </button>
          {shoppingOpen && (
            <div className="space-y-4">
              {/* Aggregate shopping across all days */}
              {['fruit', 'veg', 'grains', 'dairy', 'pantry'].map(cat => {
                const items = {}
                weekPlan.forEach(day => {
                  [day.breakfast, day.morningSnack, day.afternoonSnack].forEach(meal => {
                    (meal.shopping[cat] || []).forEach(item => {
                      items[item] = (items[item] || 0) + 1
                    })
                  })
                })
                if (Object.keys(items).length === 0) return null
                const catLabels = { fruit: 'Fruit', veg: 'Vegetables', grains: 'Grains & Bread', dairy: 'Dairy & Eggs', pantry: 'Pantry Staples' }
                return (
                  <div key={cat}>
                    <h3 className="font-semibold text-surface-900 dark:text-surface-50 mb-2">{catLabels[cat]}</h3>
                    <ul className="space-y-1">
                      {Object.entries(items).map(([item, count]) => (
                        <li key={item} className="text-sm text-surface-600 dark:text-surface-400 flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={shoppingChecked[item] || false}
                            onChange={e => setShoppingChecked({ ...shoppingChecked, [item]: e.target.checked })}
                            className="rounded"
                          />
                          <span className={shoppingChecked[item] ? 'line-through' : ''}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          {['🌱 No Preservatives', '⚡ No Emulsifiers', '🥗 Whole Foods Only'].map(badge => (
            <div key={badge} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full">
              {badge}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
