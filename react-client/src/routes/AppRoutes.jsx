
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import pages
import LandingPage from '../pages/LandingPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import StudentLoginPage from '../pages/StudentLoginPage';

// Import admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageCourses from '../pages/admin/ManageCourses';
import ManageStudents from '../pages/admin/ManageStudents';
import ViewEnrollments from '../pages/admin/ViewEnrollments';

// Import student pages
import StudentDashboard from '../pages/student/StudentDashboard';
import EnrolledCourses from '../pages/student/EnrolledCourses';
import AvailableCourses from '../pages/student/AvailableCourses';
import Profile from '../pages/student/Profile';

// ProtectedRoute component
const ProtectedRoute = ({ children, role }) => {
    const { currentUser, isAdmin, isStudent, loading } = useAuth();
    
    // Add debugging logs
    console.log("🔒 ProtectedRoute Check:", { 
      path: window.location.pathname,
      role,
      currentUser: currentUser ? `${currentUser.firstName} (${currentUser.email})` : 'none',
      roles: currentUser?.roles, // log exact structure of roles
      isAdmin: isAdmin ? isAdmin() : 'function not available',
      isStudent: isStudent ? isStudent() : 'function not available',
      loading
    });
    
    // Show loading state while checking auth
    if (loading) {
      console.log("⏳ Auth is still loading");
      return <div>Loading...</div>;
    }
  
    if (!currentUser) {
      console.log("❌ No user logged in, redirecting to /");
      return <Navigate to="/" replace />;
    }
    
    // Check role using flexible logic - handles both formats
    let hasRequiredRole = false;
    
    if (role === 'admin') {
      // Try both possible formats (string array vs object array)
      hasRequiredRole = Array.isArray(currentUser.roles) && (
        currentUser.roles.includes('admin') || 
        currentUser.roles.some(r => r === 'admin' || r.name === 'admin')
      );
    } else if (role === 'student') {
      hasRequiredRole = Array.isArray(currentUser.roles) && (
        currentUser.roles.includes('student') || 
        currentUser.roles.some(r => r === 'student' || r.name === 'student')
      );
    }
    
    console.log(`🔍 Role check for ${role}:`, hasRequiredRole);
    
    if (!hasRequiredRole) {
      // User doesn't have the right role
      if (role === 'admin' && isStudent && isStudent()) {
        console.log("⚠️ Not admin but is student, redirecting to student dashboard");
        return <Navigate to="/student/dashboard" replace />;
      } else if (role === 'student' && isAdmin && isAdmin()) {
        console.log("⚠️ Not student but is admin, redirecting to admin dashboard");
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        console.log("⚠️ No required role, redirecting to landing");
        return <Navigate to="/" replace />;
      }
    }
    
    console.log("✅ Access granted for", role);
    return children;
  };

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/login" element={<AdminLoginPage userType="admin" />} />
      <Route path="/student/login" element={<StudentLoginPage userType="student" />} />
      
      {/* Admin routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/courses" 
        element={
          <ProtectedRoute role="admin">
            <ManageCourses />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/students" 
        element={
          <ProtectedRoute role="admin">
            <ManageStudents />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/enrollments" 
        element={
          <ProtectedRoute role="admin">
            <ViewEnrollments />
          </ProtectedRoute>
        } 
      />
      
      {/* Student routes */}
      <Route 
        path="/student/dashboard" 
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/enrolled-courses" 
        element={
          <ProtectedRoute role="student">
            <EnrolledCourses />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/available-courses" 
        element={
          <ProtectedRoute role="student">
            <AvailableCourses />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/profile" 
        element={
          <ProtectedRoute role="student">
            <Profile />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all route - redirect to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;