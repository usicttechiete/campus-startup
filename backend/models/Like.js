const supabase = require('../config/db');

const Like = {
  async findByPostId(postId) {
    const { data, error } = await supabase
      .from('likes')
      .select(`
        *,
        user:users(id, name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async checkUserLike(postId, userId) {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }
    return !!data;
  },

  async create(postId, userId) {
    const { data, error } = await supabase
      .from('likes')
      .insert({
        post_id: postId,
        user_id: userId
      })
      .select(`
        *,
        user:users(id, name, avatar_url)
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async delete(postId, userId) {
    const { data, error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async getLikeCount(postId) {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (error) {
      throw new Error(error.message);
    }
    return count;
  },

  async getPostLikeInfo(postId, userId) {
    // Get both like count and user's like status in one query
    const [likesResult, userLikeResult] = await Promise.all([
      supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId),
      supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single()
    ]);

    if (likesResult.error) {
      throw new Error(likesResult.error.message);
    }

    const isLiked = !userLikeResult.error && !!userLikeResult.data;

    return {
      count: likesResult.count || 0,
      isLiked
    };
  },
};

module.exports = Like;
