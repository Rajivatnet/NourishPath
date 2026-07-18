import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  demoUsername: { type: String, required: true, unique: true, enum: ['Guest1', 'Guest2', 'Guest3'] },
  age: { type: Number, required: true, min: 18, max: 100 },
  gender: { type: String, required: true, enum: ['female', 'male', 'prefer_not_to_say'] },
  heightCm: { type: Number, required: true, min: 100, max: 250 },
  weightKg: { type: Number, required: true, min: 30, max: 300 },
  activityLevel: { type: String, required: true, enum: ['sedentary', 'light', 'moderate', 'active'] },
  goal: { type: String, required: true, enum: ['weight_loss', 'maintain'] },
  diet: { type: String, required: true, enum: ['vegetarian', 'vegan', 'eggetarian', 'non_veg'] },
  allergies: { type: [String], default: [] },
  medicalCondition: { type: String, required: true, enum: ['diabetes'] },
  budgetLevel: { type: String, required: true, enum: ['low', 'medium', 'flexible'] },
  cookingTime: { type: String, required: true, enum: ['under_15', '15_to_30', 'over_30'] },
  preferredCuisine: { type: String, required: true, trim: true, maxlength: 50 },
  disclaimerAcknowledgedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });

export default mongoose.model('UserProfile', profileSchema);
