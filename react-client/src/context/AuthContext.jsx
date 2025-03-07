import { createContext, useState, useEffect, useContext } from 'react';
import  authService  from '../services/authService.js';
import PropTypes from 'prop-types';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log("🔄 Checking for stored authentication");
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("✅ Found stored user:", parsedUser);
          setCurrentUser(parsedUser);
        } else {
          console.log("⚠️ No stored authentication found");
        }
      } catch (err) {
        console.error("❌ Error checking auth:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Generic login function (can be used internally if needed)
  const handleLogin = async (identifier, password, userType) => {
    try {
      setLoading(true);
      console.log(`🔑 Generic login attempt (${userType}):`, identifier);
      
      const response = await authService.login({ identifier, password }, userType);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.error(`❌ ${userType} login error:`, error);
      throw new Error(error.response?.data?.message || `${userType} login failed`);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Admin Login
  const handleAdminLogin = async (email, password) => {
    try {
      setLoading(true);
      console.log("🔑 Attempting admin login:", email);
      
      // Show the actual request being sent
      console.log("📤 Login request payload:", { 
        identifier: email, 
        password: password ? "********" : "empty" 
      });
      
      let response;
      try {
        response = await authService.adminLogin({ identifier: email, password });
        console.log("📡 Login API response status:", response.status);
      } catch (apiError) {
        // Detailed API error logging
        console.error("🔴 API Error Details:", {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          message: apiError.response?.data?.message || apiError.message,
          data: apiError.response?.data
        });
        
        // Throw a more specific error based on the status code
        if (apiError.response?.status === 401) {
          throw new Error("Invalid credentials. Please check your email and password.");
        } else if (apiError.response?.status === 403) {
          throw new Error("Your account doesn't have admin privileges.");
        } else if (apiError.response?.status >= 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error(apiError.response?.data?.message || "Login failed. Please try again.");
        }
      }
      
      // If we got here, the API call succeeded
      const { token, user } = response.data;
      
      // Verify the response contains what we expect
      if (!token || !user) {
        console.error("🔴 Invalid API response format:", response.data);
        throw new Error("Invalid server response. Please try again.");
      }
      
      // Check if user has admin role
      const hasAdminRole = Array.isArray(user.roles) && (
        user.roles.includes('admin') || 
        user.roles.some(r => r === 'admin' || r.name === 'admin')
      );
      
      if (!hasAdminRole) {
        console.error("🔴 User lacks admin role:", user.roles);
        throw new Error("Your account doesn't have admin privileges.");
      }
      
      // Clear previous auth data before setting new data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Save new auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log("📦 Auth data saved to localStorage");
      
      // Update state
      setCurrentUser(user);
      console.log("👤 Current user set to:", user.email);
      
      return user;
    } catch (error) {
      console.error("❌ Admin login error:", error);
      throw error; // Re-throw the error for the component to handle
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Student Login - ADDED
  const handleStudentLogin = async (studentNumber, password) => {
    try {
      setLoading(true);
      console.log("🔑 Attempting student login:", studentNumber);
      
      // Show the actual request being sent
      console.log("📤 Login request payload:", { 
        identifier: studentNumber, 
        password: password ? "********" : "empty" 
      });
      
      let response;
      try {
        response = await authService.studentLogin({ identifier: studentNumber, password });
        console.log("📡 Login API response status:", response.status);
      } catch (apiError) {
        // Detailed API error logging
        console.error("🔴 API Error Details:", {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          message: apiError.response?.data?.message || apiError.message,
          data: apiError.response?.data
        });
        
        // Throw a more specific error based on the status code
        if (apiError.response?.status === 401) {
          throw new Error("Invalid credentials. Please check your student number and password.");
        } else if (apiError.response?.status === 403) {
          throw new Error("Your account doesn't have student privileges.");
        } else if (apiError.response?.status >= 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error(apiError.response?.data?.message || "Login failed. Please try again.");
        }
      }
      
      // If we got here, the API call succeeded
      const { token, user } = response.data;
      
      // Verify the response contains what we expect
      if (!token || !user) {
        console.error("🔴 Invalid API response format:", response.data);
        throw new Error("Invalid server response. Please try again.");
      }
      
      // Check if user has student role
      const hasStudentRole = Array.isArray(user.roles) && (
        user.roles.includes('student') || 
        user.roles.some(r => r === 'student' || r.name === 'student')
      );
      
      if (!hasStudentRole) {
        console.error("🔴 User lacks student role:", user.roles);
        throw new Error("Your account doesn't have student privileges.");
      }
      
      // Clear previous auth data before setting new data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Save new auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log("📦 Auth data saved to localStorage");
      
      // Update state
      setCurrentUser(user);
      console.log("👤 Current user set to:", user.firstName);
      
      return user;
    } catch (error) {
      console.error("❌ Student login error:", error);
      throw error; // Re-throw the error for the component to handle
    } finally {
      setLoading(false);
    }
  };

  // Logout function - ADDED
  const handleLogout = () => {
    try {
      console.log("🚪 Logging out user");
      
      // Call the API service
      authService.logout();
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update the state
      setCurrentUser(null);
      
      console.log("👋 User logged out successfully");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  // Role checking functions
  const isAdmin = () => {
    console.log("🔍 Checking admin role:", currentUser?.roles);
    if (!currentUser || !currentUser.roles) return false;
    
    // Handle both string arrays ["admin"] and object arrays [{name: "admin"}]
    return Array.isArray(currentUser.roles) && (
      currentUser.roles.includes('admin') || 
      currentUser.roles.some(role => role === 'admin' || role.name === 'admin')
    );
  };

  const isStudent = () => {
    console.log("🔍 Checking student role:", currentUser?.roles);
    if (!currentUser || !currentUser.roles) return false;
    
    // Handle both string arrays ["student"] and object arrays [{name: "student"}]
    return Array.isArray(currentUser.roles) && (
      currentUser.roles.includes('student') || 
      currentUser.roles.some(role => role === 'student' || role.name === 'student')
    );
  };

  // Context value with all required functions
  const value = {
    currentUser,
    loading,
    error,
    handleLogin,       
    handleAdminLogin,
    handleStudentLogin,
    handleLogout,
    isAdmin,
    isStudent
  };

  // Log current auth state
  console.log("🔐 AuthContext current state:", { 
    isAuthenticated: !!currentUser,
    userEmail: currentUser?.email || 'none',
    loading
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};