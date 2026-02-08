import Like from '../models/Like.js';

const getLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await Like.findByPostId(postId);
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: `Error fetching likes: ${error.message}` });
  }
};

const toggleLike = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { postId } = req.params;
    const userId = req.user.id;

    // Check if user already liked this post
    const isLiked = await Like.checkUserLike(postId, userId);

    if (isLiked) {
      // Unlike the post
      await Like.delete(postId, userId);
      const likeInfo = await Like.getPostLikeInfo(postId, userId);
      res.status(200).json({
        action: 'unliked',
        isLiked: false,
        likeCount: likeInfo.count
      });
    } else {
      // Like the post
      await Like.create(postId, userId);
      const likeInfo = await Like.getPostLikeInfo(postId, userId);
      res.status(200).json({
        action: 'liked',
        isLiked: true,
        likeCount: likeInfo.count
      });
    }
  } catch (error) {
    res.status(500).json({ message: `Error toggling like: ${error.message}` });
  }
};

const getLikeInfo = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { postId } = req.params;
    const userId = req.user.id;

    const likeInfo = await Like.getPostLikeInfo(postId, userId);
    res.status(200).json(likeInfo);
  } catch (error) {
    res.status(500).json({ message: `Error fetching like info: ${error.message}` });
  }
};

export {
  getLikes,
  toggleLike,
  getLikeInfo,
};