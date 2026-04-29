const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');

router.post('/shorten', linkController.createShortLink);
router.get('/:shortCode', linkController.redirectToOriginal);
router.get('/stats/:shortCode', linkController.getStatistics);
router.get('/api/links', linkController.getAllLinks);

module.exports = router;
