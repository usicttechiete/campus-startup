const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Get likes for a specific post
router.get('/posts/:postId/likes', authMiddleware, likeController.getLikes);

// Get like info (count and user's like status) for a post
router.get('/posts/:postId/like-info', authMiddleware, likeController.getLikeInfo);

// Toggle like on a post (like/unlike)
router.post('/posts/:postId/like', authMiddleware, likeController.toggleLike);

module.exports = router;