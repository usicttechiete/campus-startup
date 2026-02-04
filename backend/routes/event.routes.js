const express = require('express');
const router = express.Router();
// Placeholder for event controller
// const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, (req, res) => res.json([])); // Placeholder
router.post('/:id/team', authMiddleware, (req, res) => res.json({ message: 'OK' })); // Placeholder

module.exports = router;
