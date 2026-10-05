import { Router } from 'express';
import urlRoutes from './urlRoutes';
import statsRoutes from './statsRoutes';

const router = Router();

router.use(statsRoutes);
router.use(urlRoutes);

export default router;
