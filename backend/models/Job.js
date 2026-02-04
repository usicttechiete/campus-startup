const supabase = require('../config/db');

const Job = {
  async findAll(filters = {}) {
    let query = supabase.from('jobs').select('*');

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async create(jobData) {
    const { data, error } = await supabase.from('jobs').insert(jobData).select().single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
};

module.exports = Job;
