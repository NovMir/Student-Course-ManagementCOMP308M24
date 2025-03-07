import { useState } from 'react';
import Button from '../shared/Button';

// eslint-disable-next-line react/prop-types
const EnrollmentList = ({ enrollments, onRemoveEnrollment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  
  // Get unique semesters for filter
  const semesters = [...new Set(enrollments.map(item => item.course.semester).filter(Boolean))];
  
  // Filter enrollments based on search term and semester filter
  const filteredEnrollments = enrollments.filter(item => {
    const matchesSearch = 
      (item.course.courseCode && item.course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.course.courseName && item.course.courseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.student.studentNumber && item.student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.student.firstName && item.student.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.student.lastName && item.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSemester = !semesterFilter || item.course.semester === semesterFilter;
    
    return matchesSearch && matchesSemester;
  });
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search courses or students..."
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
      
      {filteredEnrollments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No enrollments found</p>
          {searchTerm || semesterFilter ? (
            <p className="text-gray-500 mt-2">
              Try adjusting your search criteria
            </p>
          ) : (
            <p className="text-gray-500 mt-2">
              No students are currently enrolled in any courses
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEnrollments.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {item.course.courseName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.course.courseCode}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {item.student.firstName} {item.student.lastName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.student.studentNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.course.semester || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onRemoveEnrollment(item.student._id, item.course._id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EnrollmentList;