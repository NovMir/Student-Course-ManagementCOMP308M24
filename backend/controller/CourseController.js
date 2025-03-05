import asyncHandler from 'express-async-handler';
import Course from '../model/Course.js';

const createCourse = asyncHandler(async (req, res) => {
    const { courseCode, courseName, description, semester } = req.body.courseData;
    

   console.log('req.body=',req.body);
  
    // 2) Create and save new course
    const newCourse = new Course({
      courseCode,
      courseName,
      description,
      semester,
      students:[]
    });
  
    const savedCourse = await newCourse.save();
  
    // 3) Return the created course
    return res.status(201).json(savedCourse);
  });

  const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find();
    // Optionally, you can .populate('students') here if needed
    res.json(courses);
  });
  
  /**
   * @desc    Get a single course by ID
   * @route   GET /api/courses/:id
   * @access  Public
   */
  const getCourseById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id).populate('students');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
  
    res.json(course);
  });
  
  /**
   * @desc    Update a course
   * @route   PUT /api/courses/:id
   * @access  Public (or Private if you have authentication)
   */
  const updateCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { courseCode, courseName, description, semester } = req.body;
  
    // Find and update
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { courseCode, courseName, description, semester },
      { new: true } // returns updated document
    );
  
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
  
    res.json(updatedCourse);
  });
  
  /**
   * @desc    Delete a course
   * @route   DELETE /api/courses/:id
   * @access  Public (or Private if you have authentication)
   */
  const deleteCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);
  
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
  
    res.json({ message: 'Course deleted successfully' });
  });
  
  export {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
  };