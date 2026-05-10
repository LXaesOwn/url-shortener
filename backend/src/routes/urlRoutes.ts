import { Router } from 'express';
import { UrlController } from '../controllers/urlController';
import { getUserInfo } from '../middleware/userInfo';

const router = Router();

router.post('/shorten', UrlController.shortenUrl);
router.get('/s/:shortCode', getUserInfo, UrlController.redirectToOriginal);

export default router;