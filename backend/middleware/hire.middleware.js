import supabase from '../config/db.js';
import Startup from '../models/startup.js';

const hireMiddleware = async (req, res, next) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const { data, error } = await supabase.from('users').select('role').eq('id', user.id).single();

    if (error) {
      throw new Error('Failed to fetch user role');
    }

    if (data?.role === 'admin') {
      return next();
    }

    if (data?.role !== 'student') {
      return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
    }

    const startup = await Startup.findLatestByUserId(user.id);

    if (startup?.status === 'APPROVED') {
      return next();
    }

    return res.status(403).json({ message: 'Startup approval required for hire access' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export default hireMiddleware;
