const feedService = require('../services/feed.service');

const getFeedController = async (req, res) => {
  try {
    const feed = await feedService.getFeed(req.query);
    res.status(200).json({ results: feed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostByIdController = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const post = await feedService.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createPostController = async (req, res) => {
  try {
    const newPost = await feedService.createPost(req.user.id, req.body);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const joinPostController = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { userId } = req.body; // Or from req.user.id depending on requirements
    const result = await feedService.joinPost(postId, userId || req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePostController = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const result = await feedService.deletePost(postId, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getFeedController,
  getPostByIdController,
  createPostController,
  joinPostController,
  deletePostController,
};
