const express = require('express');
const router = express.Router();
const hireController = require('../controllers/hire.controller');
const authMiddleware = require('../middleware/auth.middleware');
const hireMiddleware = require('../middleware/hire.middleware');

// Protect all hire routes with auth and approved startup/admin role check
router.use(authMiddleware, hireMiddleware);

router.get('/jobs', hireController.getJobsController);
router.post('/jobs', hireController.postJobController);
router.get('/jobs/:id/apps', hireController.getApplicantsController);
router.patch('/apps/:id', hireController.updateApplicationStatusController);

module.exports = router;
