const supabase = require('../config/db');

const User = {
  async findByEmail(email) {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is not an error in this context
      throw new Error(error.message);
    }
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is not an error here.
      throw new Error(error.message);
    }
    return data;
  },

  async create(userData) {
    const { data, error } = await supabase.from('users').insert(userData).select().single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async updateProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('users')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async getRole(userId) {
    const { data, error } = await supabase.from('users').select('role').eq('id', userId).single();
    if (error) {
      throw new Error('Failed to fetch user role');
    }
    return data;
  },
};

module.exports = User;
