import supabase from '../config/db.js';

const Event = {
  async findAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async create(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async update(id, eventData) {
    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(eventData).filter(([_, v]) => v !== undefined)
    );

    const { data, error} = await supabase
      .from('events')
      .update(cleanData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(error.message);
    }
    return true;
  },
};

export default Event;
