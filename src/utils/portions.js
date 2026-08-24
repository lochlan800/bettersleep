/**
 * Portion weights — how many grams are in a tablespoon, teaspoon, or bowl
 * of a given food.
 *
 * A tablespoon is 15ml and a teaspoon 5ml, so the weight depends entirely on
 * the food's density. Rolled oats at 6g/tbsp and honey at 21g/tbsp differ by
 * more than 3x for the same spoon. Values below are per tablespoon; teaspoon
 * is derived as a third of that.
 */

// Exact matches take priority — these are foods whose density is distinctive
// enough that a category guess would be noticeably wrong.
const TBSP_BY_NAME = {
  // Syrups & spreads (dense, heavier than water)
  'Honey': 21,
  'Maple syrup': 20,
  'Jam': 20,
  'Nutella': 19,
  'Peanut butter': 16,
  'Almond butter': 16,
  'Tahini': 15,
  'Ketchup': 17,
  'Mayonnaise': 14,
  'Pesto': 15,
  'Hummus': 15,
  'Guacamole': 15,
  'Salsa': 16,
  'Soy sauce': 16,

  // Oils & fats
  'Olive oil': 13.5,
  'Coconut oil': 13.5,
  'Butter': 14,
  'Cream': 15,
  'Cream cheese': 15,

  // Dairy liquids
  'Milk': 15,
  'Skimmed milk': 15,
  'Oat milk': 15,
  'Almond milk': 15,
  'Soya milk': 15,
  'Kefir': 15,
  'Yoghurt': 16,
  'Greek yoghurt': 17,
  'Cottage cheese': 15,

  // Seeds — small and dense-packing
  'Chia seeds': 12,
  'Flaxseeds': 10,
  'Sesame seeds': 9,
  'Hemp seeds': 10,
  'Poppy seeds': 9,
  'Pumpkin seeds': 10,
  'Sunflower seeds': 9,

  // Cereal & grain (dry, light)
  'Oats': 6,
  'Ready Brek': 6,
  'Granola': 10,
  'Muesli': 9,
  'Rice': 13,
  'Brown rice': 13,
  'Couscous': 11,
  'Quinoa': 11,
  'Bulgur wheat': 11,

  // Dried fruit (chopped, sticky)
  'Raisins': 10,
  'Dried cranberries': 10,
  'Dried apricots': 11,
  'Dates': 12,
  'Dried fruit': 10,

  // Grated / crumbly
  'Cheese': 7,
  'Cheddar cheese': 7,
  'Mozzarella': 7,
  'Coconut (desiccated)': 5,
}

// Keyword rules — checked in order against the lowercased food name, so the
// most specific patterns must come first. Cereals lead: names like "Honey
// Monster Puffs" and "Bran Flakes" would otherwise be caught by the syrup
// and bran rules below and come out several times too heavy.
const TBSP_BY_KEYWORD = [
  // No leading \b on this one — these words appear inside compound names
  // like "Cornflakes" and "Shreddies", where a leading boundary never matches.
  [/(flakes|krispies|puffs|puffed|shreddies|chex|cheerios|weetos)\b/, 4],
  [/\b(granola|muesli|cereal)\b/, 10],
  [/\b(oats|porridge|bran)\b/, 6],

  [/\b(oil)\b/, 13.5],
  [/\b(juice|smoothie|shake|water)\b/, 15],
  [/\b(milk|kefir)\b/, 15],
  [/\b(yoghurt|yogurt)\b/, 16],
  [/\b(butter)\b/, 16],
  [/\b(syrup|honey|jam|treacle)\b/, 20],
  [/\b(sauce|ketchup|mayo|dressing|dip)\b/, 15],
  [/\b(seeds)\b/, 10],
  [/\b(nuts|almonds|walnuts|cashews|pecans|pistachios|hazelnuts|peanuts)\b/, 8],
  [/\b(rice|couscous|quinoa|bulgur)\b/, 12],
  [/\b(lettuce|spinach|kale|rocket|arugula|watercress|cabbage)\b/, 4],
  [/\b(berries|blueberries|raspberries|blackberries|strawberries)\b/, 10],
  [/\b(mince|chopped|diced)\b/, 12],
  [/\b(soup|stew|curry|chilli)\b/, 15],
]

// Group-level fallback when nothing more specific matches.
const TBSP_BY_GROUP = {
  Dairy: 15,
  Fruit: 10,
  Vegetables: 9,
  Protein: 11,
  Grains: 10,
}

const DEFAULT_TBSP = 12

/**
 * Grams in one tablespoon of a food.
 * @param {{ name: string, groups?: string[] }} food
 * @returns {number}
 */
export function gramsPerTablespoon(food) {
  if (!food) return DEFAULT_TBSP

  const exact = TBSP_BY_NAME[food.name]
  if (exact) return exact

  const lower = (food.name || '').toLowerCase()
  for (const [pattern, grams] of TBSP_BY_KEYWORD) {
    if (pattern.test(lower)) return grams
  }

  const groups = food.groups || []
  for (const group of groups) {
    if (TBSP_BY_GROUP[group]) return TBSP_BY_GROUP[group]
  }

  return DEFAULT_TBSP
}

/**
 * Grams in one teaspoon — a teaspoon is 5ml against a tablespoon's 15ml.
 * @param {{ name: string, groups?: string[] }} food
 * @returns {number}
 */
export function gramsPerTeaspoon(food) {
  return Math.round((gramsPerTablespoon(food) / 3) * 10) / 10
}

// Standard bowl servings for cereal, in grams. Density varies enough between
// a puffed rice and a clustered granola that one number would be misleading.
const BOWL_BY_NAME = {
  'Weetabix': 38,
  'Weetabix Minis (chocolate)': 40,
  'Weetabix Protein': 38,
  'Shredded Wheat': 45,
  'Shredded Wheat Bitesize': 45,
  'Oats': 40,
  'Ready Brek': 40,
  'Porridge': 40,
  'Overnight oats': 50,
  'Instant oat sachets': 35,
  'Granola': 45,
  'Granola (chocolate)': 45,
  'Granola (nut)': 45,
  'Granola (berry)': 45,
  'Protein granola': 45,
  'Harvest Morn / Aldi Granola': 45,
  "Jordan's Country Crisp": 45,
  'Muesli': 45,
  'Muesli (no added sugar)': 45,
  'Dorset Cereals Muesli': 45,
  'Bircher muesli': 50,
  'Alpen': 45,
  'Alpen No Added Sugar': 45,
  'Rice Krispies': 30,
  'Puffed Rice': 25,
  'Puffed Wheat': 25,
  'Sugar Puffs / Honey Monster Puffs': 30,
}

const DEFAULT_BOWL = 30

/**
 * Grams in one bowl of a cereal.
 * @param {{ name: string }} food
 * @returns {number}
 */
export function gramsPerBowl(food) {
  if (!food) return DEFAULT_BOWL
  return BOWL_BY_NAME[food.name] || DEFAULT_BOWL
}

// Supplements are dosed per tablet rather than by weight. One tablet is
// modelled as 1g so a single dose scales cleanly through the same
// per-100g nutrient maths everything else uses.
export const GRAMS_PER_TABLET = 1

/**
 * Grams representing one tablet of a supplement.
 * @returns {number}
 */
export function gramsPerTablet() {
  return GRAMS_PER_TABLET
}
