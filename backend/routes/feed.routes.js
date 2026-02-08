import express from 'express';
const router = express.Router();
import {
  getFeedController,
  getPostByIdController,
  createPostController,
  joinPostController,
  deletePostController,
} from '../controllers/feed.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

router.get('/', authMiddleware, getFeedController);
router.post('/', authMiddleware, createPostController);
router.post('/:id/join', authMiddleware, joinPostController);
router.delete('/:id', authMiddleware, deletePostController);

// RESTful aliases aligning with documented API contract
router.get('/posts', authMiddleware, getFeedController);
router.get('/posts/:id', authMiddleware, getPostByIdController);
router.post('/posts', authMiddleware, createPostController);
router.post('/posts/:id/collaborate', authMiddleware, joinPostController);
router.delete('/posts/:id', authMiddleware, deletePostController);

export default router;
