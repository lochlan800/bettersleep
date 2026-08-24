/**
 * Energy estimates from macronutrients, using the standard Atwater factors.
 *
 * Sugar is a subset of carbohydrate in this database, so counting carbs
 * alone avoids double counting. Fibre is also counted at the full carb
 * value, which slightly overestimates — fibre yields closer to 2 kcal/g —
 * so treat these as estimates rather than exact figures.
 */

export const KCAL_PER_G = { protein: 4, carbs: 4, fat: 9 }

/**
 * Calories from a nutrient totals object.
 * @param {{protein?:number, carbs?:number, fat?:number}} nutrients
 * @returns {number}
 */
export function getCalories(nutrients) {
  if (!nutrients) return 0
  return Math.round(
    (nutrients.protein || 0) * KCAL_PER_G.protein +
    (nutrients.carbs || 0) * KCAL_PER_G.carbs +
    (nutrients.fat || 0) * KCAL_PER_G.fat
  )
}

/**
 * How those calories split across the three macros, for a stacked bar.
 * @param {{protein?:number, carbs?:number, fat?:number}} nutrients
 * @returns {{total:number, parts:Array<{key:string,label:string,kcal:number,pct:number,color:string}>}}
 */
export function getCalorieSplit(nutrients) {
  const kcal = {
    protein: (nutrients?.protein || 0) * KCAL_PER_G.protein,
    carbs: (nutrients?.carbs || 0) * KCAL_PER_G.carbs,
    fat: (nutrients?.fat || 0) * KCAL_PER_G.fat,
  }
  const total = kcal.protein + kcal.carbs + kcal.fat
  const meta = [
    { key: 'carbs', label: 'Carbs', color: '#8b5cf6' },
    { key: 'protein', label: 'Protein', color: '#ef4444' },
    { key: 'fat', label: 'Fat', color: '#f59e0b' },
  ]
  return {
    total: Math.round(total),
    parts: meta.map(m => ({
      ...m,
      kcal: Math.round(kcal[m.key]),
      pct: total > 0 ? Math.round((kcal[m.key] / total) * 100) : 0,
    })),
  }
}
