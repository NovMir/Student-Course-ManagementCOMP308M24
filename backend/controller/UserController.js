import express from 'express';
import User from '../model/User.js';
import Course from '../model/Course.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
// @desc    Register a new user
//@route POST /User/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { studentNumber, password, firstName, lastName, email, courses, role } = req.body;
//check if the user exists
  const userExists = await User.findOne({ $or:[{ email }, {studentNumber }]}); 

  if (userExists) return res.status(400).json({message: 'User already exists'});
//crete a new user  
const createUser  = new User({
  studentNumber,
  password,
  firstName,
  lastName,
  email,
  courses: courses || [],
  role: role || 'student',
}); 

//SAVE!!
const user = await createUser.save();
if (user) {
    return res.status(201).json({
        
          _id: user._id,
          studentNumber: user.studentNumber,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          courses: user.courses,
          role: user.role,
        });
      } else {
        res.status(400);
        throw new Error('Invalid user data');
      }
    });
//@desc    Get all users
//@route GET /User
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    // 1) Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    // 2) Compare password using schema method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id,role: user.role }, process.env.JWT_SECRET,);
  
    // 3) If valid, return user data (In real apps, you might generate JWT token here)
    res.json({
      _id: user._id,
      studentNumber: user.studentNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      courses: user.courses,
      role: user.role,
      token: token, 
    });
  });


const getAllStudents = asyncHandler(async (req, res) => {
    const students = await User.find({ role: 'student' });
    res.json(students);
  });
  
  /**
   * @desc    Get all admins
   * @route   GET /api/users/admins
   * @access  Private (usually you'd protect this route)
   */
  const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await User.find({ role: 'admin' });
    res.json(admins);
  });
  
  /**
   * @desc    Update a student’s info
   * @route   PUT /api/users/students/:id
   * @access  Private
   */
  const updateStudent = asyncHandler(async (req, res) => {
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
  const deleteStudent = asyncHandler(async (req, res) => {
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
  const deleteAdmin = asyncHandler(async (req, res) => {
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
  
  const getStudentCourses = asyncHandler(async (req, res) => {
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

  const addCourseToStudent = asyncHandler(async (req, res) => {
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
  const deleteCourseFromStudent = asyncHandler(async (req, res) => {
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
    registerUser,
    getAllStudents,
    getAllAdmins,
    updateStudent,
    deleteStudent,
    deleteAdmin,
    getStudentCourses,
    addCourseToStudent,
    deleteCourseFromStudent,
    loginUser,
  };
