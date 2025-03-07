import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { courseService ,userService } from '../../services/api';
import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import StudentNavbar from '../../components/student/StudentNavbar';
import CourseCard from '../../components/student/CourseCard';

const AvailableCourses = () => {
  const { currentUser } = useAuth();
  const { loading, setLoading, error, setError, showNotification } = useApp();
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const data = await courseService.getAllCourses(currentUser._id);
      setCourses(data.availableCourses);
      setEnrolledCourseIds(data.enrolledCourseIds);
    } catch (err) {
      setError('Failed to load available courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEnroll = async (courseId) => {
    setLoading(true);
    try {
      await userService.enrollInCourse(currentUser._id, courseId);
      setEnrolledCourseIds([...enrolledCourseIds, courseId]);
      showNotification('Successfully enrolled in course');
    } catch (err) {
      setError('Failed to enroll in course');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Available Courses</h1>
            <Link to="/student/enrolled-courses">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                View My Enrolled Courses
              </button>
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
              <p className="text-gray-500">Loading available courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Courses Found</h2>
              
              {searchTerm || semesterFilter ? (
                <p className="text-gray-600">
                  No courses match your current search filters. Try adjusting your criteria.
                </p>
              ) : (
                <p className="text-gray-600">
                  There are no available courses at this time.
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map(course => (
                <CourseCard
                  key={course._id}
                  course={course}
                  isEnrolled={enrolledCourseIds.includes(course._id)}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AvailableCourses;