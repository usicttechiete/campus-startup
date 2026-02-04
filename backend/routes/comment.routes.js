const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Get comments for a specific post
router.get('/posts/:postId/comments', authMiddleware, commentController.getComments);

// Create a new comment on a post
router.post('/posts/:postId/comments', authMiddleware, commentController.createComment);

// Delete a comment (only by the author)
router.delete('/comments/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;