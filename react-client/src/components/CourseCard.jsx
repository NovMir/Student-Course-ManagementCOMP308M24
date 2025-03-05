// src/components/CourseCard.jsx

import PropTypes from 'prop-types';//hide on delete from student

function CourseCard({ course, onAdd, onDelete }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{course.courseName}</h5>
        <p className="card-text">
          <strong>Code:</strong> {course.courseCode}<br />
          <strong>Description:</strong> {course.description}<br />
          <strong>Semester:</strong> {course.semester}<br />
          <strong>Students Enrolled:</strong> {course.students.length}
        </p>

        {/* Possibly two different buttons for "Enroll" vs. "Delete" */}
        {onAdd && (
          <button
            className="btn btn-primary me-2"
            onClick={() => onAdd(course._id)}
          >
            Enroll
          </button>
        )}
        {onDelete && (
          <button
            className="btn btn-danger"
            onClick={() => onDelete(course._id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    courseCode: PropTypes.string,
    courseName: PropTypes.string,
    description: PropTypes.string,
    semester: PropTypes.string,
    students: PropTypes.array
  }).isRequired,
  onAdd: PropTypes.func,    // for "Enroll"
  onDelete: PropTypes.func, // for "Drop" or "Admin Delete"
};

export default CourseCard;
