const supabase = require('../config/db');

const Event = {
  async findAll() {
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
};

module.exports = Event;
