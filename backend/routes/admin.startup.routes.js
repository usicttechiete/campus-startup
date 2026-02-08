import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import {
  listStartups,
  approveStartup,
  rejectStartup,
} from '../controllers/admin.startup.controller.js';

router.get('/startups', authMiddleware, adminMiddleware, listStartups);
router.patch('/startups/:id/approve', authMiddleware, adminMiddleware, approveStartup);
router.patch('/startups/:id/reject', authMiddleware, adminMiddleware, rejectStartup);

export default router;
