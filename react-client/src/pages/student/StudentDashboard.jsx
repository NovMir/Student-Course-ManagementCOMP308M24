import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import StudentNavbar from '../../components/student/StudentNavbar';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { userService, courseService } from '../../services/api';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { setLoading, setError } = useApp();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  
  useEffect(() => {
    loadStudentCourses();
  }, []);

  const loadStudentCourses = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const courses = await courseService.getCourseStudents(currentUser._id);
      setEnrolledCourses(courses);
    } catch (err) {
      setError('Failed to load your courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <StudentNavbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">
              Welcome, {currentUser?.firstName}! Heres an overview of your courses and information.
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-blue-50 border border-blue-100">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">My Courses</h2>
                <p className="text-4xl font-bold text-blue-600">{enrolledCourses.length}</p>
                <Link to="/student/enrolled-courses" className="text-blue-700 text-sm hover:underline mt-3 inline-block">
                  View My Courses →
                </Link>
              </div>
            </Card>
            
            <Card className="bg-green-50 border border-green-100">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-green-800 mb-2">Program</h2>
                <p className="text-xl font-bold text-green-600">{currentUser?.program || 'Not specified'}</p>
                <Link to="/student/profile" className="text-green-700 text-sm hover:underline mt-3 inline-block">
                  View Profile →
                </Link>
              </div>
            </Card>
            
            <Card className="bg-purple-50 border border-purple-100">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-purple-800 mb-2">Browse Courses</h2>
                <p className="text-base text-purple-600 mb-3">Find new courses to enroll in</p>
                <Link to="/student/available-courses">
                  <Button variant="primary" className="bg-purple-600 hover:bg-purple-700">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
          
          {/* Recent Enrollments */}
          <Card title="My Recent Courses">
            {enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {enrolledCourses.slice(0, 3).map(course => (
                  <div key={course._id} className="bg-gray-50 p-4 rounded-lg">
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
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {course.courseName}
                    </h3>
                    
                    {course.description && (
                      <p className="text-gray-600 mb-2 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>
                ))}
                
                {enrolledCourses.length > 3 && (
                  <div className="text-center mt-4">
                    <Link to="/student/enrolled-courses" className="text-blue-600 hover:text-blue-800">
                      View all {enrolledCourses.length} courses →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">You havent enrolled in any courses yet.</p>
                <Link to="/student/available-courses">
                  <Button variant="primary">
                    Find Courses to Enroll
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;