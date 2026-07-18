import UserProfile from '../models/userProfile.js';
import { validateProfile } from '../validators/profileValidator.js';

export async function getMyProfile(request, response, next) {
  try {
    const profile = await UserProfile.findOne({ demoUsername: request.demoUsername }).lean();
    if (!profile) return response.status(404).json({ message: 'Profile not found.' });
    return response.json({ profile });
  } catch (error) { return next(error); }
}

export async function saveMyProfile(request, response, next) {
  try {
    const errors = validateProfile(request.body);
    if (errors.length) return response.status(400).json({ message: 'Please correct the highlighted profile fields.', errors });
    const profile = await UserProfile.findOneAndUpdate(
      { demoUsername: request.demoUsername },
      { ...request.body, demoUsername: request.demoUsername, allergies: request.body.allergies.map((item) => item.trim().toLowerCase()).filter(Boolean), preferredCuisine: request.body.preferredCuisine.trim() },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    return response.json({ profile });
  } catch (error) { return next(error); }
}

export async function acknowledgeDisclaimer(request, response, next) {
  try {
    const profile = await UserProfile.findOneAndUpdate({ demoUsername: request.demoUsername }, { disclaimerAcknowledgedAt: new Date() }, { new: true });
    if (!profile) return response.status(404).json({ message: 'Save your profile before acknowledging the disclaimer.' });
    return response.json({ profile });
  } catch (error) { return next(error); }
}
