const supabase = require('../config/db');

const Comment = {
  async findByPostId(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:users(id, name, avatar_url, college, course, branch, year)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async create(commentData) {
    const { data, error } = await supabase
      .from('comments')
      .insert(commentData)
      .select(`
        *,
        author:users(id, name, avatar_url, college, course, branch, year)
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async delete(commentId, userId) {
    const { data, error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async getCommentCount(postId) {
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (error) {
      throw new Error(error.message);
    }
    return count;
  },
};

module.exports = Comment;
