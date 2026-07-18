import mongoose from 'mongoose';
const schema = new mongoose.Schema({ demoUsername: { type: String, required: true }, mealPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'MealPlan', required: true }, date: { type: String, required: true }, mealType: { type: String, enum: ['breakfast', 'lunch', 'snack', 'dinner'], required: true }, status: { type: String, enum: ['planned', 'completed', 'skipped'], default: 'planned' } }, { timestamps: true, versionKey: false });
schema.index({ demoUsername: 1, date: 1, mealType: 1 }, { unique: true });
export default mongoose.model('MealLog', schema);
