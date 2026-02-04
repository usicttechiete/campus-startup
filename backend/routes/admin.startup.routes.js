const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const {
  listStartups,
  approveStartup,
  rejectStartup,
} = require('../controllers/admin.startup.controller');

router.get('/startups', authMiddleware, adminMiddleware, listStartups);
router.patch('/startups/:id/approve', authMiddleware, adminMiddleware, approveStartup);
router.patch('/startups/:id/reject', authMiddleware, adminMiddleware, rejectStartup);

module.exports = router;
