import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { courseService, userService } from '../../services/api';
import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import AdminNavbar from '../../components/admin/AdminNavbar';
import StudentList from '../../components/admin/StudentList';
import StudentForm from '../../components/admin/StudentForm';
import Button from '../../components/shared/Button';
import Card from '../../components/shared/Card';

const ManageStudents = () => {
  const navigate = useNavigate();
  const { loading, setLoading, error, setError, showNotification } = useApp();
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to load students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (studentData) => {
    setLoading(true);
    try {
      const newStudent = await userService.createStudent(studentData);
      setStudents([...students, newStudent]);
      setShowForm(false);
      showNotification('Student created successfully');
    } catch (err) {
      setError('Failed to create student');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async (studentData) => {
    setLoading(true);
    try {
      const updatedStudent = await userService.updateStudent(editingStudent._id, studentData);
      setStudents(
        students.map(student => 
          student._id === editingStudent._id ? updatedStudent : student
        )
      );
      setEditingStudent(null);
      setShowForm(false);
      showNotification('Student updated successfully');
    } catch (err) {
      setError('Failed to update student');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    setLoading(true);
    try {
      await userService.deleteStudent(studentId);
      setStudents(students.filter(student => student._id !== studentId));
      setConfirmDelete(null);
      showNotification('Student deleted successfully');
    } catch (err) {
      setError('Failed to delete student');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteClick = (studentId) => {
    const student = students.find(s => s._id === studentId);
    setConfirmDelete(student);
  };

  const handleFormSubmit = (studentData) => {
    if (editingStudent) {
      handleUpdateStudent(studentData);
    } else {
      handleCreateStudent(studentData);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleViewCourses = (student) => {
    navigate('/admin/enrollments', { state: { studentId: student._id } });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <AdminNavbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
            {!showForm && (
              <Button 
                variant="primary"
                onClick={() => setShowForm(true)}
              >
                Add Student
              </Button>
            )}
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {showForm ? (
            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
              <StudentForm 
                student={editingStudent}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </Card>
          ) : (
            <>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading students...</p>
                </div>
              ) : (
                <StudentList 
                  students={students}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onViewCourses={handleViewCourses}
                />
              )}
            </>
          )}
        </div>
      </main>
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the student{' '}
              <span className="font-semibold">{confirmDelete.firstName} {confirmDelete.lastName}</span>?
              {confirmDelete.courses?.length > 0 && (
                <span className="block mt-2 text-red-600">
                  Warning: This student is enrolled in {confirmDelete.courses.length} courses.
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleDeleteStudent(confirmDelete._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};
export default ManageStudents;