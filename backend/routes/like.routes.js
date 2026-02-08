import express from 'express';
const router = express.Router();
import {
  getLikes,
  toggleLike,
  getLikeInfo,
} from '../controllers/like.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

// Get likes for a specific post
router.get('/posts/:postId/likes', authMiddleware, getLikes);

// Get like info (count and user's like status) for a post
router.get('/posts/:postId/like-info', authMiddleware, getLikeInfo);

// Toggle like on a post (like/unlike)
router.post('/posts/:postId/like', authMiddleware, toggleLike);

export default router;