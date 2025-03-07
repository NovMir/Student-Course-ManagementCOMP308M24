import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { courseService, userService } from '../../services/api'; // Import API services
import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import AdminNavbar from '../../components/admin/AdminNavbar';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    totalStudents: 0,
    coursesBySemester: {},
    recentEnrollments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      let courses = [];
      let students = [];

      try {
        console.log('Fetching courses...');
        const coursesResponse = await courseService.getAllCourses();
        courses = coursesResponse.data || [];
        console.log(`✅ Fetched ${courses.length} courses`);

      } catch (courseError) {
        console.error('❌ Error fetching courses:', courseError);
        setError('Failed to load course data');
      }

      try {
        console.log('Fetching students...');
        const studentsResponse = await userService.getAllStudents();
        students = studentsResponse.data || [];
        console.log(`✅ Fetched ${students.length} students`);

      } catch (studentError) {
        console.error('❌ Error fetching students:', studentError);
      }

      // Process data for dashboard
      const coursesBySemester = courses.reduce((acc, course) => {
        const semester = course.semester || 'Unassigned';
        acc[semester] = (acc[semester] || 0) + 1;
        return acc;
      }, {});

      const recentEnrollments = [];
      if (courses.length > 0 && students.length > 0) {
        courses.forEach(course => {
          if (course.students && course.students.length) {
            course.students.forEach(studentId => {
              const studentIdStr = typeof studentId === 'object' ? studentId._id : studentId;
              const student = students.find(s => s._id === studentIdStr);

              if (student) {
                recentEnrollments.push({
                  courseId: course._id,
                  courseName: course.courseName,
                  studentId: student._id,
                  studentName: `${student.firstName} ${student.lastName}`,
                  timestamp: new Date()
                });
              }
            });
          }
        });

        recentEnrollments.sort((a, b) => b.timestamp - a.timestamp);
      }

      setDashboardData({
        totalCourses: courses.length,
        totalStudents: students.length,
        coursesBySemester,
        recentEnrollments: recentEnrollments.slice(0, 5)
      });

      setLoading(false);
    };

    loadDashboardData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <AdminNavbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {currentUser?.firstName}! Here’s an overview of your system.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-blue-50 border border-blue-100">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-blue-800 mb-2">Total Courses</h2>
                    <p className="text-4xl font-bold text-blue-600">{dashboardData.totalCourses}</p>
                    <Link to="/admin/courses" className="text-blue-700 text-sm hover:underline mt-3 inline-block">
                      Manage Courses →
                    </Link>
                  </div>
                </Card>

                <Card className="bg-green-50 border border-green-100">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-green-800 mb-2">Total Students</h2>
                    <p className="text-4xl font-bold text-green-600">{dashboardData.totalStudents}</p>
                    <Link to="/admin/students" className="text-green-700 text-sm hover:underline mt-3 inline-block">
                      Manage Students →
                    </Link>
                  </div>
                </Card>

                <Card className="bg-purple-50 border border-purple-100">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-purple-800 mb-2">Enrollment Management</h2>
                    <p className="text-base text-purple-600 mb-3">View and manage student enrollments</p>
                    <Link to="/admin/enrollments">
                      <Button variant="primary" className="bg-purple-600 hover:bg-purple-700">
                        View Enrollments
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Recent Enrollments">
                  {dashboardData.recentEnrollments.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {dashboardData.recentEnrollments.map((enrollment, index) => (
                        <li key={index} className="py-3">
                          <p className="text-sm">
                            <span className="font-medium text-gray-900">{enrollment.studentName}</span>
                            {' enrolled in '}
                            <span className="font-medium text-gray-900">{enrollment.courseName}</span>
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent enrollments</p>
                  )}
                </Card>

                <Card title="Courses by Semester">
                  {Object.keys(dashboardData.coursesBySemester).length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {Object.entries(dashboardData.coursesBySemester).map(([semester, count]) => (
                        <li key={semester} className="py-3 flex justify-between">
                          <span className="font-medium text-gray-900">{semester}</span>
                          <span className="text-gray-600">{count} courses</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No courses found</p>
                  )}
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
