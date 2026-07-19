import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({ calories: Number, protein: Number, carbs: Number, fat: Number, fiber: Number, sodium: Number }, { _id: false });
const mealSchema = new mongoose.Schema({ mealType: String, name: String, description: String, ingredients: [String], nutrition: nutritionSchema, estimatedPrepTimeMinutes: Number, dietaryTags: [String] }, { _id: false });

const mealPlanSchema = new mongoose.Schema({
  demoUsername: { type: String, required: true, index: true }, planDate: { type: String, required: true }, status: { type: String, default: 'active' },
  targetNutrition: nutritionSchema, meals: [mealSchema], dailyNutritionTotals: nutritionSchema, disclaimer: { type: String, required: true }, generatedBy: { type: String, enum: ['fallback', 'ai'], default: 'fallback' }, weeklyPlanId: { type: String, default: null }, variationScore: { type: Number, default: 100 }, repeatedIngredients: { type: [String], default: [] }, sourceMealHistoryDays: { type: Number, default: 0 },
}, { timestamps: true, versionKey: false });
mealPlanSchema.index({ demoUsername: 1, planDate: 1 }, { unique: true });
export default mongoose.model('MealPlan', mealPlanSchema);
