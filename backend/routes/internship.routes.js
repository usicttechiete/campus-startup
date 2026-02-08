import express from 'express';
const router = express.Router();
import {
  getInternshipsController,
  getInternshipByIdController,
  applyToInternshipController,
  getMyApplicationsController,
} from '../controllers/internship.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

router.get('/', authMiddleware, getInternshipsController);
router.get('/my/applications', authMiddleware, getMyApplicationsController);
router.get('/:id', authMiddleware, getInternshipByIdController);
router.post('/:id/apply', authMiddleware, applyToInternshipController);

export default router;
