import express from 'express';
const router = express.Router();
import {
  getEventsController,
  getEventByIdController,
  createEventController,
  updateEventController,
  deleteEventController,
} from '../controllers/event.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';

// Public routes (authenticated users)
router.get('/', authMiddleware, getEventsController);
router.get('/:id', authMiddleware, getEventByIdController);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, createEventController);
router.patch('/:id', authMiddleware, adminMiddleware, updateEventController);
router.delete('/:id', authMiddleware, adminMiddleware, deleteEventController);

export default router;
