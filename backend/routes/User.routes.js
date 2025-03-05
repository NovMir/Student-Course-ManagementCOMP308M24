import express from 'express';
import { protect } from '../middleware/auth.js';


import {
    registerUser,
    loginUser,
    getAllStudents,
    getAllAdmins,
    updateStudent,
    deleteStudent,
    deleteAdmin,
    getStudentCourses,
    addCourseToStudent,
    deleteCourseFromStudent
  } from '../controller/UserController.js';
  const router = express.Router();
// Register and Login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Students
router.get('/students',protect, getAllStudents);
router.put('/students/:id',protect, updateStudent);
router.delete('/students/:id',protect, deleteStudent);
router.get('/students/:id/courses',protect, getStudentCourses);
router.post('/students/:studentId/courses/:courseId', addCourseToStudent);
router.delete('/students/:studentId/courses/:courseId', deleteCourseFromStudent);

// Admins
router.get('/admins', protect,getAllAdmins);
router.delete('/admins/:id', deleteAdmin);

export default router;
 
