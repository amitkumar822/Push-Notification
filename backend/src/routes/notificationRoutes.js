import express from 'express';
import notificationController from '../controllers/notificationController.js';

const router = express.Router();

// Token management routes
router.post('/token', notificationController.registerToken);
router.get('/tokens/:userId', notificationController.getUserTokens);
router.delete('/token/:tokenId', notificationController.deleteToken);
router.put('/token/:tokenId/preferences', notificationController.updateTokenPreferences);

// Send notification routes
router.post('/send', notificationController.sendToUser);
router.post('/send-multiple', notificationController.sendToMultipleUsers);
router.post('/send-all', notificationController.sendToAll);
router.post('/send-by-device', notificationController.sendByDeviceType);

// Statistics and maintenance routes
router.get('/stats', notificationController.getStats);
router.post('/cleanup', notificationController.cleanupTokens);

export default router;
