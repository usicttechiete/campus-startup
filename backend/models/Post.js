import supabase from '../config/db.js';

const Post = {
  async findAll(filters = {}) {
    let query = supabase.from('posts').select(`
      *,
      author:users(id, name, avatar_url, role, college, course, branch, year),
      collaborators:post_collaborators(user:users(id, name, avatar_url)),
      comment_count:comments(count),
      like_count:likes(count)
    `);

    if (filters.stage && filters.stage !== 'all') {
      query = query.eq('stage', filters.stage);
    }

    if (filters.post_type && filters.post_type !== 'all') {
      // "Projects" tab shows both project and startup_idea
      if (filters.post_type === 'project') {
        query = query.in('post_type', ['project', 'startup_idea']);
      } else {
        query = query.eq('post_type', filters.post_type);
      }
    }

    if (filters.author_id) {
      query = query.eq('author_id', filters.author_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async findUpdatesByParentId(parentPostId) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users(id, name, avatar_url, role, college, course, branch, year),
        collaborators:post_collaborators(user:users(id, name, avatar_url)),
        comment_count:comments(count),
        like_count:likes(count)
      `)
      .eq('post_type', 'work_update')
      .eq('parent_post_id', parentPostId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async isCollaborator(postId, userId) {
    const { data, error } = await supabase
      .from('post_collaborators')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    return Boolean(data);
  },

  async createUpdate({ parentPostId, authorId, title, description }) {
    const postData = {
      parent_post_id: parentPostId,
      author_id: authorId,
      title,
      description,
      post_type: 'work_update',
    };

    const { data, error } = await supabase.from('posts').insert(postData).select().single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async findById(postId) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users(id, name, avatar_url, role, college, course, branch, year),
        collaborators:post_collaborators(user:users(id, name, avatar_url)),
        comment_count:comments(count),
        like_count:likes(count)
      `)
      .eq('id', postId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async create(postData) {
    const { data, error } = await supabase.from('posts').insert(postData).select().single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async addCollaborator(postId, userId) {
    const { data, error } = await supabase.from('post_collaborators').insert({ post_id: postId, user_id: userId });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async delete(postId) {
    const { data, error } = await supabase.from('posts').delete().eq('id', postId).select().single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async findByAuthor(authorId) {
    const { data, error } = await supabase.from('posts').select('*').eq('author_id', authorId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
};

export default Post;
