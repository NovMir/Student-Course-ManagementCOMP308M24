
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ element, adminOnly = false }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const role = localStorage.getItem('userRole');

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // If admin-only route and user is not an admin, redirect
  if (adminOnly && role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return element ? element : <Outlet />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element,
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;
