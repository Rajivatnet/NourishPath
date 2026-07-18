const allowed = {
  gender: ['female', 'male', 'prefer_not_to_say'], activityLevel: ['sedentary', 'light', 'moderate', 'active'],
  goal: ['weight_loss', 'maintain'], diet: ['vegetarian', 'vegan', 'eggetarian', 'non_veg'],
  medicalCondition: ['diabetes'], budgetLevel: ['low', 'medium', 'flexible'], cookingTime: ['under_15', '15_to_30', 'over_30'],
};

const inRange = (value, min, max) => Number.isFinite(value) && value >= min && value <= max;

export function validateProfile(body) {
  const errors = [];
  if (!inRange(body.age, 18, 100)) errors.push('Age must be between 18 and 100.');
  if (!inRange(body.heightCm, 100, 250)) errors.push('Height must be between 100 and 250 cm.');
  if (!inRange(body.weightKg, 30, 300)) errors.push('Weight must be between 30 and 300 kg.');
  Object.entries(allowed).forEach(([field, values]) => { if (!values.includes(body[field])) errors.push(`Invalid ${field}.`); });
  if (!Array.isArray(body.allergies) || body.allergies.length > 10 || body.allergies.some((item) => typeof item !== 'string' || item.trim().length > 40)) errors.push('Allergies must be a list of up to 10 items.');
  if (typeof body.preferredCuisine !== 'string' || !body.preferredCuisine.trim() || body.preferredCuisine.trim().length > 50) errors.push('Preferred cuisine is required.');
  return errors;
}
