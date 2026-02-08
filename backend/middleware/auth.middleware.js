import jwt from 'jsonwebtoken';
import supabase from '../config/db.js';

const { SUPABASE_JWT_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      if (SUPABASE_JWT_SECRET) {
        try {
          const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
          req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
            ...decoded,
          };
          return next();
        } catch (jwtError) {
          return res.status(401).json({ message: 'Invalid or expired token', error: jwtError.message });
        }
      }

      return res.status(401).json({ message: 'Invalid or expired token', error: error?.message });
    }

    req.user = data.user;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error during authentication' });
  }
};

export default authMiddleware;
