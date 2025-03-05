import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if header is present and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized, no token' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to request
    req.user = { id: decoded.userId, role: decoded.role };

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized, invalid token' });
  }
};
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // ✅ Allow access if user is admin
  } else {
    res.status(403).json({ message: 'Access denied, admins only' });
  }
};
