const express = require('express');
const router = express.Router();
const trustController = require('../controllers/trust.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/endorse', authMiddleware, trustController.endorsePeerController);

module.exports = router;
