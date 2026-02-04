const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internship.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, internshipController.getInternshipsController);
router.get('/:id', authMiddleware, internshipController.getInternshipByIdController);
router.post('/:id/apply', authMiddleware, internshipController.applyToInternshipController);

module.exports = router;
