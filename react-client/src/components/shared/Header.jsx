
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

const Header = () => {
  const { currentUser, handleLogout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Student Management System
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">
                  Hello, {currentUser.firstName} {currentUser.lastName}
                </span>
                {isAdmin() && (
                  <Link to="/admin/dashboard">
                    <Button variant="secondary" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
                {isStudent() && (
                  <Link to="/student/dashboard">
                    <Button variant="secondary" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    navigate('/');
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/">
                  <Button variant="secondary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;