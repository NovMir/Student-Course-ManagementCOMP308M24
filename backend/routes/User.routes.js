import express from 'express';
import { protect , authorize } from '../middleware/auth.js';
import User from '../model/User.js';

import{ getAvailableCourses } from '../controller/CourseController.js'; 
import {
   createStudent,
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


// Students
router.post('/students', protect, authorize('admin'), createStudent);

router.get('/students',protect,authorize('admin'), getAllStudents);
router.put('/students/:id',protect,authorize('student'), updateStudent);
router.delete('/students/:id',protect,authorize('student'), deleteStudent);
router.get('/students/:id/courses',protect, getStudentCourses);
router.post('/students/:studentId/courses/:courseId', protect,addCourseToStudent);
router.delete('/students/:studentId/courses/:courseId', protect,deleteCourseFromStudent);
// Ensure only authenticated students can access available courses
router.get('/available', protect, authorize('student'), getAvailableCourses);

// Admins
router.get('/admins', protect ,authorize('admin'), getAllAdmins);
router.delete('/admins/:id',authorize('admin'), deleteAdmin);

export default router;
 
