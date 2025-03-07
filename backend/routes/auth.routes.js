// routes/auth.routes.js - Authentication endpoints
import express from 'express';
import { getCurrentUser, loginAdmin,loginStudent, registerUser } from '../controller/UserController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/admin-login',loginAdmin);
router.post('/student-login', loginStudent); 

router.post('/register', protect, authorize('admin'), registerUser);
router.get('/me', protect, getCurrentUser)

export default router;