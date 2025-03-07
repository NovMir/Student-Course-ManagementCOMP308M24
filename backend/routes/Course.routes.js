import express from 'express';
import Course from '../model/Course.js';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} from '../controller/CourseController.js';
import { protect ,authorize } from '../middleware/auth.js';

const router = express.Router();

// In routes/courseRoutes.js
router.post('/echo', protect, authorize('admin'), (req, res) => {
  console.log('Echo route hit');
  res.json({ message: 'Echo successful!', data: req.body });
});
// In courseRoutes.js:
router.post('/test-db', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('Test DB endpoint hit');
    
    // Create a test document directly with mongoose
    const testCourse = new Course({
      courseName: 'DB Test Course ' + Date.now()
    });
    
    console.log('About to save test course');
    const saved = await testCourse.save();
    console.log('Test course saved:', saved._id);
    
    return res.json({ 
      message: 'Database test successful!',
      course: saved
    });
  } catch (error) {
    console.error('Test DB error:', error);
    return res.status(500).json({ 
      error: error.message
    });
  }
});

router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Add to your courseRoutes.js
router.get('/test', (req, res) => {
  res.json({ message: 'Course API is working' });
});
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

export default router;