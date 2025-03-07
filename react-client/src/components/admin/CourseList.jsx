import  { useState } from 'react';

import Button from '../shared/Button';
import Card from '../shared/Card';
import PropTypes from 'prop-types';



const CourseList = ({ courses, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  
  // Get unique semesters for filter
  const semesters = [...new Set(courses.map(course => course.semester).filter(Boolean))];
  
  // Filter courses based on search term and semester filter
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      (course.courseCode && course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.courseName && course.courseName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSemester = !semesterFilter || course.semester === semesterFilter;
    
    return matchesSearch && matchesSemester;
  });
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by course code or name..."
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
      
      {filteredCourses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No courses found</p>
          {searchTerm || semesterFilter ? (
            <p className="text-gray-500 mt-2">
              Try adjusting your search criteria
            </p>
          ) : (
            <p className="text-gray-500 mt-2">
              Click the Add Course button to create your first course
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map(course => (
            <Card key={course._id} className="h-full">
              <div className="flex flex-col h-full">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {course.courseCode}
                    </h3>
                    {course.semester && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {course.semester}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {course.courseName}
                  </h2>
                  
                  {course.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {course.description}
                    </p>
                  )}
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Enrolled Students: {course.students?.length || 0}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-auto pt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(course)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(course._id)}
                    className="flex-1"
                  >
                    Delete
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
CourseList.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      courseCode: PropTypes.string,
      courseName: PropTypes.string,
      description: PropTypes.string,
      semester: PropTypes.string,
      students: PropTypes.array,
    })
  ),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
export default CourseList;