import express from 'express';
const router = express.Router();
// Placeholder for event controller
// import eventController from '../controllers/event.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

router.get('/', authMiddleware, (req, res) => res.json([])); // Placeholder
router.post('/:id/team', authMiddleware, (req, res) => res.json({ message: 'OK' })); // Placeholder

export default router;
