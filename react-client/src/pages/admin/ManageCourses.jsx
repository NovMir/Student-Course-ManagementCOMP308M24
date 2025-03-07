
  import { useState, useEffect } from 'react';
  import { useApp } from '../../context/AppContext';
  import { courseService } from '../../services/api'; // Import courseService
  import Header from '../../components/shared/Header';
  import Footer from '../../components/shared/Footer';
  import AdminNavbar from '../../components/admin/AdminNavbar';
  import CourseList from '../../components/admin/CourseList';
  import CourseForm from '../../components/admin/CourseForm';
  import Button from '../../components/shared/Button';
  import Card from '../../components/shared/Card';
  
  const ManageCourses = () => {
    const { loading, setLoading, error, setError, showNotification } = useApp();
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
  
    useEffect(() => {
      loadCourses();
    }, []);
  
    const loadCourses = async () => {
      setLoading(true);
      try {
        // Use courseService.getAllCourses instead of fetchCourses
        const response = await courseService.getAllCourses();
        setCourses(response.data); // Access data from response
      } catch (err) {
        setError('Failed to load courses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    const handleCreateCourse = async (courseData) => {
      setLoading(true);
      try {
        // Use courseService.createCourse
        const response = await courseService.createCourse(courseData);
        setCourses([...courses, response.data]); // Access data from response
        setShowForm(false);
        showNotification('Course created successfully');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to create course');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    const handleUpdateCourse = async (courseData) => {
      setLoading(true);
      try {
        // Use courseService.updateCourse
        const response = await courseService.updateCourse(editingCourse._id, courseData);
        setCourses(
          courses.map(course => 
            course._id === editingCourse._id ? response.data : course
          )
        );
        setEditingCourse(null);
        setShowForm(false);
        showNotification('Course updated successfully');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update course');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    const handleDeleteCourse = async (courseId) => {
      setLoading(true);
      try {
        // Use courseService.deleteCourse
        await courseService.deleteCourse(courseId);
        setCourses(courses.filter(course => course._id !== courseId));
        setConfirmDelete(null);
        showNotification('Course deleted successfully');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete course');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    const handleEdit = (course) => {
      setEditingCourse(course);
      setShowForm(true);
    };
  
    const handleDeleteClick = (courseId) => {
      const course = courses.find(c => c._id === courseId);
      setConfirmDelete(course);
    };
  
    const handleFormSubmit = (courseData) => {
      if (editingCourse) {
        handleUpdateCourse(courseData);
      } else {
        handleCreateCourse(courseData);
      }
    };
  
    const handleFormCancel = () => {
      setShowForm(false);
      setEditingCourse(null);
    };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <AdminNavbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
            {!showForm && (
              <Button 
                variant="primary"
                onClick={() => setShowForm(true)}
              >
                Add Course
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
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              <CourseForm 
                course={editingCourse}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </Card>
          ) : (
            <>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading courses...</p>
                </div>
              ) : (
                <CourseList 
                  courses={courses}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
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
              Are you sure you want to delete the course{' '}
              <span className="font-semibold">{confirmDelete.courseName}</span>?
              {confirmDelete.students?.length > 0 && (
                <span className="block mt-2 text-red-600">
                  Warning: This course has {confirmDelete.students.length} students enrolled.
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
                onClick={() => handleDeleteCourse(confirmDelete._id)}
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

export default ManageCourses;