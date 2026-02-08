import express from 'express';
const router = express.Router();
import {
  getMyProfile,
  getProfileById,
  updateProfile,
  requestAdminUpgrade,
  requestStudentUpgrade,
} from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

router.get('/me', authMiddleware, getMyProfile);
router.get('/profile/:id', authMiddleware, getProfileById);
router.put('/profile', authMiddleware, updateProfile);
router.post('/request-admin', authMiddleware, requestAdminUpgrade);
router.post('/request-student', authMiddleware, requestStudentUpgrade);

export default router;
