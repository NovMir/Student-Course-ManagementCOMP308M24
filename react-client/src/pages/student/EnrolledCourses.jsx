import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import StudentNavbar from '../../components/student/StudentNavbar';
import CourseCard from '../../components/student/CourseCard';
import Button from '../../components/shared/Button';

const EnrolledCourses = () => {
  const { currentUser } = useAuth();
  const { loading, setLoading, error, setError, showNotification } = useApp();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [confirmUnenroll, setConfirmUnenroll] = useState(null);
  
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const data = await fetchStudentCourses(currentUser._id);
      setCourses(data);
    } catch (err) {
      setError('Failed to load your courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUnenroll = async (courseId) => {
    setLoading(true);
    try {
      await unenrollFromCourse(currentUser._id, courseId);
      setCourses(courses.filter(course => course._id !== courseId));
      setConfirmUnenroll(null);
      showNotification('Successfully unenrolled from course');
    } catch (err) {
      setError('Failed to unenroll from course');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUnenrollClick = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    setConfirmUnenroll(course);
  };
  
  // Get unique semesters for filter
  const semesters = [...new Set(courses.map(course => course.semester).filter(Boolean))];
  
  // Filter courses based on search term and semester filter
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      (course.courseCode && course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.courseName && course.courseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSemester = !semesterFilter || course.semester === semesterFilter;
    
    return matchesSearch && matchesSemester;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <StudentNavbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Enrolled Courses</h1>
            <Link to="/student/available-courses">
              <Button variant="primary">
                Browse Available Courses
              </Button>
            </Link>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="w-full md:w-48 p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Semesters</option>
                {semesters.map(semester => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading your courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Courses Found</h2>
              
              {searchTerm || semesterFilter ? (
                <p className="text-gray-600 mb-4">
                  No courses match your current search filters. Try adjusting your criteria.
                </p>
              ) : (
                <p className="text-gray-600 mb-4">
                  You are not enrolled in any courses yet.
                </p>
              )}
              
              <Link to="/student/available-courses">
                <Button variant="primary">
                  Find Courses to Enroll
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map(course => (
                <CourseCard
                  key={course._id}
                  course={course}
                  isEnrolled={true}
                  onUnenroll={handleUnenrollClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Unenroll Confirmation Modal */}
      {confirmUnenroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Unenrollment</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to unenroll from the course{' '}
              <span className="font-semibold">{confirmUnenroll.courseName}</span>?
              <span className="block mt-2 text-red-600">
                This action cannot be undone.
              </span>
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setConfirmUnenroll(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleUnenroll(confirmUnenroll._id)}
              >
                Unenroll
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default EnrolledCourses;