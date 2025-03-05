
import { useState, useEffect } from 'react';
import StudentCard from './StudentCard';
import api from '../services/api';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await api.getStudents();
        setStudents(data);
      } catch  {
        setError('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div>Loading students...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row">
      {students.map(student => (
        <div key={student._id} className="col-md-4">
          <StudentCard student={student} />
        </div>
      ))}
    </div>
  );
};

export default StudentList;
