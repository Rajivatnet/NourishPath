import { Router } from 'express';
import { acknowledgeDisclaimer, getMyProfile, saveMyProfile } from '../controllers/profileController.js';
import { requireDemoUser } from '../middleware/demoUserMiddleware.js';

const router = Router();
router.use(requireDemoUser);
router.get('/me', getMyProfile);
router.put('/me', saveMyProfile);
router.post('/disclaimer-acknowledgement', acknowledgeDisclaimer);
export default router;
