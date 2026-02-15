import {
  getFeed,
  createPost,
  joinPost,
  getPostById,
  deletePost,
  getPostUpdates,
  createPostUpdate,
} from '../services/feed.service.js';

const getFeedController = async (req, res) => {
  try {
    const feed = await getFeed(req.query);
    res.status(200).json({ results: feed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostByIdController = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const post = await getPostById(postId);
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
    const post = await createPost(req.user.id, req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const joinPostController = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const result = await joinPost(postId, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePostController = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const result = await deletePost(postId, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPostUpdatesController = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const updates = await getPostUpdates(postId);
    return res.status(200).json({ results: updates });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const createPostUpdateController = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const update = await createPostUpdate(postId, req.user.id, req.body);
    return res.status(201).json(update);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export {
  getFeedController,
  getPostByIdController,
  createPostController,
  joinPostController,
  deletePostController,
  getPostUpdatesController,
  createPostUpdateController,
};
