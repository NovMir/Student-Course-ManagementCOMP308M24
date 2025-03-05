import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} from '../controller/CourseController.js';
import { protect ,adminOnly } from '../middleware/auth.js';

const router = express.Router();



router.get('/Courses', protect, getAllCourses);
router.get('/Courses/:id', protect, getCourseById);


router.post('/Courses', protect, adminOnly, createCourse);
router.put('/Courses/:id', protect, adminOnly, updateCourse);
router.delete('/Courses/:id', protect, adminOnly, deleteCourse);

export default router;