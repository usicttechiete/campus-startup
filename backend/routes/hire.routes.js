import express from 'express';
const router = express.Router();
import {
  postJobController,
  getApplicantsController,
  updateApplicationStatusController,
} from '../controllers/hire.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import hireMiddleware from '../middleware/hire.middleware.js';

// Protect all hire routes with auth and approved startup/admin role check
router.use(authMiddleware, hireMiddleware);

<<<<<<< HEAD
router.post('/jobs', postJobController);
router.get('/jobs/:id/apps', getApplicantsController);
router.patch('/apps/:id', updateApplicationStatusController);
=======
router.get('/jobs', hireController.getJobsController);
router.post('/jobs', hireController.postJobController);
router.get('/jobs/:id/apps', hireController.getApplicantsController);
router.patch('/apps/:id', hireController.updateApplicationStatusController);
>>>>>>> efe6f36cd0fa4b1da6607637de33dabfa430ace2

export default router;
