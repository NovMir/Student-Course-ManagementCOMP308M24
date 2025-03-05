
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';//profile??
import Home from './pages/Home';
import Login from './pages/Login';
import RegistrationForm from './components/RegistrationForm';
import Courses from './pages/Courses';
import Students from './pages/Students';
import CourseDetails from './pages/CourseDetails';
import StudentDetails from './pages/StudentDetails';
import AdminRoute from './components/PrivateRoute';
import ProtectedRoute from './components/PrivateRoute';
import Unauthorized from './pages/Unauthorized';
function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            </Route>
      
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/courses"
              element={<ProtectedRoute element={<Courses />} />}
            />
            <Route
              path="/courses/:id"
              element={<ProtectedRoute element={<CourseDetails />} />}
            />
            <Route
              path="/students"
              element={<ProtectedRoute element={<Students />} />}
            />
            <Route
              path="/students/:id"
              element={<ProtectedRoute element={<StudentDetails />} />}
            />
          
            <Route path="/CourseDetails" element={<CourseDetails />} />
          
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;