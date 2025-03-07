import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';

// This is a base component that both AdminLoginPage and StudentLoginPage will use
const LoginBase = ({ 
  loginType, 
  title, 
  description, 
  inputLabel, 
  inputType, 
  placeholder,
  redirectPath,
  handleLogin 
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loading, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Debug current state
  console.log("🔐 LoginBase state:", { 
    loginType, 
    currentUser: currentUser ? `${currentUser.firstName} (${currentUser.email || 'no email'})` : 'none',
    roles: currentUser?.roles,
    redirectPath
  });
  
  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (currentUser && currentUser.roles) {
      console.log("👤 User already logged in, checking roles:", currentUser.roles);
      
      // Check for admin role - handle both formats of roles
      const hasAdminRole = Array.isArray(currentUser.roles) && (
        currentUser.roles.includes('admin') || 
        currentUser.roles.some(role => 
          (typeof role === 'object' && role.name === 'admin') || 
          role === 'admin'
        )
      );
      
      // Check for student role - handle both formats of roles
      const hasStudentRole = Array.isArray(currentUser.roles) && (
        currentUser.roles.includes('student') || 
        currentUser.roles.some(role => 
          (typeof role === 'object' && role.name === 'student') || 
          role === 'student'
        )
      );
      
      console.log(`🔍 Role check: admin=${hasAdminRole}, student=${hasStudentRole}`);
      
      if (loginType === 'admin' && hasAdminRole) {
        console.log("🚀 Redirecting admin to dashboard");
        navigate('/admin/dashboard');
      } else if (loginType === 'student' && hasStudentRole) {
        console.log("🚀 Redirecting student to dashboard");
        navigate('/student/dashboard');
      }
    }
  }, [currentUser, navigate, loginType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!identifier || !password) {
      setError(`${inputLabel} and password are required`);
      return;
    }
    
    try {
      console.log(`🔑 Attempting ${loginType} login with: ${identifier}`);
      
      // Call the provided login handler
      const result = await handleLogin(identifier, password);
      
      console.log(`✅ ${loginType} login successful:`, result);
      
      // Add a slight delay before navigation to ensure state is updated
      setTimeout(() => {
        console.log(`🚀 Navigating to: ${redirectPath}`);
        navigate(redirectPath);
      }, 100);
      
    } catch (err) {
      console.error(`❌ ${loginType} login error:`, err);
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="mt-2 text-gray-600">{description}</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="identifier" className="block text-gray-700 text-sm font-medium mb-2">
                {inputLabel}
              </label>
              <input
                id="identifier"
                type={inputType}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={placeholder}
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
              {/* For demo purposes */}
              <p className="mt-1 text-xs text-gray-500">
                (Demo: For any user, password is 'password123')
              </p>
            </div>

            <div className="mb-6">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
                Back to Home
              </Link>
              
              {loginType === 'admin' ? (
                <Link to="/student/login" className="text-blue-600 hover:text-blue-800 text-sm">
                  Go to Student Login
                </Link>
              ) : (
                <Link to="/admin/login" className="text-blue-600 hover:text-blue-800 text-sm">
                  Go to Admin Login
                </Link>
              )}
            </div>
          </form>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginBase;