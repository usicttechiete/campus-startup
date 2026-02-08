import express from 'express';
const router = express.Router();
import {
  postJobController,
  getJobsController,
  getApplicantsController,
  updateApplicationStatusController,
} from '../controllers/hire.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import hireMiddleware from '../middleware/hire.middleware.js';

// Protect all hire routes with auth and approved startup/admin role check
router.use(authMiddleware, hireMiddleware);

router.get('/jobs', getJobsController);
router.post('/jobs', postJobController);
router.get('/jobs/:id/apps', getApplicantsController);
router.patch('/apps/:id', updateApplicationStatusController);

export default router;
