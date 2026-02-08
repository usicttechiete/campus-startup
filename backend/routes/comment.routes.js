import express from 'express';
const router = express.Router();
import {
  getComments,
  createComment,
  deleteComment,
} from '../controllers/comment.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

// Get comments for a specific post
router.get('/posts/:postId/comments', authMiddleware, getComments);

// Create a new comment on a post
router.post('/posts/:postId/comments', authMiddleware, createComment);

// Delete a comment (only by the author)
router.delete('/comments/:commentId', authMiddleware, deleteComment);

export default router;