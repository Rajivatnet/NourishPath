export function calculateNutritionTargets(profile) {
  const baseCalories = profile.gender === 'male' ? 2200 : 1900;
  const activityAdjustment = { sedentary: -150, light: 0, moderate: 200, active: 350 }[profile.activityLevel] ?? 0;
  const goalAdjustment = profile.goal === 'weight_loss' ? -350 : 0;
  const calories = Math.max(1200, baseCalories + activityAdjustment + goalAdjustment);
  return { calories, protein: Math.round(profile.weightKg * 1.1), carbs: Math.round(calories * 0.42 / 4), fat: Math.round(calories * 0.3 / 9), fiber: 30, sodium: 2000 };
}

export function sumNutrition(meals) { return meals.reduce((total, meal) => Object.fromEntries(Object.keys(total).map((key) => [key, total[key] + (meal.nutrition[key] || 0)])), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 }); }
