import { useAuth } from '../context/AuthContext';
import LoginBase from './LoginPage';

const StudentLoginPage = () => {
  const { handleStudentLogin } = useAuth();
  
  return (
    <LoginBase 
      loginType="student"
      title="Student Login"
      description="Enter your credentials to access your student dashboard"
      inputLabel="Student Number"
      inputType="text"
      placeholder="e.g. S12345"
      redirectPath="/student/dashboard"
      handleLogin={handleStudentLogin}
    />
  );
};

export default StudentLoginPage;