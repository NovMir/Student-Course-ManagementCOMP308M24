// src/components/CourseList.jsx
import { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import api from '../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await api.getCourses(); // GET /api/courses
        setCourses(data);
      } catch {
        setError('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnrollCourse = async (courseId) => {
    try {
      // e.g. POST /users/students/:studentId/courses
      const studentId = JSON.parse(localStorage.getItem('userInfo'))?._id;
      await api.enrollInCourse(studentId, courseId);
      alert('Enrolled successfully!');
    } catch {
      setError('Failed to enroll in course');
    }
  };

  // Possibly an admin-only delete
  const handleDeleteCourse = async (courseId) => {
    try {
      await api.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch {
      setError('Failed to delete course');
    }
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row">
      {courses.map((course) => (
        <div key={course._id} className="col-md-4">
          <CourseCard
            course={course}
            onAdd={handleEnrollCourse}
            onDelete={handleDeleteCourse}
          />
        </div>
      ))}
    </div>
  );
};

export default CourseList;
