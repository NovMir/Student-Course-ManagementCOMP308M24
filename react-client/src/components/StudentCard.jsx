import PropTypes from "prop-types";

function StudentCard({ student }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">
          {student.firstName} {student.lastName}
        </h5>
        <p className="card-text"><strong>Email:</strong> {student.email}</p>
        {/* Possibly a "Details" button */}
      </div>
    </div>
  );
}
StudentCard.propTypes = {
    student: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      }).isRequired,
    };
export default StudentCard;
