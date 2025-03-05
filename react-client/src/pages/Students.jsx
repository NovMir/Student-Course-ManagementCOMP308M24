// src/pages/Students.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';

function Students() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Example: retrieve the logged-in student's ID (or from context/Redux)
  const studentId = JSON.parse(localStorage.getItem('userInfo'))?._id;

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        setError('');
        // GET the student's enrolled courses
        const { data } = await axios.get(`/users/students/${studentId}/courses`);
        // data might look like: { _id, firstName, courses: [...] } or just { courses: [...] }
        setEnrolledCourses(data.courses || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch enrolled courses');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchEnrolledCourses();
    }
  }, [studentId]);

  const handleDropCourse = async (courseId) => {
    try {
      await axios.delete(`/users/students/${studentId}/courses/${courseId}`);
      // Remove from local state
      setEnrolledCourses((prev) => prev.filter((course) => course._id !== courseId));
    } catch (err) {
      console.error(err);
      setError('Failed to drop course');
    }
  };

  if (loading) return <div>Loading enrolled courses...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>My Enrolled Courses</h2>

      {/* Button to navigate to "Manage Courses" (shows all courses) */}
      <Link to="/CourseDetails" className="btn btn-primary mb-3">
        Manage Courses
      </Link>

      <div className="row">
        {enrolledCourses.map((course) => (
          <div key={course._id} className="col-md-4">
            <CourseCard
              course={course}
              // We rename "onDelete" to "onDrop" or keep it the same
              onDelete={handleDropCourse}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Students;
