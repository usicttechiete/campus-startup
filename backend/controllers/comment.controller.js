const Comment = require('../models/Comment');

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.findByPostId(postId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: `Error fetching comments: ${error.message}` });
  }
};

const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const commentData = {
      post_id: postId,
      user_id: req.user.id,
      content: content.trim(),
    };

    const newComment = await Comment.create(commentData);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: `Error creating comment: ${error.message}` });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await Comment.delete(commentId, req.user.id);
    res.status(200).json({ message: 'Comment deleted successfully', comment: deletedComment });
  } catch (error) {
    res.status(500).json({ message: `Error deleting comment: ${error.message}` });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
};
