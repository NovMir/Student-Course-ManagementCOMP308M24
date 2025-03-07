import User from '../model/User.js';
import Course from '../model/Course.js';
import Role from '../model/Role.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';




// Register a new user (admin or student)
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role: requestedRole } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Find the requested role document (admin or student)
    const role = await Role.findOne({ name: requestedRole });
    if (!role) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roles: [role._id]
    });

    // For student accounts, you might want to generate a student number
    if (requestedRole === 'student') {
      // Generate a unique student number (e.g., current year + random number)
      const year = new Date().getFullYear().toString().substr(-2);
      const random = Math.floor(10000 + Math.random() * 90000); // 5-digit number
      newUser.studentNumber = `S${year}${random}`;
    }

    // Save user to database
    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return user data (excluding password) and token
    const userToReturn = await User.findById(newUser._id)
      .select('-password')
      .populate('roles', 'name permissions');

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userToReturn
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user (admin or student)
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    
    const admin = await User.findOne({ email }).populate('roles');

    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is an admin
    const isAdmin = admin.roles.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(403).json({ message: 'You do not have admin privileges' });
    }

    // Check password
    const isMatch = await bcryptjs.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const roleNames= admin.roles.map(role => role.name);

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email, roles: ['admin'] },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.status(200).json({
      message: 'Admin login successful',
      token,
      user: {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        roles: roleNames
      }
    });

  } catch (error) {
    console.error('Admin Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { studentNumber, password } = req.body;

    // Validate input
    if (!studentNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find student by student number
    const student = await student.findOne({studentNumber}).populate('roles')
    if (!student) { return res.status(401).json({ message: 'Invalid credentials' }); }
    

    
    // Check if user is a student
    const isStudent = student.roles.some(role => role.name === 'student');
    if (!isStudent) {
      return res.status(403).json({ message: 'You do not have student privileges' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const roleNames= student.roles.map(role => role.name);
    // Generate JWT
    const token = jwt.sign(
      { id: student._id, studentNumber: student.studentNumber, roles: ['student'] },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.status(200).json({
      message: 'Student login successful',
      token,
      user: {
        _id: student._id,
        studentNumber: student.studentNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        courses: student.courses,
        roles: roleNames
      }
    });

  } catch (error) {
    console.error('Student Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

{  };


// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('roles', 'name permissions');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const createStudent =async(req,res) =>{
  try{
  const {studentNumber,firstName,lastName,email,password,program,role: requestedRole} = req.body;
  const roleDoc = await Role.findOne({ name: requestedRole });
  if (!roleDoc) {
    return res.status(400).json({ message: `Role "${requestedRole}" not found` });
  }
  
    
  const student = new User({
    studentNumber,
    firstName,
    lastName,
    email,
    password,
    program,
    role: [roleDoc._id]


   });
   

   await student.save();
return res.status(201).json({
      message: 'Student created successfully',
      student});

  }catch(error){
    console.error('Student creation error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
 
};


const getAllStudents = async (req, res) => {
    const students = await User.find({ role: 'student' });
    const studentsArray = students.map(student => {
      const { _id, firstName, lastName, email, program, studentNumber } = student;
      return { _id, firstName, lastName, email, program, studentNumber };
    });
    res.json(studentsArray);

  };
  
  /**
   * @desc    Get all admins
   * @route   GET /api/users/admins
   * @access  Private (usually you'd protect this route)
   */
  const getAllAdmins = async (req, res) => {
    const admins = await User.find({ role: 'admin' });
    res.json(admins);
  };
  
  /**
   * @desc    Update a student’s info
   * @route   PUT /api/users/students/:id
   * @access  Private
   */
  const updateStudent = (async (req, res) => {
    const { id } = req.params;
    // e.g. name, email, program, etc. from req.body
    const { firstName, lastName, email, program } = req.body;
  
    // Find and update
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, program },
      { new: true } // return the updated doc
    );
  
    if (!updatedUser) {
      res.status(404);
      throw new Error('Student not found');
    }
  
    // Optional: confirm the role is student
    if (updatedUser.role !== 'student') {
      res.status(400);
      throw new Error('User is not a student');
    }
  
    res.json(updatedUser);
  });
  
  /**
   * @desc    Delete a student
   * @route   DELETE /Users/students/:id
   * @access  Private
   */
  const deleteStudent = (async (req, res) => {
    const { id } = req.params;
    const student = await User.findByIdAndDelete(id);
  
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
  
    res.json({ message: 'Student deleted successfully' });
  });
  
  /**
   * @desc    Delete an admin
   * @route   DELETE /Users/admins/:id
   * @access  Private
   */
  const deleteAdmin = (async (req, res) => {
    const { id } = req.params;
    const admin = await User.findByIdAndDelete(id);
  
    if (!admin) {
      res.status(404);
      throw new Error('Admin not found');
    }
    if (admin.role !== 'admin') {
      res.status(400);
      throw new Error('User is not an admin');
    }
  
    res.json({ message: 'Admin deleted successfully' });
  });
  
  const getStudentCourses = (async (req, res) => {
    const { id } = req.params;
  
    // Populate the `courses` field with course details
    const student = await User.findById(id).populate('courses');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (student.role !== 'student') {
      return res.status(400).json({ message: 'User is not a student' });
    }
  
    // Return the courses array (or entire student if you prefer)
    res.json({
      studentId: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      courses: student.courses,
    });
  });

  const addCourseToStudent = (async (req, res) => {
    const { studentId, courseId } = req.params;
    // ...
    

    // Find the student by ID
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
  
    // Check if the user is a student
    if (student.role !== 'student') {
      return res.status(400).json({ message: 'User is not a student' });
    }
  
    // Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
  
    // Check if the course is already enrolled
    if (student.courses.includes(courseId)) {
      return res.status(400).json({ message: 'Student is already enrolled in this course' });
    }
  
    // Add the course to the student's list of courses
    student.courses.push(courseId);
    await student.save();
  
    res.status(200).json({ message: 'Course added successfully', courses: student.courses });

  });
  const deleteCourseFromStudent = (async (req, res) => {
    const { studentId, courseId } = req.params;
  
    // Find the student by ID
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
  
    // Check if the user is a student
    if (student.role !== 'student') {
      return res.status(400).json({ message: 'User is not a student' });
    }
  
    // Check if the course is enrolled
    if (!student.courses.includes(courseId)) {
      return res.status(400).json({ message: 'Student is not enrolled in this course' });
    }
  
    // Remove the course from the student's list of courses
    student.courses = student.courses.filter(id => id.toString() !== courseId);
    await student.save();
  
    res.status(200).json({ message: 'Course removed successfully', courses: student.courses });
  });
  
  export {
    createStudent,
    loginAdmin, loginStudent,
    registerUser,
    getCurrentUser,
    getAllStudents,
    getAllAdmins,
    updateStudent,
    deleteStudent,
    deleteAdmin,
    getStudentCourses,
    addCourseToStudent,
    deleteCourseFromStudent,
    
  };
