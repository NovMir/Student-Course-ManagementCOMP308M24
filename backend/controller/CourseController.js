
import Course from '../model/Course.js';

const createCourse = async (req, res) => {
  try {
    console.log('Create course request received:', req.body);
    
    // Directly access properties from req.body without looking for courseData
    // Use destructuring with defaults for optional fields
    const { 
      courseName, 
      courseCode = '', 
      description = '', 
      semester = '' 
    } = req.body;
    
    // Validate required fields
    if (!courseName) {
      console.log('Missing required field: courseName');
      return res.status(400).json({ message: 'Course name is required' });
    }
    
    console.log('Creating course with data:', { courseName, courseCode, description, semester });
    
    // Create and save course
    const newCourse = new Course({
      courseName,
      courseCode,
      description,
      semester,
      students: []
    });
    
    console.log('About to save course to database');
    const savedCourse = await newCourse.save();
    console.log('Course saved successfully with ID:', savedCourse._id);
    
    // Return the created course
    return res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ message: error.message });
  }
};

  const getAllCourses = async (req, res) => {
   try{ const courses = await Course.find()
    .populate('students','firstName lastName email studentNumber')
    .sort({courseName:1});
    res.status(200).json(courses);
  }catch(error){
    res.json({message:error.message});
  }
  };
  
  /**
   * @desc    Get a single course by ID
   * @route   GET /api/courses/:id
   * @access  Public
   */
  const getCourseById = async (req, res) =>{
    try 
      {
    const { id } = req.params;
    const course = await Course.findById(id).populate('students');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
  
    res.json(course);
  }
  catch(error){
    res.json({message:error.message});
  }
  };
  
  /**
   * @desc    Update a course
   * @route   PUT /api/courses/:id
   * @access  Public (or Private if you have authentication)
   */
  const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { courseCode, courseName, description, semester } = req.body;
  
    // Find and update
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { courseCode, courseName, description, semester },
      { new: true } 
    );
  
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(updatedCourse);
  };
  
  /**
   * @desc    Delete a course
   * @route   DELETE /api/courses/:id
   * @access  Public (or Private if you have authentication)
   */
  const deleteCourse = async (req, res) => {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);
  
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
  
    res.json({ message: 'Course deleted successfully' });
  };
  const getAvailableCourses = async (req, res) => {
    try {
      // Get the logged-in student's ID from the token payload (set by the protect middleware)
      const studentId = req.user._id;
      console.log(`Fetching available courses for student: ${studentId}`);
  
      // Query for courses where the student is not enrolled
      // $nin will exclude courses that have the student's ID in the "students" array.
      const courses = await Course.find({ students: { $nin: [studentId] } })
        .populate('students', 'firstName lastName email studentNumber')
        .sort({ courseName: 1 });
  
      return res.status(200).json(courses);
    } catch (error) {
      console.error('Error fetching available courses:', error);
      return res.status(500).json({ message: error.message });
    }
  };
  
  export {
    getAvailableCourses,
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
  };