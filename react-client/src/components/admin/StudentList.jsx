import { useState, useEffect } from 'react';
import Button from '../shared/Button';
import Card from '../shared/Card';

const StudentList = ({ students: initialStudents = [], onEdit, onDelete, onViewCourses }) => {
    const actualStudents = Array.isArray(initialStudents)
    ? initialStudents
    : (initialStudents && Array.isArray(initialStudents.data)
        ? initialStudents.data
        : []);

  // Initialize state for studentList, search term, and program filter
  const [studentList, setStudentList] = useState(actualStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('');

  // Get unique programs for filtering
  const programs = [
    ...new Set(studentList.map(student => student.program).filter(Boolean))
  ];

  // Update local state when initialStudents prop changes
  useEffect(() => {
    console.log('Initial students:', initialStudents);
    if (Array.isArray(initialStudents)) {
      setStudentList(initialStudents);
    } else if (initialStudents && Array.isArray(initialStudents.data)) {
      setStudentList(initialStudents.data);
    } else {
      console.error('Expected an array for students, but got:', initialStudents);
      setStudentList([]);
    }
  }, [initialStudents]);

  // Use a safe alias for mapping (this is optional since studentList should be an array)
  const safeStudentList = Array.isArray(studentList) ? studentList : [];

  // Filter students based on search term and program filter
  const filteredStudents = safeStudentList.filter(student => {
    const matchesSearch =
      (student.studentNumber &&
        student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.firstName &&
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.lastName &&
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.email &&
        student.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesProgram = programFilter
      ? student.program && student.program === programFilter
      : true;

    return matchesSearch && matchesProgram;
  });
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, or student number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="w-full md:w-48 p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Programs</option>
            {programs.map(program => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredStudents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No students found</p>
          {searchTerm || programFilter ? (
            <p className="text-gray-500 mt-2">
              Try adjusting your search criteria
            </p>
          ) : (
            <p className="text-gray-500 mt-2">
              Click the Add Student button to create your first student
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map(student => (
            <Card key={student._id} className="h-full">
              <div className="flex flex-col h-full">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-gray-500">
                      {student.studentNumber}
                    </h3>
                    {student.program && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.program}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {student.firstName} {student.lastName}
                  </h2>
                  
                  <p className="text-gray-600 mb-4">
                    {student.email}
                  </p>
                  
                  {(student.city || student.phoneNumber) && (
                    <div className="text-sm text-gray-500 mb-4">
                      {student.city && <p>{student.city}</p>}
                      {student.phoneNumber && <p>{student.phoneNumber}</p>}
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-500 mb-4">
                    Enrolled in {student.courses?.length || 0} courses
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-auto pt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(student)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(student._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onViewCourses(student)}
                    className="col-span-2"
                  >
                    View Enrollments
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentList;