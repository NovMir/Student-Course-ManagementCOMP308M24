import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

function CourseForm({ onCourseAdded }) {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [semester, setSemester] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.addCourse({ courseCode, courseName, description, semester });
      setSuccess('Course added successfully!');
      setCourseCode('');
      setCourseName('');
      setDescription('');
      setSemester('');
      onCourseAdded(); // Notify parent component to refresh the course list
    } catch (err) {
      console.error(err);
      setError('Failed to add course');
    }
  };

  return (
    <div className="card card-body mb-3">
      <h5 className="card-title">Add New Course</h5>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Course Code</label>
          <input
            type="text"
            className="form-control"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Course Name</label>
          <input
            type="text"
            className="form-control"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Semester</label>
          <input
            type="text"
            className="form-control"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Course</button>
      </form>
    </div>
  );
}
CourseForm.propTypes = {
    onCourseAdded: PropTypes.func.isRequired,
  };

export default CourseForm;