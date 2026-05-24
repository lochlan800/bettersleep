import { useState, useMemo, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { getDaysAgo } from '../../utils/dateHelpers'
import { Search, Plus, X, Camera } from 'lucide-react'
import Card from '../ui/Card'

const FOOD_DATABASE = [
  // ── Fruits ──
  { name: 'Banana', groups: ['Fruit'], nutrients: { carbs: 27, protein: 1, fat: 0, fibre: 3, iron: 0.3, calcium: 5, vitC: 10 } },
  { name: 'Apple', groups: ['Fruit'], nutrients: { carbs: 25, protein: 0, fat: 0, fibre: 4, iron: 0.2, calcium: 6, vitC: 8 } },
  { name: 'Blueberries', groups: ['Fruit'], nutrients: { carbs: 14, protein: 1, fat: 0, fibre: 2, iron: 0.3, calcium: 6, vitC: 10 } },
  { name: 'Strawberries', groups: ['Fruit'], nutrients: { carbs: 8, protein: 1, fat: 0, fibre: 2, iron: 0.4, calcium: 16, vitC: 59 } },
  { name: 'Orange', groups: ['Fruit'], nutrients: { carbs: 12, protein: 1, fat: 0, fibre: 2, iron: 0.1, calcium: 40, vitC: 70 } },
  { name: 'Grapes', groups: ['Fruit'], nutrients: { carbs: 18, protein: 1, fat: 0, fibre: 1, iron: 0.4, calcium: 10, vitC: 4 } },
  { name: 'Mango', groups: ['Fruit'], nutrients: { carbs: 25, protein: 1, fat: 0, fibre: 3, iron: 0.2, calcium: 11, vitC: 36 } },
  { name: 'Pineapple', groups: ['Fruit'], nutrients: { carbs: 13, protein: 0, fat: 0, fibre: 1, iron: 0.3, calcium: 13, vitC: 48 } },
  { name: 'Watermelon', groups: ['Fruit'], nutrients: { carbs: 8, protein: 1, fat: 0, fibre: 0, iron: 0.2, calcium: 7, vitC: 8 } },
  { name: 'Peach', groups: ['Fruit'], nutrients: { carbs: 10, protein: 1, fat: 0, fibre: 2, iron: 0.3, calcium: 6, vitC: 7 } },
  { name: 'Nectarine', groups: ['Fruit'], nutrients: { carbs: 11, protein: 1, fat: 0, fibre: 2, iron: 0.3, calcium: 6, vitC: 5 } },
  { name: 'Plum', groups: ['Fruit'], nutrients: { carbs: 11, protein: 1, fat: 0, fibre: 1, iron: 0.2, calcium: 6, vitC: 10 } },
  { name: 'Pear', groups: ['Fruit'], nutrients: { carbs: 15, protein: 0, fat: 0, fibre: 3, iron: 0.2, calcium: 9, vitC: 4 } },
  { name: 'Cherries', groups: ['Fruit'], nutrients: { carbs: 16, protein: 1, fat: 0, fibre: 2, iron: 0.4, calcium: 13, vitC: 7 } },
  { name: 'Raspberries', groups: ['Fruit'], nutrients: { carbs: 12, protein: 1, fat: 1, fibre: 7, iron: 0.7, calcium: 25, vitC: 26 } },
  { name: 'Blackberries', groups: ['Fruit'], nutrients: { carbs: 10, protein: 1, fat: 0, fibre: 5, iron: 0.6, calcium: 29, vitC: 21 } },
  { name: 'Kiwi', groups: ['Fruit'], nutrients: { carbs: 15, protein: 1, fat: 1, fibre: 3, iron: 0.3, calcium: 34, vitC: 93 } },
  { name: 'Melon (cantaloupe)', groups: ['Fruit'], nutrients: { carbs: 8, protein: 1, fat: 0, fibre: 1, iron: 0.2, calcium: 9, vitC: 37 } },
  { name: 'Honeydew melon', groups: ['Fruit'], nutrients: { carbs: 9, protein: 1, fat: 0, fibre: 1, iron: 0.2, calcium: 6, vitC: 18 } },
  { name: 'Grapefruit', groups: ['Fruit'], nutrients: { carbs: 11, protein: 1, fat: 0, fibre: 2, iron: 0.1, calcium: 22, vitC: 31 } },
  { name: 'Lemon', groups: ['Fruit'], nutrients: { carbs: 9, protein: 1, fat: 0, fibre: 3, iron: 0.6, calcium: 26, vitC: 53 } },
  { name: 'Lime', groups: ['Fruit'], nutrients: { carbs: 11, protein: 1, fat: 0, fibre: 3, iron: 0.6, calcium: 33, vitC: 29 } },
  { name: 'Pomegranate', groups: ['Fruit'], nutrients: { carbs: 19, protein: 2, fat: 1, fibre: 4, iron: 0.3, calcium: 10, vitC: 10 } },
  { name: 'Passion fruit', groups: ['Fruit'], nutrients: { carbs: 23, protein: 2, fat: 1, fibre: 10, iron: 1.6, calcium: 12, vitC: 30 } },
  { name: 'Lychee', groups: ['Fruit'], nutrients: { carbs: 17, protein: 1, fat: 0, fibre: 1, iron: 0.3, calcium: 5, vitC: 72 } },
  { name: 'Papaya', groups: ['Fruit'], nutrients: { carbs: 11, protein: 1, fat: 0, fibre: 2, iron: 0.3, calcium: 20, vitC: 61 } },
  { name: 'Dragon fruit', groups: ['Fruit'], nutrients: { carbs: 13, protein: 1, fat: 0, fibre: 3, iron: 0.7, calcium: 18, vitC: 3 } },
  { name: 'Coconut (fresh)', groups: ['Fruit'], nutrients: { carbs: 15, protein: 3, fat: 33, fibre: 9, iron: 2.4, calcium: 14, vitC: 3 } },
  { name: 'Dates', groups: ['Fruit'], nutrients: { carbs: 75, protein: 2, fat: 0, fibre: 7, iron: 1.0, calcium: 64, vitC: 0 } },
  { name: 'Raisins', groups: ['Fruit'], nutrients: { carbs: 79, protein: 3, fat: 0, fibre: 4, iron: 1.9, calcium: 50, vitC: 2 } },
  { name: 'Dried apricots', groups: ['Fruit'], nutrients: { carbs: 63, protein: 3, fat: 0, fibre: 7, iron: 2.7, calcium: 55, vitC: 1 } },
  { name: 'Dried cranberries', groups: ['Fruit'], nutrients: { carbs: 82, protein: 0, fat: 1, fibre: 6, iron: 0.4, calcium: 10, vitC: 0 } },
  { name: 'Fig', groups: ['Fruit'], nutrients: { carbs: 19, protein: 1, fat: 0, fibre: 3, iron: 0.4, calcium: 35, vitC: 2 } },
  { name: 'Avocado', groups: ['Fruit', 'Vegetables'], nutrients: { carbs: 9, protein: 2, fat: 15, fibre: 7, iron: 0.6, calcium: 12, vitC: 10 } },
  { name: 'Satsuma', groups: ['Fruit'], nutrients: { carbs: 11, protein: 1, fat: 0, fibre: 2, iron: 0.1, calcium: 37, vitC: 27 } },
  { name: 'Clementine', groups: ['Fruit'], nutrients: { carbs: 12, protein: 1, fat: 0, fibre: 2, iron: 0.1, calcium: 30, vitC: 49 } },
  { name: 'Tangerine', groups: ['Fruit'], nutrients: { carbs: 13, protein: 1, fat: 0, fibre: 2, iron: 0.2, calcium: 37, vitC: 27 } },
  { name: 'Star fruit', groups: ['Fruit'], nutrients: { carbs: 7, protein: 1, fat: 0, fibre: 3, iron: 0.1, calcium: 3, vitC: 34 } },
  { name: 'Guava', groups: ['Fruit'], nutrients: { carbs: 14, protein: 3, fat: 1, fibre: 5, iron: 0.3, calcium: 18, vitC: 228 } },
  // ── Vegetables ──
  { name: 'Spinach', groups: ['Vegetables'], nutrients: { carbs: 4, protein: 3, fat: 0, fibre: 2, iron: 2.7, calcium: 99, vitC: 28 } },
  { name: 'Broccoli', groups: ['Vegetables'], nutrients: { carbs: 7, protein: 3, fat: 0, fibre: 3, iron: 0.7, calcium: 47, vitC: 89 } },
  { name: 'Carrots', groups: ['Vegetables'], nutrients: { carbs: 10, protein: 1, fat: 0, fibre: 3, iron: 0.3, calcium: 33, vitC: 6 } },
  { name: 'Sweet potato', groups: ['Vegetables'], nutrients: { carbs: 20, protein: 2, fat: 0, fibre: 3, iron: 0.6, calcium: 30, vitC: 2 } },
  { name: 'Peppers', groups: ['Vegetables'], nutrients: { carbs: 6, protein: 1, fat: 0, fibre: 2, iron: 0.4, calcium: 7, vitC: 128 } },
  { name: 'Tomatoes', groups: ['Vegetables'], nutrients: { carbs: 4, protein: 1, fat: 0, fibre: 1, iron: 0.3, calcium: 10, vitC: 14 } },
  { name: 'Cucumber', groups: ['Vegetables'], nutrients: { carbs: 4, protein: 1, fat: 0, fibre: 1, iron: 0.3, calcium: 16, vitC: 3 } },
  { name: 'Peas', groups: ['Vegetables', 'Protein'], nutrients: { carbs: 14, protein: 5, fat: 0, fibre: 5, iron: 1.5, calcium: 25, vitC: 40 } },
  { name: 'Potato', groups: ['Vegetables', 'Grains'], nutrients: { carbs: 17, protein: 2, fat: 0, fibre: 2, iron: 0.8, calcium: 12, vitC: 20 } },
  { name: 'Cauliflower', groups: ['Vegetables'], nutrients: { carbs: 5, protein: 2, fat: 0, fibre: 2, iron: 0.4, calcium: 22, vitC: 48 } },
  { name: 'Courgette/zucchini', groups: ['Vegetables'], nutrients: { carbs: 3, protein: 1, fat: 0, fibre: 1, iron: 0.4, calcium: 16, vitC: 18 } },
  { name: 'Aubergine/eggplant', groups: ['Vegetables'], nutrients: { carbs: 6, protein: 1, fat: 0, fibre: 3, iron: 0.2, calcium: 9, vitC: 2 } },
  { name: 'Mushrooms', groups: ['Vegetables'], nutrients: { carbs: 3, protein: 3, fat: 0, fibre: 1, iron: 0.5, calcium: 3, vitC: 2 } },
  { name: 'Onion', groups: ['Vegetables'], nutrients: { carbs: 9, protein: 1, fat: 0, fibre: 2, iron: 0.2, calcium: 23, vitC: 7 } },
  { name: 'Garlic', groups: ['Vegetables'], nutrients: { carbs: 33, protein: 6, fat: 0, fibre: 2, iron: 1.7, calcium: 181, vitC: 31 } },
  { name: 'Lettuce', groups: ['Vegetables'], nutrients: { carbs: 3, protein: 1, fat: 0, fibre: 1, iron: 0.9, calcium: 36, vitC: 9 } },
  { name: 'Kale', groups: ['Vegetables'], nutrients: { carbs: 9, protein: 4, fat: 1, fibre: 4, iron: 1.5, calcium: 150, vitC: 120 } },
  { name: 'Rocket/arugula', groups: ['Vegetables'], nutrients: { carbs: 4, protein: 3, fat: 1, fibre: 2, iron: 1.5, calcium: 160, vitC: 15 } },
  { name: 'Cabbage', groups: ['Vegetables'], nutrients: { carbs: 6, protein: 1, fat: 0, fibre: 3, iron: 0.5, calcium: 40, vitC: 37 } },
  { name: 'Brussels sprouts', groups: ['Vegetables'], nutrients: { carbs: 9, protein: 3, fat: 0, fibre: 4, iron: 1.4, calcium: 42, vitC: 85 } },
  { name: 'Green beans', groups: ['Vegetables'], nutrients: { carbs: 7, protein: 2, fat: 0, fibre: 3, iron: 1.0, calcium: 37, vitC: 12 } },
  { name: 'Asparagus', groups: ['Vegetables'], nutrients: { carbs: 4, protein: 2, fat: 0, fibre: 2, iron: 2.1, calcium: 24, vitC: 6 } },
  { name: 'Celery', groups: ['Vegetables'], nutrients: { carbs: 3, protein: 1, fat: 0, fibre: 2, iron: 0.2, calcium: 40, vitC: 3 } },
  { name: 'Beetroot', groups: ['Vegetables'], nutrients: { carbs: 10, protein: 2, fat: 0, fibre: 3, iron: 0.8, calcium: 16, vitC: 5 } },
  { name: 'Radish', groups: ['Vegetables'], nutrients: { carbs: 3, protein: 1, fat: 0, fibre: 2, iron: 0.3, calcium: 25, vitC: 15 } },
  { name: 'Turnip', groups: ['Vegetables'], nutrients: { carbs: 6, protein: 1, fat: 0, fibre: 2, iron: 0.3, calcium: 30, vitC: 21 } },
  { name: 'Parsnip', groups: ['Vegetables'], nutrients: { carbs: 18, protein: 1, fat: 0, fibre: 5, iron: 0.6, calcium: 36, vitC: 17 } },
  { name: 'Butternut squash', groups: ['Vegetables'], nutrients: { carbs: 12, protein: 1, fat: 0, fibre: 2, iron: 0.7, calcium: 48, vitC: 21 } },
  { name: 'Sweetcorn', groups: ['Vegetables', 'Grains'], nutrients: { carbs: 19, protein: 3, fat: 1, fibre: 2, iron: 0.5, calcium: 2, vitC: 7 } },
  { name: 'Leek', groups: ['Vegetables'], nutrients: { carbs: 14, protein: 2, fat: 0, fibre: 2, iron: 2.1, calcium: 59, vitC: 12 } },
  { name: 'Spring onion', groups: ['Vegetables'], nutrients: { carbs: 7, protein: 2, fat: 0, fibre: 3, iron: 1.5, calcium: 72, vitC: 19 } },
  { name: 'Watercress', groups: ['Vegetables'], nutrients: { carbs: 1, protein: 2, fat: 0, fibre: 1, iron: 0.2, calcium: 120, vitC: 43 } },
  { name: 'Pak choi', groups: ['Vegetables'], nutrients: { carbs: 2, protein: 2, fat: 0, fibre: 1, iron: 0.8, calcium: 105, vitC: 45 } },
  { name: 'Artichoke', groups: ['Vegetables'], nutrients: { carbs: 11, protein: 3, fat: 0, fibre: 5, iron: 1.3, calcium: 44, vitC: 12 } },
  { name: 'Okra', groups: ['Vegetables'], nutrients: { carbs: 7, protein: 2, fat: 0, fibre: 3, iron: 0.6, calcium: 82, vitC: 23 } },
  { name: 'Bean sprouts', groups: ['Vegetables'], nutrients: { carbs: 6, protein: 3, fat: 0, fibre: 2, iron: 0.9, calcium: 13, vitC: 13 } },
  { name: 'Edamame', groups: ['Vegetables', 'Protein'], nutrients: { carbs: 9, protein: 11, fat: 5, fibre: 5, iron: 2.3, calcium: 63, vitC: 6 } },
  { name: 'Fennel', groups: ['Vegetables'], nutrients: { carbs: 7, protein: 1, fat: 0, fibre: 3, iron: 0.7, calcium: 49, vitC: 12 } },
  { name: 'Ginger', groups: ['Vegetables'], nutrients: { carbs: 18, protein: 2, fat: 1, fibre: 2, iron: 0.6, calcium: 16, vitC: 5 } },
  { name: 'Chilli peppers', groups: ['Vegetables'], nutrients: { carbs: 9, protein: 2, fat: 0, fibre: 2, iron: 1.0, calcium: 14, vitC: 144 } },
  // ── Protein / Meat ──
  { name: 'Chicken breast', groups: ['Protein'], nutrients: { carbs: 0, protein: 31, fat: 4, fibre: 0, iron: 1.0, calcium: 15, vitC: 0 } },
  { name: 'Chicken thigh', groups: ['Protein'], nutrients: { carbs: 0, protein: 26, fat: 10, fibre: 0, iron: 1.1, calcium: 12, vitC: 0 } },
  { name: 'Chicken drumstick', groups: ['Protein'], nutrients: { carbs: 0, protein: 24, fat: 8, fibre: 0, iron: 1.0, calcium: 11, vitC: 0 } },
  { name: 'Chicken wings', groups: ['Protein'], nutrients: { carbs: 0, protein: 22, fat: 12, fibre: 0, iron: 0.9, calcium: 13, vitC: 0 } },
  { name: 'Turkey', groups: ['Protein'], nutrients: { carbs: 0, protein: 29, fat: 2, fibre: 0, iron: 1.4, calcium: 11, vitC: 0 } },
  { name: 'Turkey mince', groups: ['Protein'], nutrients: { carbs: 0, protein: 27, fat: 8, fibre: 0, iron: 1.5, calcium: 20, vitC: 0 } },
  { name: 'Duck', groups: ['Protein'], nutrients: { carbs: 0, protein: 19, fat: 28, fibre: 0, iron: 2.7, calcium: 11, vitC: 0 } },
  { name: 'Beef steak', groups: ['Protein'], nutrients: { carbs: 0, protein: 27, fat: 12, fibre: 0, iron: 2.8, calcium: 12, vitC: 0 } },
  { name: 'Beef mince', groups: ['Protein'], nutrients: { carbs: 0, protein: 26, fat: 15, fibre: 0, iron: 2.6, calcium: 18, vitC: 0 } },
  { name: 'Beef roast', groups: ['Protein'], nutrients: { carbs: 0, protein: 26, fat: 10, fibre: 0, iron: 2.4, calcium: 10, vitC: 0 } },
  { name: 'Lamb chop', groups: ['Protein'], nutrients: { carbs: 0, protein: 25, fat: 18, fibre: 0, iron: 1.9, calcium: 17, vitC: 0 } },
  { name: 'Lamb mince', groups: ['Protein'], nutrients: { carbs: 0, protein: 24, fat: 17, fibre: 0, iron: 1.7, calcium: 15, vitC: 0 } },
  { name: 'Pork chop', groups: ['Protein'], nutrients: { carbs: 0, protein: 27, fat: 10, fibre: 0, iron: 0.9, calcium: 19, vitC: 0 } },
  { name: 'Pork loin', groups: ['Protein'], nutrients: { carbs: 0, protein: 27, fat: 8, fibre: 0, iron: 0.8, calcium: 5, vitC: 0 } },
  { name: 'Bacon', groups: ['Protein'], nutrients: { carbs: 0, protein: 12, fat: 14, fibre: 0, iron: 0.4, calcium: 5, vitC: 0 } },
  { name: 'Ham', groups: ['Protein'], nutrients: { carbs: 2, protein: 18, fat: 5, fibre: 0, iron: 0.9, calcium: 7, vitC: 0 } },
  { name: 'Sausages (pork)', groups: ['Protein'], nutrients: { carbs: 2, protein: 14, fat: 22, fibre: 0, iron: 1.0, calcium: 10, vitC: 0 } },
  { name: 'Chorizo', groups: ['Protein'], nutrients: { carbs: 2, protein: 24, fat: 38, fibre: 0, iron: 1.8, calcium: 15, vitC: 0 } },
  { name: 'Salami', groups: ['Protein'], nutrients: { carbs: 1, protein: 22, fat: 34, fibre: 0, iron: 1.5, calcium: 10, vitC: 0 } },
  { name: 'Pepperoni', groups: ['Protein'], nutrients: { carbs: 1, protein: 22, fat: 40, fibre: 0, iron: 1.2, calcium: 8, vitC: 1 } },
  { name: 'Venison', groups: ['Protein'], nutrients: { carbs: 0, protein: 30, fat: 3, fibre: 0, iron: 3.4, calcium: 5, vitC: 0 } },
  { name: 'Liver', groups: ['Protein'], nutrients: { carbs: 4, protein: 21, fat: 4, fibre: 0, iron: 6.5, calcium: 5, vitC: 23 } },
  // ── Fish & Seafood ──
  { name: 'Salmon', groups: ['Protein'], nutrients: { carbs: 0, protein: 25, fat: 13, fibre: 0, iron: 0.8, calcium: 12, vitC: 0 } },
  { name: 'Tuna', groups: ['Protein'], nutrients: { carbs: 0, protein: 26, fat: 1, fibre: 0, iron: 1.0, calcium: 10, vitC: 0 } },
  { name: 'Cod', groups: ['Protein'], nutrients: { carbs: 0, protein: 23, fat: 1, fibre: 0, iron: 0.4, calcium: 16, vitC: 0 } },
  { name: 'Haddock', groups: ['Protein'], nutrients: { carbs: 0, protein: 24, fat: 1, fibre: 0, iron: 1.2, calcium: 36, vitC: 0 } },
  { name: 'Sea bass', groups: ['Protein'], nutrients: { carbs: 0, protein: 24, fat: 3, fibre: 0, iron: 0.4, calcium: 10, vitC: 0 } },
  { name: 'Trout', groups: ['Protein'], nutrients: { carbs: 0, protein: 23, fat: 7, fibre: 0, iron: 0.7, calcium: 67, vitC: 0 } },
  { name: 'Mackerel', groups: ['Protein'], nutrients: { carbs: 0, protein: 24, fat: 17, fibre: 0, iron: 1.6, calcium: 12, vitC: 0 } },
  { name: 'Sardines', groups: ['Protein'], nutrients: { carbs: 0, protein: 25, fat: 11, fibre: 0, iron: 2.9, calcium: 382, vitC: 0 } },
  { name: 'Anchovies', groups: ['Protein'], nutrients: { carbs: 0, protein: 29, fat: 10, fibre: 0, iron: 4.6, calcium: 147, vitC: 0 } },
  { name: 'Prawns', groups: ['Protein'], nutrients: { carbs: 0, protein: 24, fat: 1, fibre: 0, iron: 2.4, calcium: 70, vitC: 0 } },
  { name: 'Crab', groups: ['Protein'], nutrients: { carbs: 0, protein: 19, fat: 2, fibre: 0, iron: 0.7, calcium: 46, vitC: 0 } },
  { name: 'Lobster', groups: ['Protein'], nutrients: { carbs: 0, protein: 20, fat: 1, fibre: 0, iron: 0.3, calcium: 96, vitC: 0 } },
  { name: 'Mussels', groups: ['Protein'], nutrients: { carbs: 4, protein: 24, fat: 4, fibre: 0, iron: 6.7, calcium: 33, vitC: 0 } },
  { name: 'Squid/calamari', groups: ['Protein'], nutrients: { carbs: 3, protein: 18, fat: 2, fibre: 0, iron: 1.1, calcium: 32, vitC: 5 } },
  { name: 'Fish fingers', groups: ['Protein', 'Grains'], nutrients: { carbs: 15, protein: 12, fat: 8, fibre: 1, iron: 0.5, calcium: 20, vitC: 0 } },
  { name: 'Fish cake', groups: ['Protein', 'Grains'], nutrients: { carbs: 14, protein: 10, fat: 7, fibre: 1, iron: 0.5, calcium: 30, vitC: 0 } },
  { name: 'Smoked salmon', groups: ['Protein'], nutrients: { carbs: 0, protein: 22, fat: 8, fibre: 0, iron: 0.9, calcium: 11, vitC: 0 } },
  // ── Eggs & Dairy ──
  { name: 'Eggs', groups: ['Protein', 'Dairy'], nutrients: { carbs: 1, protein: 13, fat: 11, fibre: 0, iron: 1.8, calcium: 56, vitC: 0 } },
  { name: 'Scrambled eggs', groups: ['Protein', 'Dairy'], nutrients: { carbs: 2, protein: 12, fat: 14, fibre: 0, iron: 1.5, calcium: 60, vitC: 0 } },
  { name: 'Omelette', groups: ['Protein', 'Dairy'], nutrients: { carbs: 1, protein: 11, fat: 12, fibre: 0, iron: 1.6, calcium: 50, vitC: 0 } },
  { name: 'Milk', groups: ['Dairy'], nutrients: { carbs: 12, protein: 8, fat: 8, fibre: 0, iron: 0.1, calcium: 300, vitC: 2 } },
  { name: 'Skimmed milk', groups: ['Dairy'], nutrients: { carbs: 12, protein: 9, fat: 0, fibre: 0, iron: 0.1, calcium: 310, vitC: 2 } },
  { name: 'Oat milk', groups: ['Dairy'], nutrients: { carbs: 16, protein: 3, fat: 5, fibre: 2, iron: 0.2, calcium: 350, vitC: 0 } },
  { name: 'Almond milk', groups: ['Dairy'], nutrients: { carbs: 3, protein: 1, fat: 3, fibre: 0, iron: 0.3, calcium: 300, vitC: 0 } },
  { name: 'Soya milk', groups: ['Dairy'], nutrients: { carbs: 4, protein: 7, fat: 4, fibre: 1, iron: 0.4, calcium: 300, vitC: 0 } },
  { name: 'Yoghurt', groups: ['Dairy'], nutrients: { carbs: 12, protein: 10, fat: 4, fibre: 0, iron: 0.1, calcium: 200, vitC: 1 } },
  { name: 'Greek yoghurt', groups: ['Dairy'], nutrients: { carbs: 4, protein: 10, fat: 5, fibre: 0, iron: 0.1, calcium: 110, vitC: 0 } },
  { name: 'Cheese', groups: ['Dairy'], nutrients: { carbs: 1, protein: 7, fat: 9, fibre: 0, iron: 0.2, calcium: 200, vitC: 0 } },
  { name: 'Cheddar cheese', groups: ['Dairy'], nutrients: { carbs: 1, protein: 25, fat: 33, fibre: 0, iron: 0.7, calcium: 720, vitC: 0 } },
  { name: 'Mozzarella', groups: ['Dairy'], nutrients: { carbs: 2, protein: 22, fat: 22, fibre: 0, iron: 0.4, calcium: 505, vitC: 0 } },
  { name: 'Cream cheese', groups: ['Dairy'], nutrients: { carbs: 4, protein: 6, fat: 34, fibre: 0, iron: 0.4, calcium: 80, vitC: 0 } },
  { name: 'Cottage cheese', groups: ['Dairy'], nutrients: { carbs: 3, protein: 11, fat: 4, fibre: 0, iron: 0.1, calcium: 73, vitC: 0 } },
  { name: 'Butter', groups: ['Dairy'], nutrients: { carbs: 0, protein: 0, fat: 12, fibre: 0, iron: 0, calcium: 3, vitC: 0 } },
  { name: 'Cream', groups: ['Dairy'], nutrients: { carbs: 3, protein: 2, fat: 37, fibre: 0, iron: 0, calcium: 65, vitC: 1 } },
  { name: 'Ice cream', groups: ['Dairy'], nutrients: { carbs: 24, protein: 4, fat: 11, fibre: 0, iron: 0.1, calcium: 130, vitC: 1 } },
  // ── Grains & Carbs ──
  { name: 'Rice', groups: ['Grains'], nutrients: { carbs: 45, protein: 4, fat: 0, fibre: 1, iron: 0.4, calcium: 10, vitC: 0 } },
  { name: 'Brown rice', groups: ['Grains'], nutrients: { carbs: 45, protein: 5, fat: 2, fibre: 4, iron: 0.8, calcium: 10, vitC: 0 } },
  { name: 'Pasta', groups: ['Grains'], nutrients: { carbs: 43, protein: 8, fat: 1, fibre: 2, iron: 1.3, calcium: 7, vitC: 0 } },
  { name: 'Wholemeal pasta', groups: ['Grains'], nutrients: { carbs: 37, protein: 7, fat: 1, fibre: 5, iron: 1.5, calcium: 15, vitC: 0 } },
  { name: 'Bread (white)', groups: ['Grains'], nutrients: { carbs: 22, protein: 3, fat: 1, fibre: 1, iron: 0.7, calcium: 30, vitC: 0 } },
  { name: 'Bread (wholemeal)', groups: ['Grains'], nutrients: { carbs: 20, protein: 4, fat: 1, fibre: 3, iron: 1.0, calcium: 20, vitC: 0 } },
  { name: 'Sourdough bread', groups: ['Grains'], nutrients: { carbs: 25, protein: 4, fat: 1, fibre: 2, iron: 0.8, calcium: 15, vitC: 0 } },
  { name: 'Pitta bread', groups: ['Grains'], nutrients: { carbs: 33, protein: 5, fat: 1, fibre: 2, iron: 1.2, calcium: 50, vitC: 0 } },
  { name: 'Naan bread', groups: ['Grains'], nutrients: { carbs: 50, protein: 9, fat: 9, fibre: 2, iron: 2.0, calcium: 50, vitC: 0 } },
  { name: 'Bagel', groups: ['Grains'], nutrients: { carbs: 50, protein: 10, fat: 2, fibre: 2, iron: 2.5, calcium: 20, vitC: 0 } },
  { name: 'Croissant', groups: ['Grains', 'Dairy'], nutrients: { carbs: 26, protein: 5, fat: 12, fibre: 1, iron: 1.0, calcium: 20, vitC: 0 } },
  { name: 'Oats', groups: ['Grains'], nutrients: { carbs: 27, protein: 5, fat: 3, fibre: 4, iron: 1.7, calcium: 20, vitC: 0 } },
  { name: 'Cereal', groups: ['Grains'], nutrients: { carbs: 35, protein: 3, fat: 1, fibre: 3, iron: 4.0, calcium: 15, vitC: 0 } },
  { name: 'Weetabix', groups: ['Grains'], nutrients: { carbs: 30, protein: 5, fat: 1, fibre: 4, iron: 4.5, calcium: 20, vitC: 0 } },
  { name: 'Granola', groups: ['Grains'], nutrients: { carbs: 28, protein: 4, fat: 8, fibre: 3, iron: 1.5, calcium: 25, vitC: 0 } },
  { name: 'Muesli', groups: ['Grains'], nutrients: { carbs: 30, protein: 4, fat: 3, fibre: 4, iron: 2.0, calcium: 30, vitC: 0 } },
  { name: 'Wrap/tortilla', groups: ['Grains'], nutrients: { carbs: 30, protein: 4, fat: 3, fibre: 2, iron: 1.2, calcium: 40, vitC: 0 } },
  { name: 'Couscous', groups: ['Grains'], nutrients: { carbs: 36, protein: 6, fat: 0, fibre: 2, iron: 0.4, calcium: 8, vitC: 0 } },
  { name: 'Quinoa', groups: ['Grains', 'Protein'], nutrients: { carbs: 21, protein: 4, fat: 2, fibre: 3, iron: 1.5, calcium: 17, vitC: 0 } },
  { name: 'Bulgur wheat', groups: ['Grains'], nutrients: { carbs: 34, protein: 6, fat: 0, fibre: 5, iron: 1.0, calcium: 10, vitC: 0 } },
  { name: 'Noodles', groups: ['Grains'], nutrients: { carbs: 25, protein: 5, fat: 1, fibre: 1, iron: 0.5, calcium: 7, vitC: 0 } },
  { name: 'Egg noodles', groups: ['Grains'], nutrients: { carbs: 25, protein: 5, fat: 2, fibre: 1, iron: 1.5, calcium: 10, vitC: 0 } },
  { name: 'Rice noodles', groups: ['Grains'], nutrients: { carbs: 24, protein: 1, fat: 0, fibre: 1, iron: 0.2, calcium: 4, vitC: 0 } },
  { name: 'Crackers', groups: ['Grains'], nutrients: { carbs: 15, protein: 2, fat: 3, fibre: 1, iron: 0.5, calcium: 10, vitC: 0 } },
  { name: 'Rice cakes', groups: ['Grains'], nutrients: { carbs: 23, protein: 2, fat: 1, fibre: 1, iron: 0.2, calcium: 3, vitC: 0 } },
  { name: 'Pancakes', groups: ['Grains', 'Dairy'], nutrients: { carbs: 28, protein: 6, fat: 8, fibre: 1, iron: 1.2, calcium: 80, vitC: 0 } },
  { name: 'Waffles', groups: ['Grains', 'Dairy'], nutrients: { carbs: 33, protein: 6, fat: 10, fibre: 1, iron: 1.5, calcium: 90, vitC: 0 } },
  { name: 'Toast', groups: ['Grains'], nutrients: { carbs: 20, protein: 3, fat: 1, fibre: 2, iron: 0.8, calcium: 20, vitC: 0 } },
  { name: 'Crumpets', groups: ['Grains'], nutrients: { carbs: 30, protein: 4, fat: 1, fibre: 2, iron: 1.0, calcium: 40, vitC: 0 } },
  { name: 'Porridge', groups: ['Grains', 'Dairy'], nutrients: { carbs: 20, protein: 5, fat: 4, fibre: 3, iron: 1.2, calcium: 120, vitC: 0 } },
  // ── Nuts & Seeds ──
  { name: 'Peanut butter', groups: ['Protein'], nutrients: { carbs: 6, protein: 8, fat: 16, fibre: 2, iron: 0.6, calcium: 14, vitC: 0 } },
  { name: 'Almond butter', groups: ['Protein'], nutrients: { carbs: 6, protein: 7, fat: 18, fibre: 3, iron: 1.1, calcium: 60, vitC: 0 } },
  { name: 'Peanuts', groups: ['Protein'], nutrients: { carbs: 8, protein: 7, fat: 14, fibre: 2, iron: 1.3, calcium: 26, vitC: 0 } },
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
  // ── Legumes ──
  { name: 'Beans', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 22, protein: 8, fat: 1, fibre: 7, iron: 2.1, calcium: 40, vitC: 2 } },
  { name: 'Baked beans', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 16, protein: 5, fat: 1, fibre: 4, iron: 1.4, calcium: 50, vitC: 0 } },
  { name: 'Kidney beans', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 23, protein: 9, fat: 0, fibre: 7, iron: 2.9, calcium: 35, vitC: 1 } },
  { name: 'Chickpeas', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 27, protein: 9, fat: 3, fibre: 8, iron: 2.9, calcium: 49, vitC: 1 } },
  { name: 'Lentils', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 20, protein: 9, fat: 0, fibre: 8, iron: 3.3, calcium: 19, vitC: 2 } },
  { name: 'Black beans', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 24, protein: 9, fat: 1, fibre: 9, iron: 2.1, calcium: 27, vitC: 0 } },
  { name: 'Butter beans', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 20, protein: 8, fat: 0, fibre: 7, iron: 2.4, calcium: 32, vitC: 0 } },
  { name: 'Hummus', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 14, protein: 8, fat: 10, fibre: 6, iron: 1.6, calcium: 38, vitC: 0 } },
  { name: 'Tofu', groups: ['Protein'], nutrients: { carbs: 2, protein: 8, fat: 5, fibre: 1, iron: 5.4, calcium: 350, vitC: 0 } },
  { name: 'Tempeh', groups: ['Protein'], nutrients: { carbs: 9, protein: 19, fat: 11, fibre: 5, iron: 2.7, calcium: 111, vitC: 0 } },
  // ── Prepared meals & snacks ──
  { name: 'Pizza', groups: ['Grains', 'Dairy', 'Protein'], nutrients: { carbs: 33, protein: 12, fat: 10, fibre: 2, iron: 1.5, calcium: 150, vitC: 2 } },
  { name: 'Chips/fries', groups: ['Grains'], nutrients: { carbs: 30, protein: 3, fat: 15, fibre: 3, iron: 0.6, calcium: 10, vitC: 5 } },
  { name: 'Jacket potato', groups: ['Vegetables', 'Grains'], nutrients: { carbs: 30, protein: 4, fat: 0, fibre: 4, iron: 1.2, calcium: 15, vitC: 15 } },
  { name: 'Mashed potato', groups: ['Vegetables', 'Dairy'], nutrients: { carbs: 15, protein: 2, fat: 4, fibre: 1, iron: 0.3, calcium: 20, vitC: 8 } },
  { name: 'Soup', groups: ['Vegetables'], nutrients: { carbs: 10, protein: 3, fat: 2, fibre: 2, iron: 0.5, calcium: 20, vitC: 5 } },
  { name: 'Stir fry', groups: ['Vegetables', 'Protein'], nutrients: { carbs: 12, protein: 15, fat: 8, fibre: 3, iron: 1.5, calcium: 30, vitC: 20 } },
  { name: 'Curry', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 15, protein: 14, fat: 12, fibre: 3, iron: 1.5, calcium: 40, vitC: 5 } },
  { name: 'Chilli con carne', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 18, protein: 16, fat: 10, fibre: 5, iron: 2.5, calcium: 45, vitC: 8 } },
  { name: 'Spaghetti bolognese', groups: ['Grains', 'Protein'], nutrients: { carbs: 40, protein: 18, fat: 12, fibre: 3, iron: 2.5, calcium: 30, vitC: 5 } },
  { name: 'Lasagne', groups: ['Grains', 'Protein', 'Dairy'], nutrients: { carbs: 25, protein: 14, fat: 12, fibre: 2, iron: 1.5, calcium: 150, vitC: 3 } },
  { name: 'Mac and cheese', groups: ['Grains', 'Dairy'], nutrients: { carbs: 30, protein: 10, fat: 15, fibre: 1, iron: 0.8, calcium: 200, vitC: 0 } },
  { name: 'Shepherd\'s pie', groups: ['Protein', 'Vegetables'], nutrients: { carbs: 20, protein: 12, fat: 10, fibre: 3, iron: 1.5, calcium: 30, vitC: 10 } },
  { name: 'Fish and chips', groups: ['Protein', 'Grains'], nutrients: { carbs: 40, protein: 20, fat: 20, fibre: 3, iron: 1.0, calcium: 30, vitC: 5 } },
  { name: 'Burger', groups: ['Protein', 'Grains'], nutrients: { carbs: 25, protein: 20, fat: 18, fibre: 2, iron: 2.5, calcium: 40, vitC: 2 } },
  { name: 'Hot dog', groups: ['Protein', 'Grains'], nutrients: { carbs: 22, protein: 10, fat: 15, fibre: 1, iron: 1.0, calcium: 20, vitC: 0 } },
  { name: 'Sandwich', groups: ['Grains', 'Protein'], nutrients: { carbs: 30, protein: 12, fat: 8, fibre: 3, iron: 1.5, calcium: 50, vitC: 3 } },
  { name: 'Wrap (filled)', groups: ['Grains', 'Protein', 'Vegetables'], nutrients: { carbs: 35, protein: 15, fat: 10, fibre: 3, iron: 1.5, calcium: 50, vitC: 5 } },
  { name: 'Sushi', groups: ['Grains', 'Protein'], nutrients: { carbs: 30, protein: 8, fat: 2, fibre: 1, iron: 0.5, calcium: 10, vitC: 0 } },
  { name: 'Fried rice', groups: ['Grains', 'Vegetables'], nutrients: { carbs: 40, protein: 8, fat: 10, fibre: 2, iron: 1.0, calcium: 20, vitC: 3 } },
  { name: 'Roast dinner', groups: ['Protein', 'Vegetables', 'Grains'], nutrients: { carbs: 35, protein: 25, fat: 15, fibre: 5, iron: 2.5, calcium: 40, vitC: 10 } },
  { name: 'Sunday roast', groups: ['Protein', 'Vegetables', 'Grains'], nutrients: { carbs: 35, protein: 25, fat: 15, fibre: 5, iron: 2.5, calcium: 40, vitC: 10 } },
  { name: 'Fajitas', groups: ['Protein', 'Vegetables', 'Grains'], nutrients: { carbs: 30, protein: 18, fat: 10, fibre: 4, iron: 1.8, calcium: 50, vitC: 30 } },
  { name: 'Tacos', groups: ['Protein', 'Vegetables', 'Grains'], nutrients: { carbs: 20, protein: 12, fat: 10, fibre: 3, iron: 1.5, calcium: 60, vitC: 5 } },
  { name: 'Nachos', groups: ['Grains', 'Dairy'], nutrients: { carbs: 30, protein: 8, fat: 18, fibre: 3, iron: 1.0, calcium: 100, vitC: 3 } },
  { name: 'Risotto', groups: ['Grains', 'Dairy'], nutrients: { carbs: 35, protein: 8, fat: 8, fibre: 1, iron: 0.5, calcium: 80, vitC: 0 } },
  { name: 'Paella', groups: ['Grains', 'Protein'], nutrients: { carbs: 35, protein: 15, fat: 8, fibre: 2, iron: 1.5, calcium: 30, vitC: 5 } },
  { name: 'Omelette', groups: ['Protein', 'Dairy'], nutrients: { carbs: 1, protein: 11, fat: 12, fibre: 0, iron: 1.6, calcium: 50, vitC: 0 } },
  { name: 'Beans on toast', groups: ['Protein', 'Grains'], nutrients: { carbs: 35, protein: 10, fat: 2, fibre: 6, iron: 2.0, calcium: 60, vitC: 0 } },
  { name: 'Cheese on toast', groups: ['Grains', 'Dairy'], nutrients: { carbs: 22, protein: 12, fat: 14, fibre: 1, iron: 0.8, calcium: 250, vitC: 0 } },
  { name: 'Chicken nuggets', groups: ['Protein', 'Grains'], nutrients: { carbs: 15, protein: 15, fat: 12, fibre: 1, iron: 0.7, calcium: 15, vitC: 0 } },
  { name: 'Spring rolls', groups: ['Vegetables', 'Grains'], nutrients: { carbs: 20, protein: 4, fat: 8, fibre: 2, iron: 0.5, calcium: 15, vitC: 3 } },
  { name: 'Dumplings', groups: ['Grains', 'Protein'], nutrients: { carbs: 20, protein: 8, fat: 6, fibre: 1, iron: 1.0, calcium: 15, vitC: 0 } },
  { name: 'Samosa', groups: ['Grains', 'Vegetables'], nutrients: { carbs: 25, protein: 4, fat: 12, fibre: 2, iron: 0.8, calcium: 15, vitC: 3 } },
  // ── Snacks & treats ──
  { name: 'Granola bar', groups: ['Grains'], nutrients: { carbs: 25, protein: 3, fat: 6, fibre: 2, iron: 1.0, calcium: 20, vitC: 0 } },
  { name: 'Chocolate', groups: [], nutrients: { carbs: 25, protein: 2, fat: 14, fibre: 2, iron: 1.2, calcium: 30, vitC: 0 } },
  { name: 'Dark chocolate', groups: [], nutrients: { carbs: 20, protein: 3, fat: 15, fibre: 4, iron: 3.3, calcium: 40, vitC: 0 } },
  { name: 'Crisps', groups: [], nutrients: { carbs: 15, protein: 2, fat: 10, fibre: 1, iron: 0.3, calcium: 5, vitC: 3 } },
  { name: 'Biscuits', groups: ['Grains'], nutrients: { carbs: 20, protein: 2, fat: 8, fibre: 1, iron: 0.5, calcium: 10, vitC: 0 } },
  { name: 'Cake', groups: ['Grains', 'Dairy'], nutrients: { carbs: 35, protein: 4, fat: 15, fibre: 1, iron: 1.0, calcium: 40, vitC: 0 } },
  { name: 'Muffin', groups: ['Grains'], nutrients: { carbs: 35, protein: 4, fat: 12, fibre: 1, iron: 1.0, calcium: 30, vitC: 0 } },
  { name: 'Flapjack', groups: ['Grains'], nutrients: { carbs: 30, protein: 3, fat: 14, fibre: 2, iron: 1.2, calcium: 20, vitC: 0 } },
  { name: 'Brownie', groups: ['Grains'], nutrients: { carbs: 30, protein: 3, fat: 14, fibre: 1, iron: 1.5, calcium: 20, vitC: 0 } },
  { name: 'Doughnut', groups: ['Grains'], nutrients: { carbs: 30, protein: 4, fat: 15, fibre: 1, iron: 1.0, calcium: 20, vitC: 0 } },
  { name: 'Popcorn', groups: ['Grains'], nutrients: { carbs: 20, protein: 3, fat: 5, fibre: 4, iron: 0.8, calcium: 3, vitC: 0 } },
  { name: 'Pretzels', groups: ['Grains'], nutrients: { carbs: 22, protein: 3, fat: 1, fibre: 1, iron: 1.0, calcium: 10, vitC: 0 } },
  { name: 'Trail mix', groups: ['Protein', 'Fruit'], nutrients: { carbs: 20, protein: 5, fat: 15, fibre: 3, iron: 1.0, calcium: 30, vitC: 1 } },
  { name: 'Cereal bar', groups: ['Grains'], nutrients: { carbs: 22, protein: 2, fat: 5, fibre: 2, iron: 1.0, calcium: 15, vitC: 0 } },
  { name: 'Protein bar', groups: ['Protein'], nutrients: { carbs: 20, protein: 20, fat: 8, fibre: 3, iron: 2.0, calcium: 100, vitC: 0 } },
  { name: 'Dried fruit', groups: ['Fruit'], nutrients: { carbs: 65, protein: 2, fat: 0, fibre: 5, iron: 1.5, calcium: 40, vitC: 2 } },
  { name: 'Fruit snack', groups: ['Fruit'], nutrients: { carbs: 20, protein: 0, fat: 0, fibre: 1, iron: 0.2, calcium: 5, vitC: 10 } },
  { name: 'Jelly/jello', groups: [], nutrients: { carbs: 15, protein: 1, fat: 0, fibre: 0, iron: 0, calcium: 2, vitC: 0 } },
  { name: 'Sweets/candy', groups: [], nutrients: { carbs: 25, protein: 0, fat: 0, fibre: 0, iron: 0, calcium: 2, vitC: 0 } },
  // ── Drinks ──
  { name: 'Smoothie', groups: ['Fruit', 'Dairy'], nutrients: { carbs: 30, protein: 5, fat: 3, fibre: 3, iron: 0.5, calcium: 100, vitC: 30 } },
  { name: 'Protein shake', groups: ['Protein', 'Dairy'], nutrients: { carbs: 5, protein: 25, fat: 2, fibre: 1, iron: 2.0, calcium: 150, vitC: 0 } },
  { name: 'Orange juice', groups: ['Fruit'], nutrients: { carbs: 26, protein: 1, fat: 0, fibre: 0, iron: 0.2, calcium: 11, vitC: 50 } },
  { name: 'Apple juice', groups: ['Fruit'], nutrients: { carbs: 28, protein: 0, fat: 0, fibre: 0, iron: 0.1, calcium: 8, vitC: 1 } },
  { name: 'Hot chocolate', groups: ['Dairy'], nutrients: { carbs: 25, protein: 5, fat: 6, fibre: 1, iron: 0.5, calcium: 150, vitC: 0 } },
  { name: 'Milkshake', groups: ['Dairy'], nutrients: { carbs: 30, protein: 6, fat: 8, fibre: 0, iron: 0.2, calcium: 200, vitC: 2 } },
  // ── Condiments & extras ──
  { name: 'Honey', groups: [], nutrients: { carbs: 17, protein: 0, fat: 0, fibre: 0, iron: 0.1, calcium: 1, vitC: 0 } },
  { name: 'Jam', groups: [], nutrients: { carbs: 15, protein: 0, fat: 0, fibre: 0, iron: 0.1, calcium: 3, vitC: 1 } },
  { name: 'Nutella', groups: [], nutrients: { carbs: 12, protein: 1, fat: 6, fibre: 1, iron: 0.5, calcium: 15, vitC: 0 } },
  { name: 'Maple syrup', groups: [], nutrients: { carbs: 17, protein: 0, fat: 0, fibre: 0, iron: 0.1, calcium: 13, vitC: 0 } },
  { name: 'Olive oil', groups: [], nutrients: { carbs: 0, protein: 0, fat: 14, fibre: 0, iron: 0.1, calcium: 0, vitC: 0 } },
  { name: 'Coconut oil', groups: [], nutrients: { carbs: 0, protein: 0, fat: 14, fibre: 0, iron: 0, calcium: 0, vitC: 0 } },
  { name: 'Ketchup', groups: [], nutrients: { carbs: 6, protein: 0, fat: 0, fibre: 0, iron: 0.1, calcium: 3, vitC: 1 } },
  { name: 'Mayonnaise', groups: [], nutrients: { carbs: 1, protein: 0, fat: 11, fibre: 0, iron: 0, calcium: 2, vitC: 0 } },
  { name: 'Soy sauce', groups: [], nutrients: { carbs: 1, protein: 1, fat: 0, fibre: 0, iron: 0.4, calcium: 3, vitC: 0 } },
  { name: 'Pesto', groups: [], nutrients: { carbs: 2, protein: 3, fat: 14, fibre: 1, iron: 0.5, calcium: 60, vitC: 1 } },
  { name: 'Salsa', groups: ['Vegetables'], nutrients: { carbs: 5, protein: 1, fat: 0, fibre: 1, iron: 0.2, calcium: 10, vitC: 5 } },
  { name: 'Guacamole', groups: ['Vegetables', 'Fruit'], nutrients: { carbs: 8, protein: 2, fat: 12, fibre: 5, iron: 0.4, calcium: 10, vitC: 8 } },
  { name: 'Tahini', groups: ['Protein'], nutrients: { carbs: 6, protein: 5, fat: 16, fibre: 3, iron: 2.7, calcium: 130, vitC: 0 } },
]

const FOOD_GROUP_BASE = [
  { name: 'Fruit', color: '#f59e0b', icon: '🍎' },
  { name: 'Vegetables', color: '#10b981', icon: '🥦' },
  { name: 'Protein', color: '#ef4444', icon: '🥩' },
  { name: 'Grains', color: '#8b5cf6', icon: '🌾' },
  { name: 'Dairy', color: '#3b82f6', icon: '🥛' },
]

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
    },
  }
}

function getSuggestions(todayFoods, foodGroups, nutrientTargets) {
  const groupCounts = {}
  foodGroups.forEach(g => { groupCounts[g.name] = 0 })
  todayFoods.forEach(f => {
    f.groups.forEach(g => { groupCounts[g] = (groupCounts[g] || 0) + 1 })
  })

  const totals = { carbs: 0, protein: 0, fat: 0, fibre: 0, iron: 0, calcium: 0, vitC: 0 }
  todayFoods.forEach(f => {
    Object.keys(totals).forEach(k => { totals[k] += f.nutrients[k] || 0 })
  })

  const missingGroups = foodGroups.filter(g => groupCounts[g.name] < g.target)
  const lowNutrients = Object.entries(nutrientTargets)
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

function scaleNutrients(nutrients, grams) {
  const scale = grams / 100
  const scaled = {}
  Object.keys(nutrients).forEach(k => { scaled[k] = Math.round(nutrients[k] * scale * 10) / 10 })
  return scaled
}

export default function MealPlannerPage() {
  const { addFoodEntry, removeFoodEntry, getTodayFoodLog, addCustomFood, customFoods, settings, updateSettings, trainingLogs } = useApp()
  const [search, setSearch] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [grams, setGrams] = useState('100')
  const [customFood, setCustomFood] = useState(null)
  const [customNutrients, setCustomNutrients] = useState({ protein: '', carbs: '', fat: '', fibre: '', iron: '', calcium: '', vitC: '' })
  const [customGrams, setCustomGrams] = useState('100')
  const [customGroups, setCustomGroups] = useState([])
  const [labelPhoto, setLabelPhoto] = useState(null)
  const fileInputRef = useRef(null)
  const [ageInput, setAgeInput] = useState(String(settings.realAge || ''))
  const [weightInput, setWeightInput] = useState(String(settings.bodyWeightKg))

  const todayFoods = getTodayFoodLog()

  const trainingDaysPerWeek = useMemo(() => {
    const last7 = Array.from({ length: 7 }, (_, i) => getDaysAgo(i))
    return last7.filter(d => trainingLogs.some(l => l.date === d)).length
  }, [trainingLogs])

  const { foodGroups, nutrientTargets } = useMemo(
    () => getPersonalizedTargets(settings.realAge, settings.bodyWeightKg, trainingDaysPerWeek),
    [settings.realAge, settings.bodyWeightKg, trainingDaysPerWeek]
  )

  const { missingGroups, lowNutrients, suggestions, groupCounts, totals } = useMemo(
    () => getSuggestions(todayFoods.map(e => {
      const dbFood = FOOD_DATABASE.find(f => f.name === e.name)
      if (dbFood && e.grams) {
        return { ...dbFood, nutrients: scaleNutrients(dbFood.nutrients, e.grams) }
      }
      return { name: e.name, groups: e.groups || [], nutrients: e.nutrients || {} }
    }), foodGroups, nutrientTargets),
    [todayFoods, foodGroups, nutrientTargets]
  )

  const allFoods = useMemo(() => {
    const dbNames = new Set(FOOD_DATABASE.map(f => f.name))
    const extras = customFoods.filter(f => !dbNames.has(f.name))
    return [...FOOD_DATABASE, ...extras]
  }, [customFoods])

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return allFoods.filter(f => f.name.toLowerCase().includes(q)).slice(0, 8)
  }, [search, allFoods])

  const handleSelect = (food) => {
    setSelectedFood(food)
    setGrams('100')
    setShowResults(false)
  }

  const handleConfirmAdd = () => {
    if (!selectedFood) return
    const g = parseInt(grams, 10) || 100
    const scaled = scaleNutrients(selectedFood.nutrients, g)
    addFoodEntry({ name: selectedFood.name, groups: selectedFood.groups, nutrients: scaled, grams: g })
    setSelectedFood(null)
    setSearch('')
    setGrams('100')
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

          {showResults && search.trim() && !selectedFood && (
            <div className="absolute z-20 mt-1 w-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map(food => (
                <button
                  key={food.name}
                  onClick={() => handleSelect(food)}
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
                <button onClick={() => setSelectedFood(null)} className="text-surface-400 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={grams}
                  onChange={(e) => setGrams(e.target.value)}
                  min="1"
                  className="w-20 px-2 py-1.5 text-sm rounded-md border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50 text-center"
                  autoFocus
                />
                <span className="text-xs text-surface-500">grams</span>
                <button
                  onClick={handleConfirmAdd}
                  className="ml-auto px-3 py-1.5 text-xs font-medium rounded-md bg-primary-500 text-white"
                >Add</button>
              </div>
              <p className="text-[10px] text-surface-400 mt-1.5">Nutrients per 100g: {selectedFood.nutrients.protein}g protein, {selectedFood.nutrients.carbs}g carbs, {selectedFood.nutrients.fat}g fat</p>
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
            {todayFoods.map(entry => (
              <div key={entry.id} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-100 dark:bg-surface-700 rounded-full">
                <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{entry.name}</span>
                {entry.grams > 0 && <span className="text-[10px] text-surface-400">{entry.grams}g</span>}
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
          {Object.entries(nutrientTargets).map(([key, { target, unit, label }]) => {
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
                onClick={() => handleSelect(s)}
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
