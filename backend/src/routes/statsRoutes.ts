import { Router } from 'express';
import { StatsController } from '../controllers/statsController';

const router = Router();


router.get('/stats/:shortCode', StatsController.getStats);
router.get('/stats/all', StatsController.getAllStats);

export default router;