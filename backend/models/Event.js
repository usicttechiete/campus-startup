import supabase from '../config/db.js';

const Event = {
  async findAll() {
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
};

export default Event;
