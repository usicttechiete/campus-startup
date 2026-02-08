import express from 'express';
const router = express.Router();
import {
  getInternshipsController,
  getInternshipByIdController,
  applyToInternshipController,
  getMyApplicationsController,
  getJobsByStartupController,
  checkApplicationStatusController,
} from '../controllers/internship.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

router.get('/', authMiddleware, getInternshipsController);
router.get('/my/applications', authMiddleware, getMyApplicationsController);
router.get('/startup/:startupId', authMiddleware, getJobsByStartupController);
router.get('/:id', authMiddleware, getInternshipByIdController);
router.get('/:id/status', authMiddleware, checkApplicationStatusController);
router.post('/:id/apply', authMiddleware, applyToInternshipController);

export default router;
