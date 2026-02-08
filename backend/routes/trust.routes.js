import express from 'express';
const router = express.Router();
import {
  endorsePeerController,
} from '../controllers/trust.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

router.post('/endorse', authMiddleware, endorsePeerController);

export default router;
