import Post from '../models/Post.js';

const getFeed = async (filters) => {
  try {
    const feed = await Post.findAll(filters);
    return feed;
  } catch (error) {
    throw new Error(`Error fetching feed: ${error.message}`);
  }
};

const getPostById = async (postId) => {
  if (!postId) {
    throw new Error('Post ID is required');
  }

  try {
    const post = await Post.findById(postId);
    return post;
  } catch (error) {
    throw new Error(`Error fetching post: ${error.message}`);
  }
};

const createPost = async (authorId, postDetails) => {
  const { title, description, stage, required_skills, post_type = 'startup_idea' } = postDetails;

  if (!title || !description) {
    throw new Error('Title and description are required');
  }

  // Validate post type
  const validPostTypes = ['startup_idea', 'project', 'work_update'];
  if (!validPostTypes.includes(post_type)) {
    throw new Error('Invalid post type. Valid types are: startup_idea, project, work_update');
  }

  // Stage is only required for startup ideas and projects
  if ((post_type === 'startup_idea' || post_type === 'project') && !stage) {
    throw new Error('Stage is required for startup ideas and projects');
  }

  try {
    const postData = {
      author_id: authorId,
      title,
      description,
      post_type,
      required_skills,
    };

    // Only add stage for startup ideas and projects
    if (post_type === 'startup_idea' || post_type === 'project') {
      postData.stage = stage;
    }

    const newPost = await Post.create(postData);
    return newPost;
  } catch (error) {
    throw new Error(`Error creating post: ${error.message}`);
  }
};

const joinPost = async (postId, userId) => {
  if (!postId || !userId) {
    throw new Error('Post ID and User ID are required to join');
  }

  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    await Post.addCollaborator(postId, userId);
    if (post.author_id && post.author_id !== userId) {
      const { createLetsBuildNotification } = await import('./notification.service.js');
      await createLetsBuildNotification(
        post.author_id,
        userId,
        postId,
        post.title
      );
    }
    return { message: 'Successfully joined post' };
  } catch (error) {
    throw new Error(`Error joining post: ${error.message}`);
  }
};

const deletePost = async (postId, userId) => {
  if (!postId || !userId) {
    throw new Error('Post ID and User ID are required');
  }

  try {
    // First, verify the user owns the post
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.author_id !== userId) {
      throw new Error('You can only delete your own posts');
    }

    // Delete the post
    await Post.delete(postId);
    return { message: 'Post deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting post: ${error.message}`);
  }
};

export {
  getFeed,
  createPost,
  joinPost,
  getPostById,
  deletePost,
};
