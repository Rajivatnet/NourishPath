import { sumNutrition } from './nutritionService.js';

const disclaimer = 'NourishPath provides general nutrition guidance only. It does not diagnose, treat, cure, or prevent disease. Consult a physician or registered dietitian before making dietary changes.';
const vegetarianMeals = [
  { mealType: 'breakfast', name: 'Vegetable oats upma', description: 'Steel-cut oats with mixed vegetables and roasted peanuts.', ingredients: ['oats', 'carrot', 'peas', 'onion'], nutrition: { calories: 330, protein: 12, carbs: 50, fat: 10, fiber: 9, sodium: 280 }, estimatedPrepTimeMinutes: 20, dietaryTags: ['vegetarian', 'high_fiber'] },
  { mealType: 'lunch', name: 'Moong dal, brown rice and salad', description: 'A balanced bowl with dal, brown rice, cucumber, tomato, and lemon.', ingredients: ['moong dal', 'brown rice', 'cucumber', 'tomato'], nutrition: { calories: 510, protein: 23, carbs: 76, fat: 12, fiber: 13, sodium: 410 }, estimatedPrepTimeMinutes: 30, dietaryTags: ['vegetarian', 'diabetes_conscious'] },
  { mealType: 'snack', name: 'Roasted chana with guava', description: 'Protein and fibre-rich roasted chana served with fresh guava.', ingredients: ['roasted chana', 'guava'], nutrition: { calories: 210, protein: 9, carbs: 35, fat: 4, fiber: 9, sodium: 20 }, estimatedPrepTimeMinutes: 5, dietaryTags: ['vegetarian', 'high_fiber'] },
  { mealType: 'dinner', name: 'Paneer vegetable stir-fry with roti', description: 'Paneer, capsicum, beans, and spinach with two whole-wheat rotis.', ingredients: ['paneer', 'capsicum', 'beans', 'spinach', 'whole-wheat flour'], nutrition: { calories: 530, protein: 30, carbs: 53, fat: 22, fiber: 11, sodium: 460 }, estimatedPrepTimeMinutes: 25, dietaryTags: ['vegetarian', 'protein_rich'] },
];
const veganMeals = vegetarianMeals.map((meal) => meal.name.includes('Paneer') ? { ...meal, name: 'Tofu vegetable stir-fry with roti', ingredients: ['tofu', 'capsicum', 'beans', 'spinach', 'whole-wheat flour'], nutrition: { ...meal.nutrition, protein: 25, fat: 16 }, dietaryTags: ['vegan', 'protein_rich'] } : { ...meal, dietaryTags: ['vegan', 'high_fiber'] });

export function createFallbackPlan(profile, targetNutrition) {
  const base = profile.diet === 'vegan' ? veganMeals : vegetarianMeals;
  const allergies = new Set(profile.allergies.map((allergy) => allergy.toLowerCase()));
  const meals = base.filter((meal) => !meal.ingredients.some((ingredient) => allergies.has(ingredient.toLowerCase())));
  if (meals.length !== 4) throw new Error('The fallback plan could not safely accommodate this allergy list.');
  return { targetNutrition, meals, dailyNutritionTotals: sumNutrition(meals), disclaimer, generatedBy: 'fallback' };
}
