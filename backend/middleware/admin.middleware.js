import supabase from '../config/db.js';

const adminMiddleware = async (req, res, next) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const { data, error } = await supabase.from('users').select('role').eq('id', user.id).single();

    if (error) {
      throw new Error('Failed to fetch user role');
    }

    if (data && data.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export default adminMiddleware;
