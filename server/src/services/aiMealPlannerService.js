import OpenAI from 'openai';
import { env } from '../config/env.js';
import { sumNutrition } from './nutritionService.js';

const disclaimer = 'NourishPath provides general nutrition guidance only. It does not diagnose, treat, cure, or prevent disease. Consult a physician or registered dietitian before making dietary changes.';
const mealTypes = ['breakfast', 'lunch', 'snack', 'dinner'];

function validatePlan(value, targetNutrition) {
  if (!value || !Array.isArray(value.meals) || value.meals.length !== 4) throw new Error('AI response did not include four meals.');
  const meals = value.meals.map((meal) => ({
    mealType: String(meal.mealType || '').toLowerCase(), name: String(meal.name || '').trim(), description: String(meal.description || '').trim(),
    ingredients: Array.isArray(meal.ingredients) ? meal.ingredients.map(String).slice(0, 12) : [], estimatedPrepTimeMinutes: Number(meal.estimatedPrepTimeMinutes) || 20,
    dietaryTags: Array.isArray(meal.dietaryTags) ? meal.dietaryTags.map(String).slice(0, 5) : [],
    nutrition: Object.fromEntries(['calories', 'protein', 'carbs', 'fat', 'fiber', 'sodium'].map((key) => [key, Number(meal.nutrition?.[key]) || 0])),
  }));
  if (new Set(meals.map((meal) => meal.mealType)).size !== 4 || !mealTypes.every((type) => meals.some((meal) => meal.mealType === type))) throw new Error('AI response meal types were invalid.');
  if (meals.some((meal) => !meal.name || !meal.description || meal.ingredients.length === 0)) throw new Error('AI response was incomplete.');
  return { targetNutrition, meals, dailyNutritionTotals: sumNutrition(meals), disclaimer, generatedBy: 'ai' };
}

export async function createAiPlan(profile, targetNutrition) {
  if (env.aiProvider !== 'openai' || !env.openAiApiKey) throw new Error('AI provider is not configured.');
  const client = new OpenAI({ apiKey: env.openAiApiKey, timeout: 60000 });
  const completion = await client.chat.completions.create({
    model: env.aiModel,
    max_completion_tokens: 5000,
    reasoning_effort: 'minimal',
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'daily_meal_plan', strict: true,
        schema: {
          type: 'object', additionalProperties: false, required: ['meals'],
          properties: {
            meals: {
              type: 'array', minItems: 4, maxItems: 4,
              items: {
                type: 'object', additionalProperties: false,
                required: ['mealType', 'name', 'description', 'ingredients', 'estimatedPrepTimeMinutes', 'dietaryTags', 'nutrition'],
                properties: {
                  mealType: { type: 'string', enum: ['breakfast', 'lunch', 'snack', 'dinner'] }, name: { type: 'string' }, description: { type: 'string' },
                  ingredients: { type: 'array', items: { type: 'string' } }, estimatedPrepTimeMinutes: { type: 'number' }, dietaryTags: { type: 'array', items: { type: 'string' } },
                  nutrition: { type: 'object', additionalProperties: false, required: ['calories', 'protein', 'carbs', 'fat', 'fiber', 'sodium'], properties: { calories: { type: 'number' }, protein: { type: 'number' }, carbs: { type: 'number' }, fat: { type: 'number' }, fiber: { type: 'number' }, sodium: { type: 'number' } } },
                },
              },
            },
          },
        },
      },
    },
    messages: [
      { role: 'system', content: 'You are a nutrition-planning assistant, not a doctor. Return JSON only. Create practical Indian meals. Never claim to diagnose, treat, cure, or prevent disease. Respect every allergy and diet restriction. Return an object with a meals array containing exactly breakfast, lunch, snack, and dinner. Each meal needs mealType, name, description, ingredients string array, estimatedPrepTimeMinutes, dietaryTags string array, and nutrition object with calories, protein, carbs, fat, fiber, sodium numeric fields.' },
      { role: 'user', content: JSON.stringify({ profile: { age: profile.age, diet: profile.diet, allergies: profile.allergies, activityLevel: profile.activityLevel, goal: profile.goal, budgetLevel: profile.budgetLevel, cookingTime: profile.cookingTime, preferredCuisine: profile.preferredCuisine, healthFocus: 'diabetes-conscious eating and weight management' }, targetNutrition }) },
    ],
  });
  const choice = completion.choices[0];
  if (choice?.message?.refusal) throw new Error(`AI refusal: ${choice.message.refusal}`);
  if (!choice?.message?.content) throw new Error(`AI returned no content (finish reason: ${choice?.finish_reason || 'unknown'}).`);
  return validatePlan(JSON.parse(choice.message.content), targetNutrition);
}
