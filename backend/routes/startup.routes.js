const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const {
  createStartup,
  getMyStartup,
  deleteMyStartup,
} = require('../controllers/startup.controller');

router.post('/', authMiddleware, createStartup);
router.get('/me', authMiddleware, getMyStartup);
router.delete('/me', authMiddleware, deleteMyStartup);

module.exports = router;
