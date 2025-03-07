import  { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { userService,courseService } from '../../services/api';
import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import AdminNavbar from '../../components/admin/AdminNavbar';
import EnrollmentList from '../../components/admin/EnrollmentList';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';

const ViewEnrollments = () => {
  const location = useLocation();
  const { loading, setLoading, error, setError, showNotification } = useApp();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [filterStudentId, setFilterStudentId] = useState(location.state?.studentId || '');
  const [confirmRemove, setConfirmRemove] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Await the responses and destructure them
        const [studentsResponse, coursesResponse] = await Promise.all([
          userService.getAllStudents(),
          courseService.getAllCourses()
        ]);
        
        // Extract the actual data arrays
        const studentsData = studentsResponse.data;
        const coursesData = coursesResponse.data;
        
        setStudents(studentsData);
        setCourses(coursesData);
        
        // Process enrollments
        const enrollmentsList = [];
        
        coursesData.forEach(course => {
          if (Array.isArray(course.students) && course.students.length > 0) {
            course.students.forEach(studentId => {
              const student = studentsData.find(s => s._id === studentId);
              if (student) {
                enrollmentsList.push({
                  course,
                  student
                });
              }
            });
          }
        });
        
        setEnrollments(enrollmentsList);
      } catch (err) {
        setError('Failed to load enrollment data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, []);

  const handleRemoveEnrollment = async (studentId, courseId) => {
    setLoading(true);
    try {
      await userService.deleteCourseFromStudent(studentId, courseId);
      
      // Update local state
      setEnrollments(enrollments.filter(
        item => !(item.student._id === studentId && item.course._id === courseId)
      ));
      
      setConfirmRemove(null);
      showNotification('Enrollment removed successfully');
    } catch (err) {
      setError('Failed to remove enrollment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClick = (studentId, courseId) => {
    const enrollment = enrollments.find(
      item => item.student._id === studentId && item.course._id === courseId
    );
    setConfirmRemove(enrollment);
  };

  // Filter enrollments if a student filter is applied
  const filteredEnrollments = filterStudentId
    ? enrollments.filter(item => item.student._id === filterStudentId)
    : enrollments;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <AdminNavbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {filterStudentId ? 'Student Enrollments' : 'All Enrollments'}
            </h1>
            {filterStudentId && (
              <Button 
                variant="secondary"
                onClick={() => setFilterStudentId('')}
              >
                View All Enrollments
              </Button>
            )}
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {filterStudentId && (
            <Card className="mb-6">
              {(() => {
                const student = students.find(s => s._id === filterStudentId);
                return student ? (
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    <div className="md:w-1/3">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Student Information</h3>
                      <p className="text-sm text-gray-700">
                        <span className="block"><strong>Name:</strong> {student.firstName} {student.lastName}</span>
                        <span className="block"><strong>Student Number:</strong> {student.studentNumber}</span>
                        <span className="block"><strong>Email:</strong> {student.email}</span>
                        <span className="block"><strong>Program:</strong> {student.program}</span>
                      </p>
                    </div>
                    <div className="md:w-2/3">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Enrollment Summary</h3>
                      <p className="text-sm text-gray-700">
                        <span className="block">This student is enrolled in {filteredEnrollments.length} courses.</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">Student information not found</p>
                );
              })()}
            </Card>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading enrollments...</p>
            </div>
          ) : (
            <EnrollmentList 
              enrollments={filteredEnrollments}
              onRemoveEnrollment={handleRemoveClick}
            />
          )}
        </div>
      </main>
      
      {/* Confirmation Modal */}
      {confirmRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Remove Enrollment</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove{' '}
              <span className="font-semibold">
                {confirmRemove.student.firstName} {confirmRemove.student.lastName}
              </span>{' '}
              from the course{' '}
              <span className="font-semibold">{confirmRemove.course.courseName}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setConfirmRemove(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleRemoveEnrollment(confirmRemove.student._id, confirmRemove.course._id)}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default ViewEnrollments;