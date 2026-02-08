import express from 'express';
const router = express.Router();

import authMiddleware from '../middleware/auth.middleware.js';
import {
  createStartup,
  getMyStartup,
  getStartupById,
  deleteMyStartup,
} from '../controllers/startup.controller.js';

router.post('/', authMiddleware, createStartup);
router.get('/me', authMiddleware, getMyStartup);
router.get('/:id', authMiddleware, getStartupById);
router.delete('/me', authMiddleware, deleteMyStartup);

export default router;
