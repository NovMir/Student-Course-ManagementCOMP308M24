// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

function Navbar() {
/***to store user info
 * const userInfor = Json.parse(localStorage.getItem('userInfo'));
 * const logoutHandler = () => {
 * localStorage.removeItem('userInfo');
 * };
 * students protected
 */



  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Course Management</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
          <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
          
                 <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">Register</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/courses">Courses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/students">Students</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;