import { Router } from 'express';
import { generatePlan, generateWeeklyPlan, getMealHistory, getTodayPlan } from '../controllers/mealPlanController.js';
import { requireDemoUser } from '../middleware/demoUserMiddleware.js';
const router = Router(); router.use(requireDemoUser); router.post('/generate', generatePlan); router.post('/weekly-plans/generate', generateWeeklyPlan); router.get('/today', getTodayPlan); router.get('/history', getMealHistory); export default router;
