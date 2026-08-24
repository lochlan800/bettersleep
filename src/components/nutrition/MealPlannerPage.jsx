import { useState, useMemo, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { getDaysAgo } from '../../utils/dateHelpers'
import { Search, Plus, X, Camera, History, ChevronLeft, ChevronRight, PieChart as PieChartIcon } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import Card from '../ui/Card'
import { getFreeSugar } from '../../utils/freeSugar'
import { gramsPerTablespoon, gramsPerTeaspoon, gramsPerBowl } from '../../utils/portions'

const FOOD_DATABASE = [
  // ── Fruits ──
  { name: 'Banana', groups: ['Fruit'], nutrients: { carbs: 27, protein: 1, fat: 0, fibre: 3, iron: 0.3, calcium: 5, vitC: 10, sugar: 12 } },
  { name: 'Apple', groups: ['Fruit'], nutrients: { carbs: 25, protein: 0, fat: 0, fibre: 4, iron: 0.2, calcium: 6, vitC: 8, sugar: 10 } },
  { name: 'Blueberries', groups: ['Fruit'], nutrients: { carbs: 14, protein: 1, fat: 0, fibre: 2, iron: 0.3, calcium: 6, vitC: 10, sugar: 10 } },
  { name: 'Strawberries', groups: ['Fruit'], nutrients: { carbs: 8, protein: 1, fat: 0, fibre: 2, iron: 0.4, calcium: 16, vitC: 59, sugar: 5 } },
  { name: 'Orange', groups: ['Fruit'], nutrients: { carbs: 12, protein: 1, fat: 0, fibre: 2, iron: 0.1, calcium: 40, vitC: 70, sugar: 9 } },
  { name: 'Grapes', groups: ['Fruit'], nutrients: { carbs: 18, protein: 1, fat: 0, fibre: 1, iron: 0.4, calcium: 10, vitC: 4, sugar: 16 } },
  { name: 'Mango', groups: ['Fruit'], nutrients: { carbs: 25, protein: 1, fat: 0, fibre: 3, iron: 0.2, calcium: 11, vitC: 36, sugar: 14 } },
  { name: 'Pineapple', groups: ['Fruit'], nutrients: { carbs: 13, protein: 0, fat: 0, fibre: 1, iron: 0.3, calcium: 13, vitC: 48, sugar: 10 } },
  { name: 'Watermelon', groups: ['Fruit'], nutrients: { carbs: 8, protein: 1, fat: 0, fibre: 0, iron: 0.2, calcium: 7, vitC: 8, sugar: 6 } },
  { name: 'Peach', groups: ['Fruit'], nutrients: { carbs: 10, protein: 1, fat: 0, fibre: 2, iron: 0.3, calcium: 6, vitC: 7, sugar: 8 } },
  { name: 'Nectarine', groups: ['Fruit'], nutrients: { carbs: 11, protein: 1, fat: 0, fibre: 2, iron: 0.3, calcium: 6, vitC: 5, sugar: 8 } },
  { name: 'Plum', groups: ['Fruit'], nutrients: { carbs: 11, protein: 1, fat: 0, fibre: 1, iron: 0.2, calcium: 6, vitC: 10, sugar: 10 } },
  { name: 'Pear', groups: ['Fruit'], nutrients: { carbs: 15, protein: 0, fat: 0, fibre: 3, iron: 0.2, calcium: 9, vitC: 4, sugar: 10 } },
  { name: 'Cherries', groups: ['Fruit'], nutrients: { carbs: 16, protein: 1, fat: 0, fibre: 2, iron: 0.4, calcium: 13, vitC: 7, sugar: 13 } },
  { name: 'Raspberries', groups: ['Fruit'], nutrients: { carbs: 12, protein: 1, fat: 1, fibre: 7, iron: 0.7, calcium: 25, vitC: 26, sugar: 4 } },
  { name: 'Blackberries', groups: ['Fruit'], nutrients: { carbs: 10, protein: 1, fat: 0, fibre: 5, iron: 0.6, calcium: 29, vitC: 21, sugar: 5 } },
  { name: 'Kiwi', groups: ['Fruit'], nutrients: { carbs: 15, protein: 1, fat: 1, fibre: 3, iron: 0.3, calcium: 34, vitC: 93, sugar: 9 } },
  { name: 'Melon (cantaloupe)', groups: ['Fruit'], nutrients: { carbs: 8, protein: 1, fat: 0, fibre: 1, iron: 0.2, calcium: 9, vitC: 37, sugar: 8 } },
  { name: 'Honeydew melon', groups: ['Fruit'], nutrients: { carbs: 9, protein: 1, fat: 0, fibre: 1, iron: 0.2, calcium: 6, vitC: 18, sugar: 8 } },
  { name: 'Grapefruit', groups: ['Fruit'], nutrients: { carbs: 11, protein: 1, fat: 0, fibre: 2, iron: 0.1, calcium: 22, vitC: 31, sugar: 7 } },
  { name: 'Lemon', groups: ['Fruit'], nutrients: { carbs: 9, protein: 1, fat: 0, fibre: 3, iron: 0.6, calcium: 26, vitC: 53, sugar: 3 } },
  { name: 'Lime', groups: ['Fruit'], nutrients: { carbs: 11, protein: 1, fat: 0, fibre: 3, iron: 0.6, calcium: 33, vitC: 29, sugar: 2 } },
  { name: 'Pomegranate', groups: ['Fruit'], nutrients: { carbs: 19, protein: 2, fat: 1, fibre: 4, iron: 0.3, calcium: 10, vitC: 10, sugar: 14 } },
  { name: 'Passion fruit', groups: ['Fruit'], nutrients: { carbs: 23, protein: 2, fat: 1, fibre: 10, iron: 1.6, calcium: 12, vitC: 30, sugar: 11 } },
  { name: 'Lychee', groups: ['Fruit'], nutrients: { carbs: 17, protein: 1, fat: 0, fibre: 1, iron: 0.3, calcium: 5, vitC: 72, sugar: 15 } },
  { name: 'Papaya', groups: ['Fruit'], nutrients: { carbs: 11, protein: 1, fat: 0, fibre: 2, iron: 0.3, calcium: 20, vitC: 61, sugar: 8 } },
  { name: 'Dragon fruit', groups: ['Fruit'], nutrients: { carbs: 13, protein: 1, fat: 0, fibre: 3, iron: 0.7, calcium: 18, vitC: 3, sugar: 8 } },
  { name: 'Coconut (fresh)', groups: ['Fruit'], nutrients: { carbs: 15, protein: 3, fat: 33, fibre: 9, iron: 2.4, calcium: 14, vitC: 3, sugar: 6 } },
  { name: 'Dates', groups: ['Fruit'], nutrients: { carbs: 75, protein: 2, fat: 0, fibre: 7, iron: 1.0, calcium: 64, vitC: 0, sugar: 63 } },
  { name: 'Raisins', groups: ['Fruit'], nutrients: { carbs: 79, protein: 3, fat: 0, fibre: 4, iron: 1.9, calcium: 50, vitC: 2, sugar: 59 } },
  { name: 'Dried apricots', groups: ['Fruit'], nutrients: { carbs: 63, protein: 3, fat: 0, fibre: 7, iron: 2.7, calcium: 55, vitC: 1, sugar: 53 } },
  { name: 'Dried cranberries', groups: ['Fruit'], nutrients: { carbs: 82, protein: 0, fat: 1, fibre: 6, iron: 0.4, calcium: 10, vitC: 0, sugar: 72 } },
  { name: 'Fig', groups: ['Fruit'], nutrients: { carbs: 19, protein: 1, fat: 0, fibre: 3, iron: 0.4, calcium: 35, vitC: 2, sugar: 16 } },
  { name: 'Avocado', groups: ['Fruit', 'Vegetables'], nutrients: { carbs: 9, protein: 2, fat: 15, fibre: 7, iron: 0.6, calcium: 12, vitC: 10, sugar: 1 } },
  { name: 'Satsuma', groups: ['Fruit'], nutrients: { carbs: 11, protein: 1, fat: 0, fibre: 2, iron: 0.1, calcium: 37, vitC: 27, sugar: 9 } },
  { name: 'Clementine', groups: ['Fruit'], nutrients: { carbs: 12, protein: 1, fat: 0, fibre: 2, iron: 0.1, calcium: 30, vitC: 49, sugar: 9 } },
  { name: 'Tangerine', groups: ['Fruit'], nutrients: { carbs: 13, protein: 1, fat: 0, fibre: 2, iron: 0.2, calcium: 37, vitC: 27, sugar: 9 } },
  { name: 'Star fruit', groups: ['Fruit'], nutrients: { carbs: 7, protein: 1, fat: 0, fibre: 3, iron: 0.1, calcium: 3, vitC: 34, sugar: 4 } },
  { name: 'Guava', groups: ['Fruit'], nutrients: { carbs: 14, protein: 3, fat: 1, fibre: 5, iron: 0.3, calcium: 18, vitC: 228, sugar: 9 } },
  // ── Vegetables ──
  { name: 'Spinach', groups: ['Vegetables'], nutrients: { carbs: 4, protein: 3, fat: 0, fibre: 2, iron: 2.7, calcium: 99, vitC: 28, sugar: 0 } },
  { name: 'Broccoli', groups: ['Vegetables'], nutrients: { carbs: 7, protein: 3, fat: 0, fibre: 3, iron: 0.7, calcium: 47, vitC: 89, sugar: 2 } },
  { name: 'Carrots', groups: ['Vegetables'], nutrients: { carbs: 10, protein: 1, fat: 0, fibre: 3, iron: 0.3, calcium: 33, vitC: 6, sugar: 5 } },
  { name: 'Sweet potato', groups: ['Vegetables'], nutrients: { carbs: 20, protein: 2, fat: 0, fibre: 3, iron: 0.6, calcium: 30, vitC: 2, sugar: 4 } },
  { name: 'Peppers', groups: ['Vegetables'], nutrients: { carbs: 6, protein: 1, fat: 0, fibre: 2, iron: 0.4, calcium: 7, vitC: 128, sugar: 5 } },
  { name: 'Tomatoes', groups: ['Vegetables'], nutrients: { carbs: 4, protein: 1, fat: 0, fibre: 1, iron: 0.3, calcium: 10, vitC: 14, sugar: 3 } },
  { name: 'Cucumber', groups: ['Vegetables'], nutrients: { carbs: 4, protein: 1, fat: 0, fibre: 1, iron: 0.3, calcium: 16, vitC: 3, sugar: 2 } },
  { name: 'Peas', groups: ['Vegetables', 'Protein'], nutrients: { carbs: 14, protein: 5, fat: 0, fibre: 5, iron: 1.5, calcium: 25, vitC: 40, sugar: 5 } },
  { name: 'Potato', groups: ['Vegetables', 'Grains'], nutrients: { carbs: 17, protein: 2, fat: 0, fibre: 2, iron: 0.8, calcium: 12, vitC: 20, sugar: 1 } },
  { name: 'Cauliflower', groups: ['Vegetables'], nutrients: { carbs: 5, protein: 2, fat: 0, fibre: 2, iron: 0.4, calcium: 22, vitC: 48, sugar: 2 } },
  { name: 'Courgette/zucchini', groups: ['Vegetables'], nutrients: { carbs: 3, protein: 1, fat: 0, fibre: 1, iron: 0.4, calcium: 16, vitC: 18, sugar: 3 } },
  { name: 'Aubergine/eggplant', groups: ['Vegetables'], nutrients: { carbs: 6, protein: 1, fat: 0, fibre: 3, iron: 0.2, calcium: 9, vitC: 2, sugar: 2 } },
  { name: 'Mushrooms', groups: ['Vegetables'], nutrients: { carbs: 3, protein: 3, fat: 0, fibre: 1, iron: 0.5, calcium: 3, vitC: 2, sugar: 2 } },
  { name: 'Onion', groups: ['Vegetables'], nutrients: { carbs: 9, protein: 1, fat: 0, fibre: 2, iron: 0.2, calcium: 23, vitC: 7, sugar: 4 } },
  { name: 'Garlic', groups: ['Vegetables'], nutrients: { carbs: 33, protein: 6, fat: 0, fibre: 2, iron: 1.7, calcium: 181, vitC: 31, sugar: 1 } },
  { name: 'Lettuce', groups: ['Vegetables'], nutrients: { carbs: 3, protein: 1, fat: 0, fibre: 1, iron: 0.9, calcium: 36, vitC: 9, sugar: 1 } },
  { name: 'Kale', groups: ['Vegetables'], nutrients: { carbs: 9, protein: 4, fat: 1, fibre: 4, iron: 1.5, calcium: 150, vitC: 120, sugar: 1 } },
  { name: 'Rocket/arugula', groups: ['Vegetables'], nutrients: { carbs: 4, protein: 3, fat: 1, fibre: 2, iron: 1.5, calcium: 160, vitC: 15, sugar: 2 } },
  { name: 'Cabbage', groups: ['Vegetables'], nutrients: { carbs: 6, protein: 1, fat: 0, fibre: 3, iron: 0.5, calcium: 40, vitC: 37, sugar: 3 } },
  { name: 'Brussels sprouts', groups: ['Vegetables'], nutrients: { carbs: 9, protein: 3, fat: 0, fibre: 4, iron: 1.4, calcium: 42, vitC: 85, sugar: 2 } },
  { name: 'Green beans', groups: ['Vegetables'], nutrients: { carbs: 7, protein: 2, fat: 0, fibre: 3, iron: 1.0, calcium: 37, vitC: 12, sugar: 3 } },
  { name: 'Asparagus', groups: ['Vegetables'], nutrients: { carbs: 4, protein: 2, fat: 0, fibre: 2, iron: 2.1, calcium: 24, vitC: 6, sugar: 2 } },
  { name: 'Celery', groups: ['Vegetables'], nutrients: { carbs: 3, protein: 1, fat: 0, fibre: 2, iron: 0.2, calcium: 40, vitC: 3, sugar: 1 } },
  { name: 'Beetroot', groups: ['Vegetables'], nutrients: { carbs: 10, protein: 2, fat: 0, fibre: 3, iron: 0.8, calcium: 16, vitC: 5, sugar: 7 } },
  { name: 'Radish', groups: ['Vegetables'], nutrients: { carbs: 3, protein: 1, fat: 0, fibre: 2, iron: 0.3, calcium: 25, vitC: 15, sugar: 2 } },
  { name: 'Turnip', groups: ['Vegetables'], nutrients: { carbs: 6, protein: 1, fat: 0, fibre: 2, iron: 0.3, calcium: 30, vitC: 21, sugar: 4 } },
  { name: 'Parsnip', groups: ['Vegetables'], nutrients: { carbs: 18, protein: 1, fat: 0, fibre: 5, iron: 0.6, calcium: 36, vitC: 17, sugar: 5 } },
  { name: 'Butternut squash', groups: ['Vegetables'], nutrients: { carbs: 12, protein: 1, fat: 0, fibre: 2, iron: 0.7, calcium: 48, vitC: 21, sugar: 3 } },
  { name: 'Sweetcorn', groups: ['Vegetables', 'Grains'], nutrients: { carbs: 19, protein: 3, fat: 1, fibre: 2, iron: 0.5, calcium: 2, vitC: 7, sugar: 3 } },
  { name: 'Leek', groups: ['Vegetables'], nutrients: { carbs: 14, protein: 2, fat: 0, fibre: 2, iron: 2.1, calcium: 59, vitC: 12, sugar: 3 } },
  { name: 'Spring onion', groups: ['Vegetables'], nutrients: { carbs: 7, protein: 2, fat: 0, fibre: 3, iron: 1.5, calcium: 72, vitC: 19, sugar: 2 } },
  { name: 'Watercress', groups: ['Vegetables'], nutrients: { carbs: 1, protein: 2, fat: 0, fibre: 1, iron: 0.2, calcium: 120, vitC: 43, sugar: 0 } },
  { name: 'Pak choi', groups: ['Vegetables'], nutrients: { carbs: 2, protein: 2, fat: 0, fibre: 1, iron: 0.8, calcium: 105, vitC: 45, sugar: 1 } },
  { name: 'Artichoke', groups: ['Vegetables'], nutrients: { carbs: 11, protein: 3, fat: 0, fibre: 5, iron: 1.3, calcium: 44, vitC: 12, sugar: 1 } },
  { name: 'Okra', groups: ['Vegetables'], nutrients: { carbs: 7, protein: 2, fat: 0, fibre: 3, iron: 0.6, calcium: 82, vitC: 23, sugar: 1 } },
  { name: 'Bean sprouts', groups: ['Vegetables'], nutrients: { carbs: 6, protein: 3, fat: 0, fibre: 2, iron: 0.9, calcium: 13, vitC: 13, sugar: 4 } },
  { name: 'Edamame', groups: ['Vegetables', 'Protein'], nutrients: { carbs: 9, protein: 11, fat: 5, fibre: 5, iron: 2.3, calcium: 63, vitC: 6, sugar: 2 } },
  { name: 'Fennel', groups: ['Vegetables'], nutrients: { carbs: 7, protein: 1, fat: 0, fibre: 3, iron: 0.7, calcium: 49, vitC: 12, sugar: 3 } },
  { name: 'Ginger', groups: ['Vegetables'], nutrients: { carbs: 18, protein: 2, fat: 1, fibre: 2, iron: 0.6, calcium: 16, vitC: 5, sugar: 2 } },
  { name: 'Chilli peppers', groups: ['Vegetables'], nutrients: { carbs: 9, protein: 2, fat: 0, fibre: 2, iron: 1.0, calcium: 14, vitC: 144, sugar: 5 } },
  // ── Protein / Meat ──
  { name: 'Chicken breast', groups: ['Protein'], nutrients: { carbs: 0, protein: 31, fat: 4, fibre: 0, iron: 1.0, calcium: 15, vitC: 0, sugar: 0 } },
  { name: 'Chicken thigh', groups: ['Protein'], nutrients: { carbs: 0, protein: 26, fat: 10, fibre: 0, iron: 1.1, calcium: 12, vitC: 0, sugar: 0 } },
  { name: 'Chicken drumstick', groups: ['Protein'], nutrients: { carbs: 0, protein: 24, fat: 8, fibre: 0, iron: 1.0, calcium: 11, vitC: 0, sugar: 0 } },
  { name: 'Chicken wings', groups: ['Protein'], nutrients: { carbs: 0, protein: 22, fat: 12, fibre: 0, iron: 0.9, calcium: 13, vitC: 0, sugar: 0 } },
  { name: 'Turkey', groups: ['Protein'], nutrients: { carbs: 0, protein: 29, fat: 2, fibre: 0, iron: 1.4, calcium: 11, vitC: 0, sugar: 0 } },
  { name: 'Turkey mince', groups: ['Protein'], nutrients: { carbs: 0, protein: 27, fat: 8, fibre: 0, iron: 1.5, calcium: 20, vitC: 0, sugar: 0 } },
  { name: 'Duck', groups: ['Protein'], nutrients: { carbs: 0, protein: 19, fat: 28, fibre: 0, iron: 2.7, calcium: 11, vitC: 0, sugar: 0 } },
  { name: 'Beef steak', groups: ['Protein'], nutrients: { carbs: 0, protein: 27, fat: 12, fibre: 0, iron: 2.8, calcium: 12, vitC: 0, sugar: 0 } },
  { name: 'Beef mince', groups: ['Protein'], nutrients: { carbs: 0, protein: 26, fat: 15, fibre: 0, iron: 2.6, calcium: 18, vitC: 0, sugar: 0 } },
  { name: 'Beef roast', groups: ['Protein'], nutrients: { carbs: 0, protein: 26, fat: 10, fibre: 0, iron: 2.4, calcium: 10, vitC: 0, sugar: 0 } },
  { name: 'Lamb chop', groups: ['Protein'], nutrients: { carbs: 0, protein: 25, fat: 18, fibre: 0, iron: 1.9, calcium: 17, vitC: 0, sugar: 0 } },
  { name: 'Lamb mince', groups: ['Protein'], nutrients: { carbs: 0, protein: 24, fat: 17, fibre: 0, iron: 1.7, calcium: 15, vitC: 0, sugar: 0 } },
  { name: 'Pork chop', groups: ['Protein'], nutrients: { carbs: 0, protein: 27, fat: 10, fibre: 0, iron: 0.9, calcium: 19, vitC: 0, sugar: 0 } },
  { name: 'Pork loin', groups: ['Protein'], nutrients: { carbs: 0, protein: 27, fat: 8, fibre: 0, iron: 0.8, calcium: 5, vitC: 0, sugar: 0 } },
  { name: 'Bacon', groups: ['Protein'], nutrients: { carbs: 0, protein: 12, fat: 14, fibre: 0, iron: 0.4, calcium: 5, vitC: 0, sugar: 0 }, unhealthy: true },
  { name: 'Ham', groups: ['Protein'], nutrients: { carbs: 2, protein: 18, fat: 5, fibre: 0, iron: 0.9, calcium: 7, vitC: 0, sugar: 1 } },
  { name: 'Sausages (pork)', groups: ['Protein'], nutrients: { carbs: 2, protein: 14, fat: 22, fibre: 0, iron: 1.0, calcium: 10, vitC: 0, sugar: 1 } },
  { name: 'Chorizo', groups: ['Protein'], nutrients: { carbs: 2, protein: 24, fat: 38, fibre: 0, iron: 1.8, calcium: 15, vitC: 0, sugar: 1 } },
  { name: 'Salami', groups: ['Protein'], nutrients: { carbs: 1, protein: 22, fat: 34, fibre: 0, iron: 1.5, calcium: 10, vitC: 0, sugar: 0 } },
  { name: 'Pepperoni', groups: ['Protein'], nutrients: { carbs: 1, protein: 22, fat: 40, fibre: 0, iron: 1.2, calcium: 8, vitC: 1, sugar: 1 } },
  { name: 'Venison', groups: ['Protein'], nutrients: { carbs: 0, protein: 30, fat: 3, fibre: 0, iron: 3.4, calcium: 5, vitC: 0, sugar: 0 } },
  { name: 'Liver', groups: ['Protein'], nutrients: { carbs: 4, protein: 21, fat: 4, fibre: 0, iron: 6.5, calcium: 5, vitC: 23, sugar: 0 } },
  // ── Fish & Seafood ──
  { name: 'Salmon', groups: ['Protein'], nutrients: { carbs: 0, protein: 25, fat: 13, fibre: 0, iron: 0.8, calcium: 12, vitC: 0, sugar: 0 } },
  { name: 'Tuna', groups: ['Protein'], nutrients: { carbs: 0, protein: 26, fat: 1, fibre: 0, iron: 1.0, calcium: 10, vitC: 0, sugar: 0 } },
  { name: 'Cod', groups: ['Protein'], nutrients: { carbs: 0, protein: 23, fat: 1, fibre: 0, iron: 0.4, calcium: 16, vitC: 0, sugar: 0 } },
  { name: 'Haddock', groups: ['Protein'], nutrients: { carbs: 0, protein: 24, fat: 1, fibre: 0, iron: 1.2, calcium: 36, vitC: 0, sugar: 0 } },
  { name: 'Sea bass', groups: ['Protein'], nutrients: { carbs: 0, protein: 24, fat: 3, fibre: 0, iron: 0.4, calcium: 10, vitC: 0, sugar: 0 } },
  { name: 'Trout', groups: ['Protein'], nutrients: { carbs: 0, protein: 23, fat: 7, fibre: 0, iron: 0.7, calcium: 67, vitC: 0, sugar: 0 } },
  { name: 'Mackerel', groups: ['Protein'], nutrients: { carbs: 0, protein: 24, fat: 17, fibre: 0, iron: 1.6, calcium: 12, vitC: 0, sugar: 0 } },
  { name: 'Sardines', groups: ['Protein'], nutrients: { carbs: 0, protein: 25, fat: 11, fibre: 0, iron: 2.9, calcium: 382, vitC: 0, sugar: 0 } },
  { name: 'Anchovies', groups: ['Protein'], nutrients: { carbs: 0, protein: 29, fat: 10, fibre: 0, iron: 4.6, calcium: 147, vitC: 0, sugar: 0 } },
  { name: 'Prawns', groups: ['Protein'], nutrients: { carbs: 0, protein: 24, fat: 1, fibre: 0, iron: 2.4, calcium: 70, vitC: 0, sugar: 0 } },
  { name: 'Crab', groups: ['Protein'], nutrients: { carbs: 0, protein: 19, fat: 2, fibre: 0, iron: 0.7, calcium: 46, vitC: 0, sugar: 0 } },
  { name: 'Lobster', groups: ['Protein'], nutrients: { carbs: 0, protein: 20, fat: 1, fibre: 0, iron: 0.3, calcium: 96, vitC: 0, sugar: 0 } },
  { name: 'Mussels', groups: ['Protein'], nutrients: { carbs: 4, protein: 24, fat: 4, fibre: 0, iron: 6.7, calcium: 33, vitC: 0, sugar: 0 } },
  { name: 'Squid/calamari', groups: ['Protein'], nutrients: { carbs: 3, protein: 18, fat: 2, fibre: 0, iron: 1.1, calcium: 32, vitC: 5, sugar: 0 } },
  { name: 'Fish fingers', groups: ['Protein', 'Grains'], nutrients: { carbs: 15, protein: 12, fat: 8, fibre: 1, iron: 0.5, calcium: 20, vitC: 0, sugar: 1 } },
  { name: 'Fish cake', groups: ['Protein', 'Grains'], nutrients: { carbs: 14, protein: 10, fat: 7, fibre: 1, iron: 0.5, calcium: 30, vitC: 0, sugar: 1 } },
  { name: 'Smoked salmon', groups: ['Protein'], nutrients: { carbs: 0, protein: 22, fat: 8, fibre: 0, iron: 0.9, calcium: 11, vitC: 0, sugar: 0 } },
  // ── Eggs & Dairy ──
  { name: 'Eggs', groups: ['Protein', 'Dairy'], nutrients: { carbs: 1, protein: 13, fat: 11, fibre: 0, iron: 1.8, calcium: 56, vitC: 0, sugar: 1 } },
  { name: 'Scrambled eggs', groups: ['Protein', 'Dairy'], nutrients: { carbs: 2, protein: 12, fat: 14, fibre: 0, iron: 1.5, calcium: 60, vitC: 0, sugar: 1 } },
  { name: 'Omelette', groups: ['Protein', 'Dairy'], nutrients: { carbs: 1, protein: 11, fat: 12, fibre: 0, iron: 1.6, calcium: 50, vitC: 0, sugar: 1 } },
  { name: 'Milk', groups: ['Dairy'], nutrients: { carbs: 12, protein: 8, fat: 8, fibre: 0, iron: 0.1, calcium: 300, vitC: 2, sugar: 5 } },
  { name: 'Skimmed milk', groups: ['Dairy'], nutrients: { carbs: 12, protein: 9, fat: 0, fibre: 0, iron: 0.1, calcium: 310, vitC: 2, sugar: 5 } },
  { name: 'Oat milk', groups: ['Dairy'], nutrients: { carbs: 16, protein: 3, fat: 5, fibre: 2, iron: 0.2, calcium: 350, vitC: 0, sugar: 4 } },
  { name: 'Almond milk', groups: ['Dairy'], nutrients: { carbs: 3, protein: 1, fat: 3, fibre: 0, iron: 0.3, calcium: 300, vitC: 0, sugar: 0 } },
  { name: 'Soya milk', groups: ['Dairy'], nutrients: { carbs: 4, protein: 7, fat: 4, fibre: 1, iron: 0.4, calcium: 300, vitC: 0, sugar: 2 } },
  { name: 'Yoghurt', groups: ['Dairy'], nutrients: { carbs: 12, protein: 10, fat: 4, fibre: 0, iron: 0.1, calcium: 200, vitC: 1, sugar: 4 } },
  { name: 'Greek yoghurt', groups: ['Dairy'], nutrients: { carbs: 4, protein: 10, fat: 5, fibre: 0, iron: 0.1, calcium: 110, vitC: 0, sugar: 4 } },
  { name: 'Kefir', groups: ['Dairy'], nutrients: { carbs: 4, protein: 3, fat: 2, fibre: 0, iron: 0.1, calcium: 130, vitC: 0, sugar: 4 } },
  { name: 'Cheese', groups: ['Dairy'], nutrients: { carbs: 1, protein: 7, fat: 9, fibre: 0, iron: 0.2, calcium: 200, vitC: 0, sugar: 0 } },
  { name: 'Cheddar cheese', groups: ['Dairy'], nutrients: { carbs: 1, protein: 25, fat: 33, fibre: 0, iron: 0.7, calcium: 720, vitC: 0, sugar: 0 } },
  { name: 'Mozzarella', groups: ['Dairy'], nutrients: { carbs: 2, protein: 22, fat: 22, fibre: 0, iron: 0.4, calcium: 505, vitC: 0, sugar: 1 } },
  { name: 'Cream cheese', groups: ['Dairy'], nutrients: { carbs: 4, protein: 6, fat: 34, fibre: 0, iron: 0.4, calcium: 80, vitC: 0, sugar: 4 } },
  { name: 'Cottage cheese', groups: ['Dairy'], nutrients: { carbs: 3, protein: 11, fat: 4, fibre: 0, iron: 0.1, calcium: 73, vitC: 0, sugar: 3 } },
  { name: 'Butter', groups: ['Dairy'], nutrients: { carbs: 0, protein: 0, fat: 12, fibre: 0, iron: 0, calcium: 3, vitC: 0, sugar: 0 } },
  { name: 'Cream', groups: ['Dairy'], nutrients: { carbs: 3, protein: 2, fat: 37, fibre: 0, iron: 0, calcium: 65, vitC: 1, sugar: 3 }, unhealthy: true },
  { name: 'Ice cream', groups: ['Dairy'], nutrients: { carbs: 24, protein: 4, fat: 11, fibre: 0, iron: 0.1, calcium: 130, vitC: 1, sugar: 21 }, unhealthy: true },
  // ── Grains & Carbs ──
  { name: 'Rice', groups: ['Grains'], nutrients: { carbs: 45, protein: 4, fat: 0, fibre: 1, iron: 0.4, calcium: 10, vitC: 0, sugar: 0 } },
  { name: 'Brown rice', groups: ['Grains'], nutrients: { carbs: 45, protein: 5, fat: 2, fibre: 4, iron: 0.8, calcium: 10, vitC: 0, sugar: 0 } },
  { name: 'Pasta', groups: ['Grains'], nutrients: { carbs: 43, protein: 8, fat: 1, fibre: 2, iron: 1.3, calcium: 7, vitC: 0, sugar: 2 } },
  { name: 'Wholemeal pasta', groups: ['Grains'], nutrients: { carbs: 37, protein: 7, fat: 1, fibre: 5, iron: 1.5, calcium: 15, vitC: 0, sugar: 2 } },
  { name: 'Bread (white)', groups: ['Grains'], nutrients: { carbs: 22, protein: 3, fat: 1, fibre: 1, iron: 0.7, calcium: 30, vitC: 0, sugar: 3 } },
  { name: 'Bread (wholemeal)', groups: ['Grains'], nutrients: { carbs: 20, protein: 4, fat: 1, fibre: 3, iron: 1.0, calcium: 20, vitC: 0, sugar: 3 } },
  { name: 'Sourdough bread', groups: ['Grains'], nutrients: { carbs: 25, protein: 4, fat: 1, fibre: 2, iron: 0.8, calcium: 15, vitC: 0, sugar: 2 } },
  { name: 'Pitta bread', groups: ['Grains'], nutrients: { carbs: 33, protein: 5, fat: 1, fibre: 2, iron: 1.2, calcium: 50, vitC: 0, sugar: 2 } },
  { name: 'Naan bread', groups: ['Grains'], nutrients: { carbs: 50, protein: 9, fat: 9, fibre: 2, iron: 2.0, calcium: 50, vitC: 0, sugar: 3 } },
  { name: 'Bagel', groups: ['Grains'], nutrients: { carbs: 50, protein: 10, fat: 2, fibre: 2, iron: 2.5, calcium: 20, vitC: 0, sugar: 5 } },
  { name: 'Croissant', groups: ['Grains', 'Dairy'], nutrients: { carbs: 26, protein: 5, fat: 12, fibre: 1, iron: 1.0, calcium: 20, vitC: 0, sugar: 6 }, unhealthy: true },
  { name: 'Oats', groups: ['Grains'], nutrients: { carbs: 27, protein: 5, fat: 3, fibre: 4, iron: 1.7, calcium: 20, vitC: 0, sugar: 1 } },
  { name: 'Weetabix', groups: ['Grains'], nutrients: { carbs: 30, protein: 5, fat: 1, fibre: 4, iron: 4.5, calcium: 20, vitC: 0, sugar: 2 } },
  { name: 'Weetabix Minis (chocolate)', groups: ['Grains'], nutrients: { carbs: 36, protein: 4, fat: 3, fibre: 3, iron: 4.0, calcium: 20, vitC: 0, sugar: 17 }, unhealthy: true },
  { name: 'Weetabix Protein', groups: ['Grains', 'Protein'], nutrients: { carbs: 28, protein: 8, fat: 2, fibre: 4, iron: 5.0, calcium: 25, vitC: 0, sugar: 3 } },
  { name: 'Granola', groups: ['Grains'], nutrients: { carbs: 28, protein: 4, fat: 8, fibre: 3, iron: 1.5, calcium: 25, vitC: 0, sugar: 14 } },
  { name: 'Muesli', groups: ['Grains'], nutrients: { carbs: 30, protein: 4, fat: 3, fibre: 4, iron: 2.0, calcium: 30, vitC: 0, sugar: 11 } },
  { name: 'Crunchy Nut Cornflakes', groups: ['Grains'], nutrients: { carbs: 38, protein: 3, fat: 2, fibre: 1, iron: 4.2, calcium: 5, vitC: 0, sugar: 17 }, unhealthy: true },
  { name: 'Cornflakes', groups: ['Grains'], nutrients: { carbs: 36, protein: 3, fat: 0, fibre: 1, iron: 4.0, calcium: 4, vitC: 0, sugar: 8 } },
  { name: 'Coco Pops', groups: ['Grains'], nutrients: { carbs: 38, protein: 2, fat: 1, fibre: 1, iron: 4.5, calcium: 10, vitC: 0, sugar: 35 }, unhealthy: true },
  { name: 'Rice Krispies', groups: ['Grains'], nutrients: { carbs: 37, protein: 3, fat: 0, fibre: 0, iron: 4.0, calcium: 4, vitC: 0, sugar: 10 } },
  { name: 'Frosties', groups: ['Grains'], nutrients: { carbs: 39, protein: 2, fat: 0, fibre: 1, iron: 4.0, calcium: 3, vitC: 0, sugar: 37 }, unhealthy: true },
  { name: 'Cheerios', groups: ['Grains'], nutrients: { carbs: 32, protein: 4, fat: 2, fibre: 3, iron: 5.0, calcium: 130, vitC: 0, sugar: 5 } },
  { name: 'Honey Cheerios', groups: ['Grains'], nutrients: { carbs: 35, protein: 3, fat: 2, fibre: 3, iron: 5.0, calcium: 130, vitC: 0, sugar: 24 }, unhealthy: true },
  { name: 'Shreddies', groups: ['Grains'], nutrients: { carbs: 33, protein: 4, fat: 1, fibre: 5, iron: 4.5, calcium: 20, vitC: 0, sugar: 7 } },
  { name: 'Coco Shreddies', groups: ['Grains'], nutrients: { carbs: 35, protein: 3, fat: 2, fibre: 4, iron: 4.5, calcium: 20, vitC: 0, sugar: 16 }, unhealthy: true },
  { name: 'Frosted Shreddies', groups: ['Grains'], nutrients: { carbs: 36, protein: 3, fat: 1, fibre: 4, iron: 4.5, calcium: 20, vitC: 0, sugar: 18 }, unhealthy: true },
  { name: 'Special K', groups: ['Grains'], nutrients: { carbs: 33, protein: 5, fat: 1, fibre: 1, iron: 5.6, calcium: 20, vitC: 0, sugar: 9 } },
  { name: 'Special K Protein', groups: ['Grains', 'Protein'], nutrients: { carbs: 28, protein: 10, fat: 2, fibre: 3, iron: 5.0, calcium: 25, vitC: 0, sugar: 5 } },
  { name: 'Bran Flakes', groups: ['Grains'], nutrients: { carbs: 30, protein: 4, fat: 1, fibre: 6, iron: 6.0, calcium: 20, vitC: 0, sugar: 7 } },
  { name: 'All-Bran', groups: ['Grains'], nutrients: { carbs: 24, protein: 6, fat: 2, fibre: 11, iron: 5.0, calcium: 25, vitC: 0, sugar: 13 } },
  { name: 'Fruit & Fibre', groups: ['Grains', 'Fruit'], nutrients: { carbs: 32, protein: 3, fat: 3, fibre: 4, iron: 4.5, calcium: 15, vitC: 0, sugar: 16 } },
  { name: 'Crunchy Nut Clusters', groups: ['Grains'], nutrients: { carbs: 34, protein: 4, fat: 6, fibre: 2, iron: 3.5, calcium: 10, vitC: 0, sugar: 22 }, unhealthy: true },
  { name: 'Cookie Crisp', groups: ['Grains'], nutrients: { carbs: 38, protein: 2, fat: 3, fibre: 2, iron: 4.0, calcium: 130, vitC: 0, sugar: 25 }, unhealthy: true },
  { name: 'Golden Nuggets', groups: ['Grains'], nutrients: { carbs: 38, protein: 2, fat: 1, fibre: 1, iron: 4.0, calcium: 5, vitC: 0, sugar: 30 }, unhealthy: true },
  { name: 'Sugar Puffs / Honey Monster Puffs', groups: ['Grains'], nutrients: { carbs: 37, protein: 3, fat: 1, fibre: 2, iron: 4.0, calcium: 10, vitC: 0, sugar: 29 }, unhealthy: true },
  { name: 'Raisin Bran', groups: ['Grains', 'Fruit'], nutrients: { carbs: 35, protein: 3, fat: 1, fibre: 5, iron: 5.0, calcium: 20, vitC: 0, sugar: 19 } },
  { name: 'Lucky Charms', groups: ['Grains'], nutrients: { carbs: 37, protein: 2, fat: 1, fibre: 1, iron: 4.5, calcium: 130, vitC: 0, sugar: 37 }, unhealthy: true },
  { name: 'Curiously Cinnamon', groups: ['Grains'], nutrients: { carbs: 36, protein: 2, fat: 4, fibre: 2, iron: 4.0, calcium: 130, vitC: 0, sugar: 26 }, unhealthy: true },
  { name: 'Krave', groups: ['Grains'], nutrients: { carbs: 33, protein: 3, fat: 6, fibre: 2, iron: 4.5, calcium: 130, vitC: 0, sugar: 24 }, unhealthy: true },
  { name: 'Lion Cereal', groups: ['Grains'], nutrients: { carbs: 37, protein: 2, fat: 3, fibre: 2, iron: 4.5, calcium: 130, vitC: 0, sugar: 25 }, unhealthy: true },
  { name: 'Nesquik Cereal', groups: ['Grains'], nutrients: { carbs: 37, protein: 2, fat: 2, fibre: 2, iron: 4.5, calcium: 130, vitC: 0, sugar: 27 }, unhealthy: true },
  { name: 'Frosted Flakes', groups: ['Grains'], nutrients: { carbs: 39, protein: 2, fat: 0, fibre: 1, iron: 4.0, calcium: 3, vitC: 0, sugar: 37 }, unhealthy: true },
  { name: 'Corn Chex', groups: ['Grains'], nutrients: { carbs: 37, protein: 2, fat: 0, fibre: 1, iron: 6.0, calcium: 100, vitC: 0, sugar: 8 } },
  { name: 'Grape Nuts', groups: ['Grains'], nutrients: { carbs: 32, protein: 4, fat: 1, fibre: 3, iron: 5.0, calcium: 15, vitC: 0, sugar: 7 } },
  { name: 'Shredded Wheat', groups: ['Grains'], nutrients: { carbs: 31, protein: 5, fat: 1, fibre: 5, iron: 1.5, calcium: 15, vitC: 0, sugar: 1 } },
  { name: 'Shredded Wheat Bitesize', groups: ['Grains'], nutrients: { carbs: 31, protein: 5, fat: 1, fibre: 5, iron: 1.5, calcium: 15, vitC: 0, sugar: 1 } },
  { name: 'Harvest Morn / Aldi Granola', groups: ['Grains'], nutrients: { carbs: 28, protein: 4, fat: 7, fibre: 3, iron: 1.5, calcium: 20, vitC: 0, sugar: 12 } },
  { name: 'Alpen', groups: ['Grains'], nutrients: { carbs: 30, protein: 4, fat: 3, fibre: 3, iron: 2.5, calcium: 30, vitC: 0, sugar: 17 } },
  { name: 'Alpen No Added Sugar', groups: ['Grains'], nutrients: { carbs: 28, protein: 5, fat: 4, fibre: 4, iron: 2.5, calcium: 30, vitC: 0, sugar: 8 } },
  { name: 'Jordan\'s Country Crisp', groups: ['Grains'], nutrients: { carbs: 29, protein: 4, fat: 8, fibre: 3, iron: 1.5, calcium: 20, vitC: 0, sugar: 12 } },
  { name: 'Dorset Cereals Muesli', groups: ['Grains'], nutrients: { carbs: 28, protein: 5, fat: 4, fibre: 4, iron: 2.0, calcium: 30, vitC: 0, sugar: 10 } },
  { name: 'Puffed Wheat', groups: ['Grains'], nutrients: { carbs: 31, protein: 6, fat: 1, fibre: 3, iron: 1.5, calcium: 10, vitC: 0, sugar: 1 } },
  { name: 'Puffed Rice', groups: ['Grains'], nutrients: { carbs: 37, protein: 3, fat: 0, fibre: 0, iron: 0.5, calcium: 5, vitC: 0, sugar: 0 } },
  { name: 'Choco Pillows', groups: ['Grains'], nutrients: { carbs: 35, protein: 3, fat: 5, fibre: 2, iron: 4.0, calcium: 15, vitC: 0, sugar: 28 }, unhealthy: true },
  { name: 'Weetos', groups: ['Grains'], nutrients: { carbs: 35, protein: 3, fat: 2, fibre: 3, iron: 4.5, calcium: 20, vitC: 0, sugar: 22 }, unhealthy: true },
  { name: 'Ready Brek', groups: ['Grains'], nutrients: { carbs: 27, protein: 5, fat: 4, fibre: 4, iron: 4.5, calcium: 20, vitC: 0, sugar: 1 } },
  { name: 'Overnight oats', groups: ['Grains', 'Dairy'], nutrients: { carbs: 22, protein: 6, fat: 5, fibre: 4, iron: 1.5, calcium: 100, vitC: 0, sugar: 5 } },
  { name: 'Instant oat sachets', groups: ['Grains'], nutrients: { carbs: 30, protein: 4, fat: 3, fibre: 3, iron: 3.5, calcium: 15, vitC: 0, sugar: 12 } },
  { name: 'Granola (chocolate)', groups: ['Grains'], nutrients: { carbs: 30, protein: 4, fat: 9, fibre: 3, iron: 1.5, calcium: 25, vitC: 0, sugar: 18 }, unhealthy: true },
  { name: 'Granola (nut)', groups: ['Grains', 'Protein'], nutrients: { carbs: 26, protein: 5, fat: 10, fibre: 3, iron: 1.5, calcium: 30, vitC: 0, sugar: 12 } },
  { name: 'Granola (berry)', groups: ['Grains', 'Fruit'], nutrients: { carbs: 29, protein: 4, fat: 7, fibre: 3, iron: 1.5, calcium: 20, vitC: 1, sugar: 13 } },
  { name: 'Protein granola', groups: ['Grains', 'Protein'], nutrients: { carbs: 24, protein: 10, fat: 8, fibre: 4, iron: 2.0, calcium: 30, vitC: 0, sugar: 10 } },
  { name: 'Muesli (no added sugar)', groups: ['Grains'], nutrients: { carbs: 26, protein: 5, fat: 4, fibre: 5, iron: 2.0, calcium: 30, vitC: 0, sugar: 8 } },
  { name: 'Bircher muesli', groups: ['Grains', 'Dairy', 'Fruit'], nutrients: { carbs: 22, protein: 4, fat: 4, fibre: 3, iron: 1.5, calcium: 80, vitC: 3, sugar: 10 } },
  { name: 'Wrap/tortilla', groups: ['Grains'], nutrients: { carbs: 30, protein: 4, fat: 3, fibre: 2, iron: 1.2, calcium: 40, vitC: 0, sugar: 2 } },
  { name: 'Couscous', groups: ['Grains'], nutrients: { carbs: 36, protein: 6, fat: 0, fibre: 2, iron: 0.4, calcium: 8, vitC: 0, sugar: 0 } },
  { name: 'Quinoa', groups: ['Grains', 'Protein'], nutrients: { carbs: 21, protein: 4, fat: 2, fibre: 3, iron: 1.5, calcium: 17, vitC: 0, sugar: 1 } },
  { name: 'Bulgur wheat', groups: ['Grains'], nutrients: { carbs: 34, protein: 6, fat: 0, fibre: 5, iron: 1.0, calcium: 10, vitC: 0, sugar: 0 } },
  { name: 'Noodles', groups: ['Grains'], nutrients: { carbs: 25, protein: 5, fat: 1, fibre: 1, iron: 0.5, calcium: 7, vitC: 0, sugar: 0 } },
  { name: 'Egg noodles', groups: ['Grains'], nutrients: { carbs: 25, protein: 5, fat: 2, fibre: 1, iron: 1.5, calcium: 10, vitC: 0, sugar: 0 } },
  { name: 'Rice noodles', groups: ['Grains'], nutrients: { carbs: 24, protein: 1, fat: 0, fibre: 1, iron: 0.2, calcium: 4, vitC: 0, sugar: 0 } },
  { name: 'Crackers', groups: ['Grains'], nutrients: { carbs: 15, protein: 2, fat: 3, fibre: 1, iron: 0.5, calcium: 10, vitC: 0, sugar: 2 } },
  { name: 'Rice cakes', groups: ['Grains'], nutrients: { carbs: 23, protein: 2, fat: 1, fibre: 1, iron: 0.2, calcium: 3, vitC: 0, sugar: 1 } },
  { name: 'Pancakes', groups: ['Grains', 'Dairy'], nutrients: { carbs: 28, protein: 6, fat: 8, fibre: 1, iron: 1.2, calcium: 80, vitC: 0, sugar: 7 }, unhealthy: true },
  { name: 'Waffles', groups: ['Grains', 'Dairy'], nutrients: { carbs: 33, protein: 6, fat: 10, fibre: 1, iron: 1.5, calcium: 90, vitC: 0, sugar: 10 }, unhealthy: true },
  { name: 'Toast', groups: ['Grains'], nutrients: { carbs: 20, protein: 3, fat: 1, fibre: 2, iron: 0.8, calcium: 20, vitC: 0, sugar: 3 } },
  { name: 'Crumpets', groups: ['Grains'], nutrients: { carbs: 30, protein: 4, fat: 1, fibre: 2, iron: 1.0, calcium: 40, vitC: 0, sugar: 3 } },
  { name: 'Porridge', groups: ['Grains', 'Dairy'], nutrients: { carbs: 20, protein: 5, fat: 4, fibre: 3, iron: 1.2, calcium: 120, vitC: 0, sugar: 1 } },
  // ── Nuts & Seeds ──
  { name: 'Peanut butter', groups: ['Protein'], nutrients: { carbs: 6, protein: 8, fat: 16, fibre: 2, iron: 0.6, calcium: 14, vitC: 0, sugar: 6 } },
  { name: 'Almond butter', groups: ['Protein'], nutrients: { carbs: 6, protein: 7, fat: 18, fibre: 3, iron: 1.1, calcium: 60, vitC: 0, sugar: 4 } },
  { name: 'Peanuts', groups: ['Protein'], nutrients: { carbs: 8, protein: 7, fat: 14, fibre: 2, iron: 1.3, calcium: 26, vitC: 0, sugar: 4 } },
  { name: 'Almonds', groups: ['Protein'], nutrients: { carbs: 6, protein: 6, fat: 14, fibre: 4, iron: 1.0, calcium: 70, vitC: 0, sugar: 4 } },
  { name: 'Walnuts', groups: ['Protein'], nutrients: { carbs: 3, protein: 4, fat: 18, fibre: 2, iron: 0.8, calcium: 28, vitC: 0, sugar: 3 } },
  { name: 'Cashews', groups: ['Protein'], nutrients: { carbs: 9, protein: 5, fat: 13, fibre: 1, iron: 1.9, calcium: 12, vitC: 0, sugar: 5 } },
  { name: 'Pistachios', groups: ['Protein'], nutrients: { carbs: 8, protein: 6, fat: 13, fibre: 3, iron: 1.1, calcium: 30, vitC: 1, sugar: 8 } },
  { name: 'Hazelnuts', groups: ['Protein'], nutrients: { carbs: 5, protein: 4, fat: 17, fibre: 3, iron: 1.3, calcium: 32, vitC: 2, sugar: 4 } },
  { name: 'Brazil nuts', groups: ['Protein'], nutrients: { carbs: 3, protein: 4, fat: 19, fibre: 2, iron: 0.7, calcium: 45, vitC: 0, sugar: 2 } },
  { name: 'Pecans', groups: ['Protein'], nutrients: { carbs: 4, protein: 3, fat: 20, fibre: 3, iron: 0.7, calcium: 20, vitC: 0, sugar: 4 } },
  { name: 'Macadamia nuts', groups: ['Protein'], nutrients: { carbs: 4, protein: 2, fat: 21, fibre: 2, iron: 1.1, calcium: 24, vitC: 0, sugar: 5 } },
  { name: 'Pine nuts', groups: ['Protein'], nutrients: { carbs: 4, protein: 4, fat: 19, fibre: 1, iron: 1.6, calcium: 5, vitC: 0, sugar: 4 } },
  { name: 'Pumpkin seeds', groups: ['Protein'], nutrients: { carbs: 4, protein: 8, fat: 14, fibre: 2, iron: 2.5, calcium: 14, vitC: 1, sugar: 1 } },
  { name: 'Sunflower seeds', groups: ['Protein'], nutrients: { carbs: 6, protein: 6, fat: 14, fibre: 2, iron: 1.5, calcium: 22, vitC: 0, sugar: 3 } },
  { name: 'Chia seeds', groups: ['Protein'], nutrients: { carbs: 12, protein: 5, fat: 9, fibre: 10, iron: 2.2, calcium: 179, vitC: 0, sugar: 0 } },
  { name: 'Flaxseeds', groups: ['Protein'], nutrients: { carbs: 8, protein: 5, fat: 12, fibre: 8, iron: 1.6, calcium: 72, vitC: 0, sugar: 2 } },
  { name: 'Sesame seeds', groups: ['Protein'], nutrients: { carbs: 7, protein: 5, fat: 14, fibre: 3, iron: 4.1, calcium: 277, vitC: 0, sugar: 0 } },
  { name: 'Hemp seeds', groups: ['Protein'], nutrients: { carbs: 2, protein: 10, fat: 14, fibre: 1, iron: 2.4, calcium: 21, vitC: 0, sugar: 1 } },
  { name: 'Poppy seeds', groups: ['Protein'], nutrients: { carbs: 8, protein: 5, fat: 13, fibre: 5, iron: 2.7, calcium: 400, vitC: 0, sugar: 3 } },
  { name: 'Mixed nuts', groups: ['Protein'], nutrients: { carbs: 6, protein: 5, fat: 16, fibre: 3, iron: 1.0, calcium: 40, vitC: 0, sugar: 4 } },
  { name: 'Coconut (desiccated)', groups: ['Protein'], nutrients: { carbs: 6, protein: 2, fat: 18, fibre: 5, iron: 1.0, calcium: 8, vitC: 0, sugar: 6 } },
  // ── Legumes ──
  { name: 'Beans', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 22, protein: 8, fat: 1, fibre: 7, iron: 2.1, calcium: 40, vitC: 2, sugar: 2 } },
  { name: 'Baked beans', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 16, protein: 5, fat: 1, fibre: 4, iron: 1.4, calcium: 50, vitC: 0, sugar: 5 } },
  { name: 'Kidney beans', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 23, protein: 9, fat: 0, fibre: 7, iron: 2.9, calcium: 35, vitC: 1, sugar: 2 } },
  { name: 'Chickpeas', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 27, protein: 9, fat: 3, fibre: 8, iron: 2.9, calcium: 49, vitC: 1, sugar: 3 } },
  { name: 'Lentils', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 20, protein: 9, fat: 0, fibre: 8, iron: 3.3, calcium: 19, vitC: 2, sugar: 2 } },
  { name: 'Black beans', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 24, protein: 9, fat: 1, fibre: 9, iron: 2.1, calcium: 27, vitC: 0, sugar: 1 } },
  { name: 'Butter beans', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 20, protein: 8, fat: 0, fibre: 7, iron: 2.4, calcium: 32, vitC: 0, sugar: 1 } },
  { name: 'Hummus', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 14, protein: 8, fat: 10, fibre: 6, iron: 1.6, calcium: 38, vitC: 0, sugar: 0 } },
  { name: 'Tofu', groups: ['Protein'], nutrients: { carbs: 2, protein: 8, fat: 5, fibre: 1, iron: 5.4, calcium: 350, vitC: 0, sugar: 1 } },
  { name: 'Tempeh', groups: ['Protein'], nutrients: { carbs: 9, protein: 19, fat: 11, fibre: 5, iron: 2.7, calcium: 111, vitC: 0, sugar: 0 } },
  // ── Prepared meals & snacks ──
  { name: 'Pizza', groups: ['Grains', 'Dairy', 'Protein'], nutrients: { carbs: 33, protein: 12, fat: 10, fibre: 2, iron: 1.5, calcium: 150, vitC: 2, sugar: 4 }, unhealthy: true },
  { name: 'Chips/fries', groups: ['Grains'], nutrients: { carbs: 30, protein: 3, fat: 15, fibre: 3, iron: 0.6, calcium: 10, vitC: 5, sugar: 0 }, unhealthy: true },
  { name: 'Jacket potato', groups: ['Vegetables', 'Grains'], nutrients: { carbs: 30, protein: 4, fat: 0, fibre: 4, iron: 1.2, calcium: 15, vitC: 15, sugar: 1 } },
  { name: 'Mashed potato', groups: ['Vegetables', 'Dairy'], nutrients: { carbs: 15, protein: 2, fat: 4, fibre: 1, iron: 0.3, calcium: 20, vitC: 8, sugar: 1 } },
  { name: 'Soup', groups: ['Vegetables'], nutrients: { carbs: 10, protein: 3, fat: 2, fibre: 2, iron: 0.5, calcium: 20, vitC: 5, sugar: 3 } },
  { name: 'Stir fry', groups: ['Vegetables', 'Protein'], nutrients: { carbs: 12, protein: 15, fat: 8, fibre: 3, iron: 1.5, calcium: 30, vitC: 20, sugar: 3 } },
  { name: 'Curry', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 15, protein: 14, fat: 12, fibre: 3, iron: 1.5, calcium: 40, vitC: 5, sugar: 4 } },
  { name: 'Chilli con carne', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 18, protein: 16, fat: 10, fibre: 5, iron: 2.5, calcium: 45, vitC: 8, sugar: 3 } },
  { name: 'Spaghetti bolognese', groups: ['Grains', 'Protein'], nutrients: { carbs: 40, protein: 18, fat: 12, fibre: 3, iron: 2.5, calcium: 30, vitC: 5, sugar: 4 } },
  { name: 'Lasagne', groups: ['Grains', 'Protein', 'Dairy'], nutrients: { carbs: 25, protein: 14, fat: 12, fibre: 2, iron: 1.5, calcium: 150, vitC: 3, sugar: 3 } },
  { name: 'Mac and cheese', groups: ['Grains', 'Dairy'], nutrients: { carbs: 30, protein: 10, fat: 15, fibre: 1, iron: 0.8, calcium: 200, vitC: 0, sugar: 2 }, unhealthy: true },
  { name: 'Shepherd\'s pie', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 20, protein: 12, fat: 10, fibre: 3, iron: 1.5, calcium: 30, vitC: 10, sugar: 3 } },
  { name: 'Fish and chips', groups: ['Protein', 'Grains'], nutrients: { carbs: 40, protein: 20, fat: 20, fibre: 3, iron: 1.0, calcium: 30, vitC: 5, sugar: 1 }, unhealthy: true },
  { name: 'Burger', groups: ['Protein', 'Grains'], nutrients: { carbs: 25, protein: 20, fat: 18, fibre: 2, iron: 2.5, calcium: 40, vitC: 2, sugar: 5 }, unhealthy: true },
  { name: 'Hot dog', groups: ['Protein', 'Grains'], nutrients: { carbs: 22, protein: 10, fat: 15, fibre: 1, iron: 1.0, calcium: 20, vitC: 0, sugar: 4 }, unhealthy: true },
  { name: 'Sandwich', groups: ['Grains', 'Protein'], nutrients: { carbs: 30, protein: 12, fat: 8, fibre: 3, iron: 1.5, calcium: 50, vitC: 3, sugar: 3 } },
  { name: 'Wrap (filled)', groups: ['Grains', 'Protein', 'Vegetables'], nutrients: { carbs: 35, protein: 15, fat: 10, fibre: 3, iron: 1.5, calcium: 50, vitC: 5, sugar: 3 } },
  { name: 'Sushi', groups: ['Grains', 'Protein'], nutrients: { carbs: 30, protein: 8, fat: 2, fibre: 1, iron: 0.5, calcium: 10, vitC: 0, sugar: 5 } },
  { name: 'Fried rice', groups: ['Grains', 'Vegetables'], nutrients: { carbs: 40, protein: 8, fat: 10, fibre: 2, iron: 1.0, calcium: 20, vitC: 3, sugar: 1 }, unhealthy: true },
  { name: 'Roast dinner', groups: ['Protein', 'Vegetables', 'Grains'], nutrients: { carbs: 35, protein: 25, fat: 15, fibre: 5, iron: 2.5, calcium: 40, vitC: 10, sugar: 3 } },
  { name: 'Sunday roast', groups: ['Protein', 'Vegetables', 'Grains'], nutrients: { carbs: 35, protein: 25, fat: 15, fibre: 5, iron: 2.5, calcium: 40, vitC: 10, sugar: 3 } },
  { name: 'Fajitas', groups: ['Protein', 'Vegetables', 'Grains'], nutrients: { carbs: 30, protein: 18, fat: 10, fibre: 4, iron: 1.8, calcium: 50, vitC: 30, sugar: 3 } },
  { name: 'Tacos', groups: ['Protein', 'Vegetables', 'Grains'], nutrients: { carbs: 20, protein: 12, fat: 10, fibre: 3, iron: 1.5, calcium: 60, vitC: 5, sugar: 3 } },
  { name: 'Nachos', groups: ['Grains', 'Dairy'], nutrients: { carbs: 30, protein: 8, fat: 18, fibre: 3, iron: 1.0, calcium: 100, vitC: 3, sugar: 2 }, unhealthy: true },
  { name: 'Risotto', groups: ['Grains', 'Dairy'], nutrients: { carbs: 35, protein: 8, fat: 8, fibre: 1, iron: 0.5, calcium: 80, vitC: 0, sugar: 1 } },
  { name: 'Paella', groups: ['Grains', 'Protein'], nutrients: { carbs: 35, protein: 15, fat: 8, fibre: 2, iron: 1.5, calcium: 30, vitC: 5, sugar: 2 } },
  { name: 'Omelette', groups: ['Protein', 'Dairy'], nutrients: { carbs: 1, protein: 11, fat: 12, fibre: 0, iron: 1.6, calcium: 50, vitC: 0, sugar: 1 } },
  { name: 'Beans on toast', groups: ['Protein', 'Grains'], nutrients: { carbs: 35, protein: 10, fat: 2, fibre: 6, iron: 2.0, calcium: 60, vitC: 0, sugar: 5 } },
  { name: 'Cheese on toast', groups: ['Grains', 'Dairy'], nutrients: { carbs: 22, protein: 12, fat: 14, fibre: 1, iron: 0.8, calcium: 250, vitC: 0, sugar: 2 } },
  { name: 'Chicken nuggets', groups: ['Protein', 'Grains'], nutrients: { carbs: 15, protein: 15, fat: 12, fibre: 1, iron: 0.7, calcium: 15, vitC: 0, sugar: 1 }, unhealthy: true },
  { name: 'Spring rolls', groups: ['Vegetables', 'Grains'], nutrients: { carbs: 20, protein: 4, fat: 8, fibre: 2, iron: 0.5, calcium: 15, vitC: 3, sugar: 3 }, unhealthy: true },
  { name: 'Dumplings', groups: ['Grains', 'Protein'], nutrients: { carbs: 20, protein: 8, fat: 6, fibre: 1, iron: 1.0, calcium: 15, vitC: 0, sugar: 2 } },
  { name: 'Samosa', groups: ['Grains', 'Vegetables'], nutrients: { carbs: 25, protein: 4, fat: 12, fibre: 2, iron: 0.8, calcium: 15, vitC: 3, sugar: 3 }, unhealthy: true },
  // ── Snacks & treats ──
  { name: 'Granola bar', groups: ['Grains'], nutrients: { carbs: 25, protein: 3, fat: 6, fibre: 2, iron: 1.0, calcium: 20, vitC: 0, sugar: 20 } },
  { name: 'Chocolate', groups: [], nutrients: { carbs: 25, protein: 2, fat: 14, fibre: 2, iron: 1.2, calcium: 30, vitC: 0, sugar: 47 }, unhealthy: true },
  { name: 'Dark chocolate', groups: [], nutrients: { carbs: 20, protein: 3, fat: 15, fibre: 4, iron: 3.3, calcium: 40, vitC: 0, sugar: 24 }, unhealthy: true },
  { name: 'Crisps', groups: [], nutrients: { carbs: 15, protein: 2, fat: 10, fibre: 1, iron: 0.3, calcium: 5, vitC: 3, sugar: 1 }, unhealthy: true },
  { name: 'Biscuits', groups: ['Grains'], nutrients: { carbs: 20, protein: 2, fat: 8, fibre: 1, iron: 0.5, calcium: 10, vitC: 0, sugar: 22 }, unhealthy: true },
  { name: 'Cake', groups: ['Grains', 'Dairy'], nutrients: { carbs: 35, protein: 4, fat: 15, fibre: 1, iron: 1.0, calcium: 40, vitC: 0, sugar: 35 }, unhealthy: true },
  { name: 'Muffin', groups: ['Grains'], nutrients: { carbs: 35, protein: 4, fat: 12, fibre: 1, iron: 1.0, calcium: 30, vitC: 0, sugar: 30 }, unhealthy: true },
  { name: 'Flapjack', groups: ['Grains'], nutrients: { carbs: 30, protein: 3, fat: 14, fibre: 2, iron: 1.2, calcium: 20, vitC: 0, sugar: 25 }, unhealthy: true },
  { name: 'Brownie', groups: ['Grains'], nutrients: { carbs: 30, protein: 3, fat: 14, fibre: 1, iron: 1.5, calcium: 20, vitC: 0, sugar: 40 }, unhealthy: true },
  { name: 'Doughnut', groups: ['Grains'], nutrients: { carbs: 30, protein: 4, fat: 15, fibre: 1, iron: 1.0, calcium: 20, vitC: 0, sugar: 22 }, unhealthy: true },
  { name: 'Popcorn', groups: ['Grains'], nutrients: { carbs: 20, protein: 3, fat: 5, fibre: 4, iron: 0.8, calcium: 3, vitC: 0, sugar: 1 } },
  { name: 'Pretzels', groups: ['Grains'], nutrients: { carbs: 22, protein: 3, fat: 1, fibre: 1, iron: 1.0, calcium: 10, vitC: 0, sugar: 1 } },
  { name: 'Trail mix', groups: ['Protein', 'Fruit'], nutrients: { carbs: 20, protein: 5, fat: 15, fibre: 3, iron: 1.0, calcium: 30, vitC: 1, sugar: 20 } },
  { name: 'Cereal bar', groups: ['Grains'], nutrients: { carbs: 22, protein: 2, fat: 5, fibre: 2, iron: 1.0, calcium: 15, vitC: 0, sugar: 20 } },
  { name: 'Protein bar', groups: ['Protein'], nutrients: { carbs: 20, protein: 20, fat: 8, fibre: 3, iron: 2.0, calcium: 100, vitC: 0, sugar: 8 } },
  { name: 'Dried fruit', groups: ['Fruit'], nutrients: { carbs: 65, protein: 2, fat: 0, fibre: 5, iron: 1.5, calcium: 40, vitC: 2, sugar: 48 } },
  { name: 'Fruit snack', groups: ['Fruit'], nutrients: { carbs: 20, protein: 0, fat: 0, fibre: 1, iron: 0.2, calcium: 5, vitC: 10, sugar: 60 } },
  { name: 'Jelly/jello', groups: [], nutrients: { carbs: 15, protein: 1, fat: 0, fibre: 0, iron: 0, calcium: 2, vitC: 0, sugar: 12 }, unhealthy: true },
  { name: 'Sweets/candy', groups: [], nutrients: { carbs: 25, protein: 0, fat: 0, fibre: 0, iron: 0, calcium: 2, vitC: 0, sugar: 70 }, unhealthy: true },
  // ── Drinks ──
  { name: 'Smoothie', groups: ['Fruit', 'Dairy'], nutrients: { carbs: 30, protein: 5, fat: 3, fibre: 3, iron: 0.5, calcium: 100, vitC: 30, sugar: 12 } },
  { name: 'Protein shake', groups: ['Protein', 'Dairy'], nutrients: { carbs: 5, protein: 25, fat: 2, fibre: 1, iron: 2.0, calcium: 150, vitC: 0, sugar: 2 } },
  { name: 'Orange juice', groups: ['Fruit'], nutrients: { carbs: 26, protein: 1, fat: 0, fibre: 0, iron: 0.2, calcium: 11, vitC: 50, sugar: 21 } },
  { name: 'Apple juice', groups: ['Fruit'], nutrients: { carbs: 28, protein: 0, fat: 0, fibre: 0, iron: 0.1, calcium: 8, vitC: 1, sugar: 24 } },
  { name: 'Hot chocolate', groups: ['Dairy'], nutrients: { carbs: 25, protein: 5, fat: 6, fibre: 1, iron: 0.5, calcium: 150, vitC: 0, sugar: 18 }, unhealthy: true },
  { name: 'Milkshake', groups: ['Dairy'], nutrients: { carbs: 30, protein: 6, fat: 8, fibre: 0, iron: 0.2, calcium: 200, vitC: 2, sugar: 20 }, unhealthy: true },
  // ── Condiments & extras ──
  { name: 'Honey', groups: [], nutrients: { carbs: 17, protein: 0, fat: 0, fibre: 0, iron: 0.1, calcium: 1, vitC: 0, sugar: 82 } },
  { name: 'Jam', groups: [], nutrients: { carbs: 15, protein: 0, fat: 0, fibre: 0, iron: 0.1, calcium: 3, vitC: 1, sugar: 49 }, unhealthy: true },
  { name: 'Nutella', groups: [], nutrients: { carbs: 12, protein: 1, fat: 6, fibre: 1, iron: 0.5, calcium: 15, vitC: 0, sugar: 56 }, unhealthy: true },
  { name: 'Maple syrup', groups: [], nutrients: { carbs: 17, protein: 0, fat: 0, fibre: 0, iron: 0.1, calcium: 13, vitC: 0, sugar: 60 }, unhealthy: true },
  { name: 'Olive oil', groups: [], nutrients: { carbs: 0, protein: 0, fat: 14, fibre: 0, iron: 0.1, calcium: 0, vitC: 0, sugar: 0 } },
  { name: 'Coconut oil', groups: [], nutrients: { carbs: 0, protein: 0, fat: 14, fibre: 0, iron: 0, calcium: 0, vitC: 0, sugar: 0 } },
  { name: 'Ketchup', groups: [], nutrients: { carbs: 6, protein: 0, fat: 0, fibre: 0, iron: 0.1, calcium: 3, vitC: 1, sugar: 22 }, unhealthy: true },
  { name: 'Mayonnaise', groups: [], nutrients: { carbs: 1, protein: 0, fat: 11, fibre: 0, iron: 0, calcium: 2, vitC: 0, sugar: 1 }, unhealthy: true },
  { name: 'Soy sauce', groups: [], nutrients: { carbs: 1, protein: 1, fat: 0, fibre: 0, iron: 0.4, calcium: 3, vitC: 0, sugar: 0 } },
  { name: 'Pesto', groups: [], nutrients: { carbs: 2, protein: 3, fat: 14, fibre: 1, iron: 0.5, calcium: 60, vitC: 1, sugar: 1 } },
  { name: 'Salsa', groups: ['Vegetables'], nutrients: { carbs: 5, protein: 1, fat: 0, fibre: 1, iron: 0.2, calcium: 10, vitC: 5, sugar: 4 } },
  { name: 'Guacamole', groups: ['Vegetables', 'Fruit'], nutrients: { carbs: 8, protein: 2, fat: 12, fibre: 5, iron: 0.4, calcium: 10, vitC: 8, sugar: 1 } },
  { name: 'Tahini', groups: ['Protein'], nutrients: { carbs: 6, protein: 5, fat: 16, fibre: 3, iron: 2.7, calcium: 130, vitC: 0, sugar: 0 } },
]

const FOOD_GROUP_BASE = [
  { name: 'Fruit', color: '#f59e0b', icon: '🍎' },
  { name: 'Vegetables', color: '#10b981', icon: '🥦' },
  { name: 'Protein', color: '#ef4444', icon: '🥩' },
  { name: 'Grains', color: '#8b5cf6', icon: '🌾' },
  { name: 'Dairy', color: '#3b82f6', icon: '🥛' },
]

const CEREAL_NAMES = new Set([
  'Oats', 'Weetabix', 'Weetabix Minis (chocolate)', 'Weetabix Protein',
  'Granola', 'Muesli', 'Crunchy Nut Cornflakes', 'Cornflakes', 'Coco Pops',
  'Rice Krispies', 'Frosties', 'Cheerios', 'Honey Cheerios', 'Shreddies',
  'Coco Shreddies', 'Frosted Shreddies', 'Special K', 'Special K Protein',
  'Bran Flakes', 'All-Bran', 'Fruit & Fibre', 'Crunchy Nut Clusters',
  'Cookie Crisp', 'Golden Nuggets', 'Sugar Puffs / Honey Monster Puffs',
  'Raisin Bran', 'Lucky Charms', 'Curiously Cinnamon', 'Krave',
  'Lion Cereal', 'Nesquik Cereal', 'Frosted Flakes', 'Corn Chex',
  'Grape Nuts', 'Shredded Wheat', 'Shredded Wheat Bitesize',
  'Harvest Morn / Aldi Granola', 'Alpen', 'Alpen No Added Sugar',
  "Jordan's Country Crisp", 'Dorset Cereals Muesli', 'Puffed Wheat',
  'Puffed Rice', 'Choco Pillows', 'Weetos', 'Ready Brek',
  'Instant oat sachets', 'Granola (chocolate)', 'Granola (nut)',
  'Granola (berry)', 'Protein granola', 'Muesli (no added sugar)',
  'Porridge',
])

const MILK_PER_100ML = { carbs: 5, protein: 3.4, fat: 1.8, fibre: 0, iron: 0, calcium: 120, vitC: 1, sugar: 5 }


function getPersonalizedTargets(age, weightKg, trainingDaysPerWeek) {
  const isChild = age && age < 16
  const isGrowing = age && age < 19
  const w = weightKg || 70

  // Protein: 1.2g/kg sedentary, up to 1.8g/kg for heavy training
  const proteinPerKg = 1.2 + (trainingDaysPerWeek / 7) * 0.6
  const protein = Math.round(w * proteinPerKg)

  // Carbs: 4g/kg base, up to 8g/kg for heavy training runners
  const carbsPerKg = 4 + (trainingDaysPerWeek / 7) * 4
  const carbs = Math.round(w * carbsPerKg)

  // Fat: ~1g/kg
  const fat = Math.round(w * 1.0)

  // Fibre: 25-30g, slightly less for younger
  const fibre = isChild ? 20 : 30

  // Iron: higher for growing teens & runners
  const ironBase = isGrowing ? 15 : 14
  const iron = Math.round(ironBase + trainingDaysPerWeek * 0.5)

  // Calcium: higher for growing teens
  const calcium = isGrowing ? 1300 : 1000

  // Vitamin C
  const vitC = 80 + trainingDaysPerWeek * 5

  // Food group servings scale with training
  const extra = trainingDaysPerWeek >= 4 ? 1 : 0
  const activityMultiplier = 1 + (trainingDaysPerWeek / 7) * 0.3

  const foodGroups = FOOD_GROUP_BASE.map(g => {
    const servingTargets = {
      Fruit: 2 + extra,
      Vegetables: 3 + extra,
      Protein: 2 + extra,
      Grains: 3 + extra,
      Dairy: isGrowing ? 3 : 2,
    }
    // Daily gram targets based on age, weight, training
    const gramTargets = {
      Fruit: Math.round((isChild ? 200 : 250) * activityMultiplier),
      Vegetables: Math.round((isChild ? 250 : 350) * activityMultiplier),
      Protein: Math.round(w * proteinPerKg),
      Grains: Math.round((isChild ? 200 : 250) * activityMultiplier),
      Dairy: Math.round((isGrowing ? 400 : 300) * activityMultiplier),
    }
    return { ...g, target: servingTargets[g.name], gramTarget: gramTargets[g.name] }
  })

  return {
    foodGroups,
    nutrientTargets: {
      protein: { target: protein, unit: 'g', label: 'Protein' },
      carbs: { target: carbs, unit: 'g', label: 'Carbs' },
      fat: { target: fat, unit: 'g', label: 'Fat' },
      fibre: { target: fibre, unit: 'g', label: 'Fibre' },
      iron: { target: iron, unit: 'mg', label: 'Iron' },
      calcium: { target: calcium, unit: 'mg', label: 'Calcium' },
      vitC: { target: vitC, unit: 'mg', label: 'Vitamin C' },
      freeSugar: { target: 30, unit: 'g', label: 'Added Sugar', isLimit: true },
    },
  }
}

function getSuggestions(todayFoods, foodGroups, nutrientTargets, allFoodsDb) {
  const groupCounts = {}
  foodGroups.forEach(g => { groupCounts[g.name] = 0 })
  const groupGrams = {}
  foodGroups.forEach(g => { groupGrams[g.name] = 0 })
  todayFoods.forEach(f => {
    f.groups.forEach(g => {
      groupCounts[g] = (groupCounts[g] || 0) + 1
      groupGrams[g] = (groupGrams[g] || 0) + (f.loggedGrams || 100)
    })
  })

  const totals = { carbs: 0, protein: 0, fat: 0, fibre: 0, iron: 0, calcium: 0, vitC: 0, sugar: 0, freeSugar: 0 }
  todayFoods.forEach(f => {
    Object.keys(totals).forEach(k => { if (k !== 'freeSugar') totals[k] += f.nutrients[k] || 0 })
    totals.freeSugar += getFreeSugar(f)
  })

  const missingGroups = foodGroups.filter(g => groupCounts[g.name] < g.target)
  const lowNutrients = Object.entries(nutrientTargets)
    .filter(([key, { target, isLimit }]) => !isLimit && totals[key] < target * 0.5)
    .map(([key, info]) => ({ key, ...info, current: totals[key] }))

  const nutrientGaps = Object.entries(nutrientTargets)
    .filter(([key, { target, isLimit }]) => !isLimit && totals[key] < target)
    .map(([key, info]) => ({ key, ...info, current: totals[key], gap: info.target - totals[key] }))
    .sort((a, b) => (a.current / a.target) - (b.current / b.target))

  const eatenNames = new Set(todayFoods.map(f => f.name))
  const db = allFoodsDb || FOOD_DATABASE
  const suggestions = []
  const usedNames = new Set()

  nutrientGaps.forEach(({ key, label, gap, target, current, unit }) => {
    if (suggestions.length >= 8) return
    const pctHave = Math.round((current / target) * 100)
    const options = db.filter(f =>
      !f.unhealthy && f.nutrients[key] > 0 && !eatenNames.has(f.name) && !usedNames.has(f.name)
    ).map(f => {
      const per100 = f.nutrients[key]
      const gramsNeeded = Math.min(300, Math.max(30, Math.round((gap / per100) * 100)))
      const wouldAdd = Math.round(per100 * gramsNeeded / 100 * 10) / 10
      return { ...f, suggestedGrams: gramsNeeded, wouldAdd, nutrientKey: key }
    }).sort((a, b) => {
      const aServing = a.suggestedGrams >= 50 && a.suggestedGrams <= 200 ? 1 : 0
      const bServing = b.suggestedGrams >= 50 && b.suggestedGrams <= 200 ? 1 : 0
      if (aServing !== bServing) return bServing - aServing
      return a.suggestedGrams - b.suggestedGrams
    })

    if (options.length > 0) {
      const pick = options[0]
      usedNames.add(pick.name)
      suggestions.push({
        ...pick,
        reason: `${pick.suggestedGrams}g → +${pick.wouldAdd}${unit} ${label.toLowerCase()} (${pctHave}% of daily target)`,
      })
    }
  })

  missingGroups.forEach(group => {
    if (suggestions.length >= 8) return
    const gramGap = (group.gramTarget || 200) - (groupGrams[group.name] || 0)
    if (gramGap <= 0) return
    const options = db.filter(f =>
      !f.unhealthy && f.groups.includes(group.name) && !eatenNames.has(f.name) && !usedNames.has(f.name)
    )
    if (options.length > 0) {
      const pick = options[Math.floor(Math.random() * Math.min(5, options.length))]
      const servingGrams = Math.min(200, Math.max(50, gramGap))
      usedNames.add(pick.name)
      suggestions.push({
        ...pick,
        suggestedGrams: servingGrams,
        reason: `Need ${gramGap}g more ${group.name.toLowerCase()} today`,
      })
    }
  })

  return { missingGroups, lowNutrients, suggestions: suggestions.slice(0, 8), groupCounts, totals }
}

function scaleNutrients(nutrients, grams) {
  const scale = grams / 100
  const scaled = {}
  Object.keys(nutrients).forEach(k => { scaled[k] = Math.round(nutrients[k] * scale * 10) / 10 })
  return scaled
}

export default function MealPlannerPage() {
  const { addFoodEntry, removeFoodEntry, getTodayFoodLog, addCustomFood, customFoods, foodLog, settings, updateSettings, trainingLogs } = useApp()
  const [search, setSearch] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [grams, setGrams] = useState('100')
  const [unit, setUnit] = useState('g')
  const [unitCount, setUnitCount] = useState('1')
  const [customFood, setCustomFood] = useState(null)
  const [customNutrients, setCustomNutrients] = useState({ protein: '', carbs: '', fat: '', fibre: '', iron: '', calcium: '', vitC: '', sugar: '' })
  const [customGrams, setCustomGrams] = useState('100')
  const [customGroups, setCustomGroups] = useState([])
  const [labelPhoto, setLabelPhoto] = useState(null)
  const fileInputRef = useRef(null)
  const [ageInput, setAgeInput] = useState(String(settings.realAge || ''))
  const [weightInput, setWeightInput] = useState(String(settings.bodyWeightKg))
  const [showHistory, setShowHistory] = useState(false)
  const [showAverage, setShowAverage] = useState(false)
  const [historyDate, setHistoryDate] = useState(null)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  const todayFoods = getTodayFoodLog()

  const trainingDaysPerWeek = useMemo(() => {
    const last7 = Array.from({ length: 7 }, (_, i) => getDaysAgo(i))
    return last7.filter(d => trainingLogs.some(l => l.date === d)).length
  }, [trainingLogs])

  const { foodGroups, nutrientTargets } = useMemo(
    () => getPersonalizedTargets(settings.realAge, settings.bodyWeightKg, trainingDaysPerWeek),
    [settings.realAge, settings.bodyWeightKg, trainingDaysPerWeek]
  )

  const allFoods = useMemo(() => {
    const dbNames = new Set(FOOD_DATABASE.map(f => f.name))
    const extras = customFoods.filter(f => !dbNames.has(f.name))
    return [...FOOD_DATABASE, ...extras]
  }, [customFoods])

  const { missingGroups, lowNutrients, suggestions, groupCounts, totals } = useMemo(
    () => getSuggestions(todayFoods.map(e => {
      const dbFood = allFoods.find(f => f.name === e.name)
      if (dbFood && e.grams) {
        return { ...dbFood, nutrients: scaleNutrients(dbFood.nutrients, e.grams), loggedGrams: e.grams }
      }
      return { name: e.name, groups: e.groups || [], nutrients: e.nutrients || {}, loggedGrams: e.grams || 100 }
    }), foodGroups, nutrientTargets, allFoods),
    [todayFoods, foodGroups, nutrientTargets, allFoods]
  )

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return allFoods.filter(f => f.name.toLowerCase().includes(q)).slice(0, 8)
  }, [search, allFoods])

  // Resolve whatever unit the user picked down to grams, which is what the
  // nutrient scaling and every downstream total works in.
  const resolveGrams = (food, u, count, gramsValue) => {
    if (u === 'g') return parseInt(gramsValue, 10) || 0
    const n = parseFloat(count) || 0
    if (u === 'tbsp') return Math.round(n * gramsPerTablespoon(food))
    if (u === 'tsp') return Math.round(n * gramsPerTeaspoon(food))
    if (u === 'bowl') return Math.round(n * gramsPerBowl(food))
    return 0
  }

  const effectiveGrams = selectedFood
    ? resolveGrams(selectedFood, unit, unitCount, grams)
    : 0

  const handleSelect = (food) => {
    setSelectedFood(food)
    setGrams('100')
    setUnit(CEREAL_NAMES.has(food.name) ? 'bowl' : 'g')
    setUnitCount('1')
    setShowResults(false)
  }

  const resetAddForm = () => {
    setSelectedFood(null)
    setSearch('')
    setGrams('100')
    setUnit('g')
    setUnitCount('1')
  }

  const handleConfirmAdd = () => {
    if (!selectedFood) return
    const g = effectiveGrams
    if (g <= 0) return
    const scaled = scaleNutrients(selectedFood.nutrients, g)
    addFoodEntry({ name: selectedFood.name, groups: selectedFood.groups, nutrients: scaled, grams: g })
    if (CEREAL_NAMES.has(selectedFood.name)) {
      const milkMl = Math.round(g * (125 / 30))
      const milkNutrients = scaleNutrients(MILK_PER_100ML, milkMl)
      addFoodEntry({ name: `Milk (with ${selectedFood.name})`, groups: ['Dairy'], nutrients: milkNutrients, grams: milkMl })
    }
    resetAddForm()
  }

  const handleStartCustom = () => {
    if (!search.trim()) return
    setCustomFood(search.trim())
    setCustomNutrients({ protein: '', carbs: '', fat: '', fibre: '', iron: '', calcium: '', vitC: '' })
    setCustomGrams('100')
    setCustomGroups([])
    setLabelPhoto(null)
    setShowResults(false)
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setLabelPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleConfirmCustom = () => {
    if (!customFood) return
    const g = parseInt(customGrams, 10) || 100
    const per100 = {}
    Object.keys(customNutrients).forEach(k => {
      per100[k] = parseFloat(customNutrients[k]) || 0
    })
    const scaled = scaleNutrients(per100, g)
    addFoodEntry({ name: customFood, groups: customGroups, nutrients: scaled, grams: g })
    addCustomFood({ name: customFood, groups: customGroups, nutrients: per100 })
    setCustomFood(null)
    setSearch('')
  }

  const toggleCustomGroup = (name) => {
    setCustomGroups(prev => prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name])
  }

  const datesWithFood = useMemo(() => {
    const dates = new Set()
    foodLog.forEach(e => { if (e.date) dates.add(e.date) })
    return dates
  }, [foodLog])

  const historyFoods = useMemo(() => {
    if (!historyDate) return []
    return foodLog.filter(e => e.date === historyDate)
  }, [foodLog, historyDate])

  const historyTotals = useMemo(() => {
    const t = { carbs: 0, protein: 0, fat: 0, fibre: 0, iron: 0, calcium: 0, vitC: 0, sugar: 0, freeSugar: 0 }
    historyFoods.forEach(f => {
      Object.keys(t).forEach(k => { if (k !== 'freeSugar') t[k] += f.nutrients?.[k] || 0 })
      t.freeSugar += getFreeSugar(f)
    })
    return t
  }, [historyFoods])

  const calendarDays = useMemo(() => {
    const { year, month } = calendarMonth
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const offset = (firstDay + 6) % 7
    const days = []
    for (let i = 0; i < offset; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      days.push({ day: d, date: dateStr, hasFood: datesWithFood.has(dateStr) })
    }
    return days
  }, [calendarMonth, datesWithFood])

  const monthLabel = new Date(calendarMonth.year, calendarMonth.month).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  const prevMonth = () => setCalendarMonth(p => {
    const m = p.month === 0 ? 11 : p.month - 1
    const y = p.month === 0 ? p.year - 1 : p.year
    return { year: y, month: m }
  })
  const nextMonth = () => setCalendarMonth(p => {
    const m = p.month === 11 ? 0 : p.month + 1
    const y = p.month === 11 ? p.year + 1 : p.year
    return { year: y, month: m }
  })

  const GROUP_COLORS = { Fruit: '#f59e0b', Vegetables: '#10b981', Protein: '#ef4444', Grains: '#8b5cf6', Dairy: '#3b82f6' }

  const averageData = useMemo(() => {
    if (foodLog.length === 0) return null
    const groupGrams = { Fruit: 0, Vegetables: 0, Protein: 0, Grains: 0, Dairy: 0 }
    const nutrientTotals = { carbs: 0, protein: 0, fat: 0, fibre: 0, iron: 0, calcium: 0, vitC: 0, sugar: 0, freeSugar: 0 }
    const dates = new Set()

    foodLog.forEach(entry => {
      if (entry.date) dates.add(entry.date)
      const g = entry.grams || 100
      ;(entry.groups || []).forEach(group => {
        if (groupGrams[group] !== undefined) groupGrams[group] += g
      })
      Object.keys(nutrientTotals).forEach(k => {
        if (k !== 'freeSugar') nutrientTotals[k] += entry.nutrients?.[k] || 0
      })
      nutrientTotals.freeSugar += getFreeSugar(entry)
    })

    const totalGrams = Object.values(groupGrams).reduce((a, b) => a + b, 0)
    const dayCount = dates.size || 1

    const pieData = Object.entries(groupGrams)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({
        name,
        value: Math.round(value),
        pct: totalGrams > 0 ? Math.round((value / totalGrams) * 100) : 0,
        color: GROUP_COLORS[name],
      }))
      .sort((a, b) => b.value - a.value)

    const avgNutrients = {}
    Object.keys(nutrientTotals).forEach(k => {
      avgNutrients[k] = Math.round(nutrientTotals[k] / dayCount * 10) / 10
    })

    return { pieData, avgNutrients, dayCount, totalGrams }
  }, [foodLog])

  if (showAverage) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Diet Breakdown</h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
              {averageData ? `Average across ${averageData.dayCount} day${averageData.dayCount !== 1 ? 's' : ''} of logging` : 'No data yet'}
            </p>
          </div>
          <button
            onClick={() => setShowAverage(false)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300"
          >Back</button>
        </div>

        {!averageData ? (
          <div className="text-center py-12">
            <p className="text-surface-400 text-sm">Log some food first to see your diet breakdown.</p>
          </div>
        ) : (
          <>
            <Card>
              <h3 className="text-sm font-bold text-surface-800 dark:text-surface-200 mb-2">Food Groups</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={averageData.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {averageData.pieData.map(entry => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => {
                        const item = averageData.pieData.find(d => d.name === name)
                        return [`${item?.pct}% (${Math.round(value)}g)`, name]
                      }}
                      contentStyle={{
                        backgroundColor: 'var(--tooltip-bg, #fff)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {averageData.pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-surface-700 dark:text-surface-300">{d.name}</span>
                    <span className="text-xs font-bold text-surface-900 dark:text-surface-50 ml-auto">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-bold text-surface-800 dark:text-surface-200 mb-3">Daily Average Nutrients</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(nutrientTargets).map(([key, { target, unit, label, isLimit }]) => {
                  const avg = averageData.avgNutrients[key] || 0
                  const pct = Math.min(100, (avg / target) * 100)
                  const over = isLimit && avg > target
                  const nearLimit = isLimit && avg > target * 0.8
                  const low = !isLimit && pct < 50
                  const barColor = isLimit
                    ? (over ? '#ef4444' : nearLimit ? '#f97316' : '#10b981')
                    : (low ? '#ef4444' : '#10b981')
                  const textColor = isLimit
                    ? (over ? 'text-red-500 font-bold' : nearLimit ? 'text-orange-500' : 'text-emerald-500')
                    : (low ? 'text-red-500' : 'text-emerald-500')
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-surface-600 dark:text-surface-400">{label}{isLimit ? ' ⚠' : ''}</span>
                          <span className={`text-[10px] font-medium ${textColor}`}>
                            {Math.round(avg)}/{target}{unit}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${isLimit ? Math.min(100, pct) : pct}%`, backgroundColor: barColor }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-surface-200 dark:border-surface-700">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{Math.round(averageData.avgNutrients.protein)}g</p>
                    <p className="text-[10px] text-surface-500">Protein/day</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{Math.round(averageData.avgNutrients.carbs)}g</p>
                    <p className="text-[10px] text-surface-500">Carbs/day</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{Math.round(averageData.avgNutrients.fat)}g</p>
                    <p className="text-[10px] text-surface-500">Fat/day</p>
                  </div>
                </div>
                <p className="text-center text-[11px] text-surface-400 mt-2">
                  ~{Math.round(averageData.avgNutrients.protein * 4 + averageData.avgNutrients.carbs * 4 + averageData.avgNutrients.fat * 9)} cal/day avg
                </p>
              </div>
            </Card>
          </>
        )}
      </div>
    )
  }

  if (showHistory) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Food History</h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
              {historyDate ? new Date(historyDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Tap a date to see what you ate'}
            </p>
          </div>
          <button
            onClick={() => { setShowHistory(false); setHistoryDate(null) }}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300"
          >Back</button>
        </div>

        {!historyDate && (
          <Card>
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700">
                <ChevronLeft size={18} className="text-surface-500" />
              </button>
              <span className="text-sm font-bold text-surface-800 dark:text-surface-200">{monthLabel}</span>
              <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700">
                <ChevronRight size={18} className="text-surface-500" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <span key={i} className="text-[10px] font-medium text-surface-400">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((cell, i) => {
                if (!cell) return <div key={`e${i}`} />
                const isToday = cell.date === new Date().toISOString().slice(0, 10)
                return (
                  <button
                    key={cell.date}
                    onClick={() => cell.hasFood && setHistoryDate(cell.date)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-colors relative ${
                      cell.hasFood
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50'
                        : 'text-surface-400 dark:text-surface-500'
                    } ${isToday ? 'ring-2 ring-primary-400' : ''}`}
                  >
                    {cell.day}
                    {cell.hasFood && (
                      <div className="w-1 h-1 rounded-full bg-primary-500 mt-0.5" />
                    )}
                  </button>
                )
              })}
            </div>
          </Card>
        )}

        {historyDate && (
          <>
            <div className="flex gap-2">
              <button
                onClick={() => setHistoryDate(null)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300"
              >Calendar</button>
            </div>

            <Card>
              <h3 className="text-sm font-bold text-surface-800 dark:text-surface-200 mb-3">
                What you ate ({historyFoods.length} item{historyFoods.length !== 1 ? 's' : ''})
              </h3>
              {historyFoods.length === 0 ? (
                <p className="text-sm text-surface-400">No food logged on this day.</p>
              ) : (
                <div className="space-y-2">
                  {historyFoods.map(entry => (
                    <div key={entry.id} className="flex items-center justify-between p-2 rounded-lg bg-surface-50 dark:bg-surface-700/50">
                      <div>
                        <span className="text-sm font-medium text-surface-800 dark:text-surface-200">{entry.name}</span>
                        {entry.grams > 0 && <span className="text-[11px] text-surface-400 ml-1.5">{entry.grams}g</span>}
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-surface-500">
                          {Math.round(entry.nutrients?.protein || 0)}p · {Math.round(entry.nutrients?.carbs || 0)}c · {Math.round(entry.nutrients?.fat || 0)}f
                        </span>
                        {getFreeSugar(entry) > 5 && (
                          <span className="text-[10px] text-red-500 ml-1">{Math.round(getFreeSugar(entry))}g sugar</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {historyFoods.length > 0 && (
              <Card>
                <h3 className="text-sm font-bold text-surface-800 dark:text-surface-200 mb-3">Day's totals</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(nutrientTargets).map(([key, { target, unit, label, isLimit }]) => {
                    const current = Math.round(historyTotals[key] || 0)
                    const pct = Math.min(100, (current / target) * 100)
                    const over = isLimit && current > target
                    const nearLimit = isLimit && current > target * 0.8
                    const low = !isLimit && pct < 50
                    const barColor = isLimit
                      ? (over ? '#ef4444' : nearLimit ? '#f97316' : '#10b981')
                      : (low ? '#ef4444' : '#10b981')
                    const textColor = isLimit
                      ? (over ? 'text-red-500 font-bold' : nearLimit ? 'text-orange-500' : 'text-emerald-500')
                      : (low ? 'text-red-500' : 'text-emerald-500')
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-surface-600 dark:text-surface-400">{label}{isLimit ? ' ⚠' : ''}</span>
                            <span className={`text-[10px] font-medium ${textColor}`}>
                              {current}/{target}{unit}{over ? ' OVER' : ''}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${isLimit ? Math.min(100, pct) : pct}%`, backgroundColor: barColor }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-surface-200 dark:border-surface-700">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{Math.round(historyTotals.protein)}g</p>
                      <p className="text-[10px] text-surface-500">Protein</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{Math.round(historyTotals.carbs)}g</p>
                      <p className="text-[10px] text-surface-500">Carbs</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{Math.round(historyTotals.fat)}g</p>
                      <p className="text-[10px] text-surface-500">Fat</p>
                    </div>
                  </div>
                  <p className="text-center text-[11px] text-surface-400 mt-2">
                    ~{Math.round(historyTotals.protein * 4 + historyTotals.carbs * 4 + historyTotals.fat * 9)} calories
                  </p>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Food Log</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Log what you eat, get suggestions for what's missing</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAverage(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
          >
            <PieChartIcon size={14} />
            Average
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
          >
            <History size={14} />
            History
          </button>
        </div>
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

          {showResults && search.trim() && !selectedFood && (
            <div className="absolute z-20 mt-1 w-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map(food => {
                const foodFreeSugar = getFreeSugar(food)
                const highFreeSugar = foodFreeSugar > 15
                return (
                  <button
                    key={food.name}
                    onClick={() => handleSelect(food)}
                    className="w-full px-3 py-2.5 text-left hover:bg-surface-50 dark:hover:bg-surface-700 flex items-center justify-between border-b border-surface-100 dark:border-surface-700 last:border-0"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-surface-900 dark:text-surface-50">{food.name}</span>
                        {highFreeSugar && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 font-medium">
                            {foodFreeSugar}g sugar
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 mt-0.5">
                        {food.groups.map(g => (
                          <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-100 dark:bg-surface-600 text-surface-500 dark:text-surface-400">{g}</span>
                        ))}
                      </div>
                    </div>
                    <Plus size={16} className="text-primary-500" />
                  </button>
                )
              })}
              {searchResults.length === 0 && (
                <button
                  onClick={handleStartCustom}
                  className="w-full px-3 py-2.5 text-left hover:bg-surface-50 dark:hover:bg-surface-700 flex items-center gap-2"
                >
                  <Plus size={16} className="text-primary-500" />
                  <span className="text-sm text-surface-700 dark:text-surface-300">Add "{search}" as custom food</span>
                </button>
              )}
            </div>
          )}

          {selectedFood && (
            <div className="mt-2 p-3 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-surface-900 dark:text-surface-50">{selectedFood.name}</span>
                <button onClick={resetAddForm} className="text-surface-400 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
              {/* Unit picker — grams, spoons, or bowls for cereal */}
              <div className="flex gap-1.5 mb-2">
                {[
                  { key: 'g', label: 'Grams' },
                  { key: 'tbsp', label: 'Tbsp' },
                  { key: 'tsp', label: 'Tsp' },
                  ...(CEREAL_NAMES.has(selectedFood.name) ? [{ key: 'bowl', label: '🥣 Bowl' }] : []),
                ].map(u => (
                  <button
                    key={u.key}
                    onClick={() => setUnit(u.key)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      unit === u.key
                        ? 'bg-primary-500 text-white'
                        : 'bg-surface-200 dark:bg-surface-600 text-surface-600 dark:text-surface-300'
                    }`}
                  >{u.label}</button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {unit === 'g' ? (
                  <>
                    <input
                      type="number"
                      value={grams}
                      onChange={(e) => setGrams(e.target.value)}
                      min="1"
                      className="w-20 px-2 py-1.5 text-sm rounded-md border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50 text-center"
                      autoFocus
                    />
                    <span className="text-xs text-surface-500">grams</span>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setUnitCount(c => String(Math.max(0.5, (parseFloat(c) || 1) - 0.5)))}
                      className="w-7 h-7 rounded-md bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-200 text-sm font-bold"
                    >−</button>
                    <input
                      type="number"
                      value={unitCount}
                      onChange={(e) => setUnitCount(e.target.value)}
                      min="0.5"
                      step="0.5"
                      className="w-14 px-2 py-1.5 text-sm rounded-md border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50 text-center"
                    />
                    <button
                      onClick={() => setUnitCount(c => String((parseFloat(c) || 1) + 0.5))}
                      className="w-7 h-7 rounded-md bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-200 text-sm font-bold"
                    >+</button>
                    <span className="text-xs text-surface-500">
                      {unit === 'bowl' ? 'bowl' : unit}
                      {(parseFloat(unitCount) || 1) !== 1 ? 's' : ''} = {effectiveGrams}g
                    </span>
                  </>
                )}
                <button
                  onClick={handleConfirmAdd}
                  className="ml-auto px-3 py-1.5 text-xs font-medium rounded-md bg-primary-500 text-white"
                >Add</button>
              </div>
              {unit !== 'g' && (
                <p className="text-[10px] text-surface-400 mt-1.5">
                  1 {unit === 'bowl' ? 'bowl' : unit} of {selectedFood.name.toLowerCase()} ≈{' '}
                  {unit === 'tbsp' ? gramsPerTablespoon(selectedFood)
                    : unit === 'tsp' ? gramsPerTeaspoon(selectedFood)
                    : gramsPerBowl(selectedFood)}g
                </p>
              )}
              {(() => {
                const g = effectiveGrams
                if (g <= 0) return null
                const s = (v) => Math.round((v || 0) * g / 100 * 10) / 10
                return (
                  <p className="text-[10px] text-surface-400 mt-1.5">
                    You'll get: {s(selectedFood.nutrients.protein)}g protein, {s(selectedFood.nutrients.carbs)}g carbs, {s(selectedFood.nutrients.fat)}g fat, {s(selectedFood.nutrients.sugar)}g sugar
                  </p>
                )
              })()}
              {(() => {
                const g = effectiveGrams
                const foodFreeSugar = getFreeSugar(selectedFood)
                const addingFreeSugar = Math.round(foodFreeSugar * g / 100 * 10) / 10
                const currentFreeSugar = Math.round(totals.freeSugar || 0)
                const newTotal = currentFreeSugar + addingFreeSugar
                if (addingFreeSugar === 0) return null
                if (newTotal > 30) return (
                  <div className="mt-1.5 px-2 py-1.5 bg-red-50 dark:bg-red-900/30 rounded-md border border-red-200 dark:border-red-800">
                    <p className="text-[11px] font-medium text-red-600 dark:text-red-400">
                      Warning: This adds {addingFreeSugar}g added sugar — total would be {Math.round(newTotal)}g (over 30g limit)
                    </p>
                  </div>
                )
                if (newTotal > 24) return (
                  <div className="mt-1.5 px-2 py-1.5 bg-orange-50 dark:bg-orange-900/30 rounded-md border border-orange-200 dark:border-orange-800">
                    <p className="text-[11px] font-medium text-orange-600 dark:text-orange-400">
                      This adds {addingFreeSugar}g added sugar — total would be {Math.round(newTotal)}g/30g
                    </p>
                  </div>
                )
                return null
              })()}
              {CEREAL_NAMES.has(selectedFood.name) && (
                <div className="mt-1.5 px-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-800">
                  <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                    + {Math.round(effectiveGrams * (125 / 30))}ml milk will be added automatically
                  </p>
                </div>
              )}
            </div>
          )}

          {customFood && (
            <div className="mt-2 p-3 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-700/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-surface-900 dark:text-surface-50">{customFood}</span>
                <button onClick={() => setCustomFood(null)} className="text-surface-400 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  value={customGrams}
                  onChange={(e) => setCustomGrams(e.target.value)}
                  min="1"
                  className="w-20 px-2 py-1.5 text-sm rounded-md border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50 text-center"
                />
                <span className="text-xs text-surface-500">grams</span>
              </div>

              {/* Photo of nutritional label */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              {labelPhoto ? (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-surface-500 dark:text-surface-400">Nutritional label:</span>
                    <button onClick={() => setLabelPhoto(null)} className="text-[10px] text-red-500">Remove</button>
                  </div>
                  <img src={labelPhoto} alt="Nutritional label" className="w-full rounded-lg border border-surface-200 dark:border-surface-600" />
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full mb-3 py-2 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-lg flex items-center justify-center gap-2 text-xs text-surface-500 dark:text-surface-400 hover:border-primary-400 hover:text-primary-500 transition-colors"
                >
                  <Camera size={16} />
                  <span>Photo the nutritional label</span>
                </button>
              )}

              <p className="text-[11px] text-surface-500 dark:text-surface-400 mb-2">Food groups:</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {FOOD_GROUP_BASE.map(g => (
                  <button
                    key={g.name}
                    onClick={() => toggleCustomGroup(g.name)}
                    className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${
                      customGroups.includes(g.name)
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'border-surface-300 dark:border-surface-600 text-surface-500 dark:text-surface-400'
                    }`}
                  >{g.icon} {g.name}</button>
                ))}
              </div>

              <p className="text-[11px] text-surface-500 dark:text-surface-400 mb-2">Enter the values from the packet (per 100g):</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3">
                {[
                  { key: 'protein', label: 'Protein (g)' },
                  { key: 'carbs', label: 'Carbs (g)' },
                  { key: 'fat', label: 'Fat (g)' },
                  { key: 'fibre', label: 'Fibre (g)' },
                  { key: 'iron', label: 'Iron (mg)' },
                  { key: 'calcium', label: 'Calcium (mg)' },
                  { key: 'vitC', label: 'Vit C (mg)' },
                  { key: 'sugar', label: 'Sugar (g)' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <label className="text-[10px] text-surface-500 w-16 shrink-0">{label}</label>
                    <input
                      type="number"
                      min="0"
                      value={customNutrients[key]}
                      onChange={(e) => setCustomNutrients(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder="0"
                      className="w-full px-1.5 py-1 text-xs rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50 text-center"
                    />
                  </div>
                ))}
              </div>

              {(() => {
                const g = parseInt(customGrams, 10) || 100
                const hasValues = Object.values(customNutrients).some(v => parseFloat(v) > 0)
                if (!hasValues || g === 100) return null
                const scale = g / 100
                return (
                  <div className="mb-3 p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <p className="text-[11px] font-medium text-primary-700 dark:text-primary-400 mb-1">
                      What you'll get from {g}g:
                    </p>
                    <p className="text-[10px] text-primary-600 dark:text-primary-400">
                      {[
                        customNutrients.protein && `${Math.round(parseFloat(customNutrients.protein) * scale * 10) / 10}g protein`,
                        customNutrients.carbs && `${Math.round(parseFloat(customNutrients.carbs) * scale * 10) / 10}g carbs`,
                        customNutrients.fat && `${Math.round(parseFloat(customNutrients.fat) * scale * 10) / 10}g fat`,
                      ].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                )
              })()}

              <button
                onClick={handleConfirmCustom}
                className="w-full py-1.5 text-xs font-medium rounded-md bg-primary-500 text-white"
              >Add</button>
            </div>
          )}
        </div>
      </Card>

      {/* Today's food */}
      {todayFoods.length > 0 && (
        <Card>
          <h3 className="text-sm font-bold text-surface-800 dark:text-surface-200 mb-3">Today's food</h3>
          <div className="flex flex-wrap gap-2">
            {todayFoods.map(entry => {
              const entryFreeSugar = getFreeSugar(entry)
              const highSugar = entryFreeSugar > 5
              return (
                <div key={entry.id} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${highSugar ? 'bg-red-50 dark:bg-red-900/20 ring-1 ring-red-200 dark:ring-red-800' : 'bg-surface-100 dark:bg-surface-700'}`}>
                  <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{entry.name}</span>
                  {entry.grams > 0 && <span className="text-[10px] text-surface-400">{entry.grams}g</span>}
                  {highSugar && <span className="text-[9px] text-red-500 font-medium">{Math.round(entryFreeSugar)}g sugar</span>}
                  <button onClick={() => removeFoodEntry(entry.id)} className="text-surface-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Food groups progress */}
      <Card>
        <h3 className="text-sm font-bold text-surface-800 dark:text-surface-200 mb-2">Food Groups</h3>
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-surface-500">Age</label>
            <input
              type="number"
              min="5"
              max="100"
              value={ageInput}
              onChange={(e) => {
                setAgeInput(e.target.value)
                const v = parseInt(e.target.value, 10)
                if (v >= 5 && v <= 100) updateSettings({ realAge: v })
              }}
              onBlur={() => {
                const v = parseInt(ageInput, 10)
                if (!(v >= 5 && v <= 100)) { updateSettings({ realAge: null }); setAgeInput('') }
              }}
              placeholder="—"
              className="w-12 px-1.5 py-1 text-xs rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50 text-center"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-surface-500">Weight</label>
            <input
              type="number"
              min="20"
              max="200"
              value={weightInput}
              onChange={(e) => {
                setWeightInput(e.target.value)
                const v = parseInt(e.target.value, 10)
                if (v >= 20 && v <= 200) updateSettings({ bodyWeightKg: v })
              }}
              onBlur={() => {
                const v = parseInt(weightInput, 10)
                if (!(v >= 20 && v <= 200)) setWeightInput(String(settings.bodyWeightKg))
              }}
              className="w-14 px-1.5 py-1 text-xs rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50 text-center"
            />
            <span className="text-[11px] text-surface-400">kg</span>
          </div>
          <span className="text-[11px] text-surface-400">{trainingDaysPerWeek} training days/wk</span>
        </div>
        <div className="space-y-2.5">
          {foodGroups.map(group => {
            const count = groupCounts[group.name] || 0
            const pct = Math.min(100, (count / group.target) * 100)
            return (
              <div key={group.name} className="flex items-center gap-3">
                <span className="text-lg w-7">{group.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-0.5">
                    <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{group.name}</span>
                    <span className="text-xs text-surface-500">{count}/{group.target} · <span className="font-medium">{group.gramTarget}g</span></span>
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
          {Object.entries(nutrientTargets).map(([key, { target, unit, label, isLimit }]) => {
            const current = Math.round(totals[key] || 0)
            const pct = Math.min(100, (current / target) * 100)
            const over = isLimit && current > target
            const nearLimit = isLimit && current > target * 0.8
            const low = !isLimit && pct < 50
            const barColor = isLimit
              ? (over ? '#ef4444' : nearLimit ? '#f97316' : '#10b981')
              : (low ? '#ef4444' : '#10b981')
            const textColor = isLimit
              ? (over ? 'text-red-500 font-bold' : nearLimit ? 'text-orange-500' : 'text-emerald-500')
              : (low ? 'text-red-500' : 'text-emerald-500')
            return (
              <div key={key} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-surface-600 dark:text-surface-400">{label}{isLimit ? ' ⚠' : ''}</span>
                    <span className={`text-[10px] font-medium ${textColor}`}>
                      {current}/{target}{unit}{over ? ' OVER' : ''}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${isLimit ? Math.min(100, pct) : pct}%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <h3 className="text-sm font-bold text-surface-800 dark:text-surface-200 mb-1">Suggested for you</h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 mb-3">Foods to fill your nutrient gaps today</p>
          <div className="space-y-2">
            {suggestions.map(s => (
              <button
                key={s.name}
                onClick={() => {
                  setSelectedFood(s)
                  setGrams(String(s.suggestedGrams || 100))
                  setUnit('g')
                  setUnitCount('1')
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors border border-surface-200 dark:border-surface-600"
              >
                <div className="text-left flex-1 min-w-0">
                  <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">{s.name}</span>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">{s.reason}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {s.suggestedGrams && (
                    <span className="text-[11px] font-medium bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">
                      {s.suggestedGrams}g
                    </span>
                  )}
                  <Plus size={16} className="text-primary-500" />
                </div>
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

      {todayFoods.length === 0 && suggestions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-surface-400 text-sm">Start logging what you eat to get personalised suggestions</p>
        </div>
      )}
    </div>
  )
}
