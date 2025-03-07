import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginBase from './LoginPage';

const AdminLoginPage = () => {
  const { handleAdminLogin, currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Check if already logged in
  useEffect(() => {
    if (currentUser && isAdmin()) {
      console.log("👤 Already logged in as admin, redirecting to dashboard");
      navigate('/admin/dashboard');
    }
  }, [currentUser, navigate, isAdmin]);
  
  const handleLogin = async (email, password) => {
    try {
      console.log("🔑 Admin login attempt with:", email);
      const user = await handleAdminLogin(email, password);
      
      console.log("✅ Login successful, user:", user);
      
      // Force a navigation after a short delay to ensure state updates
      setTimeout(() => {
        console.log("🚀 Explicitly navigating to admin dashboard");
        navigate('/admin/dashboard', { replace: true });
      }, 100);
      
      return user;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  };
  
  return (
    <LoginBase 
      loginType="admin"
      title="Admin Login"
      description="Enter your credentials to access the admin dashboard"
      inputLabel="Email Address"
      inputType="email"
      placeholder="admin@example.com"
      redirectPath="/admin/dashboard" // Note: we handle navigation manually above
      handleLogin={handleLogin}
    />
  );
};

export default AdminLoginPage;