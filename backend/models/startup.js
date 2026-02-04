const supabase = require('../config/db');

const Startup = {
  async create(startupData) {
    const { data, error } = await supabase
      .from('startups')
      .insert(startupData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async findByUserId(userId) {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }

    return data;
  },

  async findLatestByUserId(userId) {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    return Array.isArray(data) && data.length ? data[0] : null;
  },

  async findById(startupId) {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('id', startupId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async findByStatus(status) {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async update(startupId, updateData) {
    const { data, error } = await supabase
      .from('startups')
      .update(updateData)
      .eq('id', startupId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async remove(startupId) {
    const { error } = await supabase
      .from('startups')
      .delete()
      .eq('id', startupId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
};

module.exports = Startup;
