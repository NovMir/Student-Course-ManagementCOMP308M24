// authentication and authrorisation
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import Role from '../model/Role.js';


const protect = async (req, res, next) => {
  try{
    let token;
    console.log('⭐ Auth headers:', req.headers.authorization);
    if(req.cookies.token){
      token = req.cookies.token;
    }
    else if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
      return res.status(401).json({message: 'Not authorized to access this route'});
    }
//verify
console.log('🔑 Verifying token')
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('✅ Token payload:', decoded);

  const user = await User.findById(decoded.id).populate('roles');
  if(!user){
    return res.status(404).json({message: 'User not found'});
  }
  console.log('👤 User found:', user._id, 'with roles:', user.roles.map(r => r.name));
    
 
  req.user = user;
  req.decoded = decoded;
  next();
} catch (error) {
  return res.status(401).json({ message: 'Not authorized to access this route' });
}
};

const authorize = (...roles) => {
  return async (req, res, next) => {
   try{
 
   const userRoles = req.user.roles.map(role => role.name);
   const hasPermission = roles.some(role => userRoles.includes(role));
      
   if (!hasPermission) {
     console.log('❌ User does not have required roles');
     return res.status(403).json({ message: 'Not authorized to access this route' });
   }
   
   console.log('✅ User authorized');
   next();
 } catch (error) {
   console.log('❌ Authorization error:', error.message);
   return res.status(500).json({ message: 'Server error' });
 }
};
};
export { protect, authorize };
