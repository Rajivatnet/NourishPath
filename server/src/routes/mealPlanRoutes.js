import { Router } from 'express';
import { generatePlan, getTodayPlan } from '../controllers/mealPlanController.js';
import { requireDemoUser } from '../middleware/demoUserMiddleware.js';
const router = Router(); router.use(requireDemoUser); router.post('/generate', generatePlan); router.get('/today', getTodayPlan); export default router;
