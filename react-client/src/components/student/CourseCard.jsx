import PropTypes from 'prop-types';
import Card from '../shared/Card';
import Button from '../shared/Button';

const CourseCard = ({ course, isEnrolled, onEnroll, onUnenroll }) => {
  return (
    <Card className="h-full">
      <div className="flex flex-col h-full">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-gray-500">
              {course.courseCode}
            </h3>
            {course.semester && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {course.semester}
              </span>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {course.courseName}
          </h2>
          
          {course.description && (
            <p className="text-gray-600 mb-4 line-clamp-3">
              {course.description}
            </p>
          )}
          
          <div className="text-sm text-gray-500 mb-4">
            <p>Enrolled Students: {course.students?.length || 0}</p>
          </div>
        </div>
        
        <div className="mt-auto pt-4">
          {isEnrolled ? (
            <Button
              variant="danger"
              onClick={() => onUnenroll(course._id)}
              fullWidth
            >
              Unenroll
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => onEnroll(course._id)}
              fullWidth
            >
              Enroll
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
CourseCard.propTypes = {
    course: PropTypes.object.isRequired,
    isEnrolled: PropTypes.bool.isRequired,
    onEnroll: PropTypes.func.isRequired,
    onUnenroll: PropTypes.func.isRequired,
    };
export default CourseCard;