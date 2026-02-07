const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/me', authMiddleware, notificationController.getMyNotificationsController);
router.patch('/:id/read', authMiddleware, notificationController.markAsReadController);

module.exports = router;
