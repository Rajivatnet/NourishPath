const catalog = {
  oats: ['Grains', '500 g'], 'brown rice': ['Grains', '500 g'], 'whole-wheat flour': ['Grains', '1 kg'],
  'moong dal': ['Protein', '500 g'], 'roasted chana': ['Protein', '250 g'], paneer: ['Dairy', '250 g'], tofu: ['Protein', '250 g'],
  carrot: ['Vegetables', '250 g'], peas: ['Vegetables', '250 g'], onion: ['Vegetables', '500 g'], cucumber: ['Vegetables', '300 g'], tomato: ['Vegetables', '500 g'], guava: ['Vegetables', '2 pieces'], capsicum: ['Vegetables', '250 g'], beans: ['Vegetables', '250 g'], spinach: ['Vegetables', '1 bunch'],
};
const categories = ['Vegetables', 'Grains', 'Dairy', 'Protein', 'Spices', 'Oils', 'Other'];

export function buildGroceryList(meals) {
  const uniqueIngredients = [...new Set(meals.flatMap((meal) => meal.ingredients.map((item) => item.trim().toLowerCase())))];
  const grouped = Object.fromEntries(categories.map((category) => [category, []]));
  uniqueIngredients.forEach((item) => { const [category, quantity] = catalog[item] || ['Other', 'As needed']; grouped[category].push({ item, quantity, category }); });
  return categories.filter((category) => grouped[category].length).map((category) => ({ category, items: grouped[category] }));
}

export function storeLinks(item) {
  const query = encodeURIComponent(item);
  return {
    amazon: `https://www.amazon.in/s?k=${query}`,
    bigbasket: `https://www.bigbasket.com/search/?q=${query}`,
    blinkit: `https://blinkit.com/s/?q=${query}`,
    instamart: `https://www.swiggy.com/instamart/search?query=${query}`,
  };
}
