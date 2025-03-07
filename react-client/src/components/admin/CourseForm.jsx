import  { useState, useEffect } from 'react';
import Button from '../shared/Button';

import PropTypes from 'prop-types';

const CourseForm = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    description: '',
    semester: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (course) {
      setFormData({
        courseCode: course.courseCode || '',
        courseName: course.courseName || '',
        description: course.description || '',
        semester: course.semester || ''
      });
    }
  }, [course]);

  const validate = () => {
    const newErrors = {};
    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Course name is required';
    }
    
    if (!formData.courseCode.trim()) {
      newErrors.courseCode = 'Course code is required';
    } else if (!/^[A-Z]{3,4}\d{3,4}$/.test(formData.courseCode.trim())) {
      newErrors.courseCode = 'Course code format should be like "CSC101" or "MATH2001"';
    }
    
    if (!formData.semester.trim()) {
      newErrors.semester = 'Semester is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-1">
          Course Code*
        </label>
        <input
          type="text"
          id="courseCode"
          name="courseCode"
          value={formData.courseCode}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${
            errors.courseCode ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g. CSC101"
        />
        {errors.courseCode && (
          <p className="mt-1 text-sm text-red-600">{errors.courseCode}</p>
        )}
      </div>

      <div>
        <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
          Course Name*
        </label>
        <input
          type="text"
          id="courseName"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${
            errors.courseName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g. Introduction to Computer Science"
        />
        {errors.courseName && (
          <p className="mt-1 text-sm text-red-600">{errors.courseName}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter course description"
        />
      </div>

      <div>
        <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
          Semester*
        </label>
        <select
          id="semester"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${
            errors.semester ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select Semester</option>
          <option value="Fall 2024">Fall 2024</option>
          <option value="Winter 2025">Winter 2025</option>
          <option value="Spring 2025">Spring 2025</option>
          <option value="Summer 2025">Summer 2025</option>
        </select>
        {errors.semester && (
          <p className="mt-1 text-sm text-red-600">{errors.semester}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-3">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary"
        >
          {course ? 'Update Course' : 'Add Course'}
        </Button>
      </div>
    </form>
  );
};
CourseForm.propTypes = {
    course: PropTypes.shape({
      courseCode: PropTypes.string,
      courseName: PropTypes.string,
      description: PropTypes.string,
      semester: PropTypes.string,
    }),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };
export default CourseForm;