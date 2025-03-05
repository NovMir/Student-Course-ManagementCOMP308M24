
import { useState, useEffect } from 'react';

import CourseList from '../components/CourseList';
import api from '../services/api';

function CourseDetails() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getCourses();
        setCourses(data);
      } catch {
        setError('Failed to fetch courses');
      }
    };

    fetchCourses();
  }, []);

  // Refresh the list when a course is added

  return (
    <div className="container mt-4">
      <h2>Course Management</h2>
      <p>Below is the list of all available courses. You can add new courses using the form.</p>

      {error && <div className="alert alert-danger">{error}</div>}

  

      {/* List of all courses */}
      <CourseList courses={courses} />
    </div>
  );
}

export default CourseDetails;
