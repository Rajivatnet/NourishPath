function formatMeal(meal) {
  return `${meal.mealType[0].toUpperCase()}${meal.mealType.slice(1)}: ${meal.name}`;
}

export function planShareText(plan) {
  const nutrition = plan.dailyNutritionTotals || {};
  const summary = [
    'My NourishPath meal plan',
    '',
    ...plan.meals.map(formatMeal),
    '',
    `Daily target: ${nutrition.calories ?? '-'} kcal, ${nutrition.protein ?? '-'} g protein, ${nutrition.fiber ?? '-'} g fibre.`,
    '#NourishPath #HealthyEating',
  ];
  return summary.join('\n');
}

export async function sharePlan(plan) {
  const text = planShareText(plan);
  const shareData = { title: 'My NourishPath meal plan', text };

  if (navigator.share) {
    await navigator.share(shareData);
    return 'Shared successfully.';
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return 'Plan copied. Paste it into your favourite social app.';
  }

  return 'Sharing is not supported in this browser. You can print the plan instead.';
}
