import { Router } from 'express';
import { getGroceryList, getStoreLinks } from '../controllers/groceryController.js';
import { requireDemoUser } from '../middleware/demoUserMiddleware.js';
const router = Router();
router.get('/grocery-links', getStoreLinks);
router.use(requireDemoUser);
router.get('/meal-plans/:mealPlanId/grocery-list', getGroceryList);
export default router;
