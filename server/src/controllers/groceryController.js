import MealPlan from '../models/mealPlan.js';
import { buildGroceryList, storeLinks } from '../services/groceryService.js';

export async function getGroceryList(request, response, next) {
  try {
    const plan = await MealPlan.findOne({ _id: request.params.mealPlanId, demoUsername: request.demoUsername }).lean();
    if (!plan) return response.status(404).json({ message: 'Meal plan not found.' });
    return response.json({ mealPlanId: plan._id, groceryList: buildGroceryList(plan.meals) });
  } catch (error) { return next(error); }
}
export function getStoreLinks(request, response) {
  const item = String(request.query.item || '').trim();
  if (!item || item.length > 80) return response.status(400).json({ message: 'A valid grocery item is required.' });
  return response.json({ item, links: storeLinks(item) });
}
