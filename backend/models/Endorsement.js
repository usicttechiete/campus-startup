import supabase from '../config/db.js';

const Endorsement = {
  async create(endorsementData) {
    const { data, error } = await supabase.from('endorsements').insert(endorsementData).select().single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async findByUserId(userId) {
    const { data, error } = await supabase
      .from('endorsements')
      .select('*, from_user:users(id, name)')
      .eq('to_user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
};

export default Endorsement;
