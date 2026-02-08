import supabase from '../config/db.js';

const Notification = {
  async create({ recipient_id, actor_id, type = 'lets_build', post_id, message }) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({ recipient_id, actor_id, type, post_id, message })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async findByRecipient(recipientId, { limit = 50, unreadOnly = false } = {}) {
    let query = supabase
      .from('notifications')
      .select('id, actor_id, type, post_id, message, read_at, created_at')
      .eq('recipient_id', recipientId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (unreadOnly) query = query.is('read_at', null);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  },

  async markAsRead(notificationId, recipientId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('recipient_id', recipientId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
};

export default Notification;
