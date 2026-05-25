const NATURAL_SUGAR_GROUPS = new Set(['Fruit', 'Vegetables', 'Dairy'])
const FREE_SUGAR_NAMES = new Set([
  'Orange juice', 'Apple juice', 'Smoothie', 'Dried cranberries',
  'Honey', 'Jam', 'Maple syrup', 'Nutella', 'Fruit snack',
])

export function getFreeSugar(food) {
  const sugar = food.nutrients?.sugar || 0
  if (sugar === 0) return 0
  if (FREE_SUGAR_NAMES.has(food.name)) return sugar
  if (food.unhealthy) return sugar
  const groups = food.groups || []
  if (groups.length === 0) return sugar
  const allNatural = groups.every(g => NATURAL_SUGAR_GROUPS.has(g))
  if (allNatural) return 0
  return sugar
}
