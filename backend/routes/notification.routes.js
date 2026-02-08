import express from 'express';
const router = express.Router();
import {
  getMyNotificationsController,
  markAsReadController,
} from '../controllers/notification.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

router.get('/me', authMiddleware, getMyNotificationsController);
router.patch('/:id/read', authMiddleware, markAsReadController);

export default router;
