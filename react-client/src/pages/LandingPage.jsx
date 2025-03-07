
import { useNavigate } from 'react-router-dom';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Student Management System
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Streamlined course management and enrollment system for students and administrators
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card 
              title="Admin Portal" 
              hoverEffect={true} 
              className="flex flex-col h-full"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <p className="text-gray-600 mb-4">
                    For administrators to manage courses, students, and enrollments
                  </p>
                  <ul className="list-disc list-inside text-gray-600 mb-6">
                    <li>Add, edit, and remove courses</li>
                    <li>Manage student information</li>
                    <li>View and manage enrollment data</li>
                    <li>Generate reports and statistics</li>
                  </ul>
                </div>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/admin/login')}
                >
                  Go to Admin Login
                </Button>
              </div>
            </Card>

            <Card 
              title="Student Portal" 
              hoverEffect={true} 
              className="flex flex-col h-full"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <p className="text-gray-600 mb-4">
                    For students to manage their course enrollments
                  </p>
                  <ul className="list-disc list-inside text-gray-600 mb-6">
                    <li>View available courses</li>
                    <li>Enroll in new courses</li>
                    <li>Manage current enrollments</li>
                    <li>Access course information</li>
                  </ul>
                </div>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/student/login')}
                >
                  Go to Student Login
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;