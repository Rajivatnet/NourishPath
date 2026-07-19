import MealPlan from '../models/mealPlan.js';
import UserProfile from '../models/userProfile.js';
import { createFallbackPlan } from '../services/fallbackMealPlannerService.js';
import { calculateNutritionTargets } from '../services/nutritionService.js';
import { createAiPlan } from '../services/aiMealPlannerService.js';
import { logger } from '../config/logger.js';

const today = () => new Date().toISOString().slice(0, 10);
const historySummary = (plans) => plans.flatMap((plan) => plan.meals.map((meal) => ({ name: meal.name, ingredients: meal.ingredients })));
function varietyMetadata(meals, history) { const past = new Set(history.flatMap((meal) => meal.ingredients.map((item) => item.toLowerCase()))); const repeatedIngredients = [...new Set(meals.flatMap((meal) => meal.ingredients.map((item) => item.toLowerCase()).filter((item) => past.has(item))))]; return { variationScore: Math.max(0, 100 - (repeatedIngredients.length * 8)), repeatedIngredients, sourceMealHistoryDays: Math.min(6, history.length) }; }
export async function generatePlan(request, response, next) {
  try {
    const profile = await UserProfile.findOne({ demoUsername: request.demoUsername }).lean();
    if (!profile) return response.status(404).json({ message: 'Save your profile before generating a meal plan.' });
    const targets = calculateNutritionTargets(profile);
    const planDate = request.body.planDate || today();
    const recentPlans = await MealPlan.find({ demoUsername: request.demoUsername, planDate: { $lt: planDate } }).sort({ planDate: -1 }).limit(6).lean();
    const recentMealHistory = historySummary(recentPlans);
    let plan;
    try { plan = await createAiPlan(profile, targets, recentMealHistory); } catch (error) { logger.error('AI plan generation failed; using fallback', { error: error.message }); plan = createFallbackPlan(profile, targets); }
    const saved = await MealPlan.findOneAndUpdate({ demoUsername: request.demoUsername, planDate }, { ...plan, ...varietyMetadata(plan.meals, recentMealHistory), demoUsername: request.demoUsername, planDate, status: 'active' }, { new: true, upsert: true, setDefaultsOnInsert: true });
    return response.status(201).json({ plan: saved });
  } catch (error) { return next(error); }
}
export async function getTodayPlan(request, response, next) { try { const plan = await MealPlan.findOne({ demoUsername: request.demoUsername, planDate: today() }).lean(); if (!plan) return response.status(404).json({ message: 'No meal plan for today.' }); return response.json({ plan }); } catch (error) { return next(error); } }
export async function getMealHistory(request, response, next) { try { const days = Math.min(Number(request.query.days) || 6, 30); const plans = await MealPlan.find({ demoUsername: request.demoUsername }).sort({ planDate: -1 }).limit(days).lean(); return response.json({ plans }); } catch (error) { return next(error); } }
export async function generateWeeklyPlan(request, response, next) {
  try {
    const profile = await UserProfile.findOne({ demoUsername: request.demoUsername }).lean();
    if (!profile) return response.status(404).json({ message: 'Save your profile before generating a weekly plan.' });
    const startDate = request.body.startDate || today(); const weeklyPlanId = `week-${startDate}`; const plans = [];
    for (let offset = 0; offset < 7; offset += 1) {
      const date = new Date(`${startDate}T00:00:00.000Z`); date.setUTCDate(date.getUTCDate() + offset); const planDate = date.toISOString().slice(0, 10);
      const recentPlans = await MealPlan.find({ demoUsername: request.demoUsername, planDate: { $lt: planDate } }).sort({ planDate: -1 }).limit(6).lean(); const history = historySummary(recentPlans); const targets = calculateNutritionTargets(profile);
      let plan; try { plan = await createAiPlan(profile, targets, history); } catch (error) { logger.error('Weekly AI plan generation failed; using fallback', { error: error.message }); plan = createFallbackPlan(profile, targets); }
      const saved = await MealPlan.findOneAndUpdate({ demoUsername: request.demoUsername, planDate }, { ...plan, ...varietyMetadata(plan.meals, history), demoUsername: request.demoUsername, planDate, weeklyPlanId, status: 'active' }, { new: true, upsert: true, setDefaultsOnInsert: true }); plans.push(saved);
    }
    return response.status(201).json({ weeklyPlanId, plans });
  } catch (error) { return next(error); }
}
