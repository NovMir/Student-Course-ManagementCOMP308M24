import { useState } from 'react';
import ProfileForm from '../components/ProfileForm';
import StudentList from '../components/StudentList';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => handleTabChange('courses')}
          >
            Manage Courses
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => handleTabChange('students')}
          >
            Manage Students
          </button>
        </li>
      </ul>
      <div className="tab-content mt-3">
        {activeTab === 'courses' && (
          <div className="tab-pane active">
            <ProfileForm />
          </div>
        )}
        {activeTab === 'students' && (
          <div className="tab-pane active">
            <StudentList />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;