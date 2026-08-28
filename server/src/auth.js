import jwt from 'jsonwebtoken';

const secret = () => process.env.JWT_SECRET || 'labseek-local-development-secret';

export const signToken = (user) => jwt.sign(
  { sub: user.id, role: user.role, name: user.name },
  secret(),
  { expiresIn: '8h' }
);

export const requireAuth = (req, res, next) => {
  const value = req.headers.authorization;
  if (!value?.startsWith('Bearer ')) return res.status(401).json({ message: 'Please sign in to continue.' });
  try {
    req.auth = jwt.verify(value.slice(7), secret());
    next();
  } catch {
    res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  }
};

export const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.auth?.role)) return res.status(403).json({ message: 'You do not have permission to perform this action.' });
  next();
};

