import MealPlan from '../models/mealPlan.js';
import UserProfile from '../models/userProfile.js';
import { createFallbackPlan } from '../services/fallbackMealPlannerService.js';
import { calculateNutritionTargets } from '../services/nutritionService.js';
import { createAiPlan } from '../services/aiMealPlannerService.js';
import { logger } from '../config/logger.js';

const today = () => new Date().toISOString().slice(0, 10);
export async function generatePlan(request, response, next) {
  try {
    const profile = await UserProfile.findOne({ demoUsername: request.demoUsername }).lean();
    if (!profile) return response.status(404).json({ message: 'Save your profile before generating a meal plan.' });
    const targets = calculateNutritionTargets(profile);
    let plan;
    try { plan = await createAiPlan(profile, targets); } catch (error) { logger.error('AI plan generation failed; using fallback', { error: error.message }); plan = createFallbackPlan(profile, targets); }
    const saved = await MealPlan.findOneAndUpdate({ demoUsername: request.demoUsername, planDate: today() }, { ...plan, demoUsername: request.demoUsername, planDate: today(), status: 'active' }, { new: true, upsert: true, setDefaultsOnInsert: true });
    return response.status(201).json({ plan: saved });
  } catch (error) { return next(error); }
}
export async function getTodayPlan(request, response, next) { try { const plan = await MealPlan.findOne({ demoUsername: request.demoUsername, planDate: today() }).lean(); if (!plan) return response.status(404).json({ message: 'No meal plan for today.' }); return response.json({ plan }); } catch (error) { return next(error); } }
