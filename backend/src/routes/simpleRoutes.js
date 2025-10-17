import express from 'express';
import simpleNotificationController from '../controllers/simpleNotificationController.js';

const router = express.Router();

// Simple notification routes (no authentication required)
router.get('/status', simpleNotificationController.getStatus);
router.post('/send', simpleNotificationController.sendNotification);
router.post('/send-multiple', simpleNotificationController.sendMultipleNotifications);
router.post('/validate-token', simpleNotificationController.validateToken);

export default router;
